"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Share2,
  ShoppingCart,
  Search,
  ArrowRight,
  Play,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  ExternalLink,
  Workflow,
  Zap,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const pipelines = [
    {
      id: "twitter",
      name: "Twitter / X AI Content Automator",
      icon: Share2,
      badge: "Social Automation",
      description:
        "Autonomous browser workflow that inspects live trending topics, drafts an insightful post with relevant hashtags, and pauses for your 1-click human review before publishing.",
      samplePrompt:
        "Open my X account, research trending AI topics, draft a post about NVIDIA, and publish it after my approval.",
      trigger: "On-Demand / Scheduled",
      target: "x.com / twitter.com",
    },
    {
      id: "flipkart",
      name: "Flipkart & Amazon Price Tracker",
      icon: ShoppingCart,
      badge: "E-Commerce Scraper",
      description:
        "Navigates live shopping portals, inspects product listing cards, extracts current INR pricing, and detects live discounts without paying for commercial scraping APIs.",
      samplePrompt: "find price of ipad on flipkart",
      trigger: "Web Search / Periodic",
      target: "flipkart.com / amazon.in",
    },
    {
      id: "competitor",
      name: "Competitor Monitor & Changelog Auditor",
      icon: Search,
      badge: "Intelligence Crawler",
      description:
        "Crawls competitor landing pages, detects pricing tier updates, and synthesizes structured competitive intelligence reports.",
      samplePrompt:
        "Inspect competitor pricing pages, extract current tiers, and summarize feature changes.",
      trigger: "Weekly Audit",
      target: "Target SaaS Domains",
    },
    {
      id: "leads",
      name: "Lead Discovery & Directory Harvester",
      icon: Globe,
      badge: "Lead Pipeline",
      description:
        "Executes search queries on public tech directories, extracts verified business information, and prepares structured leads for your workspace.",
      samplePrompt:
        "Search tech startups on public directories, extract founder names, and format lead summaries.",
      trigger: "Batch Pipeline",
      target: "Public Web Directories",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#f7f8f8] font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0c0d10] via-[#0f1117] to-indigo-950/20 p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono text-emerald-400">
            <Globe className="h-3.5 w-3.5" />
            <span>Meow · AI Browser Automation Studio (n8n Style)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Automate Anything on the Web with AI
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Control real browsers like a human. Use AI as your autonomous helper to scrape data, track product prices, and publish content to social platforms without expensive $100+/mo APIs.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/automation"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-2.5 text-xs font-bold shadow-md hover:bg-white/90 transition-all hover:scale-[1.02]"
            >
              <Play className="h-3.5 w-3.5 fill-black" />
              <span>Open Browser Automation Studio</span>
            </Link>
            <Link
              href="/settings/workspace"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              <span>Browser Engine Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Visual n8n-Style Pipeline Architecture */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h2 className="text-xs font-mono uppercase text-white/50 tracking-wider flex items-center gap-2">
            <Workflow className="h-3.5 w-3.5 text-indigo-400" />
            <span>Autonomous Pipeline Flow</span>
          </h2>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            Zero API Keys Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Node 1 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
            <div className="text-[10px] font-mono text-indigo-400 font-bold">1. TRIGGER</div>
            <h3 className="text-xs font-bold text-white">Natural Directive</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              You type what to do in plain English (e.g. &ldquo;find iPad on Flipkart&rdquo;).
            </p>
          </div>

          {/* Node 2 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
            <div className="text-[10px] font-mono text-emerald-400 font-bold">2. BROWSER LAUNCH</div>
            <h3 className="text-xs font-bold text-white">Cloud Chromium</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Browserbase opens a real headless Chrome session via Playwright CDP.
            </p>
          </div>

          {/* Node 3 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
            <div className="text-[10px] font-mono text-purple-400 font-bold">3. STAGEHAND AI</div>
            <h3 className="text-xs font-bold text-white">DOM Vision & Scrape</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Stagehand inspects elements, clicks buttons, and extracts live data.
            </p>
          </div>

          {/* Node 4 */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
            <div className="text-[10px] font-mono text-amber-400 font-bold">4. SAFETY GATE</div>
            <h3 className="text-xs font-bold text-white">Human Approval</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Pauses execution before write actions (e.g. posting on X) for your sign-off.
            </p>
          </div>

          {/* Node 5 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
            <div className="text-[10px] font-mono text-emerald-400 font-bold">5. COMPLETE</div>
            <h3 className="text-xs font-bold text-white">Publish / Result</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Publishes confirmed content to target website or exports structured data.
            </p>
          </div>
        </div>
      </div>

      {/* Active Automation Pipelines Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase text-white/50 tracking-wider">
            Ready-Made Automation Pipelines
          </h2>
          <span className="text-[11px] font-mono text-indigo-400">4 Active Automation Workflows</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pipelines.map((pipe) => {
            const Icon = pipe.icon;
            return (
              <div
                key={pipe.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 space-y-5 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{pipe.name}</h3>
                        <span className="text-[11px] font-mono text-white/40">{pipe.target}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-white/5 text-white/70 px-2 py-0.5 rounded border border-white/10">
                      {pipe.badge}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">{pipe.description}</p>

                  <div className="rounded-xl bg-black/60 p-3 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Sample Prompt:</span>
                    <p className="text-xs font-mono text-indigo-300">{pipe.samplePrompt}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ready to Run
                  </span>

                  <Link
                    href={`/automation`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <span>Run in Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
