"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Hand, Globe, Lock, RefreshCw, ArrowLeft, ArrowRight, ShieldCheck, Check } from "lucide-react";

export function ComputerShowcase() {
  const [hasMouseControl, setHasMouseControl] = useState(false);
  const [activeTab, setActiveTab] = useState("kayak");

  return (
    <section className="py-24 sm:py-32 bg-white text-[#131316]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
            each bot gets its own computer.
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans">
            not just an api call. a full browser and workspace so it can click, research, and test like a human.
          </p>
        </div>

        {/* Live Computer Window Frame */}
        <div
          className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl ${
            hasMouseControl ? "border-blue-500 ring-4 ring-blue-500/10" : "border-black/10"
          } bg-[#F9F9FB]`}
        >
          {/* Top Control Bar of the VM Desktop */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-black/8 select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-[#FF5F56]" />
                <span className="size-3 rounded-full bg-[#FFBD2E]" />
                <span className="size-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="font-mono text-xs font-semibold text-neutral-800 flex items-center gap-2">
                <span>milo's computer</span>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-600 font-normal uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  live stream
                </span>
              </span>
            </div>

            {/* Interactive 'Take the mouse' button */}
            <button
              type="button"
              onClick={() => setHasMouseControl(!hasMouseControl)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
                hasMouseControl
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              <Hand className="size-3.5" />
              <span>{hasMouseControl ? "release mouse control" : "take the mouse"}</span>
            </button>
          </div>

          {/* Browser Navigation Bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#F4F4F6] border-b border-black/6 text-xs text-neutral-600">
            <div className="flex items-center gap-1 text-neutral-400">
              <ArrowLeft className="size-3.5" />
              <ArrowRight className="size-3.5" />
              <RefreshCw className="size-3" />
            </div>

            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1 border border-black/8 font-mono text-[11px] text-neutral-700">
              <Lock className="size-3 text-emerald-600" />
              <span>https://www.kayak.com/flights/SFO-NYC/2026-11-20</span>
            </div>
          </div>

          {/* Simulated Browser Web Canvas */}
          <div className="relative min-h-[380px] sm:min-h-[440px] bg-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            {/* Background Simulated Web Page */}
            <div className="flex flex-col gap-5 max-w-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-black/8">
                <div>
                  <h4 className="text-xl font-bold font-sans text-neutral-900">
                    San Francisco (SFO) → New York (JFK)
                  </h4>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">
                    Friday, Nov 20 • Nonstop • 1 passenger (Aisle seat requested)
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Best fare found
                </span>
              </div>

              {/* Flight Result 1 */}
              <div className="p-4 rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/[0.03] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900">United Airlines 412</span>
                    <span className="text-[10px] font-mono text-neutral-500">Boeing 777-300</span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1 font-mono">
                    08:30 AM SFO ── (5h 25m) ── 04:55 PM JFK • Seat 14C (Aisle)
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-neutral-900">$348</span>
                  <span className="block text-[10px] text-emerald-600 font-mono">Held for 24h</span>
                </div>
              </div>

              {/* Bot Activity Card */}
              <div className="self-start rounded-xl border border-black/8 bg-neutral-50 p-3 flex items-center gap-2.5 font-sans text-xs text-neutral-700">
                <div className="relative size-5 shrink-0 rounded-full overflow-hidden ring-1 ring-black/10 bg-black">
                  <Image
                    src="/logo.png"
                    alt="Milo"
                    width={20}
                    height={20}
                    className="size-full object-cover"
                  />
                </div>
                <span>
                  <strong>Milo:</strong> I found the United 8:30 AM nonstop with your preferred aisle seat. Holding fare now.
                </span>
              </div>
            </div>

            {/* Takeover Control Notification Banner */}
            {hasMouseControl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 text-white px-5 py-2 text-xs font-mono font-medium shadow-2xl flex items-center gap-2"
              >
                <Hand className="size-3.5" />
                <span>You're in control of Milo's browser. Click anywhere to interact.</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}