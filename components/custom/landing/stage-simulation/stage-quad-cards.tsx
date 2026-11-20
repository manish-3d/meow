"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "motion/react";
import { Bot3DResearcher } from "./three-stage/bot-3d-researcher";
import { Bot3DSocial } from "./three-stage/bot-3d-social";
import { Bot3DCoding } from "./three-stage/bot-3d-coding";
import { Bot3DJob } from "./three-stage/bot-3d-job";
import { LoneMascot3D } from "./three-stage/lone-mascot-3d";
import { Thanos3DParticles } from "./three-stage/thanos-3d-particles";

interface StageQuadCardsProps {
  phase: 1 | 2 | 3 | 4 | 5 | 6;
  activeBotId: string;
  onSelectBot: (id: string) => void;
}

// ── Shared Isometric Grid Helper ──
function IsometricGridFloor() {
  return (
    <group position={[0, -1.25, 0]}>
      <gridHelper args={[8, 16, "#cbd5e1", "#e2e8f0"]} />
    </group>
  );
}

// ── Shared Studio Lighting ──
function CardStudioLighting() {
  return (
    <>
      <ambientLight intensity={1.15} color="#f8fafc" />
      <directionalLight
        position={[6, 12, 6]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        color="#ffffff"
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.55} color="#bef264" />
    </>
  );
}

