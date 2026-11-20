"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Key } from "lucide-react";
import {
  ChatGptLogo,
  ClaudeLogo,
  GeminiLogo,
  GrokLogo,
  DeepSeekLogo,
  OllamaLogo,
} from "./brand-logos";

// =========================================================================
// 1. BESPOKE 3D FRONTIER MODEL EMBLEMS (RAZOR-SHARP, ZERO BLUR)
// =========================================================================

interface BrandItem {
  id: string;
  name: string;
  company: string;
  model: string;
  accentColor: string;
  tag: string;
  icon: React.ReactNode;
}

function Claude3DBlock() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-b from-[#e88867] via-[#d97757] to-[#ba5939] text-white flex items-center justify-center shadow-xl border border-white/40 select-none relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/40 pointer-events-none" />
      <svg className="size-13 sm:size-15 drop-shadow-md" viewBox="0 0 48 48" fill="none">
        <path
          d="M 20 8 L 28 8 L 36 38 L 28 38 L 26 28 L 22 28 L 20 38 L 12 38 Z M 24 16 L 23 23 L 25 23 Z"
          fill="#FFFFFF"
        />
        <path d="M 28 8 L 30 10 L 38 40 L 36 38 Z" fill="#d97757" opacity="0.6" />
      </svg>
    </div>
  );
}

function ChatGpt3DCube() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-b from-[#13b58c] via-[#10a37f] to-[#0a7a5e] text-white flex items-center justify-center shadow-xl border border-white/40 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/35 pointer-events-none" />
      <ChatGptLogo size={50} className="text-white brightness-200 drop-shadow-md" />
    </div>
  );
}

function Gemini3DSparkle() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-tr from-[#1ba1e3] via-[#4848f0] to-[#d96570] text-white flex items-center justify-center shadow-xl border border-white/50 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />
      <div className="relative">
        <GeminiLogo size={52} className="drop-shadow-lg" />
      </div>
    </div>
  );
}

function Grok3DCube() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-b from-[#f3f4f6] via-[#d1d5db] to-[#9ca3af] text-neutral-900 flex items-center justify-center shadow-xl border border-white/80 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/50 pointer-events-none" />
      <svg className="size-12 sm:size-14 drop-shadow" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
}

function DeepSeek3DWhale() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-b from-[#1a7aff] via-[#0066ff] to-[#004fcc] text-white flex items-center justify-center shadow-xl border border-white/40 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/35 pointer-events-none" />
      <DeepSeekLogo size={52} className="brightness-200 text-white drop-shadow-md" />
    </div>
  );
}

function Kimi3DMonogram() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-b from-[#1c1d24] via-[#0f1015] to-[#060608] text-white flex items-center justify-center shadow-xl border border-white/25 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/50 pointer-events-none" />
      <span className="font-sans font-black text-4xl sm:text-5xl tracking-tight text-white drop-shadow">
        K
      </span>
    </div>
  );
}

function Qwen3DPrism() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] text-white flex items-center justify-center shadow-xl border border-white/40 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />
      <svg className="size-12 sm:size-14 drop-shadow-md text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 8.5 2 15.5 12 22 22 15.5 22 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <polyline points="22 8.5 12 15.5 2 8.5" />
        <polyline points="2 15.5 12 8.5 22 15.5" />
        <line x1="12" y1="2" x2="12" y2="8.5" />
      </svg>
    </div>
  );
}

