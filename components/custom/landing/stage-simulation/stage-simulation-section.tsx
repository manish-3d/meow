"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { 
  PanelLeft, 
  Search as SearchIcon, 
  Bell, 
  Sliders, 
  RotateCcw, 
  Play, 
  Pause,
  Box,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { StageLeftSidebar } from "./stage-left-sidebar";
import { VoxelClouds } from "./voxel-assets";

// Dynamically import the real procedural Three.js 4-Card Stage with ssr: false
const StageQuadCards = dynamic(
  () => import("./stage-quad-cards").then((mod) => mod.StageQuadCards),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#e0f2fe]/50 via-[#eef2ff]/50 to-[#f8fafc]/50">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-black/[0.08] text-neutral-600 font-mono text-xs shadow-sm">
          <span className="size-2 rounded-full bg-[#84cc16] animate-ping" />
          <span>Loading procedural 3D multi-agent engine...</span>
        </div>
      </div>
    ),
  }
);

export type SimPhase = 1 | 2 | 3 | 4 | 5 | 6;

export function StageSimulationSection() {
  const [phase, setPhase] = useState<SimPhase>(6); // Default to Frame 6 (Live Simulation / Cooking)
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBotId, setActiveBotId] = useState<string>("research-bot");
  const [activeDraftStep, setActiveDraftStep] = useState(1);
  const [secondsCounter, setSecondsCounter] = useState(12);
  const timelineRef = useRef<NodeJS.Timeout | null>(null);

  // Live ticking seconds counter for Frame 6
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsCounter((s) => (s >= 59 ? 12 : s + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── 6-Frame Animation Sequencer ──
  // Frame 1: Base Start (0ms - 1800ms)
  // Frame 2: Thanos Dissolve (1800ms - 2700ms)
  // Frame 3: Pop-Out Genesis (2700ms - 3500ms)
  // Frame 4: Outward Flight (3500ms - 4300ms)
  // Frame 5: Settle & Connect (4300ms - 5200ms)
  // Frame 6: Live Simulation / Cooking (5200ms onward)
  const runSequence = useCallback(() => {
    if (timelineRef.current) clearTimeout(timelineRef.current);
    setPhase(1);

    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2700);
    const t4 = setTimeout(() => setPhase(4), 3500);
    const t5 = setTimeout(() => setPhase(5), 4300);
    const t6 = setTimeout(() => {
      setPhase(6);
      // Stay on Frame 6 for 12 seconds, then loop
      timelineRef.current = setTimeout(() => {
        if (isPlaying) runSequence();
      }, 12000);
    }, 5200);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      if (timelineRef.current) clearTimeout(timelineRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      if (timelineRef.current) clearTimeout(timelineRef.current);
      return;
    }
    const cleanup = runSequence();
    return () => cleanup?.();
  }, [isPlaying, runSequence]);

  const handleTogglePlay = () => {
    if (!isPlaying && phase === 6) {
      setIsPlaying(true);
      runSequence();
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const handleRestart = () => {
    setIsPlaying(true);
    runSequence();
  };

  const handleSelectPhase = (p: SimPhase) => {
    setIsPlaying(false);
    if (timelineRef.current) clearTimeout(timelineRef.current);
    setPhase(p);
  };

  const frameLabels: { phase: SimPhase; name: string; tag: string }[] = [
    { phase: 1, name: "Frame 1: Base Start", tag: "F1 Base Start" },
    { phase: 2, name: "Frame 2: Thanos-Style Dissolve", tag: "F2 Thanos Dissolve" },
    { phase: 3, name: "Frame 3: Pop-Out Genesis", tag: "F3 Pop-Out Genesis" },
    { phase: 4, name: "Frame 4: Outward Flight", tag: "F4 Outward Flight" },
    { phase: 5, name: "Frame 5: Settle & Connect", tag: "F5 Settle & Connect" },
    { phase: 6, name: "Frame 6: Live Simulation (\"Cooking\")", tag: "F6 Live Simulation (\"Cooking\")" },
  ];

  return (
    <section
      id="simulation-section"
      className="relative w-full py-10 sm:py-14 overflow-hidden bg-white text-[#131316] select-none"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* ── 1. SECTION HEADER ── */}
        <div className="max-w-2xl mx-auto text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f7fee7] border border-[#d9f99d] text-xs font-mono font-medium text-[#65a30d] mb-2.5 shadow-2xs">
            <span className="size-2 rounded-full bg-[#84cc16] animate-ping" />
            <span>three.js procedural 3d agent simulation &bull; gen-to-work 6-frame</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 leading-tight">
            see the bots at work.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-normal max-w-lg mx-auto">
            watch the entire lifecycle: from a lone voxel mascot into a live, multi-agent autonomous cloud workspace built with real-time 3D code.
          </p>
        </div>

        {/* ── 2. THE MAIN DESKTOP SHELL CONTAINER (MATCHING MOCKUP AT 70% BALANCED SCALE) ── */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl border border-black/[0.1] bg-white shadow-xl overflow-hidden flex flex-col">
          {/* Main App Body: Persistent Left Sidebar + The Simulation Workspace */}
          <div className="flex flex-col md:flex-row h-[450px] sm:h-[480px] w-full overflow-hidden relative">
            {/* 1. PERSISTENT LEFT SIDEBAR (Always 100% visible, matching mockup light green #84cc16) */}
            <StageLeftSidebar activeBotId={activeBotId} onSelectBot={setActiveBotId} />

            {/* 2. THE SIMULATION WORKSPACE (MainStage.tsx) */}
            <div className="relative flex-1 h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#e0f2fe] via-[#eef2ff] to-[#f8fafc]">
              {/* Volumetric Minecraft Clouds in Sky */}
              <VoxelClouds />

              {/* ── TOP BAR (MATCHING MOCKUP DOWN TO THE PIXEL) ── */}
              <div className="relative z-20 h-9 px-3.5 border-b border-black/[0.06] bg-white/75 backdrop-blur-md flex items-center justify-between gap-3 select-none">
                {/* Left Title: [|] + 📦 Simulation Workspace ● */}
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                  <PanelLeft className="size-3.5 text-neutral-500 cursor-pointer hover:text-neutral-900" />
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 border border-black/[0.06] shadow-2xs">
                    <Box className="size-3 text-neutral-700" />
                    <span>Simulation Workspace</span>
                    <span className="size-1.5 rounded-full bg-[#84cc16] animate-pulse ml-0.5" />
                  </div>
                </div>

                {/* Right Utilities: Search, Bell, Hide Config, User */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 border border-black/[0.06] text-neutral-400 text-[10px] font-mono shadow-2xs">
                    <SearchIcon className="size-2.5" />
                    <span>⌘ K</span>
                  </div>

                  <button type="button" className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
                    <Bell className="size-3.5" />
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 border border-black/[0.08] text-[10.5px] font-medium text-neutral-700 shadow-2xs">
                    <Sliders className="size-3 text-neutral-500" />
                    <span>3D Live WebGL</span>
                  </div>

                  {/* Landscape User Avatar */}
                  <div className="size-5.5 rounded-full bg-gradient-to-tr from-[#84cc16] to-sky-400 border border-white shadow-xs" />
                </div>
              </div>

              {/* ── THE REAL PROCEDURAL THREE.JS 3D VIEWPORT (4 QUADRANT CARDS MATCHING REFERENCE MOCKUP) ── */}
              <div className="relative flex-1 w-full h-full overflow-hidden">
                <StageQuadCards
                  phase={phase}
                  activeBotId={activeBotId}
                  onSelectBot={setActiveBotId}
                />
              </div>

              {/* ── FLAT GROUND GRASS BORDER STRIP (ACROSS VIEWPORT BOTTOM) ── */}
              <div className="w-full h-1.5 bg-gradient-to-r from-[#bef264] via-[#a3e635] to-[#84cc16] border-t border-[#a3e635]/30 shrink-0 select-none pointer-events-none" />

              {/* ── 3. BOTTOM TIMELINE SCRUBBER CONTROLLER ── */}
              <div className="w-full px-3 py-1.5 border-t border-black/[0.06] bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs font-mono select-none">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 text-white hover:bg-black transition-all active:scale-95 shadow-2xs font-semibold text-[11px]"
                  >
                    {isPlaying ? <Pause className="size-3" /> : <Play className="size-3" />}
                    <span>{isPlaying ? "Pause" : "Play Sequence"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-1 rounded-lg border border-black/10 bg-white hover:bg-neutral-100 text-neutral-600 transition-colors"
                    title="Restart Sequence from Frame 1"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>

                  <span className="text-[10.5px] text-neutral-500 hidden sm:inline">
                    Phase {phase}/6 &bull; {phase === 6 ? "Always Cooking (3D WebGL)" : "Transitioning..."}
                  </span>
                </div>

                {/* Frame Pills (F1 to F6) */}
                <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                  {frameLabels.map((f) => {
                    const isActive = phase === f.phase;
                    return (
                      <button
                        key={f.phase}
                        type="button"
                        onClick={() => handleSelectPhase(f.phase)}
                        className={`px-2 py-0.8 rounded-md text-[10px] transition-all whitespace-nowrap ${
                          isActive
                            ? "bg-neutral-900 text-white font-bold shadow-2xs scale-105"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {f.tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. SUPPORTING WORKSPACE LINK ── */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-neutral-500">
          <span>Explore all 4 voxel agents in real-time Three.js sandboxes</span>
          <span className="hidden sm:inline">&bull;</span>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 hover:text-black hover:underline"
          >
            <span>Launch Simulation Workspace</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
