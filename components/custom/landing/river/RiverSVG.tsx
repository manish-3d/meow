"use client";

import React from "react";
import {
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  RIVER_WATER_PATH,
  INNER_GRASS_BANK_PATH,
  INNER_DIRT_BANK_PATH,
  TOP_LEFT_CLIFF,
  TOP_LEFT_DIRT,
  TOP_RIGHT_CLIFF,
  TOP_RIGHT_DIRT,
  BOTTOM_LEFT_CLIFF,
  BOTTOM_LEFT_DIRT,
  BOTTOM_RIGHT_CLIFF,
  BOTTOM_RIGHT_DIRT,
} from "./river-paths";

export function RiverSVG() {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYBottom slice"
      className="absolute inset-0 size-full pointer-events-none select-none"
      shapeRendering="crispEdges"
    >
      <defs>
        {/* Deep Tropical River Water Gradient */}
        <linearGradient id="riverWaterGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#46c8ed" />
          <stop offset="45%" stop-color="#1eafe2" />
          <stop offset="100%" stop-color="#0a82c4" />
        </linearGradient>

        {/* Grass Top Gradient */}
        <linearGradient id="grassGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7cd624" />
          <stop offset="100%" stop-color="#5eb41a" />
        </linearGradient>

        {/* Dirt / Soil Gradient */}
        <linearGradient id="dirtGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#72461c" />
          <stop offset="100%" stop-color="#4e2c0e" />
        </linearGradient>

        {/* Waterline Foam Stroke */}
        <linearGradient id="waterlineFoam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#d4f6ff" stop-opacity="0.75" />
        </linearGradient>
      </defs>

      {/* ── 1. CONTINUOUS WATER CHANNEL BODY ── */}
      <path d={RIVER_WATER_PATH} fill="url(#riverWaterGradient)" />

      {/* ── 2. WATER SHIMMER STREAKS & CAUSTIC PIXELS ── */}
      <g opacity="0.75">
        <rect x="45" y="320" width="22" height="5" fill="#ffffff" opacity="0.7" />
        <rect x="75" y="380" width="30" height="6" fill="#e2f8ff" opacity="0.6" />
        <rect x="110" y="440" width="26" height="5" fill="#ffffff" opacity="0.8" />
        <rect x="180" y="520" width="34" height="6" fill="#c4f2fc" opacity="0.6" />
        <rect x="230" y="600" width="40" height="6" fill="#ffffff" opacity="0.7" />

        <rect x="360" y="760" width="55" height="7" fill="#ffffff" opacity="0.75" />
        <rect x="490" y="800" width="65" height="7" fill="#b9f0fd" opacity="0.65" />
        <rect x="640" y="780" width="50" height="6" fill="#ffffff" opacity="0.8" />
        <rect x="780" y="790" width="60" height="7" fill="#e2f8ff" opacity="0.65" />
        <rect x="910" y="810" width="55" height="7" fill="#ffffff" opacity="0.75" />
        <rect x="1030" y="770" width="48" height="6" fill="#b9f0fd" opacity="0.6" />

        <rect x="1220" y="680" width="38" height="6" fill="#ffffff" opacity="0.7" />
        <rect x="1350" y="590" width="32" height="6" fill="#e2f8ff" opacity="0.65" />
        <rect x="1420" y="480" width="28" height="5" fill="#ffffff" opacity="0.8" />
        <rect x="1490" y="390" width="35" height="6" fill="#c4f2fc" opacity="0.6" />
        <rect x="1560" y="320" width="25" height="5" fill="#ffffff" opacity="0.7" />

        <rect x="130" y="650" width="60" height="8" fill="#086fa9" opacity="0.45" />
        <rect x="420" y="830" width="80" height="9" fill="#086fa9" opacity="0.5" />
        <rect x="720" y="820" width="75" height="9" fill="#086fa9" opacity="0.5" />
        <rect x="980" y="840" width="85" height="9" fill="#086fa9" opacity="0.5" />
        <rect x="1300" y="720" width="65" height="8" fill="#086fa9" opacity="0.45" />
      </g>

      {/* ── 3. FOUR OUTER CORNER CLIFF PLATEAUS (ELEVATED GRASS + DIRT) ── */}
      {/* Top Left Cliff */}
      <g>
        <path d={TOP_LEFT_DIRT} fill="url(#dirtGradient)" />
        <path d={TOP_LEFT_CLIFF} fill="url(#grassGradient)" />
        <rect x="0" y="225" width="45" height="6" fill="#4ea412" />
        <rect x="45" y="175" width="35" height="6" fill="#4ea412" />
        <rect x="80" y="125" width="35" height="6" fill="#4ea412" />
        <rect x="115" y="75" width="35" height="6" fill="#4ea412" />
        <rect x="35" y="-6" width="6" height="10" fill="#7cd624" />
        <rect x="70" y="69" width="6" height="10" fill="#7cd624" />
        <rect x="105" y="119" width="6" height="10" fill="#7cd624" />
      </g>

      {/* Top Right Cliff */}
      <g>
        <path d={TOP_RIGHT_DIRT} fill="url(#dirtGradient)" />
        <path d={TOP_RIGHT_CLIFF} fill="url(#grassGradient)" />
        <rect x="1603" y="225" width="45" height="6" fill="#4ea412" />
        <rect x="1568" y="175" width="35" height="6" fill="#4ea412" />
        <rect x="1533" y="125" width="35" height="6" fill="#4ea412" />
        <rect x="1498" y="75" width="35" height="6" fill="#4ea412" />
        <rect x="1520" y="69" width="6" height="10" fill="#7cd624" />
        <rect x="1555" y="119" width="6" height="10" fill="#7cd624" />
        <rect x="1590" y="169" width="6" height="10" fill="#7cd624" />
      </g>

      {/* Bottom Left Cliff */}
      <g>
        <path d={BOTTOM_LEFT_DIRT} fill="url(#dirtGradient)" />
        <path d={BOTTOM_LEFT_CLIFF} fill="url(#grassGradient)" />
        <rect x="0" y="760" width="50" height="8" fill="#4ea412" />
        <rect x="50" y="800" width="45" height="8" fill="#4ea412" />
        <rect x="95" y="840" width="60" height="8" fill="#4ea412" />
        <rect x="155" y="880" width="70" height="8" fill="#4ea412" />
        <rect x="35" y="752" width="7" height="12" fill="#7cd624" />
        <rect x="80" y="792" width="7" height="12" fill="#7cd624" />
        <rect x="140" y="832" width="7" height="12" fill="#7cd624" />
      </g>

      {/* Bottom Right Cliff */}
      <g>
        <path d={BOTTOM_RIGHT_DIRT} fill="url(#dirtGradient)" />
        <path d={BOTTOM_RIGHT_CLIFF} fill="url(#grassGradient)" />
        <rect x="1598" y="760" width="50" height="8" fill="#4ea412" />
        <rect x="1553" y="800" width="45" height="8" fill="#4ea412" />
        <rect x="1493" y="840" width="60" height="8" fill="#4ea412" />
        <rect x="1423" y="880" width="70" height="8" fill="#4ea412" />
        <rect x="1615" y="752" width="7" height="12" fill="#7cd624" />
        <rect x="1565" y="792" width="7" height="12" fill="#7cd624" />
        <rect x="1465" y="832" width="7" height="12" fill="#7cd624" />
      </g>

      {/* ── 4. INNER RIVERBANK: STEPPED DIRT SOIL STRATA ── */}
      <path d={INNER_DIRT_BANK_PATH} fill="url(#dirtGradient)" />

      {/* ── 5. INNER RIVERBANK: STEPPED MINECRAFT GRASS RIM ── */}
      <path d={INNER_GRASS_BANK_PATH} fill="url(#grassGradient)" />

      {/* Drooping Dark Green Grass Fringe Tabs (Overhanging Dirt) */}
      <g fill="#4ea412">
        <rect x="80" y="280" width="65" height="6" />
        <rect x="145" y="360" width="32" height="6" />
        <rect x="177" y="465" width="64" height="6" />
        <rect x="241" y="580" width="32" height="6" />
        <rect x="273" y="600" width="32" height="6" />
        <rect x="305" y="710" width="113" height="6" />
        <rect x="466" y="738" width="32" height="6" />
        <rect x="530" y="785" width="30" height="6" />
        <rect x="560" y="808" width="100" height="6" />
        <rect x="790" y="785" width="60" height="6" />
        <rect x="850" y="810" width="100" height="6" />
        <rect x="980" y="785" width="65" height="6" />
        <rect x="1045" y="765" width="65" height="6" />
        <rect x="1140" y="710" width="40" height="6" />
        <rect x="1180" y="578" width="70" height="6" />
        <rect x="1310" y="565" width="60" height="6" />
        <rect x="1400" y="440" width="60" height="6" />
        <rect x="1460" y="335" width="70" height="6" />
        <rect x="1530" y="270" width="50" height="6" />
      </g>

      {/* Upright Grass Tufts Sprouting into White Clearing */}
      <g fill="#7cd624">
        <rect x="110" y="272" width="7" height="12" />
        <rect x="160" y="352" width="7" height="12" />
        <rect x="210" y="457" width="7" height="12" />
        <rect x="260" y="572" width="7" height="12" />
        <rect x="350" y="702" width="8" height="12" />
        <rect x="380" y="702" width="6" height="10" />

        <rect x="440" y="697" width="7" height="12" />
        <rect x="480" y="730" width="7" height="12" />
        <rect x="515" y="742" width="6" height="11" />
        <rect x="600" y="800" width="8" height="13" />
        <rect x="630" y="800" width="6" height="10" />
        <rect x="710" y="777" width="8" height="13" />
        <rect x="735" y="777" width="6" height="11" />
        <rect x="820" y="777" width="7" height="12" />
        <rect x="900" y="802" width="8" height="13" />
        <rect x="930" y="802" width="6" height="10" />
        <rect x="1010" y="757" width="7" height="12" />
        <rect x="1075" y="707" width="8" height="12" />

        <rect x="1210" y="570" width="7" height="12" />
        <rect x="1275" y="557" width="7" height="12" />
        <rect x="1340" y="537" width="7" height="12" />
        <rect x="1430" y="412" width="7" height="12" />
        <rect x="1495" y="327" width="7" height="12" />
        <rect x="1555" y="262" width="7" height="12" />
      </g>

      {/* ── 6. WHITE FOAM WATERLINE BORDER (BETWEEN SOIL & WATER) ── */}
      <path
        d={INNER_DIRT_BANK_PATH}
        fill="none"
        stroke="url(#waterlineFoam)"
        strokeWidth="3.5"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
