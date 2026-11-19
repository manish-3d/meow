"use client";

import React from "react";

// =========================================================================
// REUSABLE ISOMETRIC MINECRAFT ISLAND BASE SVG PATHS
// =========================================================================
// Center rhombus top face: M 140 30 L 250 85 L 140 140 L 30 85 Z
// Left dirt: M 30 85 L 140 140 L 140 175 L 30 120 Z
// Right dirt: M 140 140 L 250 85 L 250 120 L 140 175 Z

function IslandBaseDef() {
  return (
    <>
      <defs>
        <linearGradient id="grassTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>

        <linearGradient id="dirtLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>

        <linearGradient id="dirtRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        <radialGradient id="islandShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="140" cy="182" rx="90" ry="16" fill="url(#islandShadow)" />

      {/* Dirt Left Face */}
      <path d="M 30 85 L 140 140 L 140 175 L 30 120 Z" fill="url(#dirtLeftGrad)" />
      {/* Dirt pixels left */}
      <rect x="45" y="98" width="10" height="8" fill="#a16207" opacity="0.6" />
      <rect x="75" y="112" width="12" height="9" fill="#713f12" />
      <rect x="105" y="130" width="14" height="8" fill="#a16207" opacity="0.5" />
      <rect x="58" y="115" width="10" height="8" fill="#451a03" opacity="0.7" />
      <rect x="90" y="138" width="12" height="8" fill="#a16207" opacity="0.7" />

      {/* Dirt Right Face */}
      <path d="M 140 140 L 250 85 L 250 120 L 140 175 Z" fill="url(#dirtRightGrad)" />
      {/* Dirt pixels right */}
      <rect x="160" y="130" width="12" height="8" fill="#451a03" />
      <rect x="190" y="112" width="14" height="9" fill="#713f12" opacity="0.8" />
      <rect x="220" y="98" width="10" height="8" fill="#361502" />
      <rect x="175" y="142" width="12" height="7" fill="#451a03" opacity="0.7" />

      {/* Grass Overhang Drops */}
      <path
        d="M 30 85 L 48 94 L 48 102 L 68 111 L 68 104 L 88 113 L 88 122 L 108 131 L 108 124 L 126 133 L 126 140 L 140 147 L 140 140 L 30 85 Z"
        fill="#16a34a"
      />
      <path
        d="M 140 140 L 158 131 L 158 138 L 176 129 L 176 121 L 194 112 L 194 120 L 214 111 L 214 103 L 232 94 L 232 100 L 250 91 L 250 85 L 140 140 Z"
        fill="#15803d"
      />

      {/* Grass Top Face */}
      <path d="M 140 30 L 250 85 L 140 140 L 30 85 Z" fill="url(#grassTopGrad)" />

      {/* Grass Isometric Texture Squares */}
      <path d="M 140 30 L 175 47 L 140 65 L 105 47 Z" fill="#86efac" opacity="0.35" />
      <path d="M 105 47 L 140 65 L 105 82 L 70 65 Z" fill="#4ade80" opacity="0.3" />
      <path d="M 175 47 L 210 65 L 175 82 L 140 65 Z" fill="#22c55e" opacity="0.3" />
      <path d="M 140 65 L 175 82 L 140 100 L 105 82 Z" fill="#86efac" opacity="0.4" />
      <path d="M 70 65 L 105 82 L 70 100 L 30 85 Z" fill="#4ade80" opacity="0.25" />
      <path d="M 105 82 L 140 100 L 105 118 L 70 100 Z" fill="#22c55e" opacity="0.35" />
      <path d="M 175 82 L 210 100 L 175 118 L 140 100 Z" fill="#16a34a" opacity="0.3" />
      <path d="M 210 65 L 250 85 L 210 100 L 175 82 Z" fill="#15803d" opacity="0.25" />
      <path d="M 140 100 L 175 118 L 140 140 L 105 118 Z" fill="#86efac" opacity="0.3" />

      {/* Hanging Minecraft Vines */}
      <path d="M 50 100 L 50 120 L 55 120 L 55 103 Z" fill="#15803d" />
      <rect x="48" y="114" width="4" height="4" fill="#16a34a" />
      <path d="M 94 122 L 94 148 L 99 148 L 99 125 Z" fill="#15803d" />
      <rect x="97" y="138" width="4" height="6" fill="#22c55e" />
      <path d="M 185 126 L 185 152 L 190 152 L 190 130 Z" fill="#14532d" />
      <rect x="183" y="140" width="4" height="6" fill="#16a34a" />
      <path d="M 222 108 L 222 128 L 226 128 L 226 111 Z" fill="#14532d" />
    </>
  );
}

