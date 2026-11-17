"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface RiveCharacterFollowProps {
  size?: number;
  className?: string;
}

export function RiveCharacterFollow({ size = 88, className = "" }: RiveCharacterFollowProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { rive, RiveComponent } = useRive({
    src: "/character-follow.riv",
    artboard: "Artboard",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  const rightLeftInput = useStateMachineInput(rive, "State Machine 1", "Right left");
  const headHoverInput = useStateMachineInput(rive, "State Machine 1", "Heade hover");

  useEffect(() => {
    if (!mounted) return;

    let hoverTimer: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Follow cursor horizontally: true if cursor is to the right of the character, false if to the left
      const isRight = e.clientX >= centerX;
      if (rightLeftInput) {
        rightLeftInput.value = isRight;
      }

      // Activate head hover reaction whenever mouse moves across the viewport
      if (headHoverInput) {
        headHoverInput.value = true;
      }

      // Compute gentle 3D perspective tilt towards the cursor
      const maxTilt = 10;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);
      const clampedX = Math.max(-1, Math.min(1, dx));
      const clampedY = Math.max(-1, Math.min(1, dy));

      setTilt({
        x: clampedY * -maxTilt,
        y: clampedX * maxTilt,
      });

      // Clear previous timer and set hover to false after inactivity
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (headHoverInput) {
          headHoverInput.value = false;
        }
        setTilt({ x: 0, y: 0 });
      }, 2500);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
        } as MouseEvent);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(hoverTimer);
    };
  }, [mounted, rightLeftInput, headHoverInput]);

  if (!mounted) {
    return (
      <span
        style={{ width: size, height: size }}
        className={`inline-flex items-center justify-center shrink-0 align-middle ${className}`}
      >
        <span className="size-16 rounded-full bg-purple-100/60 animate-pulse inline-block" />
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      style={{
        width: size,
        height: size,
        perspective: 600,
      }}
      className={`relative inline-flex items-center justify-center shrink-0 align-middle select-none transition-transform duration-150 ease-out ${className}`}
      title="Meow Bot character follows your cursor!"
    >
      <span
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.12s ease-out",
        }}
        className="size-full flex items-center justify-center"
      >
        <RiveComponent className="size-full object-contain" />
      </span>
    </span>
  );
}
