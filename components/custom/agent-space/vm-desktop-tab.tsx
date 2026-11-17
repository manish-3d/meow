"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Monitor,
  Globe,
  Power,
  Play,
  RefreshCw,
  ExternalLink,
  Maximize2,
  Minimize2,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { useAgentConfig } from "@/context/agent-config-context";
import axios from "axios";

export function VmDesktopTab() {
  const { agentConfig } = useAgentConfig();
  const agentId = agentConfig?.agentId;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [vmStatus, setVmStatus] = useState<"active" | "paused" | "inactive">("inactive");
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("https://news.google.com");
  const [autoPauseSeconds, setAutoPauseSeconds] = useState(120);

  // 1. Fetch live VM status
  const fetchStatus = useCallback(async (silent = false) => {
    if (!agentId || agentId === "default") return;
    try {
      if (!silent) setLoading(true);
      const res = await axios.get(`/api/agent/vm/status?agentId=${agentId}`);
      setVmStatus(res.data.status);
      setStreamUrl(res.data.streamUrl);
      setIsConfigured(res.data.isConfigured);
    } catch (err: any) {
      console.warn("Could not fetch VM status:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 2. Countdown timer for 2-minute auto-pause
  useEffect(() => {
    if (vmStatus !== "active") return;
    const interval = setInterval(() => {
      setAutoPauseSeconds((prev) => {
        if (prev <= 1) {
          setVmStatus("paused");
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [vmStatus]);

  // 3. Start / Resume Sandbox
  const handleStartVM = async () => {
    if (!agentId || actionLoading) return;
    setActionLoading(true);

    try {
      const res = await axios.post("/api/agent/vm/start", { agentId });
      setVmStatus("active");
      setStreamUrl(res.data.streamUrl);
      setAutoPauseSeconds(120);
      toast.add({
        title: "Cloud Desktop Activated",
        description: "Your agent's E2B Linux VM desktop is now running.",
        type: "success",
      });
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.message || "Failed to start VM";
      toast.add({
        title: "VM Activation Failed",
        description: errMsg,
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Pause Sandbox
  const handlePauseVM = async () => {
    if (!agentId || actionLoading) return;
    setActionLoading(true);

    try {
      await axios.post("/api/agent/vm/pause", { agentId });
      setVmStatus("paused");
      setStreamUrl(null);
      toast.add({
        title: "Cloud Desktop Paused",
        description: "Sandbox paused to preserve compute credits.",
        type: "info",
      });
    } catch (err: any) {
      toast.add({
        title: "Error Pausing VM",
        description: err?.message || "Failed to pause sandbox",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Quick browser launch
  const handleLaunchUrl = async (urlToOpen: string) => {
    if (!agentId) return;
    setCurrentUrl(urlToOpen);
    if (vmStatus !== "active") {
      await handleStartVM();
    }
    try {
      toast.add({
        title: "Launching Browser",
        description: `Opening ${urlToOpen} on cloud desktop...`,
        type: "info",
      });
      await axios.post("/api/agent/vm/execute", {
        agentId,
        targetUrl: urlToOpen,
      });
      setAutoPauseSeconds(120); // Reset timer on activity
    } catch (e: any) {
      console.warn("Launch error:", e);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Configuration Advisory if E2B Key Missing */}
      {!isConfigured && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-card-foreground space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
            <AlertCircle className="size-4 shrink-0" />
            <span>E2B.dev API Key Not Configured</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            To connect a live cloud VM sandbox with real Chrome/Firefox desktop streaming, add your free key to <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">.env</code>:
            <br />
            <code className="text-foreground font-mono text-[10px] block mt-1">E2B_API_KEY=e2b_...</code>
            Get $100 free credits at <a href="https://e2b.dev" target="_blank" rel="noreferrer" className="underline font-medium text-primary inline-flex items-center gap-0.5">e2b.dev <ExternalLink className="size-2.5" /></a>.
          </p>
        </div>
      )}

      {/* VM Status & Control Header */}
      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-card-foreground shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`size-2.5 rounded-full transition-colors ${
                vmStatus === "active"
                  ? "bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50"
                  : vmStatus === "paused"
                  ? "bg-amber-500"
                  : "bg-muted-foreground/40"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-none text-foreground capitalize">
                Cloud Desktop: {vmStatus}
              </span>
              {vmStatus === "active" && (
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Auto-pauses in {Math.floor(autoPauseSeconds / 60)}:{(autoPauseSeconds % 60).toString().padStart(2, "0")}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="size-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => fetchStatus()}
              disabled={loading}
              title="Refresh VM Status"
            >
              <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            </Button>

            {vmStatus === "active" ? (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 border-border hover:bg-muted font-medium text-destructive hover:text-destructive"
                onClick={handlePauseVM}
                disabled={actionLoading}
              >
                <Power className="size-3" />
                Pause VM
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                onClick={handleStartVM}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Play className="size-3" />
                )}
                Activate VM
              </Button>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Provides your AI agent with a dedicated Linux desktop machine. The agent can open real browsers, navigate dynamic sites, and extract unstructured web data. Auto-pauses after 2 minutes of inactivity to conserve free credits.
        </p>

        {/* Quick Launch Shortcuts */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider shrink-0 mr-1">
            Shortcuts:
          </span>
          <button
            type="button"
            onClick={() => handleLaunchUrl("https://news.google.com")}
            className="text-[10px] px-2 py-0.5 rounded-md border border-border/60 bg-muted/40 hover:bg-muted text-foreground transition-colors shrink-0"
          >
            Google News
          </button>
          <button
            type="button"
            onClick={() => handleLaunchUrl("https://github.com/trending")}
            className="text-[10px] px-2 py-0.5 rounded-md border border-border/60 bg-muted/40 hover:bg-muted text-foreground transition-colors shrink-0"
          >
            GitHub Trending
          </button>
          <button
            type="button"
            onClick={() => handleLaunchUrl("https://tubeguruji.com")}
            className="text-[10px] px-2 py-0.5 rounded-md border border-border/60 bg-muted/40 hover:bg-muted text-foreground transition-colors shrink-0"
          >
            Tube Guruji
          </button>
        </div>
      </div>

      {/* Live Viewport Card */}
      <div className="rounded-xl border border-border/70 overflow-hidden bg-background shadow-xs relative">
        {/* Browser Top Chrome Header */}
        <div className="h-8 bg-muted/60 border-b border-border/60 px-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-red-400/80" />
            <div className="size-2 rounded-full bg-amber-400/80" />
            <div className="size-2 rounded-full bg-emerald-400/80" />
          </div>

          <div className="flex-1 max-w-xs flex items-center gap-1.5 bg-background px-2.5 py-0.5 rounded-md text-[10px] text-muted-foreground border border-border/50 truncate">
            <Globe className="size-2.5 shrink-0 text-primary" />
            <span className="truncate">{currentUrl}</span>
          </div>

          {vmStatus === "active" && streamUrl && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground gap-1"
              onClick={() => setIsFullScreen(true)}
              title="Expand to Fullscreen Viewport"
            >
              <Maximize2 className="size-3" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Button>
          )}
        </div>

        {/* Viewport Content Area */}
        <div className="h-[280px] w-full bg-muted/20 relative flex items-center justify-center overflow-hidden">
          {vmStatus === "active" && streamUrl ? (
            <iframe
              src={streamUrl}
              className="size-full border-0"
              title="Cloud VM Desktop Stream"
              allow="clipboard-read; clipboard-write"
            />
          ) : vmStatus === "active" && !isConfigured ? (
            /* Simulated Active Sandbox View */
            <div className="size-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-card/60 backdrop-blur-xs">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Monitor className="size-5" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h5 className="text-xs font-semibold text-foreground">Sandbox Simulation Active</h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Browser agent is ready to navigate <code className="text-primary">{currentUrl}</code>. To view live noVNC video stream, configure your E2B API key.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-background">
                Resolution: 1920x1080 • Chrome / Firefox
              </Badge>
            </div>
          ) : (
            /* Inactive / Paused Overlay */
            <div className="size-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-muted/30">
              <div className="size-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                <Monitor className="size-5" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h5 className="text-xs font-semibold text-foreground">
                  {vmStatus === "paused" ? "Sandbox Inactive (Paused)" : "Cloud Desktop Off"}
                </h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Click activate to start the cloud virtual machine desktop and resume previous browser sessions.
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleStartVM}
                disabled={actionLoading}
                className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground font-medium"
              >
                {actionLoading ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
                Activate Cloud Desktop
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Interactive Desktop Modal Overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-150">
          {/* Top Overlay Bar */}
          <div className="h-12 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  Meow Cloud VM Desktop — {agentConfig?.name || "Agent"}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                Live Interactive Stream (Port 6080)
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground mr-2">
                Auto-pause in {Math.floor(autoPauseSeconds / 60)}:{(autoPauseSeconds % 60).toString().padStart(2, "0")}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs gap-1.5"
                onClick={() => setIsFullScreen(false)}
              >
                <Minimize2 className="size-3.5" />
                Exit Fullscreen
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 size-8 p-0"
                onClick={() => setIsFullScreen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Full Screen Iframe Canvas */}
          <div className="flex-1 w-full bg-black relative">
            {streamUrl ? (
              <iframe
                src={streamUrl}
                className="size-full border-0"
                title="Fullscreen Cloud VM Desktop"
                allow="clipboard-read; clipboard-write; fullscreen"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-white text-xs">
                Stream unavailable. Please restart VM.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
