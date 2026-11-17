"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  ExternalLink, 
  Sparkles,
  Globe
} from "lucide-react";
import { InteractivePixelCat } from "./interactive-pixel-cat";
import { HeroAppSimulator } from "./hero-app-simulator";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 bg-white text-[#131316] overflow-hidden">
      {/* Background Subtle Gradient & Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(124,92,252,0.08),transparent_80%)]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Top Platform Support Capsule - 100% Web Cloud Truth */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/8 bg-neutral-100/80 px-4 py-1.5 text-xs font-sans text-neutral-600 shadow-2xs hover:border-black/15 transition-colors"
        >
          <Globe className="size-3 text-emerald-600" />
          <span>ai agent cloud</span>
          <span>•</span>
          <span className="font-semibold text-neutral-900">runs 100% in your browser</span>
          <span>•</span>
          <span className="text-emerald-700 font-medium">zero install needed</span>
        </motion.div>

        {/* H1 Headline with Interactive Cursor-Tracking Pixel Cat Mascot in the Center! */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center font-sans tracking-tight text-neutral-900 font-normal text-5xl sm:text-7xl lg:text-[96px] leading-[0.98] flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-4 select-none"
        >
          <span className="tracking-tighter">meet</span>
          <InteractivePixelCat size={76} />
          <span className="tracking-tighter font-medium">meow bot</span>
        </motion.h1>

        {/* Sub-headline with clickable model chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 sm:mt-8 max-w-2xl text-pretty text-neutral-600 text-base sm:text-lg leading-relaxed font-sans"
        >
          <p>
            your own crew of ai helpers, on the{" "}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-sm font-mono border border-black/5 font-semibold">
              chatgpt
            </span>
            ,{" "}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-sm font-mono border border-black/5 font-semibold">
              claude
            </span>
            ,{" "}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-sm font-mono border border-black/5 font-semibold">
              gemini
            </span>{" "}
            or{" "}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-sm font-mono border border-black/5 font-semibold">
              grok
            </span>{" "}
            you already use.
          </p>
          <p className="mt-1 text-neutral-500">
            each has its own cloud browser, memory, and background cron, so real work gets done.
          </p>
        </motion.div>

        {/* Web Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 relative"
        >
          {/* Primary Action Button */}
          <Link href="/workspace">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#131316] px-6 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-black transition-all active:scale-95 shadow-md"
            >
              <span>launch meow bot</span>
              <ArrowRight className="size-3.5" />
            </button>
          </Link>

          {/* GitHub Star Button */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-5 py-3.5 text-xs font-mono text-neutral-700 hover:bg-neutral-50 transition-all shadow-2xs"
          >
            <Star className="size-3.5 text-amber-500 fill-amber-500" />
            <span>star on github</span>
          </a>
        </motion.div>

        {/* Reassurance text */}
        <p className="mt-3 text-xs font-mono text-neutral-500">
          free for personal use. runs directly on the web. add your own models or api keys.
        </p>

        {/* Embedded Desktop App Simulator */}
        <HeroAppSimulator />
      </div>
    </section>
  );
}