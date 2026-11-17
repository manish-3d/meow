---
name: web-design-guidelines
description: 100+ battle-tested web design engineering guidelines for production web applications. Enforces WCAG accessibility, visible keyboard focus rings, layout stability (zero CLS), form ergonomics, loading states, and responsive breakpoints. Use when developing or auditing user-facing web interfaces.
---

# Web Design Engineering Guidelines

Derived from production standards by Vercel Labs, W3C WAI-ARIA, and modern Next.js design engineering practices.

## 1. Accessibility & Keyboard Navigation (WCAG AA)

- **Focus Rings are Mandatory:** Never remove focus outlines without providing a visible replacement. Use:
  ```css
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
  ```
- **Interactive Role Parity:**
  - If an element is clickable (`onClick`), it MUST be a `<button>` or an `<a>` tag, or have `role="button"` + `tabIndex={0}` + `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') ... }}`.
  - Never place clickable elements inside clickable cards without `e.stopPropagation()`.
- **Aria Labels on Icon Buttons:**
  - Any button with only an icon MUST have an `aria-label` or visually hidden text for screen readers (e.g. `<Button aria-label="Refresh execution history"><RefreshCw className="h-4 w-4" /></Button>`).
- **Color Contrast:**
  - All text must achieve a minimum 4.5:1 contrast ratio against its background.
  - Muted secondary text (`text-muted-foreground`) must never fall below legible luminance thresholds.

---

## 2. Layout Stability & Cumulative Layout Shift (CLS)

- **Predictive Sizing:** Always define explicit dimensions or aspect ratios on image containers, avatars, and asynchronous modules to prevent layout jumping when data loads.
- **Matched Skeleton States:** Skeleton loaders must replicate the exact shape, line-height, and padding of the resolved component. Never use a generic centered spinner where a structured skeleton belongs.
- **Button Stability During Loading:**
  - When a button enters a loading state (`isLoading`), maintain its rendered width to prevent neighboring elements from shifting:
    ```tsx
    <Button disabled={isLoading} className="relative min-w-[120px]">
      {isLoading ? (
        <span className="flex items-center gap-1.5">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </Button>
    ```

---

## 3. Form & Input Ergonomics

- **Keyboard Submissions:**
  - Text inputs must submit on `Enter` and allow newline on `Shift + Enter` (with clear placeholder guidance: `Message... (Enter to send, Shift+Enter for newline)`).
- **Disabled State Communication:**
  - Disabled buttons must visibly convey *why* they are disabled, preferably with an inline tooltip or subtle helper text rather than being silently dead.
- **Auto-Capitalize & Spellcheck:**
  - Code inputs, API keys, and email inputs must disable auto-capitalize and spellcheck (`autoCapitalize="none" autoCorrect="off" spellCheck={false}`).

---

## 4. Responsive Breakpoint Standards

- **Mobile Viewport (< 640px):**
  - Minimum touch target size: 44px by 44px (`min-h-[44px]`).
  - Font sizes must not drop below 12px.
  - Fixed full-width bottom bars or slide-up sheets for complex multi-field configurations.
- **Tablet Viewport (640px - 1024px):**
  - Collapsible side drawers with single-tap toggle buttons.
- **Desktop Viewport (1024px+):**
  - Balanced multi-column layouts with independent scrolling containers (`overflow-y-auto` with styled scrollbars).

---

## 5. Performance & Asset Hygiene

- **Font Smoothing:** Use `antialiased` on dark surfaces to keep light typography crisp and thin.
- **Hardware Acceleration:** Limit transitions to `transform` and `opacity`. Never animate `width`, `height`, `margin`, or `padding` directly to avoid CPU layout recalculations.
- **Reduced Motion Support:** Always honor `@media (prefers-reduced-motion: reduce)` by disabling or simplifying complex transitions for users with vestibular sensitivities.
