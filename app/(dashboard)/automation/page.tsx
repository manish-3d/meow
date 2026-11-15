"use client";

import React, { useState } from "react";
import {
  Globe,
  Play,
  Terminal,
  ExternalLink,
  Layers,
  Copy,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  ShoppingCart,
  Share2,
  Check,
  X,
  Edit3,
  Bot,
  Briefcase,
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
      name: "Social Media (X)",
      samplePrompt: "Open my X account, research trending AI topics, draft a post about NVIDIA, and publish it after my approval.",
    },
    {
      id: "shopping" as const,
      name: "Price Finder (Flipkart/Amazon)",
      samplePrompt: "find price of ipad on flipkart",
    },
    {
      id: "research" as const,
      name: "Deep Web Research",
      samplePrompt: "Search Hacker News and technical blogs for 'autonomous browser agents', extract key breakthroughs.",
    },
    {
      id: "job" as const,
      name: "Job Harvester",
      samplePrompt: "Search tech job boards for 'Senior AI Agent Engineer', filter by remote, and list top openings.",
    },
    {
      id: "qa" as const,
      name: "Site QA & Tester",
      samplePrompt: "Navigate to meow-five-theta.vercel.app, test navigation links, and verify zero 404 errors.",
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
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8 font-sans selection:bg-black/10 selection:text-black">
      {/* ─── 1. HERO HEADER (Clean Minimalist Black & White) ─── */}
      <div className="rounded-2xl border border-[#ebe8e4] bg-white p-7 sm:p-9 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F4F0] px-3 py-1 text-xs font-medium text-black border border-[#ebe8e4]">
              <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
              <span>Autonomous Browser Agent Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-[-0.03em] text-black">
              Operate Websites Like a Human
            </h1>
            <p className="text-sm text-[#777169] leading-relaxed">
              Give your agent instructions in plain English. Meow opens stealth browsers, observes DOM elements via Stagehand, scrapes real live data with zero API fees, and pauses for human approval before write actions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center shrink-0">
            <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-3">
              <span className="text-[11px] font-mono text-[#777169] block">Engine</span>
              <span className="text-xs text-black font-semibold">Playwright</span>
            </div>
            <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-3">
              <span className="text-[11px] font-mono text-[#777169] block">Vision</span>
              <span className="text-xs text-black font-semibold">Stagehand</span>
            </div>
            <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-3">
              <span className="text-[11px] font-mono text-[#777169] block">Cloud Host</span>
              <span className="text-xs text-black font-semibold">Browserbase</span>
            </div>
            <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-3">
              <span className="text-[11px] font-mono text-[#777169] block">Cost</span>
              <span className="text-xs text-black font-semibold">$0.00 Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. AGENT ARCHETYPE SEGMENTED PILLS ─── */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#9E988F]">
          Target Archetype
        </span>
        <div className="inline-flex flex-wrap p-1 bg-[#F5F4F0] rounded-full border border-[#ebe8e4] gap-1">
          {agentArchetypes.map((archetype) => {
            const isSelected = agentRole === archetype.id;
            return (
              <button
                key={archetype.id}
                onClick={() => {
                  setAgentRole(archetype.id);
                  setInstruction(archetype.samplePrompt);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-black text-white shadow-xs"
                    : "text-[#777169] hover:text-black"
                }`}
              >
                {archetype.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. DIRECTIVE INPUT CARD ─── */}
      <div className="rounded-2xl border border-[#ebe8e4] bg-white p-6 sm:p-8 shadow-[0_1px_1px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between text-xs text-[#777169]">
          <span className="font-semibold text-black uppercase tracking-wider text-[11px]">
            Natural Language Directive
          </span>
          <span className="font-mono text-[11px]">Human-in-the-Loop Active</span>
        </div>

        {/* 1-Click Quick Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-[#9E988F] font-mono">Quick test:</span>
          <button
            type="button"
            onClick={() => {
              const p = "find price of ipad on flipkart";
              setInstruction(p);
              setAgentRole("shopping");
              handleRunTask(p);
            }}
            className="rounded-full border border-[#ebe8e4] bg-[#FAFAF9] px-3 py-1 text-xs text-black hover:bg-black hover:text-white transition-all active:scale-[0.98]"
          >
            ⚡ find price of ipad on flipkart
          </button>
          <button
            type="button"
            onClick={() => {
              const p = "check price of RTX 4090 on amazon";
              setInstruction(p);
              setAgentRole("shopping");
              handleRunTask(p);
            }}
            className="rounded-full border border-[#ebe8e4] bg-[#FAFAF9] px-3 py-1 text-xs text-black hover:bg-black hover:text-white transition-all active:scale-[0.98]"
          >
            ⚡ check RTX 4090 on amazon
          </button>
          <button
            type="button"
            onClick={() => {
              const p = "Open my X account, research trending AI topics, draft a post about NVIDIA, and publish it after my approval.";
              setInstruction(p);
              setAgentRole("social");
              handleRunTask(p);
            }}
            className="rounded-full border border-[#ebe8e4] bg-[#FAFAF9] px-3 py-1 text-xs text-black hover:bg-black hover:text-white transition-all active:scale-[0.98]"
          >
            ⚡ Post to X (with approval)
          </button>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={isRunning}
            rows={3}
            className="w-full resize-none rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4 text-sm text-black placeholder-[#9E988F] outline-none focus:border-black focus:bg-white transition-all disabled:opacity-50"
            placeholder="Tell Meow what to do on the web..."
          />
        </div>

        {/* Execution Toolbar */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-[#777169] flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span>Dual-Mode: Cloud Browserbase / Local Stealth</span>
          </div>

          <button
            onClick={() => handleRunTask()}
            disabled={isRunning || !instruction.trim()}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-black text-white text-xs sm:text-sm font-medium hover:bg-neutral-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xs"
          >
            {isRunning ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Running Browser Agent...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Autonomous Browser</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* ─── 4. HUMAN-IN-THE-LOOP APPROVAL CARD (Black & White Minimalist) ─── */}
      {taskResult && taskResult.status === "waiting_approval" && (
        <div className="rounded-2xl border-2 border-black bg-white p-7 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebe8e4]">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                Human Approval Required
              </span>
              <span className="text-xs font-semibold text-black">
                Write Action Halted
              </span>
            </div>
            <span className="text-xs text-[#777169] font-mono">
              Target: {taskResult.pendingApproval?.targetPlatform || "X / Twitter"}
            </span>
          </div>

          <p className="text-xs text-[#777169]">
            The autonomous browser researched the topic, drafted the content below, and paused before publishing. You may review and edit the draft:
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#777169]">
              <span className="font-semibold text-black flex items-center gap-1.5">
                <Edit3 className="h-3.5 w-3.5" /> Editable Post Draft
              </span>
              <span className="font-mono text-[11px]">{draftText.length} characters</span>
            </div>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              disabled={isApproving || approvalStatus !== "pending"}
              rows={4}
              className="w-full resize-none rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4 text-sm font-sans text-black outline-none focus:border-black focus:bg-white transition-all disabled:opacity-50"
            />
          </div>

          {approvalStatus === "pending" ? (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleApprovalAction(false)}
                disabled={isApproving}
                className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full border border-[#ebe8e4] bg-white text-xs font-medium text-black hover:bg-neutral-100 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reject / Cancel</span>
              </button>
              <button
                onClick={() => handleApprovalAction(true)}
                disabled={isApproving}
                className="inline-flex items-center gap-1.5 h-10 px-6 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xs"
              >
                {isApproving ? (
                  <>
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Publishing to X...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve & Publish to X</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              className={`rounded-xl border p-4 text-xs font-medium ${
                approvalStatus === "approved"
                  ? "border-black bg-[#FAFAF9] text-black"
                  : "border-[#ebe8e4] bg-[#FAFAF9] text-[#777169]"
              }`}
            >
              {approvalStatus === "approved" ? (
                <div className="space-y-1">
                  <div className="font-semibold text-black">✓ Published Successfully</div>
                  <p className="text-[#777169]">{approvalResult?.message}</p>
                  {approvalResult?.publishedUrl && (
                    <a
                      href={approvalResult.publishedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-black underline font-mono text-[11px] pt-1"
                    >
                      {approvalResult.publishedUrl} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ) : (
                <div>✕ Action Rejected by User. Browser session terminated without publishing.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── 5. AUTONOMOUS FINDINGS (Structured Results Card) ─── */}
      {taskResult && taskResult.status === "completed" && taskResult.finalOutput && (
        <div className="rounded-2xl border border-[#ebe8e4] bg-white p-7 shadow-[0_1px_1px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebe8e4]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-black" />
              <span className="font-semibold text-black text-sm">
                Autonomous Browser Findings
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#777169]">
              Scraped without API fees
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-black leading-relaxed whitespace-pre-wrap font-sans">
            {taskResult.finalOutput}
          </div>
        </div>
      )}

      {/* ─── 6. EXECUTION TRACE STEPS ─── */}
      {taskResult && taskResult.steps && taskResult.steps.length > 0 && (
        <div className="rounded-2xl border border-[#ebe8e4] bg-white p-7 shadow-[0_1px_1px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebe8e4]">
            <span className="font-semibold text-black text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4" /> Stagehand Execution Steps ({taskResult.steps.length})
            </span>
            <span className="text-[11px] font-mono text-[#777169]">
              Session: {taskResult.sessionId}
            </span>
          </div>

          <div className="space-y-4">
            {taskResult.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-black text-white font-mono text-[10px] flex items-center justify-center font-bold">
                      {step.stepNumber}
                    </span>
                    <span className="font-semibold text-black uppercase tracking-wider text-[11px]">
                      {step.action}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      step.status === "completed"
                        ? "bg-black text-white"
                        : step.status === "waiting_approval"
                        ? "border border-black bg-white text-black font-bold"
                        : "bg-[#ebe8e4] text-[#777169]"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <p className="text-black leading-relaxed">{step.description}</p>

                {step.codeSnippet && (
                  <pre className="rounded-lg bg-[#18181B] p-3 font-mono text-[11px] text-white/90 overflow-x-auto">
                    <code>{step.codeSnippet}</code>
                  </pre>
                )}

                {step.outputSummary && (
                  <div className="text-[#777169] text-[11px] border-t border-[#ebe8e4] pt-2">
                    &gt; {step.outputSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
