"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Terminal, Cpu, Activity, Shield, CheckCircle2, Wifi, Zap } from "lucide-react";

interface VmPanelProps {
  active: boolean; // Frame 3+
}

export function StageVmPanel({ active }: VmPanelProps) {
  const [logs, setLogs] = useState<string[]>([
    "INIT: Spawning isolated sandbox vm-worker-01...",
    "AUTH: Validated Composio OAuth2 session token",
    "NET: Connected to WebSocket gateway wss://meow.cloud",
    "MODEL: Hooked Claude 3.7 Sonnet (Hybrid Reasoning)",
    "TOOLS: Enabled [web_search, code_exec, github_pr]",
  ]);

  const [counter, setCounter] = useState(1);

  // Dynamic live log stream
  useEffect(() => {
    if (!active) return;

    const streamLogs = [
      "EXEC: research_agent.crawl(url='arxiv.org/abs/agents')",
      "DOM: Extracted 14 trend vectors from page",
      "SYNC: Pushed telemetry payload to lead coordinator",
      "VM: CPU 12% | RAM 4.2GB / 8.0GB | 0 err",
      "SCHEDULE: Routine daily_digest triggered (next: 09:00)",
      "CODING: PR generated -> feat/vector-search-fix",
      "AGENT: 4 workers synchronized with 0 latency",
    ];

    const interval = setInterval(() => {
      setCounter((prev) => {
        const nextLog = streamLogs[prev % streamLogs.length];
        setLogs((current) => [...current.slice(-6), `[+${prev * 1.2}s] ${nextLog}`]);
        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="hidden lg:flex w-[250px] xl:w-[270px] shrink-0 border-l border-black/[0.08] bg-[#0c0d12] text-neutral-200 flex-col justify-between p-3 select-none font-mono text-xs overflow-hidden"
    >
      {/* 1. Header Diagnostics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5 text-[#a3e635]">
            <Terminal className="size-3.5" />
            <span className="font-bold text-[11px] tracking-tight uppercase">Live VM Telemetry</span>
          </div>
          <span className="flex items-center gap-1 text-[9px] text-[#bef264] bg-[#84cc16]/10 px-1.5 py-0.5 rounded border border-[#84cc16]/20">
            <span className="size-1.5 rounded-full bg-[#84cc16] animate-ping" />
            <span>24/7 UP</span>
          </span>
        </div>

        {/* System Stats Cluster */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1">
                <Cpu className="size-2.5 text-blue-400" />
                <span>CPU</span>
              </span>
              <span className="text-white font-bold">14%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[14%] h-full bg-blue-500 rounded-full" />
            </div>
          </div>

          <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1">
                <Activity className="size-2.5 text-[#bef264]" />
                <span>RAM</span>
              </span>
              <span className="text-white font-bold">4.2GB</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[52%] h-full bg-[#84cc16] rounded-full" />
            </div>
          </div>
        </div>

        {/* Model & Config Badges */}
        <div className="space-y-1 pt-1 text-[10px]">
          <div className="flex items-center justify-between py-1 px-2 rounded bg-white/5 border border-white/5">
            <span className="text-neutral-400">Primary Frontier</span>
            <span className="text-[#a78bfa] font-semibold">Claude 3.7</span>
          </div>
          <div className="flex items-center justify-between py-1 px-2 rounded bg-white/5 border border-white/5">
            <span className="text-neutral-400">Active Integrations</span>
            <span className="text-cyan-400 font-semibold">Composio Native</span>
          </div>
          <div className="flex items-center justify-between py-1 px-2 rounded bg-white/5 border border-white/5">
            <span className="text-neutral-400">Security Sandbox</span>
            <span className="text-[#bef264] flex items-center gap-1">
              <Shield className="size-2.5" /> Isolated
            </span>
          </div>
        </div>
      </div>

      {/* 2. Cascading Terminal Stream */}
      <div className="my-2 p-2 rounded-lg bg-black/60 border border-white/10 text-[9.5px] font-mono leading-tight space-y-1.5 h-[155px] overflow-hidden flex flex-col justify-end">
        <div className="text-neutral-500 text-[8.5px] border-b border-white/5 pb-1 flex items-center justify-between">
          <span>CONSOLE LOG OUTPUT</span>
          <span className="text-neutral-400">STDOUT</span>
        </div>
        <div className="space-y-1 overflow-hidden">
          {logs.map((log, idx) => (
            <p
              key={idx}
              className={`truncate ${
                log.includes("EXEC") || log.includes("AUTH")
                  ? "text-cyan-300"
                  : log.includes("MODEL") || log.includes("INIT")
                  ? "text-purple-300"
                  : log.includes("AGENT") || log.includes("UP")
                  ? "text-[#bef264]"
                  : "text-neutral-300"
              }`}
            >
              <span className="text-neutral-600 mr-1">&gt;</span>
              {log}
            </p>
          ))}
        </div>
      </div>

      {/* 3. Bottom Connected Tools Pills */}
      <div className="pt-2 border-t border-white/10 space-y-1.5">
        <div className="flex items-center justify-between text-[9px] text-neutral-400">
          <span>PLUGINS ATTACHED</span>
          <span className="text-[#bef264] font-bold">3 ACTIVE</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-neutral-300 border border-white/10">
            GitHub API
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-neutral-300 border border-white/10">
            X Realtime
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-neutral-300 border border-white/10">
            Chromium Headless
          </span>
        </div>
      </div>
    </motion.div>
  );
}
