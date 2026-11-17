"use client";

import React from "react";
import {
  Monitor,
  Clock,
  ShieldCheck,
  Activity,
  Terminal,
  Globe,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowUpRight,
  Database,
  RefreshCw,
} from "lucide-react";

export function BentoFeatures() {
  return (
    <section id="platform" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-surface-0">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-surface-2 border border-border-subtle text-muted-foreground shadow-2xs">
            <Cpu className="size-3 text-primary" />
            <span>Autonomous Execution Engine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
            Built for tasks that can't be solved with a simple text reply
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Real work requires clicking buttons, navigating authenticated portals, scheduling crons across timezones, and inspecting execution telemetry.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Card 1: Cloud VM Desktop (8 cols) */}
          <div className="col-span-12 md:col-span-8 rounded-2xl border border-border-subtle bg-surface-1 p-6 space-y-5 shadow-xs hover:border-foreground/20 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-surface-2 border border-border-subtle text-foreground shadow-2xs">
                  <Monitor className="size-4.5" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-surface-2 border border-border-subtle">
                  Browserbase CDP
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  Cloud VM Desktop & Browser Automation
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  When a task requires interacting with a visual web page, your agent spins up a dedicated headless browser sandbox, types inputs, inspects DOM trees, and takes full-page screenshots.
                </p>
              </div>
            </div>

            {/* Simulated Cloud Browser Mockup */}
            <div className="rounded-xl border border-border-subtle bg-surface-2/80 p-3 space-y-2.5 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-foreground">Session #vm-4491-cdp</span>
                </div>
                <span>1440x900 • 60 FPS</span>
              </div>

              <div className="bg-surface-1 p-2.5 rounded-lg border border-border-subtle space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <span className="text-emerald-500">▶</span>
                  <span>Navigating to Google News & scraping AI breakthroughs...</span>
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>Extracted 12 headlines • Formatted markdown</span>
                  <span className="text-emerald-500 font-bold">100% Success</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Durable Inngest Scheduler (4 cols) */}
          <div className="col-span-12 md:col-span-4 rounded-2xl border border-border-subtle bg-surface-1 p-6 space-y-5 shadow-xs hover:border-foreground/20 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-surface-2 border border-border-subtle text-foreground shadow-2xs">
                  <Clock className="size-4.5" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-surface-2 border border-border-subtle">
                  Inngest Engine
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  Durable Background Schedulers
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Recurring background routines survive server restarts, network blips, and rate limits with zero dropped jobs.
                </p>
              </div>
            </div>

            {/* Visual Schedule Pill Block */}
            <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-2/70 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-semibold font-sans text-xs">Morning Briefing</span>
                <span className="text-emerald-500 text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] tabular-nums">
                <Clock className="size-3" />
                <span>08:00 AM UTC • Asia/Calcutta</span>
              </div>
              <div className="pt-1.5 border-t border-border-subtle flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Daily • 10 Runs Max</span>
                <span className="text-foreground font-medium">Auto-retry: On</span>
              </div>
            </div>
          </div>

          {/* Card 3: 1-Click Composio Auth Vault (4 cols) */}
          <div className="col-span-12 md:col-span-4 rounded-2xl border border-border-subtle bg-surface-1 p-6 space-y-5 shadow-xs hover:border-foreground/20 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-surface-2 border border-border-subtle text-foreground shadow-2xs">
                  <ShieldCheck className="size-4.5" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-surface-2 border border-border-subtle">
                  OAuth Vault
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  1-Click Secure Auth
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Connect personal or team accounts through Composio OAuth. Tokens are encrypted and refreshed automatically without manual credential management.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2/60 border border-border-subtle text-xs">
                <span className="font-medium text-foreground">Google Workspace</span>
                <span className="text-emerald-500 text-[10px] font-mono">Connected</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2/60 border border-border-subtle text-xs">
                <span className="font-medium text-foreground">GitHub Enterprise</span>
                <span className="text-emerald-500 text-[10px] font-mono">Connected</span>
              </div>
            </div>
          </div>

          {/* Card 4: Observability & Telemetry (8 cols) */}
          <div className="col-span-12 md:col-span-8 rounded-2xl border border-border-subtle bg-surface-1 p-6 space-y-5 shadow-xs hover:border-foreground/20 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-surface-2 border border-border-subtle text-foreground shadow-2xs">
                  <Activity className="size-4.5" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-surface-2 border border-border-subtle">
                  Observability
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  Real-Time Audit Logs & Telemetry
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Inspect every thought, tool call, API latency, and failure diagnostic with monospace precision. No black boxes.
                </p>
              </div>
            </div>

            {/* Live Logs Stream */}
            <div className="space-y-1.5 font-mono text-[11px] tabular-nums">
              <div className="p-2 rounded-lg bg-surface-2/70 border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  <span className="text-foreground font-semibold">Run #662540</span>
                  <span className="text-muted-foreground text-[10px]">Gmail • 12 unread categorized</span>
                </div>
                <span className="text-muted-foreground text-[10px]">2,104ms</span>
              </div>

              <div className="p-2 rounded-lg bg-surface-2/70 border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  <span className="text-foreground font-semibold">Run #662539</span>
                  <span className="text-muted-foreground text-[10px]">Slack • Alert sent to #engineering</span>
                </div>
                <span className="text-muted-foreground text-[10px]">892ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
