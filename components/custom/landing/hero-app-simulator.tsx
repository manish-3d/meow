"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Plus, 
  Mic, 
  Send, 
  Calendar, 
  Clock, 
  Check, 
  CheckCircle2, 
  Globe, 
  ChevronRight, 
  Settings2, 
  Sliders, 
  Share2, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from "lucide-react";

interface BotItem {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  avatarChar: string;
  previewText: string;
  hasWaitingBadge?: boolean;
  model: string;
  routines: { name: string; schedule: string; active: boolean }[];
  morningSummary: { bot: string; action: string; note: string }[];
}

const BOTS: BotItem[] = [
  {
    id: "meow-bot",
    name: "meow bot",
    role: "Lead Coordinator",
    avatarColor: "#7C5CFC",
    avatarChar: "🐱",
    previewText: "Waiting for you: It is optional, and your day would end at 4:00.",
    hasWaitingBadge: true,
    model: "Claude 3.7 Sonnet",
    routines: [
      { name: "Morning brief", schedule: "Every weekday at 8:00 AM", active: true },
      { name: "Friday wrap-up", schedule: "Fridays at 5:00 PM", active: false },
    ],
    morningSummary: [
      { bot: "inbox", action: "Sorted 63 emails, drafted 4 replies", note: "3 need you" },
      { bot: "researcher", action: "Compared 3 CRMs & compiled pricing table", note: "Ready" },
      { bot: "bookkeeper", action: "Closed October & reconciled Stripe charges", note: "Done" },
      { bot: "coder", action: "Fixed checkout bug on Safari iOS", note: "PR merged" },
    ],
  },
  {
    id: "researcher",
    name: "researcher",
    role: "Web & Market Intelligence",
    avatarColor: "#3B82F6",
    avatarChar: "🔍",
    previewText: "Compared 3 CRMs. Here's how they compare on seats and API limits.",
    model: "Gemini 2.5 Flash",
    routines: [
      { name: "Competitor scrape", schedule: "Every Monday at 9:00 AM", active: true },
      { name: "HN digest", schedule: "Daily at 10:00 PM", active: true },
    ],
    morningSummary: [
      { bot: "researcher", action: "Crawled 40 product tabs & generated markdown matrix", note: "Done" },
    ],
  },
  {
    id: "content-writer",
    name: "content writer",
    role: "Release Notes & Social",
    avatarColor: "#EC4899",
    avatarChar: "📝",
    previewText: "Drafted 2 LinkedIn posts and 1 X thread from yesterday's GitHub commits.",
    model: "GPT-4o",
    routines: [
      { name: "Weekly social queue", schedule: "Mondays at 8:30 AM", active: true },
    ],
    morningSummary: [
      { bot: "writer", action: "Converted ship logs into 3 release tweets", note: "Drafts saved" },
    ],
  },
  {
    id: "inbox-helper",
    name: "inbox helper",
    role: "Email & Calendar Triage",
    avatarColor: "#2563EB",
    avatarChar: "✉️",
    previewText: "Sent. I'll let you know as soon as Sarah answers.",
    model: "Gemini 2.5 Flash",
    routines: [
      { name: "Inbox triage", schedule: "Runs every 2 hours", active: true },
      { name: "VIP alert", schedule: "Instant trigger on client email", active: true },
    ],
    morningSummary: [
      { bot: "inbox", action: "Categorized 54 newsletters and prioritized 3 investor emails", note: "Cleared" },
    ],
  },
  {
    id: "coder-cat",
    name: "coder cat",
    role: "Full-Stack Dev & Bug Fixer",
    avatarColor: "#0284C7",
    avatarChar: "💻",
    previewText: "Waiting for you: Load time dropped from 4.1s to 1.6s.",
    hasWaitingBadge: true,
    model: "Claude 3.7 Sonnet",
    routines: [
      { name: "Nightly CI check", schedule: "Midnight every night", active: true },
      { name: "Dependency audit", schedule: "Sundays at 11:00 PM", active: false },
    ],
    morningSummary: [
      { bot: "coder", action: "Optimized image loading in hero component", note: "1.6s bench" },
    ],
  },
  {
    id: "bookkeeper",
    name: "bookkeeper",
    role: "Accounting & Subscriptions",
    avatarColor: "#F97316",
    avatarChar: "📊",
    previewText: "Matched 18 charges to invoices. 1 subscription price increase detected.",
    hasWaitingBadge: true,
    model: "Claude 3.7 Sonnet",
    routines: [
      { name: "Monthly close", schedule: "1st of every month", active: true },
    ],
    morningSummary: [
      { bot: "bookkeeper", action: "Flagged $12 price increase on cloud hosting", note: "Warning" },
    ],
  },
  {
    id: "sports-analysis",
    name: "sports analysis",
    role: "Odds & Match Feeds",
    avatarColor: "#EAB308",
    avatarChar: "🏀",
    previewText: "Evaluated 12 games tonight. Key injury report updated.",
    model: "Gemini 2.5 Flash",
    routines: [
      { name: "Pre-game rollup", schedule: "Daily at 5:00 PM", active: true },
    ],
    morningSummary: [
      { bot: "sports", action: "Scraped live player stats and injury statuses", note: "Calculated" },
    ],
  },
];

