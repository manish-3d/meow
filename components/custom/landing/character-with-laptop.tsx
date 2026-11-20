"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface CharacterWithLaptopProps {
  className?: string;
}

type Pose = "left" | "center" | "right";

export function CharacterWithLaptop({ className = "" }: CharacterWithLaptopProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const headMeshRef = useRef<HTMLSpanElement>(null);

  const [pose, setPose] = useState<Pose>("center");
  const [isBlinking, setIsBlinking] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Smooth lerp state for 3D head articulation
  const targetTransform = useRef({ rotX: 0, rotY: 0, rotZ: 0, transX: 0, transY: 0 });
  const currentTransform = useRef({ rotX: 0, rotY: 0, rotZ: 0, transX: 0, transY: 0 });

  const animFrameRef = useRef<number | null>(null);

  // 60 FPS RAF loop for organic physics
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const tick = () => {
      const curT = currentTransform.current;
      const tarT = targetTransform.current;

      curT.rotX = lerp(curT.rotX, tarT.rotX, 0.14);
      curT.rotY = lerp(curT.rotY, tarT.rotY, 0.14);
      curT.rotZ = lerp(curT.rotZ, tarT.rotZ, 0.14);
      curT.transX = lerp(curT.transX, tarT.transX, 0.14);
      curT.transY = lerp(curT.transY, tarT.transY, 0.14);

      if (headMeshRef.current) {
        headMeshRef.current.style.transform = `rotateX(${curT.rotX.toFixed(2)}deg) rotateY(${curT.rotY.toFixed(2)}deg) rotateZ(${curT.rotZ.toFixed(2)}deg) translate3d(${curT.transX.toFixed(1)}px, ${curT.transY.toFixed(1)}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Long-range high-accuracy viewport tracking across the entire screen
  useEffect(() => {
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Normalized coordinates from -1 to 1 across full viewport
      const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth / 2)));
      const normY = Math.max(-1, Math.min(1, dy / (window.innerHeight / 2)));

      // 3D Head rotation
      targetTransform.current = {
        rotX: normY * -24,
        rotY: normX * 28,
        rotZ: normX * normY * 6,
        transX: normX * 8,
        transY: normY * 6,
      };

      // Clean pose switching with hysteresis
      setPose((prevPose) => {
        if (prevPose === "center") {
          if (normX > 0.20) return "right";
          if (normX < -0.20) return "left";
          return "center";
        } else if (prevPose === "right") {
          if (normX < 0.08) return "center";
          return "right";
        } else {
          if (normX > -0.08) return "center";
          return "left";
        }
      });
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
      onClick={handleClick}
      style={{ perspective: 900 }}
      className={`relative inline-flex items-end justify-center shrink-0 align-middle select-none cursor-pointer group ${className}`}
    >
      {/* Container maintains natural proportion */}
      <span className="relative w-full aspect-[140/170] flex items-end justify-center">
        {/* Top-Right Spark Lines (as in Reference Image 2) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute -top-1 -right-4 size-10 sm:size-12 pointer-events-none z-20 overflow-visible text-neutral-900"
        >
          {/* Spark 1 */}
          <line
            x1="20"
            y1="55"
            x2="50"
            y2="30"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Spark 2 */}
          <line
            x1="35"
            y1="75"
            x2="75"
            y2="68"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Spark 3 */}
          <line
            x1="10"
            y1="35"
            x2="35"
            y2="10"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        {/* 3D Transform Head & Torso Mesh (Behind the laptop) */}
        <span
          ref={headMeshRef}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            clipPath: "inset(0 0 20% 0)", // Cleanly clips bottom torso at desk line so zero pixels bleed down
          }}
          className={`absolute top-0 inset-x-0 w-full aspect-[360/535] flex items-center justify-center transition-transform ${
            isClicked ? "scale-105" : "scale-100"
          } duration-200 ease-out z-0`}
        >
          {/* Center Pose Image */}
          <Image
            src="/character-center.png"
            alt="Meow Bot Character"
            width={360}
            height={535}
            priority
            className={`size-full object-contain pointer-events-none ${
              pose === "center" ? "block" : "hidden"
            }`}
          />

          {/* Left Pose Image */}
          <Image
            src="/character-left.png"
            alt="Meow Bot Character Left"
            width={360}
            height={535}
            priority
            className={`size-full object-contain pointer-events-none ${
              pose === "left" ? "block" : "hidden"
            }`}
          />

          {/* Right Pose Image */}
          <Image
            src="/character-right.png"
            alt="Meow Bot Character Right"
            width={360}
            height={535}
            priority
            className={`size-full object-contain pointer-events-none ${
              pose === "right" ? "block" : "hidden"
            }`}
          />

          {/* Eyelid Blink Layer (Only during 140ms blink) */}
          {isBlinking && (
            <span className="absolute inset-0 size-full pointer-events-none z-10">
              <svg viewBox="0 0 360 535" className="size-full object-contain">
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

        {/* Laptop & Desk Foreground Layer (Line-art style, Meow Bot Logo, No Apple branding) */}
        <span className="absolute -bottom-1 inset-x-0 w-full pointer-events-none z-10 flex items-end justify-center">
          <svg
            viewBox="0 0 200 130"
            className="w-[124%] -ml-[12%] h-auto overflow-visible"
            fill="none"
          >
            {/* White solid mask below desk line to ensure zero bleeding */}
            <rect x="0" y="126" width="200" height="40" fill="#FFFFFF" />

            {/* Desk Surface Horizon Line */}
            <line
              x1="5"
              y1="126"
              x2="195"
              y2="126"
              stroke="#000000"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Left Arm / Sleeve resting on desk */}
            <path
              d="M 12 118 C 22 92, 42 86, 68 96"
              stroke="#000000"
              strokeWidth="5"
              strokeLinecap="round"
              fill="#FFFFFF"
            />
            {/* Sleeve cuff */}
            <path
              d="M 44 94 C 48 102, 54 108, 62 112"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Left Hand on keyboard */}
            <path
              d="M 60 114 C 64 110, 72 110, 78 114 C 82 118, 80 124, 72 126 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Laptop Base / Keyboard Surface in perspective */}
            <path
              d="M 62 126 L 158 126 L 152 116 L 68 116 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* Laptop Screen Lid (Angled slightly, back of lid facing viewer) */}
            <path
              d="M 70 116 L 82 36 C 83 31, 87 28, 93 28 L 181 28 C 187 28, 191 32, 190 38 L 168 116 C 167 119, 164 121, 160 121 L 78 121 C 73 121, 69 119, 70 116 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Screen Lid Bevel Detail Line */}
            <path
              d="M 85 40 L 178 40 L 158 112 L 77 112 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.15"
            />

            {/* Meow Bot Mascot Logo Badge on the back of the laptop lid */}
            <g transform="translate(133, 72)">
              {/* Circular clean badge container */}
              <circle cx="0" cy="0" r="14.5" fill="#FFFFFF" stroke="#c9f2b8" strokeWidth="1" />
              {/* Embedded Meow Bot Cat Mascot */}
              <image
                href="/logo.png"
                x="-12.5"
                y="-12.5"
                width="25"
                height="25"
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          </svg>
        </span>
      </span>
    </span>
  );
}
