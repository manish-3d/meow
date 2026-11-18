"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Power,
  Play,
  RefreshCw,
  Maximize2,
  X,
  Loader2,
  Hand,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Laptop,
  Cloud,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useAgentConfig } from "@/context/agent-config-context";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";

export function VmDesktopTab() {
  const { agentConfig } = useAgentConfig();
  const agentId = agentConfig?.agentId;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<"idle" | "running" | "interrupted" | "closed" | "active" | "paused">("idle");
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [lastScreenshot, setLastScreenshot] = useState<string | null>(null);
  const [mode, setMode] = useState<"browserbase" | "local">("browserbase");
  const [configuredMode, setConfiguredMode] = useState<"browserbase" | "local">("browserbase");
  const [switchingMode, setSwitchingMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("https://news.google.com");
  const [navInput, setNavInput] = useState("https://news.google.com");
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
        setNavInput(res.data.currentUrl);
      }
      if (res.data.configuredMode) {
        setConfiguredMode(res.data.configuredMode);
      } else if (res.data.mode) {
        setConfiguredMode(res.data.mode);
      }
      setMode(res.data.mode || res.data.configuredMode || "browserbase");
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

  // 3. Switch preferred browser execution mode (Cloud vs Local)
  const handleSwitchMode = async (targetMode: "browserbase" | "local") => {
    if (!agentId || switchingMode || targetMode === configuredMode) return;
    setSwitchingMode(true);

    try {
      await axios.post("/api/agent/browser/mode", {
        agentId,
        browserMode: targetMode,
      });

      setConfiguredMode(targetMode);
      setMode(targetMode);

      toast.add({
        title: targetMode === "browserbase" ? "Cloud VM Selected" : "Local Chrome Selected",
        description: targetMode === "browserbase" ? "Cloud CDP container active." : "Zero-quota local host execution.",
        type: "success",
      });

      await fetchStatus(true);
    } catch (err: any) {
      toast.add({
        title: "Mode Switch Failed",
        description: err?.response?.data?.error || err?.message || "Could not switch mode",
        type: "error",
      });
    } finally {
      setSwitchingMode(false);
    }
  };

  // 4. Start / Launch Browser Session
  const handleStartBrowser = async (headless = false) => {
    if (!agentId || actionLoading) return;
    setActionLoading(true);

    try {
      const res = await axios.post("/api/agent/browser/start", {
        agentId,
        headless,
        mode: configuredMode,
      });
      setSessionStatus("active");
      setStreamUrl(res.data.streamUrl);
      setMode(res.data.mode || configuredMode);
      setAutoPauseSeconds(180);

      toast.add({
        title: "Browser Ready",
        description: res.data.mode === "browserbase" ? "Cloud VM live." : "Local Playwright connected.",
        type: "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Launch Failed",
        description: err?.response?.data?.error || err?.message || "Failed to start browser",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Close Browser Session
  const handleCloseBrowser = async () => {
    if (!agentId || actionLoading) return;
    setActionLoading(true);

    try {
      await axios.post("/api/agent/browser/pause", { agentId });
      setSessionStatus("closed");
      setStreamUrl(null);
      toast.add({
        title: "Session Closed",
        description: "Browser closed and memory freed.",
        type: "info",
      });
    } catch (err: any) {
      toast.add({
        title: "Error Closing",
        description: err?.message || "Failed to close browser",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 6. Human-in-the-Loop: Take Control / Interrupt or Resume
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
        title: isInterrupted ? "Agent Resumed" : "Manual Takeover",
        description: isInterrupted ? "Agent resumed navigation." : "Manual control active.",
        type: isInterrupted ? "info" : "success",
      });
    } catch (err: any) {
      toast.add({
        title: "Action Failed",
        description: err?.message || "Could not toggle control",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 7. URL Navigation
  const handleNavigate = async (urlTarget?: string) => {
    const target = (urlTarget || navInput).trim();
    if (!agentId || !target) return;
    const formatted = target.startsWith("http://") || target.startsWith("https://") ? target : `https://${target}`;

    setCurrentUrl(formatted);
    setNavInput(formatted);
    setActionLoading(true);

    try {
      const res = await axios.post("/api/agent/browser/execute", {
        agentId,
        targetUrl: formatted,
        mode: configuredMode,
      });

      if (res.data.screenshotUrl) setLastScreenshot(res.data.screenshotUrl);
      if (res.data.currentUrl) {
        setCurrentUrl(res.data.currentUrl);
        setNavInput(res.data.currentUrl);
      }
      setSessionStatus("active");
      setAutoPauseSeconds(180);
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

  const isActive = sessionStatus === "active" || sessionStatus === "running" || sessionStatus === "interrupted";
  const isInterrupted = sessionStatus === "interrupted";

  const quickShortcuts = [
    { label: "Google", url: "https://news.google.com" },
    { label: "GitHub", url: "https://github.com/trending" },
    { label: "Reddit", url: "https://reddit.com" },
    { label: "Hacker News", url: "https://news.ycombinator.com" },
  ];

  return (
    <div className="space-y-4 pt-1 pb-6 text-xs select-none">
      {/* ── 1. SEGMENTED ENGINE SWITCHER & SESSION ACTIONS ── */}
      <div className="flex items-center justify-between gap-2 p-1 bg-neutral-100/90 rounded-2xl border border-black/[0.04]">
        {/* Clean Segmented Control (Matching Routine Modal Style) */}
        <div className="flex items-center gap-1 p-0.5">
          <button
            type="button"
            onClick={() => handleSwitchMode("browserbase")}
            disabled={switchingMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
              configuredMode === "browserbase"
                ? "bg-white text-foreground font-semibold shadow-2xs border border-black/[0.06]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cloud className="size-3.5" />
            <span>Cloud VM</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode("local")}
            disabled={switchingMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
              configuredMode === "local"
                ? "bg-white text-foreground font-semibold shadow-2xs border border-black/[0.06]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Laptop className="size-3.5" />
            <span>Local Chrome</span>
          </button>
        </div>

        {/* Live Status Pill & Actions */}
        <div className="flex items-center gap-1.5 pr-1">
          {isActive ? (
            <>
              {/* Take Control Pill */}
              <button
                type="button"
                onClick={handleToggleInterrupt}
                disabled={actionLoading}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  isInterrupted
                    ? "bg-black text-white shadow-2xs"
                    : "bg-white border border-black/[0.08] text-foreground hover:bg-neutral-50 shadow-2xs"
                }`}
                title={isInterrupted ? "Return control to agent" : "Take over browser manually"}
              >
                <Hand className="size-3" />
                <span>{isInterrupted ? "Resume" : "Take Control"}</span>
              </button>

              {/* Power / Close Button */}
              <button
                type="button"
                onClick={handleCloseBrowser}
                disabled={actionLoading}
                className="size-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                title="Terminate Browser Session"
              >
                <Power className="size-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleStartBrowser(false)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white text-[11px] font-semibold hover:bg-neutral-800 transition-all shadow-2xs cursor-pointer"
            >
              {actionLoading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Play className="size-3 fill-current" />
              )}
              <span>Launch</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. STAGESHOW MINIATURE BROWSER FRAME (HERO COMPONENT) ── */}
      <div className="rounded-2xl border border-black/[0.08] overflow-hidden bg-white shadow-xs">
        {/* Browser Chrome Window Header */}
        <div className="h-9 bg-neutral-50/80 border-b border-black/[0.06] px-3 flex items-center justify-between gap-2.5">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="size-2.5 rounded-full bg-neutral-300" />
            <div className="size-2.5 rounded-full bg-neutral-300" />
            <div className="size-2.5 rounded-full bg-neutral-300" />
          </div>

          {/* Interactive URL Pill Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavigate();
            }}
            className="flex-1 max-w-sm flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-black/[0.08] shadow-2xs group focus-within:border-black/30 transition-all"
          >
            <Lock className="size-2.5 text-muted-foreground/80 shrink-0" />
            <input
              type="text"
              value={navInput}
              onChange={(e) => setNavInput(e.target.value)}
              placeholder="Enter URL to navigate..."
              disabled={actionLoading}
              className="flex-1 bg-transparent border-0 outline-none text-[10px] text-foreground font-mono placeholder:text-muted-foreground/60 truncate"
            />
            {actionLoading ? (
              <Loader2 className="size-2.5 animate-spin text-muted-foreground shrink-0" />
            ) : (
              <button
                type="submit"
                className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                title="Navigate"
              >
                <ArrowRight className="size-2.5" />
              </button>
            )}
          </form>

          {/* Window Utilities */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fetchStatus()}
              disabled={loading}
              className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-colors"
              title="Refresh status"
            >
              <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            </button>

            {(streamUrl || lastScreenshot) && (
              <button
                type="button"
                onClick={() => setIsFullScreen(true)}
                className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Browser Viewport Canvas */}
        <div className="h-[280px] w-full bg-neutral-50/50 relative flex items-center justify-center overflow-hidden">
          {streamUrl ? (
            /* Mode 1: Live Interactive Stream */
            <iframe
              src={streamUrl}
              className="size-full border-0 bg-white"
              title="Live Browser Stream"
              allow="clipboard-read; clipboard-write"
            />
          ) : lastScreenshot ? (
            /* Mode 2: Live Snapshot */
            <div className="relative size-full flex items-center justify-center bg-neutral-100/40 p-2 overflow-auto">
              <img
                src={lastScreenshot}
                alt="Browser Screen"
                className="max-h-full max-w-full rounded-lg border border-black/[0.08] shadow-xs object-contain"
              />
              <div className="absolute bottom-2.5 right-2.5">
                <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/90 border border-black/[0.08] text-foreground shadow-2xs">
                  Live Snapshot
                </span>
              </div>
            </div>
          ) : isActive ? (
            /* Mode 3: Session Active, Awaiting Command */
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="size-10 rounded-2xl bg-white border border-black/[0.08] shadow-2xs flex items-center justify-center">
                {mode === "browserbase" ? (
                  <Cloud className="size-4 text-foreground" />
                ) : (
                  <Laptop className="size-4 text-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-xs text-foreground block">
                  {mode === "browserbase" ? "Cloud Browser Ready" : "Local Chrome Connected"}
                </span>
                <span className="text-[11px] text-muted-foreground block font-mono">
                  Auto-pause in {Math.floor(autoPauseSeconds / 60)}:{(autoPauseSeconds % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          ) : (
            /* Mode 4: Standby / Quick Launchpad */
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3.5">
              <div className="size-10 rounded-2xl bg-white border border-black/[0.08] shadow-2xs flex items-center justify-center">
                <Globe className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-xs text-foreground block">
                  Browser Standby
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  Launch a session or select a destination
                </span>
              </div>

              {/* Quick Launch Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xs pt-1">
                {quickShortcuts.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavigate(item.url)}
                    className="text-[10px] font-medium bg-white hover:bg-neutral-100 text-foreground px-2.5 py-1 rounded-xl border border-black/[0.08] transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. TELEMETRY & SPEC CARD (COMPONENT-DENSE, ZERO FLUFF) ── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-2xl border border-black/[0.08] bg-white space-y-0.5 shadow-2xs">
          <span className="text-[10px] text-muted-foreground block">Status</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`size-1.5 rounded-full shrink-0 ${
                isActive ? "bg-emerald-500 animate-pulse" : "bg-neutral-300"
              }`}
            />
            <span className="text-xs font-semibold font-mono text-foreground capitalize truncate">
              {sessionStatus}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl border border-black/[0.08] bg-white space-y-0.5 shadow-2xs">
          <span className="text-[10px] text-muted-foreground block">Runtime</span>
          <span className="text-xs font-semibold font-mono text-foreground truncate block">
            {configuredMode === "browserbase" ? "Cloud CDP" : "Host Chrome"}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl border border-black/[0.08] bg-white space-y-0.5 shadow-2xs">
          <span className="text-[10px] text-muted-foreground block">Cost</span>
          <span className="text-xs font-semibold font-mono text-emerald-600 block">
            {configuredMode === "browserbase" ? "Free Tier" : "$0.00"}
          </span>
        </div>
      </div>

      {/* ── 4. FULLSCREEN OVERLAY MODAL ── */}
      <AnimatePresence>
        {isFullScreen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col p-4 animate-in fade-in duration-150">
            <div className="flex-1 bg-white rounded-2xl border border-black/[0.1] shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="h-11 border-b border-black/[0.08] px-4 flex items-center justify-between shrink-0 bg-neutral-50/80">
                <div className="flex items-center gap-2">
                  <Globe className="size-3.5 text-foreground" />
                  <span className="text-xs font-semibold text-foreground font-mono">
                    {currentUrl}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isActive && (
                    <button
                      type="button"
                      onClick={handleToggleInterrupt}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-black text-white shadow-2xs"
                    >
                      {isInterrupted ? "Resume Agent" : "Take Control"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsFullScreen(false)}
                    className="size-7 rounded-xl flex items-center justify-center hover:bg-black/[0.06] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Viewport */}
              <div className="flex-1 bg-neutral-100 flex items-center justify-center overflow-auto p-4">
                {streamUrl ? (
                  <iframe
                    src={streamUrl}
                    className="size-full rounded-xl border border-black/[0.08] shadow-md bg-white"
                    title="Browser Fullscreen Stream"
                    allow="clipboard-read; clipboard-write"
                  />
                ) : lastScreenshot ? (
                  <img
                    src={lastScreenshot}
                    alt="Browser Fullscreen Snapshot"
                    className="max-h-full max-w-full rounded-xl border border-black/[0.08] shadow-md object-contain"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground font-mono">No live stream.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
