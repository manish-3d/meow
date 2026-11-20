"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { BrandIcon } from "./brand-logos";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import LiquidCircles with SSR disabled for Three.js WebGL canvas
const LiquidCircles = dynamic(
  () => import("./liquid-circles").then((mod) => mod.LiquidCircles),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#f0fff6]" />,
  }
);

interface AppAction {
  name: string;
  category: string;
  commandSnippet: string;
}

const APP_ACTIONS: Record<string, AppAction> = {
  Gmail: {
    name: "Gmail",
    category: "Email",
    commandSnippet: "Draft replies in your tone & float the urgent 3",
  },
  "Google Calendar": {
    name: "Google Calendar",
    category: "Meetings",
    commandSnippet: "Auto-resolve conflicts & decline optional late calls",
  },
  Slack: {
    name: "Slack",
    category: "Channels",
    commandSnippet: "Post daily project standup rollups to #team",
  },
  Notion: {
    name: "Notion",
    category: "Notes",
    commandSnippet: "Sync meeting action items directly into your wiki",
  },
  GitHub: {
    name: "GitHub",
    category: "Code",
    commandSnippet: "Review PR diffs, check CI runs, and fix lint errors",
  },
  Spotify: {
    name: "Spotify",
    category: "Audio",
    commandSnippet: "Start deep focus lo-fi playlist when coder bot starts",
  },
  WhatsApp: {
    name: "WhatsApp",
    category: "Chat",
    commandSnippet: "Send WhatsApp alert only if critical server crashes",
  },
  Chrome: {
    name: "Chrome",
    category: "Browser",
    commandSnippet: "Read 40 tabs and extract product comparison table",
  },
  Linear: {
    name: "Linear",
    category: "Issues",
    commandSnippet: "Triage customer bug reports into prioritized tickets",
  },
  Figma: {
    name: "Figma",
    category: "Design",
    commandSnippet: "Export component assets and check icon spacing",
  },
  Discord: {
    name: "Discord",
    category: "Community",
    commandSnippet: "Summarize community support questions daily",
  },
  Zoom: {
    name: "Zoom",
    category: "Video",
    commandSnippet: "Prepare pre-call 3-bullet attendee briefing cards",
  },
  ChatGPT: {
    name: "ChatGPT",
    category: "Intelligence",
    commandSnippet: "Run cross-model consensus and deep synthesis",
  },
  Claude: {
    name: "Claude",
    category: "Reasoning",
    commandSnippet: "Architect system refactoring and catch edge cases",
  },
  Supabase: {
    name: "Supabase",
    category: "Database",
    commandSnippet: "Run database migrations & test row level security",
  },
  Stripe: {
    name: "Stripe",
    category: "Payments",
    commandSnippet: "Reconcile daily MRR and flag subscription churn risks",
  },
};

const DEFAULT_CYCLE = [
  "Slack",
  "GitHub",
  "Gmail",
  "Linear",
  "Figma",
  "Spotify",
  "Notion",
  "WhatsApp",
];

export function IntegrationsStrip() {
  const [activeAppName, setActiveAppName] = useState<string>("Slack");
  const [isManualHover, setIsManualHover] = useState(false);

  // Auto-cycle through apps when user is not manually hovering
  useEffect(() => {
    if (isManualHover) return;
    const interval = setInterval(() => {
      setActiveAppName((prev) => {
        const idx = DEFAULT_CYCLE.indexOf(prev);
        const nextIdx = (idx + 1) % DEFAULT_CYCLE.length;
        return DEFAULT_CYCLE[nextIdx];
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [isManualHover]);

  const activeApp = APP_ACTIONS[activeAppName] || APP_ACTIONS["Slack"];

  const handleCircleHover = (_idx: number, name: string) => {
    if (name && APP_ACTIONS[name]) {
      setIsManualHover(true);
      setActiveAppName(name);
    } else {
      setIsManualHover(false);
    }
  };

  const handleCircleClick = (_idx: number, name: string) => {
    if (name && APP_ACTIONS[name]) {
      setIsManualHover(true);
      setActiveAppName(name);
    }
  };

  return (
    <section
      id="integrations"
      className="relative w-full h-[660px] sm:h-[720px] md:h-[780px] bg-[#f0fff6] overflow-hidden select-none flex items-center justify-center text-[#131316]"
    >
      {/* ── 3D Liquid Circles with Exact User Configuration & Continuous Orbit ── */}
      <div className="absolute inset-0 z-0">
        <LiquidCircles
          count={28}
          rings={5}
          size={0.24}
          tilt={19}
          angle={63}
          perspective={70}
          refraction={0}
          dispersion={0.9}
          flow={1.25}
          radius={0.15}
          sizeVariance={0.17}
          depth={0.21}
          backgroundColor={"#f0fff6"}
          speed={12}
          onCircleHover={handleCircleHover}
          onCircleClick={handleCircleClick}
          className="w-full h-full"
        />
      </div>

      {/* ── Center Content Overlay (Dead Center Inside Orbit) ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8 rounded-3xl flex flex-col items-center text-center pointer-events-none bg-radial from-[#f0fff6]/80 via-[#f0fff6]/40 to-transparent backdrop-blur-[2px]">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-100/90 text-emerald-800 border border-emerald-300/60 mb-4 shadow-2xs backdrop-blur-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          60+ Native Integrations
        </div>

        {/* Section Heading Centered */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight text-[#131316] max-w-2xl leading-[1.08] drop-shadow-2xs">
          you can call them too. and they plug into 60+ apps.
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-neutral-600 font-sans max-w-xl mx-auto leading-relaxed">
          no need to learn new tools. meow bot connects directly to the apps already on your screen.
        </p>

        {/* Dynamic Prompt Pill corresponding to revolving apps */}
        <div className="mt-6 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeApp.name}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 border border-black/[0.08] shadow-md backdrop-blur-md"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-50 border border-black/5 shadow-2xs shrink-0">
                <BrandIcon name={activeApp.name} size={18} />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans font-bold text-xs text-neutral-900">
                    {activeApp.name}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/50">
                    {activeApp.category}
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-600 mt-0.5">
                  &ldquo;{activeApp.commandSnippet}&rdquo;
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Orbit Interaction Hint */}
        <div className="mt-4 text-[11px] font-mono tracking-wider text-neutral-400 uppercase pointer-events-none">
          drag to spin 3d orbit • hover or click any app
        </div>
      </div>
    </section>
  );
}
