"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
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
  Check,
  Play,
  RotateCcw,
  Sliders,
  Globe,
  Sparkles,
  Search,
  ShoppingCart,
  Send,
  Eye,
  Copy,
} from "lucide-react";

export default function ElevenLabsStyleLandingPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.name || user?.email?.split("@")[0] || "Workspace";

  // Platform segmented tabs (ElevenLabs style)
  const [platformTab, setPlatformTab] = useState<"browser" | "pipelines" | "api">("browser");

  // Sub-feature pill selection
  const [subFeature, setSubFeature] = useState<"flipkart" | "amazon" | "twitter" | "jobs">("flipkart");

  // Interactive Demo Sandbox states
  const [demoPrompt, setDemoPrompt] = useState<string>("find price of ipad on flipkart [stealth-mode] [extract-prices]");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [execStep, setExecStep] = useState<number>(3); // 1 = navigating, 2 = observing dom, 3 = completed
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = useState<"ts" | "python" | "curl">("ts");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handleSubFeatureSelect = (feat: "flipkart" | "amazon" | "twitter" | "jobs") => {
    setSubFeature(feat);
    if (feat === "flipkart") {
      setDemoPrompt("find price of ipad on flipkart [stealth-mode] [extract-prices]");
    } else if (feat === "amazon") {
      setDemoPrompt("check price of RTX 4090 on amazon [observe-stock] [sort-lowest]");
    } else if (feat === "twitter") {
      setDemoPrompt("open x account, research trending AI topics, draft post about NVIDIA [human-approval]");
    } else {
      setDemoPrompt("search tech job boards for 'Senior AI Agent Engineer', filter remote [extract-requirements]");
    }
  };

  const handleRunDemo = () => {
    setIsExecuting(true);
    setExecStep(1);
    setTimeout(() => {
      setExecStep(2);
      setTimeout(() => {
        setExecStep(3);
        setIsExecuting(false);
      }, 900);
    }, 700);
  };

  const codeSnippets = {
    ts: `import { stagehand } from "@meow/browser-agent";

// 1. Launch stealth browser session
await stagehand.page.goto("https://www.flipkart.com/search?q=ipad", {
  waitUntil: "domcontentloaded",
});

// 2. Observe DOM and extract structured catalog items
const products = await stagehand.page.extract({
  instruction: "Extract product titles and live INR prices",
  schema: z.array(z.object({ title: z.string(), price: z.string() })),
});

console.log("Extracted live pricing:", products);`,
    python: `from meow_agent import AutonomousBrowser

async with AutonomousBrowser(stealth=True) as agent:
    # 1. Navigate to target portal
    await agent.goto("https://www.flipkart.com/search?q=ipad")
    
    # 2. Extract structured pricing without platform API fees
    results = await agent.extract(
        instruction="Extract product titles and live prices"
    )
    print("Found live listings:", results)`,
    curl: `curl -X POST https://meow-five-theta.vercel.app/api/browser/execute \\
  -H "Content-Type: application/json" \\
  -d '{
    "instruction": "find price of ipad on flipkart",
    "agentRole": "shopping",
    "requiresApproval": false
  }'`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[codeLanguage]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFC] text-black font-sans selection:bg-black/10 selection:text-black relative antialiased">
      {/* ─── 1. TOP ANNOUNCEMENT BAR (ElevenLabs Style) ─── */}
      <div className="border-b border-[#ebe8e4] bg-[#FDFCFC] text-xs font-normal text-black flex items-center justify-center gap-2 px-4 h-11 transition-colors">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F4F0] border border-[#ebe8e4] px-2.5 py-0.5 text-[11px] font-medium text-black">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Meow 2.5
        </span>
        <span className="text-[#777169] hidden sm:inline">
          Autonomous AI Browser Automation & Stagehand Engine is Live.
        </span>
        <Link
          href="/automation"
          className="font-medium text-black hover:text-[#777169] transition-colors inline-flex items-center gap-1"
        >
          Try Studio <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* ─── 2. STICKY MAIN NAVBAR ─── */}
      <header className="sticky top-0 z-50 border-b border-[#ebe8e4] bg-[#FDFCFC]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="text-base font-semibold tracking-tight text-black">Meow</span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-normal text-black">
            <Link href="/automation" className="hover:text-[#777169] transition-colors">
              Browser Studio
            </Link>
            <Link href="/overview" className="hover:text-[#777169] transition-colors">
              Workflow Pipelines
            </Link>
            <Link href="#features" className="hover:text-[#777169] transition-colors">
              Architecture
            </Link>
            <Link href="#developer" className="hover:text-[#777169] transition-colors">
              Developers
            </Link>
            <Link href="#pricing" className="hover:text-[#777169] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/automation"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-[#374151] active:scale-[0.98] transition-all"
                >
                  Enter Studio
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs text-[#777169] hover:text-black px-2 py-1 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-xs font-medium text-black px-3 py-1.5 hover:text-[#777169] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-[#374151] active:scale-[0.98] transition-all shadow-xs"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── 3. HERO SECTION (ElevenLabs Swiss Display Style) ─── */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 max-w-5xl mx-auto px-6 text-center">
        {/* Floating Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ebe8e4] bg-white text-xs font-normal text-[#777169] mb-8 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Stagehand + Playwright Autonomous Cloud Runtime</span>
        </div>

        {/* Big Swiss H1 Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-[-0.03em] leading-[1.02] text-black text-balance mb-6">
          Bringing the web to life
        </h1>

        {/* Elegant Subtitle */}
        <p className="text-base sm:text-xl text-[#777169] max-w-2xl mx-auto font-normal leading-relaxed text-balance mb-10">
          Powering the next generation of autonomous browser agents. Research topics across websites, extract live DOM data, bypass anti-bot challenges, and automate actions with human-in-the-loop safety.
        </p>

        {/* Dual Signature Pill CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <Link
            href="/automation"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-black text-white text-sm font-medium hover:bg-[#374151] active:scale-[0.98] transition-all shadow-xs"
          >
            Launch Browser Engine <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
          <Link
            href="/overview"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-white text-black text-sm font-medium shadow-[0_1px_1px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.04)] ring-[0.5px] ring-black/12.5 hover:bg-[#FAFAF9] active:scale-[0.98] transition-all"
          >
            Explore Workflows
          </Link>
        </div>

        {/* ─── 4. SEGMENTED PLATFORM PILL TABS (ElevenLabs Style) ─── */}
        <div className="inline-flex p-1 bg-[#F5F4F0] rounded-full border border-[#ebe8e4] mb-5">
          <button
            onClick={() => setPlatformTab("browser")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              platformTab === "browser"
                ? "bg-white text-black shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                : "text-[#777169] hover:text-black"
            }`}
          >
            MeowBrowser
          </button>
          <button
            onClick={() => setPlatformTab("pipelines")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              platformTab === "pipelines"
                ? "bg-white text-black shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                : "text-[#777169] hover:text-black"
            }`}
          >
            MeowPipelines
          </button>
          <button
            onClick={() => setPlatformTab("api")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              platformTab === "api"
                ? "bg-white text-black shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                : "text-[#777169] hover:text-black"
            }`}
          >
            MeowAPI
          </button>
        </div>

        {/* Sub-feature quick filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => handleSubFeatureSelect("flipkart")}
            className={`rounded-full px-3.5 py-1 text-xs border transition-all ${
              subFeature === "flipkart"
                ? "border-[#ebe8e4] bg-white text-black shadow-xs font-medium"
                : "border-transparent text-[#777169] hover:text-black"
            }`}
          >
            Flipkart Live Scraper
          </button>
          <button
            onClick={() => handleSubFeatureSelect("amazon")}
            className={`rounded-full px-3.5 py-1 text-xs border transition-all ${
              subFeature === "amazon"
                ? "border-[#ebe8e4] bg-white text-black shadow-xs font-medium"
                : "border-transparent text-[#777169] hover:text-black"
            }`}
          >
            Amazon Price Tracker
          </button>
          <button
            onClick={() => handleSubFeatureSelect("twitter")}
            className={`rounded-full px-3.5 py-1 text-xs border transition-all ${
              subFeature === "twitter"
                ? "border-[#ebe8e4] bg-white text-black shadow-xs font-medium"
                : "border-transparent text-[#777169] hover:text-black"
            }`}
          >
            Social Content Publisher (X)
          </button>
          <button
            onClick={() => handleSubFeatureSelect("jobs")}
            className={`rounded-full px-3.5 py-1 text-xs border transition-all ${
              subFeature === "jobs"
                ? "border-[#ebe8e4] bg-white text-black shadow-xs font-medium"
                : "border-transparent text-[#777169] hover:text-black"
            }`}
          >
            Job & Lead Harvester
          </button>
        </div>

        {/* ─── 5. INTERACTIVE DEMO SANDBOX WIDGET (The ElevenLabs Centerpiece) ─── */}
        <div className="rounded-2xl border border-[#ebe8e4] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 max-w-4xl mx-auto text-left relative overflow-hidden transition-all">
          {/* Top metadata row */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ebe8e4]/60 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black uppercase tracking-wider text-[11px]">Directive Prompt</span>
              <span className="text-[#9E988F]">·</span>
              <span className="text-[#777169] font-mono">Stagehand Act / Extract</span>
            </div>
            <div className="flex items-center gap-2 text-[#777169]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Headless Stealth · Zero API Cost</span>
            </div>
          </div>

          {/* Interactive Textarea */}
          <div className="relative mb-5">
            <textarea
              value={demoPrompt}
              onChange={(e) => setDemoPrompt(e.target.value)}
              rows={3}
              className="w-full resize-none outline-none text-base sm:text-lg text-black font-normal bg-transparent caret-[#2B7FFF] placeholder-[#9E988F]"
              placeholder="Give Meow instructions in plain English (e.g. find price of ipad on flipkart)..."
            />
          </div>

          {/* Bottom Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#ebe8e4]/60">
            <div className="flex items-center gap-2 text-xs text-[#777169]">
              <span className="px-2.5 py-1 rounded-lg border border-[#ebe8e4] bg-[#FAFAF9] text-black font-medium">
                {subFeature === "flipkart" ? "Flipkart DOM" : subFeature === "amazon" ? "Amazon DOM" : subFeature === "twitter" ? "Twitter/X (Approval)" : "Web Directory"}
              </span>
              <span className="hidden sm:inline">Engine: Chromium Stealth</span>
            </div>

            <button
              onClick={handleRunDemo}
              disabled={isExecuting}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-black text-white text-xs sm:text-sm font-medium hover:bg-[#374151] active:scale-[0.98] transition-all ml-auto disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Executing Trace...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Execute Browser Task</span>
                </>
              )}
            </button>
          </div>

          {/* Live Execution Visualizer Card */}
          <div className="mt-6 rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-4.5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#777169] text-[11px] pb-2 border-b border-[#ebe8e4]">
              <span className="flex items-center gap-1.5 text-black font-semibold">
                <Terminal className="h-3.5 w-3.5" /> Stagehand Autonomous Trace
              </span>
              <span>Latency: {isExecuting ? "executing..." : "84ms"}</span>
            </div>

            {/* Step 1: Navigation */}
            <div className="flex items-start gap-2.5">
              <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${execStep >= 1 ? "bg-black text-white" : "bg-[#ebe8e4] text-[#777169]"}`}>
                1
              </span>
              <div className="flex-1">
                <span className="font-semibold text-black">Navigate & Initialize: </span>
                <span className="text-[#777169]">
                  {subFeature === "flipkart"
                    ? "https://www.flipkart.com/search?q=ipad"
                    : subFeature === "amazon"
                    ? "https://www.amazon.in/s?k=rtx+4090"
                    : subFeature === "twitter"
                    ? "https://x.com/explore (Researching AI topics)"
                    : "https://directory.com/jobs"}
                </span>
              </div>
            </div>

            {/* Step 2: DOM Observation */}
            <div className="flex items-start gap-2.5">
              <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${execStep >= 2 ? "bg-black text-white" : "bg-[#ebe8e4] text-[#777169]"}`}>
                2
              </span>
              <div className="flex-1">
                <span className="font-semibold text-black">Inspect & Filter: </span>
                <span className="text-[#777169]">
                  Observed catalog elements, filtered pricing nodes, bypassed anti-bot rate limits with stealth browser headers.
                </span>
              </div>
            </div>

            {/* Step 3: Result Preview */}
            <div className="flex items-start gap-2.5">
              <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${execStep >= 3 ? "bg-emerald-600 text-white" : "bg-[#ebe8e4] text-[#777169]"}`}>
                ✓
              </span>
              <div className="flex-1">
                <span className="font-semibold text-black">Output Extracted: </span>
                {subFeature === "flipkart" ? (
                  <span className="text-emerald-700 font-medium">
                    Apple iPad (10th Gen) 64 GB: <strong>₹27,399</strong> · Apple iPad (9th Gen): <strong>₹32,199</strong> · Apple 2025 iPad (A16): <strong>₹49,900</strong>
                  </span>
                ) : subFeature === "amazon" ? (
                  <span className="text-emerald-700 font-medium">
                    RTX 4090 OC 24GB: <strong>₹1,84,900</strong> (In Stock, 2 sellers)
                  </span>
                ) : subFeature === "twitter" ? (
                  <span className="text-amber-700 font-medium">
                    [HALTED FOR APPROVAL] Drafted post on NVIDIA Alpamayo 2 Edge AI reasoning. Awaiting human confirmation.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium">
                    Extracted 5 verified openings with remote salary bands ($180k - $240k).
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. TRUSTED BY TEAMS (ElevenLabs Style Minimal Logos) ─── */}
      <section className="py-12 border-y border-[#ebe8e4] bg-[#FAFAF9]/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-wider text-[#9E988F] font-semibold mb-6">
            Engineered for modern autonomous web operations & n8n-style pipelines
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-70 grayscale">
            <span className="font-semibold tracking-tight text-sm text-black">PLAYWRIGHT</span>
            <span className="font-semibold tracking-tight text-sm text-black">STAGEHAND</span>
            <span className="font-semibold tracking-tight text-sm text-black">BROWSERBASE</span>
            <span className="font-semibold tracking-tight text-sm text-black">CHROMIUM</span>
            <span className="font-semibold tracking-tight text-sm text-black">INNGEST</span>
          </div>
        </div>
      </section>

      {/* ─── 7. TWO PLATFORMS ARCHITECTURE (ElevenLabs 2-Column Grid) ─── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-light tracking-[-0.03em] text-black mb-4">
            Two platforms built on the same autonomous foundation
          </h2>
          <p className="text-base text-[#777169] leading-relaxed">
            Whether running individual live browser tasks or building automated recurring pipelines, Meow delivers human-grade web execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Browser Studio */}
          <div className="rounded-2xl border border-[#ebe8e4] bg-white p-8 lg:p-10 flex flex-col justify-between hover:border-black/20 transition-all shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F4F0] text-xs font-semibold text-black mb-6">
                <Globe className="h-3.5 w-3.5" /> Meow Studio
              </div>
              <h3 className="text-2xl font-normal text-black mb-3">
                Autonomous Browser Studio
              </h3>
              <p className="text-sm text-[#777169] leading-relaxed mb-8">
                Operate any website like a human. Launch headless or live streaming cloud Chromium browsers, inspect interactive DOM elements, bypass rate limits, and scrape structured catalog data with zero API fees.
              </p>
            </div>

            <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#777169]">
                <span>stagehand.page.observe()</span>
                <span className="text-emerald-600 font-semibold">Active</span>
              </div>
              <div className="text-black bg-white p-3 rounded-lg border border-[#ebe8e4]">
                &gt; "Identified 24 product titles, INR prices, and active buy-now buttons on Flipkart."
              </div>
              <Link
                href="/automation"
                className="inline-flex items-center gap-1 text-xs font-medium text-black hover:text-[#777169] transition-colors pt-2"
              >
                Launch Studio <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Workflow Pipelines */}
          <div className="rounded-2xl border border-[#ebe8e4] bg-white p-8 lg:p-10 flex flex-col justify-between hover:border-black/20 transition-all shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F4F0] text-xs font-semibold text-black mb-6">
                <Layers className="h-3.5 w-3.5" /> Workflow Engine
              </div>
              <h3 className="text-2xl font-normal text-black mb-3">
                n8n-Style Workflow Pipelines
              </h3>
              <p className="text-sm text-[#777169] leading-relaxed mb-8">
                Chain web triggers, Stagehand scrapers, AI summarizers, and human approval gates into self-healing pipelines. Schedule price drop alerts or publish approved content directly to Twitter/X.
              </p>
            </div>

            <div className="rounded-xl border border-[#ebe8e4] bg-[#FAFAF9] p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#777169]">
                <span>pipeline.orchestrate()</span>
                <span className="text-indigo-600 font-semibold">5 Nodes Ready</span>
              </div>
              <div className="text-black bg-white p-3 rounded-lg border border-[#ebe8e4]">
                &gt; Trigger: Hourly Cron → Search Target → Extract Prices → Human Approval Gate → Webhook
              </div>
              <Link
                href="/overview"
                className="inline-flex items-center gap-1 text-xs font-medium text-black hover:text-[#777169] transition-colors pt-2"
              >
                View Pipelines Hub <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. DEVELOPER API & CODE SHOWCASE (ElevenLabs Developer Section) ─── */}
      <section id="developer" className="py-20 border-t border-[#ebe8e4] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left description */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-wider text-[#9E988F] font-bold">
                Developer API
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.03em] text-black">
                Integrate autonomous browsing into any stack in minutes
              </h2>
              <p className="text-sm text-[#777169] leading-relaxed">
                Connect your scripts to Meow's REST API or Stagehand TypeScript SDK. Run stealth tasks, handle multi-page sessions, and receive structured JSON responses with complete DOM execution traces.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-black">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Headless stealth mode with desktop Chrome user-agent headers</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-black">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Zero API costs for web reading, price tracking, and research</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-black">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Interactive human approval gate for social publishing</span>
                </div>
              </div>
            </div>

            {/* Right code box (ElevenLabs dark minimal terminal) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#ebe8e4] bg-[#18181B] shadow-xl overflow-hidden">
                {/* Code tab header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#141416]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCodeLanguage("ts")}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                        codeLanguage === "ts" ? "bg-white/15 text-white font-semibold" : "text-white/60 hover:text-white"
                      }`}
                    >
                      typescript
                    </button>
                    <button
                      onClick={() => setCodeLanguage("python")}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                        codeLanguage === "python" ? "bg-white/15 text-white font-semibold" : "text-white/60 hover:text-white"
                      }`}
                    >
                      python
                    </button>
                    <button
                      onClick={() => setCodeLanguage("curl")}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                        codeLanguage === "curl" ? "bg-white/15 text-white font-semibold" : "text-white/60 hover:text-white"
                      }`}
                    >
                      curl
                    </button>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 text-xs text-white/80 hover:bg-white/10 transition-colors"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {/* Code body */}
                <pre className="p-6 text-xs sm:text-sm font-mono text-white/90 leading-relaxed overflow-x-auto">
                  <code>{codeSnippets[codeLanguage]}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. SAFETY, BUILT IN (ElevenLabs 3-Card Grid) ─── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.03em] text-black mb-3">
            Safety, built in
          </h2>
          <p className="text-sm text-[#777169]">
            Autonomous agents must never act recklessly. We enforce strict guardrails at every layer of the runtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#ebe8e4] bg-white p-7 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
            <div className="h-10 w-10 rounded-xl bg-[#F5F4F0] flex items-center justify-center text-black mb-5">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-normal text-black mb-2">Human-in-the-Loop</h3>
            <p className="text-sm text-[#777169] leading-relaxed">
              Write actions like publishing to Twitter/X or submitting payment forms are hard-blocked until you inspect and approve the draft.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebe8e4] bg-white p-7 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
            <div className="h-10 w-10 rounded-xl bg-[#F5F4F0] flex items-center justify-center text-black mb-5">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-normal text-black mb-2">Zero Credential Exposure</h3>
            <p className="text-sm text-[#777169] leading-relaxed">
              Read and scrape public web data without logging in. When authenticated sessions are needed, session cookies are sandboxed.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebe8e4] bg-white p-7 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
            <div className="h-10 w-10 rounded-xl bg-[#F5F4F0] flex items-center justify-center text-black mb-5">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-normal text-black mb-2">Immutable Audit Traces</h3>
            <p className="text-sm text-[#777169] leading-relaxed">
              Every Playwright navigation, Stagehand extraction, and DOM element selector is recorded with exact millisecond timestamps.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 10. PRICING SECTION (ElevenLabs Clean Table/Cards) ─── */}
      <section id="pricing" className="py-20 border-t border-[#ebe8e4] bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-light tracking-[-0.03em] text-black mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-base text-[#777169] mb-8">
            Start free with our native stealth engine. Upgrade when you need cloud browser streaming.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12">
            {/* Free Plan */}
            <div className="rounded-2xl border border-[#ebe8e4] bg-white p-8 shadow-[0_1px_1px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-normal text-black mb-2">Community Engine</h3>
                <div className="text-4xl font-light text-black mb-4">
                  $0 <span className="text-sm text-[#777169] font-normal">/ forever</span>
                </div>
                <p className="text-sm text-[#777169] mb-6">
                  Perfect for local scraping, live price tracking, and personal research workflows.
                </p>
                <ul className="space-y-3 text-sm text-black mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Native Stealth Engine (0 API Keys Needed)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Unlimited Live Flipkart & Amazon Scraping
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Human Approval Safety Gate
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Full Playwright & Stagehand Support
                  </li>
                </ul>
              </div>
              <Link
                href="/automation"
                className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-black text-white text-sm font-medium hover:bg-[#374151] active:scale-[0.98] transition-all text-center"
              >
                Start Free in Studio
              </Link>
            </div>

            {/* Cloud Pro Plan */}
            <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-md flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Cloud Browser
              </span>
              <div>
                <h3 className="text-xl font-normal text-black mb-2">Cloud Pro</h3>
                <div className="text-4xl font-light text-black mb-4">
                  $29 <span className="text-sm text-[#777169] font-normal">/ month</span>
                </div>
                <p className="text-sm text-[#777169] mb-6">
                  For teams needing remote cloud Chromium streaming and persistent authenticated sessions.
                </p>
                <ul className="space-y-3 text-sm text-black mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Everything in Community
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Browserbase Cloud Streaming & Live View
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Persistent Session State & Cookies
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Automated Recurring Inngest Crons
                  </li>
                </ul>
              </div>
              <Link
                href="/automation"
                className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-black text-white text-sm font-medium hover:bg-[#374151] active:scale-[0.98] transition-all text-center"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 11. FOOTER (ElevenLabs 5-Column Grid Style) ─── */}
      <footer className="border-t border-[#ebe8e4] bg-[#FDFCFC] py-16 text-xs text-[#777169]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-12">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-black font-semibold mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><Link href="/automation" className="hover:text-black transition-colors">Browser Studio</Link></li>
                <li><Link href="/overview" className="hover:text-black transition-colors">Workflow Pipelines</Link></li>
                <li><Link href="/automation" className="hover:text-black transition-colors">Flipkart Scraper</Link></li>
                <li><Link href="/automation" className="hover:text-black transition-colors">Amazon Price Tracker</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-black font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2.5">
                <li><Link href="/overview" className="hover:text-black transition-colors">E-Commerce Monitoring</Link></li>
                <li><Link href="/overview" className="hover:text-black transition-colors">Social Auto-Publishing</Link></li>
                <li><Link href="/overview" className="hover:text-black transition-colors">Job Discovery</Link></li>
                <li><Link href="/overview" className="hover:text-black transition-colors">Automated QA Testing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-black font-semibold mb-4">Developers</h4>
              <ul className="space-y-2.5">
                <li><Link href="/automation" className="hover:text-black transition-colors">Stagehand SDK</Link></li>
                <li><Link href="/automation" className="hover:text-black transition-colors">Playwright Adapter</Link></li>
                <li><Link href="/automation" className="hover:text-black transition-colors">REST API</Link></li>
                <li><Link href="/automation" className="hover:text-black transition-colors">Architecture</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-black font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><Link href="/" className="hover:text-black transition-colors">About Meow</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Security & Ethics</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Changelog</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-black font-semibold mb-4">Runtime</h4>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ebe8e4] bg-white text-black font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Chromium Stealth Live</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Dual-mode runtime connecting to Browserbase Cloud or local stealth Playwright runner.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#ebe8e4] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center text-white font-bold text-[10px]">
                M
              </div>
              <span className="text-black font-semibold text-sm">Meow</span>
              <span className="text-[#9E988F]">© {new Date().getFullYear()} Meow Browser Engine. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-5 text-[#777169]">
              <Link href="https://github.com/manish-3d/meow" target="_blank" className="hover:text-black transition-colors">
                GitHub
              </Link>
              <Link href="https://x.com" target="_blank" className="hover:text-black transition-colors">
                X / Twitter
              </Link>
              <Link href="/automation" className="hover:text-black transition-colors">
                Console
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
