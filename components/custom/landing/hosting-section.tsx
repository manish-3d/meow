"use client";

import React from "react";
import { Laptop, Cloud, Server, Check } from "lucide-react";

export function HostingSection() {
  return (
    <section className="py-24 sm:py-32 bg-[#F7F7F5] text-[#131316] border-y border-black/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
            where your bots live.
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans">
            run them on your laptop for total privacy, or keep them on a meow cloud server so they never stop working.
          </p>
        </div>

        {/* 3 Hosting Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: On Your Computer */}
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
                  on your computer
                </h3>
                <span className="font-mono text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                  catnapping 💤
                </span>
              </div>

              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                Free forever. Runs directly on your Mac, Windows, or Linux machine. Stops when you shut your laptop lid.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/6 font-mono text-xs text-neutral-500">
              Zero cloud cost • 100% private
            </div>
          </div>

          {/* Card 2: On a Meow Cloud Server */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-black/8 shadow-2xs flex flex-col justify-between overflow-hidden relative">
            <div>
              {/* Pixel Art Green Meadow Banner */}
              <div className="h-16 w-full rounded-2xl bg-gradient-to-r from-emerald-300 to-teal-200 flex items-center justify-center mb-6 overflow-hidden">
                <svg width="64" height="24" viewBox="0 0 32 12" style={{ shapeRendering: "crispEdges" }}>
                  <rect x="0" y="6" width="32" height="6" fill="#10B981" />
                  <rect x="6" y="2" width="6" height="4" fill="#059669" />
                  <rect x="18" y="4" width="8" height="2" fill="#047857" />
                </svg>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold font-sans text-neutral-900">
                  on a meow cloud server
                </h3>
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  awake 24/7 ⚡
                </span>
              </div>

              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                Dedicated 2 vCPU cloud VM. Bots keep working through the night and trigger morning briefs with your laptop closed.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/6 font-mono text-xs text-neutral-500">
              Inngest durable cron • Always online
            </div>
          </div>

          {/* Card 3: On Your Own Server */}
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
                  on your own server
                </h3>
                <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                  self-hosted 🐳
                </span>
              </div>

              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                One-line Docker compose for engineering teams who need total self-hosted isolation and enterprise compliance.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/6 font-mono text-xs text-neutral-500">
              Open source CLI • Self-directed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}