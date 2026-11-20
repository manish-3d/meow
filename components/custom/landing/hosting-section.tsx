"use client";

import React, { useRef, useState, useEffect } from "react";
import { ShieldCheck, Monitor, Cloud, Play, Check, Send, Sparkles } from "lucide-react";

export function HostingSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Card 1: Workspace interactive state
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeBot, setActiveBot] = useState<"research" | "coding" | "job">("research");

  // Card 2: VM interactive takeover state
  const [isHumanControl, setIsHumanControl] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const viewportRef = useRef<HTMLDivElement>(null);

  // Card 3: Cycling active cron chip
  const [activeCron, setActiveCron] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCron((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Global mouse tracking across the Bento grid
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlightRef.current) {
      spotlightRef.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      spotlightRef.current.style.opacity = "1";
    }

    const cards = gridRef.current.querySelectorAll<HTMLDivElement>(".magic-bento-card");
    cards.forEach((card) => {
      const cRect = card.getBoundingClientRect();
      const cardX = e.clientX - cRect.left;
      const cardY = e.clientY - cRect.top;
      card.style.setProperty("--glow-x", `${cardX}px`);
      card.style.setProperty("--glow-y", `${cardY}px`);

      // Distance from pointer to card center
      const centerX = cRect.width / 2;
      const centerY = cRect.height / 2;
      const dist = Math.hypot(cardX - centerX, cardY - centerY);
      const maxDist = Math.max(cRect.width, cRect.height) * 0.9;
      const intensity = Math.max(0, Math.min(1, 1 - dist / maxDist));
      card.style.setProperty("--glow-intensity", intensity.toFixed(2));
    });
  };

  const handlePointerLeave = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll<HTMLDivElement>(".magic-bento-card");
      cards.forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, rgb: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement("span");
    ripple.className = "mb-click-ripple";
    ripple.style.setProperty("--ripple-rgb", rgb);
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  };

  // VM Viewport human mouse tracking
  const handleVmMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHumanControl || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(rect.width - 8, e.clientX - rect.left));
    const y = Math.max(8, Math.min(rect.height - 8, e.clientY - rect.top));
    setMousePos({ x, y });
  };

  return (
    <section id="hosting" className="mb-section-wrapper">
      <style jsx global>{`
        /* ============================================================================
           SECTION SHELL (MATCHES MEOW BOT LIGHT THEME)
           ============================================================================ */

        .mb-section-wrapper {
          width: 100%;
          background-color: #fafafa;
          padding: 88px 24px;
          color: #111111;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .mb-section-container {
          max-width: 1120px;
          margin: 0 auto;
        }

        .mb-section-header {
          margin-bottom: 40px;
          max-width: 680px;
        }

        .mb-section-title {
          margin: 0 0 12px;
          font-size: clamp(2.1rem, 4vw, 3.1rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.08;
          color: #111111;
        }

        .mb-section-subtitle {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.55;
          color: #52525b;
          font-weight: 400;
        }

        /* ============================================================================
           MAGIC BENTO GRID + GLOBAL SPOTLIGHT
           ============================================================================ */

        .magic-bento-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(var(--mb-columns, 4), minmax(0, 1fr));
          grid-auto-rows: var(--mb-row-height, 200px);
          gap: var(--mb-gap, 12px);
          isolation: isolate;
        }

        .magic-bento-global-spotlight {
          position: absolute;
          top: 0;
          left: 0;
          width: calc(var(--mb-spotlight-radius, 300px) * 2);
          height: calc(var(--mb-spotlight-radius, 300px) * 2);
          border-radius: 9999px;
          pointer-events: none;
          opacity: 0;
          z-index: 0;
          background: radial-gradient(
            circle,
            rgba(var(--mb-default-glow, 132, 204, 22), 0.1) 0%,
            rgba(56, 189, 248, 0.05) 40%,
            transparent 70%
          );
          transition: opacity 0.25s ease;
          will-change: transform, opacity;
        }

        /* ============================================================================
           MAGIC BENTO CARD + PROXIMITY BORDER GLOW
           ============================================================================ */

        .magic-bento-card {
          position: relative;
          grid-column: span var(--col-span, 1);
          grid-row: span var(--row-span, 1);
          border-radius: var(--mb-radius, 20px);
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 2px 14px rgba(15, 23, 42, 0.035);
          overflow: hidden;
          z-index: 1;
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.28s ease,
            border-color 0.28s ease;
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
        }

        .magic-bento-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.07);
        }

        /* Proximity border glow using CSS mask subtraction */
        .magic-bento-card.has-border-glow::after {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.5px;
          border-radius: inherit;
          pointer-events: none;
          z-index: 3;
          background: radial-gradient(
            var(--mb-spotlight-radius, 300px) circle at var(--glow-x) var(--glow-y),
            rgba(var(--card-glow-rgb, 132, 204, 22), calc(var(--glow-intensity) * 0.95)) 0%,
            rgba(var(--card-glow-rgb, 132, 204, 22), calc(var(--glow-intensity) * 0.35)) 42%,
            transparent 72%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }

        /* Soft inner radial wash */
        .mb-card-spotlight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(
            var(--mb-spotlight-radius, 300px) circle at var(--glow-x) var(--glow-y),
            rgba(var(--card-glow-rgb, 132, 204, 22), calc(var(--glow-intensity) * 0.09)) 0%,
            transparent 68%
          );
        }

        /* Click ripple effect */
        .mb-click-ripple {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 4;
          background: radial-gradient(
            circle,
            rgba(var(--ripple-rgb, 132, 204, 22), 0.26) 0%,
            rgba(var(--ripple-rgb, 132, 204, 22), 0.1) 45%,
            transparent 70%
          );
          transform: scale(0);
          opacity: 1;
          animation: mbRippleOut 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes mbRippleOut {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }

        /* ============================================================================
           CARD TYPOGRAPHY & LAYOUTS
           ============================================================================ */

        .mb-card-inner {
          position: relative;
          z-index: 2;
          height: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
          box-sizing: border-box;
        }

        .mb-layout-horizontal .mb-card-inner {
          flex-direction: row;
          align-items: center;
          gap: 20px;
        }

        .mb-horiz-copy {
          flex: 1 1 46%;
          min-width: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .mb-horiz-visual {
          flex: 1 1 54%;
          min-width: 0;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .mb-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .mb-title {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #111111;
        }

        .mb-title-sm {
          font-size: 1rem;
        }

        .mb-desc {
          margin: 6px 0 0;
          font-size: 0.86rem;
          line-height: 1.5;
          color: #52525b;
        }

        .mb-footer {
          padding-top: 10px;
          border-top: 1px solid rgba(15, 23, 42, 0.06);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.72rem;
          color: #71717a;
          letter-spacing: -0.01em;
        }

        /* Theme Badges */
        .mb-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 9999px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.68rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .mb-badge-sky {
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }

        .mb-badge-lime {
          background: #ecfccb;
          color: #4d7c0f;
          border: 1px solid #bef264;
        }

        .mb-badge-violet {
          background: #f3e8ff;
          color: #6d28d9;
          border: 1px solid #ddd6fe;
        }

        .mb-badge-emerald {
          background: #d1fae5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        /* ============================================================================
           VISUAL 1: INSTANT WEB WORKSPACE
           ============================================================================ */

        .mb-visual-wrap {
          flex: 1;
          min-height: 0;
          display: flex;
        }

        .mb-visual-shell {
          width: 100%;
          border-radius: 14px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.07);
        }

        .mb-visual-sky {
          background: linear-gradient(135deg, #e0f7ff 0%, #f0f9ff 60%, #ecfeff 100%);
        }

        .mb-visual-violet {
          background: linear-gradient(135deg, #f3e8ff 0%, #eef2ff 60%, #faf5ff 100%);
        }

        .mb-ws-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .mb-ws-dots {
          display: flex;
          gap: 4px;
        }

        .mb-ws-dots span {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.16);
        }

        .mb-ws-url {
          flex: 1;
          text-align: center;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.65rem;
          color: #475569;
          background: rgba(255, 255, 255, 0.8);
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mb-ws-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.85);
          border-radius: 7px;
          padding: 2px;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .mb-ws-toggle button {
          border: none;
          background: transparent;
          padding: 2px 7px;
          font-size: 0.64rem;
          font-weight: 600;
          color: #64748b;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mb-ws-toggle button.is-active {
          background: #111111;
          color: #a3e635;
        }

        .mb-ws-stage {
          flex: 1;
          min-height: 0;
          display: flex;
          gap: 8px;
          background: #ffffff;
          border-radius: 10px;
          padding: 8px;
          border: 1px solid rgba(15, 23, 42, 0.07);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .mb-ws-stage.is-mobile {
          width: 62%;
          margin: 0 auto;
          border-radius: 14px;
          border: 2px solid #18181b;
        }

        .mb-ws-sidebar {
          width: 38%;
          border-right: 1px solid rgba(15, 23, 42, 0.06);
          padding-right: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mb-ws-sidebar-label {
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.58rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.08em;
          padding-left: 4px;
        }

        .mb-ws-bot-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 6px;
          border-radius: 7px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .mb-ws-bot-item.is-active {
          background: #f8fafc;
          border-color: rgba(15, 23, 42, 0.08);
        }

        .mb-ws-bot-name {
          flex: 1;
          font-size: 0.68rem;
          font-weight: 600;
          color: #18181b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mb-ws-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          flex-shrink: 0;
        }

        .mb-ws-chat {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 6px;
        }

        .mb-ws-chat-head {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-bottom: 5px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
        }

        .mb-ws-chat-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: #111111;
        }

        .mb-ws-chat-sub {
          font-size: 0.6rem;
          color: #71717a;
        }

        .mb-ws-sync-pill {
          margin-left: auto;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.55rem;
          font-weight: 700;
          color: #4d7c0f;
          background: #ecfccb;
          padding: 2px 5px;
          border-radius: 4px;
        }

        .mb-ws-bubbles {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .mb-ws-bubble {
          font-size: 0.66rem;
          line-height: 1.35;
          padding: 5px 8px;
          border-radius: 8px;
          max-width: 92%;
        }

        .mb-ws-bubble-user {
          align-self: flex-end;
          background: #18181b;
          color: #ffffff;
        }

        .mb-ws-bubble-bot {
          align-self: flex-start;
          background: #f1f5f9;
          color: #1e293b;
          animation: mbFadeSlide 0.35s ease;
        }

        .mb-ws-check {
          color: #65a30d;
          font-weight: 800;
        }

        .mb-ws-input-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 7px;
          padding: 4px 6px 4px 8px;
          font-size: 0.62rem;
          color: #94a3b8;
        }

        .mb-ws-send-btn {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: #a3e635;
          color: #111111;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        @keyframes mbFadeSlide {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ============================================================================
           VISUAL 2: REMOTE BROWSER DESKTOP (LIVE CHROMIUM SANDBOX)
           ============================================================================ */

        .mb-vm-bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mb-vm-live {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.6rem;
          font-weight: 700;
          color: #6d28d9;
          background: #ffffff;
          border: 1px solid #ddd6fe;
          padding: 2px 7px;
          border-radius: 9999px;
        }

        .mb-vm-rec-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #ef4444;
          animation: mbPulseDot 1.4s infinite;
        }

        .mb-vm-address {
          flex: 1;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.63rem;
          color: #5b21b6;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(124, 58, 237, 0.14);
          border-radius: 6px;
          padding: 2px 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mb-vm-takeover {
          border: 1px solid #7c3aed;
          background: #7c3aed;
          color: #ffffff;
          font-size: 0.63rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mb-vm-takeover.is-human {
          background: #a3e635;
          border-color: #65a30d;
          color: #111111;
        }

        .mb-vm-viewport {
          position: relative;
          flex: 1;
          min-height: 112px;
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid rgba(124, 58, 237, 0.14);
          padding: 10px;
          overflow: hidden;
        }

        .mb-vm-viewport.is-human-mode {
          cursor: none;
          border-color: #84cc16;
          box-shadow: inset 0 0 0 1px rgba(132, 204, 22, 0.35);
        }

        .mb-vm-page-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          height: 100%;
        }

        .mb-vm-card-skeleton {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }

        .mb-vm-sk-wide {
          grid-column: span 2;
        }

        .mb-vm-sk-tag {
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.56rem;
          color: #7c3aed;
          font-weight: 700;
        }

        .mb-vm-sk-line {
          height: 6px;
          border-radius: 4px;
          background: #e2e8f0;
        }

        .mb-vm-sk-line.w-70 {
          width: 70%;
        }
        .mb-vm-sk-line.w-45 {
          width: 45%;
        }
        .mb-vm-sk-line.w-80 {
          width: 80%;
        }

        .mb-vm-sk-chart {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 36px;
        }

        .mb-vm-sk-chart i {
          flex: 1;
          border-radius: 3px;
          background: linear-gradient(to top, #c4b5fd, #8b5cf6);
        }

        .mb-vm-sk-pill {
          align-self: flex-start;
          font-size: 0.6rem;
          font-weight: 600;
          color: #ffffff;
          background: #18181b;
          padding: 2px 7px;
          border-radius: 5px;
        }

        /* Moving AI / Human Pointer */
        .mb-vm-pointer {
          position: absolute;
          display: flex;
          align-items: flex-start;
          gap: 3px;
          pointer-events: none;
          z-index: 4;
        }

        .mb-vm-pointer.is-auto {
          animation: mbAutoCursor 6.5s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        .mb-vm-pointer.is-manual {
          transform: translate(-2px, -2px);
          transition: transform 0.05s ease-out;
        }

        .mb-vm-pointer-tag {
          margin-top: 10px;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.58rem;
          font-weight: 700;
          color: #ffffff;
          background: #7c3aed;
          padding: 2px 6px;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(124, 58, 237, 0.3);
        }

        .mb-vm-pointer-tag.is-manual {
          background: #84cc16;
          color: #111111;
        }

        @keyframes mbAutoCursor {
          0%,
          100% {
            left: 22%;
            top: 28%;
          }
          25% {
            left: 68%;
            top: 24%;
          }
          50% {
            left: 64%;
            top: 68%;
          }
          75% {
            left: 26%;
            top: 66%;
          }
        }

        .mb-vm-console {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #18181b;
          color: #d4d4d8;
          border-radius: 8px;
          padding: 6px 10px;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.64rem;
          overflow: hidden;
          white-space: nowrap;
        }

        .mb-vm-prompt {
          color: #a3e635;
          font-weight: 700;
        }

        .mb-vm-log-line {
          animation: mbFadeSlide 0.3s ease;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @keyframes mbPulseDot {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.8);
          }
        }

        /* ============================================================================
           VISUAL 3: ALWAYS-ON CLOUD ENGINE (INNGEST CRON PIPELINE)
           ============================================================================ */

        .mb-cloud-pipeline {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f7fee7 0%, #ecfccb 55%, #dcfce7 100%);
          border: 1px solid rgba(101, 163, 13, 0.22);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          overflow: hidden;
        }

        .mb-pipe-col {
          display: flex;
          flex-direction: column;
          gap: 7px;
          flex: 0 0 auto;
        }

        .mb-pipe-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 8px;
          padding: 5px 9px;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.66rem;
          font-weight: 600;
          color: #3f3f46;
          transition: all 0.25s ease;
        }

        .mb-pipe-chip.is-firing {
          border-color: #84cc16;
          background: #ffffff;
          color: #111111;
          box-shadow: 0 3px 10px rgba(132, 204, 22, 0.22);
          transform: translateX(2px);
        }

        .mb-pipe-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #a3e635;
        }

        .mb-pipe-chip.is-firing .mb-pipe-dot {
          background: #65a30d;
          box-shadow: 0 0 0 3px rgba(132, 204, 22, 0.28);
        }

        .mb-pipe-svg {
          flex: 1;
          min-width: 44px;
          height: 108px;
        }

        .mb-pipe-track {
          stroke: rgba(101, 163, 13, 0.25);
          stroke-width: 1.75;
        }

        .mb-pipe-beam {
          stroke: #65a30d;
          stroke-width: 2.25;
          stroke-linecap: round;
          stroke-dasharray: 18 96;
          animation: mbBeamFlow 2.1s linear infinite;
        }

        .mb-beam-2 {
          animation-delay: 0.65s;
        }
        .mb-beam-3 {
          animation-delay: 1.3s;
        }

        @keyframes mbBeamFlow {
          from {
            stroke-dashoffset: 114;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .mb-pipe-hub {
          flex: 0 0 auto;
          background: #ffffff;
          border: 1px solid rgba(101, 163, 13, 0.25);
          border-radius: 11px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .mb-pipe-hub-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mb-pipe-hub-title {
          font-size: 0.74rem;
          font-weight: 700;
          color: #111111;
        }

        .mb-pipe-hub-sub {
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.59rem;
          color: #4d7c0f;
        }

        .mb-pipe-bars {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 22px;
        }

        .mb-pipe-bar {
          width: 5px;
          height: 100%;
          border-radius: 3px;
          background: #84cc16;
          animation: mbUptimePulse 1.8s ease-in-out infinite;
        }

        @keyframes mbUptimePulse {
          0%,
          100% {
            transform: scaleY(0.55);
            opacity: 0.65;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        /* ============================================================================
           VISUAL 4: ISOLATED SANDBOXES COMPACT CARD
           ============================================================================ */

        .mb-compact-visual {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .mb-sec-widget {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%);
          border: 1px solid rgba(16, 185, 129, 0.18);
          border-radius: 12px;
          padding: 10px 12px;
        }

        .mb-sec-ring {
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: rgba(132, 204, 22, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          animation: mbPulseRing 2.4s ease-in-out infinite;
        }

        .mb-sec-core {
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          background: #ffffff;
          border: 1px solid rgba(101, 163, 13, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes mbPulseRing {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(132, 204, 22, 0.3);
          }
          50% {
            box-shadow: 0 0 0 7px rgba(132, 204, 22, 0);
          }
        }

        .mb-sec-stats {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mb-sec-stat {
          display: flex;
          flex-direction: column;
        }

        .mb-sec-stat strong {
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #111111;
        }

        .mb-sec-stat span {
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.62rem;
          color: #64748b;
        }

        .mb-sec-divider {
          width: 1px;
          height: 24px;
          background: rgba(15, 23, 42, 0.1);
        }

        /* ============================================================================
           RESPONSIVE BREAKPOINTS
           ============================================================================ */

        @media (max-width: 1024px) {
          .magic-bento-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: auto;
          }

          .magic-bento-card {
            grid-column: span 2 !important;
            grid-row: span 1 !important;
          }

          .mb-layout-horizontal .mb-card-inner {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 640px) {
          .mb-section-wrapper {
            padding: 56px 16px;
          }

          .magic-bento-grid {
            grid-template-columns: 1fr;
          }

          .magic-bento-card {
            grid-column: span 1 !important;
          }

          .mb-cloud-pipeline {
            flex-direction: column;
            gap: 10px;
          }

          .mb-pipe-svg {
            display: none;
          }

          .mb-ws-sidebar {
            display: none;
          }
        }
      `}</style>

      <div className="mb-section-container">
        {/* Section Header */}
        <div className="mb-section-header">
          <h2 className="mb-section-title">how your bots run.</h2>
          <p className="mb-section-subtitle">
            100% web-first. access from any browser, while background workers run 24/7 in our cloud.
          </p>
        </div>

        {/* Magic Bento Grid Container */}
        <div
          ref={gridRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="magic-bento-grid"
          style={
            {
              "--mb-columns": "4",
              "--mb-row-height": "220px",
              "--mb-gap": "14px",
              "--mb-spotlight-radius": "320px",
              "--mb-default-glow": "132, 204, 22",
            } as React.CSSProperties
          }
        >
          {/* Global Spotlight following mouse cursor across cards */}
          <div ref={spotlightRef} className="magic-bento-global-spotlight" />

          {/* ────────────────────────────────────────────────────────── */}
          {/* CARD 1: INSTANT WEB WORKSPACE (2 COLS x 2 ROWS)            */}
          {/* ────────────────────────────────────────────────────────── */}
          <div
            onClick={(e) => handleCardClick(e, "3, 105, 161")}
            className="magic-bento-card has-border-glow"
            style={
              {
                "--col-span": "2",
                "--row-span": "2",
                "--card-glow-rgb": "3, 105, 161",
              } as React.CSSProperties
            }
          >
            <div className="mb-card-spotlight" />
            <div className="mb-card-inner">
              {/* Header */}
              <div>
                <div className="mb-header-row">
                  <h3 className="mb-title">instant web workspace</h3>
                  <span className="mb-badge mb-badge-sky">zero install</span>
                </div>
                <p className="mb-desc">
                  Open Meow Bot in Chrome, Safari, or mobile. Create agents, chat with your crew, and configure routines in seconds.
                </p>
              </div>

              {/* Visual 1: Interactive Browser Workspace */}
              <div className="mb-visual-wrap">
                <div className="mb-visual-shell mb-visual-sky">
                  {/* Browser toolbar */}
                  <div className="mb-ws-toolbar">
                    <div className="mb-ws-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mb-ws-url">meow.bot/workspace/agents</div>
                    <div className="mb-ws-toggle">
                      <button
                        type="button"
                        className={!isMobileView ? "is-active" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMobileView(false);
                        }}
                      >
                        Desktop
                      </button>
                      <button
                        type="button"
                        className={isMobileView ? "is-active" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMobileView(true);
                        }}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>

                  {/* Stage area */}
                  <div className={`mb-ws-stage ${isMobileView ? "is-mobile" : ""}`}>
                    {/* Sidebar */}
                    <div className="mb-ws-sidebar">
                      <span className="mb-ws-sidebar-label">AGENTS</span>
                      <button
                        type="button"
                        className={`mb-ws-bot-item ${activeBot === "research" ? "is-active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBot("research");
                        }}
                      >
                        <span className="mb-ws-live-dot bg-emerald-500" />
                        <span className="mb-ws-bot-name">Research Bot</span>
                      </button>
                      <button
                        type="button"
                        className={`mb-ws-bot-item ${activeBot === "coding" ? "is-active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBot("coding");
                        }}
                      >
                        <span className="mb-ws-live-dot bg-sky-500" />
                        <span className="mb-ws-bot-name">Coding Bot</span>
                      </button>
                      <button
                        type="button"
                        className={`mb-ws-bot-item ${activeBot === "job" ? "is-active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBot("job");
                        }}
                      >
                        <span className="mb-ws-live-dot bg-lime-500" />
                        <span className="mb-ws-bot-name">Job Bot</span>
                      </button>
                    </div>

                    {/* Chat view */}
                    <div className="mb-ws-chat">
                      <div className="mb-ws-chat-head">
                        <div>
                          <div className="mb-ws-chat-title">
                            {activeBot === "research" && "Research Bot"}
                            {activeBot === "coding" && "Coding Bot"}
                            {activeBot === "job" && "Job Bot"}
                          </div>
                          <div className="mb-ws-chat-sub">
                            {activeBot === "research" && "web search • synthesis"}
                            {activeBot === "coding" && "git branch • compiling"}
                            {activeBot === "job" && "chromium vm • auto-apply"}
                          </div>
                        </div>
                        <span className="mb-ws-sync-pill">LIVE SYNC</span>
                      </div>

                      <div className="mb-ws-bubbles">
                        <div className="mb-ws-bubble mb-ws-bubble-user">
                          {activeBot === "research" && "Find 5 senior AI engineer roles in SF"}
                          {activeBot === "coding" && "Build responsive bento component"}
                          {activeBot === "job" && "Auto-apply to daily verified queue"}
                        </div>
                        <div className="mb-ws-bubble mb-ws-bubble-bot">
                          <span className="mb-ws-check">✓ </span>
                          {activeBot === "research" && "Extracted 5 verified roles. Generating tailored CVs..."}
                          {activeBot === "coding" && "Completed with 100% test coverage and GPU motion"}
                          {activeBot === "job" && "12 applications submitted via isolated cloud browser"}
                        </div>
                      </div>

                      <div className="mb-ws-input-bar">
                        <span>Delegate any task to {activeBot} bot...</span>
                        <span className="mb-ws-send-btn">↑</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mb-footer">
                Works on any device • Instant access • Zero local install
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CARD 2: REMOTE BROWSER DESKTOP (2 COLS x 2 ROWS)           */}
          {/* ────────────────────────────────────────────────────────── */}
          <div
            onClick={(e) => handleCardClick(e, "109, 40, 217")}
            className="magic-bento-card has-border-glow"
            style={
              {
                "--col-span": "2",
                "--row-span": "2",
                "--card-glow-rgb": "109, 40, 217",
              } as React.CSSProperties
            }
          >
            <div className="mb-card-spotlight" />
            <div className="mb-card-inner">
              {/* Header */}
              <div>
                <div className="mb-header-row">
                  <h3 className="mb-title">remote browser desktop</h3>
                  <span className="mb-badge mb-badge-violet">browserbase VM 🖥️</span>
                </div>
                <p className="mb-desc">
                  When agents navigate websites, they run inside secure cloud Chromium sandboxes. Watch the live stream or take the mouse anytime.
                </p>
              </div>

              {/* Visual 2: Live Chromium Remote Sandbox */}
              <div className="mb-visual-wrap">
                <div className="mb-visual-shell mb-visual-violet">
                  {/* Remote VM Bar */}
                  <div className="mb-vm-bar">
                    <div className="mb-vm-live">
                      <span className="mb-vm-rec-dot" />
                      <span>LIVE 60FPS</span>
                    </div>
                    <div className="mb-vm-address">chromium://sandbox-vm-8492.local</div>
                    <button
                      type="button"
                      className={`mb-vm-takeover ${isHumanControl ? "is-human" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHumanControl(!isHumanControl);
                      }}
                    >
                      {isHumanControl ? "Release Control" : "Take Control"}
                    </button>
                  </div>

                  {/* Remote VM Viewport */}
                  <div
                    ref={viewportRef}
                    onMouseMove={handleVmMouseMove}
                    className={`mb-vm-viewport ${isHumanControl ? "is-human-mode" : ""}`}
                  >
                    {/* Mock Website UI */}
                    <div className="mb-vm-page-grid">
                      <div className="mb-vm-card-skeleton mb-vm-sk-wide">
                        <span className="mb-vm-sk-tag">GREENHOUSE.IO / CAREERS</span>
                        <div className="mb-vm-sk-line w-70" />
                        <div className="mb-vm-sk-line w-45" />
                      </div>
                      <div className="mb-vm-card-skeleton">
                        <div className="mb-vm-sk-chart">
                          <i style={{ height: "45%" }} />
                          <i style={{ height: "75%" }} />
                          <i style={{ height: "60%" }} />
                          <i style={{ height: "90%" }} />
                        </div>
                      </div>
                      <div className="mb-vm-card-skeleton">
                        <div className="mb-vm-sk-line w-80" />
                        <div className="mb-vm-sk-pill">Apply Now</div>
                      </div>
                    </div>

                    {/* Pointer Cursor (Auto AI vs Human Manual Takeover) */}
                    <div
                      className={`mb-vm-pointer ${isHumanControl ? "is-manual" : "is-auto"}`}
                      style={
                        isHumanControl
                          ? { left: `${mousePos.x}px`, top: `${mousePos.y}px` }
                          : undefined
                      }
                    >
                      {/* SVG Cursor Pointer */}
                      <svg
                        className="w-4 h-4 text-neutral-900 drop-shadow-md"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M4 0l16 12-7 1.5 4 8.5-3 1.5-4-8.5-6 5.5z" />
                      </svg>
                      <span className={`mb-vm-pointer-tag ${isHumanControl ? "is-manual" : ""}`}>
                        {isHumanControl ? "Human Takeover" : "Agent Navigating"}
                      </span>
                    </div>
                  </div>

                  {/* VM Console Line */}
                  <div className="mb-vm-console">
                    <span className="mb-vm-prompt">meow@vm-8492:~$</span>
                    <span className="mb-vm-log-line">
                      {isHumanControl
                        ? "Human operator override engaged · Input streaming"
                        : "Navigating to greenhouse.io/jobs... bypass captchas"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mb-footer">
                Live streaming • Human takeover • Zero CAPTCHA friction
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CARD 3: ALWAYS-ON CLOUD ENGINE (3 COLS x 1 ROW HORIZONTAL) */}
          {/* ────────────────────────────────────────────────────────── */}
          <div
            onClick={(e) => handleCardClick(e, "101, 163, 13")}
            className="magic-bento-card has-border-glow mb-layout-horizontal"
            style={
              {
                "--col-span": "3",
                "--row-span": "1",
                "--card-glow-rgb": "101, 163, 13",
              } as React.CSSProperties
            }
          >
            <div className="mb-card-spotlight" />
            <div className="mb-card-inner">
              {/* Copy */}
              <div className="mb-horiz-copy">
                <div>
                  <div className="mb-header-row">
                    <h3 className="mb-title mb-title-sm">always-on cloud engine</h3>
                    <span className="mb-badge mb-badge-lime">runs 24/7 ⚡</span>
                  </div>
                  <p className="mb-desc">
                    Your routines execute on our durable cloud servers. Morning briefs deliver and emails are triaged even when your laptop is shut off.
                  </p>
                </div>
                <div className="mb-footer">
                  Inngest durable cron • Zero dropped runs • 100% serverless
                </div>
              </div>

              {/* Visual 3: Live Inngest Pipeline & Equalizer Hub */}
              <div className="mb-horiz-visual">
                <div className="mb-cloud-pipeline">
                  {/* Cron Triggers Column */}
                  <div className="mb-pipe-col">
                    <div className={`mb-pipe-chip ${activeCron === 0 ? "is-firing" : ""}`}>
                      <span className="mb-pipe-dot" />
                      <span>08:00 AM • Daily Brief</span>
                    </div>
                    <div className={`mb-pipe-chip ${activeCron === 1 ? "is-firing" : ""}`}>
                      <span className="mb-pipe-dot" />
                      <span>01:00 PM • Email Triage</span>
                    </div>
                    <div className={`mb-pipe-chip ${activeCron === 2 ? "is-firing" : ""}`}>
                      <span className="mb-pipe-dot" />
                      <span>11:00 PM • Data Backup</span>
                    </div>
                  </div>

                  {/* Flowing SVG Connecting Beams */}
                  <svg className="mb-pipe-svg" viewBox="0 0 100 108" fill="none">
                    {/* Track 1 */}
                    <path d="M 0 20 C 50 20 50 54 100 54" className="mb-pipe-track" />
                    <path d="M 0 20 C 50 20 50 54 100 54" className="mb-pipe-beam mb-beam-1" />

                    {/* Track 2 */}
                    <path d="M 0 54 L 100 54" className="mb-pipe-track" />
                    <path d="M 0 54 L 100 54" className="mb-pipe-beam mb-beam-2" />

                    {/* Track 3 */}
                    <path d="M 0 88 C 50 88 50 54 100 54" className="mb-pipe-track" />
                    <path d="M 0 88 C 50 88 50 54 100 54" className="mb-pipe-beam mb-beam-3" />
                  </svg>

                  {/* Hub Target */}
                  <div className="mb-pipe-hub">
                    <div className="mb-pipe-hub-top">
                      <Cloud className="size-4 text-[#65a30d]" />
                      <div>
                        <div className="mb-pipe-hub-title">Inngest Engine</div>
                        <div className="mb-pipe-hub-sub">Active Durable Runs</div>
                      </div>
                    </div>
                    <div className="mb-pipe-bars">
                      <span className="mb-pipe-bar" style={{ animationDelay: "0.1s" }} />
                      <span className="mb-pipe-bar" style={{ animationDelay: "0.4s" }} />
                      <span className="mb-pipe-bar" style={{ animationDelay: "0.25s" }} />
                      <span className="mb-pipe-bar" style={{ animationDelay: "0.55s" }} />
                      <span className="mb-pipe-bar" style={{ animationDelay: "0.35s" }} />
                      <span className="mb-pipe-bar" style={{ animationDelay: "0.7s" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CARD 4: ISOLATED SANDBOXES (1 COL x 1 ROW COMPACT)         */}
          {/* ────────────────────────────────────────────────────────── */}
          <div
            onClick={(e) => handleCardClick(e, "16, 185, 129")}
            className="magic-bento-card has-border-glow"
            style={
              {
                "--col-span": "1",
                "--row-span": "1",
                "--card-glow-rgb": "16, 185, 129",
              } as React.CSSProperties
            }
          >
            <div className="mb-card-spotlight" />
            <div className="mb-card-inner">
              <div>
                <div className="mb-header-row">
                  <h3 className="mb-title mb-title-sm">isolated sandboxes</h3>
                  <span className="mb-badge mb-badge-emerald">zero leaks</span>
                </div>
                <p className="mb-desc text-xs">
                  Disposable dedicated environments with zero host exposure.
                </p>
              </div>

              {/* Compact Security Widget */}
              <div className="mb-compact-visual">
                <div className="mb-sec-widget">
                  <div className="mb-sec-ring">
                    <div className="mb-sec-core">
                      <ShieldCheck className="size-4 text-[#65a30d]" />
                    </div>
                  </div>
                  <div className="mb-sec-stats">
                    <div className="mb-sec-stat">
                      <strong>0ms</strong>
                      <span>Cold start</span>
                    </div>
                    <div className="mb-sec-divider" />
                    <div className="mb-sec-stat">
                      <strong>100%</strong>
                      <span>Isolated</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-footer">
                SOC2 Type II • Zero local exposure
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
