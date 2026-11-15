"use client";

import React, { useState } from "react";
import {
  Globe,
  Sparkles,
  Play,
  Terminal,
  ExternalLink,
  Layers,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  Code2,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Bot,
  ShoppingCart,
  Briefcase,
  Share2,
  CheckCheck,
  ShieldAlert,
  Send,
  Loader2,
  Check,
  X,
  Edit3,
} from "lucide-react";
import { BrowserActionStep, AutonomousTaskResult } from "@/lib/automation/browserbase";

export default function AutonomousBrowserAgentPage() {
  const [instruction, setInstruction] = useState(
    "Open my X account, research trending AI topics, draft a post about NVIDIA, and publish it after my approval."
  );
  const [agentRole, setAgentRole] = useState<"social" | "research" | "shopping" | "job" | "qa">("social");
  const [isRunning, setIsRunning] = useState(false);
  const [taskResult, setTaskResult] = useState<AutonomousTaskResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Approval state
  const [isApproving, setIsApproving] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [approvalResult, setApprovalResult] = useState<{ publishedUrl?: string; message: string } | null>(null);

  const agentArchetypes = [
    {
      id: "social" as const,
      name: "Social Media Manager",
      icon: Share2,
      badge: "Stagehand + X",
      desc: "Researches trends, drafts posts, and publishes after your explicit human sign-off.",
      samplePrompt: "Open my X account, research trending AI topics, draft a post about NVIDIA, and publish it after my approval.",
    },
    {
      id: "research" as const,
      name: "Research Agent",
      icon: Search,
      badge: "Deep Web Crawler",
      desc: "Navigates whitepapers, docs, and news feeds to synthesize structured research.",
      samplePrompt: "Navigate to arxiv.org and Hacker News, find the latest papers on reasoning LLMs, and summarize 3 core breakthroughs.",
    },
    {
      id: "shopping" as const,
      name: "Shopping & Price Agent",
      icon: ShoppingCart,
      badge: "Cart & Price Engine",
      desc: "Scrapes competitor pricing across e-commerce portals and prepares order carts.",
      samplePrompt: "Inspect tech stores for RTX 4090 availability, extract current prices, and compare discounts.",
    },
    {
      id: "job" as const,
      name: "Job & Career Agent",
      icon: Briefcase,
      badge: "Portal Automation",
      desc: "Searches open AI engineering roles, extracts requirements, and prepares applications.",
      samplePrompt: "Search tech job boards for 'Senior AI Agent Engineer', filter by remote, and list top 5 openings with required skills.",
    },
    {
      id: "qa" as const,
      name: "QA & Site Tester",
      icon: ShieldCheck,
      badge: "Playwright Verifier",
      desc: "Visits your web application, clicks buttons, validates responsiveness, and reports errors.",
      samplePrompt: "Navigate through meow.vercel.app, test sign-in flow, check navigation links, and verify zero 404 errors.",
    },
  ];

  const handleRunTask = async (customInstruction?: string) => {
    const promptToRun = customInstruction || instruction;
    if (!promptToRun.trim()) return;

    setIsRunning(true);
    setError(null);
    setTaskResult(null);
    setApprovalStatus("pending");
    setApprovalResult(null);

    try {
      const res = await fetch("/api/browser/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction: promptToRun.trim(),
          agentRole,
          requiresApproval: true,
        }),
      });

      const data: AutonomousTaskResult = await res.json();
      if (!res.ok) {
        throw new Error((data as any).error || "Browser automation failed");
      }

      setTaskResult(data);
      if (data.pendingApproval?.payloadText) {
        setDraftText(data.pendingApproval.payloadText);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Autonomous browser execution failed";
      setError(msg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApprovalAction = async (approved: boolean) => {
    if (!taskResult) return;
    setIsApproving(true);

    try {
      const res = await fetch("/api/browser/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: taskResult.taskId,
          approved,
          modifiedDraft: draftText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      setApprovalStatus(approved ? "approved" : "rejected");
      setApprovalResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record approval";
      setError(msg);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0c0d10] via-[#0f1117] to-indigo-950/20 p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <Bot className="h-3.5 w-3.5" />
              <span>Meow · Autonomous AI Browser Agent Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Operate Websites Like a Human
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Give your agent instructions in plain English. Meow opens cloud browsers via{" "}
              <strong className="text-white">Browserbase</strong>, observes DOM state using{" "}
              <strong className="text-white">Stagehand</strong>, executes human-like clicks with{" "}
              <strong className="text-white">Playwright</strong>, and halts for your explicit approval before publishing.
            </p>
          </div>

          {/* Tech Stack Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] font-mono text-indigo-400 font-bold block">AI Brain</span>
              <span className="text-xs text-white font-semibold">Gemini 2.5</span>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] font-mono text-emerald-400 font-bold block">Cloud Browser</span>
              <span className="text-xs text-white font-semibold">Browserbase</span>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] font-mono text-purple-400 font-bold block">AI Interaction</span>
              <span className="text-xs text-white font-semibold">Stagehand</span>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] font-mono text-amber-400 font-bold block">Automation</span>
              <span className="text-xs text-white font-semibold">Playwright</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── AGENT ARCHETYPE SELECTOR ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-white/40 tracking-wider">
            Select Specialized Browser Agent Archetype
          </span>
          <span className="text-[11px] text-indigo-400 font-mono">5 Specialized Engines Active</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {agentArchetypes.map((archetype) => {
            const Icon = archetype.icon;
            const isSelected = agentRole === archetype.id;
            return (
              <div
                key={archetype.id}
                onClick={() => {
                  setAgentRole(archetype.id);
                  setInstruction(archetype.samplePrompt);
                }}
                className={`rounded-2xl border p-4 space-y-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.02]"
                    : "border-white/[0.08] bg-[#0c0d10] hover:border-white/20 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-white/5 text-white/70"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">
                    {archetype.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{archetype.name}</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed pt-1">{archetype.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── INSTRUCTION RUNNER & LIVE PLAYWRIGHT CONSOLE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Natural Language Command Input (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <span>Command Meow Browser Agent</span>
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Playwright CDP Connected
              </span>
            </div>

            {/* Instruction Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70">Agent Prompt / User Directive</label>
              <textarea
                rows={3}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Give Meow instructions (e.g. 'find price of ipad on flipkart' or 'Open X, research AI, draft post')..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white placeholder:text-white/30 focus:border-indigo-500 focus:outline-none leading-relaxed font-sans"
              />
              
              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "find price of ipad on flipkart",
                  "check price of RTX 4090 on amazon",
                  "Open my X account, research trending AI topics, draft a post about NVIDIA, and publish it after my approval.",
                  "extract top discussions from hacker news",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setInstruction(chip);
                      handleRunTask(chip);
                    }}
                    className="text-[10px] font-mono rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2 py-1 text-white/60 hover:text-white transition-colors cursor-pointer text-left truncate max-w-full"
                  >
                    ⚡ {chip.length > 36 ? chip.slice(0, 36) + "..." : chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Execute Button */}
            <button
              type="button"
              onClick={() => handleRunTask()}
              disabled={isRunning || !instruction.trim()}
              className="w-full py-3 px-4 rounded-xl bg-white text-black text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-md hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Launching Cloud Browser & Stagehand...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>Execute Autonomous Browser Agent</span>
                </>
              )}
            </button>
          </div>

          {/* Cloud Browser Session Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60 font-mono">Browserbase Session</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Headless Chromium
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              When triggered, Meow spins up an isolated sandbox browser in the cloud, navigates to the target service, and observes DOM actions via Stagehand AI.
            </p>
          </div>
        </div>

        {/* Right Console: Live Action Traces & Human Gate (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 shadow-xl space-y-6 min-h-[520px] flex flex-col justify-between">
            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono text-white/80">Autonomous Action Stream (Stagehand ReAct)</span>
              </div>
              {taskResult && (
                <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded border border-indigo-500/20">
                  Task ID: {taskResult.taskId}
                </span>
              )}
            </div>

            {/* Console Content */}
            <div className="flex-1 space-y-4">
              {isRunning && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 text-white/50">
                  <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-medium text-white/70">Connecting to Browserbase Cloud Session...</p>
                  <p className="text-[11px] text-white/40 font-mono">
                    stagehand.page.goto() ➔ stagehand.page.observe() ➔ reasoning
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span>Browser Automation Error</span>
                  </div>
                  <p className="text-[11px] font-mono text-red-400/90">{error}</p>
                </div>
              )}

              {!isRunning && !error && !taskResult && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 text-white/30">
                  <Cpu className="h-10 w-10 text-white/20" />
                  <p className="text-xs font-semibold text-white/60">Autonomous Agent Idle</p>
                  <p className="text-[11px] max-w-md leading-relaxed text-white/40">
                    Click &ldquo;Execute Autonomous Browser Agent&rdquo; above. The agent will launch a browser, inspect page targets, formulate actions, and halt for your review.
                  </p>
                </div>
              )}

              {!isRunning && taskResult && (
                <div className="space-y-4">
                  {/* Step By Step Execution Traces */}
                  {taskResult.steps.map((step) => {
                    const isApproval = step.action === "approval_request";
                    return (
                      <div
                        key={step.stepNumber}
                        className={`rounded-xl border p-4 space-y-2.5 font-mono text-xs transition-all ${
                          isApproval
                            ? "border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/5"
                            : "border-white/[0.08] bg-black/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isApproval ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                              }`}
                            />
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                isApproval ? "text-amber-400" : "text-emerald-400"
                              }`}
                            >
                              Step {step.stepNumber}: {step.action.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[10px] text-white/40">{step.target}</span>
                        </div>

                        <p className="text-[11px] font-sans text-white/80">{step.description}</p>

                        {step.codeSnippet && (
                          <div className="rounded-lg bg-black/60 p-2.5 border border-white/5 text-indigo-300 text-[11px] overflow-x-auto">
                            <code>{step.codeSnippet}</code>
                          </div>
                        )}

                        {step.outputSummary && (
                          <p className="text-[11px] text-white/60">↳ {step.outputSummary}</p>
                        )}
                      </div>
                    );
                  })}

                  {/* ─── LIVE COMPLETED RESULTS CARD ─── */}
                  {taskResult.status === "completed" && taskResult.finalOutput && (
                    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#0e1615] to-[#0c0d10] p-6 space-y-4 shadow-2xl animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <h3 className="text-sm font-bold text-white">
                            Autonomous Browser Findings
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
                          Live Data Extracted
                        </span>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/60 p-4 text-xs font-sans text-white/90 leading-relaxed whitespace-pre-line space-y-2">
                        {taskResult.finalOutput}
                      </div>
                    </div>
                  )}

                  {/* ─── HUMAN IN THE LOOP APPROVAL CARD (THE EXACT EXAMPLE) ─── */}
                  {taskResult.status === "waiting_approval" && approvalStatus === "pending" && (
                    <div className="rounded-2xl border-2 border-amber-500/60 bg-[#0f1117] p-6 space-y-4 shadow-2xl shadow-amber-500/10 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-5 w-5 text-amber-400" />
                          <h3 className="text-sm font-bold text-white">
                            Human Approval Required Before Publishing
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold">
                          Write Action Gate
                        </span>
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed font-sans">
                        Meow has analyzed live data from the web and prepared the draft below. Please review or edit the content before Playwright executes the final publication:
                      </p>

                      {/* Editable Draft */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-white/40 font-mono">
                          <span>Drafted Social Post</span>
                          <span className="flex items-center gap-1 text-indigo-400">
                            <Edit3 className="h-3 w-3" /> Editable
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={draftText}
                          onChange={(e) => setDraftText(e.target.value)}
                          className="w-full rounded-xl border border-white/20 bg-black/60 p-3 text-xs text-white placeholder:text-white/30 focus:border-indigo-500 focus:outline-none font-sans leading-relaxed"
                        />
                      </div>

                      {/* Approval Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleApprovalAction(true)}
                          disabled={isApproving}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                        >
                          {isApproving ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 stroke-[3]" />
                          )}
                          <span>Approve & Publish to X</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApprovalAction(false)}
                          disabled={isApproving}
                          className="py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmed Approved Success Card */}
                  {approvalStatus === "approved" && approvalResult && (
                    <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Action Approved & Successfully Executed via Playwright</span>
                      </div>
                      <p className="text-white/80 font-sans">{approvalResult.message}</p>
                      {approvalResult.publishedUrl && (
                        <p className="font-mono text-indigo-400 pt-1">
                          Live Publication:{" "}
                          <a href={approvalResult.publishedUrl} target="_blank" rel="noreferrer" className="underline">
                            {approvalResult.publishedUrl}
                          </a>
                        </p>
                      )}
                    </div>
                  )}

                  {approvalStatus === "rejected" && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
                      Publication cancelled by user. No external actions were executed.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Console Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] text-white/40 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Browserbase Cloud Runner Ready
              </span>
              <span>Stagehand v1.2 Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
