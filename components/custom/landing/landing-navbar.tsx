"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Bot, 
  Cpu, 
  Clock, 
  Wrench, 
  Sparkles, 
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Store,
  Layers
} from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 flex w-full flex-col items-center transition-all duration-300 md:top-4 md:left-1/2 md:w-[calc(100%-2rem)] md:max-w-6xl md:-translate-x-1/2 ${
        scrolled
          ? "border-b md:border border-white/15 bg-[#09090b]/95 backdrop-blur-xl shadow-2xl md:rounded-full"
          : "border-b md:border border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md md:rounded-full"
      } px-4 py-2.5 text-white`}
    >
      <div className="flex w-full items-center justify-between">
        {/* Brand Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center size-8 rounded-full bg-white/10 border border-white/20 overflow-hidden shadow-inner group-hover:border-white/40 transition-colors">
              <Image
                src="/logo.png"
                alt="Meow Bot"
                width={26}
                height={26}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-wider text-white">
                MEOW BOT
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs tracking-wider text-neutral-300">
          {/* Features Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("features")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                activeDropdown === "features"
                  ? "text-white bg-white/10"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              <span>PLATFORM</span>
              <ChevronDown
                className={`size-3 transition-transform duration-200 ${
                  activeDropdown === "features" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "features" && (
              <div className="absolute top-full left-0 mt-2 w-[480px] rounded-2xl border border-white/10 bg-[#0f0f11] p-4 shadow-2xl backdrop-blur-2xl">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/workspace"
                    className="group flex flex-col gap-1 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold">
                      <Bot className="size-4 text-emerald-400" />
                      <span>AUTONOMOUS AGENTS</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      Multi-agent workspaces with custom system instructions & toolsets.
                    </p>
                  </Link>

                  <Link
                    href="#cloud-vm"
                    className="group flex flex-col gap-1 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold">
                      <Cpu className="size-4 text-cyan-400" />
                      <span>CLOUD VM DESKTOP</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      Remote Chromium sandbox with live video stream & human takeover.
                    </p>
                  </Link>

                  <Link
                    href="#scheduler"
                    className="group flex flex-col gap-1 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold">
                      <Clock className="size-4 text-amber-400" />
                      <span>DURABLE SCHEDULER</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      Inngest-powered recurring cron jobs with timezone & continent support.
                    </p>
                  </Link>

                  <Link
                    href="#tools"
                    className="group flex flex-col gap-1 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold">
                      <Wrench className="size-4 text-purple-400" />
                      <span>1,700+ TOOL VAULT</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      One-click OAuth for Gmail, Slack, GitHub, Stripe, and PostgreSQL.
                    </p>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="#simulator"
            className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors"
          >
            ROUTINES
          </Link>

          <Link
            href="#cloud-vm"
            className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors"
          >
            CLOUD VM
          </Link>

          <Link
            href="#tools"
            className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors"
          >
            INTEGRATIONS
          </Link>

          <Link
            href="#faq"
            className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors"
          >
            FAQ
          </Link>

          <Link
            href="/workspace"
            className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <Store className="size-3 text-emerald-400" />
            <span>MARKETPLACE</span>
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden sm:inline-block">
            <span className="font-mono text-xs uppercase text-neutral-400 hover:text-white transition-colors px-2 py-1.5">
              SIGN IN
            </span>
          </Link>

          <Link href="/workspace">
            <button
              type="button"
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-neutral-200 active:scale-95 shadow-sm"
            >
              <span>LAUNCH WORKSPACE</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden hover:bg-white/5"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mt-4 flex w-full flex-col gap-2 border-t border-white/10 pt-4 lg:hidden">
          <Link
            href="/workspace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
          >
            <span>AGENT WORKSPACE</span>
            <ArrowRight className="size-3.5 text-neutral-400" />
          </Link>
          <Link
            href="#cloud-vm"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
          >
            <span>CLOUD VM DESKTOP</span>
            <ArrowRight className="size-3.5 text-neutral-400" />
          </Link>
          <Link
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
          >
            <span>INNGEST SCHEDULER</span>
            <ArrowRight className="size-3.5 text-neutral-400" />
          </Link>
          <Link
            href="#tools"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
          >
            <span>1,700+ TOOLS</span>
            <ArrowRight className="size-3.5 text-neutral-400" />
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
          >
            <span>FAQ</span>
            <ArrowRight className="size-3.5 text-neutral-400" />
          </Link>
          <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-white/10">
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg border border-white/20 font-mono text-xs text-white"
            >
              SIGN IN
            </Link>
            <Link
              href="/workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg bg-white font-mono text-xs font-semibold text-black"
            >
              LAUNCH WORKSPACE
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}