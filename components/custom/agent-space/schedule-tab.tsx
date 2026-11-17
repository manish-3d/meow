"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Repeat,
  Zap,
  Globe,
  X,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { useAgentConfig } from "@/context/agent-config-context";
import { TimezoneContinentSelect } from "./timezone-select";
import axios from "axios";

interface RoutineItem {
  id: number;
  routineId: string;
  agentId: string;
  title: string;
  prompt: string;
  frequency: string;
  scheduledTime: string;
  timezone: string;
  runType: "recurring" | "once";
  maxRuns: number | null;
  currentRunCount: number;
  daysOfWeek: string | null;
  targetDate: string | null;
  isActive: boolean;
  lastRunAt: string | null;
  createdAt: string;
}

interface ExecutionLogItem {
  id: number;
  executionId: string;
  routineId: string;
  status: "running" | "completed" | "failed";
  resultSummary: string | null;
  error: string | null;
  startedAt: string;
  completedAt: string | null;
}

export function ScheduleTab() {
  const { agentConfig } = useAgentConfig();
  const agentId = agentConfig?.agentId;

  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [logs, setLogs] = useState<ExecutionLogItem[]>([]);
  const [runningRoutineId, setRunningRoutineId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Modal State for Create / Edit Routine
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [savingRoutine, setSavingRoutine] = useState(false);

  // Form Fields for Modal
  const [formTitle, setFormTitle] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [formRunType, setFormRunType] = useState<"recurring" | "once">("recurring");
  const [formFrequency, setFormFrequency] = useState("daily");
  const [formScheduledTime, setFormScheduledTime] = useState("08:00 AM UTC");
  const [formTimezone, setFormTimezone] = useState(
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"
  );
  const [formMaxRuns, setFormMaxRuns] = useState<number | null>(null);
  const [formDaysOfWeek, setFormDaysOfWeek] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [formTargetDate, setFormTargetDate] = useState("today");
  const [formIsActive, setFormIsActive] = useState(true);

  const daysList = [
    { label: "Mon", value: "mon" },
    { label: "Tue", value: "tue" },
    { label: "Wed", value: "wed" },
    { label: "Thu", value: "thu" },
    { label: "Fri", value: "fri" },
    { label: "Sat", value: "sat" },
    { label: "Sun", value: "sun" },
  ];

  const toggleDay = (day: string) => {
    setFormDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Fetch schedule and logs
  const fetchScheduleData = useCallback(async (silent = false) => {
    if (!agentId) return;

    try {
      if (!silent) setLoading(true);
      const res = await axios.get(`/api/agent/schedule?agentId=${agentId}`);
      const data = res.data;
      setRoutines(data.routines || []);
      setLogs(data.logs || []);

      // Check if any job is currently running
      const runningLog = (data.logs || []).find(
        (l: ExecutionLogItem) => l.status === "running"
      );
      setRunningRoutineId(runningLog ? runningLog.routineId : null);
    } catch (err: any) {
      console.error("Failed to load schedule data:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  // Polling while a background job is executing
  useEffect(() => {
    if (!runningRoutineId) return;

    const interval = setInterval(() => {
      fetchScheduleData(true);
    }, 2500);

    return () => clearInterval(interval);
  }, [runningRoutineId, fetchScheduleData]);

  // Open modal for Creating a new routine
  const handleOpenCreateModal = () => {
    setEditingRoutineId(null);
    setFormTitle("");
    setFormPrompt("");
    setFormRunType("recurring");
    setFormFrequency("daily");
    setFormScheduledTime("08:00 AM UTC");
    setFormTimezone(
      typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"
    );
    setFormMaxRuns(null);
    setFormDaysOfWeek(["mon", "tue", "wed", "thu", "fri"]);
    setFormTargetDate("today");
    setFormIsActive(true);
    setModalOpen(true);
  };

  // Open modal for Editing an existing routine
  const handleOpenEditModal = (routine: RoutineItem) => {
    setEditingRoutineId(routine.routineId);
    setFormTitle(routine.title);
    setFormPrompt(routine.prompt);
    setFormRunType(routine.runType || (routine.frequency === "once" ? "once" : "recurring"));
    setFormFrequency(routine.frequency || "daily");
    setFormScheduledTime(routine.scheduledTime || "08:00 AM UTC");
    setFormTimezone(routine.timezone || "UTC");
    setFormMaxRuns(routine.maxRuns);
    setFormDaysOfWeek(
      routine.daysOfWeek ? routine.daysOfWeek.split(",") : ["mon", "tue", "wed", "thu", "fri"]
    );
    setFormTargetDate(routine.targetDate || "today");
    setFormIsActive(routine.isActive);
    setModalOpen(true);
  };

  // Save (Create or Update) Routine
  const handleSaveRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId || savingRoutine) return;

    if (!formTitle.trim()) {
      toast.add({ title: "Validation Error", description: "Routine title is required.", type: "error" });
      return;
    }
    if (!formPrompt.trim()) {
      toast.add({ title: "Validation Error", description: "Prompt instructions are required.", type: "error" });
      return;
    }

    setSavingRoutine(true);
    try {
      const routineId = editingRoutineId || `routine_${Date.now()}`;
      await axios.post("/api/agent/schedule", {
        routineId,
        agentId,
        title: formTitle.trim(),
        prompt: formPrompt.trim(),
        frequency: formRunType === "once" ? "once" : formFrequency,
        scheduledTime: formScheduledTime.trim(),
        timezone: formTimezone.trim(),
        runType: formRunType,
        maxRuns: formRunType === "once" ? 1 : formMaxRuns,
        daysOfWeek: formFrequency === "weekly" ? formDaysOfWeek.join(",") : null,
        targetDate: formRunType === "once" ? formTargetDate : null,
        isActive: formIsActive,
      });

      toast.add({
        title: editingRoutineId ? "Routine Updated" : "Routine Created",
        description: `"${formTitle}" is now configured.`,
        type: "success",
      });

      setModalOpen(false);
      await fetchScheduleData(true);
    } catch (err: any) {
      toast.add({
        title: "Save Failed",
        description: err?.response?.data?.error || err?.message || "Could not save routine",
        type: "error",
      });
    } finally {
      setSavingRoutine(false);
    }
  };

  // Delete Routine
  const handleDeleteRoutine = async (routineId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await axios.delete(`/api/agent/schedule?routineId=${routineId}`);
      toast.add({
        title: "Routine Deleted",
        description: `"${title}" was removed.`,
        type: "info",
      });
      setRoutines((prev) => prev.filter((r) => r.routineId !== routineId));
    } catch (err: any) {
      toast.add({
        title: "Deletion Failed",
        description: err?.response?.data?.error || "Could not delete routine",
        type: "error",
      });
    }
  };

  // Trigger manual "Run Now"
  const handleRunNow = async (routineId: string) => {
    if (!agentId || runningRoutineId) return;

    setRunningRoutineId(routineId);
    try {
      const res = await axios.post("/api/agent/schedule/run-now", {
        routineId,
        agentId,
      });

      toast.add({
        title: "Routine Triggered",
        description: res.data?.inngestDispatched
          ? "Enqueued via Inngest durable engine."
          : "Executing background routine with active tools...",
        type: "success",
      });

      await fetchScheduleData(true);
    } catch (err: any) {
      console.error("Run Now error:", err);
      toast.add({
        title: "Execution Error",
        description: err.response?.data?.error || "Could not trigger routine.",
        type: "error",
      });
      setRunningRoutineId(null);
    }
  };

  // Toggle active status
  const handleToggleActive = async (routine: RoutineItem) => {
    try {
      const updatedStatus = !routine.isActive;
      await axios.post("/api/agent/schedule", {
        routineId: routine.routineId,
        isActive: updatedStatus,
      });

      setRoutines((prev) =>
        prev.map((r) =>
          r.routineId === routine.routineId
            ? { ...r, isActive: updatedStatus }
            : r
        )
      );

      toast.add({
        title: updatedStatus ? "Routine Activated" : "Routine Paused",
        description: `"${routine.title}" is now ${updatedStatus ? "active" : "paused"}.`,
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Error",
        description: "Failed to update routine status.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span className="text-xs">Loading scheduled routines...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">
            Scheduled Routines
          </span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
            {routines.length} {routines.length === 1 ? "routine" : "routines"}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fetchScheduleData()}
            className="size-7 p-0 text-muted-foreground hover:text-foreground"
            title="Refresh list"
          >
            <RefreshCw className="size-3.5" />
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreateModal}
            className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-2.5"
          >
            <Plus className="size-3.5" />
            <span>New Routine</span>
          </Button>
        </div>
      </div>

      {/* Routine Cards List (Supports Multiple Routines) */}
      {routines.length > 0 ? (
        <div className="space-y-3">
          {routines.map((routine) => {
            const isThisRunning = runningRoutineId === routine.routineId;

            return (
              <div
                key={routine.routineId}
                className="p-3.5 rounded-xl border border-border-subtle bg-surface-1 space-y-3 shadow-xs hover:border-foreground/20 transition-all"
              >
                {/* Top Row: Title, Status Badge & Toggle */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground tracking-tight">
                        {routine.title}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(routine)}
                        className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-medium px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
                          routine.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 hover:bg-emerald-500/20"
                            : "bg-surface-2 text-muted-foreground border border-border-subtle hover:bg-surface-3"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            routine.isActive ? "bg-emerald-500" : "bg-muted-foreground"
                          }`}
                        />
                        <span>{routine.isActive ? "Active" : "Paused"}</span>
                      </button>
                    </div>

                    {/* Schedule Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground pt-0.5 font-mono tabular-nums">
                      <span className="inline-flex items-center gap-1 bg-surface-2 px-2 py-0.5 rounded border border-border-subtle font-medium text-foreground">
                        {routine.runType === "once" ? (
                          <Zap className="size-3 text-amber-500" />
                        ) : (
                          <Repeat className="size-3 text-foreground" />
                        )}
                        <span className="capitalize font-sans">
                          {routine.runType === "once" ? "Run Once" : routine.frequency}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1 bg-surface-2 px-2 py-0.5 rounded border border-border-subtle">
                        <Clock className="size-2.5 text-muted-foreground" />
                        <span>{routine.scheduledTime}</span>
                      </span>

                      {routine.timezone && (
                        <span className="inline-flex items-center gap-1 bg-surface-2 px-1.5 py-0.5 rounded border border-border-subtle text-[9px]">
                          <Globe className="size-2.5 text-muted-foreground" />
                          <span>{routine.timezone}</span>
                        </span>
                      )}

                      {/* Repetition Count Progress */}
                      <span className="inline-flex items-center text-[9px] py-0.5 px-1.5 rounded bg-surface-2 border border-border-subtle text-muted-foreground">
                        {routine.runType === "once" || routine.maxRuns === 1
                          ? routine.currentRunCount >= 1
                            ? "✓ Executed (1/1)"
                            : "⚡ 1-Time"
                          : routine.maxRuns
                          ? `🔁 ${routine.currentRunCount}/${routine.maxRuns} runs`
                          : `♾️ ${routine.currentRunCount} runs completed`}
                      </span>
                    </div>
                  </div>

                  {/* Edit & Delete Action Icons */}
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditModal(routine)}
                      className="size-6 p-0 text-muted-foreground hover:text-foreground hover:bg-surface-2"
                      title="Edit Routine"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteRoutine(routine.routineId, routine.title)}
                      className="size-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete Routine"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>

                {/* Prompt / Instruction Box */}
                <div className="text-[11px] text-foreground/80 bg-surface-2/60 p-2.5 rounded-lg border border-border-subtle leading-relaxed font-mono line-clamp-3">
                  {routine.prompt}
                </div>

                {/* Footer: Last Run & Run Now Button */}
                <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
                  <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                    Last run:{" "}
                    <strong className="text-foreground font-medium">
                      {routine.lastRunAt
                        ? new Date(routine.lastRunAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            month: "short",
                            day: "numeric",
                          })
                        : "Never executed"}
                    </strong>
                  </span>

                  <Button
                    size="sm"
                    className="h-7 min-w-[125px] text-xs gap-1.5 px-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-xs transition-all active:scale-[0.98] disabled:opacity-70"
                    onClick={() => handleRunNow(routine.routineId)}
                    disabled={Boolean(runningRoutineId)}
                  >
                    {isThisRunning ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        <span>Running Inngest...</span>
                      </>
                    ) : (
                      <>
                        <Play className="size-3 fill-current" />
                        <span>Run Now</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-dashed border-border/80 text-center space-y-3 bg-muted/20">
          <Calendar className="size-8 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-foreground">No scheduled routines yet</h5>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              Create an automated routine or ask your agent in chat to schedule tasks like morning email summaries or web alerts.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleOpenCreateModal}
            className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground font-medium"
          >
            <Plus className="size-3.5" />
            Create First Routine
          </Button>
        </div>
      )}

      {/* Execution Audit Logs */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <span>Execution History</span>
            {logs.length > 0 && (
              <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded-full font-normal">
                {logs.length}
              </span>
            )}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fetchScheduleData(true)}
            className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground gap-1"
          >
            <RefreshCw className="size-2.5" />
            <span>Refresh</span>
          </Button>
        </div>

        {logs.length > 0 ? (
          <div className="space-y-1.5">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.executionId;

              return (
                <div
                  key={log.executionId}
                  className="rounded-lg border border-border-subtle bg-surface-1 overflow-hidden text-xs transition-colors hover:border-foreground/20 shadow-2xs"
                >
                  <div
                    onClick={() =>
                      setExpandedLogId(isExpanded ? null : log.executionId)
                    }
                    className="p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-surface-2/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      {log.status === "completed" ? (
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      ) : log.status === "failed" ? (
                        <AlertCircle className="size-3.5 text-destructive shrink-0" />
                      ) : (
                        <Loader2 className="size-3.5 text-primary animate-spin shrink-0" />
                      )}

                      <div className="flex items-center gap-2 font-mono tabular-nums text-[11px]">
                        <span className="font-semibold text-foreground">
                          Run #{log.executionId.slice(-6)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.2 rounded-full border ${
                            log.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                              : log.status === "failed"
                              ? "bg-destructive/10 text-destructive border border-destructive/25"
                              : "bg-primary/10 text-primary border border-primary/25"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              log.status === "completed"
                                ? "bg-emerald-500"
                                : log.status === "failed"
                                ? "bg-destructive"
                                : "bg-primary animate-pulse"
                            }`}
                          />
                          {log.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono tabular-nums">
                      <span>
                        {new Date(log.startedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-3 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Telemetry Details with Motion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className="p-3 border-t border-border-subtle bg-surface-2/40 space-y-2 text-[11px] leading-relaxed overflow-hidden"
                      >
                        {log.resultSummary && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                              <FileText className="size-2.5 text-primary" />
                              Output Summary:
                            </span>
                            <p className="text-foreground whitespace-pre-wrap bg-surface-1 p-2 rounded border border-border-subtle font-mono text-[11px]">
                              {log.resultSummary}
                            </p>
                          </div>
                        )}

                        {log.error && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-semibold text-destructive uppercase flex items-center gap-1">
                              <AlertCircle className="size-2.5" />
                              Error Diagnostic:
                            </span>
                            <p className="text-destructive font-mono text-[10px] bg-destructive/10 p-2 rounded border border-destructive/20 whitespace-pre-wrap">
                              {log.error}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono tabular-nums pt-1 border-t border-border-subtle">
                          <span>Started: {new Date(log.startedAt).toLocaleString()}</span>
                          {log.completedAt && (
                            <span>
                              Completed: {new Date(log.completedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-lg border border-dashed border-border/60 text-center space-y-1 bg-muted/10">
            <p className="text-xs text-muted-foreground">No executions recorded yet.</p>
            <p className="text-[10px] text-muted-foreground">
              Click &quot;Run Now&quot; above to trigger your first background routine.
            </p>
          </div>
        )}
      </div>

      {/* Routine Creator / Editor Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <Settings2 className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  {editingRoutineId ? "Edit Routine Details" : "Create New Automated Routine"}
                </h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                className="size-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveRoutine} className="space-y-3.5">
              {/* Title */}
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  Routine Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Daily Briefing to Manish"
                />
              </div>

              {/* Prompt / Instruction */}
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  Agent Objective & Instructions
                </label>
                <textarea
                  required
                  rows={3}
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="e.g. Fetch unread emails, check Google News for AI trends, and send a summary email..."
                />
              </div>

              {/* Execution Type: Once vs Recurring */}
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1.5">
                  Execution Schedule Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormRunType("once");
                      setFormFrequency("once");
                      setFormMaxRuns(1);
                    }}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-all ${
                      formRunType === "once"
                        ? "bg-primary/10 border-primary text-primary font-semibold"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Zap className="size-3.5 text-amber-500" />
                    <span>Run Once (One-Time)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormRunType("recurring");
                      setFormFrequency("daily");
                      setFormMaxRuns(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-all ${
                      formRunType === "recurring"
                        ? "bg-primary/10 border-primary text-primary font-semibold"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Repeat className="size-3.5 text-primary" />
                    <span>Recurring Schedule</span>
                  </button>
                </div>
              </div>

              {/* If Recurring: Frequency Options */}
              {formRunType === "recurring" && (
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-foreground block">
                    Frequency
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "hourly", label: "Hourly" },
                      { id: "daily", label: "Daily" },
                      { id: "weekly", label: "Weekly" },
                      { id: "monthly", label: "Monthly" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormFrequency(item.id)}
                        className={`py-1.5 text-xs rounded border font-medium text-center transition-all ${
                          formFrequency === item.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Weekly Days of Week */}
                  {formFrequency === "weekly" && (
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] text-muted-foreground">
                        Active Days:
                      </span>
                      <div className="flex gap-1">
                        {daysList.map((day) => {
                          const isSel = formDaysOfWeek.includes(day.value);
                          return (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => toggleDay(day.value)}
                              className={`size-7 text-[10px] font-semibold rounded-md border transition-all ${
                                isSel
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background border-border text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Repetitions (How Many Times) */}
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  Repetitions (How Many Times to Run)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "1 Time Only", val: 1 },
                    { label: "3 Times", val: 3 },
                    { label: "5 Times", val: 5 },
                    { label: "10 Times", val: 10 },
                    { label: "Unlimited (♾️)", val: null },
                  ].map((opt) => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() => {
                        setFormMaxRuns(opt.val);
                        if (opt.val === 1) setFormRunType("once");
                        else setFormRunType("recurring");
                      }}
                      className={`px-2.5 py-1 text-[11px] rounded-md border font-medium transition-all ${
                        formMaxRuns === opt.val
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduled Time */}
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  Scheduled Time
                </label>
                <input
                  type="text"
                  required
                  value={formScheduledTime}
                  onChange={(e) => setFormScheduledTime(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. 09:00 PM or 08:00 AM"
                />
              </div>

              {/* Timezone: Continent & Region Selector */}
              <TimezoneContinentSelect
                value={formTimezone}
                onChange={setFormTimezone}
                label="Continent & Region Timezone"
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingRoutine}
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  {savingRoutine ? (
                    <>
                      <Loader2 className="size-3 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : editingRoutineId ? (
                    "Update Routine"
                  ) : (
                    "Create Routine"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
