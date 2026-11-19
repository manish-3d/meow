"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
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
      <div className="w-full h-[400px] sm:h-[440px] lg:h-[460px] flex flex-col items-center justify-center bg-neutral-50/50 rounded-3xl border border-black/5 animate-pulse">
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

  const sectionRef = useRef<HTMLElement>(null);

  // --- Scroll-driven animation tracking (State A to State B and reverse) ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "center 38%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.001,
  });

  // State A: Compact initial view (progress 0) -> State B: Extended view (progress 1)
  const lineHeight = useTransform(smoothProgress, [0, 1], [24, 108]);
  const markerTop = useTransform(smoothProgress, [0, 1], [6, 48]);
  const cardY = useTransform(smoothProgress, [0, 1], [-48, 0]);
  const lineOpacity = useTransform(smoothProgress, [0, 1], [0.45, 1]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? BOT_NAMES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === BOT_NAMES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      id="bots"
      className="relative pt-16 pb-16 sm:pt-20 sm:pb-20 scroll-mt-24 bg-white text-[#131316] overflow-hidden select-none"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_15%,rgba(163,230,53,0.06),transparent_80%)]" />

      {/* Bottom-Left Decorative Minecraft Voxel Grass Terrain Accent */}
      <div className="pointer-events-none absolute bottom-0 left-0 hidden lg:block opacity-90 select-none z-0">
        <svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Block 1 (tall) */}
          <rect x="0" y="32" width="40" height="12" fill="#84cc16" />
          <rect x="0" y="44" width="40" height="52" fill="#78350f" opacity="0.85" />
          <rect x="4" y="48" width="8" height="8" fill="#451a03" opacity="0.6" />
          <rect x="22" y="60" width="8" height="8" fill="#451a03" opacity="0.6" />
          {/* Block 2 (medium) */}
          <rect x="40" y="56" width="40" height="10" fill="#a3e635" />
          <rect x="40" y="66" width="40" height="30" fill="#92400e" opacity="0.85" />
          <rect x="48" y="72" width="6" height="6" fill="#451a03" opacity="0.5" />
          {/* Block 3 (low) */}
          <rect x="80" y="74" width="40" height="8" fill="#bef264" />
          <rect x="80" y="82" width="40" height="14" fill="#a16207" opacity="0.8" />
        </svg>
      </div>

      {/* Bottom-Right Decorative Minecraft Voxel Grass Terrain Accent */}
      <div className="pointer-events-none absolute bottom-0 right-0 hidden lg:block opacity-90 select-none z-0">
        <svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Block 3 (low) */}
          <rect x="0" y="74" width="40" height="8" fill="#bef264" />
          <rect x="0" y="82" width="40" height="14" fill="#a16207" opacity="0.8" />
          {/* Block 2 (medium) */}
          <rect x="40" y="56" width="40" height="10" fill="#a3e635" />
          <rect x="40" y="66" width="40" height="30" fill="#92400e" opacity="0.85" />
          <rect x="62" y="72" width="6" height="6" fill="#451a03" opacity="0.5" />
          {/* Block 1 (tall) */}
          <rect x="80" y="32" width="40" height="12" fill="#84cc16" />
          <rect x="80" y="44" width="40" height="52" fill="#78350f" opacity="0.85" />
          <rect x="88" y="48" width="8" height="8" fill="#451a03" opacity="0.6" />
          <rect x="104" y="62" width="8" height="8" fill="#451a03" opacity="0.6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
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

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-lg font-sans"
        >
          Specialist AI agents each with their own computer, browser, and memory.
        </motion.p>

        {/* --- 3D PROCEDURAL VOXEL SCENE --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full -mt-4 sm:-mt-6 lg:-mt-8"
        >
          {/* Three.js Canvas with 5 floating islands and cat bots */}
          <VoxelBotsCanvas
            activeIndex={activeIndex}
            onSelectBot={setActiveIndex}
            hoveredIndex={hoveredIndex}
            onHoverBot={setHoveredIndex}
          />

          {/* Desktop & Tablet: Scroll-Driven Vertical Connections & Description Cards */}
          <div className="hidden md:block w-full max-w-6xl mx-auto px-4 relative z-20 -mt-20 sm:-mt-24 lg:-mt-28">
            <div className="grid grid-cols-5 gap-3 sm:gap-4 lg:gap-6 items-start">
              {BOT_DATA.map((bot, idx) => {
                const isBuilder = idx === 2;

                return (
                  <div
                    key={bot.name}
                    className="flex flex-col items-center"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Minimal Animated Connection Line & Square Marker */}
                    <div className="relative flex flex-col items-center w-full">
                      {/* Top anchor point */}
                      <div
                        className={`size-1.5 rounded-full ${
                          isBuilder ? "bg-lime-500" : "bg-lime-400/80"
                        }`}
                      />

                      {/* Animated vertical connection line */}
                      <motion.div
                        style={{
                          height: lineHeight,
                          opacity: lineOpacity,
                        }}
                        className={`w-[1.5px] relative flex items-center justify-center ${
                          isBuilder ? "bg-lime-400" : "bg-lime-300"
                        }`}
                      >
                        {/* Rounded square marker traveling along line */}
                        <motion.div
                          style={{ top: markerTop }}
                          className={`absolute left-1/2 -translate-x-1/2 size-[11px] rounded-[3px] transition-transform duration-200 ${
                            isBuilder
                              ? "bg-[#84cc16] border-[1.5px] border-[#65a30d] shadow-[0_0_8px_rgba(132,204,22,0.45)]"
                              : "bg-white border-[1.5px] border-[#bef264] shadow-2xs"
                          }`}
                        />
                      </motion.div>

                      {/* Bottom connection dot at description card */}
                      <div
                        className={`size-1.5 rounded-full ${
                          isBuilder ? "bg-lime-500" : "bg-lime-400/80"
                        }`}
                      />
                    </div>

                    {/* Animated Description Card */}
                    <motion.div
                      style={{ y: cardY }}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-full max-w-[205px] mt-2 px-3 sm:px-4 py-3.5 sm:py-4 rounded-2xl text-center cursor-pointer transition-all duration-300 ${
                        isBuilder
                          ? "bg-lime-50/25 border-2 border-lime-400 shadow-[0_4px_22px_rgba(163,230,53,0.18)] hover:shadow-[0_6px_28px_rgba(163,230,53,0.25)]"
                          : "bg-white border border-neutral-200/90 shadow-xs hover:border-neutral-300 hover:shadow-sm"
                      }`}
                    >
                      <p className="text-xs sm:text-[13px] font-sans text-neutral-800 leading-snug font-normal opacity-100">
                        {bot.description}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Quick Carousel Navigation (< 768px) */}
          <div className="flex md:hidden flex-col items-center w-full max-w-xs mx-auto -mt-6 px-4 relative z-20">
            {/* Minimal Mobile Connection Line */}
            <div className="relative flex flex-col items-center">
              <div
                className={`size-1.5 rounded-full ${
                  activeIndex === 2 ? "bg-lime-500" : "bg-lime-400/80"
                }`}
              />
              <div
                className={`w-[1.5px] h-9 relative flex items-center justify-center ${
                  activeIndex === 2 ? "bg-lime-400" : "bg-lime-300"
                }`}
              >
                <div
                  className={`size-[11px] rounded-[3px] ${
                    activeIndex === 2
                      ? "bg-[#84cc16] border-[1.5px] border-[#65a30d]"
                      : "bg-white border-[1.5px] border-[#bef264]"
                  }`}
                />
              </div>
              <div
                className={`size-1.5 rounded-full ${
                  activeIndex === 2 ? "bg-lime-500" : "bg-lime-400/80"
                }`}
              />
            </div>

            {/* Mobile Active Bot Description Card */}
            <div
              className={`w-full mt-2 px-4 py-3.5 rounded-2xl text-center ${
                activeIndex === 2
                  ? "bg-lime-50/25 border-2 border-lime-400 shadow-[0_4px_20px_rgba(163,230,53,0.15)]"
                  : "bg-white border border-neutral-200/90 shadow-xs"
              }`}
            >
              <p className="text-xs font-sans text-neutral-800 leading-relaxed font-normal opacity-100">
                {BOT_DATA[activeIndex].description}
              </p>
            </div>

            {/* Mobile Carousel Controls */}
            <div className="flex items-center justify-between w-full mt-4">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
