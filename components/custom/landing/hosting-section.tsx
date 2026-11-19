"use client";

import React from "react";
import { Globe, Cloud, ShieldCheck, Zap } from "lucide-react";

export function HostingSection() {
  return (
    <section className="py-24 sm:py-32 bg-[#F7F7F5] text-[#131316] border-y border-black/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
            how your bots run.
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans">
            100% web-first. access from any browser, while background workers run 24/7 in our cloud.
          </p>
        </div>

        {/* 3 Hosting Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Browser Web Workspace */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-black/8 shadow-2xs flex flex-col justify-between overflow-hidden relative">
            <div>
              {/* Pixel Art Mini Banner */}
              <div className="h-16 w-full rounded-2xl bg-gradient-to-r from-sky-300 to-sky-200 flex items-center justify-center mb-6 overflow-hidden">
                <svg width="48" height="18" viewBox="0 0 32 12" style={{ shapeRendering: "crispEdges" }}>
                  <rect x="8" y="0" width="16" height="4" fill="#FFFFFF" />
                  <rect x="4" y="4" width="24" height="4" fill="#FFFFFF" />
                  <rect x="0" y="8" width="32" height="4" fill="#FFFFFF" />
                </svg>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold font-sans text-neutral-900">
                  instant web workspace
                </h3>
                <span className="font-mono text-[10px] text-[#65a30d] bg-[#f7fee7] border border-[#d9f99d] px-2 py-0.5 rounded-full font-bold">
                  zero install
                </span>
              </div>

              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                Open Meow Bot in Chrome, Safari, or mobile. Create agents, chat with your crew, and configure routines in seconds.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/6 font-mono text-xs text-neutral-500">
              Works on any device • Instant access
            </div>
          </div>

          {/* Card 2: 24/7 Cloud Background Workers */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-black/8 shadow-2xs flex flex-col justify-between overflow-hidden relative">
            <div>
              {/* Pixel Art Green Meadow Banner */}
              <div className="h-16 w-full rounded-2xl bg-gradient-to-r from-lime-300 to-emerald-200 flex items-center justify-center mb-6 overflow-hidden">
                <svg width="64" height="24" viewBox="0 0 32 12" style={{ shapeRendering: "crispEdges" }}>
                  <rect x="0" y="6" width="32" height="6" fill="#84cc16" />
                  <rect x="6" y="2" width="6" height="4" fill="#65a30d" />
                  <rect x="18" y="4" width="8" height="2" fill="#4d7c0f" />
                </svg>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold font-sans text-neutral-900">
                  always-on cloud engine
                </h3>
                <span className="font-mono text-[10px] text-[#65a30d] bg-[#f7fee7] border border-[#d9f99d] px-2 py-0.5 rounded-full font-bold">
                  runs 24/7 ⚡
                </span>
              </div>

              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                Your routines execute on our durable cloud servers. Morning briefs deliver and emails are triaged even when your laptop is shut off.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/6 font-mono text-xs text-neutral-500">
              Inngest durable cron • Zero dropped runs
            </div>
          </div>

          {/* Card 3: Cloud VM Remote Browser */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-black/8 shadow-2xs flex flex-col justify-between overflow-hidden relative">
            <div>
              {/* Pixel Art Purple Mountain Banner */}
              <div className="h-16 w-full rounded-2xl bg-gradient-to-r from-purple-300 to-indigo-200 flex items-center justify-center mb-6 overflow-hidden">
                <svg width="48" height="20" viewBox="0 0 32 12" style={{ shapeRendering: "crispEdges" }}>
                  <polygon points="16,0 32,12 0,12" fill="#8B5CF6" />
                </svg>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold font-sans text-neutral-900">
                  remote browser desktop
                </h3>
                <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                  browserbase VM 🖥️
                </span>
              </div>

              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                When agents navigate websites, they run inside secure cloud Chromium sandboxes. Watch the live stream or take the mouse anytime.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/6 font-mono text-xs text-neutral-500">
              Live streaming • Human takeover
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}