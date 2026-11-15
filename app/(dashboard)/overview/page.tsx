"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Share2,
  ShoppingCart,
  Search,
  ArrowRight,
  Play,
  Layers,
  Terminal,
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
      name: "Flipkart & Amazon Live Price Tracker",
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
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8 font-sans selection:bg-black/10 selection:text-black">
      {/* ─── 1. HERO BANNER (Clean Minimalist Black & White) ─── */}
      <div className="rounded-2xl border border-[#ebe8e4] bg-white p-7 sm:p-9 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F4F0] border border-[#ebe8e4] px-3 py-1 text-xs font-medium text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
            <span>n8n-Style Workflow Pipelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-[-0.03em] text-black">
            Browser Automation Pipelines Hub
          </h1>
          <p className="text-sm text-[#777169] leading-relaxed">
            Construct and trigger autonomous web workflows. Meow combines Stagehand DOM observation, Playwright headless execution, and human approval gates into self-healing pipelines.
          </p>
          <div className="pt-2">
            <Link
              href="/automation"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-black text-white text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xs"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch Live Studio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2. VISUAL 5-NODE ARCHITECTURE (Clean Monochrome) ─── */}
      <div className="rounded-2xl border border-[#ebe8e4] bg-white p-7 shadow-[0_1px_1px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebe8e4]">
          <span className="font-semibold text-black text-xs uppercase tracking-wider">
            Pipeline Execution Flow (n8n Style)
          </span>
          <span className="text-[11px] font-mono text-[#777169]">
            Continuous Stagehand Runtime
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#9E988F] font-bold block">Node 1</span>
            <span className="text-xs font-semibold text-black block">Trigger Event</span>
            <span className="text-[11px] text-[#777169]">Manual or Cron</span>
          </div>

          <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#9E988F] font-bold block">Node 2</span>
            <span className="text-xs font-semibold text-black block">Browser Navigate</span>
            <span className="text-[11px] text-[#777169]">Chromium Stealth</span>
          </div>

          <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#9E988F] font-bold block">Node 3</span>
            <span className="text-xs font-semibold text-black block">Stagehand Extract</span>
            <span className="text-[11px] text-[#777169]">Live DOM Elements</span>
          </div>

          <div className="rounded-xl border-2 border-black bg-white p-4 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-black font-bold block">Node 4</span>
            <span className="text-xs font-bold text-black block">Human Approval</span>
            <span className="text-[11px] text-[#777169]">Write Action Gate</span>
          </div>

          <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#9E988F] font-bold block">Node 5</span>
            <span className="text-xs font-semibold text-black block">Publish / Webhook</span>
            <span className="text-[11px] text-[#777169]">Final Execution</span>
          </div>
        </div>
      </div>

      {/* ─── 3. WORKFLOW TEMPLATES GRID ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9E988F]">
            Prebuilt Automation Templates
          </span>
          <span className="text-xs font-mono text-[#777169]">4 Active Blueprints</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pipelines.map((pipe) => {
            const Icon = pipe.icon;
            return (
              <div
                key={pipe.id}
                className="rounded-2xl border border-[#ebe8e4] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-black/20 transition-all space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F4F0] border border-[#ebe8e4] text-xs font-medium text-black">
                      <Icon className="h-3.5 w-3.5" />
                      {pipe.badge}
                    </span>
                    <span className="text-[11px] font-mono text-[#777169]">{pipe.trigger}</span>
                  </div>

                  <h3 className="text-lg font-normal text-black">{pipe.name}</h3>
                  <p className="text-xs text-[#777169] leading-relaxed">{pipe.description}</p>
                </div>

                <div className="pt-2 border-t border-[#ebe8e4] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#777169]">Target: {pipe.target}</span>
                  <Link
                    href={`/automation`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-black hover:underline"
                  >
                    Run in Studio <ArrowRight className="h-3.5 w-3.5" />
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
