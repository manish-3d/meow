"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { SleepingPixelCat } from "./sleeping-pixel-cat";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plusPrice = billingCycle === "monthly" ? "$20" : "$16";
  const proPrice = billingCycle === "monthly" ? "$50" : "$40";

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white text-[#131316]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Billing Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
              start free. add cloud power as you scale.
            </h2>
          </div>

          {/* Monthly / Yearly Switcher */}
          <div className="inline-flex items-center gap-1 rounded-full bg-neutral-100 p-1 border border-black/8 text-xs font-sans shrink-0">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <span>yearly</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-mono font-bold">
                2 months free
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Card 1: FREE (with Sleeping Pixel Cat on top!) */}
          <div className="relative rounded-3xl bg-[#F9F9FB] p-6 sm:p-8 border border-black/8 shadow-xs flex flex-col justify-between pt-12 mt-6 md:mt-0">
            {/* The Sleeping Pixel Cat sitting on the top-left edge of the card */}
            <div className="absolute -top-10 left-6 z-20">
              <SleepingPixelCat />
            </div>

            {/* Pixel Blue Sky Mini Art Banner */}
            <div className="h-24 w-full rounded-2xl bg-gradient-to-b from-[#29B6F6] to-[#0288D1] mb-6 flex items-center justify-center overflow-hidden">
              <svg width="80" height="24" viewBox="0 0 40 12" style={{ shapeRendering: "crispEdges" }}>
                <rect x="10" y="0" width="20" height="4" fill="#FFFFFF" />
                <rect x="5" y="4" width="30" height="4" fill="#FFFFFF" />
                <rect x="0" y="8" width="40" height="4" fill="#FFFFFF" />
              </svg>
            </div>

            <div>
              <h3 className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
                free
              </h3>
              <p className="mt-1 text-sm text-neutral-500 font-sans">
                your agents, in the cloud web workspace.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-sans font-bold text-neutral-900">
                  $0
                </span>
                <span className="text-xs text-neutral-500 font-sans">
                  forever. no card required.
                </span>
              </div>

              {/* Features List */}
              <div className="mt-6 pt-6 border-t border-black/6 flex flex-col gap-2.5 text-xs text-neutral-600 font-sans">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Unlimited web agents in workspace</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Bring your own Gemini, Claude, or OpenAI keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Cloud VM browser automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Daily scheduled Inngest routines</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/workspace">
                <button
                  type="button"
                  className="w-full rounded-full bg-black py-3 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  open web workspace
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: PLUS */}
          <div className="rounded-3xl bg-[#F9F9FB] p-6 sm:p-8 border border-black/8 shadow-xs flex flex-col justify-between pt-12 mt-6 md:mt-0">
            {/* Pixel Green Meadow Mini Art Banner */}
            <div className="h-24 w-full rounded-2xl bg-gradient-to-b from-[#66BB6A] to-[#43A047] mb-6 flex items-center justify-center overflow-hidden">
              <svg width="80" height="24" viewBox="0 0 40 12" style={{ shapeRendering: "crispEdges" }}>
                <rect x="0" y="6" width="40" height="6" fill="#81C784" />
                <rect x="8" y="2" width="8" height="4" fill="#388E3C" />
                <rect x="24" y="4" width="10" height="2" fill="#2E7D32" />
              </svg>
            </div>

            <div>
              <h3 className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
                plus
              </h3>
              <p className="mt-1 text-sm text-neutral-500 font-sans">
                for active daily workflows & background routines.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-xs text-neutral-500 font-sans">
                  3 days free, then
                </span>
                <span className="text-4xl sm:text-5xl font-sans font-bold text-neutral-900">
                  {plusPrice}
                </span>
                <span className="text-xs text-neutral-500 font-sans">
                  a month
                </span>
              </div>

              {/* Features List */}
              <div className="mt-6 pt-6 border-t border-black/6 flex flex-col gap-2.5 text-xs text-neutral-600 font-sans">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>24/7 Always-awake cloud VM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Morning briefs deliver before you wake up</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Automated Gmail & Calendar background actions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Cloud persistent memory sync</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/workspace">
                <button
                  type="button"
                  className="w-full rounded-full bg-black py-3 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  start free trial
                </button>
              </Link>
            </div>
          </div>

          {/* Card 3: PRO */}
          <div className="rounded-3xl bg-[#F9F9FB] p-6 sm:p-8 border border-black/8 shadow-xs flex flex-col justify-between pt-12 mt-6 md:mt-0">
            {/* Pixel Snowy Mountain Mini Art Banner */}
            <div className="h-24 w-full rounded-2xl bg-gradient-to-b from-[#B39DDB] to-[#7E57C2] mb-6 flex items-center justify-center overflow-hidden">
              <svg width="80" height="24" viewBox="0 0 40 12" style={{ shapeRendering: "crispEdges" }}>
                <polygon points="20,0 36,12 4,12" fill="#EDE7F6" />
                <polygon points="32,2 40,12 24,12" fill="#D1C4E9" />
              </svg>
            </div>

            <div>
              <h3 className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
                pro
              </h3>
              <p className="mt-1 text-sm text-neutral-500 font-sans">
                for heavy workloads & team collaboration.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-xs text-neutral-500 font-sans">
                  3 days free, then
                </span>
                <span className="text-4xl sm:text-5xl font-sans font-bold text-neutral-900">
                  {proPrice}
                </span>
                <span className="text-xs text-neutral-500 font-sans">
                  a month
                </span>
              </div>

              {/* Features List */}
              <div className="mt-6 pt-6 border-t border-black/6 flex flex-col gap-2.5 text-xs text-neutral-600 font-sans">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Dedicated 4 vCPU, 8GB RAM sandbox</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Multi-bot group chat & autonomous handoffs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Unlimited concurrent browser instances</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-[#84cc16] shrink-0" />
                  <span>Anti-bot evasion & proxy rotation</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/workspace">
                <button
                  type="button"
                  className="w-full rounded-full bg-black py-3 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  start free trial
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}