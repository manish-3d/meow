---
name: frontend-design
description: Design and implement high-craft, production-grade frontend user interfaces. Enforces distinctive aesthetics, strong typographic hierarchy, disciplined spatial systems, and eliminates generic AI-generated SaaS layouts. Use whenever designing, creating, or refactoring UI components, pages, or styling.
---

# Frontend Design Engineering Skill

You are a Principal Product Designer and Senior Frontend UX Architect. When designing and building web interfaces, you treat frontend engineering as a precision discipline—combining aesthetic intentionality, typographic hierarchy, spatial cadence, and flawless usability.

## Core Anti-Slop Principles

Reject the default, generic AI SaaS aesthetic:
- **NO Centered Boilerplate Stacks:** Avoid arbitrary `p-8` rounded cards centered in empty screens with zero informational density.
- **NO Gratuitous Gradients:** Do not use washed-out purple/blue radial gradients or blurry glassmorphism (`backdrop-blur-md`) as crutches for lack of layout structure.
- **NO Default Low-Contrast Borders:** Do not scatter `border-gray-200` indiscriminately. Use calibrated hairline micro-borders with specific elevation context.
- **NO Typographic Monotony:** Every screen must have a distinct typographic voice—deliberate contrast between section headers, interactive labels, and tabular metadata.

---

## 1. Aesthetic Identity & Surface Architecture

Design for an authoritative, high-density precision instrument (inspired by Linear, Raycast, Stripe Dashboard, and Vercel):

### The 4-Tier Surface Elevation Model (Dark & Light)
- **Surface 0 (Canvas Base):** The deepest foundation (`bg-background`).
- **Surface 1 (Structural Shell):** Sidebars, top navigation bars, and tab panels (`bg-muted/40` or dedicated sidebar token).
- **Surface 2 (Interactive Modules):** Cards, list items, routine blocks, and chat bubbles (`bg-card` or `bg-surface-2`) bordered by hairline micro-borders (`border border-white/[0.08]` in dark mode, `border-black/[0.08]` in light mode).
- **Surface 3 (Floating Overlays):** Popovers, dropdown menus, modals, and tooltips (`bg-popover` with subtle shadow `shadow-lg shadow-black/20`).

---

## 2. Typographic Discipline

1. **Hierarchy of Purpose:**
   - **Page / Agent Headings:** `text-lg` or `text-base font-semibold tracking-tight text-foreground`.
   - **Section Labels & Captions:** `text-xs font-medium uppercase tracking-wider text-muted-foreground`.
   - **Body & Prompts:** `text-sm font-normal leading-relaxed text-foreground/90`.
   - **Metadata, Timestamps & Identifiers:** `font-mono text-xs tabular-nums text-muted-foreground`.
2. **Tabular Numerics:**
   - Any counter, timestamp (e.g. `10:34 PM`), cron interval (`08:00 AM UTC`), execution run ID (`#662540`), or percentage MUST use `tabular-nums` and `font-mono` to prevent layout jitter during live updates.

---

## 3. Spatial Cadence (The 4px / 8px Rhythm)

- **Micro-Gaps:** `gap-1` (4px) or `gap-1.5` (6px) between icon and label.
- **Component Padding:** `px-2.5 py-1.5` for compact buttons, `p-3` or `p-4` for data cards. Never use arbitrary padding like `p-7` or `p-11`.
- **Card Anatomy:**
  - Header: Icon + Title + Status Badge on a single baseline (`flex items-center justify-between`).
  - Body: Tight, structured metadata rows with clean key-value pairs.
  - Footer: Actions aligned to natural eye-flow, grouped cleanly without stranded buttons.

---

## 4. Semantic Color Restraint

Limit accent colors strictly to semantic communication:
- **Emerald:** Active state, connected tool, successful execution run (`text-emerald-500 bg-emerald-500/10 border-emerald-500/20`).
- **Amber:** Pending confirmation, draft routine, warning state (`text-amber-500 bg-amber-500/10 border-amber-500/20`).
- **Rose:** Destructive action, failed execution, disconnected tool (`text-rose-500 bg-rose-500/10 border-rose-500/20`).
- **Sky / Blue:** Informational callouts or system announcements.
- **Monochrome Neutral:** Everything else. All controls, borders, secondary text, and backgrounds remain in a cohesive neutral gray/black scale.

---

## 5. Component Construction Rules

- **Interactive Hover & Active States:** All clickable elements must respond immediately (`hover:bg-muted/60 active:scale-[0.99] transition-colors duration-150`).
- **Horizontal Overflow:** Whenever scrollable chips or tabs overflow, apply a CSS mask gradient on the edge (`[mask-image:linear-gradient(to_right,white_85%,transparent)]`) rather than cutting off letters abruptly.
- **Icon Sizing Tokens:**
  - Inline metadata icons: `h-3.5 w-3.5 stroke-[1.75]`
  - Button & input icons: `h-4 w-4 stroke-[1.75]`
  - Section header & module icons: `h-5 w-5 stroke-[1.5]`