function Copilot3DIridescent() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-tr from-[#0078d4] via-[#00b4d8] to-[#7f5af0] text-white flex items-center justify-center shadow-xl border border-white/40 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      <svg className="size-13 sm:size-15 drop-shadow-md" viewBox="0 0 24 24" fill="none">
        <path
          d="M7.5 10c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1.8-1 3.3-2.5 4.1v1.9h-4v-1.9c-1.5-.8-2.5-2.3-2.5-4.1z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        <circle cx="12" cy="18" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

function Ollama3DGranite() {
  return (
    <div className="size-22 sm:size-26 rounded-2xl bg-gradient-to-b from-[#2e3035] via-[#1a1b1e] to-[#0f1011] text-white flex items-center justify-center shadow-xl border border-white/30 select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent pointer-events-none" />
      <OllamaLogo size={50} className="drop-shadow-md brightness-150" />
    </div>
  );
}

const BRANDS: BrandItem[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    company: "OpenAI",
    model: "GPT-4o & o3-mini",
    accentColor: "#10a37f",
    tag: "Frontier General",
    icon: <ChatGpt3DCube />,
  },
  {
    id: "claude",
    name: "Claude",
    company: "Anthropic",
    model: "Claude 3.7 Sonnet",
    accentColor: "#d97757",
    tag: "Hybrid Reasoning",
    icon: <Claude3DBlock />,
  },
  {
    id: "gemini",
    name: "Gemini",
    company: "Google DeepMind",
    model: "Gemini 2.5 Pro",
    accentColor: "#4848f0",
    tag: "Multimodal 2M Context",
    icon: <Gemini3DSparkle />,
  },
  {
    id: "grok",
    name: "Grok",
    company: "xAI",
    model: "Grok 3 Think",
    accentColor: "#111827",
    tag: "Realtime X Intel",
    icon: <Grok3DCube />,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    company: "DeepSeek AI",
    model: "DeepSeek R1 & V3",
    accentColor: "#0066ff",
    tag: "Open Weights SOTA",
    icon: <DeepSeek3DWhale />,
  },
  {
    id: "kimi",
    name: "Kimi",
    company: "Moonshot AI",
    model: "Kimi k1.5",
    accentColor: "#1f2937",
    tag: "Long-Context Agent",
    icon: <Kimi3DMonogram />,
  },
  {
    id: "qwen",
    name: "Qwen",
    company: "Alibaba Cloud",
    model: "Qwen 2.5 72B",
    accentColor: "#8b5cf6",
    tag: "Open Multilingual",
    icon: <Qwen3DPrism />,
  },
  {
    id: "copilot",
    name: "Copilot",
    company: "Microsoft",
    model: "GitHub Copilot",
    accentColor: "#0078d4",
    tag: "Autonomous Coder",
    icon: <Copilot3DIridescent />,
  },
  {
    id: "ollama",
    name: "Ollama",
    company: "Local Offline",
    model: "Run on your Mac/PC",
    accentColor: "#374151",
    tag: "100% Private $0 API",
    icon: <Ollama3DGranite />,
  },
];

// Double list for 100% seamless, infinite wrapping across all screen resolutions
const DISPLAY_BRANDS = [...BRANDS, ...BRANDS];

// Generous desktop horizontal spacing
const DESKTOP_SPACING = 340;

// Brisk, energetic auto-scroll speed (pixels per second)
const AUTO_SCROLL_SPEED = 86;

// =========================================================================
// 2. AUTOMATIC INFINITE 3D LENS CAROUSEL (ZERO BLUR, CONTINUOUS MOTION)
// =========================================================================

