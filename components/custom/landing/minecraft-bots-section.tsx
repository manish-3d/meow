"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { 
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
      <div className="w-full h-[440px] sm:h-[500px] lg:h-[540px] flex flex-col items-center justify-center bg-neutral-50/50 rounded-3xl border border-black/5 animate-pulse">
        <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
          <Sparkles className="size-4 animate-spin text-lime-500" />
          <span>Generating procedural 3D voxel islands...</span>
        </div>
      </div>
    ),
  }
);

const BOT_DATA = [
  {
    name: "Coding Bot",
    icon: "</>",
    description: "Plan, write, debug, and ship code.",
  },
  {
    name: "Research Bot",
    icon: "🔍",
    description: "Search, read, and summarize the web.",
  },
  {
    name: "Agent Builder",
    icon: "📦",
    description: "Create and customize your own AI agents.",
  },
  {
    name: "Notes Bot",
    icon: "📄",
    description: "Capture, organize, and turn ideas into knowledge.",
  },
  {
    name: "Social Media Bot",
    icon: "📢",
    description: "Create, schedule, and grow your presence.",
  },
];

const BOT_NAMES = BOT_DATA.map((b) => b.name);

export function MinecraftBotsSection() {
  const [activeIndex, setActiveIndex] = useState(2); // Agent Builder is center active by default
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? BOT_NAMES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === BOT_NAMES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="bots" className="relative pt-16 pb-8 sm:pt-20 sm:pb-12 scroll-mt-24 bg-white text-[#131316] overflow-hidden">
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

        {/* --- 3D PROCEDURAL VOXEL SCENE (Pulled right up directly under the text) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full -mt-6 sm:-mt-10 lg:-mt-12"
        >
          {/* Three.js Canvas with enlarged bots and zero gap below text */}
          <VoxelBotsCanvas
            activeIndex={activeIndex}
            onSelectBot={setActiveIndex}
            hoveredIndex={hoveredIndex}
            onHoverBot={setHoveredIndex}
          />

          {/* Desktop & Tablet: Subtitle Descriptions under each Island matching Reference Image */}
          <div className="hidden md:grid grid-cols-5 gap-3 sm:gap-6 max-w-6xl mx-auto -mt-6 sm:-mt-8 px-4 text-center relative z-10">
            {BOT_DATA.map((bot, idx) => (
              <div
                key={bot.name}
                onClick={() => setActiveIndex(idx)}
                className={`cursor-pointer transition-all duration-300 p-2 rounded-xl ${
                  activeIndex === idx
                    ? "opacity-100 font-medium text-neutral-900 scale-102"
                    : "opacity-60 hover:opacity-90 text-neutral-600"
                }`}
              >
                <p className="text-xs sm:text-sm font-sans leading-relaxed">
                  {bot.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Quick Carousel Navigation (Hidden on Tablet & Desktop) */}
          <div className="flex sm:hidden items-center justify-between w-full max-w-xs mx-auto -mt-6 px-4 relative z-10">
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

          {/* Active Bot Description on Mobile */}
          <div className="block sm:hidden text-center mt-3 px-6">
            <p className="text-xs font-sans text-neutral-600 leading-relaxed">
              {BOT_DATA[activeIndex].description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
