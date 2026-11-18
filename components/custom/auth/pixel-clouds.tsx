"use client";

import React from "react";
import { motion } from "motion/react";

export function PixelClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none z-0">
      {/* --- TOP-LEFT PASTEL VOXEL CLOUD --- */}
      <motion.div
        animate={{
          x: [-6, 6, -6],
          y: [0, -8, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 7.5,
          ease: "easeInOut",
        }}
        className="absolute top-10 sm:top-14 left-6 sm:left-14 lg:left-24"
      >
        <svg
          width="130"
          height="80"
          viewBox="0 0 130 80"
          className="overflow-visible drop-shadow-[0_12px_24px_rgba(56,189,248,0.14)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cloud Soft Shadow */}
          <ellipse cx="65" cy="72" rx="46" ry="7" fill="#38bdf8" opacity="0.12" />

          {/* Stepped Voxel Cloud Blocks */}
          {/* Bottom Layer */}
          <rect x="20" y="44" width="90" height="20" rx="3" fill="#e2e8f0" />
          <rect x="20" y="42" width="90" height="18" rx="3" fill="#f8fafc" />

          {/* Middle Layer */}
          <rect x="34" y="28" width="62" height="20" rx="3" fill="#e2e8f0" />
          <rect x="34" y="26" width="62" height="18" rx="3" fill="#ffffff" />

          {/* Top Layer */}
          <rect x="52" y="14" width="30" height="16" rx="2" fill="#e2e8f0" />
          <rect x="52" y="12" width="30" height="14" rx="2" fill="#ffffff" />

          {/* Subtle Side Depth Voxels */}
          <rect x="14" y="48" width="10" height="12" rx="2" fill="#f1f5f9" />
          <rect x="106" y="48" width="12" height="12" rx="2" fill="#f1f5f9" />
        </svg>
      </motion.div>

      {/* --- TOP-RIGHT PASTEL VOXEL CLOUD --- */}
      <motion.div
        animate={{
          x: [6, -6, 6],
          y: [-4, 6, -4],
        }}
        transition={{
          repeat: Infinity,
          duration: 8.8,
          ease: "easeInOut",
        }}
        className="absolute top-12 sm:top-16 right-6 sm:right-14 lg:right-28"
      >
        <svg
          width="120"
          height="75"
          viewBox="0 0 120 75"
          className="overflow-visible drop-shadow-[0_12px_24px_rgba(56,189,248,0.14)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cloud Soft Shadow */}
          <ellipse cx="60" cy="68" rx="42" ry="6" fill="#38bdf8" opacity="0.12" />

          {/* Stepped Voxel Cloud Blocks */}
          {/* Bottom Layer */}
          <rect x="18" y="40" width="84" height="18" rx="3" fill="#e2e8f0" />
          <rect x="18" y="38" width="84" height="16" rx="3" fill="#f8fafc" />

          {/* Middle Layer */}
          <rect x="32" y="26" width="56" height="18" rx="3" fill="#e2e8f0" />
          <rect x="32" y="24" width="56" height="16" rx="3" fill="#ffffff" />

          {/* Top Layer */}
          <rect x="46" y="14" width="28" height="14" rx="2" fill="#e2e8f0" />
          <rect x="46" y="12" width="28" height="12" rx="2" fill="#ffffff" />

          {/* Subtle Side Depth Voxels */}
          <rect x="12" y="44" width="10" height="10" rx="2" fill="#f1f5f9" />
          <rect x="98" y="44" width="10" height="10" rx="2" fill="#f1f5f9" />
        </svg>
      </motion.div>
    </div>
  );
}
