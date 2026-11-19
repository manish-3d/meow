"use client";

import React from "react";
import { 
  Plus, 
  LayoutGrid, 
  Bot, 
  Store, 
  ChevronRight,
  PanelLeftClose
} from "lucide-react";
import { GrassBlockIcon, VoxelFaceIcon } from "./voxel-assets";

interface LeftSidebarProps {
  activeBotId?: string;
  onSelectBot?: (botId: string) => void;
}

export function StageLeftSidebar({ activeBotId = "research-bot", onSelectBot }: LeftSidebarProps) {
  const agents = [
    { id: "research-bot", name: "research bot" },
    { id: "social-bot", name: "social media bot" },
    { id: "coding-bot", name: "coding bot" },
    { id: "job-bot", name: "job bot" },
  ];

  return (
    <aside className="w-[230px] sm:w-[250px] shrink-0 border-r border-black/[0.08] bg-white flex flex-col justify-between p-3.5 select-none text-[#131316] h-full shadow-xs">
      {/* ── 1. HEADER BRAND & COLLAPSE ICON ── */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
          <div className="flex items-center gap-2">
            {/* Voxel Cat Icon in rounded black box */}
            <div className="size-8 rounded-xl bg-black flex items-center justify-center text-white shadow-xs">
              <svg className="size-4.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="3" height="3" />
                <rect x="11" y="2" width="3" height="3" />
                <rect x="2" y="5" width="12" height="8" rx="1" />
                <rect x="4" y="7" width="2" height="2" fill="#000000" />
                <rect x="10" y="7" width="2" height="2" fill="#000000" />
                <rect x="7" y="10" width="2" height="1" fill="#000000" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-neutral-900 leading-none">Meow Bot</h3>
              <p className="text-[9px] text-neutral-400 font-mono tracking-wider uppercase mt-0.5">
                AI AGENT CLOUD
              </p>
            </div>
          </div>

          <button type="button" className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            <PanelLeftClose className="size-4" />
          </button>
        </div>

        {/* ── 2. BLACK "+ Create New Agent" BUTTON ── */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-neutral-950 hover:bg-black text-white text-xs font-semibold tracking-tight shadow-sm hover:shadow transition-all active:scale-[0.98]"
        >
          <Plus className="size-3.5" />
          <span>+ Create New Agent</span>
        </button>

        {/* ── 3. INTERACTIVE NAVIGATION LINKS ── */}
        <div className="space-y-1 pt-1">
          {/* Workspace (Active state with soft green background and vertical green indicator bar on left) */}
          <div className="relative flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/80 text-neutral-900 font-semibold text-xs border border-emerald-200/60 cursor-pointer shadow-2xs">
            <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-500" />
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="size-3.5 text-neutral-800" />
              <span>Workspace</span>
            </div>
          </div>

          {/* Agents (with green pill badge 3) */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100/70 text-xs font-medium cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <Bot className="size-3.5 text-neutral-500" />
              <span>Agents</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100/90 text-emerald-800 px-1.5 py-0.2 rounded-full border border-emerald-200">
              3
            </span>
          </div>

          {/* Marketplace */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100/70 text-xs font-medium cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <Store className="size-3.5 text-neutral-500" />
              <span>Marketplace</span>
            </div>
          </div>
        </div>

        {/* ── 4. "YOUR AGENTS" SECTION WITH VOXEL FACE AVATARS ── */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="text-[11px] font-bold text-neutral-900">Your Agents</span>
            <Plus className="size-3 text-neutral-500 cursor-pointer hover:text-neutral-900" />
          </div>

          <div className="space-y-1">
            {agents.map((agent) => {
              const isActive = activeBotId === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => onSelectBot?.(agent.id)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? "bg-neutral-100/80 text-neutral-900 font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100/50 font-normal"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {/* Voxel Cat Face Avatar */}
                    <div className="size-5 rounded-md bg-neutral-200 flex items-center justify-center text-xs shrink-0 overflow-hidden border border-black/5">
                      🐱
                    </div>
                    <span className="truncate">{agent.name}</span>
                  </div>

                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 5. FOOTER: WORLD STATUS, PRO PLAN, PROFILE (MATCHING MOCKUP) ── */}
      <div className="pt-2 border-t border-black/[0.06] space-y-2">
        {/* World Status: Online */}
        <div className="p-2.5 rounded-2xl bg-neutral-50 border border-black/[0.06] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <GrassBlockIcon />
              <span className="font-bold text-neutral-900 text-[11px]">World Status</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </span>
          </div>
          <p className="text-[9.5px] text-neutral-500 leading-none">Workspace environment active</p>
          <div className="w-full h-1.5 rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 w-full" />
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className="p-2.5 rounded-2xl bg-neutral-50 border border-black/[0.06] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <VoxelFaceIcon />
              <span className="font-bold text-neutral-900 text-[11px]">Pro Plan</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-500">12,430 / 25,000</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 w-1/2" />
          </div>
          <p className="text-[9.5px] text-neutral-400 font-mono">50% used</p>
        </div>

        {/* Manish Singh User Profile Chip */}
        <div className="flex items-center justify-between p-1.5 rounded-2xl hover:bg-neutral-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              M
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 leading-tight">Manish Singh</p>
              <p className="text-[10px] text-neutral-400 font-mono">Pro Plan</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-neutral-400" />
        </div>
      </div>
    </aside>
  );
}
