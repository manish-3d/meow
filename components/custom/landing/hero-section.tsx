"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Bot, Sparkles, Terminal, Shield, Zap, Globe, Cpu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroStageshowDemo } from "./hero-stageshow-demo";

const ROTATING_TARGETS = [
  "1,700+ SaaS apps",
  "cloud browser tasks",
  "daily email routines",
  "GitHub PR reviews",
  "scheduled research",
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
    <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-surface-0">
      {/* Background Micro Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Eyebrow, Title & CTAs */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-surface-2 border border-border-subtle shadow-2xs">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground">Autonomous Multi-Tool Agent Platform</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-foreground font-medium">Gemini 2.5 Flash</span>
          </div>

          {/* Main Display Headline with Dynamic Slot */}
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.03em] text-foreground leading-[1.1]">
            Give your AI the power to execute{" "}
            <span className="relative inline-block text-foreground border-b-2 border-primary/40 pb-0.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_TARGETS[index]}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {ROTATING_TARGETS[index]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            in minutes.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop settling for chatbots that stop halfway. Meow Bot deploys autonomous AI agents connected to real SaaS tools, cloud browser desktops, and durable background schedulers that finish what you ask.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/workspace">
              <Button
                size="lg"
                className="h-11 px-6 text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Launch Free Workspace</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <a href="#integrations">
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-6 text-sm gap-2 border-border-subtle bg-surface-1 hover:bg-surface-2 text-foreground font-medium shadow-2xs transition-all active:scale-[0.98]"
              >
                <span>Explore 1,700+ Tools</span>
                <span className="font-mono text-xs text-muted-foreground">↓</span>
              </Button>
            </a>
          </div>

          {/* Stack Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Cpu className="size-3.5 text-foreground" />
              <span>Gemini 2.5 Flash</span>
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-500" />
              <span>Composio 1,700+ Native Tools</span>
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-emerald-500" />
              <span>Inngest Durable Cron</span>
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="size-3.5 text-sky-500" />
              <span>Browserbase Cloud VM</span>
            </span>
          </div>
        </div>

        {/* Hero Interactive Stageshow Window */}
        <HeroStageshowDemo />
      </div>
    </section>
  );
}
