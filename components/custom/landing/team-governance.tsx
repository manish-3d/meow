"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, 
  Key, 
  Workflow, 
  DollarSign, 
  Check, 
  ShieldCheck, 
  Mail, 
  MessageSquare, 
  Github, 
  BarChart3,
  ArrowRight
} from "lucide-react";

export function TeamGovernance() {
  return (
    <section id="teams" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            One setup for your whole team
          </h2>
          <p className="mt-4 max-w-xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Share apps, skills and a budget once. Every teammate's AI gets them.
          </p>

          <Link href="/workspace" className="mt-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-black transition-all hover:bg-neutral-100 hover:border-black/30 shadow-xs"
            >
              <span>SET UP YOUR TEAM</span>
              <span className="text-xs">↗</span>
            </button>
          </Link>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Shared Accounts */}
          <div className="flex flex-col rounded-3xl border border-black/10 bg-white p-6 sm:p-7 shadow-xs">
            <div className="mb-4">
              <h3 className="font-mono text-base font-bold text-neutral-900 tracking-tight">
                Shared Accounts
              </h3>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Ready for everyone
              </p>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <Mail className="size-4 text-neutral-600" />
                  <span className="text-neutral-800">sales@acme.com</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <Mail className="size-4 text-neutral-600" />
                  <span className="text-neutral-800">support@acme.com</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <Github className="size-4 text-neutral-600" />
                  <span className="text-neutral-800">Acme Production</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="size-4 text-neutral-600" />
                  <span className="text-neutral-800">metabase.acme.com</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="size-4 text-neutral-600" />
                  <span className="text-neutral-800">acme.slack.com</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Shared Skills */}
          <div className="flex flex-col rounded-3xl border border-black/10 bg-white p-6 sm:p-7 shadow-xs">
            <div className="mb-4">
              <h3 className="font-mono text-base font-bold text-neutral-900 tracking-tight">
                Shared Skills
              </h3>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                For every teammate's AI
              </p>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <span className="text-neutral-800">Prep for a Meeting</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                  P
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <span className="text-neutral-800">Answer Support Emails</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                  M
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <span className="text-neutral-800">Weekly Revenue Update</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  D
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <span className="text-neutral-800">Triage Product Bugs</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                  S
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-black/6">
                <span className="text-neutral-800">Summarize Sales Calls</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">
                  P
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Shared Budget */}
          <div className="flex flex-col rounded-3xl border border-black/10 bg-white p-6 sm:p-7 shadow-xs">
            <div className="mb-4">
              <h3 className="font-mono text-base font-bold text-neutral-900 tracking-tight">
                Shared Budget
              </h3>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                $412 used this month
              </p>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-neutral-700 mb-1">
                  <span>Apollo Lead Enrichment</span>
                  <span className="font-bold">$180</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "44%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-700 mb-1">
                  <span>Exa Neural Search</span>
                  <span className="font-bold">$132</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "32%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-700 mb-1">
                  <span>Firecrawl LLM Scrapes</span>
                  <span className="font-bold">$100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "24%" }} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/6 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase text-neutral-400 block">
                    AGENT SPEND LIMIT
                  </span>
                  <span className="font-mono text-sm font-bold text-neutral-900">
                    $2.00 / user cap
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  Enforced
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}