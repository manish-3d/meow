"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Clock,
  Globe,
  Repeat,
  Zap,
  CheckCircle2,
  Lock,
  Bot,
  User,
  Plus,
  ArrowUp,
  RefreshCw,
  Play,
  Calendar,
  Settings2,
  Wrench,
  Monitor,
  Check,
} from "lucide-react";

export function HeroStageshowDemo() {
  const [activeTab, setActiveTab] = useState<"chat" | "schedule" | "vm">("chat");

  return (
    <div className="relative mx-auto max-w-5xl rounded-2xl border border-border-subtle bg-surface-1 shadow-2xl overflow-hidden group">
      {/* Window Chrome Header (Stageshow Pattern) */}
      <div className="h-10 px-4 border-b border-border-subtle bg-surface-2/60 flex items-center justify-between gap-3 select-none">
        {/* Window Dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="size-2.5 rounded-full bg-rose-500/80 border border-rose-600/40" />
          <div className="size-2.5 rounded-full bg-amber-500/80 border border-amber-600/40" />
          <div className="size-2.5 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
        </div>

        {/* Address Bar Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-1 border border-border-subtle text-[11px] font-mono text-muted-foreground max-w-xs w-full justify-center shadow-2xs">
          <Lock className="size-2.5 text-emerald-500" />
          <span className="truncate">meow-bot.app/workspace/social-media-bot</span>
        </div>

        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground shrink-0">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Gemini 2.5 Flash • Composio Native</span>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px] bg-surface-0">
        {/* Left Mini Sidebar (3 cols) */}
        <div className="hidden md:flex flex-col col-span-3 border-r border-border-subtle bg-surface-1 p-3 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="text-[11px] font-semibold text-foreground tracking-tight">Your Agents</span>
            <span className="text-[9px] font-mono bg-surface-2 px-1.5 py-0.5 rounded text-muted-foreground border border-border-subtle">3</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 p-2 rounded-lg text-xs text-muted-foreground hover:bg-surface-2/50 transition-colors cursor-pointer">
              <span className="size-2 rounded-full bg-muted-foreground/40" />
              <span className="truncate">sports analysis</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg text-xs text-muted-foreground hover:bg-surface-2/50 transition-colors cursor-pointer">
              <span className="size-2 rounded-full bg-muted-foreground/40" />
              <span className="truncate">aru assistant</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg text-xs bg-surface-2 text-foreground font-medium border border-border-subtle cursor-pointer shadow-2xs">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="truncate">social media bot</span>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-border-subtle">
            <button className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium rounded-md border border-border-subtle bg-surface-2 text-foreground hover:bg-surface-3 transition-colors">
              <Plus className="size-3" />
              <span>Create Agent</span>
            </button>
          </div>
        </div>

        {/* Center Chat Viewport (6 cols) */}
        <div className="col-span-12 md:col-span-6 flex flex-col justify-between p-4 space-y-3 bg-surface-0">
          {/* Agent Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-foreground">social media bot</span>
              <span className="text-[10px] text-muted-foreground font-mono">Autonomous</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono tabular-nums">08:45 PM</span>
          </div>

          {/* Conversation Stream */}
          <div className="space-y-3 overflow-y-auto">
            {/* User message */}
            <div className="flex gap-2.5 max-w-[90%] ml-auto flex-row-reverse">
              <div className="size-6 rounded-md bg-surface-2 border border-border-subtle flex items-center justify-center text-muted-foreground shrink-0 shadow-2xs">
                <User className="size-3" />
              </div>
              <div className="px-3 py-2 rounded-xl rounded-tr-xs bg-primary text-primary-foreground text-xs leading-relaxed shadow-xs">
                say hi to manishsinghjio135@gmail.com in 9 pm today
              </div>
            </div>

            {/* Agent response with Linear-style Routine Card */}
            <div className="flex gap-2.5 max-w-[95%] mr-auto">
              <div className="size-6 rounded-md bg-surface-2 border border-border-subtle flex items-center justify-center text-foreground shrink-0 shadow-2xs">
                <Bot className="size-3" />
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-xs leading-relaxed text-foreground/90">
                  I have prepared the automated routine to send your greeting to Manish at 9:00 PM IST today. Review the details below.
                </p>

                {/* The Upgraded Precision Routine Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border border-border-subtle bg-surface-1 p-3.5 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded bg-surface-2 border border-border-subtle flex items-center justify-center text-foreground">
                        <Sparkles className="size-2.5" />
                      </span>
                      <span className="text-xs font-semibold text-foreground tracking-tight">
                        Send Greeting to Manish
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                      <span className="size-1 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-7 line-clamp-1">
                    Send a 'Hi' email to manishsinghjio135@gmail.com at 9:00 PM IST.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 rounded-md bg-surface-2/60 px-2.5 py-1.5 text-[10px] font-mono border border-border-subtle tabular-nums">
                    <span className="flex items-center gap-1 text-foreground font-medium font-sans">
                      <Zap className="size-2.5 text-amber-500" />
                      <span>Run Once</span>
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="flex items-center gap-1 text-foreground">
                      <Clock className="size-2.5 text-muted-foreground" />
                      <span>03:30 PM UTC</span>
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-muted-foreground flex items-center gap-0.5">
                      <Globe className="size-2 text-muted-foreground" />
                      Asia/Calcutta
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[10px]">
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-mono text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="size-2.5" />
                      Gmail Connected
                    </span>
                    <span className="text-muted-foreground font-mono text-[9px]">
                      Executes via Inngest
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Input Box Mock */}
          <div className="pt-2 border-t border-border-subtle">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-subtle bg-surface-1 text-xs text-muted-foreground">
              <span className="truncate">Message social media bot...</span>
              <span className="ml-auto size-5 rounded bg-primary text-primary-foreground flex items-center justify-center">
                <ArrowUp className="size-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Right Configuration / Schedule Drawer (3 cols) */}
        <div className="hidden md:flex flex-col col-span-3 border-l border-border-subtle bg-surface-1 p-3 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="text-[11px] font-semibold text-foreground">Schedule Hub</span>
            <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-1">
              <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* Active Routine Card */}
          <div className="p-2.5 rounded-lg border border-border-subtle bg-surface-2/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground truncate">Daily Unread Summary</span>
              <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                Active
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
              <Clock className="size-2.5 text-muted-foreground" />
              <span>08:00 AM UTC • Daily</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[9px] font-mono">
              <span className="text-muted-foreground">Last: 10:34 PM</span>
              <span className="text-primary font-medium flex items-center gap-0.5">
                <Check className="size-2.5" />
                Durable
              </span>
            </div>
          </div>

          {/* Execution History */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Execution History
            </span>

            <div className="p-2 rounded border border-border-subtle bg-surface-0 flex items-center justify-between text-[10px] font-mono tabular-nums">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-2.5 text-emerald-500" />
                <span className="text-foreground font-semibold">#662540</span>
              </div>
              <span className="text-emerald-500 text-[9px]">completed</span>
              <span className="text-muted-foreground text-[9px]">10:34 PM</span>
            </div>

            <div className="p-2 rounded border border-border-subtle bg-surface-0 flex items-center justify-between text-[10px] font-mono tabular-nums">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-foreground font-semibold">#611512</span>
              </div>
              <span className="text-primary text-[9px]">running</span>
              <span className="text-muted-foreground text-[9px]">10:33 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Cursor Badge Overlay (Stageshow Pattern) */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="absolute bottom-6 right-6 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2/95 border border-border-subtle shadow-xl backdrop-blur-md pointer-events-none"
      >
        <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[11px] font-mono text-foreground font-medium">
          Durable Cron Orchestration Active
        </span>
      </motion.div>
    </div>
  );
}