// =========================================================================
// 1. VOXEL CAT RESEARCHER (MATCHING IMAGE 1 & 2 DOWN TO THE PIXEL)
// =========================================================================

export function VoxelCatResearcher() {
  return (
    <div className="relative w-full h-[180px] sm:h-[195px] flex items-center justify-center select-none pointer-events-none">
      <svg
        width="280"
        height="195"
        viewBox="0 0 280 195"
        fill="none"
        className="overflow-visible"
      >
        {/* Island Base */}
        <IslandBaseDef />

        {/* ── THE CALICO VOXEL CAT WITH GAMING HEADPHONES ── */}
        <g transform="translate(68, 38)">
          {/* Ears */}
          <rect x="16" y="2" width="7" height="7" fill="#f97316" rx="1" /> {/* Orange Left Ear */}
          <rect x="18" y="4" width="3" height="3" fill="#fbcfe8" />
          <rect x="36" y="2" width="7" height="7" fill="#ffffff" rx="1" /> {/* White Right Ear */}
          <rect x="38" y="4" width="3" height="3" fill="#fbcfe8" />

          {/* Head */}
          <rect x="16" y="8" width="28" height="23" fill="#ffffff" rx="3" className="drop-shadow-sm" />
          {/* Calico orange patch */}
          <path d="M 16 8 L 28 8 L 28 20 L 16 16 Z" fill="#fb923c" rx="1" />

          {/* Happy closed eyes ^ ^ */}
          <path d="M 20 18 Q 23 15 26 18" stroke="#18181b" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 34 18 Q 37 15 40 18" stroke="#18181b" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Pink Cheeks */}
          <rect x="18" y="21" width="4" height="2" fill="#f472b6" opacity="0.8" rx="1" />
          <rect x="38" y="21" width="4" height="2" fill="#f472b6" opacity="0.8" rx="1" />

          {/* Snout */}
          <rect x="29" y="19" width="2" height="2" fill="#fb7185" />
          <path d="M 28 22 Q 30 24 32 22" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Black Headphones with Neon Green Cat Logo Ring */}
          <path d="M 12 18 Q 12 2 30 2 Q 48 2 48 18" stroke="#18181b" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Left Earcup */}
          <rect x="9" y="15" width="7" height="11" fill="#18181b" rx="2" />
          <circle cx="12.5" cy="20.5" r="2" fill="#22c55e" />
          {/* Right Earcup */}
          <rect x="44" y="15" width="7" height="11" fill="#18181b" rx="2" />
          <circle cx="47.5" cy="20.5" r="2" fill="#22c55e" />

          {/* Body */}
          <rect x="20" y="29" width="20" height="18" fill="#ffffff" rx="2" />
          <rect x="20" y="32" width="8" height="10" fill="#fb923c" rx="1" />

          {/* Wagging Tail */}
          <path d="M 20 40 Q 10 38 7 32 Q 5 28 8 26 Q 10 26 9 30 Q 8 35 16 39 Z" fill="#fb923c" />
        </g>

        {/* ── SILVER VOXEL LAPTOP ── */}
        <g transform="translate(108, 62)">
          {/* Base */}
          <path d="M 2 24 L 20 24 L 24 32 L -2 32 Z" fill="#e4e4e7" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M 4 26 L 18 26 L 21 30 L 1 30 Z" fill="#18181b" />
          {/* Lid (Angled) */}
          <path d="M 2 8 L 20 8 L 20 24 L 2 24 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" rx="1" />
          {/* Screen glow */}
          <rect x="4" y="10" width="14" height="12" fill="#38bdf8" opacity="0.9" rx="0.5" />
          {/* Cat logo on lid */}
          <path d="M 9 14 L 11 12 L 13 14 L 11 16 Z" fill="#18181b" />
        </g>

        {/* ── STANDING MONITOR ("Browsing AI trends >") ── */}
        <g transform="translate(142, 42)">
          {/* Stand */}
          <rect x="19" y="44" width="5" height="12" fill="#3f3f46" />
          <ellipse cx="21.5" cy="56" rx="12" ry="3.5" fill="#27272a" />

          {/* Frame */}
          <rect x="0" y="6" width="48" height="38" fill="#18181b" rx="3" stroke="#27272a" strokeWidth="1.5" className="drop-shadow-md" />
          {/* Blue Screen */}
          <rect x="2.5" y="8.5" width="43" height="33" fill="#0284c7" rx="1" />
          {/* Screen text */}
          <text x="6" y="20" fill="#ffffff" fontSize="5.5" fontFamily="monospace" fontWeight="bold">
            Browsing
          </text>
          <text x="6" y="28" fill="#38bdf8" fontSize="5.5" fontFamily="monospace" fontWeight="bold">
            AI trends
          </text>
          <text x="36" y="28" fill="#fde047" fontSize="7" fontFamily="monospace" fontWeight="bold">
            &gt;
          </text>
          {/* Progress bar */}
          <rect x="6" y="33" width="31" height="2.5" fill="#0369a1" rx="1" />
          <rect x="6" y="33" width="19" height="2.5" fill="#38bdf8" rx="1" />
        </g>

        {/* ── VOXEL BOOKS & MAGNIFYING GLASS ── */}
        <g transform="translate(94, 88)">
          <rect x="0" y="3" width="12" height="3.5" fill="#7c2d12" rx="0.5" />
          <rect x="1" y="0" width="10" height="3" fill="#0284c7" rx="0.5" />
          <circle cx="18" cy="3" r="3.5" stroke="#71717a" strokeWidth="1.2" fill="#e0f2fe" opacity="0.8" />
          <line x1="20.5" y1="5.5" x2="24" y2="9" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// =========================================================================
