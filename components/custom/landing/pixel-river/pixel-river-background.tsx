"use client";

import React, { useState, useEffect, useRef } from "react";
import { WaterEffects } from "./water-effects";
import { PixelCatBot } from "./pixel-cat-bot";

interface PixelRiverBackgroundProps {
  children: React.ReactNode;
}

export function PixelRiverBackground({ children }: PixelRiverBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle cursor parallax offsets
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Handle subtle ambient parallax
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (e.clientY < rect.top - 60 || e.clientY > rect.bottom + 60) {
        setOffset({ x: 0, y: 0 });
        return;
      }

      const normX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
      setOffset({
        x: normX * 4,
        y: normY * 3,
      });
    };

    const handlePointerLeave = () => {
      setOffset({ x: 0, y: 0 });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
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

        {/* --- 2. AMBIENT WATER EFFECTS --- */}
        <WaterEffects />

        {/* --- 3. LEFT-MOST BUILDER BOT (Always present, perfectly mirrored opposite right bot) --- */}
        <PixelCatBot
          personality="builder"
          isEmerged={true}
          x={5}
          y={48}
          scale={1.05}
          staggerMs={0}
        />

        {/* --- 4. RIGHT-MOST BUILDER BOT (Always present) --- */}
        <PixelCatBot
          personality="builder"
          isEmerged={true}
          x={95}
          y={48}
          scale={1.05}
          staggerMs={0}
        />
      </div>

      {/* --- 5. HERO CONTENT --- */}
      <div className="relative z-30 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
