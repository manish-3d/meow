"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import "./MagicBento.css";

interface CardItem {
  id: string;
  kind: "workspace" | "cloud" | "browser" | string;
  title: string;
  badge: string;
  description: string;
  footer: string;
}

const cards: CardItem[] = [
  {
    id: "workspace",
    kind: "workspace",
    title: "instant web workspace",
    badge: "zero install",
    description:
      "Open Meow Bot in Chrome, Safari, or mobile. Create agents, chat with your crew, and configure routines in seconds.",
    footer: "Works on any device  •  Instant access",
  },
  {
    id: "cloud",
    kind: "cloud",
    title: "always-on cloud engine",
    badge: "runs 24/7",
    description:
      "Your routines execute on our durable cloud servers. Morning briefs deliver and emails are triaged even when your laptop is shut off.",
    footer: "Ingest durable cron  •  Zero dropped runs",
  },
  {
    id: "browser",
    kind: "browser",
    title: "remote browser desktop",
    badge: "browserbase VM",
    description:
      "When agents navigate websites, they run inside secure cloud Chromium sandboxes. Watch the live stream or take the mouse anytime.",
    footer: "Live streaming  •  Human takeover",
  },
];

function WorkspaceArt() {
  return (
    <div className="mb-art mb-art--workspace" aria-hidden="true">
      <div className="mb-window">
        <div className="mb-window__bar">
          <span className="mb-window__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="mb-window__address">meowbot.ai / workspace</span>
          <span className="mb-window__status" />
        </div>
        <div className="mb-workspace">
          <div className="mb-workspace__rail">
            <span className="mb-workspace__avatar">m</span>
            <i />
            <i />
            <i />
          </div>
          <div className="mb-workspace__body">
            <span className="mb-skeleton mb-skeleton--heading" />
            <div className="mb-workspace__tiles">
              <span className="mb-workspace__tile mb-workspace__tile--cyan">
                <i />
                <b />
              </span>
              <span className="mb-workspace__tile mb-workspace__tile--green">
                <i />
                <b />
              </span>
              <span className="mb-workspace__tile mb-workspace__tile--violet">
                <i />
                <b />
              </span>
            </div>
            <span className="mb-skeleton mb-skeleton--line" />
          </div>
        </div>
      </div>
      <span className="mb-art__spark mb-art__spark--workspace" />
    </div>
  );
}

function CloudArt() {
  return (
    <div className="mb-art mb-art--cloud" aria-hidden="true">
      <div className="mb-cloud">
        <span className="mb-cloud__orbit mb-cloud__orbit--one" />
        <span className="mb-cloud__orbit mb-cloud__orbit--two" />
        <svg viewBox="0 0 94 66" focusable="false">
          <path d="M25 54h45a17 17 0 0 0 1-34A25 25 0 0 0 24 24a15 15 0 0 0 1 30Z" />
        </svg>
        <span className="mb-cloud__bolt">
          <svg viewBox="0 0 20 28" focusable="false">
            <path d="M12 1 3 15h6l-1 12 9-16h-6l1-10Z" />
          </svg>
        </span>
      </div>
      <div className="mb-cloud__timeline">
        <span className="mb-cloud__track" />
        <span className="mb-cloud__node mb-cloud__node--one">
          <i />
        </span>
        <span className="mb-cloud__node mb-cloud__node--two">
          <i />
        </span>
        <span className="mb-cloud__node mb-cloud__node--three">
          <i />
        </span>
        <span className="mb-cloud__node mb-cloud__node--four">
          <i />
        </span>
      </div>
      <span className="mb-art__spark mb-art__spark--cloud" />
    </div>
  );
}

function BrowserArt() {
  return (
    <div className="mb-art mb-art--browser" aria-hidden="true">
      <div className="mb-window mb-window--browser">
        <div className="mb-window__bar">
          <span className="mb-window__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="mb-window__address">secure chromium session</span>
          <span className="mb-window__lock">⌑</span>
        </div>
        <div className="mb-browser">
          <div className="mb-browser__side">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="mb-browser__page">
            <span className="mb-browser__hero">
              <i />
            </span>
            <span className="mb-browser__copy mb-browser__copy--wide" />
            <span className="mb-browser__copy" />
            <span className="mb-browser__button" />
          </div>
          <span className="mb-browser__cursor">
            <svg viewBox="0 0 18 22" focusable="false">
              <path d="M2 1v17l4.7-4.6 3.1 6.5 3-1.4-3.2-6.4H16L2 1Z" />
            </svg>
          </span>
        </div>
      </div>
      <span className="mb-art__spark mb-art__spark--browser" />
    </div>
  );
}

interface BentoCardProps {
  card: CardItem;
  index: number;
  radius: number;
  clickEffect?: boolean;
}

