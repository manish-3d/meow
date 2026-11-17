"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe,
  Repeat,
  Zap,
  Terminal,
  Layers,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Preset {
  id: string;
  chipLabel: string;
  prompt: string;
  goal: string;
  frequency: string;
  scheduledTime: string;
  timezone: string;
  tools: string[];
  inngestEvent: string;
  outputDescription: string;
}

const PRESETS: Preset[] = [
  {
    id: "email",
    chipLabel: "📧 Daily Email Summary",
    prompt: "say hi to manishsinghjio135@gmail.com at 9:00 PM IST today and summarize unread emails",
    goal: "Send greeting and executive unread email digest to Manish at 9:00 PM IST",
    frequency: "Daily",
    scheduledTime: "03:30 PM UTC (09:00 PM IST)",
    timezone: "Asia/Calcutta",
    tools: ["GMAIL_SEND_EMAIL", "GMAIL_LIST_MESSAGES", "GMAIL_GET_MESSAGE"],
    inngestEvent: "agent/routine.scheduled",
    outputDescription: "Parses unread messages from primary inbox, categorizes by urgency, and dispatches greeting email.",
  },
  {
    id: "vm-news",
    chipLabel: "🌐 Cloud VM Web Scraping",
    prompt: "Search Google News on your VM desktop for the latest AI breakthroughs every evening at 5 PM",
    goal: "Automated browser research on Google News via Browserbase CDP",
    frequency: "Daily",
    scheduledTime: "11:30 AM UTC (05:00 PM IST)",
    timezone: "Asia/Calcutta",
    tools: ["BROWSERBASE_START_SESSION", "BROWSER_NAVIGATE", "BROWSER_SCREENSHOT"],
    inngestEvent: "agent/browser.execute",
    outputDescription: "Spins up headless Chromium sandbox, executes search query, extracts top 10 articles, and formats markdown digest.",
  },
  {
    id: "github-pr",
    chipLabel: "⌥ Friday GitHub Triage",
    prompt: "Check open pull requests on GitHub every Friday at 4 PM and alert me on Slack",
    goal: "Weekly pull request digest and pending review notifications",
    frequency: "Weekly (Fri)",
    scheduledTime: "10:30 AM UTC (04:00 PM IST)",
    timezone: "Asia/Calcutta",
    tools: ["GITHUB_LIST_PULL_REQUESTS", "SLACK_POST_MESSAGE"],
    inngestEvent: "agent/routine.scheduled",
    outputDescription: "Queries open PRs in organization repositories, highlights aging reviews, and broadcasts clean digest to Slack #dev channel.",
  },
];

export function InteractiveSimulator() {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);

  return (
    <section id="simulator" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-surface-0">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-surface-2 border border-border-subtle text-muted-foreground shadow-2xs">
            <Terminal className="size-3 text-primary" />
            <span>Interactive Simulator</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
            From natural language to production background cron
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Select a natural language instruction to see how Meow Bot parses parameters, binds tool permissions, and registers durable Inngest cron jobs.
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActivePreset(preset)}
                className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${
                  activePreset.id === preset.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground border border-border-subtle"
                }`}
              >
                {preset.chipLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Dual-Pane Card */}
        <div className="rounded-2xl border border-border-subtle bg-surface-1 p-5 md:p-6 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Input & Intent Breakdown (6 cols) */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Prompt Given to Agent
              </span>
              <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-2/60 text-xs text-foreground font-medium leading-relaxed">
                "{activePreset.prompt}"
              </div>
            </div>

            {/* Synthesized Parameters */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Synthesized Autonomous Routine
              </span>

              <div className="p-4 rounded-xl border border-border-subtle bg-surface-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground tracking-tight">
                    {activePreset.goal}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                    Validated
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono tabular-nums text-muted-foreground">
                  <span className="flex items-center gap-1 bg-surface-2 px-2 py-0.5 rounded border border-border-subtle text-foreground font-medium">
                    <Repeat className="size-2.5 text-primary" />
                    <span>{activePreset.frequency}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 bg-surface-2 px-2 py-0.5 rounded border border-border-subtle text-foreground">
                    <Clock className="size-2.5 text-muted-foreground" />
                    <span>{activePreset.scheduledTime}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 bg-surface-2 px-2 py-0.5 rounded border border-border-subtle text-foreground">
                    <Globe className="size-2.5 text-muted-foreground" />
                    <span>{activePreset.timezone}</span>
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-border-subtle">
                  {activePreset.outputDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Technical Inngest Payload & Tools (6 cols) */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                Resolved Tool Bindings ({activePreset.tools.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activePreset.tools.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-mono bg-surface-2 px-2 py-1 rounded-md border border-border-subtle text-foreground"
                  >
                    <CheckCircle2 className="size-2.5 text-emerald-500" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Inngest State Machine JSON Preview */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Durable Cron Payload
              </span>
              <pre className="p-3.5 rounded-xl border border-border-subtle bg-surface-0 font-mono text-[10px] text-foreground/80 overflow-x-auto leading-relaxed">
{JSON.stringify(
  {
    event: activePreset.inngestEvent,
    data: {
      routineId: `routine_${activePreset.id}_demo`,
      frequency: activePreset.frequency,
      cronSchedule: "30 15 * * *",
      timezone: activePreset.timezone,
      boundTools: activePreset.tools,
      durableState: "active",
      maxRetries: 3,
    },
  },
  null,
  2
)}
              </pre>
            </div>

            <Link href="/workspace" className="block pt-1">
              <Button className="w-full text-xs h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-xs">
                <span>Deploy This Routine in Workspace</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
