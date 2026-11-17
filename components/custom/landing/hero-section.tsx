"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Bot, Sparkles, CheckCircle2, Cpu, Clock, ShieldCheck } from "lucide-react";

const ROTATING_TARGETS = [
  "a Cloud VM Desktop",
  "durable cron routines",
  "1,700+ connected tools",
  "Gemini & Claude brains",
  "zero-leak auth vaults",
];

const POWERED_BY_LOGOS = [
  { name: "Google Gemini 2.5", label: "GEMINI 2.5 FLASH" },
  { name: "Anthropic Claude", label: "CLAUDE 3.7 SONNET" },
  { name: "Inngest Workflows", label: "INNGEST DURABLE ENGINE" },
  { name: "Browserbase", label: "BROWSERBASE CLOUD VM" },
  { name: "Composio Hub", label: "1,700+ COMPOSIO TOOLS" },
  { name: "E2B Sandbox", label: "E2B CODE SANDBOX" },
  { name: "Supabase DB", label: "SUPABASE STORAGE" },
  { name: "Vercel Edge", label: "VERCEL RUNTIME" },
];

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_TARGETS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-between overflow-hidden bg-[#070709] text-white pt-32 pb-12 sm:pt-40 sm:pb-16">
      {/* Ambient Grid Background */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      {/* Subtle Radial Glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-emerald-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 size-[400px] rounded-full bg-blue-500/8 blur-[120px]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center my-auto">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-md"
        >
          <span className="size-2 rounded-full bg-[#00D26A] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-neutral-300">
            Meow Bot 2.0 • Autonomous Multi-Agent Cloud Platform
          </span>
          <ArrowRight className="size-3 text-neutral-400" />
        </motion.div>

        {/* Composio-Style Exact Kinetic Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-balance text-center text-white leading-[1.08] text-4xl sm:text-6xl md:text-7xl font-sans font-medium tracking-tight"
        >
          <span className="block">Deploy autonomous AI agents</span>
          <span className="flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-[0.14em] mt-2 sm:mt-3">
            <span className="text-white/60 font-normal">with</span>
            <span className="relative inline-flex items-center justify-center min-w-[240px] sm:min-w-[400px] overflow-hidden py-1 px-3 sm:px-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_TARGETS[index]}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="font-mono text-white text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight whitespace-nowrap"
                >
                  {ROTATING_TARGETS[index]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="inline-block bg-[#00D26A] text-black font-mono font-bold text-2xl sm:text-4xl md:text-5xl px-3 py-1 rounded-lg leading-none shadow-sm">
              in seconds
            </span>
          </span>
        </motion.h1>

        {/* Authentic Meow Bot Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 sm:mt-8 max-w-2xl text-pretty text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed font-sans"
        >
          Meow Bot is your agent cloud: create specialized agents equipped with remote Chromium browser desktops,
          durable Inngest background cron routines, and 1,700+ OAuth tools. Turn complex tasks into automated habits.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Link href="/workspace" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-lg"
            >
              <span>LAUNCH YOUR FIRST AGENT</span>
              <ArrowRight className="size-4" />
            </button>
          </Link>

          <Link href="#simulator" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent px-6 py-3.5 font-mono text-sm text-neutral-300 uppercase tracking-wider transition-all hover:bg-white/10 hover:text-white"
            >
              <span>SEE INNGEST SIMULATOR</span>
            </button>
          </Link>
        </motion.div>

        {/* Quick Highlights Checkpoints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8 font-mono text-xs text-neutral-400"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-[#00D26A]" />
            Durable Inngest Serverless Cron
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-[#00D26A]" />
            Live Cloud VM with Takeover
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-[#00D26A]" />
            1,700+ Native OAuth Integrations
          </span>
        </motion.div>
      </div>

      {/* Powered By Logo Loop Marquee */}
      <div className="relative z-10 w-full mt-12 sm:mt-16 pt-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 mb-5">
            POWERED BY STATE-OF-THE-ART AGENT INFRASTRUCTURE
          </span>
          
          <div className="w-full overflow-hidden mask-fade-x">
            <div className="flex items-center gap-10 sm:gap-16 animate-marquee whitespace-nowrap py-1">
              {[...POWERED_BY_LOGOS, ...POWERED_BY_LOGOS].map((logo, idx) => (
                <div
                  key={`${logo.name}-${idx}`}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer group"
                >
                  <span className="font-mono text-xs font-semibold tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                    {logo.label}
                  </span>
                  <span className="text-[10px] text-neutral-600 font-mono">↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}