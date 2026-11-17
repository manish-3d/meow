"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Terminal, 
  Cpu, 
  Workflow, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Database, 
  Play, 
  ArrowRight,
  CheckCircle2,
  Layers,
  FileSpreadsheet,
  Globe,
  Radio
} from "lucide-react";

export function BentoFeatures() {
  const [activeTab, setActiveTab] = useState<"skills" | "vm" | "instant">("skills");

  return (
    <section id="harder-jobs" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            Don’t settle for AI that stops halfway
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Long jobs are where AI stalls. Meow Bot gives it proven steps, a place to run code,
            and the tools to fill any gap.
          </p>
        </div>

        {/* 3 Bento Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Tested Skills for Recurring Work */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 mb-5">
                <Workflow className="size-5" />
              </div>
              <h3 className="text-xl font-bold font-sans text-neutral-900 tracking-tight">
                Tested skills for recurring work
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-sans">
                Meow Bot gives your AI skills: tested ways to do a job, so it knows what to check
                and what to avoid before taking action.
              </p>
            </div>

            {/* Interactive Preview Mock */}
            <div className="mt-8 rounded-2xl border border-black/8 bg-neutral-50 p-4 flex flex-col gap-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-black/6">
                <span className="text-neutral-500 font-semibold uppercase text-[10px]">
                  SKILL PIPELINE
                </span>
                <span className="text-emerald-600 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 text-[10px]">
                  1
                </span>
                <span>Scan unread customer support tickets</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 text-[10px]">
                  2
                </span>
                <span>Enrich sender domain via Clearbit</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 text-[10px]">
                  3
                </span>
                <span>Draft high-priority response for review</span>
              </div>
            </div>
          </div>

          {/* Card 2: A Computer for the Heavy Work */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 mb-5">
                <Cpu className="size-5" />
              </div>
              <h3 className="text-xl font-bold font-sans text-neutral-900 tracking-tight">
                A computer for the heavy work
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-sans">
                When a task means thousands of rows, your AI runs code in a private workspace
                and brings back just the answer.
              </p>
            </div>

            {/* Interactive Preview Mock: Terminal Sandbox */}
            <div className="mt-8 rounded-2xl border border-black/8 bg-[#0D0D10] text-neutral-200 p-4 font-mono text-[11px] flex flex-col gap-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-500/80" />
                  <span className="size-2 rounded-full bg-amber-500/80" />
                  <span className="size-2 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-neutral-500 text-[10px]">sandbox:vm-desktop-01</span>
              </div>
              <div className="text-emerald-400">$ python -m analysis.process_transactions</div>
              <div className="text-neutral-400">Loading 240,000 rows into Pandas memory...</div>
              <div className="text-white">✓ Outlier anomalies detected: 3 transactions flagged</div>
              <div className="text-neutral-500 text-[10px] mt-1 pt-1 border-t border-white/10 flex items-center justify-between">
                <span>Memory: 184MB / 4GB</span>
                <span className="text-emerald-400">Exit 0 (Success)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Instant Tools, No Sign-ups */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 mb-5">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-xl font-bold font-sans text-neutral-900 tracking-tight">
                Instant tools, no sign-ups
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-sans">
                1,700+ tools for search, web scraping, transcription and execution, ready when
                a task needs them. Pay per use with zero accounts to create.
              </p>
            </div>

            {/* Interactive Preview Mock: Instant Tools Chips */}
            <div className="mt-8 rounded-2xl border border-black/8 bg-neutral-50 p-4 flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-black/6">
                <span className="text-neutral-500 font-semibold uppercase text-[10px]">
                  ON-DEMAND PROVIDERS
                </span>
                <span className="text-purple-600 font-semibold text-[10px] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  NO API KEYS
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-black/4">
                <span className="text-neutral-800">Tavily Deep Search</span>
                <span className="text-neutral-400 text-[11px]">$0.001 / req</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-black/4">
                <span className="text-neutral-800">Firecrawl LLM Scraper</span>
                <span className="text-neutral-400 text-[11px]">$0.002 / page</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-800">Whisper Voice Transcription</span>
                <span className="text-neutral-400 text-[11px]">$0.006 / min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}