"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
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
  Sparkles,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { StageLeftSidebar } from "./stage-left-sidebar";
import { ThanosParticleCanvas } from "./thanos-particle-canvas";
import { VoxelClouds } from "./voxel-assets";

export type SimPhase = 1 | 2 | 3 | 4 | 5 | 6;

export function StageSimulationSection() {
  const [phase, setPhase] = useState<SimPhase>(6); // Default to Frame 6 (Live Simulation / Cooking)
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStoryboardGrid, setShowStoryboardGrid] = useState(false);
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
    setShowStoryboardGrid(false);
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
      // Starting play from Frame 6 runs from Frame 1
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
    setShowStoryboardGrid(false);
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
            <span>isometric agent workspace &bull; gen-to-work 6-frame simulation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 leading-none">
            see the bots at work.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-500 font-normal max-w-xl mx-auto">
            watch the entire lifecycle: from a lone voxel mascot into a live, multi-agent autonomous cloud workspace.
          </p>
        </div>

        {/* ── 2. THE MAIN DESKTOP SHELL CONTAINER (MATCHING EXACT MOCKUP) ── */}
        <div className="relative w-full rounded-3xl border border-black/[0.1] bg-white shadow-2xl overflow-hidden flex flex-col">
          {/* Main App Body: Persistent Left Sidebar + The Simulation Workspace */}
          <div className="flex flex-col md:flex-row h-[620px] sm:h-[660px] w-full overflow-hidden relative">
            {/* 1. PERSISTENT LEFT SIDEBAR (Always 100% visible, matching mockup sage colors) */}
            <StageLeftSidebar />

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

                  <button
                    type="button"
                    onClick={() => setShowStoryboardGrid((v) => !v)}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 border border-black/[0.08] text-[10.5px] font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors"
                  >
                    <Sliders className="size-3 text-neutral-500" />
                    <span>{showStoryboardGrid ? "Show Live Cooking" : "View Storyboard"}</span>
                  </button>

                  {/* Landscape User Avatar */}
                  <div className="size-6 rounded-full bg-gradient-to-tr from-[#6e9e35] to-sky-500 border border-white shadow-xs" />
                </div>
              </div>

              {/* ── THE 6-FRAME CANVAS VIEWPORT ── */}
              <div className="relative flex-1 w-full h-full flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
                {/* ── VIEW MODE 1: FULL 6-FRAME STORYBOARD OVERVIEW (TOGGLED) ── */}
                {showStoryboardGrid ? (
                  <motion.div
                    key="storyboard-overview"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border border-black/[0.08] bg-white flex flex-col"
                  >
                    <div className="p-2 border-b border-black/[0.06] bg-neutral-50/90 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">
                        TRANSITION STORYBOARD: Agent Workspace Setup Process (6 Frames)
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowStoryboardGrid(false)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-white"
                      >
                        Back to Live Simulation
                      </button>
                    </div>
                    <div className="relative flex-1 w-full h-full">
                      <Image
                        src="/simulation/storyboard_full.jpg"
                        alt="Transition Storyboard"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* ── FRAME 1: BASE START (LONE CAT ON FLOATING ISLAND) ── */}
                    <AnimatePresence>
                      {phase === 1 && (
                        <motion.div
                          key="frame1-lone-cat"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.05, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
                        >
                          <motion.div
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-[340px] sm:w-[420px] aspect-[1.4/1] rounded-2xl overflow-hidden shadow-xl border border-white/60"
                          >
                            <Image
                              src="/simulation/storyboard_f1.jpg"
                              alt="Frame 1: Base Start"
                              fill
                              className="object-cover"
                              priority
                            />
                          </motion.div>

                          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-black/[0.08] text-[11px] font-mono text-neutral-700 shadow-sm">
                            <span className="size-1.5 rounded-full bg-[#7C5CFC] animate-ping" />
                            <span>Frame 1: Base Start &bull; Mascot Perched in Isolation</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── FRAME 2: THANOS-STYLE DISSOLVE PARTICLE EXPLOSION ── */}
                    {phase === 2 && (
                      <motion.div
                        key="frame2-dissolve"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
                      >
                        <div className="relative w-[340px] sm:w-[420px] aspect-[1.4/1] rounded-2xl overflow-hidden shadow-xl border border-white/60">
                          <Image
                            src="/simulation/storyboard_f2.jpg"
                            alt="Frame 2: Thanos Dissolve"
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>

                        {/* Interactive Thanos Particle Canvas */}
                        <ThanosParticleCanvas active={phase === 2} />

                        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-black/[0.08] text-[11px] font-mono text-neutral-700 shadow-sm">
                          <span className="size-1.5 rounded-full bg-orange-500 animate-ping" />
                          <span>Frame 2: Thanos-Style Dissolve &bull; 150 Particle Genesis Burst</span>
                        </div>
                      </motion.div>
                    )}

                    {/* ── FRAME 3: POP-OUT GENESIS ── */}
                    {phase === 3 && (
                      <motion.div
                        key="frame3-genesis"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
                      >
                        <div className="relative w-[340px] sm:w-[420px] aspect-[1.4/1] rounded-2xl overflow-hidden shadow-xl border border-white/60">
                          <Image
                            src="/simulation/storyboard_f3.jpg"
                            alt="Frame 3: Pop-Out Genesis"
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>

                        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-black/[0.08] text-[11px] font-mono text-neutral-700 shadow-sm">
                          <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                          <span>Frame 3: Pop-Out Genesis &bull; Quad Island Outward Burst</span>
                        </div>
                      </motion.div>
                    )}

                    {/* ── FRAME 4: OUTWARD FLIGHT ── */}
                    {phase === 4 && (
                      <motion.div
                        key="frame4-flight"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
                      >
                        <div className="relative w-[340px] sm:w-[420px] aspect-[1.4/1] rounded-2xl overflow-hidden shadow-xl border border-white/60">
                          <Image
                            src="/simulation/storyboard_f4.jpg"
                            alt="Frame 4: Outward Flight"
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>

                        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-black/[0.08] text-[11px] font-mono text-neutral-700 shadow-sm">
                          <span className="size-1.5 rounded-full bg-sky-500 animate-ping" />
                          <span>Frame 4: Outward Flight &bull; Expanding to Quadrant Resting Points</span>
                        </div>
                      </motion.div>
                    )}

                    {/* ── FRAME 5: SETTLE & CONNECT ── */}
                    {phase === 5 && (
                      <motion.div
                        key="frame5-connect"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
                      >
                        <div className="relative w-[340px] sm:w-[420px] aspect-[1.4/1] rounded-2xl overflow-hidden shadow-xl border border-white/60">
                          <Image
                            src="/simulation/storyboard_f5.jpg"
                            alt="Frame 5: Settle & Connect"
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>

                        {/* Animated Glowing Cable Path */}
                        <div className="absolute inset-0 pointer-events-none z-30">
                          <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                            <motion.path
                              d="M 150 140 C 250 140, 350 260, 450 260"
                              stroke="#6e9e35"
                              strokeWidth="2.5"
                              strokeDasharray="6 6"
                              initial={{ strokeDashoffset: 50 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <circle cx="300" cy="200" r="4" fill="#6e9e35" className="animate-ping" />
                          </svg>
                        </div>

                        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-black/[0.08] text-[11px] font-mono text-neutral-700 shadow-sm">
                          <span className="size-1.5 rounded-full bg-[#6e9e35] animate-ping" />
                          <span>Frame 5: Settle & Connect &bull; Drawing Synchronized Data Cables</span>
                        </div>
                      </motion.div>
                    )}

                    {/* ── FRAME 6: LIVE SIMULATION ("COOKING") ── */}
                    {/* (THE 4 RICH 3D VOXEL CARDS FROM MOCKUP WITH REAL DOM INTERACTIVITY) */}
                    {phase === 6 && (
                      <motion.div
                        key="frame6-simulation"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 overflow-hidden"
                      >
                        {/* ────────────────────────────────────────────────────────── */}
                        {/* 1. TOP-LEFT: RESEARCH BOT (3D VOXEL CAT WITH HEADPHONES)   */}
                        {/* ────────────────────────────────────────────────────────── */}
                        <div className="relative rounded-2xl bg-white border border-black/[0.08] shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                          <div className="relative w-full h-full min-h-[170px] sm:min-h-[190px]">
                            <Image
                              src="/simulation/card_3d_research.jpg"
                              alt="Research Bot 3D Voxel Scene"
                              fill
                              className="object-cover select-none"
                              priority
                            />

                            {/* Live Interactive Overlaid Badge (Pulsing Sage Green) */}
                            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2 py-0.8 rounded-full bg-white/90 backdrop-blur-xs border border-[#d5dfcc] shadow-2xs text-[10px] font-mono text-[#6e9e35] font-semibold">
                              <span className="size-1.5 rounded-full bg-[#6e9e35] animate-ping" />
                              <span>Live &bull; Active {secondsCounter}m</span>
                            </div>

                            {/* Live Active Browsing Telemetry Prompt */}
                            <div className="absolute bottom-2.5 left-3 z-20 hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9.5px] font-mono text-emerald-300">
                              <Sparkles className="size-2.5 text-yellow-300" />
                              <span>arXiv:2611.089 &bull; Multi-Agent Consensus</span>
                            </div>
                          </div>
                        </div>

                        {/* ────────────────────────────────────────────────────────── */}
                        {/* 2. TOP-RIGHT: SOCIAL MEDIA BOT (3D APP BILLBOARD)          */}
                        {/* ────────────────────────────────────────────────────────── */}
                        <div className="relative rounded-2xl bg-white border border-black/[0.08] shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                          <div className="relative w-full h-full min-h-[170px] sm:min-h-[190px]">
                            <Image
                              src="/simulation/card_3d_social.jpg"
                              alt="Social Media Bot 3D Voxel Scene"
                              fill
                              className="object-cover select-none"
                              priority
                            />

                            {/* Live Interactive Overlaid Badge */}
                            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2 py-0.8 rounded-full bg-white/90 backdrop-blur-xs border border-neutral-200 shadow-2xs text-[10px] font-mono text-neutral-700">
                              <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
                              <span>Queue active 3s</span>
                            </div>

                            {/* Interactive Drafting Dropdown Overlay on right */}
                            <div className="absolute top-8 right-3 z-25 w-28 sm:w-32 rounded-xl bg-white/95 border border-black/[0.1] shadow-lg p-1.5 text-[9px] font-mono space-y-0.5">
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
                        </div>

                        {/* ────────────────────────────────────────────────────────── */}
                        {/* 3. BOTTOM-LEFT: CODING BOT (3D RETRO CRT WORKSTATION)      */}
                        {/* ────────────────────────────────────────────────────────── */}
                        <div className="relative rounded-2xl bg-white border border-black/[0.08] shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                          <div className="relative w-full h-full min-h-[170px] sm:min-h-[190px]">
                            <Image
                              src="/simulation/card_3d_coding.jpg"
                              alt="Coding Bot 3D Voxel Scene"
                              fill
                              className="object-cover select-none"
                              priority
                            />

                            {/* Live Interactive Overlaid Badge */}
                            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2 py-0.8 rounded-full bg-white/90 backdrop-blur-xs border border-[#d5dfcc] shadow-2xs text-[10px] font-mono text-[#6e9e35] font-semibold">
                              <span className="size-1.5 rounded-full bg-[#6e9e35] animate-pulse" />
                              <span>Active compiling...</span>
                            </div>

                            {/* Live Typewriter Code Overlay near screen */}
                            <div className="absolute bottom-2.5 left-3 z-20 hidden sm:flex flex-col gap-0.5 px-2 py-1 rounded bg-black/75 backdrop-blur-sm text-[8.5px] font-mono text-emerald-400 max-w-[210px] shadow-sm">
                              <div className="flex items-center gap-1 text-neutral-400">
                                <span>main.rs</span>
                                <span>&bull;</span>
                                <span className="text-[#6e9e35]">30/30 ok</span>
                              </div>
                              <span className="truncate">$ cargo run --release --agent</span>
                            </div>
                          </div>
                        </div>

                        {/* ────────────────────────────────────────────────────────── */}
                        {/* 4. BOTTOM-RIGHT: JOB BOT (3D DIRT PATHWAY & SIGNS)         */}
                        {/* ────────────────────────────────────────────────────────── */}
                        <div className="relative rounded-2xl bg-white border border-black/[0.08] shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                          <div className="relative w-full h-full min-h-[170px] sm:min-h-[190px]">
                            <Image
                              src="/simulation/card_3d_job.jpg"
                              alt="Job Bot 3D Voxel Scene"
                              fill
                              className="object-cover select-none"
                              priority
                            />

                            {/* Sage Green Progress Bar */}
                            <div className="absolute top-3 right-3 z-20 w-24 sm:w-28 flex flex-col items-end gap-1">
                              <div className="w-full h-1.5 rounded-full bg-neutral-200 overflow-hidden shadow-2xs">
                                <div className="h-full rounded-full bg-[#6e9e35] w-3/4 animate-pulse" />
                              </div>
                              <span className="text-[9px] font-mono text-neutral-500 font-medium">
                                12 Matches
                              </span>
                            </div>

                            {/* Live Telemetry Ticker */}
                            <div className="absolute bottom-2.5 left-3 z-20 hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9.5px] font-mono text-amber-300">
                              <span>Auto-Applied: 3 Roles &bull; 2 Interviews Booked</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
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
                    Phase {phase}/6 &bull; {phase === 6 ? "Always Cooking" : "Transitioning..."}
                  </span>
                </div>

                {/* Frame Pills (F1 to F6) */}
                <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                  {frameLabels.map((f) => {
                    const isActive = phase === f.phase && !showStoryboardGrid;
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
          <span>Explore all 4 voxel agents in live cloud sandboxes</span>
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