function BentoCard({ card, index, radius, clickEffect }: BentoCardProps) {
  const [ripple, setRipple] = useState<{ id: number; x: number; y: number } | null>(null);
  const rippleId = useRef(0);

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (!clickEffect || (event.pointerType === "mouse" && event.button !== 0)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rippleId.current += 1;
    setRipple({ id: rippleId.current, x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  }

  return (
    <article
      className={"mb-card mb-card--" + card.kind}
      data-mb-card=""
      style={
        {
          "--mb-card-order": index,
          "--mb-card-radius": radius + "px",
        } as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
    >
      {card.kind === "workspace" ? <WorkspaceArt /> : card.kind === "cloud" ? <CloudArt /> : <BrowserArt />}
      <div className="mb-card__heading">
        <h3>{card.title}</h3>
        <span className="mb-card__badge">
          {card.kind === "cloud" && <span className="mb-card__live-dot" aria-hidden="true" />}
          {card.kind === "browser" && (
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M2 3.25A1.25 1.25 0 0 1 3.25 2h9.5A1.25 1.25 0 0 1 14 3.25v6.5A1.25 1.25 0 0 1 12.75 11h-3l.7 1.5h1.3v1H4.25v-1h1.3l.7-1.5h-3A1.25 1.25 0 0 1 2 9.75v-6.5Zm1 0v6.5c0 .14.11.25.25.25h9.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25h-9.5a.25.25 0 0 0-.25.25Z" />
            </svg>
          )}
          <span>{card.badge}</span>
        </span>
      </div>
      <p className="mb-card__description">{card.description}</p>
      <div className="mb-card__footer">{card.footer}</div>
      {ripple && (
        <span
          key={ripple.id}
          className="mb-click-wave"
          style={{ left: ripple.x + "px", top: ripple.y + "px" }}
          onAnimationEnd={() => setRipple(null)}
          aria-hidden="true"
        />
      )}
    </article>
  );
}

function px(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number + "px" : fallback + "px";
}

export interface MagicBentoProps {
  columns?: number;
  rowHeight?: number;
  gap?: number;
  radius?: number;
  enableBorderGlow?: boolean;
  enableSpotlight?: boolean;
  spotlightRadius?: number;
  clickEffect?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MagicBento({
  columns = 3,
  rowHeight = 200,
  gap = 24,
  radius = 20,
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  clickEffect = true,
  className = "",
  style = {},
}: MagicBentoProps) {
  const rootRef = useRef<HTMLElement>(null);
  const headingId = useId();
  const [entered, setEntered] = useState(false);
  const columnCount = Math.max(1, Math.min(cards.length, Math.floor(Number(columns) || 3)));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let observer: IntersectionObserver | undefined;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setEntered(true);
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setEntered(true);
            observer?.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      observer.observe(root);
    }

    const disposers: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>("[data-mb-card]").forEach((card) => {
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--mb-pointer-x", event.clientX - bounds.left + "px");
        card.style.setProperty("--mb-pointer-y", event.clientY - bounds.top + "px");
        card.dataset.pointer = "";
      };
      const leave = () => {
        delete card.dataset.pointer;
      };
      card.addEventListener("pointermove", move as EventListener, { passive: true });
      card.addEventListener("pointerleave", leave as EventListener, { passive: true });
      disposers.push(() => {
        card.removeEventListener("pointermove", move as EventListener);
        card.removeEventListener("pointerleave", leave as EventListener);
      });
    });

    return () => {
      observer?.disconnect();
      disposers.forEach((dispose) => dispose());
    };
  }, []);

  const sectionStyle = {
    ...style,
    "--mb-columns": String(columnCount),
    "--mb-tablet-columns": String(Math.min(columnCount, 2)),
    "--mb-row-height": px(rowHeight, 200),
    "--mb-gap": px(gap, 24),
    "--mb-radius": px(radius, 20),
    "--mb-spotlight-radius": px(spotlightRadius, 300),
  } as React.CSSProperties;

  return (
    <section
      id="hosting"
      ref={rootRef}
      className={["mb-section", className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
      data-entered={entered ? "" : undefined}
      data-spotlight={enableSpotlight ? "" : undefined}
      data-border-glow={enableBorderGlow ? "" : undefined}
      style={sectionStyle}
    >
      <div className="mb-section__inner">
        <header className="mb-section__intro">
          <p className="mb-section__eyebrow">
            <span />
            built for the way you work
          </p>
          <h2 id={headingId}>how your bots run.</h2>
          <p className="mb-section__lede">
            100% web-first. Access from any browser, while background workers run 24/7 in our cloud.
          </p>
        </header>
        <div className="mb-grid">
          {cards.map((card, index) => (
            <BentoCard key={card.id} card={card} index={index} radius={radius} clickEffect={clickEffect} />
          ))}
        </div>
      </div>
    </section>
  );
}

export const HostingSection = MagicBento;
export default MagicBento;
