---
name: motion-engineering
description: World-class motion design engineering rules by Emil Kowalski. Enforces spring physics, GPU-accelerated transforms, layout animations, zero-jank transitions, and restraint against over-animation. Use when adding or refactoring animations, transitions, modals, tooltips, or dynamic list updates.
---

# Motion Design Engineering Skill

Authored from the engineering principles of Emil Kowalski (creator of Sonner, Vaul, and Animations on the Web).

## 1. The Core Law of Motion Restraint

Motion is a communication tool, not decoration:
- **Instant is Better than Slow:** If an interaction doesn't need motion, make it instant.
- **Micro-Interactions < 200ms:** All standard interface state changes (button hovers, tab switches, dropdown reveals) must finish within `150ms` to `200ms`.
- **Never Block User Intent:** Users should never wait for an animation to finish before they can click the next item or submit a form.

---

## 2. Spring Physics vs Easing Curves

Avoid linear easings and exaggerated bouncy springs in enterprise SaaS:
- **Default Fluid Curve (CSS):**
  ```css
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
  ```
- **Motion (Framer) Springs:**
  - For tooltips, popovers, and quick feedback:
    ```json
    { "type": "spring", "stiffness": 400, "damping": 30 }
    ```
  - For smooth layout reordering and drawers:
    ```json
    { "type": "spring", "stiffness": 300, "damping": 32 }
    ```

---

## 3. GPU Hardware Acceleration (The Transform & Opacity Rule)

Only animate properties that composite on the GPU without triggering layout or paint:
- **Permitted for 60fps/120fps:**
  - `transform: translate3d(x, y, 0)`
  - `transform: scale(n)`
  - `opacity: n`
  - `filter: blur(...)` (use with restraint)
- **Forbidden in continuous animation:**
  - `width` / `height` (triggers layout thrashing)
  - `top` / `left` / `right` / `bottom`
  - `margin` / `padding`

### Dynamic Layout Expansion
When cards or accordions expand dynamically, use Motion's `<motion.div layout>` or `AnimatePresence` with `overflow-hidden` rather than CSS `height: auto` transitions.

---

## 4. Choreography & Spatial Continuity

1. **Entering Elements:**
   - Translate by `4px` to `8px` max, combined with opacity fade from `0` to `1`.
   - Never slide elements in from across the entire screen (`translate-y-full`) unless it's a mobile drawer.
2. **Exiting Elements:**
   - Exiting elements should disappear faster than entering elements (e.g. `120ms` vs `180ms`).
3. **Shared Layout Transitions (`layoutId`):**
   - Active tab pills (e.g. Settings, Tools, Schedule, VM) must slide smoothly behind the active tab text using a shared `layoutId="activeTab"` background pill rather than snapping instantly.

---

## 5. Reduced Motion Protocol

Every custom animation MUST respect user accessibility settings:
```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
/>
```
