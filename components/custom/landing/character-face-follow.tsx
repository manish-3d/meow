"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface CharacterFaceFollowProps {
  size?: number;
  className?: string;
}

type Pose = "left" | "center" | "right";

export function CharacterFaceFollow({ size, className = "" }: CharacterFaceFollowProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const headMeshRef = useRef<HTMLSpanElement>(null);
  const pupilsSvgRef = useRef<SVGSVGElement>(null);

  const [pose, setPose] = useState<Pose>("center");
  const [isBlinking, setIsBlinking] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Smooth lerp state for 3D head articulation
  const targetTransform = useRef({ rotX: 0, rotY: 0, rotZ: 0, transX: 0, transY: 0 });
  const currentTransform = useRef({ rotX: 0, rotY: 0, rotZ: 0, transX: 0, transY: 0 });

  // Smooth lerp state for high-accuracy pupil tracking
  const targetPupil = useRef({ x: 0, y: 0 });
  const currentPupil = useRef({ x: 0, y: 0 });

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

      // Smooth pupil lerp
      const curP = currentPupil.current;
      const tarP = targetPupil.current;
      curP.x = lerp(curP.x, tarP.x, 0.22);
      curP.y = lerp(curP.y, tarP.y, 0.22);

      // Directly update pupil circles in SVG for maximum 60fps performance
      if (pupilsSvgRef.current) {
        const leftPupil = pupilsSvgRef.current.querySelector("#left-pupil") as SVGCircleElement | null;
        const rightPupil = pupilsSvgRef.current.querySelector("#right-pupil") as SVGCircleElement | null;

        if (leftPupil) {
          const baseCx = parseFloat(leftPupil.getAttribute("data-base-cx") || "424");
          const baseCy = parseFloat(leftPupil.getAttribute("data-base-cy") || "445");
          leftPupil.setAttribute("cx", (baseCx + curP.x).toFixed(1));
          leftPupil.setAttribute("cy", (baseCy + curP.y).toFixed(1));
        }

        if (rightPupil) {
          const baseCx = parseFloat(rightPupil.getAttribute("data-base-cx") || "567");
          const baseCy = parseFloat(rightPupil.getAttribute("data-base-cy") || "445");
          rightPupil.setAttribute("cx", (baseCx + curP.x).toFixed(1));
          rightPupil.setAttribute("cy", (baseCy + curP.y).toFixed(1));
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Long-range high-accuracy viewport tracking
  useEffect(() => {
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Distance and angle to cursor everywhere in the window
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      // Long range: full viewport range of contact
      const maxViewportDist = Math.hypot(window.innerWidth, window.innerHeight) * 0.55;
      const distanceFactor = Math.min(1, dist / Math.max(250, maxViewportDist));

      // Normalized coordinates from -1 to 1
      const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth / 2)));
      const normY = Math.max(-1, Math.min(1, dy / (window.innerHeight / 2)));

      // 3D Head rotation (high range: ±26° vertical, ±30° horizontal, ±7° organic roll)
      targetTransform.current = {
        rotX: normY * -24,
        rotY: normX * 28,
        rotZ: normX * normY * 7,
        transX: normX * 10,
        transY: normY * 8,
      };

      // High-accuracy pupil tracking: moves in exact 360° direction towards cursor
      const maxTravelX = 22;
      const maxTravelY = 24;
      targetPupil.current = {
        x: Math.cos(angle) * maxTravelX * distanceFactor,
        y: Math.sin(angle) * maxTravelY * distanceFactor,
      };

      // Hysteresis angle switching
      setPose((prevPose) => {
        if (prevPose === "center") {
          if (normX > 0.22) return "right";
          if (normX < -0.22) return "left";
          return "center";
        } else if (prevPose === "right") {
          if (normX < 0.10) return "center";
          return "right";
        } else {
          if (normX > -0.10) return "center";
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
      const delay = 3200 + Math.random() * 2600;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
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
        }, 140);
      }, 100);
    }, 140);
  }, []);

  // Responsive default dimensions
  const containerStyle = size
    ? { width: size, height: size, perspective: 900 }
    : { perspective: 900 };

  return (
    <span
      ref={containerRef}
      onClick={handleClick}
      style={containerStyle}
      className={`relative inline-flex items-center justify-center shrink-0 align-middle select-none cursor-pointer group w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 ${className}`}
      title="Man face tracks your cursor everywhere • Click to wink!"
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
        {/* Center Pose Image */}
        <Image
          src="/character-center.png"
          alt="Man face center"
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
          alt="Man face left"
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
          alt="Man face right"
          width={1000}
          height={1000}
          priority
          className={`absolute inset-0 size-full object-contain pointer-events-none transition-opacity duration-150 ${
            pose === "right" ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Dynamic 360° Cursor-Tracking Eyes & Eyelids Layer */}
        <svg
          ref={pupilsSvgRef}
          viewBox="0 0 1000 1000"
          className="absolute inset-0 size-full pointer-events-none z-10"
        >
          {pose === "center" && (
            <>
              {/* White lens fills to clear static pupils */}
              <ellipse cx="424" cy="445" rx="36" ry="44" fill="#ffffff" />
              <ellipse cx="567" cy="445" rx="38" ry="44" fill="#ffffff" />

              {!isBlinking ? (
                <>
                  {/* Left Pupil (tracks 360°) */}
                  <circle
                    id="left-pupil"
                    data-base-cx="424"
                    data-base-cy="445"
                    cx="424"
                    cy="445"
                    r="13"
                    fill="#000000"
                  />
                  {/* Right Pupil (tracks 360°) */}
                  <circle
                    id="right-pupil"
                    data-base-cx="567"
                    data-base-cy="445"
                    cx="567"
                    cy="445"
                    r="13"
                    fill="#000000"
                  />
                </>
              ) : (
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
            </>
          )}

          {pose === "left" && (
            <>
              {/* White lens fills */}
              <ellipse cx="441" cy="450" rx="36" ry="44" fill="#ffffff" />
              <ellipse cx="562" cy="450" rx="50" ry="44" fill="#ffffff" />

              {!isBlinking ? (
                <>
                  <circle
                    id="left-pupil"
                    data-base-cx="441"
                    data-base-cy="450"
                    cx="441"
                    cy="450"
                    r="13"
                    fill="#000000"
                  />
                  <circle
                    id="right-pupil"
                    data-base-cx="562"
                    data-base-cy="450"
                    cx="562"
                    cy="450"
                    r="13"
                    fill="#000000"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M 370 458 Q 395 474 420 458"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 480 454 Q 508 470 534 454"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                </>
              )}
            </>
          )}

          {pose === "right" && (
            <>
              {/* White lens fills */}
              <ellipse cx="426" cy="450" rx="42" ry="44" fill="#ffffff" />
              <ellipse cx="548" cy="450" rx="36" ry="44" fill="#ffffff" />

              {!isBlinking ? (
                <>
                  <circle
                    id="left-pupil"
                    data-base-cx="426"
                    data-base-cy="450"
                    cx="426"
                    cy="450"
                    r="13"
                    fill="#000000"
                  />
                  <circle
                    id="right-pupil"
                    data-base-cx="548"
                    data-base-cy="450"
                    cx="548"
                    cy="450"
                    r="13"
                    fill="#000000"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M 466 454 Q 494 470 522 454"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 578 458 Q 604 474 630 458"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                </>
              )}
            </>
          )}
        </svg>
      </span>
    </span>
  );
}
