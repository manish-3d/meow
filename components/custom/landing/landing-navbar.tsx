"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Sparkles, Terminal, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-surface-0/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center size-8 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden shadow-2xs group-hover:border-foreground/20 transition-colors">
            <Image
              src="/logo.png"
              alt="Meow Bot Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-foreground">
              Meow Bot
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              v2.0 Live
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <a
            href="#platform"
            className="hover:text-foreground transition-colors py-1"
          >
            Platform
          </a>
          <a
            href="#integrations"
            className="hover:text-foreground transition-colors py-1"
          >
            1,700+ Integrations
          </a>
          <a
            href="#cloud-vm"
            className="hover:text-foreground transition-colors py-1"
          >
            Cloud VM
          </a>
          <a
            href="#scheduler"
            className="hover:text-foreground transition-colors py-1"
          >
            Durable Scheduler
          </a>
          <a
            href="#simulator"
            className="hover:text-foreground transition-colors py-1"
          >
            Live Simulator
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          <Link href="/sign-in" className="hidden sm:inline-block">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/workspace">
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 px-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-xs transition-all active:scale-[0.98]"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
