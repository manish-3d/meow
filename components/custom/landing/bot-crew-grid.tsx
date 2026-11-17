"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RoleCard {
  id: string;
  name: string;
  description: string;
  color: string;
  badgeChar: string;
}

const ROLES: RoleCard[] = [
  {
    id: "researcher",
    name: "the researcher",
    description: "reads the 40 tabs so you don't. comes back with sources, a comparison table and a straight answer.",
    color: "#2563EB",
    badgeChar: "🔍",
  },
  {
    id: "inbox",
    name: "the inbox helper",
    description: "reads what came in overnight, drafts replies in your voice, and leaves the three that actually need you on top.",
    color: "#EC4899",
    badgeChar: "✉️",
  },
  {
    id: "coder",
    name: "the code reviewer",
    description: "picks up an issue, boots the browser, runs tests, and opens a pull request with clean diffs.",
    color: "#F97316",
    badgeChar: "💻",
  },
  {
    id: "bookkeeper",
    name: "the bookkeeper",
    description: "matches receipts to charges, and tells you when a SaaS subscription quietly got pricier.",
    color: "#10B981",
    badgeChar: "📊",
  },
  {
    id: "travel",
    name: "the travel planner",
    description: "monitors flight fares, holds seats, and checks you into flights on its own dedicated browser.",
    color: "#8B5CF6",
    badgeChar: "✈️",
  },
  {
    id: "social",
    name: "the social scribe",
    description: "converts daily commits and raw voice notes into drafted posts for X & LinkedIn without ever posting without consent.",
    color: "#EAB308",
    badgeChar: "📝",
  },
];

export function BotCrewGrid() {
  return (
    <section id="bots" className="py-24 sm:py-32 bg-[#F7F7F5] text-[#131316] border-y border-black/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl font-sans font-medium tracking-tight text-[#131316] leading-none">
            give each bot a job.
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 font-sans">
            one bot, one job, one chat. start with one and hire as you go.
          </p>
        </div>

        {/* 6-Role Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ROLES.map((role) => (
            <div
              key={role.id}
              className="group rounded-3xl bg-white p-6 sm:p-7 border border-black/8 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon Badge */}
                <div
                  className="flex size-11 items-center justify-center rounded-2xl text-lg shadow-inner border border-black/5 mb-5"
                  style={{ backgroundColor: role.color + "14" }}
                >
                  <span>{role.badgeChar}</span>
                </div>

                {/* Role Title */}
                <h3 className="text-lg font-bold font-sans text-neutral-900 tracking-tight">
                  {role.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-neutral-600 font-sans leading-relaxed">
                  {role.description}
                </p>
              </div>

              {/* Bottom Micro Action */}
              <div className="mt-6 pt-4 border-t border-black/6 flex items-center justify-between font-mono text-xs text-neutral-500">
                <span>Autonomous helper</span>
                <span className="text-neutral-900 font-semibold group-hover:translate-x-1 transition-transform">
                  hire →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}