"use client";

import React from "react";

// Pixel chevron arrow pointing right (3 chevrons marching)
export function PixelMarchingArrow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 select-none pointer-events-none ${className}`}>
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" className="drop-shadow-sm">
        {/* Chevron 1 */}
        <g className="animate-[pulse_1.2s_ease-in-out_infinite]">
          <rect x="2" y="8" width="3" height="3" fill="#38bdf8" />
          <rect x="5" y="5" width="3" height="3" fill="#38bdf8" />
          <rect x="8" y="2" width="3" height="3" fill="#38bdf8" />
          <rect x="5" y="11" width="3" height="3" fill="#38bdf8" />
          <rect x="8" y="14" width="3" height="3" fill="#38bdf8" />
        </g>
        {/* Chevron 2 */}
        <g className="animate-[pulse_1.2s_ease-in-out_infinite_0.2s]">
          <rect x="13" y="8" width="3" height="3" fill="#0ea5e9" />
          <rect x="16" y="5" width="3" height="3" fill="#0ea5e9" />
          <rect x="19" y="2" width="3" height="3" fill="#0ea5e9" />
          <rect x="16" y="11" width="3" height="3" fill="#0ea5e9" />
          <rect x="19" y="14" width="3" height="3" fill="#0ea5e9" />
        </g>
        {/* Chevron 3 */}
        <g className="animate-[pulse_1.2s_ease-in-out_infinite_0.4s]">
          <rect x="24" y="8" width="3" height="3" fill="#38bdf8" />
          <rect x="27" y="5" width="3" height="3" fill="#38bdf8" />
          <rect x="30" y="2" width="3" height="3" fill="#38bdf8" />
          <rect x="27" y="11" width="3" height="3" fill="#38bdf8" />
          <rect x="30" y="14" width="3" height="3" fill="#38bdf8" />
        </g>
      </svg>
    </div>
  );
}

// Pixel cat face badge on connector arc
export function PixelCatChip({ orangeEar = false }: { orangeEar?: boolean }) {
  return (
    <div className="size-8 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center p-1 hover:scale-110 transition-transform">
      <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
        {/* Cat head outline */}
        <rect x="2" y="4" width="18" height="12" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" rx="2" />
        {/* Left Ear */}
        <polygon points="3,4 7,4 3,0" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
        <rect x="3.5" y="2.5" width="1.5" height="1.5" fill="#fca5a5" />
        {/* Right Ear */}
        <polygon points="15,4 19,4 19,0" fill={orangeEar ? "#f97316" : "#ffffff"} stroke="#18181b" strokeWidth="1.5" />
        <rect x="17" y="2.5" width="1.5" height="1.5" fill="#fca5a5" />
        {/* Eyes */}
        <rect x="6" y="8" width="2" height="2" fill="#18181b" />
        <rect x="14" y="8" width="2" height="2" fill="#18181b" />
        {/* Nose */}
        <rect x="10.5" y="10.5" width="1.5" height="1" fill="#f472b6" />
        {/* Whiskers */}
        <line x1="1" y1="10" x2="4" y2="10" stroke="#a1a1aa" strokeWidth="1" />
        <line x1="18" y1="10" x2="21" y2="10" stroke="#a1a1aa" strokeWidth="1" />
      </svg>
    </div>
  );
}

// Microchip / CPU Badge on connector arc
export function PixelCpuChip() {
  return (
    <div className="size-8 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center p-1 hover:scale-110 transition-transform">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        {/* Chip Body */}
        <rect x="4" y="4" width="14" height="14" fill="#6366f1" rx="2" stroke="#4338ca" strokeWidth="1.2" />
        <rect x="7" y="7" width="8" height="8" fill="#312e81" rx="1" />
        <rect x="9" y="9" width="4" height="4" fill="#38bdf8" />
        {/* Pins Top & Bottom */}
        <rect x="6" y="1" width="1.5" height="3" fill="#cbd5e1" />
        <rect x="10.25" y="1" width="1.5" height="3" fill="#cbd5e1" />
        <rect x="14.5" y="1" width="1.5" height="3" fill="#cbd5e1" />
        <rect x="6" y="18" width="1.5" height="3" fill="#cbd5e1" />
        <rect x="10.25" y="18" width="1.5" height="3" fill="#cbd5e1" />
        <rect x="14.5" y="18" width="1.5" height="3" fill="#cbd5e1" />
        {/* Pins Left & Right */}
        <rect x="1" y="6" width="3" height="1.5" fill="#cbd5e1" />
        <rect x="1" y="10.25" width="3" height="1.5" fill="#cbd5e1" />
        <rect x="1" y="14.5" width="3" height="1.5" fill="#cbd5e1" />
        <rect x="18" y="6" width="3" height="1.5" fill="#cbd5e1" />
        <rect x="18" y="10.25" width="3" height="1.5" fill="#cbd5e1" />
        <rect x="18" y="14.5" width="3" height="1.5" fill="#cbd5e1" />
      </svg>
    </div>
  );
}

// Sitting pixel cat mascot for corners
export function SittingPixelCat({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`w-10 h-12 inline-block select-none pointer-events-none ${flip ? "-scale-x-100" : ""}`}>
      <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
        {/* Head */}
        <rect x="8" y="8" width="24" height="18" fill="#ffffff" stroke="#18181b" strokeWidth="2" rx="3" />
        {/* Ears */}
        <polygon points="10,8 16,8 10,2" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
        <rect x="11" y="5" width="2" height="2" fill="#fca5a5" />
        <polygon points="24,8 30,8 30,2" fill={flip ? "#f97316" : "#ffffff"} stroke="#18181b" strokeWidth="2" />
        <rect x="27" y="5" width="2" height="2" fill="#fca5a5" />
        {/* Eyes */}
        <rect x="13" y="14" width="3" height="3" fill="#18181b" />
        <rect x="24" y="14" width="3" height="3" fill="#18181b" />
        {/* Nose */}
        <rect x="19" y="18" width="2" height="1.5" fill="#f472b6" />
        {/* Cheeks */}
        <rect x="10" y="17" width="2.5" height="1.5" fill="#fbcfe8" opacity="0.8" />
        <rect x="27.5" y="17" width="2.5" height="1.5" fill="#fbcfe8" opacity="0.8" />
        {/* Body */}
        <rect x="11" y="26" width="18" height="16" fill="#ffffff" stroke="#18181b" strokeWidth="2" rx="3" />
        {/* Paws */}
        <rect x="13" y="40" width="5" height="4" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" rx="1" />
        <rect x="22" y="40" width="5" height="4" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" rx="1" />
        {/* Tail */}
        <path d="M 11 36 Q 4 34 3 28 Q 2 24 5 22 Q 6 22 5 26 Q 4 30 11 35 Z" fill="#18181b" />
      </svg>
    </div>
  );
}
