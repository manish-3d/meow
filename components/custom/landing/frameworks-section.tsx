"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, Check, Terminal, Code2, ArrowRight } from "lucide-react";

type Framework = "openai" | "anthropic" | "vercel" | "gemini" | "langchain";

interface FrameworkData {
  name: string;
  installCmd: string;
  code: string;
}

const FRAMEWORKS: Record<Framework, FrameworkData> = {
  openai: {
    name: "OpenAI",
    installCmd: "npm install @meow/sdk @composio/core openai",
    code: `import OpenAI from "openai";
import { MeowBot } from "@meow/sdk";

const openai = new OpenAI();
const meow = new MeowBot({ apiKey: process.env.MEOW_API_KEY });

// Retrieve verified tools for Gmail and GitHub
const tools = await meow.getTools({ 
  apps: ["gmail", "github"] 
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Check my unread PRs and summarize to Slack" }],
  tools: tools,
});

// Meow Bot executes tool calls securely
const result = await meow.handleToolCalls(response);
console.log("Completed execution:", result);`,
  },
  anthropic: {
    name: "Anthropic",
    installCmd: "npm install @meow/sdk @anthropic-ai/sdk",
    code: `import Anthropic from "@anthropic-ai/sdk";
import { MeowBot } from "@meow/sdk";

const anthropic = new Anthropic();
const meow = new MeowBot({ apiKey: process.env.MEOW_API_KEY });

const tools = await meow.getAnthropicTools(["slack", "linear", "jira"]);

const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 2048,
  messages: [{ role: "user", content: "Sync customer bug reports to Linear issues" }],
  tools: tools,
});

await meow.handleToolCalls(response);`,
  },
  vercel: {
    name: "Vercel AI SDK",
    installCmd: "npm install @meow/sdk ai @ai-sdk/openai",
    code: `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getMeowAiTools } from "@meow/sdk/ai-sdk";

export async function POST(req: Request) {
  const tools = await getMeowAiTools(["googlecalendar", "notion"]);

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Schedule sync with Manish and update the Notion project roadmap",
    tools,
    maxSteps: 5,
  });

  return Response.json({ text });
}`,
  },
  gemini: {
    name: "Google Gemini",
    installCmd: "npm install @meow/sdk @google/genai",
    code: `import { GoogleGenAI } from "@google/genai";
import { MeowBot } from "@meow/sdk";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const meow = new MeowBot({ apiKey: process.env.MEOW_API_KEY });

const tools = await meow.getGeminiTools(["gmail", "hubspot", "salesforce"]);

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Draft quote follow-ups for warm leads and queue in Inngest scheduler",
  config: { tools },
});

await meow.executeGeminiCalls(response);`,
  },
  langchain: {
    name: "LangChain",
    installCmd: "npm install @meow/sdk @langchain/core @langchain/openai",
    code: `import { ChatOpenAI } from "@langchain/openai";
import { MeowToolSet } from "@meow/sdk/langchain";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

const meowToolSet = new MeowToolSet();
const tools = await meowToolSet.getTools({ apps: ["slack", "github", "discord"] });

const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
const agent = await createOpenAIToolsAgent({ llm, tools, prompt });
const executor = new AgentExecutor({ agent, tools });

await executor.invoke({ input: "Run morning standup rollup across repo commits" });`,
  },
};

export function FrameworksSection() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>("openai");
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
      <div className="pointer-events-none absolute -top-40 right-1/4 size-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 mb-2">
            DEVELOPER PLATFORM & SDK
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white font-sans">
            Build it into your agent
          </h2>
          <p className="mt-4 max-w-xl text-neutral-400 text-base sm:text-lg leading-relaxed">
            Your agent gets the same layer. Your users connect their own accounts, and Meow Bot runs every call.
          </p>

          <Link href="/workspace" className="mt-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-all hover:bg-white/10 hover:border-white/40 shadow-xs"
            >
              <span>EXPLORE THE PLATFORM</span>
              <span className="text-xs">↗</span>
            </button>
          </Link>
        </div>

        {/* Works with any framework subheader & tabs */}
        <div id="frameworks" className="mt-8 flex flex-col items-center">
          <h3 className="font-mono text-sm uppercase tracking-wider text-neutral-400 mb-5">
            Works with any framework
          </h3>

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
          <div className="w-full max-w-4xl rounded-2xl border border-white/15 bg-[#0D0D11] shadow-2xl overflow-hidden font-mono text-xs">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#121217]">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#FF5F56]" />
                <span className="size-3 rounded-full bg-[#FFBD2E]" />
                <span className="size-3 rounded-full bg-[#27C93F]" />
                <span className="ml-2 text-neutral-400 text-[11px]">quickstart.ts</span>
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
      </div>
    </section>
  );
}