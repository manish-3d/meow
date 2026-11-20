"use client";

import React, { useState, useRef, useEffect } from "react";
import { Lock, Search, Folder, Grid, Share2, Star, User, MoreVertical } from "lucide-react";

export function HostingSection() {
  // Card 1: Active Bot selection
  const [selectedBot, setSelectedBot] = useState<"coding" | "research" | "inbox">("inbox");

  // Card 2: Remote desktop human mouse takeover state
  const [isTakeover, setIsTakeover] = useState(false);
  const [takeoverPos, setTakeoverPos] = useState({ x: 235, y: 34 });
  const remoteViewportRef = useRef<HTMLDivElement>(null);

  const handleRemoteMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTakeover || !remoteViewportRef.current) return;
    const rect = remoteViewportRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(10, Math.min(rect.height - 20, e.clientY - rect.top));
    setTakeoverPos({ x, y });
  };

  // Live timer for Card 3 "Laptop asleep" pill
  const [asleepTime, setAsleepTime] = useState("08:00:14");
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      setAsleepTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hosting" className="bento-section-root">
      <style jsx global>{`
        /* ============================================================================
           SECTION ROOT
           ============================================================================ */

        .bento-section-root {
          width: 100%;
          background-color: #fafafa;
          padding: 80px 24px 96px;
          color: #111111;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .bento-container {
          max-width: 1140px;
          margin: 0 auto;
        }

        /* 2-ROW BENTO LAYOUT */
        .bento-rows {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bento-row {
          display: flex;
          gap: 16px;
          width: 100%;
        }

        .bento-col-ws {
          flex: 1.05;
          min-width: 0;
        }

        .bento-col-remote {
          flex: 1.15;
          min-width: 0;
        }

        .bento-col-cloud {
          flex: 1.65;
          min-width: 0;
        }

        .bento-col-sandbox {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 960px) {
          .bento-row {
            flex-direction: column;
          }
        }

        /* CARD SHELLS */
        .bento-card {
          border-radius: 20px;
          padding: 28px 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .bento-card:hover {
          border-color: rgba(15, 23, 42, 0.13);
        }

        .bento-card-light {
          background-color: #ffffff;
        }

        .bento-card-dark {
          background-color: #0d0f12;
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .bento-card-dark:hover {
          border-color: rgba(255, 255, 255, 0.16);
        }

        /* TYPOGRAPHY */
        .bento-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #111111;
        }

        .bento-title-white {
          color: #ffffff;
        }

        .bento-subtitle {
          margin: 4px 0 0;
          font-size: 0.88rem;
          color: #64748b;
          font-weight: 400;
        }

        .bento-subtitle-light {
          color: #94a3b8;
        }

        /* ============================================================================
           CARD 1: INSTANT WEB WORKSPACE
           ============================================================================ */

        .ws-window {
          margin-top: 22px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
          height: 196px;
          display: flex;
          flex-direction: column;
        }

        .ws-header {
          height: 34px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ws-dots {
          display: flex;
          gap: 5px;
        }

        .ws-dot {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: #cbd5e1;
        }

        .ws-url-pill {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.64rem;
          color: #475569;
          background: #f1f5f9;
          padding: 3px 14px;
          border-radius: 6px;
        }

        .ws-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .ws-sidebar {
          width: 126px;
          background: #111111;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .ws-user-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ws-avatar {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .ws-user-name {
          font-size: 0.68rem;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
        }

        .ws-collapse {
          margin-left: auto;
          font-size: 0.6rem;
          color: #71717a;
          letter-spacing: -1px;
        }

        .ws-section-label {
          font-size: 0.56rem;
          color: #71717a;
          font-weight: 600;
          margin-top: 10px;
          margin-bottom: 6px;
          padding-left: 4px;
        }

        .ws-bot-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 6px;
          border-radius: 6px;
          font-size: 0.66rem;
          color: #a1a1aa;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
          text-align: left;
        }

        .ws-bot-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        .ws-bot-btn.is-active {
          background: #1e1e22;
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.08);
        }

        .ws-dot-active {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #84cc16;
          margin-left: auto;
          box-shadow: 0 0 0 2px rgba(132, 204, 22, 0.2);
        }

        .ws-content-pane {
          flex: 1;
          background: #ffffff;
          padding: 14px 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ws-more-icon {
          position: absolute;
          top: 10px;
          right: 12px;
          color: #94a3b8;
        }

        .ws-log-line {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.7rem;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ws-success-box {
          margin-top: 4px;
          background: #ecfccb;
          border: 1px solid #bef264;
          border-radius: 6px;
          padding: 5px 9px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.68rem;
          font-weight: 500;
          color: #15803d;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          width: fit-content;
        }

        /* ============================================================================
           CARD 2: REMOTE BROWSER DESKTOP
           ============================================================================ */

        .remote-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .remote-takeover-btn {
          background: #a3e635;
          color: #111111;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 5px 13px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remote-takeover-btn:hover {
          background: #bef264;
          transform: scale(1.02);
        }

        .remote-takeover-btn.is-active {
          background: #ffffff;
          color: #111111;
        }

        .remote-window {
          margin-top: 18px;
          border-radius: 10px;
          background: #ffffff;
          overflow: hidden;
          height: 200px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .remote-tabs-bar {
          height: 26px;
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .remote-tab {
          background: #ffffff;
          border-radius: 5px 5px 0 0;
          padding: 2px 8px;
          font-size: 0.62rem;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid #e2e8f0;
          border-bottom: none;
        }

        .remote-tab-dot-orange {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: #f97316;
        }

        .remote-tab-close {
          color: #94a3b8;
          font-size: 0.6rem;
          margin-left: 2px;
        }

        .remote-nav-bar {
          height: 28px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          padding: 0 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .remote-nav-icon {
          color: #64748b;
          font-size: 0.68rem;
          cursor: pointer;
        }

        .remote-url-input {
          flex: 1;
          height: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          padding: 0 8px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.6rem;
          color: #475569;
        }

        .remote-viewport {
          flex: 1;
          position: relative;
          background: #ffffff;
          padding: 10px 14px;
          display: flex;
          overflow: hidden;
        }

        .remote-viewport.is-human {
          cursor: none;
        }

        .remote-viewport-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #94a3b8;
          padding-right: 12px;
          border-right: 1px solid #f8fafc;
        }

        .remote-viewport-content {
          flex: 1;
          padding-left: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .remote-content-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .remote-search-box {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.72rem;
          color: #0f172a;
          background: #ffffff;
        }

        .remote-export-btn {
          background: #111111;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 6px;
          white-space: nowrap;
          border: none;
        }

        .remote-table-row {
          height: 10px;
          border-radius: 4px;
          background: #f8fafc;
        }

        .remote-table-row.row-active {
          background: #f1f5f9;
          border-left: 3px solid #bef264;
          width: 95%;
        }

        .remote-table-row.row-muted {
          width: 80%;
        }

        /* CURSOR POINTER */
        .remote-cursor-wrap {
          position: absolute;
          display: flex;
          align-items: flex-start;
          pointer-events: none;
          z-index: 10;
        }

        .remote-cursor-wrap.is-auto {
          animation: remoteCursorGlide 6.5s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        .remote-cursor-tag {
          margin-left: 5px;
          margin-top: 8px;
          background: #84cc16;
          color: #000000;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        @keyframes remoteCursorGlide {
          0%,
          100% {
            left: 78%;
            top: 26%;
          }
          35% {
            left: 28%;
            top: 24%;
          }
          65% {
            left: 55%;
            top: 60%;
          }
          85% {
            left: 78%;
            top: 26%;
          }
        }

        /* ============================================================================
           CARD 3: ALWAYS-ON CLOUD ENGINE
           ============================================================================ */

        .cloud-flow-wrap {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          min-height: 108px;
          width: 100%;
        }

        .cloud-asleep-pill {
          background: #111111;
          color: #ffffff;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        }

        .cloud-middle-tasks {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
        }

        .cloud-task-chip {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 5px 12px;
          font-size: 0.72rem;
          font-weight: 500;
          color: #1e293b;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          white-space: nowrap;
          width: fit-content;
        }

        .cloud-task-chip.is-running {
          border-color: #94a3b8;
          font-weight: 600;
        }

        .cloud-worker-card {
          background: #111111;
          color: #ffffff;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .cloud-worker-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #ffffff;
        }

        .cloud-worker-stats {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.62rem;
          color: #94a3b8;
        }

        .cloud-equalizer-bars {
          display: flex;
          align-items: flex-end;
          gap: 2.5px;
          height: 14px;
          margin-top: 6px;
        }

        .cloud-eq-bar {
          width: 3.5px;
          border-radius: 1.5px;
          background: #84cc16;
          animation: mbEqPulse 1.6s ease-in-out infinite alternate;
        }

        @keyframes mbEqPulse {
          0% {
            height: 4px;
            opacity: 0.6;
          }
          100% {
            height: 13px;
            opacity: 1;
          }
        }

        /* ============================================================================
           CARD 4: ISOLATED SANDBOXES
           ============================================================================ */

        .sandbox-widget {
          margin-top: 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sandbox-lock-box {
          width: 48px;
          height: 48px;
          border: 1.5px dashed #cbd5e1;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          flex-shrink: 0;
          color: #334155;
        }

        .sandbox-rows {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sandbox-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.68rem;
          color: #334155;
        }

        .sandbox-row-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sandbox-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
        }

        .sandbox-badge {
          font-size: 0.58rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
        }

        .badge-running {
          background: #bbf7d0;
          color: #15803d;
        }

        .badge-exec {
          background: #e2e8f0;
          color: #475569;
        }

        .badge-wiped {
          background: #f1f5f9;
          color: #94a3b8;
        }

        .sandbox-footer-meta {
          margin-top: 10px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.68rem;
          color: #64748b;
        }
      `}</style>

      <div className="bento-container">
        <div className="bento-rows">
          {/* ================================================================== */}
          {/* TOP ROW: CARD 1 & CARD 2                                           */}
          {/* ================================================================== */}
          <div className="bento-row">
            {/* ──────────────────────────────────────────────────────────────── */}
            {/* CARD 1: INSTANT WEB WORKSPACE                                    */}
            {/* ──────────────────────────────────────────────────────────────── */}
            <div className="bento-card bento-card-light bento-col-ws">
              <div>
                <h3 className="bento-title">instant web workspace</h3>
                <p className="bento-subtitle">Access your custom setup in any browser.</p>
              </div>

              {/* Workspace Mock Window */}
              <div className="ws-window">
                {/* Header */}
                <div className="ws-header">
                  <div className="ws-dots">
                    <span className="ws-dot" />
                    <span className="ws-dot" />
                    <span className="ws-dot" />
                  </div>
                  <span className="ws-url-pill">meow.bot/workspace</span>
                  <div style={{ width: 28 }} />
                </div>

                {/* Body */}
                <div className="ws-body">
                  {/* Left Sidebar */}
                  <div className="ws-sidebar">
                    <div className="ws-user-row">
                      <div className="ws-avatar">🐱</div>
                      <span className="ws-user-name">meow Bot</span>
                      <span className="ws-collapse">&lt;&lt;</span>
                    </div>

                    <span className="ws-section-label">Real bots</span>

                    <button
                      type="button"
                      className={`ws-bot-btn ${selectedBot === "coding" ? "is-active" : ""}`}
                      onClick={() => setSelectedBot("coding")}
                    >
                      <span>&gt;_</span>
                      <span>Coding Bot</span>
                    </button>

                    <button
                      type="button"
                      className={`ws-bot-btn ${selectedBot === "research" ? "is-active" : ""}`}
                      onClick={() => setSelectedBot("research")}
                    >
                      <span>⚲</span>
                      <span>Research Bot</span>
                    </button>

                    <button
                      type="button"
                      className={`ws-bot-btn ${selectedBot === "inbox" ? "is-active" : ""}`}
                      onClick={() => setSelectedBot("inbox")}
                    >
                      <span>📥</span>
                      <span>Inbox Bot</span>
                      <span className="ws-dot-active" />
                    </button>
                  </div>

                  {/* Right Log Pane */}
                  <div className="ws-content-pane">
                    <MoreVertical className="ws-more-icon w-3.5 h-3.5" />

                    <div className="ws-log-line">
                      <span>&gt; Reading src/auth/callback.ts</span>
                    </div>

                    <div className="ws-log-line">
                      <span>&gt; Running vitest (14/14 passed)</span>
                    </div>

                    <div className="ws-success-box">
                      <span>✓ Fixed OAuth callback &amp; opened PR #48</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* CARD 2: REMOTE BROWSER DESKTOP (BLACK CARD)                      */}
            {/* ──────────────────────────────────────────────────────────────── */}
            <div className="bento-card bento-card-dark bento-col-remote">
              <div className="remote-top-bar">
                <div>
                  <h3 className="bento-title bento-title-white">remote browser desktop</h3>
                  <p className="bento-subtitle bento-subtitle-light">
                    Access virtual environments on the fly.
                  </p>
                </div>
                <button
                  type="button"
                  className={`remote-takeover-btn ${isTakeover ? "is-active" : ""}`}
                  onClick={() => setIsTakeover(!isTakeover)}
                >
                  {isTakeover ? "Release control" : "Take control"}
                </button>
              </div>

              {/* Browser Window inside Card 2 */}
              <div className="remote-window">
                {/* Tabs Bar */}
                <div className="remote-tabs-bar">
                  <div className="ws-dots">
                    <span className="ws-dot" style={{ background: "#fda4af" }} />
                    <span className="ws-dot" style={{ background: "#fde047" }} />
                    <span className="ws-dot" style={{ background: "#86efac" }} />
                  </div>
                  <div className="remote-tab">
                    <span className="remote-tab-dot-orange" />
                    <span>Analytics - Analytics</span>
                    <span className="remote-tab-close">×</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>+</span>
                </div>

                {/* Nav / URL bar */}
                <div className="remote-nav-bar">
                  <span className="remote-nav-icon">←</span>
                  <span className="remote-nav-icon">→</span>
                  <span className="remote-nav-icon">↻</span>
                  <div className="remote-url-input">
                    <Lock className="w-2.5 h-2.5 text-slate-400" />
                    <span>chromium.com/analytics</span>
                  </div>
                  <Share2 className="w-2.5 h-2.5 text-slate-400" />
                  <Star className="w-2.5 h-2.5 text-slate-400" />
                  <User className="w-2.5 h-2.5 text-slate-400" />
                  <MoreVertical className="w-2.5 h-2.5 text-slate-400" />
                </div>

                {/* Viewport content */}
                <div
                  ref={remoteViewportRef}
                  onMouseMove={handleRemoteMouseMove}
                  className={`remote-viewport ${isTakeover ? "is-human" : ""}`}
                >
                  {/* Left icons */}
                  <div className="remote-viewport-sidebar">
                    <Folder className="w-3.5 h-3.5" />
                    <Grid className="w-3.5 h-3.5" />
                  </div>

                  {/* Main stage */}
                  <div className="remote-viewport-content">
                    <div className="remote-content-top">
                      <div className="remote-search-box">
                        <Search className="w-3 h-3 text-slate-400" />
                        <span>Q4 Revenue</span>
                        <span className="text-slate-400">|</span>
                      </div>
                      <button type="button" className="remote-export-btn">
                        Export CSV
                      </button>
                    </div>

                    <div className="remote-table-row row-active" />
                    <div className="remote-table-row row-muted" />
                  </div>

                  {/* Cursor Pointer */}
                  <div
                    className={`remote-cursor-wrap ${isTakeover ? "is-manual" : "is-auto"}`}
                    style={
                      isTakeover
                        ? { left: `${takeoverPos.x}px`, top: `${takeoverPos.y}px` }
                        : undefined
                    }
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))" }}
                    >
                      <path
                        d="M2.5 1.5L6.5 14L8.8 8.8L14 6.5L2.5 1.5Z"
                        fill="#000000"
                        stroke="#FFFFFF"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="remote-cursor-tag">
                      {isTakeover ? "You" : "Meow Bot"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* BOTTOM ROW: CARD 3 & CARD 4                                        */}
          {/* ================================================================== */}
          <div className="bento-row">
            {/* ──────────────────────────────────────────────────────────────── */}
            {/* CARD 3: ALWAYS-ON CLOUD ENGINE                                   */}
            {/* ──────────────────────────────────────────────────────────────── */}
            <div className="bento-card bento-card-light bento-col-cloud">
              <div>
                <h3 className="bento-title">always-on cloud engine</h3>
                <p className="bento-subtitle">
                  Automate tasks with continuous background workers.
                </p>
              </div>

              {/* Node diagram */}
              <div className="cloud-flow-wrap">
                {/* Left: Laptop asleep */}
                <div className="cloud-asleep-pill">
                  Laptop asleep • {asleepTime}
                </div>

                {/* SVG Connecting Tracks: Left Pill to Middle Tasks */}
                <svg width="42" height="96" viewBox="0 0 42 96" fill="none" className="shrink-0">
                  <path d="M 0 48 C 20 48, 22 16, 42 16" stroke="#CBD5E1" strokeWidth="1.5" />
                  <path d="M 0 48 L 42 48" stroke="#CBD5E1" strokeWidth="1.5" />
                  <path d="M 0 48 C 20 48, 22 80, 42 80" stroke="#CBD5E1" strokeWidth="1.5" />
                </svg>

                {/* Middle: 3 Schedule Tasks */}
                <div className="cloud-middle-tasks">
                  <div className="cloud-task-chip">
                    Morning Brief — Sent
                  </div>
                  <div className="cloud-task-chip is-running">
                    Inbox Triage — Running...
                  </div>
                  <div className="cloud-task-chip">
                    PR Watcher — Queued
                  </div>
                </div>

                {/* SVG Connecting Tracks: Middle Tasks to Junction & Worker */}
                <svg width="54" height="96" viewBox="0 0 54 96" fill="none" className="shrink-0">
                  <path d="M 0 16 C 18 16, 22 48, 38 48" stroke="#CBD5E1" strokeWidth="1.5" />
                  <path d="M 0 48 L 38 48" stroke="#84CC16" strokeWidth="2" />
                  <path d="M 0 80 C 18 80, 22 48, 38 48" stroke="#CBD5E1" strokeWidth="1.5" />
                  {/* Junction Node */}
                  <circle cx="38" cy="48" r="4.5" fill="#84CC16" />
                  <circle cx="38" cy="48" r="7.5" stroke="#84CC16" strokeWidth="1.5" strokeOpacity="0.4" />
                  {/* Line into Worker Card */}
                  <path d="M 38 48 L 54 48" stroke="#111111" strokeWidth="2" />
                </svg>

                {/* Right: Cloud Worker Card */}
                <div className="cloud-worker-card">
                  <span className="cloud-worker-title">Cloud Worker</span>
                  <span className="cloud-worker-stats">1,428 runs • 0 dropped</span>
                  <div className="cloud-equalizer-bars">
                    <span className="cloud-eq-bar" style={{ height: "45%", animationDelay: "0.1s" }} />
                    <span className="cloud-eq-bar" style={{ height: "70%", animationDelay: "0.4s" }} />
                    <span className="cloud-eq-bar" style={{ height: "90%", animationDelay: "0.2s" }} />
                    <span className="cloud-eq-bar" style={{ height: "60%", animationDelay: "0.5s" }} />
                    <span className="cloud-eq-bar" style={{ height: "85%", animationDelay: "0.3s" }} />
                    <span className="cloud-eq-bar" style={{ height: "100%", animationDelay: "0.6s" }} />
                    <span className="cloud-eq-bar" style={{ height: "75%", animationDelay: "0.15s" }} />
                    <span className="cloud-eq-bar" style={{ height: "95%", animationDelay: "0.45s" }} />
                    <span className="cloud-eq-bar" style={{ height: "80%", animationDelay: "0.25s" }} />
                    <span className="cloud-eq-bar" style={{ height: "65%", animationDelay: "0.55s" }} />
                    <span className="cloud-eq-bar" style={{ height: "50%", animationDelay: "0.35s" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* CARD 4: ISOLATED SANDBOXES                                       */}
            {/* ──────────────────────────────────────────────────────────────── */}
            <div className="bento-card bento-card-light bento-col-sandbox">
              <div>
                <h3 className="bento-title">isolated sandboxes</h3>
                <p className="bento-subtitle">Run tasks in secure, containerized spaces.</p>
              </div>

              <div>
                <div className="sandbox-widget">
                  {/* Dashed lock box */}
                  <div className="sandbox-lock-box">
                    <Lock className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  {/* VM status rows */}
                  <div className="sandbox-rows">
                    <div className="sandbox-row-item">
                      <div className="sandbox-row-left">
                        <span className="sandbox-dot" style={{ background: "#84cc16" }} />
                        <span>vm-84a2</span>
                      </div>
                      <span className="sandbox-badge badge-running">RUNNING</span>
                    </div>

                    <div className="sandbox-row-item">
                      <div className="sandbox-row-left">
                        <span className="sandbox-dot" style={{ background: "#94a3b8" }} />
                        <span>vm-19c0</span>
                      </div>
                      <span className="sandbox-badge badge-exec">EXEC</span>
                    </div>

                    <div className="sandbox-row-item">
                      <div className="sandbox-row-left">
                        <span className="sandbox-dot" style={{ background: "#cbd5e1" }} />
                        <span>vm-7f3b</span>
                      </div>
                      <span className="sandbox-badge badge-wiped">WIPED</span>
                    </div>
                  </div>
                </div>

                <div className="sandbox-footer-meta">
                  FS: ephemeral • NET: isolated
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
