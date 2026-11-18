"use client";

import React from "react";

export function RiverDecorations() {
  return (
    <svg
      viewBox="0 0 1648 928"
      preserveAspectRatio="xMidYBottom slice"
      className="absolute inset-0 size-full pointer-events-none select-none z-10"
      shapeRendering="crispEdges"
    >
      <defs>
        {/* Rock Gradient */}
        <linearGradient id="rockGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="60%" stop-color="#64748b" />
          <stop offset="100%" stop-color="#334155" />
        </linearGradient>
      </defs>

      {/* ── 1. PIXEL WATER LILIES WITH PINK LOTUS BLOSSOMS (5 LOCATIONS FROM REFERENCE) ── */}

      {/* Lotus 1: Left River Channel (x=70, y=550) */}
      <g transform="translate(68, 545) scale(1.1)">
        {/* Segmented Green Lily Pad */}
        <rect x="6" y="24" width="46" height="12" fill="#15803d" />
        <rect x="0" y="27" width="58" height="8" fill="#16a34a" />
        <rect x="8" y="22" width="42" height="4" fill="#22c55e" />
        <rect x="22" y="26" width="8" height="6" fill="#14532d" />
        {/* Lotus Petals */}
        <rect x="18" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="24" y="6" width="8" height="17" fill="#ec4899" />
        <rect x="30" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="14" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="36" y="15" width="6" height="10" fill="#fbcfe8" />
        {/* Yellow Stamen Center */}
        <rect x="25" y="12" width="6" height="7" fill="#fde047" />
        <rect x="27" y="14" width="2" height="3" fill="#ca8a04" />
      </g>

      {/* Lotus 2: Bottom-Left River (x=215, y=745) */}
      <g transform="translate(210, 740) scale(1.2)">
        <rect x="6" y="24" width="46" height="12" fill="#15803d" />
        <rect x="0" y="27" width="58" height="8" fill="#16a34a" />
        <rect x="8" y="22" width="42" height="4" fill="#22c55e" />
        <rect x="22" y="26" width="8" height="6" fill="#14532d" />
        <rect x="18" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="24" y="6" width="8" height="17" fill="#ec4899" />
        <rect x="30" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="14" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="36" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="25" y="12" width="6" height="7" fill="#fde047" />
        <rect x="27" y="14" width="2" height="3" fill="#ca8a04" />
      </g>

      {/* Lotus 3: Bottom-Center River (x=1045, y=770) */}
      <g transform="translate(1040, 765) scale(1.15)">
        <rect x="6" y="24" width="46" height="12" fill="#15803d" />
        <rect x="0" y="27" width="58" height="8" fill="#16a34a" />
        <rect x="8" y="22" width="42" height="4" fill="#22c55e" />
        <rect x="22" y="26" width="8" height="6" fill="#14532d" />
        <rect x="18" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="24" y="6" width="8" height="17" fill="#ec4899" />
        <rect x="30" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="14" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="36" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="25" y="12" width="6" height="7" fill="#fde047" />
        <rect x="27" y="14" width="2" height="3" fill="#ca8a04" />
      </g>

      {/* Lotus 4: Bottom-Right River (x=1420, y=700) */}
      <g transform="translate(1415, 695) scale(1.2)">
        <rect x="6" y="24" width="46" height="12" fill="#15803d" />
        <rect x="0" y="27" width="58" height="8" fill="#16a34a" />
        <rect x="8" y="22" width="42" height="4" fill="#22c55e" />
        <rect x="22" y="26" width="8" height="6" fill="#14532d" />
        <rect x="18" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="24" y="6" width="8" height="17" fill="#ec4899" />
        <rect x="30" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="14" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="36" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="25" y="12" width="6" height="7" fill="#fde047" />
        <rect x="27" y="14" width="2" height="3" fill="#ca8a04" />
      </g>

      {/* Lotus 5: Right River Channel (x=1560, y=490) */}
      <g transform="translate(1555, 485) scale(1.05)">
        <rect x="6" y="24" width="46" height="12" fill="#15803d" />
        <rect x="0" y="27" width="58" height="8" fill="#16a34a" />
        <rect x="8" y="22" width="42" height="4" fill="#22c55e" />
        <rect x="22" y="26" width="8" height="6" fill="#14532d" />
        <rect x="18" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="24" y="6" width="8" height="17" fill="#ec4899" />
        <rect x="30" y="11" width="8" height="14" fill="#f472b6" />
        <rect x="14" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="36" y="15" width="6" height="10" fill="#fbcfe8" />
        <rect x="25" y="12" width="6" height="7" fill="#fde047" />
        <rect x="27" y="14" width="2" height="3" fill="#ca8a04" />
      </g>

      {/* Standalone Green Lily Pad in Water (Bottom Left-Center) */}
      <g transform="translate(148, 700) scale(1.15)">
        <rect x="6" y="6" width="40" height="11" fill="#15803d" />
        <rect x="0" y="9" width="52" height="8" fill="#16a34a" />
        <rect x="10" y="4" width="34" height="4" fill="#4ade80" />
        <rect x="18" y="7" width="8" height="7" fill="#14532d" />
      </g>

      {/* ── 2. STEPPING STONE ROCKS (3 FROM REFERENCE) ── */}
      {/* Rock 1 (Left Upper Channel: x=140, y=530) */}
      <g transform="translate(138, 530)">
        {/* Water Ripple around Rock */}
        <ellipse cx="18" cy="18" rx="24" ry="10" fill="none" stroke="#d4f6ff" strokeWidth="2.5" opacity="0.8" />
        <rect x="4" y="6" width="28" height="18" rx="3" fill="url(#rockGradient)" />
        <rect x="8" y="4" width="20" height="6" fill="#cbd5e1" />
        <rect x="6" y="18" width="24" height="6" fill="#1e293b" />
      </g>

      {/* Rock 2 (Bottom River Shelf: x=510, y=760) */}
      <g transform="translate(506, 760)">
        <ellipse cx="20" cy="20" rx="26" ry="11" fill="none" stroke="#d4f6ff" strokeWidth="2.5" opacity="0.8" />
        <rect x="6" y="8" width="30" height="20" rx="3" fill="url(#rockGradient)" />
        <rect x="10" y="6" width="22" height="6" fill="#cbd5e1" />
        <rect x="8" y="20" width="26" height="7" fill="#1e293b" />
      </g>

      {/* Rock 3 (Right River Channel: x=1350, y=550) */}
      <g transform="translate(1346, 550)">
        <ellipse cx="18" cy="18" rx="24" ry="10" fill="none" stroke="#d4f6ff" strokeWidth="2.5" opacity="0.8" />
        <rect x="4" y="6" width="28" height="18" rx="3" fill="url(#rockGradient)" />
        <rect x="8" y="4" width="20" height="6" fill="#cbd5e1" />
        <rect x="6" y="18" width="24" height="6" fill="#1e293b" />
      </g>

      {/* ── 3. SHORELINE WILDFLOWERS ON GRASS PLATFORMS ── */}
      {/* Yellow Wildflowers on Top-Left Cliff */}
      <g transform="translate(80, 70)">
        <rect x="0" y="0" width="6" height="6" fill="#fde047" />
        <rect x="8" y="4" width="5" height="5" fill="#fde047" />
        <rect x="15" y="-2" width="6" height="6" fill="#fde047" />
      </g>
      {/* Yellow Wildflowers on Bottom-Left Cliff */}
      <g transform="translate(90, 790)">
        <rect x="0" y="0" width="6" height="6" fill="#fde047" />
        <rect x="8" y="4" width="5" height="5" fill="#fde047" />
        <rect x="16" y="-3" width="6" height="6" fill="#fde047" />
      </g>
      {/* Yellow Wildflowers on Bottom-Right Cliff */}
      <g transform="translate(1520, 800)">
        <rect x="0" y="0" width="6" height="6" fill="#fde047" />
        <rect x="8" y="4" width="5" height="5" fill="#fde047" />
        <rect x="16" y="-3" width="6" height="6" fill="#fde047" />
      </g>
      {/* Yellow Wildflowers on Top-Right Cliff */}
      <g transform="translate(1550, 70)">
        <rect x="0" y="0" width="6" height="6" fill="#fde047" />
        <rect x="8" y="4" width="5" height="5" fill="#fde047" />
        <rect x="16" y="-2" width="6" height="6" fill="#fde047" />
      </g>
    </svg>
  );
}

