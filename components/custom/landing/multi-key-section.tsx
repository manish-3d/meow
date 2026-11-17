"use client";

import React, { useState } from "react";
import { Key, ShieldCheck, Zap, Sparkles, Check, ArrowRight } from "lucide-react";
import { BrandIcon } from "./brand-logos";

interface ModelKeyOption {
  id: string;
  provider: string;
  model: string;
  latency: string;
  bestFor: string;
  keyStatus: string;
  active: boolean;
}

const MODELS: ModelKeyOption[] = [
  {
    id: "gemini",
    provider: "Google AI",
    model: "Gemini 2.5 Flash",
    latency: "120ms",
    bestFor: "Fast background routines, email sorting, and multi-modal web scraping.",
    keyStatus: "Connected (Key active)",
    active: true,
  },
  {
    id: "claude",
    provider: "Anthropic",
    model: "Claude 3.7 Sonnet",
    latency: "280ms",
    bestFor: "Deep reasoning, complex code refactoring, and multi-turn group discussions.",
    keyStatus: "Connected (Key active)",
    active: true,
  },
  {
    id: "openai",
    provider: "OpenAI",
    model: "GPT-4o",
    latency: "240ms",
    bestFor: "Creative writing, social media copywriting, and structured JSON output.",
    keyStatus: "Connected (Key active)",
    active: true,
  },
  {
    id: "ollama",
    provider: "Local Offline",
    model: "Ollama / DeepSeek V3",
    latency: "0ms (Local)",
    bestFor: "100% private, on-device offline execution with zero data leaving your machine.",
    keyStatus: "Connected (Localhost:11434)",
    active: true,
  },
];

export function MultiKeySection() {
  const [activeModel, setActiveModel] = useState("gemini");

  return (
    <section className="py-24 sm:py-32 bg-[#F7F7F5] text-[#131316] border-y border-black/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
            bring your own keys. no markups, ever.
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans">
            connect your OpenAI, Anthropic, Google Gemini, Grok, or local Ollama keys.
            switch models per bot or rotate multiple keys effortlessly.
          </p>
        </div>

        {/* 4 Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {MODELS.map((item) => {
            const isSelected = activeModel === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveModel(item.id)}
                className={`cursor-pointer rounded-3xl p-6 sm:p-7 bg-white border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "border-black shadow-md ring-2 ring-black/5"
                    : "border-black/8 hover:border-black/20 shadow-2xs"
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      {item.provider}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                      <Check className="size-3 text-emerald-600" />
                      {item.keyStatus}
                    </span>
                  </div>

                  {/* Model Name with Brand Logo */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 border border-black/5 shadow-2xs shrink-0">
                      <BrandIcon name={item.provider + " " + item.model} size={22} />
                    </div>
                    <h3 className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
                      {item.model}
                    </h3>
                  </div>

                  {/* Best For Description */}
                  <p className="mt-3 text-sm text-neutral-600 font-sans leading-relaxed">
                    {item.bestFor}
                  </p>
                </div>

                {/* Bottom Stats */}
                <div className="mt-6 pt-4 border-t border-black/6 flex items-center justify-between font-mono text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Zap className="size-3.5 text-amber-500" />
                    <span>Average latency: {item.latency}</span>
                  </span>
                  <span className="text-neutral-900 font-semibold">
                    Zero token fee
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-10 rounded-2xl border border-black/8 bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
              <Key className="size-4" />
            </div>
            <div>
              <span className="font-sans font-bold text-sm text-neutral-900 block">
                Direct Provider Billing
              </span>
              <span className="font-sans text-xs text-neutral-500">
                You pay Anthropic, OpenAI, or Google at raw wholesale API rates. Meow Bot adds zero fee.
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-full">
            Key Vault AES-256
          </span>
        </div>
      </div>
    </section>
  );
}