"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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

  // Cached face origin center X
  const originXRef = useRef<number | null>(null);

  const updateOriginX = useCallback(() => {
    const faceEl =
      document.getElementById("hero-face-origin") ||
      document.querySelector("[data-face-origin='true']");
    if (faceEl) {
      const faceRect = faceEl.getBoundingClientRect();
      originXRef.current = faceRect.left + faceRect.width / 2;
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      originXRef.current = rect.left + rect.width / 2;
    } else if (typeof window !== "undefined") {
      originXRef.current = window.innerWidth / 2;
    }
  }, []);

  // Handle subtle cursor movement and left/right zone detection based on Face origin
  useEffect(() => {
    updateOriginX();

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Only track when cursor is within hero vertical bounds (with generous buffer)
      if (e.clientY < rect.top - 60 || e.clientY > rect.bottom + 60) {
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

      // Compute Origin X from the Face in "meet [face] meow bot"
      const faceEl =
        document.getElementById("hero-face-origin") ||
        document.querySelector("[data-face-origin='true']");
      let originX = originXRef.current;
      if (faceEl) {
        const faceRect = faceEl.getBoundingClientRect();
        originX = faceRect.left + faceRect.width / 2;
        originXRef.current = originX;
      } else if (!originX) {
        originX = rect.left + rect.width / 2;
      }

      const dx = e.clientX - originX;

      // When cursor is on left side from origin -> left river bots emerge from river
      // When cursor is on right side from origin -> right river bots emerge from river
      // Deadband hysteresis of ±16px around origin prevents flickering
      if (dx < -16) {
        setLeftActive(true);
        setRightActive(false);
      } else if (dx > 16) {
        setRightActive(true);
        setLeftActive(false);
      }
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        handlePointerMove({ clientX: t.clientX, clientY: t.clientY } as PointerEvent);
      }
    };

    const handlePointerLeave = () => {
      setLeftActive(false);
      setRightActive(false);
      setOffset({ x: 0, y: 0 });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("resize", updateOriginX);
    window.addEventListener("scroll", updateOriginX, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("resize", updateOriginX);
      window.removeEventListener("scroll", updateOriginX);
    };
  }, [updateOriginX]);

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
          isEmerged={leftActive}
          x={3.5}
          y={44}
          scale={1.05}
          staggerMs={0}
        />
        <PixelCatBot
          personality="swimmer"
          isEmerged={leftActive}
          x={7.5}
          y={56}
          scale={0.95}
          staggerMs={100}
        />
        <PixelCatBot
          personality="happy"
          isEmerged={leftActive}
          x={15.5}
          y={80}
          scale={1.0}
          staggerMs={200}
        />
        <PixelCatBot
          personality="researcher"
          isEmerged={leftActive}
          x={25}
          y={88}
          scale={1.05}
          staggerMs={300}
        />

        {/* --- 4. RIGHT RIVER CAT BOTS (Pop up along right pixel water) --- */}
        <PixelCatBot
          personality="builder"
          isEmerged={rightActive}
          x={95}
          y={48}
          scale={1.05}
          staggerMs={0}
        />
        <PixelCatBot
          personality="sleepy"
          isEmerged={rightActive}
          x={91.5}
          y={62}
          scale={1.0}
          staggerMs={100}
        />
        <PixelCatBot
          personality="happy"
          isEmerged={rightActive}
          x={85}
          y={76}
          scale={1.05}
          staggerMs={200}
        />
        <PixelCatBot
          personality="curious"
          isEmerged={rightActive}
          x={76}
          y={88}
          scale={0.95}
          staggerMs={300}
        />
      </div>

      {/* --- 5. HERO CONTENT (Sitting in the clean center clearing) --- */}
      <div className="relative z-30 pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
