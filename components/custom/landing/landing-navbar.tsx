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
        scrolled
          ? "bg-[#eaf8d6]/95 backdrop-blur-md border-b border-[#c9f2b8] py-3 shadow-sm"
          : "bg-[#eaf8d6]/90 backdrop-blur-md border-b border-[#c9f2b8]/70 py-3.5 shadow-2xs"
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
            <span className="font-sans font-bold text-base tracking-tight text-neutral-900">
              meow bot
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-medium text-neutral-700">
          <Link href="/workspace" className="hover:text-black transition-colors">
            workspace
          </Link>
          <Link href="#bots" className="hover:text-black transition-colors">
            bots
          </Link>
          <Link href="#pricing" className="hover:text-black transition-colors">
            pricing
          </Link>
          <Link href="#faq" className="hover:text-black transition-colors">
            faq
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/sign-in" className="text-xs font-mono font-medium text-neutral-700 hover:text-black px-2 py-1">
            sign in
          </Link>
          <Link href="/workspace">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#131316] px-5 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <span>launch workspace</span>
              <ArrowRight className="size-3.5" />
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex size-8 items-center justify-center rounded-lg border border-black/10 text-neutral-800 md:hidden hover:bg-black/5"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mt-2 mx-4 rounded-2xl bg-[#eaf8d6] border border-[#c9f2b8] p-4 shadow-xl flex flex-col gap-3 md:hidden font-mono text-xs text-neutral-800">
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
              className="w-full text-center rounded-full bg-black py-2.5 text-white font-semibold"
            >
              launch workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}