// 2. VOXEL SOCIAL STATION (BILLBOARD WITH APPS & DRAFTING POPOVER)
// =========================================================================

export function VoxelSocialStation() {
  return (
    <div className="relative w-full h-[180px] sm:h-[195px] flex items-center justify-center select-none pointer-events-none">
      <svg
        width="280"
        height="195"
        viewBox="0 0 280 195"
        fill="none"
        className="overflow-visible"
      >
        <IslandBaseDef />

        {/* ── 3D VOXEL BILLBOARD STANDING ON GRASS ── */}
        <g transform="translate(96, 40)">
          {/* Stand Legs */}
          <rect x="10" y="52" width="4" height="16" fill="#713f12" />
          <rect x="62" y="52" width="4" height="16" fill="#713f12" />

          {/* Billboard Frame */}
          <rect x="0" y="0" width="76" height="54" fill="#3b82f6" rx="4" stroke="#1d4ed8" strokeWidth="1.5" className="drop-shadow-lg" />
          {/* Top Header Bar */}
          <rect x="0" y="0" width="76" height="11" fill="#2563eb" rx="3" />
          <circle cx="7" cy="5.5" r="1.8" fill="#ef4444" />
          <circle cx="13" cy="5.5" r="1.8" fill="#f59e0b" />
          <circle cx="19" cy="5.5" r="1.8" fill="#10b981" />

          {/* App Icons Grid */}
          <g transform="translate(7, 15)">
            {/* FB */}
            <rect x="0" y="2" width="13" height="13" fill="#1877f2" rx="2" />
            <text x="3.5" y="12" fill="#ffffff" fontSize="9" fontWeight="bold">f</text>
            {/* Insta */}
            <rect x="16" y="2" width="13" height="13" fill="url(#socialInstaGrad)" rx="2.5" />
            <circle cx="22.5" cy="8.5" r="3" stroke="#ffffff" strokeWidth="1" fill="none" />
            {/* TikTok */}
            <rect x="32" y="2" width="13" height="13" fill="#000000" rx="2" />
            <text x="35" y="12" fill="#00f2fe" fontSize="8" fontWeight="bold">d</text>

            {/* X */}
            <rect x="0" y="18" width="13" height="13" fill="#0284c7" rx="2" />
            <text x="3" y="27" fill="#ffffff" fontSize="8" fontWeight="bold">X</text>
            {/* Slack */}
            <rect x="16" y="18" width="13" height="13" fill="#4a154b" rx="2" />
            <circle cx="22.5" cy="24.5" r="2.5" fill="#ecb22e" />
          </g>

          {/* Floating Emoji Cubes */}
          <g transform="translate(-10, 14)">
            <rect x="0" y="0" width="11" height="11" fill="#fde047" rx="2" className="drop-shadow-md" />
            <text x="1.5" y="8.5" fontSize="7">😊</text>
          </g>
          <g transform="translate(74, 10)">
            <rect x="0" y="0" width="12" height="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" rx="2" className="drop-shadow-md" />
            <text x="2" y="8.5" fontSize="6.5">💬</text>
          </g>
        </g>

        <defs>
          <linearGradient id="socialInstaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── FLOATING POPOVER: DRAFTING POSTS QUEUE ── */}
      <div className="absolute right-[12px] sm:right-[18px] top-[18px] z-20 w-[114px] bg-white/98 rounded-xl border border-black/[0.08] p-2 shadow-lg text-[9px] font-sans">
        <p className="font-bold text-neutral-800 text-[9.5px] mb-1">Drafting posts...</p>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-900">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>1 Starting</span>
          </div>
          <div className="px-1.5 py-0.5 text-neutral-500">2 Create posts...</div>
          <div className="px-1.5 py-0.5 text-neutral-500">3 Drafting posts...</div>
          <div className="px-1.5 py-0.5 text-neutral-400">4 Create link...</div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 3. VOXEL CODING STATION (BEIGE CRT COMPUTER, DUAL TERMINALS, GITHUB BLOCKS)
// =========================================================================

export function VoxelCodingStation() {
  return (
    <div className="relative w-full h-[180px] sm:h-[195px] flex items-center justify-center select-none pointer-events-none">
      <svg
        width="280"
        height="195"
        viewBox="0 0 280 195"
        fill="none"
        className="overflow-visible"
      >
        <IslandBaseDef />

        {/* ── RETRO BEIGE CRT COMPUTER ── */}
        <g transform="translate(112, 42)">
          {/* Housing */}
          <rect x="0" y="6" width="46" height="42" fill="#e4e4e7" stroke="#cbd5e1" strokeWidth="1.2" rx="3.5" className="drop-shadow-md" />
          {/* Screen */}
          <rect x="4.5" y="10.5" width="37" height="29" fill="#09090b" rx="2" />
          {/* Code Lines */}
          <line x1="7" y1="15" x2="28" y2="15" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="7" y1="19.5" x2="35" y2="19.5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="11" y1="24" x2="25" y2="24" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="11" y1="28.5" x2="33" y2="28.5" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="7" y1="33" x2="18" y2="33" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />

          {/* Floppy slot & LED */}
          <rect x="24" y="41" width="13" height="2" fill="#71717a" rx="0.5" />
          <circle cx="39" cy="42" r="1.2" fill="#22c55e" />

          {/* Keyboard in front */}
          <g transform="translate(-3, 48)">
            <rect x="0" y="0" width="44" height="13" fill="#e4e4e7" stroke="#cbd5e1" strokeWidth="1" rx="1.5" />
            <rect x="3" y="3" width="38" height="3.5" fill="#a1a1aa" opacity="0.6" rx="0.5" />
            <rect x="11" y="8" width="16" height="2.5" fill="#71717a" rx="0.5" />
          </g>
        </g>

        {/* ── TWO DUAL MINI DARK TERMINALS (ON LEFT) ── */}
        <g transform="translate(68, 54)">
          {/* Rear terminal */}
          <rect x="0" y="0" width="30" height="23" fill="#18181b" stroke="#3f3f46" strokeWidth="1" rx="2" />
          <line x1="4" y1="6" x2="21" y2="6" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="4" y1="11" x2="16" y2="11" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="4" y1="16" x2="25" y2="16" stroke="#f472b6" strokeWidth="1.2" strokeLinecap="round" />

          {/* Front terminal with `>_` */}
          <g transform="translate(12, 14)">
            <rect x="0" y="0" width="25" height="18" fill="#09090b" stroke="#22c55e" strokeWidth="1" rx="2" className="drop-shadow-sm" />
            <text x="3.5" y="10" fill="#4ade80" fontSize="6.5" fontFamily="monospace" fontWeight="bold">&gt;_</text>
            <rect x="12" y="6.5" width="3.5" height="5" fill="#4ade80" className="animate-pulse" />
          </g>
        </g>

        {/* ── TWO 3D GITHUB OCTOCAT BLOCKS (ON RIGHT) ── */}
        <g transform="translate(170, 64)">
          <g transform="translate(0, 3)">
            <rect x="0" y="0" width="15" height="16" fill="#18181b" rx="2" stroke="#27272a" strokeWidth="1" className="drop-shadow-sm" />
            <circle cx="7.5" cy="7.5" r="4" fill="#ffffff" />
            <path d="M 5.5 4.5 L 6.5 6.5 L 8.5 6.5 L 9.5 4.5 Z" fill="#18181b" />
          </g>
          <g transform="translate(16, 9)">
            <rect x="0" y="0" width="15" height="16" fill="#18181b" rx="2" stroke="#27272a" strokeWidth="1" className="drop-shadow-sm" />
            <circle cx="7.5" cy="7.5" r="4" fill="#ffffff" />
            <path d="M 5.5 4.5 L 6.5 6.5 L 8.5 6.5 L 9.5 4.5 Z" fill="#18181b" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// =========================================================================
// 4. VOXEL JOB STATION (PATHWAY, 3D SEARCH & APPLY HEARTS/SIGNS)
// =========================================================================

export function VoxelJobStation() {
  return (
    <div className="relative w-full h-[180px] sm:h-[195px] flex items-center justify-center select-none pointer-events-none">
      <svg
        width="280"
        height="195"
        viewBox="0 0 280 195"
        fill="none"
        className="overflow-visible"
      >
        <IslandBaseDef />

        {/* ── DIAGONAL DIRT PATHWAY ON GRASS ── */}
        <g transform="translate(48, 48)">
          <path
            d="M 55 18 L 90 35 L 145 62 L 110 80 L 55 52 Z"
            fill="#92400e"
            opacity="0.85"
          />
          <rect x="75" y="32" width="6" height="4" fill="#a16207" />
          <rect x="96" y="42" width="8" height="5" fill="#b45309" />
          <rect x="116" y="52" width="7" height="4" fill="#a16207" />
          <rect x="85" y="50" width="8" height="6" fill="#78350f" />
        </g>

        {/* ── RED 3D VOXEL SEARCH SIGN ── */}
        <g transform="translate(86, 52)">
          {/* Post */}
          <rect x="14" y="26" width="3.5" height="18" fill="#78350f" />
          {/* Sign */}
          <rect x="0" y="0" width="33" height="25" fill="#dc2626" rx="3.5" stroke="#991b1b" strokeWidth="1.5" className="drop-shadow-md" />
          <path d="M 0 3 L 3 0 L 33 0 L 33 22 L 30 25 L 0 25 Z" fill="#ef4444" opacity="0.3" />
          <text x="4" y="16" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
            Search
          </text>
        </g>

        {/* ── GREEN 3D VOXEL APPLY SIGN ── */}
        <g transform="translate(138, 50)">
          {/* Post */}
          <rect x="14" y="26" width="3.5" height="20" fill="#78350f" />
          {/* Sign */}
          <rect x="0" y="0" width="31" height="25" fill="#16a34a" rx="3.5" stroke="#14532d" strokeWidth="1.5" className="drop-shadow-md" />
          <path d="M 0 3 L 3 0 L 31 0 L 31 22 L 28 25 L 0 25 Z" fill="#22c55e" opacity="0.3" />
          <text x="4.5" y="16" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
            Apply
          </text>
        </g>
      </svg>
    </div>
  );
}

// =========================================================================
// 5. VOLUMETRIC VOXEL CLOUDS (MINECRAFT 3D STEPPED CLOUDS)
// =========================================================================

export function VoxelClouds() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <svg
        className="absolute top-4 right-10 opacity-70 animate-float-slow"
        width="150"
        height="80"
        viewBox="0 0 150 80"
        fill="none"
      >
        <rect x="20" y="20" width="100" height="30" fill="#ffffff" opacity="0.9" rx="2" />
        <rect x="40" y="10" width="60" height="35" fill="#ffffff" rx="2" />
        <rect x="30" y="35" width="90" height="15" fill="#f1f5f9" />
        <rect x="20" y="45" width="100" height="8" fill="#e2e8f0" opacity="0.6" />
      </svg>

      <svg
        className="absolute top-8 left-12 opacity-60 animate-float-reverse"
        width="130"
        height="70"
        viewBox="0 0 130 70"
        fill="none"
      >
        <rect x="15" y="18" width="90" height="25" fill="#ffffff" opacity="0.85" rx="2" />
        <rect x="35" y="10" width="50" height="30" fill="#ffffff" rx="2" />
        <rect x="15" y="38" width="90" height="6" fill="#e2e8f0" opacity="0.5" />
      </svg>
    </div>
  );
}

// =========================================================================
// 6. PIXEL VOXEL ICONS FOR SIDEBAR
// =========================================================================

export function GrassBlockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="shrink-0 drop-shadow-2xs">
      <rect x="1" y="6" width="14" height="9" fill="#78350f" rx="1" />
      <rect x="4" y="9" width="3" height="3" fill="#a16207" />
      <rect x="10" y="11" width="3" height="2" fill="#522204" />
      <rect x="1" y="2" width="14" height="5" fill="#22c55e" rx="1" />
      <rect x="3" y="6" width="2" height="3" fill="#16a34a" />
      <rect x="8" y="6" width="3" height="2" fill="#16a34a" />
      <rect x="12" y="6" width="2" height="3" fill="#16a34a" />
      <rect x="2" y="3" width="12" height="2" fill="#86efac" opacity="0.8" />
    </svg>
  );
}

