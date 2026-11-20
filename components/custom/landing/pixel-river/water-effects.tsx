"use client";

import React from "react";

export function WaterEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
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
    </div>
  );
}
