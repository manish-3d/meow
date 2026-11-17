"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Loader2,
  Settings2,
  RotateCcw,
  Repeat,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoutineSchemaType } from "@/lib/ai/agent_response_schema";
import { TimezoneContinentSelect } from "./timezone-select";
import axios from "axios";

interface RoutineCardProps {
  routine: RoutineSchemaType;
  agentId: string;
  onRoutineCreated?: () => void;
}

export function RoutineCard({ routine, agentId, onRoutineCreated }: RoutineCardProps) {
  const [connectedSet, setConnectedSet] = useState<Set<string>>(new Set());
  const [loadingTools, setLoadingTools] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customization state
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Auto-detect if user prompt implied one-time (e.g. "in 9 pm today" or "once")
  const defaultIsOnce =
    routine.frequency === "once" ||
    routine.name?.toLowerCase().includes("today") ||
    routine.goal?.toLowerCase().includes("today") ||
    routine.instruction?.toLowerCase().includes("today");

  const [title, setTitle] = useState(routine.name || "Automated Routine");
  const [prompt, setPrompt] = useState(routine.instruction || routine.goal || "");
  const [runType, setRunType] = useState<"recurring" | "once">(defaultIsOnce ? "once" : "recurring");
  const [frequency, setFrequency] = useState<string>(defaultIsOnce ? "once" : routine.frequency || "daily");
  const [scheduledTime, setScheduledTime] = useState(routine.scheduledTime || "08:00 AM UTC");
  const [timezone, setTimezone] = useState(
    routine.timezone || (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC")
  );
  const [maxRuns, setMaxRuns] = useState<number | null>(defaultIsOnce ? 1 : null);
  const [selectedDays, setSelectedDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [targetDate, setTargetDate] = useState("today");

  // Fetch live connected tools from /api/tools
  useEffect(() => {
    let mounted = true;
    const fetchConnected = async () => {
      try {
        const res = await axios.get("/api/tools");
        if (mounted && Array.isArray(res.data)) {
          const activeSlugs = new Set<string>(
            res.data
              .filter((item: any) => item.connected)
              .map((item: any) => String(item.slug).toUpperCase())
          );
          setConnectedSet(activeSlugs);
        }
      } catch (e) {
        console.warn("Could not fetch tool statuses:", e);
      } finally {
        if (mounted) setLoadingTools(false);
      }
    };
    fetchConnected();
    return () => {
      mounted = false;
    };
  }, []);

  // Check required tools
  const requiredTools = routine.tools || [];
  const toolStatuses = requiredTools.map((slug) => {
    const isConn = connectedSet.has(slug.toUpperCase());
    return {
      slug: slug.toUpperCase(),
      name: slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase(),
      isConnected: isConn,
    };
  });

  const allToolsConnected = toolStatuses.every((t) => t.isConnected);

  // Days of week helper
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
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreateRoutine = async () => {
    if (isCreating || created) return;
    setIsCreating(true);
    setError(null);

    try {
      const routineId = `routine_${Date.now()}`;
      const res = await fetch("/api/agent/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routineId,
          agentId,
          title: title.trim() || routine.name,
          prompt: prompt.trim() || routine.instruction || routine.goal,
          frequency: runType === "once" ? "once" : frequency,
          scheduledTime: scheduledTime.trim(),
          timezone: timezone.trim(),
          runType,
          maxRuns: runType === "once" ? 1 : maxRuns,
          daysOfWeek: frequency === "weekly" ? selectedDays.join(",") : null,
          targetDate: runType === "once" ? targetDate : null,
          isActive: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create routine");
      }

      setCreated(true);
      setIsCustomizing(false);
      onRoutineCreated?.();
    } catch (err: any) {
      setError(err?.message || "Failed to save routine");
    } finally {
      setIsCreating(false);
    }
  };

  const handleConnectTool = async (slug: string) => {
    try {
      const res = await axios.post("/api/tools/connect", { toolSlug: slug });
      if (res.data?.redirectUrl) {
        window.open(res.data.redirectUrl, "_blank");
      }
    } catch (err: any) {
      console.error("Connect error:", err);
    }
  };

  return (
    <div className="my-2 rounded-xl border border-primary/25 bg-card/95 p-4 text-card-foreground shadow-sm transition-all hover:border-primary/40 space-y-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="size-3" />
            </span>
            <h4 className="text-xs font-semibold text-foreground tracking-tight">
              {title}
            </h4>
          </div>
          {!isCustomizing && prompt && (
            <p className="text-[11px] text-muted-foreground leading-relaxed pl-7 line-clamp-2">
              {prompt}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-mono tracking-wider bg-primary/5 text-primary border-primary/20"
          >
            {created ? "Active Routine" : "Routine Draft"}
          </Badge>

          {!created && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsCustomizing((prev) => !prev)}
              className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
            >
              <Settings2 className="size-3" />
              <span>{isCustomizing ? "Close" : "Customize"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mode 1: Quick Summary Badges (Default View) */}
      {!isCustomizing && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/40 p-2.5 text-[11px] border border-border/40">
          <div className="flex items-center gap-1.5 text-foreground font-medium">
            {runType === "once" ? (
              <Zap className="size-3.5 text-amber-500" />
            ) : (
              <Repeat className="size-3.5 text-primary" />
            )}
            <span className="capitalize">
              {runType === "once" ? "Run Once" : `${frequency}`}
            </span>
          </div>

          <span className="text-muted-foreground">•</span>

          <div className="flex items-center gap-1.5 text-foreground font-medium">
            <Clock className="size-3.5 text-primary" />
            <span>{scheduledTime}</span>
          </div>

          {timezone && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground font-mono text-[10px] flex items-center gap-1">
                <Globe className="size-2.5" />
                {timezone}
              </span>
            </>
          )}

          <span className="text-muted-foreground">•</span>

          <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
            {runType === "once" || maxRuns === 1
              ? "⚡ 1 Time Only"
              : maxRuns
                ? `🔁 ${maxRuns} Times`
                : "♾️ Ongoing"}
          </Badge>
        </div>
      )}

      {/* Mode 2: Interactive Customization Editor */}
      {isCustomizing && !created && (
        <div className="space-y-3 p-3 rounded-lg bg-muted/30 border border-primary/20 animate-in fade-in-50 duration-150">
          <div className="text-[11px] font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
            <Settings2 className="size-3.5 text-primary" />
            <span>Fine-Tune Schedule & Repetitions</span>
          </div>

          {/* Title & Prompt Inputs */}
          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                Routine Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                placeholder="e.g. Send Greeting to Manish"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                Instructions for Agent
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                placeholder="What exactly should the agent execute..."
              />
            </div>
          </div>

          {/* Execution Mode (One-Time vs Recurring) */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
              Execution Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRunType("once");
                  setFrequency("once");
                  setMaxRuns(1);
                }}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-all ${runType === "once"
                  ? "bg-primary/10 border-primary text-primary font-semibold"
                  : "bg-background border-border text-muted-foreground hover:bg-muted"
                  }`}
              >
                <Zap className="size-3.5" />
                <span>Run Once (One-Time)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRunType("recurring");
                  setFrequency("daily");
                  setMaxRuns(null);
                }}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-all ${runType === "recurring"
                  ? "bg-primary/10 border-primary text-primary font-semibold"
                  : "bg-background border-border text-muted-foreground hover:bg-muted"
                  }`}
              >
                <Repeat className="size-3.5" />
                <span>Recurring Automation</span>
              </button>
            </div>
          </div>

          {/* Recurring Frequency Selector */}
          {runType === "recurring" && (
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
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
                    onClick={() => setFrequency(item.id)}
                    className={`py-1 text-[11px] rounded border font-medium text-center transition-all ${frequency === item.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Weekly Days of Week Picker */}
              {frequency === "weekly" && (
                <div className="pt-1">
                  <label className="text-[10px] text-muted-foreground block mb-1">
                    Select Days of Week:
                  </label>
                  <div className="flex gap-1">
                    {daysList.map((day) => {
                      const isSel = selectedDays.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`size-7 text-[10px] font-semibold rounded-md border transition-all ${isSel
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

          {/* Repetition Count ("How Many Times") */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
              Repetitions (How Many Times to Run)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "1 Time", val: 1 },
                { label: "3 Times", val: 3 },
                { label: "5 Times", val: 5 },
                { label: "10 Times", val: 10 },
                { label: "Unlimited (♾️)", val: null },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => {
                    setMaxRuns(opt.val);
                    if (opt.val === 1) setRunType("once");
                    else setRunType("recurring");
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded-md border font-medium transition-all ${maxRuns === opt.val
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Execution Time */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
              Execution Time
            </label>
            <input
              type="text"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
              placeholder="e.g. 09:00 PM or 08:00 AM"
            />
          </div>

          {/* Continent & Region Timezone Selector */}
          <TimezoneContinentSelect
            value={timezone}
            onChange={setTimezone}
            label="Continent & Timezone"
          />
        </div>
      )}

      {/* Required Toolkits & OAuth Status */}
      {requiredTools.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Required Tools:
          </span>
          <div className="flex flex-wrap gap-2">
            {toolStatuses.map((t) => (
              <div
                key={t.slug}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border transition-colors ${t.isConnected
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  }`}
              >
                {t.isConnected ? (
                  <CheckCircle2 className="size-3 shrink-0" />
                ) : (
                  <AlertCircle className="size-3 shrink-0" />
                )}
                <span className="font-medium">{t.name}</span>
                <span className="text-[9px] opacity-80">
                  {t.isConnected ? "Connected" : "Connection Required"}
                </span>
                {!t.isConnected && (
                  <button
                    type="button"
                    onClick={() => handleConnectTool(t.slug)}
                    className="ml-1 text-[9px] underline font-semibold text-amber-700 dark:text-amber-300 hover:text-foreground inline-flex items-center gap-0.5"
                  >
                    + Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message if Creation Failed */}
      {error && (
        <p className="text-[11px] text-destructive bg-destructive/10 p-2 rounded-md">
          {error}
        </p>
      )}

      {/* Footer Action Button */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <span className="text-[10px] text-muted-foreground">
          {created
            ? "Saved to scheduled routines"
            : !allToolsConnected
              ? "Note: Connect missing tools before running."
              : runType === "once"
                ? "Executes once at specified time via Inngest"
                : "Executes in background via Inngest scheduler"}
        </span>

        {created ? (
          <Button size="sm" disabled className="h-7 text-xs gap-1.5 bg-emerald-600 text-white hover:bg-emerald-600">
            <CheckCircle2 className="size-3.5" />
            Routine Active
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleCreateRoutine}
            disabled={isCreating}
            className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {isCreating ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Plus className="size-3.5" />
                {isCustomizing ? "Save & Create Routine" : "Create Routine"}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
