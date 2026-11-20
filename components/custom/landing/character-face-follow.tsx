"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface CharacterFaceFollowProps {
  className?: string;
}

type Pose = "left" | "center" | "right";

export function CharacterFaceFollow({ className = "" }: CharacterFaceFollowProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const headMeshRef = useRef<HTMLSpanElement>(null);

  const [pose, setPose] = useState<Pose>("center");
  const [isBlinking, setIsBlinking] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Smooth lerp state for 3D head articulation
  const targetTransform = useRef({ rotX: 0, rotY: 0, rotZ: 0, transX: 0, transY: 0 });
  const currentTransform = useRef({ rotX: 0, rotY: 0, rotZ: 0, transX: 0, transY: 0 });

  const animFrameRef = useRef<number | null>(null);

  // 60 FPS RAF loop for organic physics (strictly horizontal left/right, no up/down interference)
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const tick = () => {
      const curT = currentTransform.current;
      const tarT = targetTransform.current;

      curT.rotX = 0;
      curT.rotY = lerp(curT.rotY, tarT.rotY, 0.14);
      curT.rotZ = 0;
      curT.transX = lerp(curT.transX, tarT.transX, 0.14);
      curT.transY = 0;

      if (headMeshRef.current) {
        headMeshRef.current.style.transform = `rotateY(${curT.rotY.toFixed(2)}deg) translate3d(${curT.transX.toFixed(1)}px, 0, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Long-range high-accuracy horizontal viewport tracking across the entire screen
  useEffect(() => {
    const handlePointerMove = (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      const dx = clientX - centerX;

      // Normalized coordinates from -1 to 1 across full viewport (horizontal only)
      const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth / 2)));

      // 3D Head rotation: strictly left and right, zero up/down tilt or pitch
      targetTransform.current = {
        rotX: 0,
        rotY: normX * 28,
        rotZ: 0,
        transX: normX * 8,
        transY: 0,
      };

      // Clean pose switching with hysteresis (no flickering, no double-glasses)
      setPose((prevPose) => {
        if (prevPose === "center") {
          if (normX > 0.20) return "right";
          if (normX < -0.20) return "left";
          return "center";
        } else if (prevPose === "right") {
          if (normX < 0.08) return "center";
          return "right";
        } else {
          // prevPose === "left"
          if (normX > -0.08) return "center";
          return "left";
        }
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Periodic natural blinking
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const scheduleBlink = () => {
      const delay = 3500 + Math.random() * 2500;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 140);
      }, delay);
    };

    scheduleBlink();

    return () => clearTimeout(blinkTimeout);
  }, []);

  // Playful click interaction
  const handleClick = useCallback(() => {
    setIsClicked(true);
    setIsBlinking(true);

    setTimeout(() => {
      setIsBlinking(false);
      setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          setIsClicked(false);
        }, 130);
      }, 90);
    }, 130);
  }, []);

  return (
    <span
      ref={containerRef}
      id="hero-face-origin"
      data-face-origin="true"
      onClick={handleClick}
      style={{ perspective: 900 }}
      className={`relative inline-flex items-center justify-center shrink-0 align-middle select-none cursor-pointer group ${className}`}
    >
      {/* 3D Transform Head Mesh */}
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
        {/* Center Pose Image: 100% crisp, pristine, unbroken hand-drawn glasses */}
        <Image
          src="/character-center.png"
          alt="Man face center"
          width={360}
          height={535}
          priority
          className={`size-full object-contain pointer-events-none ${
            pose === "center" ? "block" : "hidden"
          }`}
        />

        {/* Left Pose Image: hand-drawn 3/4 angle looking left */}
        <Image
          src="/character-left.png"
          alt="Man face left"
          width={360}
          height={535}
          priority
          className={`size-full object-contain pointer-events-none ${
            pose === "left" ? "block" : "hidden"
          }`}
        />

        {/* Right Pose Image: hand-drawn 3/4 angle looking right */}
        <Image
          src="/character-right.png"
          alt="Man face right"
          width={360}
          height={535}
          priority
          className={`size-full object-contain pointer-events-none ${
            pose === "right" ? "block" : "hidden"
          }`}
        />

        {/* Eyelid Blink Layer (Only active during 140ms blink, zero effect on glasses) */}
        {isBlinking && (
          <span className="absolute inset-0 size-full pointer-events-none z-10">
            <svg
              viewBox="0 0 360 535"
              className="size-full object-contain"
            >
              {pose === "center" && (
                <>
                  <ellipse cx="104" cy="255" rx="28" ry="32" fill="#ffffff" />
                  <ellipse cx="247" cy="255" rx="30" ry="32" fill="#ffffff" />
                  <path
                    d="M 85 258 Q 104 274 123 258"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 228 258 Q 247 274 266 258"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </>
              )}

              {pose === "left" && (
                <>
                  <ellipse cx="121" cy="260" rx="26" ry="32" fill="#ffffff" />
                  <ellipse cx="242" cy="260" rx="34" ry="32" fill="#ffffff" />
                  <path
                    d="M 103 262 Q 121 278 139 262"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 223 262 Q 242 278 261 262"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </>
              )}

              {pose === "right" && (
                <>
                  <ellipse cx="106" cy="260" rx="34" ry="32" fill="#ffffff" />
                  <ellipse cx="228" cy="260" rx="26" ry="32" fill="#ffffff" />
                  <path
                    d="M 88 262 Q 106 278 124 262"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 212 262 Q 228 278 244 262"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </span>
        )}
      </span>
    </span>
  );
}
