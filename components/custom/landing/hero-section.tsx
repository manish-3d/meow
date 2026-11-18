"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { CharacterFaceFollow } from "./character-face-follow";
import { ChatGptLogo, ClaudeLogo, GeminiLogo, GrokLogo } from "./brand-logos";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center pt-24 pb-14 sm:pt-28 sm:pb-16 text-[#131316] overflow-hidden">
      {/* Minecraft River & Landscape Background Image */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <Image
          src="/hero-minecraft-bg.jpg"
          alt="Meow Bot Minecraft World"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft bottom edge transition to next section */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
        {/* H1 Headline: "meet [CharacterFaceFollow] meow bot" */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center font-sans tracking-tight text-neutral-900 font-normal text-5xl sm:text-7xl lg:text-[96px] leading-[0.98] flex items-center justify-center flex-wrap gap-x-2.5 sm:gap-x-4 select-none"
        >
          <span className="tracking-tighter font-normal">meet</span>
          <CharacterFaceFollow className="w-16 h-[95px] sm:w-20 sm:h-[120px] lg:w-24 lg:h-[144px] shrink-0" />
          <span className="tracking-tighter font-medium">meow bot</span>
        </motion.h1>

        {/* Sub-headline: Specialist agents with their own browser... */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 sm:mt-8 max-w-xl text-center text-neutral-600 text-base sm:text-lg leading-relaxed font-sans"
        >
          <p>Specialist agents with their own browser, memory and tools.</p>
          <p className="mt-0.5">Delegate the work. Get the result.</p>
        </motion.div>

        {/* Unified 4-Provider Pill Container (ChatGPT, Claude, Gemini, Grok) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-xs border border-neutral-200/90 shadow-2xs"
        >
          <div className="inline-flex items-center gap-2">
            <ChatGptLogo size={18} />
            <span className="text-xs sm:text-sm font-sans font-medium text-neutral-800">ChatGPT</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <ClaudeLogo size={18} />
            <span className="text-xs sm:text-sm font-sans font-medium text-neutral-800">Claude</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <GeminiLogo size={18} />
            <span className="text-xs sm:text-sm font-sans font-medium text-neutral-800">Gemini</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <GrokLogo size={18} />
            <span className="text-xs sm:text-sm font-sans font-medium text-neutral-800">Grok</span>
          </div>
        </motion.div>

        {/* Action CTAs: LAUNCH MEOW BOT -> and EXPLORE THE BOTS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link href="/workspace">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#131316] px-7 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <span>launch meow bot</span>
              <ArrowRight className="size-3.5" />
            </button>
          </Link>

          <a
            href="#bots"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/95 backdrop-blur-xs px-7 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition-all active:scale-95 shadow-2xs"
          >
            <span>explore the bots</span>
          </a>
        </motion.div>

        {/* Supporting Microcopy */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-5 text-xs font-mono text-neutral-500 tracking-tight"
        >
          One workspace · Independent agents · Background execution
        </motion.p>
      </div>
    </section>
  );
}
