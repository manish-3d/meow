"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Key, Sparkles, Cpu } from "lucide-react";
import { useScroll, useSpring } from "motion/react";
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

// Generous desktop horizontal spacing so cards never overlap
const DESKTOP_SPACING = 360;

// =========================================================================
// 2. SCROLL-DRIVEN 3D LENS CAROUSEL (ZERO BLUR, BIGGER MIDDLE FOCUS)
// =========================================================================

export function IntegrationsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive container width
  const [containerWidth, setContainerWidth] = useState(1440);

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

  const cardSpacing = Math.min(DESKTOP_SPACING, Math.max(280, containerWidth * 0.32));

  // ── Scroll progress across pinned section ──
  // Starts when section top reaches viewport top, ends when section bottom reaches viewport bottom
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Fluid spring physics for silky buttery movement without jank
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.0005,
  });

  // Continuous active float index
  const [currentActiveFloat, setCurrentActiveFloat] = useState(0);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      // Map scroll progress 0..1 to brand index 0..(BRANDS.length - 1)
      const targetIndex = latest * (BRANDS.length - 1);
      setCurrentActiveFloat(targetIndex);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Round active integer index for pill indicator and stepper
  const activeIntIndex = Math.min(
    BRANDS.length - 1,
    Math.max(0, Math.round(currentActiveFloat))
  );

  // Smooth programmatic scroll to a specific model index
  const scrollToBrand = useCallback((index: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollableDistance = sectionRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = scrollTop + (index / (BRANDS.length - 1)) * scrollableDistance;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  }, []);

  const handlePrev = useCallback(() => {
    const nextIdx = Math.max(0, activeIntIndex - 1);
    scrollToBrand(nextIdx);
  }, [activeIntIndex, scrollToBrand]);

  const handleNext = useCallback(() => {
    const nextIdx = Math.min(BRANDS.length - 1, activeIntIndex + 1);
    scrollToBrand(nextIdx);
  }, [activeIntIndex, scrollToBrand]);

  // Pointer drag support for horizontal swiping
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 60) {
      if (dx > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      isDraggingRef.current = false;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section
      ref={sectionRef}
      id="integrations-carousel"
      className="relative w-full bg-white text-[#131316] select-none"
      style={{
        // 320vh allows each model to slide into the center spotlight comfortably one by one as the user scrolls
        height: "320vh",
      }}
    >
      {/* ── STICKY VIEWPORT CONTAINER ── */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-24 pb-8 sm:pt-28 sm:pb-12 overflow-hidden">
        {/* ── 1. TOP HEADLINE & BRING-YOUR-OWN-AI BANNER ── */}
        <div className="max-w-4xl mx-auto px-4 text-center z-10 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 mb-3 shadow-2xs">
            <Key className="size-3.5 text-neutral-800" />
            <span>bring the AI models you already pay for &middot; zero API markup</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 leading-none">
            integration is simple.
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-neutral-500 font-normal">
            connect with the AI models you already love. swap models per bot anytime.
          </p>
        </div>

        {/* ── 2. THE 3D LENS CAROUSEL TARGET CONTAINER ── */}
        <div
          id="webgl-container"
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-[400px] sm:h-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden my-auto"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          {/* ── PHYSICAL GLASSY LENS TRACK OVERLAY (SCULPTED DOUBLE-LINED TRANSLUCENT RAILS) ── */}
          <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox="0 0 1440 450"
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
                d="M -40 46 Q 720 120 1480 46 L 1480 404 Q 720 330 -40 404 Z"
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
                d="M -40 404 Q 720 330 1480 404"
                stroke="url(#lensRailGlow)"
                strokeWidth="4.5"
                fill="none"
                opacity="0.92"
              />
              {/* Lower Glassy Lens Rail - Inner Highlight */}
              <path
                d="M -40 396 Q 720 322 1480 396"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                opacity="0.85"
              />
            </svg>
          </div>

          {/* ── 3D WARPING CAROUSEL TRACK (ZERO BLUR, SCROLL-SLIDING, BIGGER CENTER) ── */}
          <div
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            {BRANDS.map((brand, index) => {
              // Exact relative distance from the focal center (0.0 when dead center)
              const diff = index - currentActiveFloat;
              const absDiff = Math.abs(diff);

              // Horizontal screen translation
              const xOffset = diff * cardSpacing;

              // Normalized distance ratio (-1.0 at left rail, +1.0 at right rail)
              const halfW = containerWidth / 2;
              const u = xOffset / (halfW * 0.85);
              const absU = Math.abs(u);

              // ── SCROLL & LENS WARPING FORMULAS ──
              // 1. MIDDLE ONE IS PROMINENTLY BIGGER IN SIZE:
              // Smooth cubic easing: center blooms to ~1.38x, side cards rest cleanly at ~0.76x
              const centerProximity = Math.max(0, 1 - Math.min(1, absDiff));
              const smoothProximity =
                centerProximity * centerProximity * (3 - 2 * centerProximity);
              const scale = 0.76 + smoothProximity * 0.62; // 0.76 at sides, 1.38 at center!

              // 2. Parabolic 3D Depth curve (curves backward into distance as cards move away from center)
              const zDepth = -280 * (u * u) + smoothProximity * 80;

              // 3. 3D inward rotation along Y-axis (physical bowed lens curvature)
              const rotY = -Math.sign(u) * Math.min(30, Math.pow(absU, 1.1) * 26);

              // 4. Fisheye vertical arc curve
              const yOffset = 18 * (u * u);

              // 5. NO BLUR: filter is strictly "none" as requested!
              // Opacity gently fades out only near the outer margins
              const opacity = Math.max(0, Math.min(1, 1 - Math.pow(absU, 1.8) * 0.65));

              // Don't render cards far off-screen
              if (absU > 1.7) return null;

              const isCenterActive = absDiff < 0.45;

              return (
                <div
                  key={brand.id}
                  onClick={() => scrollToBrand(index)}
                  className="absolute flex flex-col items-center justify-center select-none pointer-events-auto cursor-pointer"
                  style={{
                    width: "220px",
                    transform: `translate3d(${xOffset}px, ${yOffset}px, ${zDepth}px) rotateY(${rotY}deg) scale(${scale})`,
                    filter: "none", // NO BLUR AS REQUESTED!
                    opacity: opacity,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
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
                          : "font-semibold text-base sm:text-lg text-neutral-600"
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
                        <span className="text-[10px] text-neutral-500 font-medium">
                          {brand.company} &bull; {brand.tag}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 font-normal mt-0.5">
                        {brand.company}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 3. BOTTOM CONTROLS: MODEL STEP PILLS & ARROWS ── */}
        <div className="shrink-0 flex flex-col items-center gap-3 z-10 px-4">
          {/* Interactive model dots/pills track */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-neutral-100/90 p-1.5 rounded-full border border-neutral-200/80 shadow-2xs">
            {BRANDS.map((b, idx) => {
              const isSelected = idx === activeIntIndex;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => scrollToBrand(idx)}
                  className={`relative flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer ${
                    isSelected
                      ? "px-3 py-1 bg-white text-neutral-900 shadow-xs font-semibold text-xs border border-black/5"
                      : "size-2.5 sm:size-3 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Jump to ${b.name}`}
                  title={`${b.name} (${b.company})`}
                >
                  {isSelected ? (
                    <span className="truncate max-w-[90px]">{b.name}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Minimalist Navigation Buttons & Step Indicator */}
          <div className="navigation flex items-center justify-center gap-4">
            <button
              id="prev"
              type="button"
              onClick={handlePrev}
              disabled={activeIntIndex === 0}
              className="size-8 sm:size-9 rounded-lg border border-black/10 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 hover:text-black flex items-center justify-center text-xs transition-all active:scale-95 shadow-2xs cursor-pointer"
              aria-label="Previous Brand"
              title="Previous Model"
            >
              <ChevronLeft className="size-4 stroke-[2]" />
            </button>

            <span className="font-mono text-xs text-neutral-500 font-medium">
              {String(activeIntIndex + 1).padStart(2, "0")} / {String(BRANDS.length).padStart(2, "0")}
            </span>

            <button
              id="next"
              type="button"
              onClick={handleNext}
              disabled={activeIntIndex === BRANDS.length - 1}
              className="size-8 sm:size-9 rounded-lg border border-black/10 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 hover:text-black flex items-center justify-center text-xs transition-all active:scale-95 shadow-2xs cursor-pointer"
              aria-label="Next Brand"
              title="Next Model"
            >
              <ChevronRight className="size-4 stroke-[2]" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 tracking-wide font-normal flex items-center gap-1.5">
            <span>scroll down to slide</span>
            <span className="opacity-50">&bull;</span>
            <span>drag or click arrows to explore</span>
          </p>
        </div>
      </div>
    </section>
  );
}
