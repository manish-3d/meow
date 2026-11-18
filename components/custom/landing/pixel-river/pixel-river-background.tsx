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

  // Handle subtle cursor movement for living wallpaper parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Check if cursor is within hero container
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Gentle sub-pixel movement (max ±5px)
      setOffset({
        x: normX * 4,
        y: normY * 3,
      });

      // Zone detection based on horizontal cursor percentage
      const percentX = (e.clientX - rect.left) / rect.width;
      if (percentX < 0.35) {
        setLeftActive(true);
      } else if (percentX > 0.65) {
        setRightActive(true);
      } else {
        setLeftActive(false);
        setRightActive(false);
      }
    };

    const handleMouseLeave = () => {
      setLeftActive(false);
      setRightActive(false);
      setOffset({ x: 0, y: 0 });
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener("mousemove", handleMouseMove, { passive: true });
      node.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (node) {
        node.removeEventListener("mousemove", handleMouseMove);
        node.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
    >
      {/* --- 1. BASE RIVER BACKGROUND IMAGE LAYER --- */}
      <div
        className="absolute inset-0 size-full pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.02)`,
        }}
      >
        <Image
          src="/hero-pixel-river-bg.png"
          alt="Meow Bot Pixel River Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom sm:object-center select-none"
        />

        {/* --- 2. AMBIENT WATER & CLOUD EFFECTS --- */}
        <WaterEffects />

        {/* --- 3. LEFT RIVER CAT BOTS (Pop up along left pixel water) --- */}
        <PixelCatBot
          personality="curious"
          isEmerged={leftActive}
          x={6}
          y={52}
          scale={1.05}
          staggerMs={0}
        />
        <PixelCatBot
          personality="swimmer"
          isEmerged={leftActive}
          x={10}
          y={64}
          scale={0.95}
          staggerMs={120}
        />
        <PixelCatBot
          personality="happy"
          isEmerged={leftActive}
          x={18}
          y={86}
          scale={1.0}
          staggerMs={240}
        />
        <PixelCatBot
          personality="researcher"
          isEmerged={leftActive}
          x={27}
          y={92}
          scale={1.05}
          staggerMs={360}
        />

        {/* --- 4. RIGHT RIVER CAT BOTS (Pop up along right pixel water) --- */}
        <PixelCatBot
          personality="builder"
          isEmerged={rightActive}
          x={93}
          y={54}
          scale={1.05}
          staggerMs={0}
        />
        <PixelCatBot
          personality="sleepy"
          isEmerged={rightActive}
          x={90}
          y={64}
          scale={1.0}
          staggerMs={140}
        />
        <PixelCatBot
          personality="happy"
          isEmerged={rightActive}
          x={84}
          y={79}
          scale={1.05}
          staggerMs={260}
        />
        <PixelCatBot
          personality="curious"
          isEmerged={rightActive}
          x={75}
          y={91}
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
