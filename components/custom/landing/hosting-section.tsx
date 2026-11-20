"use client";

import React, { useRef, useState, useEffect } from "react";
import { Cloud, Lock } from "lucide-react";

export function HostingSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Card 1: Abstract workspace skeleton cycle (every 3s)
  const [activeWorkspaceRow, setActiveWorkspaceRow] = useState(0);

  useEffect(() => {
    const rowTimer = setInterval(() => {
      setActiveWorkspaceRow((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(rowTimer);
  }, []);

  // Card 2: Remote desktop human mouse takeover state
  const [isTakeover, setIsTakeover] = useState(false);
  const [takeoverPos, setTakeoverPos] = useState({ x: 50, y: 50 });
  const remoteViewportRef = useRef<HTMLDivElement>(null);

  const handleRemoteMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTakeover || !remoteViewportRef.current) return;
    const rect = remoteViewportRef.current.getBoundingClientRect();
    const x = Math.max(12, Math.min(rect.width - 12, e.clientX - rect.left));
    const y = Math.max(12, Math.min(rect.height - 12, e.clientY - rect.top));
    setTakeoverPos({ x, y });
  };

  // Card 3: Sequential node trigger state (every 2.4s)
  const [activeScheduleNode, setActiveScheduleNode] = useState(0);

  useEffect(() => {
    const nodeTimer = setInterval(() => {
      setActiveScheduleNode((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(nodeTimer);
  }, []);

  // Subtle proximity spotlight and hairline border glow
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlightRef.current) {
      spotlightRef.current.style.transform = `translate(${x - 220}px, ${y - 220}px)`;
      spotlightRef.current.style.opacity = "1";
    }

    const cards = gridRef.current.querySelectorAll<HTMLDivElement>(".magic-bento-card");
    cards.forEach((card) => {
      const cRect = card.getBoundingClientRect();
      const cardX = e.clientX - cRect.left;
      const cardY = e.clientY - cRect.top;
      card.style.setProperty("--glow-x", `${cardX}px`);
      card.style.setProperty("--glow-y", `${cardY}px`);

      // Gentle proximity calculation
      const centerX = cRect.width / 2;
      const centerY = cRect.height / 2;
      const dist = Math.hypot(cardX - centerX, cardY - centerY);
      const maxDist = Math.max(cRect.width, cRect.height) * 0.85;
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

  return (
    <section id="hosting" className="bento-section-root">
      <style jsx global>{`
        /* ============================================================================
           SECTION ROOT & CONTAINER (LIGHT-MODE CRAFT)
           ============================================================================ */

        .bento-section-root {
          width: 100%;
          background-color: #fafafa;
          padding: 96px 24px;
          color: #111111;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .bento-container {
          max-width: 1120px;
          margin: 0 auto;
        }

        .bento-header {
          margin-bottom: 36px;
          max-width: 620px;
        }

        .bento-header-title {
          margin: 0 0 10px;
          font-size: clamp(2rem, 3.6vw, 2.75rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.1;
          color: #111111;
        }

        .bento-header-sub {
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
          color: #64748b;
          font-weight: 400;
        }

        /* ============================================================================
           ASYMMETRIC 2-ROW BENTO GRID
           ============================================================================ */

        .magic-bento-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 16px;
          isolation: isolate;
        }

        @media (max-width: 900px) {
          .magic-bento-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Subtle Global Grid Spotlight */
        .magic-bento-global-spotlight {
          position: absolute;
          top: 0;
          left: 0;
          width: 440px;
          height: 440px;
          border-radius: 9999px;
          pointer-events: none;
          opacity: 0;
          z-index: 0;
          background: radial-gradient(
            circle,
            rgba(132, 204, 22, 0.05) 0%,
            rgba(15, 23, 42, 0.02) 40%,
            transparent 70%
          );
          transition: opacity 0.25s ease;
          will-change: transform, opacity;
        }

        /* ============================================================================
           CARD SHELL & REFINED PROXIMITY HIGHLIGHT
           ============================================================================ */

        .magic-bento-card {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          overflow: hidden;
          z-index: 1;
          padding: 28px 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: border-color 0.2s ease, transform 0.2s ease;
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
        }

        .magic-bento-card:hover {
          border-color: rgba(15, 23, 42, 0.12);
          transform: translateY(-1px);
        }

        /* Card background variants */
        .magic-bento-card.surface-white {
          background-color: #ffffff;
        }

        .magic-bento-card.surface-offwhite {
          background-color: #f4f7fa;
        }

        /* Razor-thin proximity border highlight (masked hairline) */
        .magic-bento-card::after {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          pointer-events: none;
          z-index: 3;
          background: radial-gradient(
            280px circle at var(--glow-x) var(--glow-y),
            rgba(132, 204, 22, calc(var(--glow-intensity) * 0.45)) 0%,
            rgba(15, 23, 42, calc(var(--glow-intensity) * 0.12)) 40%,
            transparent 70%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }

        /* Subtle inner card sheen */
        .mb-card-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(
            260px circle at var(--glow-x) var(--glow-y),
            rgba(132, 204, 22, calc(var(--glow-intensity) * 0.03)) 0%,
            transparent 65%
          );
        }

        .mb-card-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* Typography */
        .mb-card-title {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #111111;
        }

        .mb-card-subtitle {
          margin: 4px 0 0;
          font-size: 0.88rem;
          line-height: 1.45;
          color: #64748b;
          font-weight: 400;
        }

        /* ============================================================================
           CARD 1: INSTANT WEB WORKSPACE (CROP FRAME)
           ============================================================================ */

        .card-workspace-frame {
          margin-top: 24px;
          height: 200px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-bottom: none;
          border-radius: 12px 12px 0 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .card-window-header {
          height: 32px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-window-dots {
          display: flex;
          gap: 5px;
        }

        .card-window-dot {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: #cbd5e1;
        }

        .card-window-url-pill {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.62rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .card-workspace-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .card-workspace-sidebar {
          width: 48px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          padding: 12px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .card-ws-icon-active {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-ws-pulse-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #84cc16;
          box-shadow: 0 0 0 2px #ffffff;
          animation: mbPulseLime 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .card-ws-icon-dim {
          width: 24px;
          height: 18px;
          border-radius: 5px;
          background: #f1f5f9;
        }

        .card-workspace-stage {
          flex: 1;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #ffffff;
        }

        .card-ws-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
          background: #f8fafc;
          transition: all 0.3s ease;
        }

        .card-ws-row.is-active {
          background: #ffffff;
          border-color: rgba(132, 204, 22, 0.35);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
        }

        .card-ws-row-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-ws-row-avatar {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: #e2e8f0;
        }

        .card-ws-row.is-active .card-ws-row-avatar {
          background: #ecfccb;
        }

        .card-ws-row-line {
          height: 6px;
          border-radius: 3px;
          background: #cbd5e1;
        }

        .card-ws-row.is-active .card-ws-row-line {
          background: #94a3b8;
        }

        .card-ws-row-pill {
          width: 28px;
          height: 8px;
          border-radius: 4px;
          background: #e2e8f0;
        }

        .card-ws-row.is-active .card-ws-row-pill {
          background: #84cc16;
          opacity: 0.85;
        }

        /* ============================================================================
           CARD 2: REMOTE BROWSER DESKTOP (CLEAN LIGHT CANVAS)
           ============================================================================ */

        .card-browser-canvas {
          margin-top: 24px;
          height: 200px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .card-browser-viewport {
          flex: 1;
          position: relative;
          padding: 12px;
          overflow: hidden;
          background: #fafafa;
        }

        .card-browser-viewport.is-human-active {
          cursor: none;
        }

        .card-takeover-btn {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
          font-size: 0.68rem;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-takeover-btn:hover {
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .card-takeover-btn.is-active {
          background: #111111;
          border-color: #111111;
          color: #a3e635;
        }

        .card-skeleton-blocks {
          display: flex;
          flex-direction: column;
          gap: 8px;
          height: 100%;
        }

        .card-sk-row {
          display: flex;
          gap: 8px;
        }

        .card-sk-box {
          flex: 1;
          height: 52px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-sk-bar {
          height: 6px;
          border-radius: 3px;
          background: #e2e8f0;
        }

        .card-sk-bar.w-60 {
          width: 60%;
        }

        .card-sk-bar.w-40 {
          width: 40%;
        }

        .card-sk-bar.w-80 {
          width: 80%;
        }

        /* SVG Mouse Pointer */
        .card-pointer-tag-wrap {
          position: absolute;
          display: flex;
          align-items: flex-start;
          pointer-events: none;
          z-index: 5;
        }

        .card-pointer-tag-wrap.is-auto {
          animation: mbPointerGlide 6.8s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        .card-pointer-tag-wrap.is-manual {
          transition: transform 0.04s ease-out;
        }

        .card-pointer-tag {
          margin-left: 4px;
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: 9999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
          font-size: 0.62rem;
          font-weight: 500;
          color: #1e293b;
          white-space: nowrap;
        }

        .card-pointer-lime-dot {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: #84cc16;
        }

        @keyframes mbPointerGlide {
          0%,
          100% {
            left: 20%;
            top: 25%;
          }
          32% {
            left: 64%;
            top: 22%;
          }
          68% {
            left: 48%;
            top: 64%;
          }
        }

        /* ============================================================================
           CARD 3: ALWAYS-ON CLOUD ENGINE (HORIZONTAL NODE FLOW)
           ============================================================================ */

        .card-cloud-flow {
          margin-top: 24px;
          height: 150px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;
        }

        /* Hairstyle connector line */
        .card-flow-line {
          position: absolute;
          top: 50%;
          left: 40px;
          right: 120px;
          height: 1px;
          background: #cbd5e1;
          z-index: 1;
        }

        /* Traveling Lime Glide Dot */
        .card-flow-travel-dot {
          position: absolute;
          top: calc(50% - 4px);
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #84cc16;
          box-shadow: 0 0 0 3px rgba(132, 204, 22, 0.25);
          z-index: 2;
          animation: mbFlowGlide 2.4s ease-in-out infinite;
        }

        @keyframes mbFlowGlide {
          0% {
            left: 40px;
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            left: calc(100% - 130px);
            opacity: 0;
          }
        }

        .card-flow-schedules {
          display: flex;
          gap: 12px;
          z-index: 2;
        }

        .card-flow-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.72rem;
          font-weight: 500;
          color: #475569;
          transition: all 0.25s ease;
        }

        .card-flow-chip.is-active {
          border-color: rgba(132, 204, 22, 0.6);
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(132, 204, 22, 0.12);
        }

        .card-flow-chip-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #cbd5e1;
        }

        .card-flow-chip.is-active .card-flow-chip-dot {
          background: #84cc16;
        }

        .card-flow-worker-card {
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .card-flow-worker-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f7fee7;
          border: 1px solid #ecfccb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #65a30d;
        }

        .card-flow-worker-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.2;
        }

        .card-flow-worker-sub {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.62rem;
          color: #64748b;
        }

        /* ============================================================================
           CARD 4: ISOLATED SANDBOXES (MINIMAL PILL PANEL)
           ============================================================================ */

        .card-sandbox-panel {
          margin-top: 24px;
          height: 150px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .card-sandbox-lock-sq {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
          flex-shrink: 0;
        }

        .card-sandbox-bars {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .card-sandbox-bar-muted {
          height: 7px;
          border-radius: 4px;
          background: #e2e8f0;
        }

        .card-sandbox-bar-lime {
          height: 7px;
          border-radius: 4px;
          background: #84cc16;
          width: 72%;
          position: relative;
          overflow: hidden;
          animation: mbBarPulse 3s ease-in-out infinite;
        }

        @keyframes mbBarPulse {
          0%,
          100% {
            width: 72%;
            opacity: 0.9;
          }
          50% {
            width: 84%;
            opacity: 1;
          }
        }

        @keyframes mbPulseLime {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.7;
          }
        }
      `}</style>

      <div className="bento-container">
        {/* Section Header */}
        <div className="bento-header">
          <h2 className="bento-header-title">how your bots run.</h2>
          <p className="bento-header-sub">
            100% web-first. Access from any browser, while background workers run 24/7 in our cloud.
          </p>
        </div>

        {/* Asymmetric 2-Row Bento Grid */}
        <div
          ref={gridRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="magic-bento-grid"
        >
          {/* Subtle cursor spotlight */}
          <div ref={spotlightRef} className="magic-bento-global-spotlight" />

          {/* ────────────────────────────────────────────────────────── */}
          {/* CARD 1: TOP LEFT (Wide, Crisp White #FFFFFF)               */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="magic-bento-card surface-white">
            <div className="mb-card-sheen" />
            <div className="mb-card-content">
              {/* Copy */}
              <div>
                <h3 className="mb-card-title">instant web workspace</h3>
                <p className="mb-card-subtitle">
                  Access your agents instantly in any browser.
                </p>
              </div>

              {/* Minimalist Browser Frame cropped into bottom edge */}
              <div className="card-workspace-frame">
                <div className="card-window-header">
                  <div className="card-window-dots">
                    <span className="card-window-dot" />
                    <span className="card-window-dot" />
                    <span className="card-window-dot" />
                  </div>
                  <span className="card-window-url-pill">meow.bot/workspace</span>
                  <div style={{ width: 32 }} />
                </div>

                <div className="card-workspace-body">
                  {/* Clean left sidebar icon */}
                  <div className="card-workspace-sidebar">
                    <div className="card-ws-icon-active">
                      <span className="card-ws-pulse-dot" />
                      <div className="w-3 h-3 rounded bg-slate-400/40" />
                    </div>
                    <div className="card-ws-icon-dim" />
                    <div className="card-ws-icon-dim" />
                  </div>

                  {/* Clean abstract skeleton rows cycling active state */}
                  <div className="card-workspace-stage">
                    <div
                      className={`card-ws-row ${
                        activeWorkspaceRow === 0 ? "is-active" : ""
                      }`}
                    >
                      <div className="card-ws-row-left">
                        <div className="card-ws-row-avatar" />
                        <div className="card-ws-row-line" style={{ width: 110 }} />
                      </div>
                      <div className="card-ws-row-pill" />
                    </div>

                    <div
                      className={`card-ws-row ${
                        activeWorkspaceRow === 1 ? "is-active" : ""
                      }`}
                    >
                      <div className="card-ws-row-left">
                        <div className="card-ws-row-avatar" />
                        <div className="card-ws-row-line" style={{ width: 85 }} />
                      </div>
                      <div className="card-ws-row-pill" />
                    </div>

                    <div
                      className={`card-ws-row ${
                        activeWorkspaceRow === 2 ? "is-active" : ""
                      }`}
                    >
                      <div className="card-ws-row-left">
                        <div className="card-ws-row-avatar" />
                        <div className="card-ws-row-line" style={{ width: 125 }} />
                      </div>
                      <div className="card-ws-row-pill" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CARD 2: TOP RIGHT (Compact, Soft Off-White #F4F7FA)        */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="magic-bento-card surface-offwhite">
            <div className="mb-card-sheen" />
            <div className="mb-card-content">
              {/* Copy */}
              <div>
                <h3 className="mb-card-title">remote browser desktop</h3>
                <p className="mb-card-subtitle">Watch live or take the mouse anytime.</p>
              </div>

              {/* Clean Light-mode Browser Window */}
              <div className="card-browser-canvas">
                <div className="card-window-header">
                  <div className="card-window-dots">
                    <span className="card-window-dot" />
                    <span className="card-window-dot" />
                    <span className="card-window-dot" />
                  </div>
                  <button
                    type="button"
                    className={`card-takeover-btn ${isTakeover ? "is-active" : ""}`}
                    onClick={() => setIsTakeover(!isTakeover)}
                  >
                    {isTakeover ? "Release control" : "Take control"}
                  </button>
                </div>

                <div
                  ref={remoteViewportRef}
                  onMouseMove={handleRemoteMouseMove}
                  className={`card-browser-viewport ${isTakeover ? "is-human-active" : ""}`}
                >
                  {/* Flat gray skeleton UI blocks */}
                  <div className="card-skeleton-blocks">
                    <div className="card-sk-bar w-40" />
                    <div className="card-sk-row">
                      <div className="card-sk-box">
                        <div className="card-sk-bar w-60" />
                        <div className="card-sk-bar w-40" />
                      </div>
                      <div className="card-sk-box">
                        <div className="card-sk-bar w-80" />
                        <div className="card-sk-bar w-40" />
                      </div>
                    </div>
                    <div className="card-sk-bar w-60" />
                  </div>

                  {/* SVG Mouse Pointer + Lime Pill Tag */}
                  <div
                    className={`card-pointer-tag-wrap ${
                      isTakeover ? "is-manual" : "is-auto"
                    }`}
                    style={
                      isTakeover
                        ? { left: `${takeoverPos.x}px`, top: `${takeoverPos.y}px` }
                        : undefined
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.18))" }}
                    >
                      <path
                        d="M2.5 1.5L6.5 14L8.8 8.8L14 6.5L2.5 1.5Z"
                        fill="#111111"
                        stroke="#FFFFFF"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="card-pointer-tag">
                      <span className="card-pointer-lime-dot" />
                      {isTakeover ? "You" : "Meow Bot"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CARD 3: BOTTOM LEFT (Wide, Soft Off-White #F4F7FA)         */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="magic-bento-card surface-offwhite">
            <div className="mb-card-sheen" />
            <div className="mb-card-content">
              {/* Copy */}
              <div>
                <h3 className="mb-card-title">always-on cloud engine</h3>
                <p className="mb-card-subtitle">
                  Automate tasks with continuous background workers.
                </p>
              </div>

              {/* Spacious horizontal node flow */}
              <div className="card-cloud-flow">
                {/* Hairline connector line */}
                <div className="card-flow-line" />

                {/* Animated Lime Glide Dot */}
                <div className="card-flow-travel-dot" />

                {/* 3 Schedule Chips */}
                <div className="card-flow-schedules">
                  <div
                    className={`card-flow-chip ${
                      activeScheduleNode === 0 ? "is-active" : ""
                    }`}
                  >
                    <span className="card-flow-chip-dot" />
                    <span>08:00 Brief</span>
                  </div>
                  <div
                    className={`card-flow-chip ${
                      activeScheduleNode === 1 ? "is-active" : ""
                    }`}
                  >
                    <span className="card-flow-chip-dot" />
                    <span>13:00 Triage</span>
                  </div>
                  <div
                    className={`card-flow-chip ${
                      activeScheduleNode === 2 ? "is-active" : ""
                    }`}
                  >
                    <span className="card-flow-chip-dot" />
                    <span>23:00 Sync</span>
                  </div>
                </div>

                {/* Target Cloud Worker Card */}
                <div className="card-flow-worker-card">
                  <div className="card-flow-worker-icon">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="card-flow-worker-title">Cloud Worker</div>
                    <div className="card-flow-worker-sub">Active 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* CARD 4: BOTTOM RIGHT (Compact, Crisp White #FFFFFF)        */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="magic-bento-card surface-white">
            <div className="mb-card-sheen" />
            <div className="mb-card-content">
              {/* Copy */}
              <div>
                <h3 className="mb-card-title">isolated sandboxes</h3>
                <p className="mb-card-subtitle">
                  Run tasks in secure, containerized spaces.
                </p>
              </div>

              {/* Minimalist Rounded Pill Panel */}
              <div className="card-sandbox-panel">
                <div className="card-sandbox-lock-sq">
                  <Lock className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="card-sandbox-bars">
                  <div className="card-sandbox-bar-muted" style={{ width: "95%" }} />
                  <div className="card-sandbox-bar-lime" />
                  <div className="card-sandbox-bar-muted" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
