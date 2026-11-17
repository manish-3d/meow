"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Github, Terminal, Shield, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-surface-0">
      {/* Pre-Footer Conversion Box */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-2xl border border-border-subtle bg-surface-1 p-8 sm:p-12 text-center space-y-6 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
              Ready to give your AI real execution power?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Create an autonomous agent in seconds. Connect your favorite tools, configure background cron routines, and let your agents work while you sleep.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/workspace">
              <Button
                size="lg"
                className="h-11 px-6 text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Launch Free Workspace</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-6 text-xs sm:text-sm gap-2 border-border-subtle bg-surface-2 hover:bg-surface-3 text-foreground font-medium shadow-2xs transition-all active:scale-[0.98]"
              >
                <span>Create Free Account</span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-500" />
              Free Cloud VM Sandbox
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-500" />
              1,700+ Composio Tools
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-500" />
              Durable Inngest Scheduler
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Links */}
      <div className="border-t border-border-subtle py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md bg-surface-2 border border-border-subtle flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt="Meow Bot" width={24} height={24} className="object-contain" />
              </div>
              <span className="font-semibold text-sm text-foreground">Meow Bot</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Autonomous AI Agent Platform with Cloud VM Desktop and Multi-Tool Automation.
            </p>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-foreground tracking-tight block">Platform</span>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link href="/workspace" className="hover:text-foreground transition-colors">Workspace</Link></li>
              <li><a href="#integrations" className="hover:text-foreground transition-colors">1,700+ Tools</a></li>
              <li><a href="#cloud-vm" className="hover:text-foreground transition-colors">Browserbase VM</a></li>
              <li><a href="#scheduler" className="hover:text-foreground transition-colors">Inngest Schedulers</a></li>
            </ul>
          </div>

          {/* Column 2: Tech Stack */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-foreground tracking-tight block">Architecture</span>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><span className="text-foreground/80">Gemini 2.5 Flash</span></li>
              <li><span className="text-foreground/80">Next.js 16 (Turbopack)</span></li>
              <li><span className="text-foreground/80">React 19 + Motion</span></li>
              <li><span className="text-foreground/80">PostgreSQL (Drizzle ORM)</span></li>
            </ul>
          </div>

          {/* Column 3: Status & GitHub */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-foreground tracking-tight block">Observability</span>
            <div className="p-3 rounded-lg bg-surface-1 border border-border-subtle space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-500 font-mono text-[10px]">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                API Latency: 2.1s • Neon DB Connected
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Meow Bot Platform. Engineered with Swiss precision.</p>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">Register</Link>
            <Link href="/workspace" className="hover:text-foreground transition-colors">Workspace</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
