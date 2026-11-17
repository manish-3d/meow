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
  Key, 
  Terminal, 
  Zap,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
  Bot
} from "lucide-react";

interface Step {
  id: string;
  category: "TOOLS" | "ACCOUNTS" | "PERMISSIONS" | "SKILLS" | "INSTANT TOOLS";
  label: string;
  detail: string;
  badge: string;
  icon: string;
}

const EXECUTION_STEPS: Step[] = [
  {
    id: "step-1",
    category: "SKILLS",
    label: "Skills",
    detail: "Proven steps: loads 'Weekly Executive Briefing' routine",
    badge: "Routine Loaded",
    icon: "layers",
  },
  {
    id: "step-2",
    category: "ACCOUNTS",
    label: "Accounts",
    detail: "Authenticated OAuth session for manish@company.com",
    badge: "Gmail & Stripe",
    icon: "key",
  },
  {
    id: "step-3",
    category: "TOOLS",
    label: "Tools",
    detail: "Picks action: stripe.subscriptions.list & gmail.messages.send",
    badge: "2 Actions Selected",
    icon: "zap",
  },
  {
    id: "step-4",
    category: "PERMISSIONS",
    label: "Permissions",
    detail: "Read permissions auto-approved; bulk send evaluated against policy",
    badge: "Policy Pass",
    icon: "shield",
  },
  {
    id: "step-5",
    category: "INSTANT TOOLS",
    label: "Instant Tools",
    detail: "Generates formatted PDF report via sandbox code interpreter",
    badge: "Zero-Setup",
    icon: "terminal",
  },
];

export function InteractiveSimulator() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedModel, setSelectedModel] = useState<"gemini" | "claude">("gemini");

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % EXECUTION_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = EXECUTION_STEPS[activeStepIndex];

  return (
    <section id="use-cases" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            Make your AI finish what you ask
          </h2>
          <p className="mt-4 max-w-xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Meow Bot gives it the right tools, access to your accounts, and skills that already work,
            so it gets it right the first time.
          </p>

          <Link href="/workspace" className="mt-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-black transition-all hover:bg-neutral-100 hover:border-black/30 shadow-xs"
            >
              <span>TRY IT IN YOUR AI</span>
              <span className="text-xs">↗</span>
            </button>
          </Link>
        </div>

        {/* Interactive 3-Column Simulator Container */}
        <div className="relative rounded-3xl border border-black/10 bg-white p-4 sm:p-8 shadow-sm overflow-hidden">
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-black/8 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase font-semibold text-neutral-500">
                ACTIVE HARNESS:
              </span>
              <div className="inline-flex rounded-lg border border-black/10 bg-neutral-100 p-0.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedModel("gemini")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedModel === "gemini"
                      ? "bg-white text-black shadow-xs font-bold"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Gemini 2.5 Flash
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel("claude")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedModel === "claude"
                      ? "bg-white text-black shadow-xs font-bold"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Claude 3.7 Sonnet
                </button>
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-neutral-50 px-3 py-1 font-mono text-xs text-neutral-600 hover:bg-neutral-100 transition-colors"
              title={isPlaying ? "Pause automated demo" : "Resume demo"}
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
            {/* Left Column: Simulated Chat Window (4 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-black/8 bg-neutral-50 p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/6 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-semibold text-neutral-800">
                    {selectedModel === "gemini" ? "Google Gemini Agent" : "Claude Workspace Agent"}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase text-neutral-400 bg-white px-2 py-0.5 rounded border border-black/6">
                  INDEPENDENT RUNTIME
                </span>
              </div>

              {/* Chat Message Bubble */}
              <div className="flex flex-col gap-2.5">
                <div className="self-end max-w-[90%] rounded-2xl rounded-tr-xs bg-[#0F0F0F] p-3 text-white text-xs leading-relaxed font-sans shadow-xs">
                  "Pull this week's revenue metrics from Stripe, format an executive briefing, and send to team via Gmail."
                </div>

                <div className="self-start max-w-[95%] rounded-2xl rounded-tl-xs bg-white border border-black/8 p-3 text-xs leading-relaxed text-neutral-800 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-neutral-500">
                    <Sparkles className="size-3 text-emerald-600" />
                    <span>Executing plan via Meow Bot...</span>
                  </div>
                  <p className="font-sans text-neutral-700">
                    Retrieved MRR ($48,200, +12% WoW) from Stripe. Briefing generated. Pending automated delivery via verified Gmail integration.
                  </p>
                </div>
              </div>

              {/* Execution Status Banner */}
              <div className="mt-2 rounded-xl bg-white border border-black/8 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="size-3.5 text-neutral-500" />
                  <span className="font-mono text-[11px] text-neutral-600">
                    Inngest Scheduled: Weekly Monday 9:00 AM
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Middle Column: Interactive Pulse & Connector (2 cols) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center gap-3">
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />
              <div className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white shadow-xs text-neutral-700 font-mono text-xs font-bold">
                →
              </div>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest text-center">
                MEOW LAYER
              </span>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />
            </div>

            {/* Right Column: Composio Capability Breakdown Chips (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {EXECUTION_STEPS.map((step, idx) => {
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
                          className={`font-mono text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
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