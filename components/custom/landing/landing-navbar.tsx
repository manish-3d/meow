"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, Bot, Sparkles } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-black/8 py-3 shadow-xs" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex size-9 items-center justify-center rounded-xl overflow-hidden ring-1 ring-black/10 shadow-xs group-hover:scale-105 transition-transform bg-white">
            <Image
              src="/logo.png"
              alt="Meow Bot"
              width={36}
              height={36}
              className="object-cover size-full"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-base tracking-tight text-[#aed44e]">
              meow bot
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-semibold text-[#aed44e]">
          <Link href="/workspace" className="hover:opacity-80 transition-opacity">
            workspace
          </Link>
          <Link href="#bots" className="hover:opacity-80 transition-opacity">
            bots
          </Link>
          <Link href="#pricing" className="hover:opacity-80 transition-opacity">
            pricing
          </Link>
          <Link href="#faq" className="hover:opacity-80 transition-opacity">
            faq
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/sign-in" className="text-xs font-mono font-semibold text-[#aed44e] hover:opacity-80 px-2 py-1">
            sign in
          </Link>
          <Link href="/workspace">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#aed44e] px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#131316] hover:bg-[#9ec43e] transition-all active:scale-95 shadow-sm"
            >
              <span>launch workspace</span>
              <ArrowRight className="size-3.5 text-[#131316]" />
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex size-8 items-center justify-center rounded-lg border border-[#aed44e]/40 text-[#aed44e] md:hidden hover:bg-neutral-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mt-2 mx-4 rounded-2xl bg-white border border-black/10 p-4 shadow-xl flex flex-col gap-3 md:hidden font-mono text-xs font-semibold text-[#aed44e]">
          <Link href="/workspace" onClick={() => setMobileOpen(false)} className="py-1">
            workspace
          </Link>
          <Link href="#bots" onClick={() => setMobileOpen(false)} className="py-1">
            bots
          </Link>
          <Link href="#pricing" onClick={() => setMobileOpen(false)} className="py-1">
            pricing
          </Link>
          <Link href="#faq" onClick={() => setMobileOpen(false)} className="py-1">
            faq
          </Link>
          <div className="pt-2 border-t border-black/8 flex flex-col gap-2">
            <Link
              href="/workspace"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-full bg-[#aed44e] py-2.5 text-[#131316] font-bold"
            >
              launch workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}