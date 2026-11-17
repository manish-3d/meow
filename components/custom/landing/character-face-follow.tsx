"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface CharacterFaceFollowProps {
  size?: number;
  className?: string;
}

type Pose = "left" | "center" | "right";

export function CharacterFaceFollow({ size = 92, className = "" }: CharacterFaceFollowProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [pose, setPose] = useState<Pose>("center");
  const [isBlinking, setIsBlinking] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Smooth lerp state for 3D head tilt
  const targetTransform = useRef({ rotX: 0, rotY: 0, transX: 0, transY: 0 });
  const currentTransform = useRef({ rotX: 0, rotY: 0, transX: 0, transY: 0 });
  const headMeshRef = useRef<HTMLSpanElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Smooth RAF loop for 60fps organic physics
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const tick = () => {
      const cur = currentTransform.current;
      const tar = targetTransform.current;

      cur.rotX = lerp(cur.rotX, tar.rotX, 0.12);
      cur.rotY = lerp(cur.rotY, tar.rotY, 0.12);
      cur.transX = lerp(cur.transX, tar.transX, 0.12);
      cur.transY = lerp(cur.transY, tar.transY, 0.12);

      if (headMeshRef.current) {
        headMeshRef.current.style.transform = `rotateX(${cur.rotX.toFixed(2)}deg) rotateY(${cur.rotY.toFixed(2)}deg) translate3d(${cur.transX.toFixed(1)}px, ${cur.transY.toFixed(1)}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Mouse / Touch movement tracking
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1
      const rawDx = (clientX - centerX) / (window.innerWidth / 2);
      const rawDy = (clientY - centerY) / (window.innerHeight / 2);

      const clampedDx = Math.max(-1, Math.min(1, rawDx));
      const clampedDy = Math.max(-1, Math.min(1, rawDy));

      // 3D rotation limits: up/down (-16 to +16 deg), left/right (-20 to +20 deg)
      targetTransform.current = {
        rotX: clampedDy * -16,
        rotY: clampedDx * 20,
        transX: clampedDx * 5,
        transY: clampedDy * 4,
      };

      // Determine face pose angle with hysteresis to avoid boundary flickering
      setPose((prevPose) => {
        if (prevPose === "center") {
          if (clampedDx > 0.18) return "right";
          if (clampedDx < -0.18) return "left";
          return "center";
        } else if (prevPose === "right") {
          if (clampedDx < 0.08) return "center";
          return "right";
        } else {
          // prevPose === "left"
          if (clampedDx > -0.08) return "center";
          return "left";
        }
      });

      // Clear inactivity timer and reset smoothly after 3 seconds of stillness
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        targetTransform.current = { rotX: 0, rotY: 0, transX: 0, transY: 0 };
        setPose("center");
      }, 3500);
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      clearTimeout(inactivityTimer);
    };
  }, []);

  // Periodic natural blinking
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2500; // between 3.0s and 5.5s
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, delay);
    };

    scheduleBlink();

    return () => clearTimeout(blinkTimeout);
  }, []);

  // Cheerful click interaction
  const handleClick = useCallback(() => {
    setIsClicked(true);
    setIsBlinking(true);

    // Double-blink animation
    setTimeout(() => {
      setIsBlinking(false);
      setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          setIsClicked(false);
        }, 140);
      }, 100);
    }, 140);
  }, []);

  return (
    <span
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: size,
        height: size,
        perspective: 800,
      }}
      className={`relative inline-flex items-center justify-center shrink-0 align-middle select-none cursor-pointer group ${className}`}
      title="Man face tracks your cursor everywhere • Click to wink!"
    >
      {/* 3D Transform Head Container */}
      <span
        ref={headMeshRef}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className={`relative size-full flex items-center justify-center transition-transform ${
          isClicked ? "scale-110" : "scale-100"
        } duration-200 ease-out`}
      >
        {/* Center Pose Image */}
        <Image
          src="/character-center.png"
          alt="Man face looking straight"
          width={1000}
          height={1000}
          priority
          className={`absolute inset-0 size-full object-contain pointer-events-none transition-opacity duration-150 ${
            pose === "center" ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Left Pose Image */}
        <Image
          src="/character-left.png"
          alt="Man face looking left"
          width={1000}
          height={1000}
          priority
          className={`absolute inset-0 size-full object-contain pointer-events-none transition-opacity duration-150 ${
            pose === "left" ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right Pose Image */}
        <Image
          src="/character-right.png"
          alt="Man face looking right"
          width={1000}
          height={1000}
          priority
          className={`absolute inset-0 size-full object-contain pointer-events-none transition-opacity duration-150 ${
            pose === "right" ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Eyelid Blink Overlay (Curved closed eyes over glasses when blinking) */}
        {isBlinking && (
          <svg
            viewBox="0 0 1000 1000"
            className="absolute inset-0 size-full pointer-events-none z-10"
          >
            {pose === "center" && (
              <>
                {/* Left eye closed curve */}
                <path
                  d="M 405 448 Q 435 466 465 448"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Right eye closed curve */}
                <path
                  d="M 525 444 Q 555 462 585 444"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </>
            )}

            {pose === "left" && (
              <>
                {/* Left-turned eye closed curve */}
                <path
                  d="M 370 458 Q 395 474 420 458"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Right-turned eye closed curve */}
                <path
                  d="M 480 454 Q 508 470 534 454"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </>
            )}

            {pose === "right" && (
              <>
                {/* Right-turned eye closed curve */}
                <path
                  d="M 466 454 Q 494 470 522 454"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Far-right turned eye closed curve */}
                <path
                  d="M 578 458 Q 604 474 630 458"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        )}
      </span>
    </span>
  );
}
