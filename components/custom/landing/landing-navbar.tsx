"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";

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
          ? "bg-white/90 backdrop-blur-md border-b border-black/8 py-3 shadow-xs"
          : "bg-transparent py-4"
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
            <span className="font-display font-extrabold text-[17px] tracking-tight text-[#111111] lowercase">
              meow bot
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links: Goated Plus Jakarta Sans / Black color */}
        <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-display font-semibold tracking-tight text-[#111111]">
          <Link
            href="/workspace"
            className="hover:text-black/70 transition-colors lowercase"
          >
            workspace
          </Link>
          <Link
            href="#bots"
            className="hover:text-black/70 transition-colors lowercase"
          >
            bots
          </Link>
          <Link
            href="#pricing"
            className="hover:text-black/70 transition-colors lowercase"
          >
            pricing
          </Link>
          <Link
            href="#faq"
            className="hover:text-black/70 transition-colors lowercase"
          >
            faq
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-[13.5px] font-display font-semibold tracking-tight text-[#111111] hover:text-black/70 px-2 py-1 transition-colors lowercase"
          >
            sign in
          </Link>
          <Link href="/workspace">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#aed44e] px-5 py-2 text-xs font-display font-bold uppercase tracking-wider text-[#131316] hover:bg-[#9ec43e] transition-all active:scale-95 shadow-xs"
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
          className="flex size-8 items-center justify-center rounded-lg border border-black/15 text-[#111111] md:hidden hover:bg-neutral-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mt-2 mx-4 rounded-2xl bg-white border border-black/10 p-5 shadow-xl flex flex-col gap-3.5 md:hidden font-display text-sm font-semibold text-[#111111]">
          <Link
            href="/workspace"
            onClick={() => setMobileOpen(false)}
            className="py-1 hover:text-black/70 transition-colors"
          >
            workspace
          </Link>
          <Link
            href="#bots"
            onClick={() => setMobileOpen(false)}
            className="py-1 hover:text-black/70 transition-colors"
          >
            bots
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="py-1 hover:text-black/70 transition-colors"
          >
            pricing
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="py-1 hover:text-black/70 transition-colors"
          >
            faq
          </Link>
          <div className="pt-3 border-t border-black/8 flex flex-col gap-2.5">
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-black/70 transition-colors"
            >
              sign in
            </Link>
            <Link
              href="/workspace"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-full bg-[#aed44e] py-2.5 text-[#131316] font-bold text-xs uppercase tracking-wider"
            >
              launch workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
