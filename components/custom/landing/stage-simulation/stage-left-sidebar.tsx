"use client";

import React from "react";
import Image from "next/image";
import { 
  Plus, 
  LayoutGrid, 
  Bot, 
  Store, 
  ChevronRight,
  PanelLeftClose
} from "lucide-react";

interface LeftSidebarProps {
  activeBotId?: string;
  onSelectBot?: (botId: string) => void;
}

export function StageLeftSidebar({ activeBotId = "research-bot", onSelectBot }: LeftSidebarProps) {
  const agents = [
    { id: "research-bot", name: "research bot", avatar: "/simulation/avatar_research.png" },
    { id: "social-bot", name: "social media bot", avatar: "/simulation/avatar_social.png" },
    { id: "coding-bot", name: "coding bot", avatar: "/simulation/avatar_coding.png" },
    { id: "job-bot", name: "job bot", avatar: "/simulation/avatar_job.png" },
  ];

  return (
    <aside className="w-[210px] sm:w-[225px] shrink-0 border-r border-black/[0.08] bg-white flex flex-col justify-between p-3 select-none text-[#131316] h-full shadow-xs">
      {/* ── 1. HEADER BRAND & COLLAPSE ICON ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-black/[0.05]">
          <div className="flex items-center gap-2">
            {/* Pixel Cat Icon in rounded black box */}
            <div className="size-7 rounded-lg bg-black flex items-center justify-center text-white shadow-2xs overflow-hidden">
              <Image
                src="/simulation/meow_logo.png"
                alt="Meow Bot"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-xs tracking-tight text-neutral-900 leading-none">Meow Bot</h3>
              <p className="text-[8.5px] text-neutral-400 font-mono tracking-wider uppercase mt-0.5">
                AI AGENT CLOUD
              </p>
            </div>
          </div>

          <button type="button" className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            <PanelLeftClose className="size-3.5" />
          </button>
        </div>

        {/* ── 2. BLACK "+ Create New Agent" BUTTON ── */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-neutral-950 hover:bg-black text-white text-[11px] font-semibold tracking-tight shadow-2xs hover:shadow transition-all active:scale-[0.98]"
        >
          <Plus className="size-3" />
          <span>+ Create New Agent</span>
        </button>

        {/* ── 3. INTERACTIVE NAVIGATION LINKS (EXACT MOCKUP SAGE GREENS) ── */}
        <div className="space-y-0.5 pt-0.5">
          {/* Workspace (Active state: #ecefe8 bg with #6e9e35 indicator bar) */}
          <div className="relative flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#ecefe8] text-neutral-900 font-semibold text-xs border border-[#d5dfcc]/60 cursor-pointer shadow-2xs">
            <div className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-[#6e9e35]" />
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-3.5 text-neutral-800" />
              <span>Workspace</span>
            </div>
          </div>

          {/* Agents (with sage pill badge 3) */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100/70 text-xs font-medium cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Bot className="size-3.5 text-neutral-500" />
              <span>Agents</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#ecefe8] text-[#6e9e35] px-1.5 py-0.2 rounded-full border border-[#d5dfcc]">
              3
            </span>
          </div>

          {/* Marketplace */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100/70 text-xs font-medium cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Store className="size-3.5 text-neutral-500" />
              <span>Marketplace</span>
            </div>
          </div>
        </div>

        {/* ── 4. "YOUR AGENTS" SECTION WITH VOXEL FACE AVATARS ── */}
        <div className="pt-1.5">
          <div className="flex items-center justify-between px-1.5 pb-1">
            <span className="text-[11px] font-bold text-neutral-900">Your Agents</span>
            <Plus className="size-3 text-neutral-400 cursor-pointer hover:text-neutral-900" />
          </div>

          <div className="space-y-0.5">
            {agents.map((agent) => {
              const isActive = activeBotId === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => onSelectBot?.(agent.id)}
                  className={`flex items-center justify-between px-2 py-1.2 rounded-lg text-xs cursor-pointer transition-all ${
                    isActive
                      ? "bg-neutral-100/90 text-neutral-900 font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100/50 font-normal"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {/* Real Voxel Avatar Icon from Mockup */}
                    <div className="size-4.5 rounded-sm overflow-hidden shrink-0 border border-black/10">
                      <Image
                        src={agent.avatar}
                        alt={agent.name}
                        width={18}
                        height={18}
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate text-[11px]">{agent.name}</span>
                  </div>

                  <span className="size-1.5 rounded-full bg-[#6e9e35] shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 5. FOOTER: WORLD STATUS, PRO PLAN, PROFILE (MATCHING MOCKUP) ── */}
      <div className="pt-2 border-t border-black/[0.06] space-y-2">
        {/* World Status: Online with grass block */}
        <div className="p-2 rounded-xl bg-neutral-50/90 border border-black/[0.06] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Image
                src="/simulation/icon_grass_block.png"
                alt="World"
                width={15}
                height={15}
                className="object-contain shrink-0"
              />
              <span className="font-bold text-neutral-900 text-[10.5px]">World Status</span>
            </div>
            <span className="flex items-center gap-1 text-[9.5px] text-[#6e9e35] font-bold">
              <span className="size-1.5 rounded-full bg-[#6e9e35] animate-pulse" />
              <span>Online</span>
            </span>
          </div>
          <p className="text-[9px] text-neutral-500 leading-none">Workspace environment active</p>
          <div className="w-full h-1 rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full rounded-full bg-[#6e9e35] w-full" />
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className="p-2 rounded-xl bg-neutral-50/90 border border-black/[0.06] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Image
                src="/simulation/icon_pro_plan.png"
                alt="Pro"
                width={15}
                height={15}
                className="object-contain shrink-0"
              />
              <span className="font-bold text-neutral-900 text-[10.5px]">Pro Plan</span>
            </div>
            <span className="text-[8.5px] font-mono text-neutral-500">12,430 / 25,000</span>
          </div>
          <div className="w-full h-1 rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full rounded-full bg-[#6e9e35] w-1/2" />
          </div>
          <p className="text-[8.5px] text-neutral-400 font-mono">50% used</p>
        </div>

        {/* Manish Singh User Profile Chip */}
        <div className="flex items-center justify-between p-1 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="size-6.5 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
              N
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-900 leading-tight">Manish Singh</p>
              <p className="text-[9px] text-neutral-400 font-mono">Pro Plan</p>
            </div>
          </div>
          <ChevronRight className="size-3 text-neutral-400" />
        </div>
      </div>
    </aside>
  );
}
