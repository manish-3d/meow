"use client";

import React from "react";
import { 
  Bot, 
  Plus, 
  LayoutGrid, 
  Store, 
  Search, 
  Share2, 
  Code2, 
  Briefcase, 
  Sparkles,
  Zap,
  MoreVertical,
  CheckCircle2
} from "lucide-react";

interface LeftSidebarProps {
  activeBotId?: string;
  onSelectBot?: (botId: string) => void;
}

export function StageLeftSidebar({ activeBotId = "research-bot", onSelectBot }: LeftSidebarProps) {
  const agents = [
    {
      id: "research-bot",
      name: "research bot",
      role: "Web Intelligence",
      icon: Search,
      color: "from-blue-500 to-indigo-600",
      accent: "text-blue-500",
      status: "online",
      pulseColor: "bg-blue-500",
    },
    {
      id: "social-bot",
      name: "social media bot",
      role: "X & LinkedIn Growth",
      icon: Share2,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-500",
      status: "online",
      pulseColor: "bg-emerald-500",
    },
    {
      id: "coding-bot",
      name: "coding bot",
      role: "Autonomous Engineer",
      icon: Code2,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-500",
      status: "online",
      pulseColor: "bg-emerald-500",
    },
    {
      id: "job-bot",
      name: "job bot",
      role: "Career Pipeline",
      icon: Briefcase,
      color: "from-purple-500 to-indigo-600",
      accent: "text-purple-500",
      status: "online",
      pulseColor: "bg-emerald-500",
    },
  ];

  return (
    <aside className="w-[230px] sm:w-[250px] shrink-0 border-r border-black/[0.07] bg-white/80 backdrop-blur-md flex flex-col justify-between p-3.5 select-none text-[#131316] h-full">
      {/* 1. TOP HEADER & BRAND */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <div className="flex items-center gap-2">
            {/* Pixel Cat Icon */}
            <div className="size-7 rounded-lg bg-[#7C5CFC] flex items-center justify-center text-white shadow-xs">
              <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="3" height="3" />
                <rect x="11" y="2" width="3" height="3" />
                <rect x="2" y="5" width="12" height="8" rx="1" />
                <rect x="4" y="7" width="2" height="2" fill="#7C5CFC" />
                <rect x="10" y="7" width="2" height="2" fill="#7C5CFC" />
                <rect x="7" y="10" width="2" height="1" fill="#7C5CFC" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-neutral-900">meow bot</span>
                <span className="px-1 py-0.2 rounded bg-neutral-100 text-[9px] font-mono text-neutral-600 border border-neutral-200">
                  CLOUD
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">ai agent platform</p>
            </div>
          </div>

          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" title="System Connected" />
        </div>

        {/* 2. PRIMARY ACTION: CREATE AGENT BUTTON */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-medium tracking-tight shadow-sm hover:shadow transition-all active:scale-[0.98]"
        >
          <Plus className="size-3.5" />
          <span>+ Create New Agent</span>
        </button>

        {/* 3. NAVIGATION LINKS */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#7C5CFC]/10 text-[#7C5CFC] font-semibold text-xs border border-[#7C5CFC]/15 cursor-pointer">
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-3.5 text-[#7C5CFC]" />
              <span>Workspace</span>
            </div>
            <span className="text-[9px] font-mono font-medium bg-[#7C5CFC]/20 px-1.5 py-0.2 rounded">active</span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100/70 text-xs font-medium cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Bot className="size-3.5 text-neutral-400" />
              <span>Agents</span>
            </div>
            <span className="text-[9px] font-mono bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-500 border border-neutral-200">
              4
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100/70 text-xs font-medium cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Store className="size-3.5 text-neutral-400" />
              <span>Marketplace</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded border border-amber-200">
              12 new
            </span>
          </div>
        </div>

        {/* 4. "YOUR AGENTS" LIVE CREW ROSTER */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-2.5 pb-1.5">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
              Your Agents
            </span>
            <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-600 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>4 ready</span>
            </span>
          </div>

          <div className="space-y-1">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isActive = activeBotId === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => onSelectBot?.(agent.id)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? "bg-white shadow-xs border border-black/[0.08] text-neutral-900 font-semibold"
                      : "text-neutral-600 hover:bg-neutral-100/60 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className={`size-5 rounded-md bg-gradient-to-tr ${agent.color} flex items-center justify-center text-white shrink-0 shadow-2xs`}>
                      <Icon className="size-3" />
                    </div>
                    <span className="truncate">{agent.name}</span>
                  </div>

                  <span className={`size-1.5 rounded-full ${agent.pulseColor} shrink-0`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. PRO PLAN METER & USER PROFILE (PERSISTENT FOOTER) */}
      <div className="pt-3 border-t border-black/[0.06] space-y-2.5">
        {/* Isometric Resource Usage Meter */}
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100/80 border border-black/[0.06] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-neutral-800 flex items-center gap-1">
              <Zap className="size-3 text-[#7C5CFC]" />
              <span>Pro Plan</span>
            </span>
            <span className="font-mono text-neutral-500">50% used</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-200/80 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#7C5CFC] to-indigo-500 w-1/2" />
          </div>
          <p className="text-[9px] text-neutral-400 font-mono">4/8 cloud VMs running</p>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-neutral-100/60 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              M
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 leading-tight">Manish Singh</p>
              <p className="text-[10px] text-neutral-400 font-mono">Pro Workspace</p>
            </div>
          </div>
          <MoreVertical className="size-3.5 text-neutral-400" />
        </div>
      </div>
    </aside>
  );
}
