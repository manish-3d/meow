"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, Plus, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoutineSchemaType } from "@/lib/ai/agent_response_schema";
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

  // Check which required tools are connected
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
          title: routine.name,
          prompt: routine.instruction || routine.goal,
          frequency: routine.frequency || "daily",
          scheduledTime: routine.scheduledTime || "08:00 AM UTC",
          timezone: routine.timezone || "UTC",
          isActive: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create routine");
      }

      setCreated(true);
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="size-3" />
            </span>
            <h4 className="text-xs font-semibold text-foreground tracking-tight">
              {routine.name}
            </h4>
          </div>
          {routine.goal && (
            <p className="text-[11px] text-muted-foreground leading-relaxed pl-7">
              {routine.goal}
            </p>
          )}
        </div>

        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider shrink-0 bg-primary/5 text-primary border-primary/20">
          Routine Draft
        </Badge>
      </div>

      {/* Schedule Meta (Frequency + Time) */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/40 p-2.5 text-[11px] border border-border/40">
        <div className="flex items-center gap-1.5 text-foreground font-medium">
          <Calendar className="size-3.5 text-primary" />
          <span className="capitalize">{routine.frequency || "Daily"}</span>
        </div>
        <span className="text-muted-foreground">•</span>
        <div className="flex items-center gap-1.5 text-foreground font-medium">
          <Clock className="size-3.5 text-primary" />
          <span>{routine.scheduledTime || "08:00 AM UTC"}</span>
        </div>
        {routine.timezone && routine.timezone !== "UTC" && (
          <>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-mono text-[10px]">{routine.timezone}</span>
          </>
        )}
      </div>

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
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border transition-colors ${
                  t.isConnected
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
            ? "Note: Connect missing tools in the Tools tab before running."
            : "Executes in background via Inngest scheduler"}
        </span>

        {created ? (
          <Button size="sm" disabled className="h-7 text-xs gap-1.5 bg-emerald-600 text-white hover:bg-emerald-600">
            <CheckCircle2 className="size-3.5" />
            Routine Scheduled
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
                Create Routine
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
