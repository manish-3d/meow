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
  MonitorPlay,
} from "lucide-react";

interface AutomationResult {
  url: string;
  statusCode?: number;
  latencyMs?: number;
  title?: string;
  content?: string;
  extractedData?: string;
  links?: string[];
  actionId?: string;
  status?: string;
  resultSummary?: string;
  sessionId?: string;
  debuggerUrl?: string;
  engine?: string;
}

export default function WebAutomationPage() {
  const [url, setUrl] = useState("https://news.ycombinator.com");
  const [action, setAction] = useState<"navigate" | "extract" | "action">("navigate");
  const [engine, setEngine] = useState<"native" | "browserbase">("browserbase");
  const [topic, setTopic] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<AutomationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    {
      title: "Hacker News AI Feed",
      url: "https://news.ycombinator.com",
      action: "navigate" as const,
      topic: "",
      desc: "Live tech headlines & discussion posts without API paywalls.",
    },
    {
      title: "GitHub Trending Repos",
      url: "https://github.com/trending",
      action: "extract" as const,
      topic: "ai",
      desc: "Scrape trending open-source repositories and stars.",
    },
    {
      title: "Wikipedia AI Overview",
      url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
      action: "extract" as const,
      topic: "reasoning",
      desc: "Deep topic extraction for factual knowledge grounding.",
    },
  ];

  const runAutomation = async (
    overrideUrl?: string,
    overrideAction?: "navigate" | "extract" | "action",
    overrideTopic?: string
  ) => {
    const targetUrl = overrideUrl || url;
    const targetAction = overrideAction || action;
    const targetTopic = overrideTopic !== undefined ? overrideTopic : topic;

    if (!targetUrl.trim()) return;

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/automation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl.trim(),
          action: targetAction,
          topic: targetTopic.trim() || undefined,
          engine,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Web automation failed");
      }
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Execution failed";
      setError(msg);
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0c0d10] via-[#0f1117] to-indigo-950/20 p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Cpu className="h-3.5 w-3.5" />
              <span>Browserbase & Headless Web Automation Suite</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Cloud Web Automation & Scraping Studio
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Control autonomous browser agents powered by Browserbase cloud Chromium and local stealth extractors. Run live sessions, bypass anti-bot gates, and extract web data with zero expensive social media API fees.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-center">
              <span className="text-2xl font-bold font-mono text-emerald-400">$0.00</span>
              <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">API Fees</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-center">
              <span className="text-2xl font-bold font-mono text-indigo-400">Browserbase</span>
              <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Cloud Fleet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Runner Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-400" />
                <span>Target Automation Request</span>
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Anti-Bot Active
              </span>
            </div>

            {/* Target URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70">Target Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Engine Selector (Browserbase vs Native) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70">Execution Engine</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEngine("browserbase")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    engine === "browserbase"
                      ? "border-indigo-500 bg-indigo-500/20 text-white shadow-sm"
                      : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white"
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Browserbase Cloud</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("native")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    engine === "native"
                      ? "border-indigo-500 bg-indigo-500/20 text-white shadow-sm"
                      : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Stealth Native</span>
                </button>
              </div>
            </div>

            {/* Action Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70">Automation Action</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "navigate", label: "Inspect Page" },
                  { id: "extract", label: "Deep Scrape" },
                  { id: "action", label: "Simulate Action" },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setAction(act.id as any)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      action === act.id
                        ? "border-indigo-500 bg-indigo-500/20 text-white font-semibold"
                        : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Topic Filter (Only for extract) */}
            {action === "extract" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70">Filter Topic (Optional)</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. pricing, artificial intelligence, founders..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Run Button */}
            <button
              type="button"
              onClick={() => runAutomation()}
              disabled={isRunning || !url.trim()}
              className="w-full py-3 px-4 rounded-xl bg-white text-black text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-md hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>
                    {engine === "browserbase" ? "Spawning Browserbase Cloud..." : "Executing Stealth Crawler..."}
                  </span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>Execute Web Automation</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-white/40 tracking-wider">Quick Presets</h3>
            <div className="space-y-2">
              {presets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setUrl(preset.url);
                    setAction(preset.action);
                    setTopic(preset.topic);
                    runAutomation(preset.url, preset.action, preset.topic);
                  }}
                  className="rounded-xl border border-white/[0.08] bg-[#0c0d10] p-3.5 hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {preset.title}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/30 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </div>
                  <p className="text-[11px] text-white/50">{preset.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Output Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 space-y-4 shadow-xl min-h-[500px] flex flex-col justify-between">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono text-white/80">Execution Console</span>
              </div>

              {result && (
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  {result.statusCode && (
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      HTTP {result.statusCode}
                    </span>
                  )}
                  {result.latencyMs !== undefined && (
                    <span className="text-white/60 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {result.latencyMs}ms
                    </span>
                  )}
                  <button
                    onClick={() => copyToClipboard(result.content || result.extractedData || result.resultSummary || "")}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Copy Content"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto max-h-[420px] font-mono text-xs rounded-xl bg-black/60 p-4 border border-white/[0.06] text-white/80">
              {isRunning && (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-white/50 py-16">
                  <div className="h-6 w-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">
                    {engine === "browserbase"
                      ? "Connecting to Browserbase Cloud Session..."
                      : "Connecting to stealth headless engine..."}
                  </p>
                  <p className="text-[10px] text-white/30 font-mono">
                    {engine === "browserbase"
                      ? "Cloud Chromium · Residential Proxies · Captcha Solver"
                      : "Zero API Fees · Fast DOM Parser"}
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span>Automation Error</span>
                  </div>
                  <p className="text-[11px] font-mono text-red-400/90">{error}</p>
                </div>
              )}

              {!isRunning && !error && !result && (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/30 py-16 space-y-2">
                  <Globe className="h-8 w-8 text-white/20" />
                  <p className="text-xs font-sans font-medium text-white/50">Ready to execute web automation</p>
                  <p className="text-[11px] max-w-sm leading-relaxed">
                    Select an engine (Browserbase Cloud or Stealth Native) and run live web extraction or simulated workflows.
                  </p>
                </div>
              )}

              {!isRunning && result && (
                <div className="space-y-4">
                  {/* Session & Engine Banner */}
                  {result.engine && (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <MonitorPlay className="h-4 w-4 text-indigo-400" />
                        <span className="font-semibold text-white">{result.engine}</span>
                        {result.sessionId && (
                          <span className="text-[10px] font-mono text-white/40">({result.sessionId})</span>
                        )}
                      </div>
                      {result.debuggerUrl && (
                        <a
                          href={result.debuggerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all shadow-sm"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View Live Cloud Session</span>
                        </a>
                      )}
                    </div>
                  )}

                  {result.title && (
                    <div className="border-b border-white/[0.08] pb-2">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block font-sans">Page Title</span>
                      <h4 className="text-sm font-semibold text-white font-sans">{result.title}</h4>
                      <p className="text-[10px] text-indigo-400 truncate">{result.url}</p>
                    </div>
                  )}

                  {result.resultSummary && (
                    <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                      {result.resultSummary}
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block font-sans">Extracted Content</span>
                    <pre className="whitespace-pre-wrap text-white/70 text-[11px] leading-relaxed">
                      {result.content || result.extractedData || "No content extracted."}
                    </pre>
                  </div>

                  {result.links && result.links.length > 0 && (
                    <div className="pt-3 border-t border-white/[0.08] space-y-2">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block font-sans">Discovered Links ({result.links.length})</span>
                      <div className="grid grid-cols-1 gap-1">
                        {result.links.map((link, i) => (
                          <div key={i} className="text-[11px] text-indigo-400 truncate hover:underline">
                            {link}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Status */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] text-white/40 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Browser Engine Online
              </span>
              <span>Browserbase & Gemini Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
