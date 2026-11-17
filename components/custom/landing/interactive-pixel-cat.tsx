"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export function InteractivePixelCat({ size = 56 }: { size?: number }) {
  const catRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!catRef.current) return;
      const rect = catRef.current.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - catCenterX;
      const deltaY = e.clientY - catCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance === 0) return;

      // Max eye travel distance in pixels (scaled)
      const maxEyeTravel = 2.5;
      const normX = (deltaX / Math.max(distance, 1)) * maxEyeTravel;
      const normY = (deltaY / Math.max(distance, 1)) * maxEyeTravel;

      // Head tilt up to 6 degrees towards cursor
      const tilt = Math.max(-8, Math.min(8, (deltaX / window.innerWidth) * 16));

      setEyeOffset({ x: normX, y: normY });
      setHeadTilt(tilt);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Occasional random blink / wink
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 220);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const newHeart = {
      id: Date.now(),
      x: (Math.random() - 0.5) * 20,
      y: -20 - Math.random() * 20,
    };
    setHearts((prev) => [...prev, newHeart]);
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 350);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  return (
    <div
      ref={catRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-flex items-center justify-center cursor-pointer select-none align-middle mx-2 sm:mx-3 group"
      style={{ width: size, height: size }}
      title="Click me! I track your mouse pointer :3"
    >
      {/* Floating Hearts upon click */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -40, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute text-sm pointer-events-none z-30 font-mono"
            style={{ left: `calc(50% + ${h.x}px)` }}
          >
            ❤️
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Retro Pixel / Minecraft Cat Face (SVG pixel matrix) */}
      <motion.div
        animate={{
          rotate: headTilt,
          scaleY: isHovered ? 1.08 : [1, 1.03, 1],
        }}
        transition={{
          rotate: { type: "spring", stiffness: 200, damping: 25 },
          scaleY: isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
        }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 28 28"
          width={size}
          height={size}
          className="drop-shadow-sm overflow-visible"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Main Cat Head Body - Vibrant Lilac / Dusk Purple (#7C5CFC) */}
          {/* Ears */}
          <rect x="3" y="2" width="5" height="5" fill="#7C5CFC" />
          <rect x="4" y="3" width="3" height="3" fill="#9B82FD" />
          <rect x="20" y="2" width="5" height="5" fill="#7C5CFC" />
          <rect x="21" y="3" width="3" height="3" fill="#9B82FD" />

          {/* Crown & Head Block */}
          <rect x="3" y="6" width="22" height="18" fill="#7C5CFC" rx="1" />
          <rect x="4" y="7" width="20" height="16" fill="#886BFF" />

          {/* Forehead Highlights */}
          <rect x="12" y="7" width="4" height="2" fill="#A894FF" />

          {/* Cheeks */}
          <rect x="2" y="11" width="2" height="8" fill="#7C5CFC" />
          <rect x="24" y="11" width="2" height="8" fill="#7C5CFC" />

          {/* Whites of the Eyes */}
          {isWinking ? (
            <>
              {/* Left Eye closed in wink */}
              <rect x="6" y="13" width="5" height="2" fill="#241442" />
              {/* Right Eye open */}
              <rect x="17" y="11" width="5" height="5" fill="#FFFFFF" />
            </>
          ) : (
            <>
              {/* Left Eye Sclera */}
              <rect x="6" y="11" width="5" height="5" fill="#FFFFFF" />
              {/* Right Eye Sclera */}
              <rect x="17" y="11" width="5" height="5" fill="#FFFFFF" />
            </>
          )}

          {/* Cursor-Tracking Pupils */}
          {!isWinking && (
            <g
              style={{
                transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                transition: "transform 0.04s ease-out",
              }}
            >
              {/* Left Pupil (Dark Charcoal) */}
              <rect x="7.5" y="12" width="2.5" height="3" fill="#181028" />
              {/* Left Pupil Highlight */}
              <rect x="7.5" y="12" width="1" height="1" fill="#FFFFFF" />

              {/* Right Pupil (Dark Charcoal) */}
              <rect x="18.5" y="12" width="2.5" height="3" fill="#181028" />
              {/* Right Pupil Highlight */}
              <rect x="18.5" y="12" width="1" height="1" fill="#FFFFFF" />
            </g>
          )}

          {/* Cute Pink Pixel Nose */}
          <rect x="13" y="17" width="2" height="2" fill="#FFA5C3" />

          {/* Cat Whiskers */}
          <rect x="1" y="15" width="3" height="1" fill="#5C3FC0" />
          <rect x="1" y="17" width="3" height="1" fill="#5C3FC0" />
          <rect x="24" y="15" width="3" height="1" fill="#5C3FC0" />
          <rect x="24" y="17" width="3" height="1" fill="#5C3FC0" />

          {/* Cute Cat Mouth */}
          <rect x="11" y="19" width="2" height="1" fill="#3D207A" />
          <rect x="13" y="20" width="2" height="1" fill="#3D207A" />
          <rect x="15" y="19" width="2" height="1" fill="#3D207A" />
        </svg>

        {/* Purring / Alert Indicator on hover */}
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-3 -right-2 bg-emerald-400 text-black text-[9px] font-mono px-1 rounded-full font-bold shadow-xs select-none"
          >
            purr~
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}