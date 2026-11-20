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
    <aside className="w-[200px] sm:w-[215px] shrink-0 border-r border-black/[0.08] bg-white flex flex-col justify-between p-2.5 sm:p-3 select-none text-[#131316] h-full shadow-xs">
      {/* ── 1. HEADER BRAND & COLLAPSE ICON ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-black/[0.05]">
          <div className="flex items-center gap-2">
            {/* Voxel Cat App Logo in rounded squircle box */}
            <div className="size-7.5 rounded-lg overflow-hidden ring-1 ring-black/10 shadow-xs shrink-0 bg-white">
              <Image
                src="/logo.png"
                alt="Meow Bot"
                width={30}
                height={30}
                className="size-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-xs tracking-tight text-neutral-900 leading-none">Meow Bot</h3>
              <p className="text-[8.5px] text-neutral-400 font-mono tracking-wider uppercase mt-0.5">
                AI AGENT CLOUD
              </p>
            </div>
          </div>

          <button type="button" className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5">
            <PanelLeftClose className="size-3.5" />
          </button>
        </div>

        {/* ── 2. BLACK "+ Create New Agent" BUTTON ── */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-full bg-neutral-950 hover:bg-black text-white text-[11px] font-semibold tracking-tight shadow-sm hover:shadow transition-all active:scale-[0.98]"
        >
          <Plus className="size-3" />
          <span>+ Create New Agent</span>
        </button>

        {/* ── 3. INTERACTIVE NAVIGATION LINKS ── */}
        <div className="space-y-0.5 pt-0.5">
          {/* Workspace (Active state with light green background and vertical indicator bar) */}
          <div className="relative flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#f7fee7] text-neutral-900 font-semibold text-[11.5px] border border-[#d9f99d] cursor-pointer shadow-2xs">
            <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full bg-[#84cc16]" />
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-3 text-neutral-800" />
              <span>Workspace</span>
            </div>
          </div>

          {/* Agents (with light green pill badge 3) */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100/70 text-[11.5px] font-medium cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Bot className="size-3 text-neutral-500" />
              <span>Agents</span>
            </div>
            <span className="text-[9.5px] font-mono font-bold bg-[#f7fee7] text-[#65a30d] px-1.5 py-0.2 rounded-full border border-[#d9f99d]">
              3
            </span>
          </div>

          {/* Marketplace */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100/70 text-[11.5px] font-medium cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Store className="size-3 text-neutral-500" />
              <span>Marketplace</span>
            </div>
          </div>
        </div>

        {/* ── 4. "YOUR AGENTS" SECTION WITH VOXEL FACE AVATARS ── */}
        <div className="pt-1">
          <div className="flex items-center justify-between px-1.5 pb-1">
            <span className="text-[10.5px] font-bold text-neutral-900">Your Agents</span>
            <Plus className="size-2.5 text-neutral-500 cursor-pointer hover:text-neutral-900" />
          </div>

          <div className="space-y-0.5">
            {agents.map((agent) => {
              const isActive = activeBotId === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => onSelectBot?.(agent.id)}
                  className={`flex items-center justify-between px-2 py-1 rounded-lg text-[11px] cursor-pointer transition-all ${isActive
                    ? "bg-neutral-100/80 text-neutral-900 font-semibold"
                    : "text-neutral-700 hover:bg-neutral-100/50 font-normal"
                    }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {/* Voxel Cat Face Avatar */}
                    <div className="size-4.5 rounded-sm bg-neutral-200 flex items-center justify-center text-[10px] shrink-0 overflow-hidden border border-black/5">
                      🐱
                    </div>
                    <span className="truncate">{agent.name}</span>
                  </div>

                  <span className="size-1.5 rounded-full bg-[#84cc16] shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 5. FOOTER: WORLD STATUS, PRO PLAN, PROFILE (MATCHING MOCKUP) ── */}
      <div className="pt-1.5 border-t border-black/[0.06] space-y-1.5">
        {/* World Status: Online */}
        <div className="p-2 rounded-xl bg-neutral-50 border border-black/[0.06] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <GrassBlockIcon />
              <span className="font-bold text-neutral-900 text-[10.5px]">World Status</span>
            </div>
            <span className="flex items-center gap-1 text-[9.5px] text-[#65a30d] font-bold">
              <span className="size-1.5 rounded-full bg-[#84cc16] animate-pulse" />
              <span>Online</span>
            </span>
          </div>
          <div className="w-full h-1 rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full rounded-full bg-[#84cc16] w-full" />
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className="p-2 rounded-xl bg-neutral-50 border border-black/[0.06] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <VoxelFaceIcon />
              <span className="font-bold text-neutral-900 text-[10.5px]">Pro Plan</span>
            </div>
            <span className="text-[8.5px] font-mono text-neutral-500">12.4k / 25k</span>
          </div>
          <div className="w-full h-1 rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full rounded-full bg-[#84cc16] w-1/2" />
          </div>
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center justify-between p-1 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-1.5">
            <div className="size-6.5 rounded-full bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
              M
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-900 leading-tight">Manish Singh</p>
            </div>
          </div>
          <ChevronRight className="size-3 text-neutral-400" />
        </div>
      </div>
    </aside>
  );
}
