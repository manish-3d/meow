"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { 
  Search, 
  Globe, 
  Code2, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";

// Dynamically import the Three.js R3F Canvas with ssr: false
const VoxelBotsCanvas = dynamic(
  () => import("./voxel-bots/voxel-bots-canvas").then((mod) => mod.VoxelBotsCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] sm:h-[620px] lg:h-[700px] flex flex-col items-center justify-center bg-neutral-50/50 rounded-3xl border border-black/5 animate-pulse">
        <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
          <Sparkles className="size-4 animate-spin text-lime-500" />
          <span>Generating procedural 3D voxel islands...</span>
        </div>
      </div>
    ),
  }
);

interface BotData {
  id: string;
  name: string;
  icon: React.ReactNode;
  tag: string;
  badgeLabel: string;
  storyboardTitle: string;
  storyboardMotion: string;
  roleDescription: string;
  tools: string[];
  isBuilder?: boolean;
}

const BOTS: BotData[] = [
  {
    id: "researcher",
    name: "Researcher",
    icon: <Search className="size-4" />,
    tag: "01",
    badgeLabel: "Researcher",
    storyboardTitle: "Researcher",
    storyboardMotion: "Pages flip, insights scan with a magnifier.",
    roleDescription: "Synthesizes thousands of documentation pages, compares frameworks, and surfaces key insights.",
    tools: ["Deep Web Search", "PDF Extractor", "Memory DB"],
  },
  {
    id: "browser",
    name: "Browser",
    icon: <Globe className="size-4" />,
    tag: "02",
    badgeLabel: "Browser",
    storyboardTitle: "Browser",
    storyboardMotion: "Opens a browser, switches tabs, and fetches info.",
    roleDescription: "Navigates live websites with a dedicated Chromium sandbox, interacts with complex web apps, and extracts data.",
    tools: ["Cloud Chromium", "DOM Clicker", "Session Vault"],
  },
  {
    id: "builder",
    name: "Builder",
    icon: <Code2 className="size-4" />,
    tag: "03",
    badgeLabel: "Builder",
    storyboardTitle: "Builder",
    storyboardMotion: "Code cube rotates, laptop types, and code glows.",
    roleDescription: "Writes full-stack code, executes terminal scripts, resolves bugs, and builds entire features autonomously.",
    tools: ["Node / Python VM", "Git Integration", "Docker Sandbox"],
    isBuilder: true,
  },
  {
    id: "operator",
    name: "Operator",
    icon: <Calendar className="size-4" />,
    tag: "04",
    badgeLabel: "Operator",
    storyboardTitle: "Operator",
    storyboardMotion: "Tasks get checked off, calendar page flips.",
    roleDescription: "Runs daily morning routines, triages inboxes, schedules meetings, and monitors background triggers.",
    tools: ["Gmail API", "Google Calendar", "Cron Scheduler"],
  },
  {
    id: "creator",
    name: "Creator",
    icon: <Sparkles className="size-4" />,
    tag: "05",
    badgeLabel: "Creator",
    storyboardTitle: "Creator",
    storyboardMotion: "Camera flashes, and media cards pop out.",
    roleDescription: "Generates high-craft landing pages, writes marketing copy, renders visual assets, and polishes UX.",
    tools: ["Image Studio", "Copy Engine", "Component Canvas"],
  },
];

export function MinecraftBotsSection() {
  const [activeIndex, setActiveIndex] = useState(2); // Builder is center active by default
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeBot = BOTS[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? BOTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === BOTS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="bots" className="relative pt-12 pb-24 bg-white text-[#131316] overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_15%,rgba(163,230,53,0.06),transparent_80%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Eyebrow: "— DIFFERENT BOTS —" (Exact Reference Image 1 & 3) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 text-neutral-400 font-mono text-xs uppercase tracking-[0.25em]"
        >
          <span className="w-8 h-px bg-neutral-300" />
          <span>DIFFERENT BOTS</span>
          <span className="w-8 h-px bg-neutral-300" />
        </motion.div>

        {/* Title: "Different bots. Different superpowers." */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 font-sans"
        >
          Different bots. Different superpowers.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-3 text-sm sm:text-base text-neutral-500 max-w-xl font-sans"
        >
          Specialist AI agents each with their own computer, browser, and memory. Hover or tap any bot to test their abilities.
        </motion.p>

        {/* --- 3D PROCEDURAL VOXEL SCENE --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full mt-4 sm:mt-6"
        >
          {/* Three.js Canvas */}
          <VoxelBotsCanvas
            activeIndex={activeIndex}
            onSelectBot={setActiveIndex}
            hoveredIndex={hoveredIndex}
            onHoverBot={setHoveredIndex}
          />

          {/* Island Badges Aligned Underneath (Desktop 5-Column Grid) */}
          <div className="hidden md:grid grid-cols-5 gap-3 max-w-5xl mx-auto -mt-6 sm:-mt-10 px-4 relative z-10">
            {BOTS.map((bot, index) => {
              const isActive = activeIndex === index;
              const isHovered = hoveredIndex === index;

              return (
                <button
                  key={bot.id}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  type="button"
                  className={`group relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-mono text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                    bot.isBuilder
                      ? isActive || isHovered
                        ? "bg-[#bef264] text-neutral-950 shadow-lg shadow-lime-300/40 scale-105 border border-lime-400"
                        : "bg-[#e2ff85] text-neutral-900 border border-lime-300 shadow-sm hover:scale-102"
                      : isActive || isHovered
                      ? "bg-white text-neutral-950 border border-black/15 shadow-md scale-105"
                      : "bg-white/80 backdrop-blur-xs text-neutral-600 border border-black/8 hover:text-black hover:border-black/15 shadow-2xs"
                  }`}
                >
                  <span className={bot.isBuilder ? "text-neutral-950" : "text-neutral-500 group-hover:text-black"}>
                    {bot.icon}
                  </span>
                  <span>{bot.badgeLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex md:hidden items-center justify-between w-full max-w-xs mx-auto -mt-8 px-4 relative z-10">
            <button
              onClick={handlePrev}
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-white border border-black/10 shadow-sm text-neutral-700 active:scale-90"
              aria-label="Previous bot"
            >
              <ChevronLeft className="size-4" />
            </button>

            <span className="font-mono text-xs font-semibold px-4 py-1.5 rounded-full bg-white border border-black/10 shadow-2xs">
              {activeBot.name}
            </span>

            <button
              onClick={handleNext}
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-white border border-black/10 shadow-sm text-neutral-700 active:scale-90"
              aria-label="Next bot"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Bottom Dots Navigation & "SCROLL TO EXPLORE ∨" */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3">
            {/* 5 Pagination Dots */}
            <div className="flex items-center gap-2">
              {BOTS.map((bot, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={bot.id}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                    aria-label={`Select ${bot.name}`}
                    className={`size-2.5 rounded-full transition-all duration-300 cursor-pointer ${
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
              className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors pt-2 group"
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
