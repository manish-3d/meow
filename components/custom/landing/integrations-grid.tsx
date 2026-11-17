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
  ArrowRight
} from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  actionText: "Install" | "Copy prompt" | "Copy MCP URL";
  payload: string;
}

const AGENT_INTEGRATIONS: AgentItem[] = [
  {
    id: "claude",
    name: "Claude",
    category: "ANTHROPIC DESKTOP & WEB",
    description: "Add 1,700+ tools and account auth directly to Claude Desktop via MCP.",
    actionText: "Install",
    payload: "npx @meow/cli mcp add claude",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "OPENAI CUSTOM GPTS",
    description: "Connect Custom Actions and OAuth authenticators to your OpenAI workspace.",
    actionText: "Install",
    payload: "https://meow-five-theta.vercel.app/api/mcp/chatgpt",
  },
  {
    id: "codex",
    name: "Codex",
    category: "DEVELOPER CLI",
    description: "One terminal command to add tool execution and secure sandbox to Codex.",
    actionText: "Install",
    payload: "npx @meow/cli codex setup",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "AI CODE EDITOR",
    description: "Full MCP integration in Cursor. Run database queries, APIs, and tests from composer.",
    actionText: "Install",
    payload: "npx @meow/cli mcp add cursor",
  },
  {
    id: "grok",
    name: "Grok Bot",
    category: "xAI RUNTIME",
    description: "Empower Grok with real-time web execution, cloud sandboxes, and social actions.",
    actionText: "Install",
    payload: "npx @meow/cli grok connect",
  },
  {
    id: "hermes",
    name: "Hermes",
    category: "AUTONOMOUS RESEARCH",
    description: "Comprehensive multi-agent prompt for automated research and synthesis.",
    actionText: "Copy prompt",
    payload: "You are Hermes, an autonomous research agent connected to Meow Bot. Access verified web scraping, PDF analysis, and Google Workspace tools to synthesize reports.",
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    category: "SCRAPING & DATA EXTRACTOR",
    description: "Headless Chromium cloud execution prompt with anti-bot evasion.",
    actionText: "Copy prompt",
    payload: "Connect to Meow Bot Cloud VM Desktop at wss://browser.meow.dev. Automate headless form submissions and multi-page data extraction.",
  },
  {
    id: "any-mcp",
    name: "Any MCP client",
    category: "UNIVERSAL PROTOCOL",
    description: "Any client supporting Anthropic Model Context Protocol connects instantly.",
    actionText: "Copy MCP URL",
    payload: "https://meow-five-theta.vercel.app/api/mcp/gateway",
  },
];

export function IntegrationsGrid() {
  const handleAction = (item: AgentItem) => {
    navigator.clipboard.writeText(item.payload);
    if (item.actionText === "Copy MCP URL") {
      toast.success("Copied MCP Gateway URL to clipboard!", {
        description: item.payload,
      });
    } else if (item.actionText === "Copy prompt") {
      toast.success(`Copied ${item.name} agent prompt to clipboard!`);
    } else {
      toast.success(`Copied install command for ${item.name}!`, {
        description: item.payload,
      });
    }
  };

  return (
    <section id="agents" className="relative bg-[#F6F6F6] text-[#0F0F0F] py-24 sm:py-32 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#0F0F0F] font-sans">
            Works with any AI
          </h2>
          <p className="mt-4 max-w-xl text-neutral-600 text-base sm:text-lg leading-relaxed">
            Setup takes less than a minute. See the guide for each agent and protocol.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {AGENT_INTEGRATIONS.map((agent) => (
            <div
              key={agent.id}
              className="flex flex-col justify-between rounded-2xl border border-black/8 bg-white p-5 shadow-xs hover:border-black/20 hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 border border-black/5 text-neutral-800 font-mono text-sm font-bold">
                      {agent.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold text-neutral-900 tracking-tight">
                        {agent.name}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block">
                        {agent.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 font-sans leading-relaxed min-h-[48px]">
                  {agent.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-black/6">
                <button
                  type="button"
                  onClick={() => handleAction(agent)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-neutral-50 hover:bg-neutral-100 px-3 py-2 font-mono text-xs font-semibold text-neutral-800 transition-colors active:scale-98"
                >
                  <Copy className="size-3 text-neutral-500" />
                  <span>{agent.actionText}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <span className="font-mono text-xs text-neutral-500">
            Have a custom agent or proprietary model?{" "}
            <Link href="#build" className="text-black font-semibold underline underline-offset-4 hover:text-emerald-600">
              Explore the Meow Bot Developer SDK →
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}