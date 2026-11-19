"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { StageLeftSidebar } from "./stage-left-sidebar";
import { ThanosParticleCanvas } from "./thanos-particle-canvas";
import {
  VoxelLoneMascot,
  VoxelCatResearcher,
  VoxelSocialStation,
  VoxelCodingStation,
  VoxelJobStation,
  VoxelClouds,
} from "./voxel-assets";

export type SimPhase = 1 | 2 | 3 | 4 | 5 | 6;

export function StageSimulationSection() {
  const [phase, setPhase] = useState<SimPhase>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const timelineRef = useRef<NodeJS.Timeout | null>(null);

  // ── 6-Frame Animation Sequencer ──
  // Frame 1: Base Start (0ms - 1800ms)
  // Frame 2: Thanos Dissolve (1800ms - 2600ms)
  // Frame 3: Pop-Out Genesis (2600ms - 3300ms)
  // Frame 4: Outward Flight (3300ms - 4100ms)
  // Frame 5: Settle & Connect (4100ms - 4900ms)
  // Frame 6: Live Simulation / Cooking (4900ms onward)
  const runSequence = useCallback(() => {
    if (timelineRef.current) clearTimeout(timelineRef.current);
    setPhase(1);

    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2600);
    const t4 = setTimeout(() => setPhase(4), 3300);
    const t5 = setTimeout(() => setPhase(5), 4100);
    const t6 = setTimeout(() => {
      setPhase(6);
      // Hold on Frame 6 for 14s, then loop seamlessly
      timelineRef.current = setTimeout(() => {
        if (isPlaying) runSequence();
      }, 14000);
    }, 4900);

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

  const handleTogglePlay = () => setIsPlaying((p) => !p);

  const handleRestart = () => {
    setIsPlaying(true);
    runSequence();
  };

  const handleSelectPhase = (p: SimPhase) => {
    setIsPlaying(false);
    if (timelineRef.current) clearTimeout(timelineRef.current);
    setPhase(p);
  };

  const frameLabels: { phase: SimPhase; name: string; time: string }[] = [
    { phase: 1, name: "Frame 1: Base Start", time: "0s" },
    { phase: 2, name: "Frame 2: Thanos-Style Dissolve", time: "1.8s" },
    { phase: 3, name: "Frame 3: Pop-Out Genesis", time: "2.6s" },
    { phase: 4, name: "Frame 4: Outward Flight", time: "3.3s" },
    { phase: 5, name: "Frame 5: Settle & Connect", time: "4.1s" },
    { phase: 6, name: "Frame 6: Live Simulation (\"Cooking\")", time: "4.9s+" },
  ];

  return (
    <section
      id="simulation-section"
      className="relative w-full py-16 sm:py-24 overflow-hidden bg-white text-[#131316] select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* ── 1. SECTION HEADER ── */}
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono font-medium text-neutral-700 mb-3.5 shadow-2xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>isometric agent workspace &bull; gen-to-work 6-frame simulation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 leading-none">
            see the bots at work.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-500 font-normal max-w-xl mx-auto">
            watch the entire lifecycle: from a lone voxel mascot into a live, multi-agent autonomous cloud workspace.
          </p>
        </div>

        {/* ── 2. THE MAIN DESKTOP SHELL CONTAINER ── */}
        <div className="relative w-full rounded-3xl border border-black/[0.1] bg-white shadow-2xl overflow-hidden flex flex-col">
          {/* Main App Body: Persistent Left Sidebar + The Simulation Workspace */}
          <div className="flex flex-col md:flex-row h-[610px] sm:h-[650px] w-full overflow-hidden relative">
            {/* 1. PERSISTENT LEFT SIDEBAR (Always 100% visible, matching mockup) */}
            <StageLeftSidebar />

            {/* 2. THE SIMULATION WORKSPACE (MainStage.tsx) */}
            <div className="relative flex-1 h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#e0f2fe] via-[#eef2ff] to-[#f8fafc]">
              {/* Volumetric Minecraft Clouds in Sky */}
              <VoxelClouds />

              {/* ── TOP BAR (MATCHING MOCKUP IN IMAGE 1) ── */}
              <div className="relative z-20 h-12 px-4 border-b border-black/[0.06] bg-white/70 backdrop-blur-md flex items-center justify-between gap-3 select-none">
                {/* Left Title: [|] + 📦 Simulation Workspace ● */}
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                  <PanelLeft className="size-4 text-neutral-500 cursor-pointer" />
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/80 border border-black/[0.06] shadow-2xs">
                    <Box className="size-3.5 text-neutral-700" />
                    <span>Simulation Workspace</span>
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                  </div>
                </div>

                {/* Right Utilities: Search, Bell, Hide Config, User */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 border border-black/[0.06] text-neutral-400 text-[11px] font-mono shadow-2xs">
                    <SearchIcon className="size-3" />
                    <span>⌘ K</span>
                  </div>

                  <button type="button" className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors">
                    <Bell className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-black/[0.08] text-[11px] font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors"
                  >
                    <Sliders className="size-3 text-neutral-500" />
                    <span>Hide Config</span>
                  </button>

                  {/* Landscape User Avatar */}
                  <div className="size-7 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-500 border border-white shadow-xs" />
                </div>
              </div>

              {/* ── THE 6-FRAME CANVAS VIEWPORT ── */}
              <div className="relative flex-1 w-full h-full flex items-center justify-center p-3 sm:p-5 overflow-hidden">
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
                      {/* Floating Sway [-4px to 4px] */}
                      <motion.div
                        animate={{ y: [-4, 4, -4] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative flex flex-col items-center justify-center"
                      >
                        <VoxelLoneMascot />
                      </motion.div>

                      {/* Status indicator pill */}
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-black/[0.08] text-[11px] font-mono text-neutral-700 shadow-sm">
                        <span className="size-1.5 rounded-full bg-[#7C5CFC] animate-ping" />
                        <span>Mascot Idle &bull; Ready to Initialize Crew</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── FRAME 2: THANOS-STYLE DISSOLVE PARTICLE EXPLOSION ── */}
                <ThanosParticleCanvas active={phase === 2} />

                {/* ── FRAME 3: POP-OUT GENESIS (BURSTING OUTWARD FROM CENTER) ── */}
                {phase === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
                    {/* Center Light Burst Rays */}
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="size-36 rounded-full bg-gradient-to-tr from-yellow-300 via-white to-sky-400 blur-lg"
                    />

                    {/* 4 Floating Islands Bursting Outward */}
                    <div className="w-full h-full grid grid-cols-2 gap-6 p-6">
                      <motion.div
                        initial={{ scale: 0, x: 120, y: 100 }}
                        animate={{ scale: 1, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 20 }}
                        className="flex items-center justify-center"
                      >
                        <VoxelCatResearcher />
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0, x: -120, y: 100 }}
                        animate={{ scale: 1, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.04 }}
                        className="flex items-center justify-center"
                      >
                        <VoxelSocialStation />
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0, x: 120, y: -100 }}
                        animate={{ scale: 1, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.08 }}
                        className="flex items-center justify-center"
                      >
                        <VoxelCodingStation />
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0, x: -120, y: -100 }}
                        animate={{ scale: 1, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.12 }}
                        className="flex items-center justify-center"
                      >
                        <VoxelJobStation />
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* ── FRAME 5 & 6: SYMMETRICAL SVG CONNECTORS & DATA DOTS ── */}
                {phase >= 5 && (
                  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 800 500" fill="none">
                      <defs>
                        <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>

                      {/* Cable 1: Top-Left to Bottom-Right */}
                      <motion.path
                        d="M 220 180 C 350 180, 450 320, 580 320"
                        stroke="url(#cableGrad)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8 }}
                        opacity="0.6"
                      />

                      {/* Cable 2: Top-Right to Bottom-Left */}
                      <motion.path
                        d="M 580 180 C 450 180, 350 320, 220 320"
                        stroke="url(#cableGrad)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        opacity="0.6"
                      />

                      {/* Flowing Data Particle Dots */}
                      <circle cx="400" cy="250" r="3.5" fill="#38bdf8" className="animate-ping" />
                    </svg>
                  </div>
                )}

                {/* ── FRAME 4, 5, 6: THE 4 RICH VOXEL BOT WORKSPACE CARDS (MATCHING IMAGE 1) ── */}
                {phase >= 4 && (
                  <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 overflow-hidden">
                    {/* ────────────────────────────────────────────────────────── */}
                    {/* 1. TOP-LEFT: RESEARCH BOT                                  */}
                    {/* ────────────────────────────────────────────────────────── */}
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative rounded-2xl bg-white/98 border border-black/[0.08] p-3 shadow-sm flex flex-col justify-between overflow-hidden"
                    >
                      {/* Card Header (Matching Mockup) */}
                      <div className="flex items-center justify-between z-20 pb-0.5">
                        <div className="flex items-center gap-2">
                          <span className="size-5 rounded-md bg-neutral-100 flex items-center justify-center text-xs">
                            🐱
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 leading-none">Research Bot</h4>
                            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Live &bull; Active 12m</p>
                          </div>
                        </div>

                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-mono text-emerald-700 border border-emerald-200">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>Live &bull; Active 12m</span>
                        </span>
                      </div>

                      {/* 3D Voxel Cat with Headphones, Laptop, Monitor on Island */}
                      <VoxelCatResearcher />
                    </motion.div>

                    {/* ────────────────────────────────────────────────────────── */}
                    {/* 2. TOP-RIGHT: SOCIAL MEDIA BOT                             */}
                    {/* ────────────────────────────────────────────────────────── */}
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                      className="relative rounded-2xl bg-white/98 border border-black/[0.08] p-3 shadow-sm flex flex-col justify-between overflow-hidden"
                    >
                      <div className="flex items-center justify-between z-20 pb-0.5">
                        <div className="flex items-center gap-2">
                          <span className="size-5 rounded-md bg-neutral-100 flex items-center justify-center text-xs">
                            🐱
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 leading-none">Social Media Bot</h4>
                            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Automated &bull; Queue active 3s</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-mono text-neutral-600 border border-neutral-200">
                          &bull; Automated &bull; Queue ac: 3s
                        </span>
                      </div>

                      {/* 3D Voxel Billboard Station + Drafting Popover on Island */}
                      <VoxelSocialStation />
                    </motion.div>

                    {/* ────────────────────────────────────────────────────────── */}
                    {/* 3. BOTTOM-LEFT: CODING BOT                                 */}
                    {/* ────────────────────────────────────────────────────────── */}
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                      className="relative rounded-2xl bg-white/98 border border-black/[0.08] p-3 shadow-sm flex flex-col justify-between overflow-hidden"
                    >
                      <div className="flex items-center justify-between z-20 pb-0.5">
                        <div className="flex items-center gap-2">
                          <span className="size-5 rounded-md bg-neutral-100 flex items-center justify-center text-xs">
                            🐱
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 leading-none">Coding Bot</h4>
                            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Code Branch &bull; Compiling...</p>
                          </div>
                        </div>

                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-mono text-emerald-700 border border-emerald-200">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active compiling...</span>
                        </span>
                      </div>

                      {/* 3D Voxel Retro Computer + Terminals + GitHub Blocks on Island */}
                      <VoxelCodingStation />
                    </motion.div>

                    {/* ────────────────────────────────────────────────────────── */}
                    {/* 4. BOTTOM-RIGHT: JOB BOT                                   */}
                    {/* ────────────────────────────────────────────────────────── */}
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                      className="relative rounded-2xl bg-white/98 border border-black/[0.08] p-3 shadow-sm flex flex-col justify-between overflow-hidden"
                    >
                      <div className="flex items-center justify-between z-20 pb-0.5">
                        <div className="flex items-center gap-2">
                          <span className="size-5 rounded-md bg-neutral-100 flex items-center justify-center text-xs">
                            🐱
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 leading-none">Job Bot</h4>
                            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Active pipeline &bull; 12 Matches</p>
                          </div>
                        </div>

                        {/* Green Progress Bar */}
                        <div className="w-24 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500 w-3/4" />
                        </div>
                      </div>

                      {/* 3D Voxel Dirt Pathway + Search/Apply Heart Signs on Island */}
                      <VoxelJobStation />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* ── FLAT GROUND GRASS BORDER STRIP (ACROSS VIEWPORT BOTTOM) ── */}
              <div className="w-full h-2.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 border-t border-emerald-600 shrink-0 select-none pointer-events-none" />

              {/* ── 3. BOTTOM TIMELINE SCRUBBER CONTROLLER ── */}
              <div className="w-full px-4 py-2 border-t border-black/[0.06] bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono select-none">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 text-white hover:bg-black transition-all active:scale-95 shadow-2xs font-semibold text-[11px]"
                  >
                    {isPlaying ? <Pause className="size-3" /> : <Play className="size-3" />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-1 rounded-lg border border-black/10 bg-white hover:bg-neutral-100 text-neutral-600 transition-colors"
                    title="Restart Sequence from Frame 1"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>

                  <span className="text-[10px] text-neutral-400 hidden sm:inline">
                    Phase {phase}/6 &bull; {phase === 6 ? "Always Cooking" : "Transitioning..."}
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
                        className={`px-2 py-0.5 rounded-md text-[10px] transition-all whitespace-nowrap ${
                          isActive
                            ? "bg-neutral-900 text-white font-bold shadow-2xs scale-105"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {f.name.replace("Frame ", "F")}
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
