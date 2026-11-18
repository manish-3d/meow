"use client";

import React, { useState, useEffect } from "react";

export type BotPersonality =
  | "curious"
  | "happy"
  | "sleepy"
  | "researcher"
  | "builder"
  | "swimmer";

interface PixelCatBotProps {
  personality: BotPersonality;
  isEmerged: boolean;
  x: number; // percentage from left
  y: number; // percentage from top
  staggerMs?: number;
  scale?: number;
}

export function PixelCatBot({
  personality,
  isEmerged,
  x,
  y,
  staggerMs = 0,
  scale = 1,
}: PixelCatBotProps) {
  const [active, setActive] = useState(false);
  const [splashing, setSplashing] = useState(false);
  const [blinking, setBlinking] = useState(false);

  // Staggered emergence logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let splashTimeout: NodeJS.Timeout;

    if (isEmerged) {
      timeout = setTimeout(() => {
        setActive(true);
        setSplashing(true);
        splashTimeout = setTimeout(() => setSplashing(false), 650);
      }, staggerMs);
    } else {
      timeout = setTimeout(() => {
        setActive(false);
        setSplashing(false);
      }, staggerMs * 0.4);
    }

    return () => {
      clearTimeout(timeout);
      clearTimeout(splashTimeout);
    };
  }, [isEmerged, staggerMs]);

  // Periodic blinking
  useEffect(() => {
    if (!active) return;
    let timeout: NodeJS.Timeout;

    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 150);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(timeout);
  }, [active]);

  return (
    <div
      className="absolute pointer-events-none select-none transition-transform duration-300"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 15,
      }}
    >
      {/* Container with pop-up / sink transition */}
      <div
        className="relative flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          transform: active ? "translateY(0) scale(1)" : "translateY(28px) scale(0.4)",
          opacity: active ? 1 : 0,
        }}
      >
        {/* Continuous River Bobbing Wrapper */}
        <div className={`flex flex-col items-center ${active ? "animate-[riverBob_3s_ease-in-out_infinite]" : ""}`}>
          {/* Sleepy Cat Zzz Floating Particles */}
          {personality === "sleepy" && active && (
            <div className="absolute -top-3.5 right-1 pointer-events-none">
              <span className="text-[10px] font-mono font-bold text-indigo-400/90 animate-[floatZzz_2.2s_ease-out_infinite]">
                z
              </span>
            </div>
          )}

          {/* Builder Cat Floating Code Tag */}
          {personality === "builder" && active && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-[#bef264] border border-lime-500 text-[8px] font-mono font-black text-neutral-900 shadow-xs animate-bounce">
              &lt;/&gt;
            </div>
          )}

          {/* SVG Pixel Cat Character */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm">
            <svg
              viewBox="0 0 48 48"
              className="w-full h-full overflow-visible"
              shapeRendering="crispEdges"
            >
              {/* --- EARS --- */}
              {/* Left Ear Base (White) */}
              <rect x="8" y="4" width="10" height="10" fill="#FFFFFF" />
              <rect x="10" y="2" width="6" height="4" fill="#FFFFFF" />
              {/* Left Ear Inner (Pastel Pink) */}
              <rect x="11" y="6" width="5" height="6" fill="#FFAAA6" />

              {/* Right Ear Base (White) */}
              <rect x="30" y="4" width="10" height="10" fill="#FFFFFF" />
              <rect x="32" y="2" width="6" height="4" fill="#FFFFFF" />
              {/* Right Ear Inner (Pastel Pink) */}
              <rect x="32" y="6" width="5" height="6" fill="#FFAAA6" />

              {/* --- HEAD --- */}
              {/* Main White Cubic Head */}
              <rect x="6" y="10" width="36" height="26" rx="2" fill="#FFFFFF" />
              {/* Subtle Cheek Blush (Light pastel pink) */}
              <rect x="8" y="26" width="5" height="3" fill="#FFE4E6" />
              <rect x="35" y="26" width="5" height="3" fill="#FFE4E6" />

              {/* --- ACCESSORIES --- */}
              {/* Builder Cat: Lime Green Headphones */}
              {personality === "builder" && (
                <>
                  {/* Headband */}
                  <rect x="10" y="8" width="28" height="3" fill="#18181B" />
                  {/* Left Ear Pad (Vibrant Lime) */}
                  <rect x="4" y="13" width="5" height="12" rx="1" fill="#bef264" stroke="#84cc16" strokeWidth="1" />
                  {/* Right Ear Pad (Vibrant Lime) */}
                  <rect x="39" y="13" width="5" height="12" rx="1" fill="#bef264" stroke="#84cc16" strokeWidth="1" />
                </>
              )}

              {/* Researcher Cat: Cute Round Glasses */}
              {personality === "researcher" && (
                <>
                  {/* Left Lens Frame */}
                  <rect x="11" y="17" width="10" height="10" fill="none" stroke="#18181B" strokeWidth="2" />
                  {/* Right Lens Frame */}
                  <rect x="27" y="17" width="10" height="10" fill="none" stroke="#18181B" strokeWidth="2" />
                  {/* Bridge */}
                  <rect x="21" y="21" width="6" height="2" fill="#18181B" />
                </>
              )}

              {/* --- EYES --- */}
              {blinking || personality === "sleepy" ? (
                <>
                  {/* Closed Eye Arcs (Happy / Sleeping) */}
                  <rect x="14" y="22" width="6" height="2" fill="#18181B" />
                  <rect x="28" y="22" width="6" height="2" fill="#18181B" />
                </>
              ) : (
                <>
                  {/* Left Eye Pixel */}
                  <rect x="14" y="18" width="6" height="7" fill="#18181B" />
                  {/* Left Eye White Specular Dot */}
                  <rect x="15" y="19" width="2" height="2" fill="#FFFFFF" />

                  {/* Right Eye Pixel */}
                  <rect x="28" y="18" width="6" height="7" fill="#18181B" />
                  {/* Right Eye White Specular Dot */}
                  <rect x="29" y="19" width="2" height="2" fill="#FFFFFF" />
                </>
              )}

              {/* --- NOSE & MOUTH --- */}
              {/* Pink Nose */}
              <rect x="23" y="25" width="2" height="2" fill="#FF8E9E" />
              {/* Cat Mouth Line */}
              <rect x="21" y="27" width="2" height="1" fill="#27272A" />
              <rect x="25" y="27" width="2" height="1" fill="#27272A" />

              {/* --- BODY / TORSO (Floating at waterline) --- */}
              <rect x="12" y="34" width="24" height="8" fill="#F4F4F5" />
              {/* Pastel Pink Ribbon / Collar */}
              <rect x="14" y="34" width="20" height="2" fill="#FFAAA6" />

              {/* --- FRONT PAWS --- */}
              {personality === "happy" ? (
                <>
                  {/* Left Paw resting */}
                  <rect x="12" y="38" width="6" height="5" fill="#FFFFFF" />
                  {/* Right Paw Waving Up and Down */}
                  <g className="animate-[pawWave_1.2s_ease-in-out_infinite] origin-bottom-right">
                    <rect x="33" y="26" width="7" height="6" fill="#FFFFFF" />
                    <rect x="35" y="28" width="3" height="3" fill="#FFAAA6" />
                  </g>
                </>
              ) : (
                <>
                  {/* Left Resting Paw on Waterline */}
                  <rect x="12" y="38" width="6" height="5" fill="#FFFFFF" />
                  {/* Right Resting Paw on Waterline */}
                  <rect x="30" y="38" width="6" height="5" fill="#FFFFFF" />
                </>
              )}

              {/* Swimmer Cat: Pink Lilypad / Lotus Ring */}
              {personality === "swimmer" && (
                <g transform="translate(0, 36)">
                  {/* Lotus Petals Base */}
                  <rect x="4" y="2" width="40" height="5" rx="2" fill="#F472B6" />
                  <rect x="8" y="0" width="32" height="3" fill="#FB7185" />
                  <rect x="12" y="5" width="24" height="2" fill="#DB2777" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* --- WATER SPLASH PARTICLES ON EMERGENCE --- */}
        {splashing && (
          <div className="absolute -bottom-1 inset-x-0 flex items-center justify-center pointer-events-none">
            {/* Splash Droplets */}
            <span className="absolute -top-3 -left-3 size-1.5 rounded-xs bg-[#e0f2fe] animate-[splashDropLeft_0.6s_ease-out_forwards]" />
            <span className="absolute -top-5 left-0 size-2 rounded-xs bg-white animate-[splashDropCenter_0.65s_ease-out_forwards]" />
            <span className="absolute -top-3.5 right-2 size-1.5 rounded-xs bg-[#bae6fd] animate-[splashDropRight_0.6s_ease-out_forwards]" />
            <span className="absolute -top-2 right-4 size-1 rounded-xs bg-white animate-[splashDropFarRight_0.55s_ease-out_forwards]" />
          </div>
        )}

        {/* --- EXPANDING WATER RIPPLES --- */}
        {active && (
          <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center pointer-events-none">
            {/* Ripple Ring 1 */}
            <div className="size-16 sm:size-20 rounded-full border border-white/70 animate-[rippleExpand_2.4s_ease-out_infinite]" />
            {/* Ripple Ring 2 */}
            <div className="absolute size-12 sm:size-16 rounded-full border border-sky-300/50 animate-[rippleExpand_2.4s_ease-out_infinite_1.2s]" />
          </div>
        )}
      </div>
    </div>
  );
}
