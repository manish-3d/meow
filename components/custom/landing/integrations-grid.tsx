"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  Bot, 
  Terminal, 
  Code2, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  ArrowRight,
  Mail,
  Calendar,
  MessageSquare,
  Github,
  DollarSign,
  Globe,
  Clock
} from "lucide-react";

interface ToolItem {
  id: string;
  name: string;
  category: string;
  description: string;
  actionText: "Connect Tool" | "Launch VM" | "View Engine" | "Test Sandbox" | "Copy MCP URL";
  payload: string;
}

const MEOW_TOOLS: ToolItem[] = [
  {
    id: "gmail-calendar",
    name: "Gmail & Calendar",
    category: "GOOGLE WORKSPACE",
    description: "Read, draft, and schedule emails. Auto-generate meeting briefings and check availability.",
    actionText: "Connect Tool",
    payload: "https://meow-five-theta.vercel.app/workspace?tab=tools&app=gmail",
  },
  {
    id: "cloud-vm",
    name: "Cloud VM Desktop",
    category: "BROWSERBASE CHROMIUM",
    description: "Dedicated remote browser with live video streaming, anti-bot evasion, and human takeover.",
    actionText: "Launch VM",
    payload: "https://meow-five-theta.vercel.app/workspace?tab=vm",
  },
  {
    id: "inngest-scheduler",
    name: "Durable Inngest Cron",
    category: "SERVERLESS WORKFLOWS",
    description: "Timezone-aware scheduled routines with automatic step retries and full execution telemetry.",
    actionText: "View Engine",
    payload: "https://meow-five-theta.vercel.app/workspace?tab=schedule",
  },
  {
    id: "slack-discord",
    name: "Slack & Discord",
    category: "TEAM MESSAGING",
    description: "Send alerts, post executive summaries, and interact with team members directly in channels.",
    actionText: "Connect Tool",
    payload: "https://meow-five-theta.vercel.app/workspace?tab=tools&app=slack",
  },
  {
    id: "github-linear",
    name: "GitHub & Linear",
    category: "DEV WORKFLOWS",
    description: "Triage pull requests, inspect repository issues, and automate project sprint management.",
    actionText: "Connect Tool",
    payload: "https://meow-five-theta.vercel.app/workspace?tab=tools&app=github",
  },
  {
    id: "stripe-crm",
    name: "Stripe & HubSpot",
    category: "REVENUE & CRM",
    description: "Fetch subscription metrics, calculate MRR anomalies, and draft personalized customer outreach.",
    actionText: "Connect Tool",
    payload: "https://meow-five-theta.vercel.app/workspace?tab=tools&app=stripe",
  },
  {
    id: "e2b-sandbox",
    name: "E2B Code Interpreter",
    category: "SECURE COMPUTING",
    description: "Execute Python scripts, parse gigabyte CSV datasets, and generate analytical charts in sandboxes.",
    actionText: "Test Sandbox",
    payload: "npx @meow/cli sandbox test",
  },
  {
    id: "gemini-mcp",
    name: "Universal MCP Gateway",
    category: "MODEL CONTEXT PROTOCOL",
    description: "Expose your Meow Bot's tools and memory directly to Claude Desktop, Cursor, or Codex CLI.",
    actionText: "Copy MCP URL",
    payload: "https://meow-five-theta.vercel.app/api/mcp/gateway",
  },
];

export function IntegrationsGrid() {
  const handleAction = (item: ToolItem) => {
    if (item.actionText === "Copy MCP URL") {
      navigator.clipboard.writeText(item.payload);
      toast.success("Copied Meow Bot MCP Gateway URL to clipboard!", {
        description: item.payload,
      });
    } else {
      window.location.href = item.payload;
    }
  };

  return (
    <section id="tools" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 mb-2 font-semibold">
            NATIVE INTEGRATIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            1,700+ tools and the models you trust
          </h2>
          <p className="mt-4 max-w-xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Equip every Meow Bot with your favorite LLM and connect to your daily productivity apps in one click.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {MEOW_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col justify-between rounded-2xl border border-black/8 bg-white p-5 shadow-xs hover:border-black/20 hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 border border-black/5 text-neutral-800 font-mono text-sm font-bold">
                      {tool.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold text-neutral-900 tracking-tight">
                        {tool.name}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 font-sans leading-relaxed min-h-[48px]">
                  {tool.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-black/6">
                <button
                  type="button"
                  onClick={() => handleAction(tool)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-neutral-50 hover:bg-neutral-100 px-3 py-2 font-mono text-xs font-semibold text-neutral-800 transition-colors active:scale-98"
                >
                  <span>{tool.actionText}</span>
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <span className="font-mono text-xs text-neutral-500">
            Want to add your own proprietary internal database or custom API?{" "}
            <Link href="/workspace?tab=tools" className="text-black font-semibold underline underline-offset-4 hover:text-emerald-600">
              Configure Custom Endpoints in Agent Settings →
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}