export function StageQuadCards({ phase, activeBotId, onSelectBot }: StageQuadCardsProps) {
  // If Frame 1 or Frame 2: Show the center lone mascot & Thanos dissolve
  if (phase === 1 || phase === 2) {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <motion.div
          key="center-mascot-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="w-full max-w-md h-[400px] rounded-3xl bg-white/95 border border-black/[0.08] shadow-xl p-4 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] select-none">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg overflow-hidden ring-1 ring-black/10 bg-white shrink-0 shadow-2xs">
                <Image
                  src="/logo.png"
                  alt="Milo The Mascot"
                  width={28}
                  height={28}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 leading-none">Milo The Mascot</h4>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  {phase === 1 ? "Idle in Sky Island" : "Thanos-style Dispersal"}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f7fee7] text-[10px] font-mono text-[#65a30d] border border-[#d9f99d]">
              <span className="size-1.5 rounded-full bg-[#84cc16] animate-ping" />
              <span>{phase === 1 ? "Frame 1" : "Frame 2"}</span>
            </span>
          </div>

          {/* 3D Canvas */}
          <div className="flex-1 w-full relative">
            <Canvas
              shadows
              camera={{ position: [4.4, 3.4, 4.8], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 1.5]}
            >
              <CardStudioLighting />
              <IsometricGridFloor />
              {phase === 1 && <LoneMascot3D />}
              {phase === 2 && <Thanos3DParticles active={true} />}
            </Canvas>
          </div>
        </motion.div>
      </div>
    );
  }

  // Phase 3, 4, 5, 6: The 4 Distinct Rounded White Cards (Matching Reference Mockup 100%)
  const isSelected = (id: string) => activeBotId === id;

  // Spring animation variants for pop-out & settled frames
  const getCardAnim = (quadrant: "TL" | "TR" | "BL" | "BR") => {
    if (phase === 3) {
      // Pop-Out Genesis: Spring bursting from center
      const offset =
        quadrant === "TL"
          ? { x: 30, y: 30 }
          : quadrant === "TR"
          ? { x: -30, y: 30 }
          : quadrant === "BL"
          ? { x: 30, y: -30 }
          : { x: -30, y: -30 };
      return {
        initial: { scale: 0.2, opacity: 0, ...offset },
        animate: { scale: 1, opacity: 1, x: 0, y: 0 },
        transition: { type: "spring" as const, stiffness: 280, damping: 22 },
      };
    }
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 },
    };
  };

  return (
    <div className="relative w-full h-full p-2 sm:p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 overflow-hidden select-none">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP-LEFT: RESEARCH BOT                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        key="card-research"
        {...getCardAnim("TL")}
        onClick={() => onSelectBot("research-bot")}
        className={`rounded-xl sm:rounded-2xl bg-white/95 border transition-all duration-300 p-2 sm:p-2.5 shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
          isSelected("research-bot")
            ? "border-[#84cc16] ring-2 ring-[#84cc16]/25"
            : "border-black/[0.07] hover:border-black/20"
        }`}
      >
        {/* Card Header (Matching Mockup) */}
        <div className="flex items-center justify-between pb-1 border-b border-black/[0.04] z-10 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="size-5.5 sm:size-6 rounded-md overflow-hidden ring-1 ring-black/10 bg-white shrink-0 shadow-2xs">
              <Image
                src="/logo.png"
                alt="Research Bot"
                width={24}
                height={24}
                className="size-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                Research Bot
              </h4>
              <p className="text-[9px] text-neutral-400 font-sans leading-none mt-0.5">
                Live &bull; Active 12m
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f0fdf4] text-[9.5px] font-medium text-[#16a34a] border border-[#bbf7d0] shadow-2xs">
            <span className="size-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span>&bull; Live &bull; Active 12m</span>
          </div>
        </div>

        {/* 3D Viewport: Voxel Cat typing at laptop + "Browsing AI trends >" monitor */}
        <div className="flex-1 w-full h-full relative min-h-[135px] sm:min-h-[150px]">
          <Canvas
            shadows
            camera={{ position: [4.4, 3.4, 4.8], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
          >
            <CardStudioLighting />
            <IsometricGridFloor />
            <Bot3DResearcher isHovered={isSelected("research-bot")} />
          </Canvas>
        </div>
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. TOP-RIGHT: SOCIAL MEDIA BOT                             */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        key="card-social"
        {...getCardAnim("TR")}
        onClick={() => onSelectBot("social-bot")}
        className={`rounded-xl sm:rounded-2xl bg-white/95 border transition-all duration-300 p-2 sm:p-2.5 shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
          isSelected("social-bot")
            ? "border-[#84cc16] ring-2 ring-[#84cc16]/25"
            : "border-black/[0.07] hover:border-black/20"
        }`}
      >
        {/* Card Header (Matching Mockup) */}
        <div className="flex items-center justify-between pb-1 border-b border-black/[0.04] z-10 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="size-5.5 sm:size-6 rounded-md overflow-hidden ring-1 ring-black/10 bg-white shrink-0 shadow-2xs">
              <Image
                src="/logo.png"
                alt="Social Media Bot"
                width={24}
                height={24}
                className="size-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                Social Media Bot
              </h4>
              <p className="text-[9px] text-neutral-400 font-sans leading-none mt-0.5">
                Automated &bull; Queue active 3s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-neutral-100 text-[9px] font-medium text-neutral-600 border border-neutral-200 shadow-2xs">
            <span className="size-1 rounded-full bg-neutral-400" />
            <span>&bull; Automated &bull; Queue ac: 3s</span>
          </div>
        </div>

        {/* Floating Tooltip Checklist: Drafting posts... (Matching Mockup) */}
        <div className="absolute top-10 right-2.5 z-20 pointer-events-none scale-90 origin-top-right">
          <div className="rounded-xl bg-white/95 backdrop-blur-sm border border-black/[0.08] shadow-lg p-2 text-left w-[122px] space-y-1">
            <div className="text-[10px] font-bold text-neutral-800 pb-0.5 border-b border-black/[0.04]">
              Drafting posts...
            </div>
            <div className="bg-neutral-100 text-neutral-900 font-semibold px-1.5 py-0.5 rounded text-[9px] flex items-center justify-between">
              <span>1 Starting</span>
              <span className="size-1 rounded-full bg-[#84cc16]" />
            </div>
            <div className="text-neutral-500 text-[9px] px-1.5">2 Create posts...</div>
            <div className="text-neutral-500 text-[9px] px-1.5">3 Drafting posts...</div>
            <div className="text-neutral-500 text-[9px] px-1.5">4 Create ling...</div>
          </div>
        </div>

        {/* 3D Viewport: Voxel Social Billboard with App Icons & Floating Emojis */}
        <div className="flex-1 w-full h-full relative min-h-[135px] sm:min-h-[150px]">
          <Canvas
            shadows
            camera={{ position: [4.4, 3.4, 4.8], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
          >
            <CardStudioLighting />
            <IsometricGridFloor />
            <Bot3DSocial />
          </Canvas>
        </div>
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. BOTTOM-LEFT: CODING BOT                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        key="card-coding"
        {...getCardAnim("BL")}
        onClick={() => onSelectBot("coding-bot")}
        className={`rounded-xl sm:rounded-2xl bg-white/95 border transition-all duration-300 p-2 sm:p-2.5 shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
          isSelected("coding-bot")
            ? "border-[#84cc16] ring-2 ring-[#84cc16]/25"
            : "border-black/[0.07] hover:border-black/20"
        }`}
      >
        {/* Card Header (Matching Mockup) */}
        <div className="flex items-center justify-between pb-1 border-b border-black/[0.04] z-10 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="size-5.5 sm:size-6 rounded-md overflow-hidden ring-1 ring-black/10 bg-white shrink-0 shadow-2xs">
              <Image
                src="/logo.png"
                alt="Coding Bot"
                width={24}
                height={24}
                className="size-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                Coding Bot
              </h4>
              <p className="text-[9px] text-neutral-400 font-sans leading-none mt-0.5">
                Code Branch &bull; Compiling...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f0fdf4] text-[9.5px] font-medium text-[#16a34a] border border-[#bbf7d0] shadow-2xs">
            <span className="size-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span>&bull; Active compiling...</span>
          </div>
        </div>

        {/* 3D Viewport: Retro CRT PC with syntax code, mini terminals & GitHub Cubes */}
        <div className="flex-1 w-full h-full relative min-h-[135px] sm:min-h-[150px]">
          <Canvas
            shadows
            camera={{ position: [4.4, 3.4, 4.8], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
          >
            <CardStudioLighting />
            <IsometricGridFloor />
            <Bot3DCoding />
          </Canvas>
        </div>
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. BOTTOM-RIGHT: JOB BOT                                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div
        key="card-job"
        {...getCardAnim("BR")}
        onClick={() => onSelectBot("job-bot")}
        className={`rounded-xl sm:rounded-2xl bg-white/95 border transition-all duration-300 p-2 sm:p-2.5 shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
          isSelected("job-bot")
            ? "border-[#84cc16] ring-2 ring-[#84cc16]/25"
            : "border-black/[0.07] hover:border-black/20"
        }`}
      >
        {/* Card Header (Matching Mockup with Horizontal Progress Bar) */}
        <div className="flex items-center justify-between pb-1 border-b border-black/[0.04] z-10 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="size-5.5 sm:size-6 rounded-md overflow-hidden ring-1 ring-black/10 bg-white shrink-0 shadow-2xs">
              <Image
                src="/logo.png"
                alt="Job Bot"
                width={24}
                height={24}
                className="size-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-tight">
                Job Bot
              </h4>
              <p className="text-[9px] text-neutral-400 font-sans leading-none mt-0.5">
                Active pipeline &bull; 12 Matches
              </p>
            </div>
          </div>

          {/* Horizontal Green Progress Bar (Matching Mockup) */}
          <div className="flex items-center gap-1.5">
            <div className="w-16 sm:w-20 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div className="w-2/3 h-full rounded-full bg-[#84cc16] animate-pulse" />
            </div>
          </div>
        </div>

        {/* 3D Viewport: Winding dirt path + 3D Heart/Diamond signs "Search" & "Apply" */}
        <div className="flex-1 w-full h-full relative min-h-[135px] sm:min-h-[150px]">
          <Canvas
            shadows
            camera={{ position: [4.4, 3.4, 4.8], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
          >
            <CardStudioLighting />
            <IsometricGridFloor />
            <Bot3DJob />
          </Canvas>
        </div>
      </motion.div>
    </div>
  );
}
