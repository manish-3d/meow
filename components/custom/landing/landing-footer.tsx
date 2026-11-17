"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { 
  Bot, 
  Github, 
  Twitter, 
  Disc as Discord, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";

export function LandingFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Subscribed to Meow Bot engineering updates!");
    setEmail("");
  };

  return (
    <footer className="relative bg-[#070709] text-white pt-20 pb-12 font-sans border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-16 border-b border-white/10">
          <div>
            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white font-sans">
              Subscribe to Meow Bot updates
            </h3>
            <p className="mt-2 text-sm text-neutral-400 leading-relaxed max-w-md">
              Get product updates, autonomous agent recipes, and practical engineering guides for background workflows.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 rounded-none border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="bg-white px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors shrink-0"
            >
              {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
            </button>
          </form>
        </div>

        {/* Directory Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-16 text-xs font-mono">
          {/* Column 1: PLATFORM */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white/50 tracking-wider">PLATFORM</span>
            <Link href="/workspace" className="text-neutral-400 hover:text-white transition-colors">
              AGENT WORKSPACE
            </Link>
            <Link href="#cloud-vm" className="text-neutral-400 hover:text-white transition-colors">
              CLOUD VM DESKTOP
            </Link>
            <Link href="#simulator" className="text-neutral-400 hover:text-white transition-colors">
              INNGEST SCHEDULER
            </Link>
            <Link href="#tools" className="text-neutral-400 hover:text-white transition-colors">
              1,700+ TOOL VAULT
            </Link>
            <Link href="/workspace" className="text-neutral-400 hover:text-white transition-colors">
              AGENT MARKETPLACE
            </Link>
            <Link href="#build" className="text-neutral-400 hover:text-white transition-colors">
              MCP GATEWAY
            </Link>
          </div>

          {/* Column 2: AGENTS */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white/50 tracking-wider">PRE-CONFIGURED AGENTS</span>
            <Link href="/workspace" className="text-neutral-400 hover:text-white transition-colors">
              SOCIAL MEDIA BOT
            </Link>
            <Link href="/workspace" className="text-neutral-400 hover:text-white transition-colors">
              SPORTS ANALYSIS
            </Link>
            <Link href="/workspace" className="text-neutral-400 hover:text-white transition-colors">
              EXECUTIVE ASSISTANT
            </Link>
            <Link href="/workspace" className="text-neutral-400 hover:text-white transition-colors">
              RESEARCH SCRAPER
            </Link>
            <Link href="/workspace" className="text-neutral-400 hover:text-white transition-colors">
              FINANCIAL ANALYST
            </Link>
          </div>

          {/* Column 3: DEVELOPERS */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white/50 tracking-wider">DEVELOPERS</span>
            <Link href="#build" className="text-neutral-400 hover:text-white transition-colors">
              TYPESCRIPT SDK
            </Link>
            <Link href="#build" className="text-neutral-400 hover:text-white transition-colors">
              REST API & WEBHOOKS
            </Link>
            <Link href="#faq" className="text-neutral-400 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/workspace" className="text-neutral-400 hover:text-white transition-colors">
              TELEMETRY & LOGS
            </Link>
          </div>

          {/* Column 4: BRAND & STATUS */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white/50 tracking-wider">MEOW BOT INC.</span>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-400">All systems operational</span>
            </div>
            <span className="text-neutral-500 text-[11px] font-sans mt-2">
              Autonomous AI agent cloud powered by Google Gemini, Claude, Composio OAuth, and Inngest durable serverless orchestration.
            </span>
          </div>
        </div>

        {/* Bottom Social & Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Image
                src="/logo.png"
                alt="Meow Bot"
                width={20}
                height={20}
                className="object-contain"
              />
              <span className="font-bold tracking-wider">MEOW BOT</span>
            </Link>
            <span>© {new Date().getFullYear()} Meow Bot Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter className="size-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Discord"
            >
              <Discord className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}