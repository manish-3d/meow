"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Calendar, 
  MessageSquare, 
  Github, 
  Music, 
  Phone, 
  Globe, 
  Code2, 
  Layers, 
  Check, 
  Sparkles,
  ArrowRight
} from "lucide-react";

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
    <section className="py-24 sm:py-32 bg-white text-[#131316]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
            you can call them too. and they plug into 60+ apps.
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans">
            no need to learn new tools. meow bot connects directly to the apps already on your screen.
          </p>
        </div>

        {/* 12 App Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
          {APPS.map((app) => (
            <div
              key={app.name}
              onMouseEnter={() => setHoveredApp(app)}
              onMouseLeave={() => setHoveredApp(null)}
              className="group cursor-pointer rounded-2xl border border-black/8 bg-[#F9F9FB] p-3.5 flex flex-col items-center text-center hover:bg-white hover:border-black/20 hover:shadow-md transition-all duration-200"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-2xs border border-black/5 text-lg mb-2 group-hover:scale-110 transition-transform">
                <span>{app.iconChar}</span>
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
        <div className="mt-8 min-h-[44px] flex items-center justify-center">
          {hoveredApp ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-neutral-100 px-4 py-2 text-xs font-sans text-neutral-800 shadow-2xs animate-in fade-in zoom-in-95">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>
                <strong>{hoveredApp.name}:</strong> "{hoveredApp.commandSnippet}"
              </span>
            </div>
          ) : (
            <span className="font-mono text-xs text-neutral-400">
              hover any app to see a real automation prompt ↑
            </span>
          )}
        </div>
      </div>
    </section>
  );
}