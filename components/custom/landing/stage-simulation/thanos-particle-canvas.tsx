"use client";

import React, { useEffect, useRef } from "react";

interface ThanosParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
}

interface ThanosParticleCanvasProps {
  active: boolean;
}

export function ThanosParticleCanvas({ active }: ThanosParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const centerX = width / 2;
    const centerY = height / 2;

    const colors = [
      "#a78bfa", // Lavender sparkle
      "#fdba74", // Orange dust
      "#a3e635", // Lime green
      "#86efac", // Soft grass
      "#713f12", // Dirt pixel
      "#92400e", // Rich soil
      "#ffffff", // Shimmer white
    ];

    const particles: ThanosParticle[] = [];
    const count = 150;

    for (let i = 0; i < count; i++) {
      // Disperse predominantly upward and outward (Thanos snap style)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 1.4);
      const speed = 2.5 + Math.random() * 8.5;

      // Spawn concentrated around center cat & island
      const spawnOffsetX = (Math.random() - 0.5) * 140;
      const spawnOffsetY = (Math.random() - 0.5) * 80;

      particles.push({
        x: centerX + spawnOffsetX,
        y: centerY + spawnOffsetY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 3), // Strong upward drift
        size: 3 + Math.floor(Math.random() * 5), // Square pixel dust blocks
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.022,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.1,
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
        p.vx *= 0.97; // Horizontal drag
        p.vy *= 0.98; // Vertical float
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          // Render crisp pixel dust squares
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
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
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  );
}
