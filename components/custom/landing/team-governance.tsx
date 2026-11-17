"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, 
  Bot, 
  Globe, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";

export function TeamGovernance() {
  return (
    <section id="teams" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 mb-2 font-semibold">
            WORKSPACE ORCHESTRATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            One unified cloud for your autonomous agents
          </h2>
          <p className="mt-4 max-w-xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Manage your agent fleet, configure continent-aware schedules, and inspect live execution runs in one place.
          </p>

          <Link href="/workspace" className="mt-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-black transition-all hover:bg-neutral-100 hover:border-black/30 shadow-xs"
            >
              <span>MANAGE AGENTS IN WORKSPACE</span>
              <span className="text-xs">↗</span>
            </button>
          </Link>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Specialized Agent Personalities */}
          <div className="flex flex-col rounded-3xl border border-black/10 bg-white p-6 sm:p-7 shadow-xs">
            <div className="mb-4">
              <h3 className="font-mono text-base font-bold text-neutral-900 tracking-tight">
                Specialized Agent Personas
              </h3>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Isolated memories & custom instructions
              </p>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <span>🤖</span>
                  <span className="text-neutral-800 font-semibold">social media bot</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Gemini 2.5
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <span>🏀</span>
                  <span className="text-neutral-800 font-semibold">sports analysis</span>
                </div>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  Claude 3.7
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <span>📊</span>
                  <span className="text-neutral-800 font-semibold">financial analyst</span>
                </div>
                <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                  E2B Python
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <span>🔍</span>
                  <span className="text-neutral-800 font-semibold">research scraper</span>
                </div>
                <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                  Browser VM
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Continent-Aware Timezones */}
          <div className="flex flex-col rounded-3xl border border-black/10 bg-white p-6 sm:p-7 shadow-xs">
            <div className="mb-4">
              <h3 className="font-mono text-base font-bold text-neutral-900 tracking-tight">
                Continent-Aware Timezones
              </h3>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Simplified scheduling across global zones
              </p>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2">
                  <Globe className="size-3.5 text-neutral-500" />
                  <span className="text-neutral-800">Asia / Calcutta (IST)</span>
                </div>
                <span className="text-[10px] text-neutral-500">UTC+05:30</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2">
                  <Globe className="size-3.5 text-neutral-500" />
                  <span className="text-neutral-800">America / New York (EST)</span>
                </div>
                <span className="text-[10px] text-neutral-500">UTC-05:00</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2">
                  <Globe className="size-3.5 text-neutral-500" />
                  <span className="text-neutral-800">Europe / London (BST)</span>
                </div>
                <span className="text-[10px] text-neutral-500">UTC+00:00</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2">
                  <Globe className="size-3.5 text-neutral-500" />
                  <span className="text-neutral-800">Australia / Sydney (AEST)</span>
                </div>
                <span className="text-[10px] text-neutral-500">UTC+10:00</span>
              </div>
            </div>
          </div>

          {/* Card 3: Execution Telemetry & Run History */}
          <div className="flex flex-col rounded-3xl border border-black/10 bg-white p-6 sm:p-7 shadow-xs">
            <div className="mb-4">
              <h3 className="font-mono text-base font-bold text-neutral-900 tracking-tight">
                Live Execution History
              </h3>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Real-time Inngest run telemetry
              </p>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-black/6 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="size-3 text-emerald-600" /> Run #662540
                  </span>
                  <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    completed
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500">
                  Daily Unread Email Summary • 10:34 PM IST
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-black/6 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-bold flex items-center gap-1.5 text-[11px]">
                    <span className="size-2 rounded-full bg-blue-500 animate-pulse" /> Run #611512
                  </span>
                  <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    running
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500">
                  Sports Feed Crawl (VM) • 10:33 PM IST
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-black/6 flex items-center justify-between text-neutral-500 text-[10px]">
                <span>Status: Inngest Healthy</span>
                <span className="text-emerald-600 font-bold">99.98% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}