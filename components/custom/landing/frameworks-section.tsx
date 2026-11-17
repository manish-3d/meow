"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, Check, Terminal, Code2, ArrowRight } from "lucide-react";

type Framework = "sdk" | "vm" | "ai-sdk" | "mcp" | "curl";

interface FrameworkData {
  name: string;
  installCmd: string;
  code: string;
}

const FRAMEWORKS: Record<Framework, FrameworkData> = {
  sdk: {
    name: "Meow Bot TypeScript SDK",
    installCmd: "npm install @meowbot/sdk",
    code: `import { MeowClient } from "@meowbot/sdk";

const meow = new MeowClient({ apiKey: process.env.MEOW_API_KEY });

// 1. Dispatch prompt to agent
const run = await meow.agents.chat({
  agentId: "social-media-bot",
  message: "Analyze top Hacker News posts and draft summary email",
  tools: ["gmail", "browser"],
  mode: "autonomous",
});

console.log("Agent response:", run.output);

// 2. Schedule as recurring Inngest routine
await meow.routines.create({
  agentId: "social-media-bot",
  title: "Daily HN Digest",
  scheduleTime: "08:00",
  timezone: "Asia/Calcutta",
  frequency: "daily",
});`,
  },
  vm: {
    name: "Cloud VM Browser Automation",
    installCmd: "npm install @meowbot/sdk @browserbasehq/sdk",
    code: `import { MeowClient } from "@meowbot/sdk";

const meow = new MeowClient();

// Boot remote Chromium desktop sandbox
const session = await meow.vm.startSession({
  agentId: "research-agent",
  url: "https://news.google.com",
  enableLiveStream: true,
  autoPauseSeconds: 180,
});

console.log("Live stream URL:", session.streamUrl);

// Agent executes browsing actions in remote VM
await meow.vm.execute({
  sessionId: session.id,
  action: "search and extract headlines about AI breakthroughs",
});`,
  },
  "ai-sdk": {
    name: "Vercel AI SDK",
    installCmd: "npm install ai @ai-sdk/google @meowbot/sdk",
    code: `import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getMeowTools } from "@meowbot/sdk/ai-sdk";

export async function POST(req: Request) {
  // Connect verified tools for Gmail & Slack
  const tools = await getMeowTools(["gmail", "slack"]);

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "Schedule executive sync and post agenda to #general",
    tools,
    maxSteps: 5,
  });

  return Response.json({ text });
}`,
  },
  mcp: {
    name: "Universal MCP Gateway",
    installCmd: "npx @meowbot/cli mcp connect",
    code: `// Add Meow Bot to your Claude Desktop config (claude_desktop_config.json):
{
  "mcpServers": {
    "meow-bot": {
      "command": "npx",
      "args": [
        "@meowbot/mcp-server",
        "--api-key",
        "meow_live_sk_..."
      ]
    }
  }
}
// Now Claude Desktop can access all 1,700+ Meow tools & cloud VM desktops!`,
  },
  curl: {
    name: "REST API & Webhooks",
    installCmd: "curl -X POST https://meow-five-theta.vercel.app/api/agent/chat \\",
    code: `curl -X POST https://meow-five-theta.vercel.app/api/agent/chat \\
  -H "Authorization: Bearer $MEOW_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentId": "c23d1bfe-1e90-4847-b756-27da8b8bfeb8",
    "message": "Send greeting to manishsinghjio135@gmail.com",
    "triggerInngest": true
  }'`,
  },
};

export function FrameworksSection() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>("sdk");
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const active = FRAMEWORKS[selectedFramework];

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(active.installCmd);
    setCopiedCmd(true);
    toast.success("Copied install command to clipboard!");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(active.code);
    setCopiedCode(true);
    toast.success("Copied code snippet to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="build" className="relative bg-[#08080A] text-white py-24 sm:py-32 border-b border-white/10 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 size-[500px] rounded-full bg-emerald-600/10 blur-[140px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 mb-2 font-semibold">
            DEVELOPER PLATFORM & API
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white font-sans">
            Built for developers, extensible via code
          </h2>
          <p className="mt-4 max-w-xl text-neutral-400 text-base sm:text-lg leading-relaxed">
            Trigger Meow agents programmatically, orchestrate Inngest background workflows,
            and interact with Cloud VM browser desktops via our TypeScript SDK.
          </p>

          <Link href="/workspace" className="mt-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-all hover:bg-white/10 hover:border-white/40 shadow-xs"
            >
              <span>EXPLORE SDK & API DOCS</span>
              <span className="text-xs">↗</span>
            </button>
          </Link>
        </div>

        {/* Framework Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 font-mono text-xs mb-8">
          {(Object.keys(FRAMEWORKS) as Framework[]).map((key) => {
            const item = FRAMEWORKS[key];
            const isSelected = selectedFramework === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedFramework(key)}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  isSelected
                    ? "bg-white text-black font-bold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Code Window Container */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/15 bg-[#0D0D11] shadow-2xl overflow-hidden font-mono text-xs">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#121217]">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#FF5F56]" />
              <span className="size-3 rounded-full bg-[#FFBD2E]" />
              <span className="size-3 rounded-full bg-[#27C93F]" />
              <span className="ml-2 text-neutral-400 text-[11px]">meow-quickstart.ts</span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-[11px]"
            >
              {copiedCode ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy code</span>
                </>
              )}
            </button>
          </div>

          {/* Install Command Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/8 text-neutral-300">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-neutral-600 select-none">$</span>
              <span className="text-emerald-400">{active.installCmd}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCmd}
              className="ml-3 shrink-0 text-neutral-500 hover:text-white transition-colors"
              title="Copy install command"
            >
              {copiedCmd ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            </button>
          </div>

          {/* Syntax Highlighted Code Snippet */}
          <div className="p-4 sm:p-6 overflow-x-auto text-[12px] sm:text-[13px] leading-relaxed text-neutral-200">
            <pre className="font-mono">
              <code>{active.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}