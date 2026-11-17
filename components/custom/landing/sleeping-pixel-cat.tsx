"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SleepingPixelCat() {
  const [isAwake, setIsAwake] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsAwake(true)}
      onMouseLeave={() => setIsAwake(false)}
      className="relative inline-block cursor-pointer select-none"
      title={isAwake ? "Meow! I woke up!" : "Zzz... catnapping while your bots work"}
    >
      {/* Floating Animated 'z z z' particles */}
      {!isAwake && (
        <div className="absolute -top-6 right-2 pointer-events-none">
          <motion.span
            animate={{
              y: [-2, -18],
              x: [0, 6],
              opacity: [0, 0.9, 0],
              scale: [0.7, 1.1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute text-neutral-500 font-mono text-xs font-bold"
          >
            z
          </motion.span>

          <motion.span
            animate={{
              y: [-2, -26],
              x: [2, 12],
              opacity: [0, 0.8, 0],
              scale: [0.6, 1.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 0.8,
              ease: "easeOut",
            }}
            className="absolute text-neutral-500 font-mono text-sm font-bold"
          >
            z
          </motion.span>

          <motion.span
            animate={{
              y: [-2, -32],
              x: [4, 18],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.3],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: 1.6,
              ease: "easeOut",
            }}
            className="absolute text-neutral-400 font-mono text-base font-bold"
          >
            Z
          </motion.span>
        </div>
      )}

      {/* Sleeping / Awake Cat SVG (Tabby Orange / Amber Pixel Style) */}
      <motion.div
        animate={{
          scaleY: isAwake ? 1.05 : [1, 1.04, 1],
          y: isAwake ? -2 : 0,
        }}
        transition={{
          scaleY: isAwake ? { duration: 0.15 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="w-16 h-12"
      >
        <svg
          viewBox="0 0 32 24"
          width="64"
          height="48"
          style={{ shapeRendering: "crispEdges" }}
          className="overflow-visible drop-shadow-sm"
        >
          {/* Tail wrapped around */}
          <rect x="2" y="16" width="3" height="4" fill="#E67E22" />
          <rect x="3" y="14" width="2" height="3" fill="#D35400" />

          {/* Body */}
          <rect x="4" y="10" width="18" height="10" fill="#F39C12" rx="2" />
          <rect x="6" y="8" width="14" height="4" fill="#F39C12" />
          {/* Tabby Stripes on Back */}
          <rect x="8" y="9" width="2" height="6" fill="#D35400" />
          <rect x="13" y="9" width="2" height="6" fill="#D35400" />
          <rect x="18" y="10" width="2" height="5" fill="#D35400" />

          {/* Sleeping Paws */}
          <rect x="8" y="19" width="4" height="2" fill="#FDEBD0" />
          <rect x="16" y="19" width="4" height="2" fill="#FDEBD0" />

          {/* Head */}
          <rect x="18" y="6" width="11" height="11" fill="#F39C12" rx="1" />
          <rect x="19" y="5" width="9" height="3" fill="#F39C12" />

          {/* Ears */}
          <rect x="19" y="2" width="3" height="4" fill="#E67E22" />
          <rect x="20" y="3" width="1" height="2" fill="#FADBD8" />
          <rect x="26" y="2" width="3" height="4" fill="#E67E22" />
          <rect x="27" y="3" width="1" height="2" fill="#FADBD8" />

          {/* Face: Eyes */}
          {isAwake ? (
            <>
              {/* Alert Open Eyes */}
              <rect x="21" y="9" width="2" height="2.5" fill="#1A1A1A" />
              <rect x="21" y="9" width="1" height="1" fill="#FFFFFF" />
              <rect x="26" y="9" width="2" height="2.5" fill="#1A1A1A" />
              <rect x="26" y="9" width="1" height="1" fill="#FFFFFF" />
            </>
          ) : (
            <>
              {/* Peaceful Closed Sleeping Slits ^ ^ */}
              <rect x="21" y="10" width="2" height="1" fill="#873600" />
              <rect x="20" y="11" width="1" height="1" fill="#873600" />
              <rect x="26" y="10" width="2" height="1" fill="#873600" />
              <rect x="25" y="11" width="1" height="1" fill="#873600" />
            </>
          )}

          {/* Pink Nose */}
          <rect x="24" y="12" width="1.5" height="1" fill="#F1948A" />

          {/* Whiskers */}
          <rect x="18" y="12" width="2" height="0.8" fill="#D35400" />
          <rect x="28" y="12" width="2" height="0.8" fill="#D35400" />
        </svg>
      </motion.div>
    </div>
  );
}