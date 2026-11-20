"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BrandIcon } from "./brand-logos";

// Dynamically import LiquidCircles with SSR disabled for Three.js canvas
const LiquidCircles = dynamic(
  () => import("./liquid-circles").then((mod) => mod.LiquidCircles),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#f0fff6]" />,
  }
);

interface AppItem {
  name: string;
  category: string;
  iconChar: string;
  commandSnippet: string;
}

const APPS: AppItem[] = [
  { name: "Gmail", category: "Email", iconChar: "✉️", commandSnippet: "Draft replies in your tone & float the urgent 3" },
  { name: "Google Calendar", category: "Meetings", iconChar: "📅", commandSnippet: "Auto-resolve conflicts & decline optional late calls" },
  { name: "Slack", category: "Channels", iconChar: "💬", commandSnippet: "Post daily project standup rollups to #team" },
  { name: "Notion", category: "Notes", iconChar: "📝", commandSnippet: "Sync meeting action items directly into your wiki" },
  { name: "GitHub", category: "Code", iconChar: "🐙", commandSnippet: "Review PR diffs, check CI runs, and fix lint errors" },
  { name: "Spotify", category: "Audio", iconChar: "🎵", commandSnippet: "Start deep focus lo-fi playlist when coder bot starts" },
  { name: "WhatsApp", category: "Chat", iconChar: "📱", commandSnippet: "Send WhatsApp alert only if critical server crashes" },
  { name: "Chrome", category: "Browser", iconChar: "🌐", commandSnippet: "Read 40 tabs and extract product comparison table" },
  { name: "Linear", category: "Issues", iconChar: "🎯", commandSnippet: "Triage customer bug reports into prioritized tickets" },
  { name: "Figma", category: "Design", iconChar: "🎨", commandSnippet: "Export component assets and check icon spacing" },
  { name: "Discord", category: "Community", iconChar: "🎮", commandSnippet: "Summarize community support questions daily" },
  { name: "Zoom", category: "Video", iconChar: "📹", commandSnippet: "Prepare pre-call 3-bullet attendee briefing cards" },
];

export function IntegrationsStrip() {
  const [hoveredApp, setHoveredApp] = useState<AppItem | null>(null);

  return (
    <section className="relative w-full overflow-hidden py-20 sm:py-28 bg-[#f0fff6] text-[#131316]">
      {/* ── Liquid Circles Background with Exact User Configuration ── */}
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
          wheel={false}
          className="w-full h-full"
        />
      </div>

      {/* ── Content Foreground Overlay (Centered Heading & Interactive App Cards) ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pointer-events-none">
        {/* Section Header Centered */}
        <div className="max-w-3xl mb-12 sm:mb-16 pointer-events-auto">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none drop-shadow-2xs">
            you can call them too. and they plug into 60+ apps.
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans max-w-2xl mx-auto">
            no need to learn new tools. meow bot connects directly to the apps already on your screen.
          </p>
        </div>

        {/* 12 App Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 w-full pointer-events-auto">
          {APPS.map((app) => (
            <div
              key={app.name}
              onMouseEnter={() => setHoveredApp(app)}
              onMouseLeave={() => setHoveredApp(null)}
              className="group cursor-pointer rounded-2xl border border-black/[0.08] bg-white/85 backdrop-blur-md p-3.5 flex flex-col items-center text-center hover:bg-white hover:border-black/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 shadow-2xs"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-2xs border border-black/5 mb-2 group-hover:scale-110 transition-transform">
                <BrandIcon name={app.name} size={22} />
              </div>
              <span className="font-sans font-bold text-xs text-neutral-900">
                {app.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">
                {app.category}
              </span>
            </div>
          ))}
        </div>

        {/* Live Command Tooltip Preview */}
        <div className="mt-8 min-h-[44px] flex items-center justify-center pointer-events-auto">
          {hoveredApp ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 backdrop-blur-md px-4 py-2 text-xs font-sans text-neutral-800 shadow-md animate-in fade-in zoom-in-95">
              <BrandIcon name={hoveredApp.name} size={15} />
              <span>
                <strong>{hoveredApp.name}:</strong> "{hoveredApp.commandSnippet}"
              </span>
            </div>
          ) : (
            <span className="font-mono text-xs text-neutral-500 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-black/[0.06] shadow-2xs">
              hover any app to see a real automation prompt ↑
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
