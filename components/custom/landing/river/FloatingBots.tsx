"use client";

import React, { useState, useEffect } from "react";

export interface BotInstance {
  id: string;
  personality: "standard" | "floatie" | "glasses" | "developer" | "sleepy";
  x: number; // percentage from left
  y: number; // percentage from top
  scale: number;
  bobDelaySec: number;
  bobDurationSec: number;
}

const BOTS: BotInstance[] = [
  // Left River Channel
  { id: "cat-top-left", personality: "standard", x: 2.8, y: 35.5, scale: 1.05, bobDelaySec: 0, bobDurationSec: 3.2 },
  { id: "cat-mid-left", personality: "floatie", x: 6.8, y: 46.5, scale: 1.0, bobDelaySec: 0.8, bobDurationSec: 3.0 },
  { id: "cat-bot-left-1", personality: "standard", x: 14.0, y: 66.0, scale: 1.05, bobDelaySec: 1.5, bobDurationSec: 3.4 },
  { id: "cat-glasses", personality: "glasses", x: 24.2, y: 72.0, scale: 1.08, bobDelaySec: 0.4, bobDurationSec: 2.9 },

  // Right River Channel
  { id: "cat-bot-right-1", personality: "standard", x: 75.5, y: 72.5, scale: 1.08, bobDelaySec: 1.2, bobDurationSec: 3.1 },
  { id: "cat-bot-right-2", personality: "standard", x: 84.8, y: 62.5, scale: 1.05, bobDelaySec: 2.1, bobDurationSec: 3.3 },
  { id: "cat-mid-right", personality: "standard", x: 91.5, y: 51.0, scale: 1.0, bobDelaySec: 0.6, bobDurationSec: 2.8 },
  { id: "cat-dev", personality: "developer", x: 95.2, y: 38.0, scale: 1.08, bobDelaySec: 1.8, bobDurationSec: 3.2 },
];

function SingleFloatingBot({ bot }: { bot: BotInstance }) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const scheduleBlink = () => {
      const delay = 2200 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 140);
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${bot.x}%`,
        top: `${bot.y}%`,
        transform: `translate(-50%, -50%) scale(${bot.scale})`,
        zIndex: 25,
      }}
    >
      {/* Expanding Water Ripple Ring Underneath Bot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
        <div className="size-16 rounded-full border border-white/60 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="size-12 rounded-full border border-sky-200/50 -mt-14 ml-2 animate-[ping_4.2s_cubic-bezier(0,0,0.2,1)_infinite_1.5s]" />
      </div>

      {/* Floating Bobbing Character Body */}
      <div
        className="flex flex-col items-center drop-shadow-sm transition-transform duration-300"
        style={{
          animation: `riverBob ${bot.bobDurationSec}s ease-in-out infinite`,
          animationDelay: `${bot.bobDelaySec}s`,
        }}
      >
        {/* Developer Bot Badge </ > */}
        {bot.personality === "developer" && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-sm bg-[#bef264] border border-lime-600 text-[8px] font-mono font-black text-neutral-900 shadow-xs animate-bounce">
            &lt;/&gt;
          </div>
        )}

        {/* Pixel Cat SVG Character */}
        <div className="relative size-12 sm:size-14">
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible" shapeRendering="crispEdges">
            {/* White Body Base */}
            <rect x="8" y="14" width="32" height="26" fill="#FFFFFF" />
            <rect x="6" y="18" width="36" height="20" fill="#FFFFFF" />
            <rect x="4" y="24" width="40" height="12" fill="#FFFFFF" />

            {/* Left Ear */}
            <rect x="8" y="4" width="10" height="10" fill="#FFFFFF" />
            <rect x="10" y="2" width="6" height="4" fill="#FFFFFF" />
            <rect x="11" y="6" width="5" height="6" fill="#FFAAA6" />

            {/* Right Ear */}
            <rect x="30" y="4" width="10" height="10" fill="#FFFFFF" />
            <rect x="32" y="2" width="6" height="4" fill="#FFFFFF" />
            <rect x="32" y="6" width="5" height="6" fill="#FFAAA6" />

            {/* Developer Headphones */}
            {bot.personality === "developer" && (
              <g>
                <rect x="4" y="16" width="4" height="12" fill="#8dcb16" />
                <rect x="40" y="16" width="4" height="12" fill="#8dcb16" />
                <rect x="8" y="6" width="32" height="2" fill="#18181b" />
              </g>
            )}

            {/* Eyes */}
            {!isBlinking ? (
              <g fill="#18181B">
                <rect x="14" y="22" width="5" height="5" />
                <rect x="29" y="22" width="5" height="5" />
                <rect x="15" y="23" width="2" height="2" fill="#FFFFFF" />
                <rect x="30" y="23" width="2" height="2" fill="#FFFFFF" />
              </g>
            ) : (
              <g fill="#18181B">
                <rect x="13" y="24" width="7" height="2" />
                <rect x="28" y="24" width="7" height="2" />
              </g>
            )}

            {/* Glasses Personality */}
            {bot.personality === "glasses" && (
              <g fill="#18181B">
                <rect x="11" y="20" width="11" height="9" fill="none" stroke="#18181B" strokeWidth="2" />
                <rect x="26" y="20" width="11" height="9" fill="none" stroke="#18181B" strokeWidth="2" />
                <rect x="22" y="23" width="4" height="2" fill="#18181B" />
              </g>
            )}

            {/* Nose & Mouth */}
            <rect x="23" y="28" width="2" height="2" fill="#FFAAA6" />
            <rect x="21" y="31" width="2" height="2" fill="#52525B" />
            <rect x="25" y="31" width="2" height="2" fill="#52525B" />
            <rect x="23" y="32" width="2" height="2" fill="#52525B" />

            {/* Floatie Ring Around Neck */}
            {bot.personality === "floatie" && (
              <g>
                <rect x="4" y="34" width="40" height="8" rx="2" fill="#ec4899" />
                <rect x="8" y="36" width="32" height="4" fill="#f472b6" />
                <rect x="14" y="36" width="6" height="4" fill="#ffffff" />
                <rect x="28" y="36" width="6" height="4" fill="#ffffff" />
              </g>
            )}

            {/* Submerged Water Cutoff */}
            <rect x="4" y="38" width="40" height="6" fill="#1eafe2" opacity="0.35" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function FloatingBots() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {BOTS.map((bot) => (
        <SingleFloatingBot key={bot.id} bot={bot} />
      ))}
    </div>
  );
}

