"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Terminal, 
  Cpu, 
  Workflow, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Monitor, 
  Play, 
  ArrowRight,
  CheckCircle2,
  Layers,
  Globe,
  Radio,
  ExternalLink,
  Hand
} from "lucide-react";

export function BentoFeatures() {
  return (
    <section id="cloud-vm" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 mb-2 font-semibold">
            ENGINEERED FOR REAL WORK
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            Everything your agents need to finish the job
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Traditional AI chatbots stop at generating text. Meow Bot equips your agents with live cloud computers,
            durable schedulers, and secure tool access.
          </p>
        </div>

        {/* 3 Bento Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Cloud VM Desktop with Live Takeover */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 mb-5">
                <Monitor className="size-5" />
              </div>
              <h3 className="text-xl font-bold font-sans text-neutral-900 tracking-tight">
                Cloud VM Desktop & Takeover
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-sans">
                When agents need to browse the live web, fill forms, or bypass complex UIs,
                Meow Bot boots an isolated Chromium desktop. Watch the live stream or click "Take Over" anytime.
              </p>
            </div>

            {/* Interactive Preview Mock: Live VM Stream */}
            <div className="mt-8 rounded-2xl border border-black/8 bg-[#0D0D10] text-neutral-200 p-4 font-mono text-[11px] flex flex-col gap-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-neutral-300 font-semibold text-[10px]">LIVE BROWSERBASE STREAM</span>
                </div>
                <span className="text-blue-400 text-[10px] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Chromium 128
                </span>
              </div>
              
              <div className="bg-neutral-900 rounded-lg p-2 flex items-center justify-between text-neutral-300 text-[10px]">
                <span className="truncate">https://news.google.com/search?q=AI+breakthroughs</span>
                <span className="text-emerald-400 font-bold ml-2">200 OK</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
                <span className="text-neutral-400">FPS: 30 • Latency: 42ms</span>
                <button
                  type="button"
                  className="flex items-center gap-1 bg-white text-black px-2 py-1 rounded font-bold hover:bg-neutral-200 transition-colors"
                >
                  <Hand className="size-3 text-blue-600" />
                  <span>Take Over Control</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Durable Inngest Scheduler */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 mb-5">
                <Clock className="size-5" />
              </div>
              <h3 className="text-xl font-bold font-sans text-neutral-900 tracking-tight">
                Durable Inngest Background Cron
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-sans">
                Server reboots and timeouts never kill your scheduled tasks. Inngest provides durable
                execution steps, automatic backoff retries, and accurate continent-aware timezone offsets.
              </p>
            </div>

            {/* Interactive Preview Mock: Scheduler & History */}
            <div className="mt-8 rounded-2xl border border-black/8 bg-neutral-50 p-4 flex flex-col gap-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-black/6">
                <span className="text-neutral-500 font-semibold uppercase text-[10px]">
                  ACTIVE ROUTINES
                </span>
                <span className="text-emerald-600 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  INNGEST SYNCHRONIZED
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-700">
                <span className="font-semibold text-neutral-900">Daily Unread Email Summary</span>
                <span className="text-emerald-600 font-bold text-[10px]">ACTIVE</span>
              </div>
              <div className="text-[11px] text-neutral-500">
                08:00 AM UTC • Asia/Calcutta • Runs via Gmail API
              </div>
              <div className="pt-2 border-t border-black/6 flex items-center justify-between text-[10px] text-neutral-600">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="size-3" /> Run #662540 Completed
                </span>
                <span className="text-neutral-400">10:34 PM</span>
              </div>
            </div>
          </div>

          {/* Card 3: Multi-Agent Workspace & Marketplace */}
          <div className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 mb-5">
                <Cpu className="size-5" />
              </div>
              <h3 className="text-xl font-bold font-sans text-neutral-900 tracking-tight">
                Specialized Multi-Agent Cloud
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-sans">
                Never cram every task into a single prompt. Create dedicated agents like "Sports Analysis",
                "Social Media Bot", and "Executive Assistant" with private memory and customized tool access.
              </p>
            </div>

            {/* Interactive Preview Mock: Agent Hub */}
            <div className="mt-8 rounded-2xl border border-black/8 bg-neutral-50 p-4 flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-black/6">
                <span className="text-neutral-500 font-semibold uppercase text-[10px]">
                  YOUR AGENT FLEET
                </span>
                <span className="text-blue-600 font-semibold text-[10px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  3 RUNNING
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-black/4">
                <div className="flex items-center gap-2">
                  <span>🤖</span>
                  <span className="font-semibold text-neutral-800">social media bot</span>
                </div>
                <span className="text-emerald-600 text-[10px]">Autonomous</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-black/4">
                <div className="flex items-center gap-2">
                  <span>🏀</span>
                  <span className="font-semibold text-neutral-800">sports analysis</span>
                </div>
                <span className="text-emerald-600 text-[10px]">Autonomous</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  <span className="font-semibold text-neutral-800">executive briefing</span>
                </div>
                <span className="text-neutral-500 text-[10px]">Standby</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}