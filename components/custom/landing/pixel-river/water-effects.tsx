"use client";

import React from "react";

export function WaterEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* --- DRIFTING PIXEL CLOUDS (Top Sky Layer) --- */}
      {/* Cloud 1: Drifting Slowly across Top Left */}
      <div className="absolute top-[8%] -left-20 w-36 sm:w-48 h-8 opacity-65 animate-[driftCloud_45s_linear_infinite]">
        <svg viewBox="0 0 96 20" className="w-full h-full" shapeRendering="crispEdges">
          <rect x="20" y="2" width="48" height="6" fill="#FFFFFF" />
          <rect x="12" y="6" width="68" height="8" fill="#FFFFFF" />
          <rect x="6" y="10" width="82" height="6" fill="#F1F5F9" />
          <rect x="18" y="14" width="60" height="4" fill="#E2E8F0" />
        </svg>
      </div>

      {/* Cloud 2: Drifting across Top Center */}
      <div className="absolute top-[5%] left-[35%] w-28 sm:w-40 h-7 opacity-50 animate-[driftCloud_60s_linear_infinite_18s]">
        <svg viewBox="0 0 80 18" className="w-full h-full" shapeRendering="crispEdges">
          <rect x="16" y="2" width="38" height="5" fill="#FFFFFF" />
          <rect x="8" y="6" width="56" height="7" fill="#FFFFFF" />
          <rect x="4" y="10" width="68" height="5" fill="#F1F5F9" />
        </svg>
      </div>

      {/* Cloud 3: Drifting across Top Right */}
      <div className="absolute top-[9%] right-[10%] w-32 sm:w-44 h-8 opacity-60 animate-[driftCloud_52s_linear_infinite_8s]">
        <svg viewBox="0 0 90 20" className="w-full h-full" shapeRendering="crispEdges">
          <rect x="18" y="2" width="44" height="6" fill="#FFFFFF" />
          <rect x="10" y="6" width="64" height="8" fill="#FFFFFF" />
          <rect x="6" y="10" width="76" height="6" fill="#F1F5F9" />
        </svg>
      </div>

      {/* --- WATER PIXEL SHIMMERS & HIGHLIGHTS --- */}
      {/* Left River Stream Shimmers */}
      <div className="absolute top-[54%] left-[5%] size-1.5 bg-white/90 rounded-xs animate-[shimmerSparkle_2.8s_ease-in-out_infinite]" />
      <div className="absolute top-[66%] left-[10%] size-2 bg-sky-200/90 rounded-xs animate-[shimmerSparkle_3.2s_ease-in-out_infinite_1.2s]" />
      <div className="absolute top-[76%] left-[14%] size-1.5 bg-white/90 rounded-xs animate-[shimmerSparkle_2.4s_ease-in-out_infinite_0.6s]" />
      <div className="absolute top-[86%] left-[22%] size-2 bg-sky-100/90 rounded-xs animate-[shimmerSparkle_3.5s_ease-in-out_infinite_1.8s]" />

      {/* Right River Stream Shimmers */}
      <div className="absolute top-[56%] right-[6%] size-1.5 bg-white/90 rounded-xs animate-[shimmerSparkle_3.0s_ease-in-out_infinite_0.4s]" />
      <div className="absolute top-[68%] right-[12%] size-2 bg-sky-200/90 rounded-xs animate-[shimmerSparkle_2.6s_ease-in-out_infinite_1.5s]" />
      <div className="absolute top-[80%] right-[16%] size-1.5 bg-white/90 rounded-xs animate-[shimmerSparkle_3.4s_ease-in-out_infinite_0.9s]" />
      <div className="absolute top-[90%] right-[26%] size-2 bg-sky-100/90 rounded-xs animate-[shimmerSparkle_2.9s_ease-in-out_infinite_1.4s]" />

      {/* --- FLOATING WATER LOTUS BOBBING OVERLAYS (Aligned to illustrated lotuses) --- */}
      {/* Left Lotus Pad 1 */}
      <div className="absolute top-[58%] left-[2.5%] w-8 h-6 pointer-events-none animate-[riverBob_3.4s_ease-in-out_infinite]">
        <div className="w-full h-full rounded-full bg-pink-300/30 blur-[2px]" />
      </div>

      {/* Left Lotus Pad 2 */}
      <div className="absolute top-[80%] left-[7%] w-9 h-6 pointer-events-none animate-[riverBob_3.8s_ease-in-out_infinite_0.5s]">
        <div className="w-full h-full rounded-full bg-pink-300/30 blur-[2px]" />
      </div>

      {/* Right Lotus Pad 1 */}
      <div className="absolute top-[62%] right-[2%] w-8 h-6 pointer-events-none animate-[riverBob_3.6s_ease-in-out_infinite_0.8s]">
        <div className="w-full h-full rounded-full bg-pink-300/30 blur-[2px]" />
      </div>

      {/* Right Lotus Pad 2 */}
      <div className="absolute top-[78%] right-[8%] w-9 h-6 pointer-events-none animate-[riverBob_3.3s_ease-in-out_infinite_1.2s]">
        <div className="w-full h-full rounded-full bg-pink-300/30 blur-[2px]" />
      </div>

      {/* Right Lotus Pad 3 */}
      <div className="absolute top-[88%] right-[23%] w-9 h-6 pointer-events-none animate-[riverBob_3.5s_ease-in-out_infinite_1.6s]">
        <div className="w-full h-full rounded-full bg-pink-300/30 blur-[2px]" />
      </div>
    </div>
  );
}
