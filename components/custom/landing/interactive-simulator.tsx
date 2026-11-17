"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Terminal, 
  Calendar,
  Layers,
  ChevronRight,
  Bot,
  Mail,
  Zap,
  RefreshCw,
  Cpu
} from "lucide-react";

interface Step {
  id: string;
  category: "INTENT PARSER" | "TIMEZONE SYNC" | "TOOL VAULT" | "INNGEST ENGINE" | "EXECUTION LOG";
  label: string;
  detail: string;
  badge: string;
}

const SIMULATOR_STEPS: Step[] = [
  {
    id: "step-1",
    category: "INTENT PARSER",
    label: "Gemini 2.5 Multi-Turn Reasoning",
    detail: "Parses prompt: 'say hi to manishsinghjio135@gmail.com in 9 pm today' -> extracts recipient, message, and target hour.",
    badge: "Prompt Analyzed",
  },
  {
    id: "step-2",
    category: "TIMEZONE SYNC",
    label: "Continent & Timezone Translation",
    detail: "Resolves Asia/Calcutta (IST) to 03:30 PM UTC. Calculates recurring daily cron expression.",
    badge: "Asia/Calcutta",
  },
  {
    id: "step-3",
    category: "TOOL VAULT",
    label: "OAuth Tool Verification",
    detail: "Validates Gmail connection status from authenticated Composio session with active token vault.",
    badge: "Gmail Verified",
  },
  {
    id: "step-4",
    category: "INNGEST ENGINE",
    label: "Durable Inngest Scheduling",
    detail: "Registers durable step function with automatic exponential retry policy and serverless execution.",
    badge: "Durable Cron Live",
  },
  {
    id: "step-5",
    category: "EXECUTION LOG",
    label: "Live Telemetry & Run History",
    detail: "Run #662540 logged: email successfully delivered via Gmail API with 200 OK status.",
    badge: "Run Completed",
  },
];

export function InteractiveSimulator() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % SIMULATOR_STEPS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = SIMULATOR_STEPS[activeStepIndex];

  return (
    <section id="simulator" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 mb-2 font-semibold">
            INNGEST DURABLE ORCHESTRATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            Turn any conversation into a durable autonomous routine
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Chat with your Meow Bot agent in plain English. It analyzes your request, verifies connected tools,
            and schedules a persistent background routine that executes reliably forever.
          </p>

          <Link href="/workspace" className="mt-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-black transition-all hover:bg-neutral-100 hover:border-black/30 shadow-xs"
            >
              <span>TEST IN LIVE WORKSPACE</span>
              <span className="text-xs">↗</span>
            </button>
          </Link>
        </div>

        {/* 3-Column Interactive Simulator Container */}
        <div className="relative rounded-3xl border border-black/10 bg-white p-4 sm:p-8 shadow-sm overflow-hidden">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-black/8 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs uppercase font-semibold text-neutral-800">
                ACTIVE AGENT: social media bot • Gemini 2.5 Flash • Autonomous Mode
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-neutral-50 px-3 py-1 font-mono text-xs text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-3 text-neutral-700" />
                  <span>PAUSE SIMULATOR</span>
                </>
              ) : (
                <>
                  <Play className="size-3 text-neutral-700" />
                  <span>PLAY SIMULATOR</span>
                </>
              )}
            </button>
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Real Meow Bot Chat Card (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-black/8 bg-neutral-50 p-4 sm:p-5 flex flex-col gap-4">
              {/* Agent Bar */}
              <div className="flex items-center justify-between border-b border-black/6 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-900 text-white font-mono text-xs">
                    🤖
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-neutral-900 block leading-tight">
                      social media bot
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Gemini 2.5 Flash • Composio Native Tools
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Live
                </span>
              </div>

              {/* Chat Message: User */}
              <div className="self-end max-w-[85%] rounded-2xl rounded-tr-xs bg-neutral-900 text-white p-3 font-sans text-xs leading-relaxed shadow-2xs">
                say hi to manishsinghjio135@gmail.com in 9 pm today
                <span className="block text-[9px] text-white/50 text-right mt-1 font-mono">08:45 PM</span>
              </div>

              {/* Chat Message: Meow Bot Routine Card */}
              <div className="self-start w-full rounded-2xl rounded-tl-xs bg-white border border-black/10 p-4 shadow-sm flex flex-col gap-3">
                <p className="text-xs text-neutral-700 font-sans leading-relaxed">
                  I have prepared the automated routine to send your greeting to Manish at 9:00 PM IST today. Review the details below and click Create Routine to schedule it.
                </p>

                {/* The Routine Draft Box */}
                <div className="rounded-xl border border-black/8 bg-neutral-50 p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-sans font-semibold text-xs text-neutral-900">
                      <Sparkles className="size-3.5 text-amber-500" />
                      <span>Send Greeting to Manish</span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-neutral-200/80 text-neutral-700 px-1.5 py-0.5 rounded font-bold">
                      ROUTINE DRAFT
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 font-sans">
                    Send a 'Hi' email to manishsinghjio135@gmail.com at 9:00 PM IST.
                  </p>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-600 pt-1 border-t border-black/6">
                    <Calendar className="size-3 text-neutral-400" />
                    <span>Daily</span>
                    <span>•</span>
                    <Clock className="size-3 text-neutral-400" />
                    <span>03:30 PM UTC • Asia/Calcutta</span>
                  </div>

                  <div className="mt-1 pt-1 border-t border-black/6 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-500">REQUIRED TOOLS:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-emerald-600" /> Gmail Connected
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] text-neutral-400">
                    Executes via Inngest scheduler
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 font-mono text-xs font-semibold text-white shadow-xs hover:bg-neutral-800"
                  >
                    <span>+ Create Routine</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Column: Visual Pipeline Connector (2 cols) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center gap-3">
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />
              <div className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white shadow-xs text-neutral-700 font-mono text-xs font-bold">
                →
              </div>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest text-center">
                INNGEST PIPELINE
              </span>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />
            </div>

            {/* Right Column: Meow Bot Real Execution Steps (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {SIMULATOR_STEPS.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <motion.div
                    key={step.id}
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setIsPlaying(false);
                    }}
                    whileHover={{ scale: 1.01 }}
                    className={`cursor-pointer rounded-xl p-3 sm:p-3.5 border transition-all duration-300 ${
                      isActive
                        ? "border-[#00D26A] bg-emerald-500/[0.04] shadow-sm"
                        : "border-black/8 bg-white hover:border-black/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-mono text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                            isActive
                              ? "bg-[#00D26A] text-black"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {step.category}
                        </span>
                        <span className="font-mono text-xs font-semibold text-neutral-900">
                          {step.label}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500">
                        {step.badge}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-neutral-600 font-sans leading-relaxed">
                      {step.detail}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}