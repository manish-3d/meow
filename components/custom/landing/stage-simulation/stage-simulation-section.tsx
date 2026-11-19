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

// Dynamically import the real procedural Three.js Canvas with ssr: false
const SimulationR3FCanvas = dynamic(
  () => import("./three-stage/simulation-r3f-canvas").then((mod) => mod.SimulationR3FCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#e0f2fe]/50 via-[#eef2ff]/50 to-[#f8fafc]/50">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-black/[0.08] text-neutral-600 font-mono text-xs shadow-sm">
          <span className="size-2 rounded-full bg-[#6e9e35] animate-ping" />
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
      className="relative w-full py-16 sm:py-24 overflow-hidden bg-white text-[#131316] select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* ── 1. SECTION HEADER ── */}
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecefe8] border border-[#d5dfcc] text-xs font-mono font-medium text-[#6e9e35] mb-3.5 shadow-2xs">
            <span className="size-2 rounded-full bg-[#6e9e35] animate-ping" />
            <span>three.js procedural 3d agent simulation &bull; gen-to-work 6-frame</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 leading-none">
            see the bots at work.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-500 font-normal max-w-xl mx-auto">
            watch the entire lifecycle: from a lone voxel mascot into a live, multi-agent autonomous cloud workspace built with real-time 3D code.
          </p>
        </div>

        {/* ── 2. THE MAIN DESKTOP SHELL CONTAINER (MATCHING MOCKUP) ── */}
        <div className="relative w-full rounded-3xl border border-black/[0.1] bg-white shadow-2xl overflow-hidden flex flex-col">
          {/* Main App Body: Persistent Left Sidebar + The Simulation Workspace */}
          <div className="flex flex-col md:flex-row h-[630px] sm:h-[670px] w-full overflow-hidden relative">
            {/* 1. PERSISTENT LEFT SIDEBAR (Always 100% visible, matching mockup sage green #6e9e35) */}
            <StageLeftSidebar activeBotId={activeBotId} onSelectBot={setActiveBotId} />

            {/* 2. THE SIMULATION WORKSPACE (MainStage.tsx) */}
            <div className="relative flex-1 h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#e0f2fe] via-[#eef2ff] to-[#f8fafc]">
              {/* Volumetric Minecraft Clouds in Sky */}
              <VoxelClouds />

              {/* ── TOP BAR (MATCHING MOCKUP DOWN TO THE PIXEL) ── */}
              <div className="relative z-20 h-11 px-4 border-b border-black/[0.06] bg-white/75 backdrop-blur-md flex items-center justify-between gap-3 select-none">
                {/* Left Title: [|] + 📦 Simulation Workspace ● */}
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                  <PanelLeft className="size-3.5 text-neutral-500 cursor-pointer hover:text-neutral-900" />
                  <div className="flex items-center gap-1.5 px-2 py-0.8 rounded-md bg-white/90 border border-black/[0.06] shadow-2xs">
                    <Box className="size-3 text-neutral-700" />
                    <span>Simulation Workspace</span>
                    <span className="size-1.5 rounded-full bg-[#6e9e35] animate-pulse ml-0.5" />
                  </div>
                </div>

                {/* Right Utilities: Search, Bell, Hide Config, User */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 px-2 py-0.8 rounded-md bg-white/80 border border-black/[0.06] text-neutral-400 text-[10px] font-mono shadow-2xs">
                    <SearchIcon className="size-2.5" />
                    <span>⌘ K</span>
                  </div>

                  <button type="button" className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
                    <Bell className="size-3.5" />
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 border border-black/[0.08] text-[10.5px] font-medium text-neutral-700 shadow-2xs">
                    <Sliders className="size-3 text-neutral-500" />
                    <span>3D Live WebGL</span>
                  </div>

                  {/* Landscape User Avatar */}
                  <div className="size-6 rounded-full bg-gradient-to-tr from-[#6e9e35] to-sky-500 border border-white shadow-xs" />
                </div>
              </div>

              {/* ── THE REAL PROCEDURAL THREE.JS 3D VIEWPORT ── */}
              <div className="relative flex-1 w-full h-full overflow-hidden">
                {/* 1. Real Three.js Canvas running 3D procedural voxel models */}
                <div className="absolute inset-0 z-10">
                  <SimulationR3FCanvas
                    phase={phase}
                    activeBotId={activeBotId}
                    onSelectBot={setActiveBotId}
                  />
                </div>

                {/* 2. Interactive Phase Overlay Status Badges (Frames 1-5) */}
                <AnimatePresence>
                  {phase === 1 && (
                    <motion.div
                      key="badge-f1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                    >
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-black/[0.08] text-xs font-mono text-neutral-800 shadow-md">
                        <span className="size-2 rounded-full bg-[#7C5CFC] animate-ping" />
                        <span>Frame 1: Base Start &bull; Lone 3D Mascot Cat Floating in Sky</span>
                      </div>
                    </motion.div>
                  )}

                  {phase === 2 && (
                    <motion.div
                      key="badge-f2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                    >
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-black/[0.08] text-xs font-mono text-neutral-800 shadow-md">
                        <span className="size-2 rounded-full bg-orange-500 animate-ping" />
                        <span>Frame 2: Thanos Dissolve &bull; 160 Real 3D Particles Dispersing</span>
                      </div>
                    </motion.div>
                  )}

                  {phase === 3 && (
                    <motion.div
                      key="badge-f3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                    >
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-black/[0.08] text-xs font-mono text-neutral-800 shadow-md">
                        <span className="size-2 rounded-full bg-amber-500 animate-ping" />
                        <span>Frame 3: Pop-Out Genesis &bull; 4 Specialized 3D Islands Spawning</span>
                      </div>
                    </motion.div>
                  )}

                  {phase === 4 && (
                    <motion.div
                      key="badge-f4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                    >
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-black/[0.08] text-xs font-mono text-neutral-800 shadow-md">
                        <span className="size-2 rounded-full bg-sky-500 animate-ping" />
                        <span>Frame 4: Outward Flight &bull; Islands Navigating to 4 Quadrants</span>
                      </div>
                    </motion.div>
                  )}

                  {phase === 5 && (
                    <motion.div
                      key="badge-f5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                    >
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-black/[0.08] text-xs font-mono text-neutral-800 shadow-md">
                        <span className="size-2 rounded-full bg-[#6e9e35] animate-ping" />
                        <span>Frame 5: Settle & Connect &bull; 3D Data Cables Synchronizing</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. FRAME 6: THE 4 CARD FRAMES & HUD (MATCHING USER REFERENCE DESIGN) */}
                <AnimatePresence>
                  {phase === 6 && (
                    <motion.div
                      key="frame6-cards-hud"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 z-20 p-2.5 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 pointer-events-none"
                    >
                      {/* ────────────────────────────────────────────────────────── */}
                      {/* CARD 1: TOP-LEFT — RESEARCH BOT                            */}
                      {/* ────────────────────────────────────────────────────────── */}
                      <div className="relative rounded-2xl border border-black/[0.08] bg-white/40 backdrop-blur-[2px] shadow-sm p-3 flex flex-col justify-between overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between pointer-events-auto">
                          <div className="flex items-center gap-2">
                            <span className="size-5 rounded-md bg-neutral-100 flex items-center justify-center text-xs">
                              🐱
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-neutral-900 leading-none">Research Bot</h4>
                              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Live &bull; Active 12m</p>
                            </div>
                          </div>

                          <span className="flex items-center gap-1 px-2 py-0.8 rounded-full bg-[#ecefe8] text-[10px] font-mono text-[#6e9e35] border border-[#d5dfcc] font-semibold">
                            <span className="size-1.5 rounded-full bg-[#6e9e35] animate-ping" />
                            <span>Live &bull; Active {secondsCounter}m</span>
                          </span>
                        </div>

                        {/* Telemetry pill */}
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9.5px] font-mono text-emerald-300 w-fit pointer-events-auto">
                          <Sparkles className="size-2.5 text-yellow-300" />
                          <span>arXiv:2611.089 &bull; Multi-Agent Consensus</span>
                        </div>
                      </div>

                      {/* ────────────────────────────────────────────────────────── */}
                      {/* CARD 2: TOP-RIGHT — SOCIAL MEDIA BOT                       */}
                      {/* ────────────────────────────────────────────────────────── */}
                      <div className="relative rounded-2xl border border-black/[0.08] bg-white/40 backdrop-blur-[2px] shadow-sm p-3 flex flex-col justify-between overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between pointer-events-auto">
                          <div className="flex items-center gap-2">
                            <span className="size-5 rounded-md bg-neutral-100 flex items-center justify-center text-xs">
                              📢
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-neutral-900 leading-none">Social Media Bot</h4>
                              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Automated &bull; Queue active 3s</p>
                            </div>
                          </div>

                          <span className="px-2 py-0.8 rounded-full bg-neutral-100 text-[10px] font-mono text-neutral-600 border border-neutral-200">
                            &bull; Automated &bull; Queue ac: 3s
                          </span>
                        </div>

                        {/* Interactive Drafting Popover */}
                        <div className="self-end w-32 rounded-xl bg-white/95 border border-black/[0.1] shadow-lg p-1.5 text-[9px] font-mono space-y-0.5 pointer-events-auto">
                          <p className="text-[9px] font-bold text-neutral-800 px-1 pb-0.5 border-b border-black/[0.05]">
                            Drafting posts...
                          </p>
                          {[
                            { num: 1, label: "Starting" },
                            { num: 2, label: "Create posts..." },
                            { num: 3, label: "Drafting posts..." },
                            { num: 4, label: "Create link..." },
                          ].map((step) => (
                            <button
                              key={step.num}
                              type="button"
                              onClick={() => setActiveDraftStep(step.num)}
                              className={`w-full text-left px-1.5 py-0.5 rounded transition-colors flex items-center justify-between ${
                                activeDraftStep === step.num
                                  ? "bg-[#ecefe8] text-[#6e9e35] font-bold"
                                  : "text-neutral-600 hover:bg-neutral-100"
                              }`}
                            >
                              <span>{step.num} {step.label}</span>
                              {activeDraftStep === step.num && (
                                <span className="size-1 rounded-full bg-[#6e9e35]" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ────────────────────────────────────────────────────────── */}
                      {/* CARD 3: BOTTOM-LEFT — CODING BOT                           */}
                      {/* ────────────────────────────────────────────────────────── */}
                      <div className="relative rounded-2xl border border-black/[0.08] bg-white/40 backdrop-blur-[2px] shadow-sm p-3 flex flex-col justify-between overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between pointer-events-auto">
                          <div className="flex items-center gap-2">
                            <span className="size-5 rounded-md bg-neutral-100 flex items-center justify-center text-xs">
                              💻
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-neutral-900 leading-none">Coding Bot</h4>
                              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Code Branch &bull; Compiling...</p>
                            </div>
                          </div>

                          <span className="flex items-center gap-1 px-2 py-0.8 rounded-full bg-[#ecefe8] text-[10px] font-mono text-[#6e9e35] border border-[#d5dfcc] font-semibold">
                            <span className="size-1.5 rounded-full bg-[#6e9e35] animate-pulse" />
                            <span>Active compiling...</span>
                          </span>
                        </div>

                        {/* Live Compilation Status */}
                        <div className="flex flex-col gap-0.5 px-2 py-1 rounded bg-black/75 backdrop-blur-sm text-[8.5px] font-mono text-emerald-400 max-w-[210px] pointer-events-auto shadow-sm">
                          <div className="flex items-center gap-1 text-neutral-400">
                            <span>main.rs</span>
                            <span>&bull;</span>
                            <span className="text-[#6e9e35]">30/30 ok</span>
                          </div>
                          <span className="truncate">$ cargo run --release --agent</span>
                        </div>
                      </div>

                      {/* ────────────────────────────────────────────────────────── */}
                      {/* CARD 4: BOTTOM-RIGHT — JOB BOT                             */}
                      {/* ────────────────────────────────────────────────────────── */}
                      <div className="relative rounded-2xl border border-black/[0.08] bg-white/40 backdrop-blur-[2px] shadow-sm p-3 flex flex-col justify-between overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between pointer-events-auto">
                          <div className="flex items-center gap-2">
                            <span className="size-5 rounded-md bg-neutral-100 flex items-center justify-center text-xs">
                              💼
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-neutral-900 leading-none">Job Bot</h4>
                              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Active pipeline &bull; 12 Matches</p>
                            </div>
                          </div>

                          {/* Sage Green Progress Bar */}
                          <div className="w-24 h-1.5 rounded-full bg-neutral-200 overflow-hidden shadow-2xs">
                            <div className="h-full rounded-full bg-[#6e9e35] w-3/4 animate-pulse" />
                          </div>
                        </div>

                        {/* Telemetry pill */}
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9.5px] font-mono text-amber-300 w-fit pointer-events-auto">
                          <span>Auto-Applied: 3 Roles &bull; 2 Interviews Booked</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── FLAT GROUND GRASS BORDER STRIP (ACROSS VIEWPORT BOTTOM) ── */}
              <div className="w-full h-2.5 bg-gradient-to-r from-[#6e9e35] via-[#84cc16] to-[#6e9e35] border-t border-[#5b842a] shrink-0 select-none pointer-events-none" />

              {/* ── 3. BOTTOM TIMELINE SCRUBBER CONTROLLER ── */}
              <div className="w-full px-3.5 py-2 border-t border-black/[0.06] bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono select-none">
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
