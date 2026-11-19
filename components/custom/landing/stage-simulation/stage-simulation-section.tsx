"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Lock, Sparkles, Terminal, Activity, ArrowRight, Layers } from "lucide-react";
import { StageLeftSidebar } from "./stage-left-sidebar";
import { StageCenterCat } from "./stage-center-cat";
import { StageVmPanel } from "./stage-vm-panel";
import { StageBotCardsGrid } from "./stage-bot-cards";
import { StageFlowLines } from "./stage-flow-lines";
import { StageScrubber } from "./stage-scrubber";
import { StagePhase } from "./types";
import Link from "next/link";

export function StageSimulationSection() {
  const [phase, setPhase] = useState<StagePhase>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Sequenced 6-Phase Frame Timeline ──
  // 0ms - 1500ms: Frame 1 (Idle Cat)
  // 1500ms - 2200ms: Frame 2 (Sparkle explosion)
  // 2200ms - 3200ms: Frame 3 (First Bot + VM Panel)
  // 3200ms - 4000ms: Frame 4 (Outward Multi-Card Spawn)
  // 4000ms - 4800ms: Frame 5 (Flow Lines Connect)
  // 4800ms+: Frame 6 (Active Live Simulation - holds for 12s then loops)
  const runTimeline = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setPhase(1);

    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => setPhase(4), 3200);
    const t5 = setTimeout(() => setPhase(5), 4000);
    const t6 = setTimeout(() => {
      setPhase(6);
      // Hold on Frame 6 for 14 seconds to let the user observe the live simulation, then loop
      timerRef.current = setTimeout(() => {
        if (isPlaying) runTimeline();
      }, 14000);
    }, 4800);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const cleanup = runTimeline();
    return () => cleanup?.();
  }, [isPlaying, runTimeline]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setIsPlaying(true);
    runTimeline();
  };

  const handleSelectPhase = (selected: StagePhase) => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase(selected);
  };

  return (
    <section
      id="simulation-section"
      className="relative w-full py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/60 to-white text-[#131316] select-none"
    >
      {/* ── BACKGROUND CYBER GRID & VOLUMETRIC GLOWS ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] rounded-full bg-gradient-to-tr from-[#7C5CFC]/10 via-sky-400/8 to-emerald-400/5 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* ── 1. SECTION HEADER ── */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-neutral-200/90 text-xs font-mono font-medium text-neutral-700 mb-3.5 shadow-2xs">
            <span className="size-2 rounded-full bg-[#7C5CFC] animate-ping" />
            <span>live workspace simulation &bull; 4 specialist bots in action</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 leading-none">
            see the bots at work.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-500 font-normal max-w-xl mx-auto">
            from a quiet desktop to a full autonomous crew in seconds. watch real tasks run live in isolated sandboxes.
          </p>
        </div>

        {/* ── 2. GLASSMORPHIC DESKTOP WORKSPACE CANVASS (STAGESHOW FRAME) ── */}
        <div className="relative w-full rounded-3xl border border-black/[0.1] bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* macOS / Web App Window Chrome Header */}
          <div className="h-11 px-4 border-b border-black/[0.07] bg-neutral-100/70 flex items-center justify-between gap-3 select-none">
            {/* Window Traffic Light Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="size-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
              <div className="size-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
              <div className="size-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            </div>

            {/* Address Bar Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-lg bg-white border border-black/[0.08] text-[11px] font-mono text-neutral-600 max-w-md w-full justify-center shadow-2xs">
              <Lock className="size-3 text-emerald-600 shrink-0" />
              <span className="truncate">meow-bot.app/workspace/active-crew</span>
              <span className="hidden sm:inline-block size-1.5 rounded-full bg-emerald-500" />
            </div>

            {/* Live Environment Meta Pill */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-500 shrink-0">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gemini 2.5 Pro &bull; Composio Native</span>
            </div>
          </div>

          {/* Main App Body Grid: Left Sidebar + Stage Show Canvas + Right VM Panel */}
          <div className="flex flex-col md:flex-row h-[560px] sm:h-[590px] w-full overflow-hidden relative bg-neutral-50/50">
            {/* 1. Persistent Left Sidebar */}
            <StageLeftSidebar />

            {/* 2. Dynamic Center Stage Canvas */}
            <div className="relative flex-1 h-full flex flex-col justify-between overflow-hidden">
              {/* Center Canvas Viewport */}
              <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
                {/* State 1 & 2: Center Pixel Cat & Particle Explosion */}
                <StageCenterCat phase={phase} />

                {/* State 5 & 6: Symmetrical SVG Flow Lines */}
                <StageFlowLines active={phase >= 5} />

                {/* State 3, 4, 6: The 4 Bot Cards Grid */}
                <StageBotCardsGrid phase={phase} />
              </div>

              {/* 3. Bottom Scrubber Controller Bar */}
              <StageScrubber
                currentPhase={phase}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                onRestart={handleRestart}
                onSelectPhase={handleSelectPhase}
              />
            </div>

            {/* 3. Simulated Right-side VM Dashboard Panel */}
            <StageVmPanel active={phase >= 3} />
          </div>
        </div>

        {/* ── 3. SUPPORTING WORKSPACE CTA PILL ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-neutral-500">
          <span>All 4 bots run on individual secure VMs</span>
          <span className="hidden sm:inline">&bull;</span>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 font-semibold text-[#7C5CFC] hover:underline"
          >
            <span>Launch your crew in workspace</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
