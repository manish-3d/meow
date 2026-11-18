"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface CatBotCharacterProps {
  isHappy?: boolean;
}

export function CatBotCharacter({ isHappy = false }: CatBotCharacterProps) {
  const catRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // --- Interactive Eye Tracking ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!catRef.current) return;
      const rect = catRef.current.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height * 0.55;

      const deltaX = e.clientX - catCenterX;
      const deltaY = e.clientY - catCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance === 0) {
        setEyeOffset({ x: 0, y: 0 });
        setHeadTilt(0);
        return;
      }

      // Smooth bounded travel range: ±5.5px horizontally, ±4px vertically
      const maxTravelX = 5.5;
      const maxTravelY = 4.0;
      const factorX = Math.max(-1, Math.min(1, deltaX / (window.innerWidth * 0.4)));
      const factorY = Math.max(-1, Math.min(1, deltaY / (window.innerHeight * 0.4)));

      const targetX = factorX * maxTravelX;
      const targetY = factorY * maxTravelY;

      // Subtle organic head tilt: ±3 degrees towards cursor
      const targetTilt = factorX * 3.0;

      setEyeOffset({ x: targetX, y: targetY });
      setHeadTilt(targetTilt);
    };

    const handleMouseLeave = () => {
      setEyeOffset({ x: 0, y: 0 });
      setHeadTilt(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // --- Natural Periodic Blinking ---
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const interval = setInterval(() => {
      // 75% chance to blink naturally every 3.6-5.2 seconds
      if (Math.random() > 0.25) {
        setIsBlinking(true);
        blinkTimeout = setTimeout(() => {
          setIsBlinking(false);
        }, 150);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      if (blinkTimeout) clearTimeout(blinkTimeout);
    };
  }, []);

  return (
    <div
      ref={catRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center select-none z-20 pointer-events-auto"
      style={{ width: "380px", height: "230px" }}
    >
      <motion.div
        animate={{
          y: isHappy ? -10 : isHovered ? -4 : [0, -3, 0],
          rotate: isHappy ? [0, -2.5, 2.5, 0] : headTilt,
        }}
        transition={{
          y: isHappy
            ? { type: "spring", stiffness: 320, damping: 16 }
            : isHovered
            ? { duration: 0.2 }
            : { repeat: Infinity, duration: 3.8, ease: "easeInOut" },
          rotate: { type: "spring", stiffness: 220, damping: 22 },
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 380 240"
          className="w-full h-full overflow-visible drop-shadow-[0_16px_32px_rgba(56,189,248,0.18)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for soft 3D gradients and shadows */}
          <defs>
            {/* Ambient shadow beneath cat onto card */}
            <radialGradient id="catCardShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>

            {/* Sky Blue Headphone Gradients */}
            <linearGradient id="hpMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="45%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>

            <linearGradient id="hpSide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="hpTop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>

            {/* Head Face 3D Shading */}
            <linearGradient id="headFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="90%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>

            {/* Soft Paw Gradient */}
            <linearGradient id="pawGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>

          {/* --- AMBIENT UNDER-CAT SHADOW --- */}
          <ellipse cx="190" cy="224" rx="110" ry="12" fill="url(#catCardShadow)" />

          {/* --- HEADBAND ARCH (Over top of head) --- */}
          <path
            d="M 98 100 C 98 40, 282 40, 282 100"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 106 96 C 106 46, 274 46, 274 96"
            stroke="#334155"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* --- 1. EARS (White voxel blocks with pink inner ear) --- */}
          {/* Left Ear */}
          <g>
            {/* Outer Ear White Base */}
            <polygon points="112,78 130,28 162,78" fill="#ffffff" />
            {/* 3D bevel side facet */}
            <polygon points="112,78 130,28 122,32 106,78" fill="#f1f5f9" />
            {/* Inner Ear Soft Pastel Pink */}
            <polygon points="120,76 132,38 154,76" fill="#fbcfe8" />
            <polygon points="124,76 133,46 148,76" fill="#f472b6" opacity="0.65" />
          </g>

          {/* Right Ear */}
          <g>
            {/* Outer Ear White Base */}
            <polygon points="218,78 250,28 268,78" fill="#ffffff" />
            {/* 3D bevel side facet */}
            <polygon points="268,78 250,28 258,32 274,78" fill="#e2e8f0" />
            {/* Inner Ear Soft Pastel Pink */}
            <polygon points="226,76 248,38 260,76" fill="#fbcfe8" />
            <polygon points="232,76 247,46 256,76" fill="#f472b6" opacity="0.65" />
          </g>

          {/* --- 2. HEAD CUBIC VOXEL BODY --- */}
          {/* Head Top 3D Isometric Plane */}
          <polygon
            points="104,78 132,58 248,58 276,78"
            fill="#ffffff"
          />

          {/* Head Right 3D Shaded Plane */}
          <polygon
            points="276,78 248,58 248,172 276,192"
            fill="#e2e8f0"
            opacity="0.9"
          />

          {/* Head Front Face Block */}
          <rect
            x="104"
            y="78"
            width="172"
            height="124"
            rx="20"
            fill="url(#headFront)"
            stroke="#f1f5f9"
            strokeWidth="1.5"
          />

          {/* --- 3. SKY BLUE HEADPHONES (Plain Sky-Blue, No Symbols) --- */}
          {/* Left Headphone Ear Cup */}
          <g>
            {/* Connecting Inner Pad */}
            <rect x="86" y="96" width="22" height="60" rx="8" fill="#0369a1" />
            {/* Main Outer Sky-Blue Block */}
            <rect x="68" y="88" width="28" height="76" rx="12" fill="url(#hpMain)" />
            {/* Top highlight facet */}
            <rect x="71" y="90" width="22" height="11" rx="5" fill="url(#hpTop)" />
            {/* Bottom shadow facet */}
            <rect x="68" y="142" width="28" height="22" rx="10" fill="url(#hpSide)" />
            {/* Center ear cushion inset */}
            <rect x="74" y="104" width="16" height="44" rx="7" fill="#0284c7" />
          </g>

          {/* Right Headphone Ear Cup */}
          <g>
            {/* Connecting Inner Pad */}
            <rect x="272" y="96" width="22" height="60" rx="8" fill="#0369a1" />
            {/* Main Outer Sky-Blue Block */}
            <rect x="284" y="88" width="28" height="76" rx="12" fill="url(#hpMain)" />
            {/* Top highlight facet */}
            <rect x="287" y="90" width="22" height="11" rx="5" fill="url(#hpTop)" />
            {/* Bottom shadow facet */}
            <rect x="284" y="142" width="28" height="22" rx="10" fill="url(#hpSide)" />
            {/* Center ear cushion inset */}
            <rect x="290" y="104" width="16" height="44" rx="7" fill="#0284c7" />
          </g>

          {/* --- 4. CHEEK WHISKERS (Pixel Stripes) --- */}
          {/* Left Whiskers */}
          <rect x="90" y="140" width="18" height="5.5" rx="2" fill="#1e293b" />
          <rect x="90" y="153" width="18" height="5.5" rx="2" fill="#1e293b" />

          {/* Right Whiskers */}
          <rect x="272" y="140" width="18" height="5.5" rx="2" fill="#1e293b" />
          <rect x="272" y="153" width="18" height="5.5" rx="2" fill="#1e293b" />

          {/* --- 5. EYES (Interactive Cursor Following + Blinking) --- */}
          {/* Left Eye */}
          <g transform="translate(138, 134)">
            {isBlinking ? (
              // Blinking state: cute closed eye slit
              <rect x="-13" y="0" width="26" height="4.5" rx="2.25" fill="#0f172a" />
            ) : isHappy ? (
              // Happy state: curved happy eye arc ^
              <path
                d="M -13 5 Q 0 -8 13 5"
                stroke="#0f172a"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Normal state: Black rounded square eye + cursor-tracking pupil with white highlights
              <>
                <rect
                  x="-13"
                  y="-13"
                  width="26"
                  height="26"
                  rx="6"
                  fill="#09090b"
                />
                {/* Pupil and glints that smoothly follow cursor */}
                <g
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transition: "transform 0.05s ease-out",
                  }}
                >
                  {/* Primary Crisp White Glint (Top-Right) */}
                  <rect
                    x="1"
                    y="-10"
                    width="8.5"
                    height="8.5"
                    rx="2"
                    fill="#ffffff"
                  />
                  {/* Secondary Subtle Glint (Bottom-Left) */}
                  <rect
                    x="-8.5"
                    y="2.5"
                    width="4.5"
                    height="4.5"
                    rx="1"
                    fill="#ffffff"
                    opacity="0.85"
                  />
                </g>
              </>
            )}
          </g>

          {/* Right Eye */}
          <g transform="translate(242, 134)">
            {isBlinking ? (
              // Blinking state: cute closed eye slit
              <rect x="-13" y="0" width="26" height="4.5" rx="2.25" fill="#0f172a" />
            ) : isHappy ? (
              // Happy state: curved happy eye arc ^
              <path
                d="M -13 5 Q 0 -8 13 5"
                stroke="#0f172a"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Normal state: Black rounded square eye + cursor-tracking pupil with white highlights
              <>
                <rect
                  x="-13"
                  y="-13"
                  width="26"
                  height="26"
                  rx="6"
                  fill="#09090b"
                />
                {/* Pupil and glints that smoothly follow cursor */}
                <g
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transition: "transform 0.05s ease-out",
                  }}
                >
                  {/* Primary Crisp White Glint (Top-Right) */}
                  <rect
                    x="1"
                    y="-10"
                    width="8.5"
                    height="8.5"
                    rx="2"
                    fill="#ffffff"
                  />
                  {/* Secondary Subtle Glint (Bottom-Left) */}
                  <rect
                    x="-8.5"
                    y="2.5"
                    width="4.5"
                    height="4.5"
                    rx="1"
                    fill="#ffffff"
                    opacity="0.85"
                  />
                </g>
              </>
            )}
          </g>

          {/* --- 6. CUTE NOSE & MOUTH --- */}
          {/* Nose */}
          <polygon
            points="185,152 195,152 190,158"
            fill="#0f172a"
          />

          {/* Cute Cat 'w' Mouth */}
          <path
            d="M 180 161 C 181 166, 189 166, 190 161 C 191 166, 199 166, 200 161"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* --- 7. WHITE PAWS DRAPED OVER LOGIN CARD --- */}
          {/* Left Paw */}
          <g>
            {/* Paw cast shadow onto card rim */}
            <ellipse cx="140" cy="222" rx="22" ry="5" fill="#94a3b8" opacity="0.45" />
            {/* Main Paw Block */}
            <rect
              x="122"
              y="192"
              width="36"
              height="28"
              rx="11"
              fill="url(#pawGrad)"
              stroke="#f1f5f9"
              strokeWidth="1.2"
            />
            {/* Toe Crease Dividers */}
            <line x1="134" y1="200" x2="134" y2="216" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="146" y1="200" x2="146" y2="216" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Right Paw */}
          <g>
            {/* Paw cast shadow onto card rim */}
            <ellipse cx="240" cy="222" rx="22" ry="5" fill="#94a3b8" opacity="0.45" />
            {/* Main Paw Block */}
            <rect
              x="222"
              y="192"
              width="36"
              height="28"
              rx="11"
              fill="url(#pawGrad)"
              stroke="#f1f5f9"
              strokeWidth="1.2"
            />
            {/* Toe Crease Dividers */}
            <line x1="234" y1="200" x2="234" y2="216" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="246" y1="200" x2="246" y2="216" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