export function HeroAppSimulator() {
  const [activeBotId, setActiveBotId] = useState("meow-bot");
  const [declined, setDeclined] = useState(false);
  const [activeTab, setActiveTab] = useState<"Details" | "Computer" | "Advanced">("Details");
  const [routinesState, setRoutinesState] = useState<Record<string, boolean>>({
    "Morning brief": true,
    "Friday wrap-up": false,
  });

  const activeBot = BOTS.find((b) => b.id === activeBotId) || BOTS[0];

  const handleToggleRoutine = (name: string) => {
    setRoutinesState((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 mt-8 sm:mt-12">
      {/* Sky-Blue Framed Canvas (Just like dusk.bot) */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#00A3FF] p-3 sm:p-6 shadow-2xl overflow-hidden border border-black/10">
        {/* Pixel Art Cloud & Sun Accents in Background */}
        <div className="absolute top-3 right-8 opacity-40 select-none pointer-events-none">
          <svg width="64" height="24" viewBox="0 0 32 12" style={{ shapeRendering: "crispEdges" }}>
            <rect x="8" y="0" width="16" height="4" fill="#FFFFFF" />
            <rect x="4" y="4" width="24" height="4" fill="#FFFFFF" />
            <rect x="0" y="8" width="32" height="4" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="absolute top-4 left-10 opacity-30 select-none pointer-events-none">
          <svg width="48" height="18" viewBox="0 0 32 12" style={{ shapeRendering: "crispEdges" }}>
            <rect x="8" y="0" width="16" height="4" fill="#FFFFFF" />
            <rect x="4" y="4" width="24" height="4" fill="#FFFFFF" />
            <rect x="0" y="8" width="32" height="4" fill="#FFFFFF" />
          </svg>
        </div>

        {/* macOS Desktop Window Frame */}
        <div className="rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-black/15 flex flex-col text-[#131316]">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#F9F9FB] border-b border-black/8 select-none">
            {/* macOS Window Controls */}
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
              <span className="size-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
              <span className="size-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
            </div>

            {/* Window Title */}
            <div className="font-mono text-xs text-neutral-600 font-medium">
              meow bot
            </div>

            {/* Live Demo Affordance Pill */}
            <div className="font-mono text-[11px] text-neutral-500 bg-neutral-200/60 px-2 py-0.5 rounded-full">
              a live demo. click around.
            </div>
          </div>

          {/* 3-Pane Desktop App Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px] bg-white divide-y md:divide-y-0 md:divide-x divide-black/8">
            {/* Pane 1: Left Bot Crew Sidebar (3.5 cols) */}
            <div className="md:col-span-4 lg:col-span-3.5 flex flex-col justify-between bg-[#FCFCFD] p-2.5 sm:p-3">
              <div>
                {/* Search Bar & New Bot */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="flex-1 flex items-center gap-2 rounded-xl bg-neutral-100/80 px-2.5 py-1.5 border border-black/5 text-xs text-neutral-500">
                    <Search className="size-3.5 text-neutral-400" />
                    <span className="text-[11px] font-sans">Search bots...</span>
                  </div>
                  <button
                    type="button"
                    className="flex size-7 items-center justify-center rounded-xl bg-neutral-100 border border-black/5 hover:bg-neutral-200 text-neutral-700"
                    title="Create new bot"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                {/* Bot List */}
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[380px] pr-1">
                  {BOTS.map((bot) => {
                    const isSelected = bot.id === activeBotId;
                    return (
                      <button
                        key={bot.id}
                        type="button"
                        onClick={() => setActiveBotId(bot.id)}
                        className={`w-full text-left p-2 rounded-xl flex items-start gap-2.5 transition-all ${
                          isSelected
                            ? "bg-neutral-100/90 shadow-2xs border border-black/6"
                            : "hover:bg-neutral-50 border border-transparent"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sm shadow-xs border border-black/5"
                          style={{ backgroundColor: bot.avatarColor + "18" }}
                        >
                          <span>{bot.avatarChar}</span>
                        </div>

                        {/* Bot Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold text-neutral-900 truncate">
                              {bot.name}
                            </span>
                            {bot.hasWaitingBadge && (
                              <span className="size-2 rounded-full bg-amber-500" title="Waiting for input" />
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-500 font-sans truncate mt-0.5 leading-tight">
                            {bot.previewText}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Sidebar: User & App Connections */}
              <div className="pt-2 border-t border-black/8 flex items-center justify-between text-[11px] font-sans">
                <div className="flex items-center gap-1.5">
                  <div className="size-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
                    M
                  </div>
                  <span className="font-medium text-neutral-800">Manish Singh</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-black/5">
                  <span>Connect apps</span>
                  <span className="text-[9px]">✉️ 📅 💬</span>
                </div>
              </div>
            </div>

            {/* Pane 2: Middle Chat & Overnight Work Area (5 cols) */}
            <div className="md:col-span-8 lg:col-span-5 flex flex-col justify-between bg-white p-3 sm:p-5">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-3 border-b border-black/6">
                <div className="flex items-center gap-2">
                  <span className="text-base">{activeBot.avatarChar}</span>
                  <div>
                    <h3 className="font-sans text-xs font-bold text-neutral-900">
                      {activeBot.name}
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {activeBot.role} • {activeBot.model}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  active now
                </span>
              </div>

              {/* Chat Conversation Scroll Area */}
              <div className="flex-1 py-4 flex flex-col gap-3 overflow-y-auto max-h-[360px]">
                {/* Overnight Work Table */}
                <div className="rounded-2xl border border-black/8 bg-neutral-50/80 p-3 flex flex-col gap-2 font-sans text-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 pb-1.5 border-b border-black/6">
                    <span>OVERNIGHT CREW ACTIVITY</span>
                    <span className="text-[10px] text-emerald-600 font-mono">AUTONOMOUS</span>
                  </div>

                  {activeBot.morningSummary.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b border-black/4 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-800 capitalize">{item.bot}</span>
                        <span className="text-neutral-600 truncate max-w-[190px]">{item.action}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500 shrink-0">{item.note}</span>
                    </div>
                  ))}
                </div>

                {/* Assistant Conversational Message */}
                <div className="self-start max-w-[95%] rounded-2xl bg-neutral-100/70 p-3.5 text-xs text-neutral-800 font-sans leading-relaxed flex flex-col gap-2">
                  <p>
                    Megan moved your 11:30 to 2:00. I updated your calendar and accepted.
                  </p>
                  <p>
                    Want me to decline the optional 4:30 sync? It would end your workday at 4:00.
                  </p>
                </div>

                {/* Interactive Decision Card */}
                {!declined ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="self-start rounded-2xl border border-black/10 bg-white p-3 shadow-xs flex flex-col gap-2 max-w-[90%]"
                  >
                    <span className="text-[11px] text-neutral-500 font-sans">
                      It is optional, and your day would end at 4:00.
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeclined(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-3.5 py-2 text-xs font-medium text-white hover:bg-neutral-800 transition-all active:scale-95 shadow-sm"
                    >
                      <span className="flex size-4 items-center justify-center rounded bg-white/20 text-[10px] font-mono">
                        A
                      </span>
                      <span>Yes, decline it</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="self-start rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-sans flex items-center gap-2 shadow-2xs"
                  >
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Declined! Sent notice to attendees. Your afternoon is clear after 4:00.</span>
                  </motion.div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="pt-2 border-t border-black/6">
                <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-neutral-50 px-3 py-2 shadow-2xs">
                  <button type="button" className="text-neutral-400 hover:text-neutral-700">
                    <Plus className="size-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your answer, or instruct your bot..."
                    className="flex-1 bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none font-sans"
                  />
                  <button type="button" className="text-neutral-400 hover:text-neutral-700">
                    <Mic className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="size-6 rounded-lg bg-black text-white flex items-center justify-center hover:bg-neutral-800 shadow-2xs"
                  >
                    <Send className="size-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pane 3: Right Inspector & Routines Panel (3.5 cols) */}
            <div className="hidden lg:flex lg:col-span-3.5 flex-col justify-between bg-[#FCFCFD] p-4 text-xs font-sans">
              <div>
                {/* Big Pixel Icon of Selected Bot */}
                <div className="flex flex-col items-center text-center pb-4 border-b border-black/8">
                  <div
                    className="flex size-14 items-center justify-center rounded-2xl text-2xl shadow-inner border border-black/10 mb-2"
                    style={{ backgroundColor: activeBot.avatarColor + "15" }}
                  >
                    <span>{activeBot.avatarChar}</span>
                  </div>
                  <h4 className="font-sans font-bold text-sm text-neutral-900">
                    {activeBot.name}
                  </h4>
                  <span className="text-[11px] text-neutral-500 font-sans mt-0.5">
                    {activeBot.role}
                  </span>

                  {/* Tabs: Details | Computer | Advanced */}
                  <div className="mt-3 flex items-center gap-1 rounded-lg bg-neutral-100 p-0.5 font-mono text-[10px]">
                    {(["Details", "Computer", "Advanced"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          activeTab === tab
                            ? "bg-white text-black font-bold shadow-2xs"
                            : "text-neutral-500 hover:text-black"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Routines Section */}
                <div className="py-3 border-b border-black/8 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-700 font-mono uppercase">
                    <span>Routines</span>
                    <span className="text-[9px] text-neutral-400">INNGEST CRON</span>
                  </div>

                  {activeBot.routines.map((routine) => {
                    const isActive = routinesState[routine.name] ?? routine.active;
                    return (
                      <div
                        key={routine.name}
                        className="flex items-center justify-between p-2 rounded-xl bg-neutral-100/70 border border-black/5"
                      >
                        <div>
                          <div className="font-semibold text-neutral-900 text-[11px]">
                            {routine.name}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            {routine.schedule}
                          </div>
                        </div>

                        {/* Interactive Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleRoutine(routine.name)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? "bg-black" : "bg-neutral-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                              isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Model & Multi-Key Info */}
                <div className="py-3 border-b border-black/8 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 font-mono uppercase text-[10px]">Model Brain</span>
                    <span className="font-semibold text-neutral-800 flex items-center gap-1 font-mono text-[11px]">
                      <span>{activeBot.model}</span>
                      <ChevronDown className="size-3 text-neutral-400" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 font-mono uppercase text-[10px]">API Keys</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      2 Keys Active (BYOK)
                    </span>
                  </div>
                </div>

                {/* Usage Meter */}
                <div className="pt-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-500">Usage</span>
                    <span className="font-bold text-neutral-800">8% used</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: "8%" }} />
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono">
                    Weekly quota resets in 2 days
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-3 border-t border-black/8 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>Memory: 14 saved rules</span>
                <span className="text-neutral-900 font-semibold cursor-pointer hover:underline">Edit →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}