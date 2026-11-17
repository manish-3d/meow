"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from "lucide-react";

// Dynamically import the Three.js R3F Canvas with ssr: false
const VoxelBotsCanvas = dynamic(
  () => import("./voxel-bots/voxel-bots-canvas").then((mod) => mod.VoxelBotsCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] sm:h-[400px] lg:h-[440px] flex flex-col items-center justify-center bg-neutral-50/50 rounded-3xl border border-black/5 animate-pulse">
        <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
          <Sparkles className="size-4 animate-spin text-lime-500" />
          <span>Generating procedural 3D voxel islands...</span>
        </div>
      </div>
    ),
  }
);

const BOT_NAMES = ["Researcher", "Browser", "Builder", "Operator", "Creator"];

export function MinecraftBotsSection() {
  const [activeIndex, setActiveIndex] = useState(2); // Builder is center active by default
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? BOT_NAMES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === BOT_NAMES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="bots" className="relative pt-10 pb-8 sm:pt-14 sm:pb-10 scroll-mt-20 bg-white text-[#131316] overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_15%,rgba(163,230,53,0.06),transparent_80%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Eyebrow: "— DIFFERENT BOTS —" */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 text-neutral-400 font-mono text-[11px] uppercase tracking-[0.25em]"
        >
          <span className="w-7 h-px bg-neutral-300" />
          <span>DIFFERENT BOTS</span>
          <span className="w-7 h-px bg-neutral-300" />
        </motion.div>

        {/* Title: "Different bots. Different superpowers." */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 text-2xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-neutral-900 font-sans leading-tight"
        >
          Different bots. Different superpowers.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-lg font-sans"
        >
          Specialist AI agents each with their own computer, browser, and memory.
        </motion.p>

        {/* --- 3D PROCEDURAL VOXEL SCENE (Pulled up to eliminate gap with heading) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full -mt-2 sm:-mt-4"
        >
          {/* Three.js Canvas with generous horizontal spacing & on-block Minecraft signs */}
          <VoxelBotsCanvas
            activeIndex={activeIndex}
            onSelectBot={setActiveIndex}
            hoveredIndex={hoveredIndex}
            onHoverBot={setHoveredIndex}
          />

          {/* Mobile Quick Carousel Navigation (Hidden on Tablet & Desktop) */}
          <div className="flex sm:hidden items-center justify-between w-full max-w-xs mx-auto -mt-4 px-4 relative z-10">
            <button
              onClick={handlePrev}
              type="button"
              className="flex size-8 items-center justify-center rounded-full bg-white border border-black/10 shadow-sm text-neutral-700 active:scale-90"
              aria-label="Previous bot"
            >
              <ChevronLeft className="size-4" />
            </button>

            <span className="font-mono text-xs font-semibold px-3.5 py-1 rounded-full bg-white border border-black/10 shadow-2xs">
              {BOT_NAMES[activeIndex]}
            </span>

            <button
              onClick={handleNext}
              type="button"
              className="flex size-8 items-center justify-center rounded-full bg-white border border-black/10 shadow-sm text-neutral-700 active:scale-90"
              aria-label="Next bot"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Bottom Dots Navigation & "SCROLL TO EXPLORE ∨" */}
          <div className="mt-2 sm:mt-3 flex flex-col items-center gap-1.5">
            {/* 5 Pagination Dots */}
            <div className="flex items-center gap-2">
              {BOT_NAMES.map((name, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={name}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                    aria-label={`Select ${name}`}
                    className={`size-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#84cc16] scale-125 ring-2 ring-lime-400/40"
                        : "bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                );
              })}
            </div>

            {/* Scroll indicator button */}
            <a
              href="#computer-showcase"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-colors pt-1 group"
            >
              <span>scroll to explore</span>
              <ChevronDown className="size-3 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
