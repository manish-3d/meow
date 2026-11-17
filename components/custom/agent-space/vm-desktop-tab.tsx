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
  Hand,
  CheckCircle2,
  Laptop,
  Cloud,
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
  const [sessionStatus, setSessionStatus] = useState<"idle" | "running" | "interrupted" | "closed" | "active" | "paused">("idle");
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [lastScreenshot, setLastScreenshot] = useState<string | null>(null);
  const [mode, setMode] = useState<"browserbase" | "local">("local");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("https://news.google.com");
  const [autoPauseSeconds, setAutoPauseSeconds] = useState(180);

  // 1. Fetch live browser session status
  const fetchStatus = useCallback(async (silent = false) => {
    if (!agentId || agentId === "default") return;
    try {
      if (!silent) setLoading(true);
      const res = await axios.get(`/api/agent/browser/status?agentId=${agentId}`);
      setSessionStatus(res.data.status);
      setStreamUrl(res.data.streamUrl);
      if (res.data.lastScreenshot) {
        setLastScreenshot(res.data.lastScreenshot);
      }
      if (res.data.currentUrl) {
        setCurrentUrl(res.data.currentUrl);
      }
      setMode(res.data.mode || "local");
    } catch (err: any) {
      console.warn("Could not fetch browser status:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 2. Countdown timer for inactivity pause
  useEffect(() => {
    if (sessionStatus !== "running" && sessionStatus !== "active") return;
    const interval = setInterval(() => {
      setAutoPauseSeconds((prev) => {
        if (prev <= 1) {
          setSessionStatus("idle");
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStatus]);

  // 3. Start / Launch Browser Session
  const handleStartBrowser = async (headless = false) => {
    if (!agentId || actionLoading) return;
    setActionLoading(true);

    try {
      const res = await axios.post("/api/agent/browser/start", { agentId, headless });
      setSessionStatus("active");
      setStreamUrl(res.data.streamUrl);
      setMode(res.data.mode || "local");
      setAutoPauseSeconds(180);

      toast.add({
        title: res.data.mode === "browserbase" ? "Browserbase Cloud Active" : "Local Playwright Active",
        description:
          res.data.mode === "browserbase"
            ? "Cloud CDP browser connected with live debugger stream."
            : "Running on host Google Chrome/Edge with $0 cost.",
        type: "success",
      });
    } catch (err: any) {
      const errMsg = err?.response?.data?.error || err?.message || "Failed to start browser";
      toast.add({
        title: "Browser Activation Failed",
        description: errMsg,
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Close Browser Session
  const handleCloseBrowser = async () => {
    if (!agentId || actionLoading) return;
    setActionLoading(true);

    try {
      await axios.post("/api/agent/browser/pause", { agentId });
      setSessionStatus("closed");
      setStreamUrl(null);
      toast.add({
        title: "Browser Session Closed",
        description: "Browser closed and system memory reclaimed.",
        type: "info",
      });
    } catch (err: any) {
      toast.add({
        title: "Error Closing Browser",
        description: err?.message || "Failed to close browser",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Human-in-the-Loop: Take Control / Interrupt or Resume
  const handleToggleInterrupt = async () => {
    if (!agentId || actionLoading) return;
    setActionLoading(true);

    const isInterrupted = sessionStatus === "interrupted";
    const nextAction = isInterrupted ? "resume" : "interrupt";

    try {
      const res = await axios.post("/api/agent/browser/interrupt", {
        agentId,
        action: nextAction,
      });

      setSessionStatus(res.data.status);
      toast.add({
        title: isInterrupted ? "Agent Resumed" : "User Takeover Active",
        description: isInterrupted
          ? "Autonomous agent is back in control."
          : "Agent paused! You can now interact with the window and resolve CAPTCHAs or logins.",
        type: isInterrupted ? "info" : "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Interruption Failed",
        description: err?.message || "Could not toggle control",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 6. Quick URL Navigation
  const handleLaunchUrl = async (urlToOpen: string) => {
    if (!agentId) return;
    setCurrentUrl(urlToOpen);
    setActionLoading(true);

    try {
      toast.add({
        title: "Navigating Browser",
        description: `Navigating to ${urlToOpen}...`,
        type: "info",
      });

      const res = await axios.post("/api/agent/browser/execute", {
        agentId,
        targetUrl: urlToOpen,
      });

      if (res.data.screenshotUrl) {
        setLastScreenshot(res.data.screenshotUrl);
      }
      if (res.data.currentUrl) {
        setCurrentUrl(res.data.currentUrl);
      }
      setSessionStatus("active");
      setAutoPauseSeconds(180);

      toast.add({
        title: "Navigation Complete",
        description: `Page successfully loaded and analyzed.`,
        type: "success",
      });
    } catch (e: any) {
      console.warn("Navigation error:", e);
      toast.add({
        title: "Navigation Failed",
        description: e?.response?.data?.error || e?.message || "Could not load target page",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Engine Status & Mode Header Card */}
      <div className="p-3.5 rounded-xl border border-border/70 bg-card text-card-foreground shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`size-2.5 rounded-full transition-colors ${
                sessionStatus === "running" || sessionStatus === "active"
                  ? "bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50"
                  : sessionStatus === "interrupted"
                  ? "bg-purple-500 shadow-sm shadow-purple-500/50"
                  : "bg-muted-foreground/40"
              }`}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold leading-none text-foreground capitalize">
                  Browser: {sessionStatus}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[9px] font-mono py-0 px-1.5 ${
                    mode === "browserbase"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {mode === "browserbase" ? "Browserbase CDP" : "Local Playwright ($0 Free)"}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {sessionStatus === "interrupted"
                  ? "User is in manual control. Click Resume to return control to agent."
                  : sessionStatus === "active" || sessionStatus === "running"
                  ? `Active session • Auto-pauses in ${Math.floor(autoPauseSeconds / 60)}:${(autoPauseSeconds % 60).toString().padStart(2, "0")}`
                  : "Ready to launch local Chrome or Browserbase cloud session."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="size-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => fetchStatus()}
              disabled={loading}
              title="Refresh status"
            >
              <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            </Button>

            {/* Human Interruption Button */}
            {(sessionStatus === "active" || sessionStatus === "running" || sessionStatus === "interrupted") && (
              <Button
                size="sm"
                variant={sessionStatus === "interrupted" ? "default" : "outline"}
                className={`h-7 text-xs gap-1.5 font-medium ${
                  sessionStatus === "interrupted"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-purple-500/40 text-purple-600 hover:bg-purple-500/10"
                }`}
                onClick={handleToggleInterrupt}
                disabled={actionLoading}
                title="Pause agent and take over control manually"
              >
                <Hand className="size-3" />
                {sessionStatus === "interrupted" ? "Resume Agent" : "Take Control"}
              </Button>
            )}

            {sessionStatus === "active" || sessionStatus === "running" || sessionStatus === "interrupted" ? (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 border-border hover:bg-muted font-medium text-destructive hover:text-destructive"
                onClick={handleCloseBrowser}
                disabled={actionLoading}
              >
                <Power className="size-3" />
                Close
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                onClick={() => handleStartBrowser(false)}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Play className="size-3" />
                )}
                Launch Browser
              </Button>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Autonomous browser execution powered by <strong>Playwright</strong>. Connects locally to your host Google Chrome with $0 API costs, or cloud sessions via Browserbase. You can take over control anytime to solve logins or inspect actions.
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

          {(streamUrl || lastScreenshot) && (
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
          {streamUrl ? (
            /* Mode 1: Browserbase Live Debugger Stream (Full Interactive Iframe) */
            <iframe
              src={streamUrl}
              className="size-full border-0"
              title="Browserbase Live Stream"
              allow="clipboard-read; clipboard-write"
            />
          ) : lastScreenshot ? (
            /* Mode 2: Local Playwright Live Captured Screenshot */
            <div className="relative size-full flex items-center justify-center bg-black/5 overflow-auto p-2">
              <img
                src={lastScreenshot}
                alt="Live Browser Page"
                className="max-h-full max-w-full rounded border border-border shadow-md object-contain"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                <Badge variant="outline" className="text-[9px] bg-background/90 backdrop-blur font-mono">
                  Live Snapshot • {new Date().toLocaleTimeString()}
                </Badge>
              </div>
            </div>
          ) : sessionStatus === "active" || sessionStatus === "running" ? (
            /* Active but waiting for navigation */
            <div className="size-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-card/60 backdrop-blur-xs">
              <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Laptop className="size-5" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h5 className="text-xs font-semibold text-foreground">Playwright Browser Ready</h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Browser session is live. Click a shortcut or ask your agent in chat to navigate any webpage.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-background">
                Host Chrome / Edge • 100% Free
              </Badge>
            </div>
          ) : (
            /* Inactive / Closed */
            <div className="size-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-muted/30">
              <div className="size-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                <Monitor className="size-5" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h5 className="text-xs font-semibold text-foreground">Browser Automation Inactive</h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Launch the browser to enable autonomous website navigation, research, and live screenshots.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleStartBrowser(false)}
                disabled={actionLoading}
                className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground font-medium"
              >
                {actionLoading ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
                Launch Browser
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Interactive Modal Overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-150">
          <div className="h-12 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  Meow Browser Automation — {agentConfig?.name || "Agent"}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                {mode === "browserbase" ? "Browserbase Cloud Stream" : "Local Playwright Stream"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={sessionStatus === "interrupted" ? "default" : "outline"}
                className="h-7 text-xs gap-1.5 font-medium"
                onClick={handleToggleInterrupt}
              >
                <Hand className="size-3" />
                {sessionStatus === "interrupted" ? "Resume Agent" : "Take Control"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="size-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setIsFullScreen(false)}
                title="Exit Fullscreen"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-black/20 p-4 flex items-center justify-center overflow-auto">
            {streamUrl ? (
              <iframe
                src={streamUrl}
                className="size-full rounded-lg border border-border shadow-2xl bg-white"
                title="Browser Fullscreen Stream"
                allow="clipboard-read; clipboard-write"
              />
            ) : lastScreenshot ? (
              <img
                src={lastScreenshot}
                alt="Live Browser Page Fullscreen"
                className="max-h-full max-w-full rounded-lg border border-border shadow-2xl object-contain"
              />
            ) : (
              <div className="text-muted-foreground text-xs">No active visual stream.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
