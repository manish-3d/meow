"use client";

import React from "react";
import { motion } from "motion/react";

export function OceanBackground() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 w-full h-[160px] sm:h-[200px] lg:h-[220px] overflow-hidden select-none z-10">
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Deep Ocean Gradient */}
          <linearGradient id="oceanDeep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Cyan Surface Wave Gradient */}
          <linearGradient id="waveCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Lighthouse Lantern Warm Glow */}
          <radialGradient id="lighthouseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="40%" stopColor="#facc15" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- DEEP OCEAN BASE --- */}
        <rect x="0" y="85" width="1440" height="135" fill="url(#oceanDeep)" />

        {/* --- BACK WAVE LAYER --- */}
        <motion.g
          animate={{ x: [-14, 14, -14], y: [0, -3.5, 0] }}
          transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
        >
          <path
            d="M 0 85 
               Q 120 70, 240 85 
               T 480 85 
               T 720 82 
               T 960 85 
               T 1200 82 
               T 1440 85 
               L 1440 220 L 0 220 Z"
            fill="#0284c7"
            opacity="0.9"
          />
        </motion.g>

        {/* --- MID WAVE LAYER (Stepped Cyan Voxel Ridges) --- */}
        <motion.g
          animate={{ x: [12, -12, 12], y: [-2.5, 2.5, -2.5] }}
          transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut" }}
        >
          <path
            d="M 0 98 
               C 80 82, 160 108, 260 94 
               C 360 82, 440 104, 540 92 
               C 660 80, 760 106, 860 94 
               C 980 82, 1080 104, 1180 92 
               C 1280 82, 1360 104, 1440 92 
               L 1440 220 L 0 220 Z"
            fill="url(#waveCyan)"
          />

          {/* Stepped Pixel Foam on Mid Waves */}
          <g fill="#ffffff" opacity="0.95">
            <rect x="180" y="90" width="28" height="5" rx="1.5" />
            <rect x="198" y="86" width="18" height="4" rx="1" />
            <rect x="430" y="88" width="32" height="5" rx="1.5" />
            <rect x="448" y="84" width="18" height="4" rx="1" />
            <rect x="700" y="88" width="34" height="5" rx="1.5" />
            <rect x="720" y="84" width="20" height="4" rx="1" />
            <rect x="960" y="88" width="32" height="5" rx="1.5" />
            <rect x="980" y="84" width="18" height="4" rx="1" />
            <rect x="1220" y="90" width="30" height="5" rx="1.5" />
            <rect x="1238" y="86" width="18" height="4" rx="1" />
          </g>
        </motion.g>

        {/* --- FRONT WAVE LAYER (Vibrant Ocean with Crisp White Crests) --- */}
        <motion.g
          animate={{ x: [-9, 9, -9], y: [1.5, -2.5, 1.5] }}
          transition={{ repeat: Infinity, duration: 4.4, ease: "easeInOut" }}
        >
          <path
            d="M 0 116 
               C 100 100, 200 126, 320 112 
               C 440 98, 560 128, 680 114 
               C 800 100, 920 126, 1040 112 
               C 1160 100, 1280 124, 1440 110 
               L 1440 220 L 0 220 Z"
            fill="#0284c7"
          />

          {/* Crisp Voxel White Foam Crests */}
          <g fill="#ffffff">
            <rect x="60" y="106" width="42" height="6" rx="2" />
            <rect x="76" y="101" width="22" height="5" rx="1.5" />

            <rect x="300" y="104" width="48" height="6" rx="2" />
            <rect x="320" y="99" width="24" height="5" rx="1.5" />

            <rect x="600" y="105" width="52" height="6" rx="2" />
            <rect x="626" y="100" width="26" height="5" rx="1.5" />

            <rect x="880" y="104" width="48" height="6" rx="2" />
            <rect x="904" y="99" width="24" height="5" rx="1.5" />

            <rect x="1140" y="105" width="50" height="6" rx="2" />
            <rect x="1166" y="100" width="26" height="5" rx="1.5" />

            <rect x="1350" y="107" width="40" height="6" rx="2" />
          </g>

          {/* Sparkle Pixel Glints in Water */}
          <g fill="#bae6fd" opacity="0.85">
            <rect x="150" y="142" width="8" height="3" rx="1" />
            <rect x="500" y="150" width="10" height="3.5" rx="1" />
            <rect x="780" y="146" width="9" height="3" rx="1" />
            <rect x="1050" y="152" width="11" height="3.5" rx="1" />
            <rect x="1300" y="144" width="9" height="3" rx="1" />
          </g>
        </motion.g>

        {/* =========================================================================
            BOTTOM LEFT: STEPPED VOXEL ROCKY ISLAND + LIGHTHOUSE
           ========================================================================= */}
        <g id="leftIslandAndLighthouse">
          {/* Island Rocky Foundation (Stepped Voxel Blocks) */}
          <rect x="20" y="176" width="150" height="44" rx="2" fill="#334155" />
          <rect x="12" y="188" width="54" height="32" rx="2" fill="#1e293b" />
          <rect x="38" y="162" width="118" height="30" rx="2" fill="#475569" />

          {/* Stepped upper rock tiers */}
          <rect x="46" y="148" width="100" height="24" rx="2" fill="#475569" />
          <rect x="56" y="134" width="78" height="22" rx="2" fill="#64748b" />
          <rect x="68" y="122" width="56" height="18" rx="2" fill="#64748b" />

          {/* Mossy Green Voxel Patches on Rocks */}
          <rect x="50" y="146" width="18" height="5" rx="1.5" fill="#65a30d" />
          <rect x="90" y="132" width="22" height="5" rx="1.5" fill="#84cc16" />
          <rect x="116" y="146" width="16" height="5" rx="1.5" fill="#65a30d" />

          {/* --- THE VOXEL LIGHTHOUSE --- */}
          <g id="lighthouseTower">
            {/* Stone Platform Base */}
            <rect x="74" y="116" width="40" height="8" rx="2" fill="#334155" />

            {/* Red Stripe 1 (Bottom) */}
            <rect x="76" y="100" width="36" height="16" fill="#ef4444" />
            <rect x="76" y="100" width="10" height="16" fill="#dc2626" />

            {/* White Stripe 1 */}
            <rect x="78" y="85" width="32" height="15" fill="#ffffff" />
            <rect x="78" y="85" width="9" height="15" fill="#e2e8f0" />

            {/* Red Stripe 2 */}
            <rect x="80" y="70" width="28" height="15" fill="#ef4444" />
            <rect x="80" y="70" width="8" height="15" fill="#dc2626" />

            {/* White Stripe 2 */}
            <rect x="82" y="56" width="24" height="14" fill="#ffffff" />
            <rect x="82" y="56" width="7" height="14" fill="#e2e8f0" />

            {/* Lighthouse Balcony Platform */}
            <rect x="78" y="52" width="32" height="4" rx="1.5" fill="#1e293b" />

            {/* Glass Beacon Lantern Room */}
            <rect x="82" y="40" width="24" height="12" rx="1.5" fill="#0f172a" />
            {/* Glowing Golden Light */}
            <rect x="84" y="41" width="20" height="10" rx="1.5" fill="#fef08a" />
            <circle cx="94" cy="46" r="18" fill="url(#lighthouseGlow)" />

            {/* Red Conical/Pyramidal Roof with Spire */}
            <polygon points="78,40 94,22 110,40" fill="#dc2626" />
            <polygon points="78,40 94,22 94,40" fill="#ef4444" />
            {/* Roof Spire Tip */}
            <rect x="93" y="16" width="2.5" height="7" rx="0.5" fill="#fef08a" />
          </g>

          {/* White Water Foam breaking against Left Island rocks */}
          <rect x="14" y="184" width="22" height="5" rx="1.5" fill="#ffffff" />
          <rect x="78" y="172" width="28" height="5" rx="1.5" fill="#ffffff" />
          <rect x="138" y="178" width="26" height="5" rx="1.5" fill="#ffffff" />
        </g>

        {/* =========================================================================
            BOTTOM RIGHT: STEPPED VOXEL ROCKY ISLAND + GREEN GRASS PLATEAU
           ========================================================================= */}
        <g id="rightIsland">
          {/* Base underwater rocks */}
          <rect x="1250" y="176" width="180" height="44" rx="2" fill="#334155" />
          <rect x="1350" y="186" width="74" height="34" rx="2" fill="#1e293b" />

          {/* Stepped rock tiers */}
          <rect x="1274" y="156" width="144" height="28" rx="2" fill="#475569" />
          <rect x="1298" y="138" width="110" height="24" rx="2" fill="#64748b" />
          <rect x="1320" y="120" width="76" height="22" rx="2" fill="#64748b" />

          {/* Vibrant Green Minecraft Grass Plateau */}
          <rect x="1318" y="115" width="80" height="8" rx="2" fill="#84cc16" />
          <rect x="1320" y="120" width="16" height="5" rx="1.5" fill="#65a30d" />
          <rect x="1360" y="120" width="18" height="5" rx="1.5" fill="#65a30d" />

          {/* Secondary lower grass step */}
          <rect x="1284" y="152" width="30" height="6" rx="1.5" fill="#84cc16" />
          <rect x="1396" y="152" width="22" height="6" rx="1.5" fill="#84cc16" />

          {/* White Water Foam breaking on Right Island rocks */}
          <rect x="1256" y="182" width="30" height="5" rx="1.5" fill="#ffffff" />
          <rect x="1330" y="176" width="32" height="5" rx="1.5" fill="#ffffff" />
          <rect x="1404" y="182" width="26" height="5" rx="1.5" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}
