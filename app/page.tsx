"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Terminal,
  Bot,
  CheckCircle2,
  Share2,
  Cpu,
  Layers,
  Lock,
  ExternalLink,
  ChevronRight,
  Code2,
  CreditCard,
  Check,
  Play,
  RotateCcw,
  Sliders,
  LogOut,
} from "lucide-react";

export default function LandingPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.name || user?.email?.split("@")[0] || "Workspace";
  const initials = displayName.slice(0, 2).toUpperCase();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeScenario, setActiveScenario] = useState<"crawler" | "monitor" | "workflow">("crawler");
  const [simStep, setSimStep] = useState<number>(3); // 1 = thinking, 2 = tool execution, 3 = completed
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const runSimulation = (scenario: "crawler" | "monitor" | "workflow") => {
    setActiveScenario(scenario);
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => {
      setSimStep(2);
      setTimeout(() => {
        setSimStep(3);
        setIsSimulating(false);
      }, 1200);
    }, 900);
  };

  const scenarios = {
    crawler: {
      name: "Web Intelligence",
      title: "Autonomous Web Scraping & Market Intelligence",
      prompt: "Navigate to tech publications and HackerNews, extract trending AI agent breakthroughs, and summarize insights.",
      toolCall: 'browser_navigate({ url: "https://news.ycombinator.com", extractLinks: true })',
      toolOutput: "HTTP 200 OK (142ms). Extracted 30 headlines, 15 discussions. Found major trends in autonomous workflows & local reasoning models.",
      actionCall: 'browser_extract({ url: "https://news.ycombinator.com", targetTopic: "agent" })',
      result: "Extracted 6 targeted breakthroughs with zero API fees or platform restrictions.",
    },
    monitor: {
      name: "Competitor Monitor",
      title: "Competitor Price & Changelog Monitoring",
      prompt: "Inspect competitor pricing pages, detect tier changes, and alert our team.",
      toolCall: 'browser_extract({ url: "https://example.com/pricing", targetTopic: "enterprise" })',
      toolOutput: "Extracted table: Standard ($29/mo), Enterprise ($99/mo). Discovered new feature add-ons.",
      actionCall: 'github_create_issue({ owner: "manish", repo: "meow", title: "Automated Competitor Pricing Audit" })',
      result: "Audit complete and logged directly into our repository issue tracker.",
    },
    workflow: {
      name: "Form Automation",
      title: "Headless Form & Web Action Automation",
      prompt: "Execute automated web form interactions and lead discovery across public directories.",
      toolCall: 'browser_action({ actionType: "search_query", targetUrl: "https://directory.com", queryOrData: "AI software founders" })',
      toolOutput: "Submitted search query. Extracted 24 confirmed company records and verified domain links.",
      actionCall: 'file_write({ path: "leads/ai-startups.json" })',
      result: "Successfully saved structured lead intelligence to workspace disk.",
    },
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] selection:bg-indigo-500/30 selection:text-white relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.18),transparent_60%)] pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none -z-10" />

      {/* ─── NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08090a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Meow Logo"
              className="h-8 w-8 rounded-full border border-white/20 object-cover shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">Meow</span>
              <span className="text-[10px] font-mono uppercase bg-white/10 text-white/70 px-2 py-0.5 rounded-full border border-white/10 font-semibold tracking-wider">
                Agent OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#simulator" className="hover:text-white transition-colors">Simulator</a>
            <Link href="/automation" className="hover:text-white transition-colors">Automation</Link>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/agents" className="hover:text-white transition-colors">Agents</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/overview"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-all"
                >
                  <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                    {user?.image ? (
                      <img src={user.image} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <span className="hidden sm:inline">{displayName}</span>
                </Link>
                <Link
                  href="/overview"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 shadow-sm transition-all hover:scale-[1.02]"
                >
                  <span>Open App</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs font-semibold text-white/50 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-xs font-semibold text-white/70 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 shadow-sm transition-all hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="pt-24 pb-16 px-6 max-w-5xl mx-auto text-center space-y-8">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-xs hover:border-white/20 transition-all cursor-pointer">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-white/80">
            Meow Agent OS 2.0 · Linear Inspired Architecture
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        </div>

        {/* Hero Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
            The AI Agent <br />
            <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
              Operating System.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-normal">
            Orchestrate autonomous AI agents with sandboxed tool execution, 1-click OAuth workspace integrations, human approval safety gates, and Stripe enterprise subscriptions.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href={session ? "/overview" : "/sign-in"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-7 py-3 text-sm font-bold shadow-md hover:bg-white/90 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>{session ? "Open Your Workspace" : "Get Started with Meow"}</span>
          </Link>
          <a
            href="#simulator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition-colors"
          >
            <Terminal className="h-4 w-4 text-white/70" />
            <span>Explore Live Simulator</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-white/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Gemini 2.5 Flash Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Neon Cloud PostgreSQL</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Headless Web Automation ($0 Fees)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Stripe Billing Active</span>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE AGENT SIMULATOR (GROK / LINEAR STYLE) ─── */}
      <section id="simulator" className="py-12 px-6 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-white/[0.12] bg-[#0c0d10] shadow-2xl overflow-hidden relative">
          {/* Top Window Bar */}
          <div className="px-5 py-3 border-b border-white/[0.08] bg-[#08090a]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-white/40 pl-2">
                meow-agent-runtime · active thread #1
              </span>
            </div>

            {/* Scenario Switcher Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
              {(["crawler", "monitor", "workflow"] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => runSimulation(sc)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                    activeScenario === sc
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {scenarios[sc].name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Terminal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* User Prompt */}
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-xs font-bold text-indigo-300">
                U
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">User Instruction</span>
                <p className="text-sm text-white font-medium bg-white/[0.03] p-3.5 rounded-xl border border-white/5">
                  &ldquo;{scenarios[activeScenario].prompt}&rdquo;
                </p>
              </div>
            </div>

            {/* Agent Reasoning Steps */}
            <div className="space-y-3 pl-11">
              {/* Step 1: Tool Execution */}
              <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                      Tool Execution
                    </span>
                  </div>
                  <span className="text-[11px] text-white/40">Execution Time: 124ms</span>
                </div>
                <div className="bg-white/[0.03] p-2.5 rounded border border-white/5 text-indigo-300">
                  {scenarios[activeScenario].toolCall}
                </div>
                <div className="text-white/70 text-[11px] leading-relaxed">
                  ↳ {scenarios[activeScenario].toolOutput}
                </div>
              </div>

              {/* Step 2: Action Proposal with Human Gate */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                      Human-in-the-Loop Approval Required
                    </span>
                  </div>
                  <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                    Dangerous Action
                  </span>
                </div>
                <div className="bg-black/50 p-2.5 rounded border border-white/5 text-amber-200 text-[11px]">
                  {scenarios[activeScenario].actionCall}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-white/50">Policy: Write actions require explicit human sign-off.</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                    ✓ Approved & Executed
                  </span>
                </div>
              </div>

              {/* Final Success Response */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-300">
                    {scenarios[activeScenario].result}
                  </span>
                </div>
                <button
                  onClick={() => runSimulation(activeScenario)}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/5 px-2.5 py-1 rounded border border-white/10"
                >
                  <RotateCcw className={`h-3 w-3 ${isSimulating ? "animate-spin" : ""}`} />
                  <span>Re-run</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LINEAR QUOTE SECTION (FROM USER SCREENSHOT) ─── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-8 space-y-6 flex flex-col justify-between">
            <p className="text-lg sm:text-xl font-medium text-white/90 leading-relaxed">
              &ldquo;You&apos;ll probably build a better product, just because of the craft that using Meow infuses on your brain.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                OA
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Staff Software Engineer</h4>
                <p className="text-[11px] text-white/50">AI Research Lab</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-[#16150b] p-8 space-y-6 flex flex-col justify-between">
            <p className="text-lg sm:text-xl font-medium text-yellow-100/90 leading-relaxed">
              &ldquo;Our execution speed is intense and Meow helps us be completely action-based with real autonomous tool calling.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-yellow-500/20">
              <div className="h-9 w-9 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-bold text-yellow-200">Head of Engineering</h4>
                <p className="text-[11px] text-yellow-400/60">Autonomous Infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE BENTO GRID ─── */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Core Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Engineered for high-reliability autonomy
          </h2>
          <p className="text-sm text-white/60 max-w-xl mx-auto">
            Traditional LLM wrappers fail when tasks require multi-step reasoning or real tool execution. Meow delivers a hardened runtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 space-y-4 hover:border-white/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Autonomous ReAct Loop</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Step-by-step reasoning, action emission, observation parsing, and stuck-in-loop detection ensure agents execute complex tasks reliably.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 space-y-4 hover:border-white/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Share2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">1-Click Workspace OAuth</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Connect Twitter / X, Instagram, Reddit, and GitHub instantly. No complicated developer portal registrations or API key setups required.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 space-y-4 hover:border-white/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Human-in-the-Loop Safety</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Sensitive write actions like posting tweets, publishing code, or triggering payments require explicit human approval before execution.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PRICING & STRIPE BILLING SECTION ─── */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Simple, Transparent Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to deploy autonomous agents?
          </h2>
          <p className="text-sm text-white/60 max-w-lg mx-auto">
            Choose the plan that fits your execution volume. All plans include 1-click OAuth and tool sandboxing.
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-medium ${billingCycle === "monthly" ? "text-white" : "text-white/50"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle((prev) => (prev === "monthly" ? "annual" : "monthly"))}
              className="w-12 h-6 rounded-full bg-white/20 p-1 transition-colors relative"
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  billingCycle === "annual" ? "translate-x-6 bg-indigo-400" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${billingCycle === "annual" ? "text-white" : "text-white/50"}`}>
                Annual Billing
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1: Free */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Hobbyist</h3>
                <p className="text-xs text-white/50">For individuals exploring agent runtimes.</p>
              </div>
              <div className="text-3xl font-extrabold font-mono">$0</div>
              <ul className="space-y-2.5 text-xs text-white/70 pt-4 border-t border-white/[0.08]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>50,000 monthly tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Up to 3 active agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>1-Click OAuth Socials (Sandbox)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Human approval safety guardrails</span>
                </li>
              </ul>
            </div>
            <Link
              href={session ? "/overview" : "/sign-in"}
              className="w-full py-2.5 rounded-xl border border-white/20 text-xs font-bold hover:bg-white/10 transition-colors text-center"
            >
              Get Started Free
            </Link>
          </div>

          {/* Plan 2: Pro (Featured) */}
          <div className="rounded-2xl border-2 border-indigo-500/60 bg-[#0f1117] p-8 space-y-6 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-3 py-1 rounded-full shadow-sm">
              Most Popular
            </span>
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Pro</h3>
                <p className="text-xs text-white/50">For serious builders and scaling applications.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono">
                  ${billingCycle === "annual" ? "24" : "29"}
                </span>
                <span className="text-xs text-white/50 font-mono">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-white/70 pt-4 border-t border-white/[0.08]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-white">500,000 monthly tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Unlimited active agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Full live Twitter, Reddit, GitHub posting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Custom skills & tool builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Stripe automated billing & invoices</span>
                </li>
              </ul>
            </div>
            <Link
              href={session ? "/billing" : "/sign-in"}
              className="w-full py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition-all text-center shadow-md flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <CreditCard className="h-4 w-4" />
              <span>Upgrade to Pro with Stripe</span>
            </Link>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Enterprise</h3>
                <p className="text-xs text-white/50">Dedicated infrastructure & custom SLA.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono">
                  ${billingCycle === "annual" ? "79" : "99"}
                </span>
                <span className="text-xs text-white/50 font-mono">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-white/70 pt-4 border-t border-white/[0.08]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">2,500,000 monthly tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Neon DB branch & VPC</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Custom enterprise webhook dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>24/7 Priority support & custom SLA</span>
                </li>
              </ul>
            </div>
            <Link
              href={session ? "/billing" : "/sign-in"}
              className="w-full py-2.5 rounded-xl border border-white/20 text-xs font-bold hover:bg-white/10 transition-colors text-center"
            >
              Upgrade to Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.08] bg-[#08090a] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Meow" className="h-6 w-6 rounded-full border border-white/20" />
            <span className="font-bold text-white text-sm">Meow Agent OS</span>
            <span>·</span>
            <span>Crafted with Linear precision</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/overview" className="hover:text-white transition-colors">Workspace</Link>
            <Link href="/agents" className="hover:text-white transition-colors">Agents</Link>
            <Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link>
            <Link href="/billing" className="hover:text-white transition-colors">Stripe Billing</Link>
            <Link href="/sign-in" className="hover:text-white transition-colors">Account</Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-white/60">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