export function VoxelFaceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="shrink-0 drop-shadow-2xs">
      <rect x="1" y="2" width="14" height="12" fill="#fb923c" rx="2" />
      <rect x="4" y="5" width="2.5" height="2.5" fill="#18181b" />
      <rect x="9.5" y="5" width="2.5" height="2.5" fill="#18181b" />
      <rect x="6.5" y="8.5" width="3" height="2" fill="#ffffff" rx="0.5" />
      <rect x="7.5" y="8.5" width="1" height="1" fill="#18181b" />
    </svg>
  );
}

// =========================================================================
// 7. LONE MASCOT CAT FOR FRAME 1 (CENTER FLOATING ISLAND)
// =========================================================================

export function VoxelLoneMascot() {
  return (
    <svg
      width="280"
      height="195"
      viewBox="0 0 280 195"
      fill="none"
      className="overflow-visible"
    >
      <IslandBaseDef />

      {/* Cute Voxel Cat with Headphones Perched on Center of Island */}
      <g transform="translate(116, 42)">
        {/* Ears */}
        <rect x="14" y="2" width="7" height="7" fill="#f97316" rx="1" />
        <rect x="16" y="4" width="3" height="3" fill="#fbcfe8" />
        <rect x="32" y="2" width="7" height="7" fill="#ffffff" rx="1" />
        <rect x="34" y="4" width="3" height="3" fill="#fbcfe8" />

        {/* Head */}
        <rect x="14" y="8" width="26" height="22" fill="#ffffff" rx="3" className="drop-shadow-sm" />
        <path d="M 14 8 L 25 8 L 25 18 L 14 15 Z" fill="#fb923c" rx="1" />

        {/* Cute Face ^ ^ */}
        <path d="M 18 17 Q 21 14 24 17" stroke="#18181b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 30 17 Q 33 14 36 17" stroke="#18181b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <rect x="16" y="20" width="4" height="2" fill="#f472b6" opacity="0.8" rx="1" />
        <rect x="34" y="20" width="4" height="2" fill="#f472b6" opacity="0.8" rx="1" />
        <rect x="26.5" y="18" width="2" height="2" fill="#fb7185" />

        {/* Black Headphones with Neon Green Cat Logo Ring */}
        <path d="M 10 17 Q 10 2 27 2 Q 44 2 44 17" stroke="#18181b" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="8" y="14" width="6" height="10" fill="#18181b" rx="2" />
        <circle cx="11" cy="19" r="1.8" fill="#22c55e" />
        <rect x="40" y="14" width="6" height="10" fill="#18181b" rx="2" />
        <circle cx="43" cy="19" r="1.8" fill="#22c55e" />

        {/* Cat Body */}
        <rect x="18" y="28" width="18" height="16" fill="#ffffff" rx="2" />
        <rect x="18" y="30" width="7" height="9" fill="#fb923c" rx="1" />

        {/* Tail */}
        <path d="M 18 38 Q 8 36 6 30 Q 5 26 8 24 Q 9 24 8 28 Q 7 32 14 37 Z" fill="#fb923c" />
      </g>
    </svg>
  );
}
