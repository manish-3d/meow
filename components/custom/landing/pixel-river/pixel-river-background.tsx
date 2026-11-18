"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { WaterEffects } from "./water-effects";
import { PixelCatBot } from "./pixel-cat-bot";

interface PixelRiverBackgroundProps {
  children: React.ReactNode;
}

export function PixelRiverBackground({ children }: PixelRiverBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction states for Left and Right river zones
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);

  // Subtle cursor parallax offsets
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Handle subtle cursor movement and left/right zone detection
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Only track when cursor is within hero vertical bounds
      if (e.clientY < rect.top || e.clientY > rect.bottom) {
        setLeftActive(false);
        setRightActive(false);
        setOffset({ x: 0, y: 0 });
        return;
      }

      // Parallax offset
      const normX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
      setOffset({
        x: normX * 4,
        y: normY * 3,
      });

      // River zone detection
      const percentX = (e.clientX - rect.left) / rect.width;
      if (percentX >= 0 && percentX < 0.34) {
        setLeftActive(true);
        setRightActive(false);
      } else if (percentX > 0.66 && percentX <= 1) {
        setRightActive(true);
        setLeftActive(false);
      } else {
        setLeftActive(false);
        setRightActive(false);
      }
    };

    const handlePointerLeave = () => {
      setLeftActive(false);
      setRightActive(false);
      setOffset({ x: 0, y: 0 });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
    >
      {/* --- 1. BASE RIVER BACKGROUND SVG LAYER --- */}
      <div
        className="absolute inset-0 size-full pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.02)`,
        }}
      >
        <img
          src="/meow-bot-river-shape.svg"
          alt="Meow Bot Pixel River Landscape"
          className="absolute inset-0 size-full object-cover object-bottom select-none pointer-events-none"
        />

        {/* --- 2. AMBIENT WATER & CLOUD EFFECTS --- */}
        <WaterEffects />

        {/* --- 3. LEFT RIVER CAT BOTS (Pop up along left pixel water) --- */}
        <PixelCatBot
          personality="curious"
          isEmerged={true}
          x={3.5}
          y={44}
          scale={1.05}
          staggerMs={0}
        />
        <PixelCatBot
          personality="swimmer"
          isEmerged={true}
          x={7.5}
          y={56}
          scale={0.95}
          staggerMs={120}
        />
        <PixelCatBot
          personality="happy"
          isEmerged={true}
          x={15.5}
          y={80}
          scale={1.0}
          staggerMs={240}
        />
        <PixelCatBot
          personality="researcher"
          isEmerged={true}
          x={25}
          y={88}
          scale={1.05}
          staggerMs={360}
        />

        {/* --- 4. RIGHT RIVER CAT BOTS (Pop up along right pixel water) --- */}
        <PixelCatBot
          personality="builder"
          isEmerged={true}
          x={95}
          y={48}
          scale={1.05}
          staggerMs={0}
        />
        <PixelCatBot
          personality="sleepy"
          isEmerged={true}
          x={91.5}
          y={62}
          scale={1.0}
          staggerMs={140}
        />
        <PixelCatBot
          personality="happy"
          isEmerged={true}
          x={85}
          y={76}
          scale={1.05}
          staggerMs={260}
        />
        <PixelCatBot
          personality="curious"
          isEmerged={true}
          x={76}
          y={88}
          scale={0.95}
          staggerMs={380}
        />
      </div>

      {/* --- 5. TOUCH & HOVER INTERACTION ZONES (Transparent overlays) --- */}
      {/* Left River Interactive Zone */}
      <div
        className="absolute top-0 left-0 w-[35%] h-full z-20 cursor-pointer"
        onMouseEnter={() => setLeftActive(true)}
        onTouchStart={() => setLeftActive((prev) => !prev)}
        aria-label="Interact with left river bots"
      />

      {/* Right River Interactive Zone */}
      <div
        className="absolute top-0 right-0 w-[35%] h-full z-20 cursor-pointer"
        onMouseEnter={() => setRightActive(true)}
        onTouchStart={() => setRightActive((prev) => !prev)}
        aria-label="Interact with right river bots"
      />

      {/* --- 6. HERO CONTENT (Sitting in the clean center clearing) --- */}
      <div className="relative z-30 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
