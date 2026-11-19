"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Globe,
  Share2,
  Code2,
  Briefcase,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  GitPullRequest,
  Check,
  Copy,
  TrendingUp,
} from "lucide-react";

interface BotCardsGridProps {
  phase: number; // 3 to 6
}

export function StageBotCardsGrid({ phase }: BotCardsGridProps) {
  // Live typing code simulation for Coding Bot
  const fullCode = `export async function delegateAgentTask(agent: Agent) {
  const sandbox = await meowCloud.spawnSandbox({
    runtime: "chromium-headless",
    memory: "4GB"
  });
  return await sandbox.execute(agent.workflow);
}`;
  const [codeText, setCodeText] = useState("");

  useEffect(() => {
    if (phase < 4) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % (fullCode.length + 20);
      setCodeText(fullCode.slice(0, Math.min(idx, fullCode.length)));
    }, 45);
    return () => clearInterval(interval);
  }, [phase]);

  // Live timer for Research Bot
  const [researchSeconds, setResearchSeconds] = useState(84);
  useEffect(() => {
    if (phase < 3) return;
    const interval = setInterval(() => {
      setResearchSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const showResearch = phase >= 3;
  const showOthers = phase >= 4;

  return (
    <div className="relative w-full h-full p-3 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 overflow-hidden">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP-LEFT: RESEARCH BOT (Spawns in Frame 3)              */}
      {/* ────────────────────────────────────────────────────────── */}
      {showResearch && (
        <motion.div
          key="card-research"
          initial={{ scale: 0, opacity: 0, x: 40, y: 30 }}
          animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative rounded-2xl bg-white/95 backdrop-blur-md border border-black/[0.08] p-3 sm:p-3.5 shadow-md flex flex-col justify-between overflow-hidden group hover:border-[#7C5CFC]/40 transition-colors"
        >
          {/* Card Chrome / Header */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-2xs">
                  <Search className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 leading-none">research bot</h4>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Browsing AI agent trends</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-[9.5px] font-mono text-blue-700 border border-blue-200">
                  <span className="size-1 rounded-full bg-blue-600 animate-ping" />
                  <span>
                    {Math.floor(researchSeconds / 60)}m {researchSeconds % 60}s
                  </span>
                </span>
              </div>
            </div>

            {/* Nested Browser Tab Preview */}
            <div className="mt-2.5 rounded-xl border border-black/[0.08] bg-neutral-50/80 p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 border-b border-black/[0.05] pb-1.5">
                <div className="flex items-center gap-1 truncate max-w-[190px]">
                  <Globe className="size-3 text-blue-500" />
                  <span className="truncate">arxiv.org/abs/2502.agentic-systems</span>
                </div>
                <span className="text-[9px] text-[#65a30d] font-semibold bg-[#f7fee7] border border-[#d9f99d] px-1 rounded">200 OK</span>
              </div>

              <div className="space-y-1">
                <h5 className="text-[11px] font-semibold text-neutral-800 leading-snug">
                  Autonomous Multi-Agent Coordination in 2025
                </h5>
                <p className="text-[9.5px] text-neutral-500 line-clamp-2 leading-relaxed">
                  Deep comparison of self-directing LLM agents executing persistent browser sandboxes, local memory, and headless terminal actions.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-neutral-400">
                <span>Extracted: 18 key citations</span>
                <span className="text-[#7C5CFC] font-semibold flex items-center gap-0.5">
                  Summarized <CheckCircle2 className="size-2.5 text-[#84cc16]" />
                </span>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-2 pt-2 border-t border-black/[0.05] flex items-center justify-between text-[10px] text-neutral-500">
            <span className="font-mono">Model: Claude 3.7 Sonnet</span>
            <span className="font-semibold text-neutral-700">Memory: 128 MB</span>
          </div>
        </motion.div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. TOP-RIGHT: SOCIAL MEDIA BOT (Spawns in Frame 4)         */}
      {/* ────────────────────────────────────────────────────────── */}
      {showOthers && (
        <motion.div
          key="card-social"
          initial={{ scale: 0, opacity: 0, x: -30, y: 30, rotate: 2 }}
          animate={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.05 }}
          className="relative rounded-2xl bg-white/95 backdrop-blur-md border border-black/[0.08] p-3 sm:p-3.5 shadow-md flex flex-col justify-between overflow-hidden group hover:border-amber-400/50 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-2xs">
                  <Share2 className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 leading-none">social media bot</h4>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Viral queue generator</p>
                </div>
              </div>

              <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-[9.5px] font-mono text-amber-700 border border-amber-200">
                Scheduled 09:00 AM
              </span>
            </div>

            {/* Post Draft Preview Box */}
            <div className="mt-2.5 rounded-xl border border-black/[0.08] bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-neutral-700 flex items-center gap-1">
                  <span>X / Twitter Thread</span>
                  <span className="text-neutral-400">&bull; Draft #03</span>
                </span>
                <span className="text-[9px] font-mono bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                  <TrendingUp className="size-2.5" /> 94% Viral
                </span>
              </div>

              <p className="text-[10px] text-neutral-700 font-sans leading-relaxed">
                "We replaced 4 SaaS tools with autonomous bots that run on isolated VMs. Zero API markups, 100% private key control. Here is our architecture: 🧵👇"
              </p>

              <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 pt-1">
                <span className="px-1.5 py-0.5 bg-neutral-100 rounded">#AI</span>
                <span className="px-1.5 py-0.5 bg-neutral-100 rounded">#DevTools</span>
                <span className="px-1.5 py-0.5 bg-neutral-100 rounded">#BuildInPublic</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-black/[0.05] flex items-center justify-between text-[10px] text-neutral-500">
            <span className="font-mono">Platform: X & LinkedIn</span>
            <span className="text-[#65a30d] font-semibold flex items-center gap-1">
              <Check className="size-3 text-[#84cc16]" /> Auto-publish Armed
            </span>
          </div>
        </motion.div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. BOTTOM-LEFT: CODING BOT (Spawns in Frame 4)             */}
      {/* ────────────────────────────────────────────────────────── */}
      {showOthers && (
        <motion.div
          key="card-coding"
          initial={{ scale: 0, opacity: 0, x: 30, y: -30, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.1 }}
          className="relative rounded-2xl bg-[#0f1117] text-neutral-200 border border-white/10 p-3 sm:p-3.5 shadow-md flex flex-col justify-between overflow-hidden group hover:border-[#84cc16]/40 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-[#84cc16] text-white flex items-center justify-center shadow-2xs">
                  <Code2 className="size-3.5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">coding bot</h4>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">branch: feat/vector-search</p>
                </div>
              </div>

              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#84cc16]/10 text-[9.5px] font-mono text-[#a3e635] border border-[#84cc16]/30">
                <GitPullRequest className="size-2.5" /> PR #42 Ready
              </span>
            </div>

            {/* Simulated Inline IDE Code Editor */}
            <div className="mt-2.5 rounded-xl bg-black/60 border border-white/10 p-2 font-mono text-[9px] sm:text-[9.5px] leading-relaxed overflow-hidden h-[95px] flex flex-col justify-start">
              <div className="flex items-center justify-between text-neutral-500 text-[8px] pb-1 border-b border-white/5 mb-1">
                <span>agent-dispatcher.ts</span>
                <span>TypeScript</span>
              </div>
              <pre className="text-[#bef264] font-mono whitespace-pre-wrap select-none">
                <code>
                  {codeText}
                  <span className="inline-block w-1.5 h-3 bg-[#bef264] ml-0.5 animate-pulse align-middle" />
                </code>
              </pre>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
            <span className="font-mono">Engine: DeepSeek R1</span>
            <span className="text-[#bef264] font-semibold">Checks: 14 Passing</span>
          </div>
        </motion.div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. BOTTOM-RIGHT: JOB BOT (Spawns in Frame 4)               */}
      {/* ────────────────────────────────────────────────────────── */}
      {showOthers && (
        <motion.div
          key="card-job"
          initial={{ scale: 0, opacity: 0, x: -30, y: -30, rotate: 2 }}
          animate={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.15 }}
          className="relative rounded-2xl bg-white/95 backdrop-blur-md border border-black/[0.08] p-3 sm:p-3.5 shadow-md flex flex-col justify-between overflow-hidden group hover:border-purple-400/50 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-2xs">
                  <Briefcase className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 leading-none">job bot</h4>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Autonomous job pipeline</p>
                </div>
              </div>

              <span className="px-1.5 py-0.5 rounded-full bg-purple-50 text-[9.5px] font-mono text-purple-700 border border-purple-200">
                12 matches found
              </span>
            </div>

            {/* Job Application Mini Table */}
            <div className="mt-2.5 rounded-xl border border-black/[0.08] bg-neutral-50/70 p-2 space-y-1.5">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-black/[0.05] text-[10px] shadow-2xs">
                <div className="truncate">
                  <p className="font-semibold text-neutral-800 truncate">Staff Frontend Engineer</p>
                  <p className="text-[9px] text-neutral-500">Stripe &bull; Remote ($240k - $290k)</p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#f7fee7] border border-[#d9f99d] text-[#65a30d] font-mono text-[9px] font-semibold shrink-0">
                  Applied
                </span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-black/[0.05] text-[10px] shadow-2xs">
                <div className="truncate">
                  <p className="font-semibold text-neutral-800 truncate">AI Agent Systems Lead</p>
                  <p className="text-[9px] text-neutral-500">Vercel &bull; San Francisco / Remote</p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono text-[9px] font-semibold shrink-0">
                  Resume Tailored
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-black/[0.05] flex items-center justify-between text-[10px] text-neutral-500">
            <span className="font-mono">Sync: Notion Database</span>
            <span className="text-[#7C5CFC] font-semibold">Daily Auto-Apply: ON</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
