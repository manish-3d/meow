"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CenterCatProps {
  phase: number; // 1 to 6
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

export function StageCenterCat({ phase }: CenterCatProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isExploding = phase === 2;
  const isVisible = phase === 1;

  // ── Frame 2: Radial Particle Explosion (150+ Particles) ──
  useEffect(() => {
    if (!isExploding) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const centerX = width / 2;
    const centerY = height / 2;

    const colors = ["#FDE047", "#F472B6", "#38BDF8", "#A78BFA", "#4ADE80", "#FB923C"];
    const particles: Particle[] = [];
    const count = 160;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8.5; // Radial velocity
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.floor(Math.random() * 5), // Pixel square particles
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
        gravity: 0.08,
      });
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98; // Friction
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          // Render as crisp 8-bit square pixels
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      if (ctx) ctx.clearRect(0, 0, width, height);
    };
  }, [isExploding]);

  if (phase > 2) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      {/* ── Frame 1: Center Idle Pixel Cat ── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="idle-cat"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center justify-center select-none"
          >
            {/* Bobbing Cat Visual */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Cute 8-Bit Pixel Cat SVG */}
              <svg
                width="84"
                height="84"
                viewBox="0 0 24 24"
                fill="none"
                className="drop-shadow-xl"
                style={{ imageRendering: "pixelated" }}
              >
                {/* Ears */}
                <rect x="4" y="3" width="4" height="4" fill="#7C5CFC" />
                <rect x="5" y="4" width="2" height="2" fill="#F472B6" />
                <rect x="16" y="3" width="4" height="4" fill="#7C5CFC" />
                <rect x="17" y="4" width="2" height="2" fill="#F472B6" />

                {/* Head Body */}
                <rect x="4" y="6" width="16" height="12" fill="#7C5CFC" rx="1" />
                <rect x="5" y="7" width="14" height="10" fill="#8B6EFD" />

                {/* Eyes */}
                <rect x="7" y="9" width="3" height="3" fill="#131316" />
                <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
                <rect x="14" y="9" width="3" height="3" fill="#131316" />
                <rect x="15" y="9" width="1" height="1" fill="#FFFFFF" />

                {/* Cheeks */}
                <rect x="5" y="12" width="2" height="1" fill="#F472B6" opacity="0.8" />
                <rect x="17" y="12" width="2" height="1" fill="#F472B6" opacity="0.8" />

                {/* Snout & Whiskers */}
                <rect x="11" y="11" width="2" height="1" fill="#FDE047" />
                <rect x="10" y="12" width="4" height="1" fill="#131316" />
                <rect x="2" y="10" width="3" height="1" fill="#6B4FE0" />
                <rect x="2" y="12" width="3" height="1" fill="#6B4FE0" />
                <rect x="19" y="10" width="3" height="1" fill="#6B4FE0" />
                <rect x="19" y="12" width="3" height="1" fill="#6B4FE0" />

                {/* Collar Bell */}
                <rect x="11" y="17" width="2" height="2" fill="#FBBF24" />
              </svg>
            </motion.div>

            {/* Soft Ground Shadow */}
            <motion.div
              animate={{
                scale: [1, 0.85, 1],
                opacity: [0.35, 0.2, 0.35],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-14 h-2.5 rounded-full bg-black/40 blur-[2px] mt-2"
            />

            {/* Status Pill */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-black/[0.08] text-[11px] font-mono text-neutral-700 shadow-sm">
              <span className="size-1.5 rounded-full bg-[#7C5CFC] animate-ping" />
              <span>Workspace Ready · Initializing Agent Crew...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Frame 2: Particle Sparkle Explosion Canvas ── */}
      {isExploding && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}
    </div>
  );
}