export function IntegrationsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1440);

  // Responsive container width tracking
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || 1440);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const cardSpacing = Math.min(DESKTOP_SPACING, Math.max(270, containerWidth * 0.28));
  const totalTrackWidth = DISPLAY_BRANDS.length * cardSpacing;

  // ── Continuous animation state ──
  const [offset, setOffset] = useState(0);

  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const targetOffsetRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragLastXRef = useRef(0);
  const dragLastTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // ── Continuous 60fps / 120fps requestAnimationFrame Loop ──
  // Keeps running constantly without stopping on hover!
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.08); // Protect against large jumps on tab switch
      lastTime = currentTime;

      if (targetOffsetRef.current !== null) {
        // Smooth programmatic slide towards a target card (e.g. click to center)
        const diff = targetOffsetRef.current - offsetRef.current;
        if (Math.abs(diff) < 0.6) {
          offsetRef.current = targetOffsetRef.current;
          targetOffsetRef.current = null;
        } else {
          offsetRef.current += diff * Math.min(1, dt * 7.5);
        }
      } else if (!isDraggingRef.current) {
        // Coasting with momentum inertia after release
        if (Math.abs(velocityRef.current) > 1.2) {
          offsetRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.92, dt * 60);
        } else {
          velocityRef.current = 0;
          // Constant brisk auto-advance — keeps running all the time, never stops on hover!
          offsetRef.current += AUTO_SCROLL_SPEED * dt;
        }
      }

      // Safe mathematical modulo wrapping within [0, totalTrackWidth)
      const wrapped = ((offsetRef.current % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;
      offsetRef.current = wrapped;
      setOffset(wrapped);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [totalTrackWidth]);

  // Click card to glide it directly into center spotlight
  const handleClickCard = useCallback((cardXOffset: number) => {
    if (hasDraggedRef.current) return;
    targetOffsetRef.current = offsetRef.current + cardXOffset;
  }, []);

  // ── Pointer Drag & Swipe Interactivity ──
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragLastXRef.current = e.clientX;
    dragLastTimeRef.current = performance.now();
    velocityRef.current = 0;
    targetOffsetRef.current = null;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX;
    const dx = currentX - dragLastXRef.current;
    const now = performance.now();
    const dt = (now - dragLastTimeRef.current) / 1000;

    if (Math.abs(currentX - dragStartXRef.current) > 5) {
      hasDraggedRef.current = true;
    }

    // Dragging right moves the track right (offset decreases)
    offsetRef.current -= dx;

    if (dt > 0.008) {
      velocityRef.current = -dx / dt;
      dragLastXRef.current = currentX;
      dragLastTimeRef.current = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Safe fallback
    }
    // Clamp release velocity to prevent chaotic spins
    velocityRef.current = Math.max(-1200, Math.min(1200, velocityRef.current));
  };

  return (
    <section
      id="integrations-carousel"
      className="relative w-full max-w-full overflow-hidden overflow-x-clip pt-10 sm:pt-14 pb-8 sm:pb-14 bg-white text-[#131316] select-none"
      style={{ contain: "paint" }}
    >
      <div className="w-full max-w-full flex flex-col justify-center items-center overflow-hidden">
        {/* ── 1. TOP HEADLINE & BRING-YOUR-OWN-AI BANNER ── */}
        <div className="max-w-4xl mx-auto px-4 text-center z-10 shrink-0 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 mb-2.5 shadow-2xs">
            <Key className="size-3.5 text-neutral-800" />
            <span>bring the AI models you already pay for &middot; zero API markup</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 leading-none">
            integration is simple.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-500 font-normal">
            connect with the AI models you already love. swap models per bot anytime.
          </p>
        </div>

        {/* ── 2. THE 3D LENS CAROUSEL TARGET CONTAINER (AUTOMATIC INFINITE LOOP - NO HOVER STOP) ── */}
        <div
          id="webgl-container"
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full max-w-full h-[390px] sm:h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden overflow-x-clip mb-0"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
            contain: "paint",
          }}
        >
          {/* ── PHYSICAL GLASSY LENS TRACK OVERLAY (SCULPTED DOUBLE-LINED TRANSLUCENT RAILS) ── */}
          <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden">
            <svg
              className="w-full h-full overflow-hidden"
              viewBox="0 0 1440 470"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="lensRailGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#64748b" stopOpacity="0.05" />
                  <stop offset="20%" stopColor="#94a3b8" stopOpacity="0.32" />
                  <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.9" />
                  <stop offset="80%" stopColor="#94a3b8" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#64748b" stopOpacity="0.05" />
                </linearGradient>

                <linearGradient id="lensChannelFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Frosted Glass Lens Channel Body */}
              <path
                d="M -40 46 Q 720 120 1480 46 L 1480 424 Q 720 350 -40 424 Z"
                fill="url(#lensChannelFill)"
              />

              {/* Upper Glassy Lens Rail - Outer Bevel */}
              <path
                d="M -40 46 Q 720 120 1480 46"
                stroke="url(#lensRailGlow)"
                strokeWidth="4.5"
                fill="none"
                opacity="0.92"
              />
              {/* Upper Glassy Lens Rail - Inner Highlight */}
              <path
                d="M -40 54 Q 720 128 1480 54"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                opacity="0.85"
              />

              {/* Lower Glassy Lens Rail - Outer Bevel */}
              <path
                d="M -40 424 Q 720 350 1480 424"
                stroke="url(#lensRailGlow)"
                strokeWidth="4.5"
                fill="none"
                opacity="0.92"
              />
              {/* Lower Glassy Lens Rail - Inner Highlight */}
              <path
                d="M -40 416 Q 720 342 1480 416"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                opacity="0.85"
              />
            </svg>
          </div>

          {/* ── 3D WARPING CAROUSEL TRACK (STRICTLY ZERO BLUR, CONTINUOUS MOTION, PROMINENT CENTER) ── */}
          <div
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            {DISPLAY_BRANDS.map((brand, index) => {
              // Raw distance along the continuous infinite loop
              const raw = (index * cardSpacing - offset) % totalTrackWidth;
              let xOffset = ((raw % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;
              if (xOffset > totalTrackWidth / 2) {
                xOffset -= totalTrackWidth;
              }

              // Distance from focal center in card spacing units
              const absDiff = Math.abs(xOffset / cardSpacing);

              // Normalized distance ratio (-1.0 at left rail, +1.0 at right rail)
              const halfW = (containerWidth || 1440) / 2;
              const u = xOffset / (halfW * 0.85);
              const absU = Math.abs(u);

              // ── 3D LENS WARPING & PROMINENT CENTER MAGNIFICATION ──
              // 1. Center card blooms to ~1.38x, side cards rest cleanly at ~0.78x
              const centerProximity = Math.max(0, 1 - Math.min(1, absDiff));
              const smoothProximity =
                centerProximity * centerProximity * (3 - 2 * centerProximity);
              const scale = 0.78 + smoothProximity * 0.60;

              // 2. Parabolic 3D Depth curve (crisp and clear, shallow depth to eliminate mipmap softness)
              const zDepth = -120 * (u * u) + smoothProximity * 50;

              // 3. 3D inward rotation along Y-axis (physical bowed lens curvature)
              const rotY = -Math.sign(u) * Math.min(26, Math.pow(absU, 1.1) * 22);

              // 4. Fisheye vertical arc curve
              const yOffset = 18 * (u * u);

              // 5. SOLID, CRISP VISIBILITY — ZERO BLUR, NO WASHED OUT OPACITY
              // Fade smoothly at the very edges of the container
              const opacity = absU > 1.05 ? Math.max(0, 1 - (absU - 1.05) / 0.18) : 1;

              // Strictly cull off-screen cards beyond the viewport edges to prevent any DOM overflow
              if (absU > 1.22) return null;

              const isCenterActive = absDiff < 0.45;

              return (
                <div
                  key={`${brand.id}-${index}`}
                  onClick={() => handleClickCard(xOffset)}
                  className="absolute flex flex-col items-center justify-center select-none pointer-events-auto cursor-pointer"
                  style={{
                    width: "220px",
                    transform: `translate3d(${xOffset}px, ${yOffset}px, ${zDepth}px) rotateY(${rotY}deg) scale(${scale})`,
                    filter: "none", // STRICTLY ZERO BLUR
                    opacity: opacity,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased",
                    willChange: "transform",
                    zIndex: Math.round(200 - absDiff * 40 + (isCenterActive ? 60 : 0)),
                  }}
                >
                  {/* 3D Brand Logo Emblem with Magnified Center Shadow */}
                  <div
                    className={`relative flex items-center justify-center transition-all duration-300 ${
                      isCenterActive
                        ? "drop-shadow-2xl ring-4 ring-black/5 rounded-3xl"
                        : "drop-shadow-md hover:drop-shadow-lg"
                    }`}
                  >
                    {brand.icon}
                  </div>

                  {/* Clean Brand Typography Below Logo */}
                  <div className="mt-4 text-center px-2">
                    <h3
                      className={`font-sans tracking-tight transition-all duration-200 ${
                        isCenterActive
                          ? "font-bold text-xl sm:text-2xl text-neutral-900"
                          : "font-semibold text-base sm:text-lg text-neutral-800"
                      }`}
                    >
                      {brand.name}
                    </h3>

                    {/* Active Center Model Badge Pill */}
                    {isCenterActive ? (
                      <div className="mt-1 flex flex-col items-center gap-0.5 animate-fade-in">
                        <span className="font-mono text-[11px] font-semibold text-neutral-800 bg-neutral-100/95 px-2.5 py-0.5 rounded-full border border-neutral-300/60 shadow-2xs">
                          {brand.model}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium whitespace-nowrap">
                          {brand.company} &bull; {brand.tag}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 font-medium mt-0.5">
                        {brand.company}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
