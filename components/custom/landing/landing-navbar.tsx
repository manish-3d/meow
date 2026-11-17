"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Wrench, 
  Sparkles, 
  ExternalLink,
  ArrowRight,
  Code2,
  Workflow,
  Key,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <>
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
            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("products")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                  activeDropdown === "products"
                    ? "text-white bg-white/10"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>PRODUCTS</span>
                <ChevronDown
                  className={`size-3 transition-transform duration-200 ${
                    activeDropdown === "products" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "products" && (
                <div className="absolute top-full left-0 mt-2 w-[480px] rounded-2xl border border-white/10 bg-[#0f0f11] p-4 shadow-2xl backdrop-blur-2xl">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/workspace"
                      className="group flex flex-col gap-1 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold">
                        <Bot className="size-4 text-emerald-400" />
                        <span>MEOW CLOUD</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded border border-emerald-500/30">
                          LIVE
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        Autonomous multi-model agents with persistent memory & tool calling.
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
                        Dedicated Chromium browser sandbox with visual inspection.
                      </p>
                    </Link>

                    <Link
                      href="#integrations"
                      className="group flex flex-col gap-1 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold">
                        <Wrench className="size-4 text-purple-400" />
                        <span>1,700+ TOOLS</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        Zero-friction Composio integrations for Gmail, Slack, CRM & GitHub.
                      </p>
                    </Link>

                    <Link
                      href="#build"
                      className="group flex flex-col gap-1 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold">
                        <Code2 className="size-4 text-amber-400" />
                        <span>MCP GATEWAY</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        One unified MCP endpoint for Claude, Cursor, Codex & custom apps.
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                  activeDropdown === "solutions"
                    ? "text-white bg-white/10"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>SOLUTIONS</span>
                <ChevronDown
                  className={`size-3 transition-transform duration-200 ${
                    activeDropdown === "solutions" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "solutions" && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0f0f11] p-3 shadow-2xl backdrop-blur-2xl">
                  <div className="flex flex-col gap-1">
                    <Link
                      href="#teams"
                      className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="font-mono text-xs text-white">FOR TEAMS & ORGS</span>
                      <span className="text-[11px] text-neutral-400">
                        Shared OAuth credentials, budget caps & role governance.
                      </span>
                    </Link>
                    <Link
                      href="#use-cases"
                      className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="font-mono text-xs text-white">FOR CODING AGENTS</span>
                      <span className="text-[11px] text-neutral-400">
                        Plug-and-play tools for Claude Code, Codex, and Cursor.
                      </span>
                    </Link>
                    <Link
                      href="#scheduler"
                      className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="font-mono text-xs text-white">RECURRING AUTOMATION</span>
                      <span className="text-[11px] text-neutral-400">
                        Inngest-backed scheduled cron jobs and webhook listeners.
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="#harder-jobs"
              className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors"
            >
              CAPABILITIES
            </Link>

            <Link
              href="#faq"
              className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors"
            >
              FAQ
            </Link>

            <a
              href="https://github.com/composiohq/composio"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              <span>DOCS</span>
              <ExternalLink className="size-2.5 opacity-50" />
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden sm:inline-block">
              <span className="font-mono text-xs uppercase text-neutral-400 hover:text-white transition-colors px-2 py-1.5">
                LOG IN
              </span>
            </Link>

            <Link href="/workspace">
              <button
                type="button"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-neutral-200 active:scale-95 shadow-sm"
              >
                <span>GET STARTED FOR FREE</span>
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
              <span>WORKSPACE</span>
              <ArrowRight className="size-3.5 text-neutral-400" />
            </Link>
            <Link
              href="#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
            >
              <span>USE CASES</span>
              <ArrowRight className="size-3.5 text-neutral-400" />
            </Link>
            <Link
              href="#integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
            >
              <span>1,700+ INTEGRATIONS</span>
              <ArrowRight className="size-3.5 text-neutral-400" />
            </Link>
            <Link
              href="#harder-jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
            >
              <span>HARDER JOBS</span>
              <ArrowRight className="size-3.5 text-neutral-400" />
            </Link>
            <Link
              href="#teams"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs text-neutral-200 hover:bg-white/5"
            >
              <span>TEAMS & GOVERNANCE</span>
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
    </>
  );
}