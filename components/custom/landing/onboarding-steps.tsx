"use client";

import React from "react";
import Link from "next/link";
import { Download, Key, Bot, Sparkles, ArrowRight } from "lucide-react";

export function OnboardingSteps() {
  const steps = [
    {
      num: "1",
      title: "download it and open it",
      desc: "Normal desktop installer for Mac, Windows, or Linux. No credit card, no account required.",
      icon: <Download className="size-4" />,
    },
    {
      num: "2",
      title: "add your ai key",
      desc: "Connect your OpenAI, Claude, or Gemini key, or run offline with local Ollama models.",
      icon: <Key className="size-4" />,
    },
    {
      num: "3",
      title: "make a bot",
      desc: "Give it a name, pick an avatar, and tell it what job it owns. Or pick from 20+ templates.",
      icon: <Bot className="size-4" />,
    },
    {
      num: "4",
      title: "hand it something real",
      desc: "The task you've been putting off. It does the busywork and asks before anything scary.",
      icon: <Sparkles className="size-4" />,
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#F7F7F5] text-[#131316] border-y border-black/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
            ready in under two minutes.
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans">
            start with one helper today and build your crew as you go.
          </p>
        </div>

        {/* 4 Steps Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-3xl bg-white p-6 border border-black/8 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs font-bold size-7 rounded-full bg-black text-white flex items-center justify-center">
                    {s.num}
                  </span>
                  <div className="text-neutral-400">{s.icon}</div>
                </div>

                <h3 className="font-sans font-bold text-base text-neutral-900 tracking-tight">
                  {s.title}
                </h3>

                <p className="mt-2 text-xs text-neutral-600 font-sans leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 text-[10px] font-mono text-neutral-400">
                Step 0{s.num} of 04
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}