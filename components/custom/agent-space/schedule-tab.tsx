"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useAgentConfig } from "@/context/agent-config-context";
import axios from "axios";

interface RoutineItem {
  id: number;
  routineId: string;
  title: string;
  prompt: string;
  frequency: string;
  scheduledTime: string;
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
  const [running, setRunning] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Fetch schedule and logs
  const fetchScheduleData = useCallback(async () => {
    if (!agentId) return;

    try {
      const res = await axios.get(`/api/agent/schedule?agentId=${agentId}`);
      const data = res.data;
      setRoutines(data.routines || []);
      setLogs(data.logs || []);

      // Check if any job is currently running
      const isAnyRunning = (data.logs || []).some(
        (l: ExecutionLogItem) => l.status === "running"
      );
      setRunning(isAnyRunning);
    } catch (err: any) {
      console.error("Failed to load schedule data:", err);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  // Polling while a background job is executing
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      fetchScheduleData();
    }, 2500);

    return () => clearInterval(interval);
  }, [running, fetchScheduleData]);

  // Trigger manual "Run Now"
  const handleRunNow = async (routineId: string) => {
    if (!agentId || running) return;

    setRunning(true);
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

      // Instantly refresh list so the "running" state appears
      await fetchScheduleData();
    } catch (err: any) {
      console.error("Run Now error:", err);
      toast.add({
        title: "Execution Error",
        description: err.response?.data?.error || "Could not trigger routine.",
        type: "error",
      });
      setRunning(false);
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

  const primaryRoutine = routines[0];

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
      {/* Primary Routine Card */}
      {primaryRoutine ? (
        <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground">
                {primaryRoutine.title}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="size-3 text-primary" />
                <span>{primaryRoutine.scheduledTime}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleActive(primaryRoutine)}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
                primaryRoutine.isActive
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
              }`}
            >
              {primaryRoutine.isActive ? "Active" : "Paused"}
            </button>
          </div>

          <div className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/40 leading-relaxed font-mono">
            {primaryRoutine.prompt}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-muted-foreground">
              Last run:{" "}
              <strong className="text-foreground">
                {primaryRoutine.lastRunAt
                  ? new Date(primaryRoutine.lastRunAt).toLocaleTimeString([], {
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
              variant="outline"
              className="h-7 text-xs gap-1.5 px-3 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-transparent shadow-xs transition-all disabled:opacity-70"
              onClick={() => handleRunNow(primaryRoutine.routineId)}
              disabled={running}
            >
              {running ? (
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
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-border/80 text-center space-y-2">
          <Calendar className="size-6 text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground">No routine found for this agent.</p>
        </div>
      )}

      {/* Execution Audit Logs */}
      <div className="space-y-2.5">
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
            variant="ghost"
            size="sm"
            className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground gap-1"
            onClick={fetchScheduleData}
            title="Refresh Execution Logs"
          >
            <RefreshCw className={`size-3 ${running ? "animate-spin text-primary" : ""}`} />
            <span className="text-[10px]">Refresh</span>
          </Button>
        </div>

        {logs.length === 0 ? (
          <div className="p-4 rounded-lg bg-muted/20 border border-border/40 text-center space-y-1">
            <p className="text-xs text-muted-foreground">No execution logs yet.</p>
            <p className="text-[11px] text-muted-foreground/80">
              Click &quot;Run Now&quot; above to trigger your first background routine.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.executionId;

              return (
                <div
                  key={log.executionId}
                  className="rounded-xl bg-card border border-border/60 overflow-hidden shadow-2xs transition-all"
                >
                  <div
                    onClick={() =>
                      setExpandedLogId(isExpanded ? null : log.executionId)
                    }
                    className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-muted/30 transition-colors gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {log.status === "completed" ? (
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      ) : log.status === "running" ? (
                        <Loader2 className="size-3.5 text-blue-500 animate-spin shrink-0" />
                      ) : (
                        <AlertCircle className="size-3.5 text-red-500 shrink-0" />
                      )}

                      <span className="font-medium text-foreground truncate">
                        Run #{log.executionId.replace("exec_", "").slice(-6)}
                      </span>

                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                          log.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : log.status === "running"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
                      <span>
                        {new Date(log.startedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {log.resultSummary && (
                        isExpanded ? (
                          <ChevronUp className="size-3 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-3 text-muted-foreground" />
                        )
                      )}
                    </div>
                  </div>

                  {/* Expandable Execution Summary */}
                  {isExpanded && (
                    <div className="border-t border-border/40 p-3 bg-muted/20 space-y-2 text-xs">
                      {log.resultSummary ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                            <FileText className="size-3 text-primary" />
                            <span>Executive Summary:</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-background border border-border/50 text-[11px] leading-relaxed whitespace-pre-wrap font-sans text-muted-foreground">
                            {log.resultSummary}
                          </div>
                        </div>
                      ) : log.error ? (
                        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-[11px]">
                          <strong>Error:</strong> {log.error}
                        </div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground italic">
                          Job is currently in progress...
                        </div>
                      )}

                      <div className="text-[10px] text-muted-foreground flex justify-between pt-1">
                        <span>Started: {new Date(log.startedAt).toLocaleString()}</span>
                        {log.completedAt && (
                          <span>Completed: {new Date(log.completedAt).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
