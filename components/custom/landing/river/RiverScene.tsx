"use client";

import React, { useState, useEffect, useRef } from "react";
import { RiverSVG } from "./RiverSVG";
import { RiverDecorations } from "./RiverDecorations";
import { FloatingBots } from "./FloatingBots";

interface RiverSceneProps {
  children: React.ReactNode;
}

export function RiverScene({ children }: RiverSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Subtle 2.5D cursor parallax offset
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) {
        setOffset({ x: 0, y: 0 });
        return;
      }
      const normX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
      setOffset({
        x: normX * 3.5,
        y: normY * 2.5,
      });
    };

    const handlePointerLeave = () => {
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
      className="relative w-full overflow-hidden select-none bg-white"
    >
      {/* ── 1. BACKGROUND SVG GEOMETRY LAYER ── */}
      <div
        className="absolute inset-0 size-full pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.01)`,
        }}
      >
        {/* River Water, Earth Bank, Grass Rim & Cliff Plateaus */}
        <RiverSVG />

        {/* Water Lilies with Lotus Blossoms, Rocks, and Shoreline Wildflowers */}
        <RiverDecorations />

        {/* 8 Floating Meow Bot Cats with Independent Bobbing & Water Ripples */}
        <FloatingBots />
      </div>

      {/* ── 2. HERO CONTENT LAYER (CLEAN WHITE INTERIOR CLEARING) ── */}
      <div className="relative z-30 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
