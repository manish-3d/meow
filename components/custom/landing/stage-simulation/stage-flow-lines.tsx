"use client";

import React from "react";
import { motion } from "motion/react";

interface FlowLinesProps {
  active: boolean; // Frame 5+
}

export function StageFlowLines({ active }: FlowLinesProps) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {/* Flow Line Gradient: Violet to Cyan to Light Lime Green */}
          <linearGradient id="flowPulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0.8" />
          </linearGradient>

          <filter id="flowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Path 1: Center Cross Connect (Left Top to Right Bottom) ── */}
        <motion.path
          d="M 280 200 C 420 200, 520 400, 720 400"
          stroke="url(#flowPulseGradient)"
          strokeWidth="2"
          strokeDasharray="6 6"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* ── Path 2: Center Cross Connect (Right Top to Left Bottom) ── */}
        <motion.path
          d="M 720 200 C 520 200, 420 400, 280 400"
          stroke="url(#flowPulseGradient)"
          strokeWidth="2"
          strokeDasharray="6 6"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
        />

        {/* ── Path 3: Horizontal Sync Bridge (Top Left to Top Right) ── */}
        <motion.path
          d="M 380 180 Q 500 130 620 180"
          stroke="#7C5CFC"
          strokeWidth="1.8"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
        />

        {/* ── Path 4: Bottom Sync Bridge (Bottom Left to Bottom Right) ── */}
        <motion.path
          d="M 380 430 Q 500 480 620 430"
          stroke="#84cc16"
          strokeWidth="1.8"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.25 }}
        />
      </svg>
    </div>
  );
}
