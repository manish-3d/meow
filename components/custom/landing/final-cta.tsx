"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Bot, Sparkles, ShieldCheck } from "lucide-react";

export function FinalCtaBanner() {
  return (
    <section id="start" className="relative bg-[#070709] text-white py-24 sm:py-32 overflow-hidden border-b border-white/10">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white font-sans text-balance leading-tight">
          Give your AI what it needs to finish the job
        </h2>
        <p className="mt-6 max-w-xl text-neutral-400 text-base sm:text-lg leading-relaxed font-sans">
          Add Meow Bot to the AI you already use. Free to start, and set up in minutes.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/workspace" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-neutral-200 active:scale-98 shadow-xl"
            >
              <span>CONNECT YOUR AI</span>
              <ArrowRight className="size-4" />
            </button>
          </Link>

          <Link href="#use-cases" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent px-7 py-3.5 font-mono text-sm text-neutral-300 uppercase tracking-wider transition-all hover:bg-white/10 hover:text-white"
            >
              <span>SEE IT WORK</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}