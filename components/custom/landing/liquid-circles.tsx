"use client";

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export const APP_NAMES = [
  "Gmail",
  "Google Calendar",
  "Slack",
  "Notion",
  "GitHub",
  "Spotify",
  "WhatsApp",
  "Chrome",
  "Linear",
  "Figma",
  "Discord",
  "Zoom",
  "ChatGPT",
  "Claude",
  "Supabase",
  "Stripe",
];

// Helper to draw authentic brand app icons directly onto the atlas canvas
export function drawAppIconToCanvas(
  ctx: CanvasRenderingContext2D,
  name: string,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.translate(x, y);

  const pad = Math.round(size * 0.05);
  const cardSize = size - pad * 2;
  const radius = Math.round(cardSize * 0.22);
  const cx = size / 2;
  const cy = size / 2;

  // Function to draw rounded rect path
  const pathRoundedRect = (rx: number, ry: number, rw: number, rh: number, rad: number) => {
    ctx.beginPath();
    ctx.moveTo(rx + rad, ry);
    ctx.lineTo(rx + rw - rad, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
    ctx.lineTo(rx + rw, ry + rh - rad);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
    ctx.lineTo(rx + rad, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
    ctx.lineTo(rx, ry + rad);
    ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
    ctx.closePath();
  };

  // Default white card background
  pathRoundedRect(pad, pad, cardSize, cardSize, radius);

  switch (name) {
    case "Gmail": {
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = Math.max(1, size * 0.015);
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.stroke();

      // Draw official 4-color Google M
      const s = cardSize * 0.52;
      const left = cx - s / 2;
      const top = cy - s / 2.3;
      const w = s;
      const h = s * 0.78;
      const legW = w * 0.22;

      // Left leg (Blue)
      ctx.fillStyle = "#4285F4";
      ctx.fillRect(left, top + h * 0.2, legW, h * 0.8);

      // Right leg (Green)
      ctx.fillStyle = "#34A853";
      ctx.fillRect(left + w - legW, top + h * 0.2, legW, h * 0.8);

      // Left fold (Red)
      ctx.fillStyle = "#EA4335";
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left + legW, top);
      ctx.lineTo(cx, top + h * 0.62);
      ctx.lineTo(left, top + h * 0.25);
      ctx.closePath();
      ctx.fill();

      // Right fold (Yellow)
      ctx.fillStyle = "#FBBC05";
      ctx.beginPath();
      ctx.moveTo(left + w, top);
      ctx.lineTo(left + w - legW, top);
      ctx.lineTo(cx, top + h * 0.62);
      ctx.lineTo(left + w, top + h * 0.25);
      ctx.closePath();
      ctx.fill();

      // Top Red bar
      ctx.fillStyle = "#EA4335";
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(cx, top + h * 0.56);
      ctx.lineTo(left + w, top);
      ctx.lineTo(left + w - legW * 0.4, top);
      ctx.lineTo(cx, top + h * 0.45);
      ctx.lineTo(left + legW * 0.4, top);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "Google Calendar": {
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = Math.max(1, size * 0.015);
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.stroke();

      // Top blue header bar
      ctx.save();
      ctx.clip();
      ctx.fillStyle = "#4285F4";
      ctx.fillRect(pad, pad, cardSize, cardSize * 0.3);
      ctx.restore();

      // "31" in bold
      ctx.fillStyle = "#4285F4";
      ctx.font = `900 ${Math.round(cardSize * 0.42)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("31", cx, cy + cardSize * 0.14);
      break;
    }

    case "Slack": {
      ctx.fillStyle = "#4A154B"; // Authentic Slack dark aubergine
      ctx.fill();

      // 4 colored pills & dots
      const r = cardSize * 0.26;
      const lw = cardSize * 0.09;
      // Top Yellow (#ECB22E)
      ctx.fillStyle = "#ECB22E";
      pathRoundedRect(cx - lw / 2, cy - r, lw, r * 0.8, lw / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + r * 0.65, cy - r * 0.35, lw / 2, 0, Math.PI * 2);
      ctx.fill();

      // Right Green (#2EB67D)
      ctx.fillStyle = "#2EB67D";
      pathRoundedRect(cx, cy - lw / 2, r * 0.8, lw, lw / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + r * 0.35, cy + r * 0.65, lw / 2, 0, Math.PI * 2);
      ctx.fill();

      // Bottom Red (#E01E5A)
      ctx.fillStyle = "#E01E5A";
      pathRoundedRect(cx - lw / 2, cy, lw, r * 0.8, lw / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - r * 0.65, cy + r * 0.35, lw / 2, 0, Math.PI * 2);
      ctx.fill();

      // Left Blue (#36C5F0)
      ctx.fillStyle = "#36C5F0";
      pathRoundedRect(cx - r * 0.8, cy - lw / 2, r * 0.8, lw, lw / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - r * 0.35, cy - r * 0.65, lw / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "Notion": {
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = Math.max(1, size * 0.015);
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.stroke();

      // Crisp bold serif 'N'
      ctx.fillStyle = "#000000";
      ctx.font = `900 ${Math.round(cardSize * 0.62)}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("N", cx, cy);
      break;
    }

    case "GitHub": {
      ctx.fillStyle = "#18181B";
      ctx.fill();

      // White Octocat head
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, cardSize * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.beginPath();
      ctx.moveTo(cx - cardSize * 0.22, cy - cardSize * 0.1);
      ctx.lineTo(cx - cardSize * 0.28, cy - cardSize * 0.3);
      ctx.lineTo(cx - cardSize * 0.08, cy - cardSize * 0.25);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + cardSize * 0.22, cy - cardSize * 0.1);
      ctx.lineTo(cx + cardSize * 0.28, cy - cardSize * 0.3);
      ctx.lineTo(cx + cardSize * 0.08, cy - cardSize * 0.25);
      ctx.closePath();
      ctx.fill();

      // Dark face cutout
      ctx.fillStyle = "#18181B";
      ctx.beginPath();
      ctx.ellipse(cx, cy + cardSize * 0.05, cardSize * 0.18, cardSize * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "Spotify": {
      ctx.fillStyle = "#1DB954";
      ctx.fill();

      // 3 white curved audio arcs
      ctx.strokeStyle = "#ffffff";
      ctx.lineCap = "round";

      ctx.lineWidth = cardSize * 0.08;
      ctx.beginPath();
      ctx.arc(cx - cardSize * 0.06, cy + cardSize * 0.18, cardSize * 0.35, -Math.PI * 0.42, -Math.PI * 0.08);
      ctx.stroke();

      ctx.lineWidth = cardSize * 0.07;
      ctx.beginPath();
      ctx.arc(cx - cardSize * 0.04, cy + cardSize * 0.18, cardSize * 0.26, -Math.PI * 0.42, -Math.PI * 0.08);
      ctx.stroke();

      ctx.lineWidth = cardSize * 0.06;
      ctx.beginPath();
      ctx.arc(cx - cardSize * 0.02, cy + cardSize * 0.18, cardSize * 0.17, -Math.PI * 0.42, -Math.PI * 0.08);
      ctx.stroke();
      break;
    }

    case "WhatsApp": {
      ctx.fillStyle = "#25D366";
      ctx.fill();

      // White speech bubble
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy - cardSize * 0.02, cardSize * 0.28, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - cardSize * 0.2, cy + cardSize * 0.15);
      ctx.lineTo(cx - cardSize * 0.26, cy + cardSize * 0.28);
      ctx.lineTo(cx - cardSize * 0.08, cy + cardSize * 0.24);
      ctx.closePath();
      ctx.fill();

      // Green phone handset icon
      ctx.fillStyle = "#25D366";
      ctx.font = `${Math.round(cardSize * 0.34)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("📞", cx + cardSize * 0.01, cy - cardSize * 0.01);
      break;
    }

    case "Chrome": {
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = Math.max(1, size * 0.015);
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.stroke();

      const outerR = cardSize * 0.32;
      const innerR = cardSize * 0.14;

      // Red sector (top)
      ctx.fillStyle = "#EA4335";
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, -Math.PI * 0.85, Math.PI * 0.15);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();

      // Green sector (bottom-left)
      ctx.fillStyle = "#34A853";
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, Math.PI * 0.15, Math.PI * 0.85);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();

      // Yellow sector (bottom-right)
      ctx.fillStyle = "#FBBC05";
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, Math.PI * 0.85, Math.PI * 1.15);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();

      // White ring
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, innerR * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Blue center
      ctx.fillStyle = "#4285F4";
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "Linear": {
      ctx.fillStyle = "#5E6AD2";
      ctx.fill();

      // Linear diagonal streak logo
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cardSize * 0.08;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.arc(cx, cy, cardSize * 0.26, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - cardSize * 0.16, cy + cardSize * 0.16);
      ctx.lineTo(cx + cardSize * 0.16, cy - cardSize * 0.16);
      ctx.stroke();
      break;
    }

    case "Figma": {
      ctx.fillStyle = "#1E1E1E";
      ctx.fill();

      const dropR = cardSize * 0.13;
      const ox = dropR * 0.95;
      const oy = dropR * 1.7;

      // Top-left Red (#F24E1E)
      ctx.fillStyle = "#F24E1E";
      ctx.beginPath();
      ctx.arc(cx - ox, cy - oy, dropR, Math.PI * 0.5, Math.PI * 1.5);
      ctx.lineTo(cx, cy - oy - dropR);
      ctx.lineTo(cx, cy - oy + dropR);
      ctx.closePath();
      ctx.fill();

      // Top-right Orange (#FF7262)
      ctx.fillStyle = "#FF7262";
      ctx.beginPath();
      ctx.arc(cx + ox, cy - oy, dropR, 0, Math.PI * 2);
      ctx.fill();

      // Mid-left Purple (#A259FF)
      ctx.fillStyle = "#A259FF";
      ctx.beginPath();
      ctx.arc(cx - ox, cy, dropR, Math.PI * 0.5, Math.PI * 1.5);
      ctx.lineTo(cx, cy - dropR);
      ctx.lineTo(cx, cy + dropR);
      ctx.closePath();
      ctx.fill();

      // Mid-right Blue (#1ABCFE)
      ctx.fillStyle = "#1ABCFE";
      ctx.beginPath();
      ctx.arc(cx + ox, cy, dropR, 0, Math.PI * 2);
      ctx.fill();

      // Bottom-left Green (#0ACF83)
      ctx.fillStyle = "#0ACF83";
      ctx.beginPath();
      ctx.arc(cx - ox, cy + oy, dropR, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "Discord": {
      ctx.fillStyle = "#5865F2";
      ctx.fill();

      // White controller shape
      ctx.fillStyle = "#ffffff";
      const w = cardSize * 0.58;
      const h = cardSize * 0.42;
      pathRoundedRect(cx - w / 2, cy - h / 2, w, h, h * 0.35);
      ctx.fill();

      // Controller eyes
      ctx.fillStyle = "#5865F2";
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy, h * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + w * 0.22, cy, h * 0.18, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "Zoom": {
      ctx.fillStyle = "#0B5CFF";
      ctx.fill();

      // White video camera
      ctx.fillStyle = "#ffffff";
      const camW = cardSize * 0.34;
      const camH = cardSize * 0.28;
      pathRoundedRect(cx - cardSize * 0.22, cy - camH / 2, camW, camH, camH * 0.25);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + cardSize * 0.12, cy - camH * 0.25);
      ctx.lineTo(cx + cardSize * 0.26, cy - camH * 0.45);
      ctx.lineTo(cx + cardSize * 0.26, cy + camH * 0.45);
      ctx.lineTo(cx + cardSize * 0.12, cy + camH * 0.25);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "ChatGPT": {
      ctx.fillStyle = "#10A37F"; // OpenAI teal
      ctx.fill();

      // White rosette spiral
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cardSize * 0.055;
      ctx.lineCap = "round";
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(ang) * cardSize * 0.12,
          cy + Math.sin(ang) * cardSize * 0.12,
          cardSize * 0.16,
          ang,
          ang + Math.PI * 0.85
        );
        ctx.stroke();
      }
      break;
    }

    case "Claude": {
      ctx.fillStyle = "#D97706"; // Anthropic terracotta / amber
      ctx.fill();

      // White Claude asterisk spark
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cardSize * 0.08;
      ctx.lineCap = "round";
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * cardSize * 0.28, cy + Math.sin(ang) * cardSize * 0.28);
        ctx.stroke();
      }
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, cardSize * 0.07, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "Supabase": {
      ctx.fillStyle = "#171717";
      ctx.fill();

      // Emerald lightning bolt
      ctx.fillStyle = "#3ECF8E";
      ctx.beginPath();
      ctx.moveTo(cx + cardSize * 0.08, cy - cardSize * 0.32);
      ctx.lineTo(cx - cardSize * 0.22, cy + cardSize * 0.04);
      ctx.lineTo(cx - cardSize * 0.02, cy + cardSize * 0.04);
      ctx.lineTo(cx - cardSize * 0.08, cy + cardSize * 0.32);
      ctx.lineTo(cx + cardSize * 0.22, cy - cardSize * 0.04);
      ctx.lineTo(cx + cardSize * 0.02, cy - cardSize * 0.04);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "Stripe": {
      ctx.fillStyle = "#635BFF"; // Stripe blurple
      ctx.fill();

      // White italic 'S'
      ctx.fillStyle = "#ffffff";
      ctx.font = `italic 900 ${Math.round(cardSize * 0.62)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("S", cx, cy);
      break;
    }

    default: {
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.fillStyle = "#18181b";
      ctx.font = `800 ${Math.round(cardSize * 0.32)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name.slice(0, 3).toUpperCase(), cx, cy);
      break;
    }
  }

  ctx.restore();
}

// Shaders for Instanced Circles
const VERTEX_SHADER = `
attribute float aCell;
attribute float aReveal;
varying vec2 vUv;
varying float vCell;
varying float vReveal;
void main() {
  vUv = uv;
  vCell = aCell;
  vReveal = aReveal;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uAtlas;
uniform float uGrid;
uniform float uReady;
uniform vec3 uBackground;
uniform vec3 uFallback;
varying vec2 vUv;
varying float vCell;
varying float vReveal;
void main() {
  float column = mod(vCell, uGrid);
  float row = floor(vCell / uGrid);
  vec2 local = 0.5 + (vUv - 0.5) * 0.97;
  vec2 uv = vec2((column + local.x) / uGrid, (uGrid - 1.0 - row + local.y) / uGrid);
  vec3 color = mix(uFallback, texture2D(uAtlas, uv).rgb, uReady);
  gl_FragColor = vec4(mix(uBackground, color, vReveal), 1.0);
}
`;

// Shaders for Fullscreen Liquid Glass Post-Processing
const POST_VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const POST_FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uScene;
uniform float uAspect;
uniform vec2 uStart;
uniform float uReach;
uniform float uStrength;
uniform float uDispersion;
uniform float uBlur;
uniform float uFlow;
uniform float uTime;
uniform float uHalfWidth;
uniform vec3 uBackground;
uniform float uRound;
varying vec2 vUv;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}

vec2 toUv(vec2 q) {
  return vec2(q.x * 0.5 + 0.5, q.y * 0.5 * uAspect + 0.5);
}

void main() {
  vec2 q = vUv * 2.0 - 1.0;
  vec2 p = vec2(q.x, q.y / uAspect);
  float u = length(q);
  vec2 a = max(abs(q) / max(u, 0.00001), vec2(0.00001));
  float inner = uStart.x / a.x;
  float outer = 1.0 / a.x;
  float wx = 1.0;
  if (uRound > 0.5) {
    vec2 po = pow(a, vec2(uRound));
    float so = po.x + po.y;
    vec2 pi = pow(a / uStart, vec2(uRound));
    outer = pow(so, -1.0 / uRound);
    inner = pow(pi.x + pi.y, -1.0 / uRound);
    wx = po.x / so;
  }
  if (uStrength <= 0.0 || u <= inner) {
    gl_FragColor = vec4(texture2D(uScene, vUv).rgb, 1.0);
    return;
  }
  float t = clamp((u - inner) / max(outer - inner, 0.0001), 0.0, 1.0);
  vec2 dir = p / max(length(p), 0.0001);
  vec2 side = vec2(-dir.y, dir.x);
  float wave = noise(p * vec2(1.6, 3.1) + vec2(uTime * 0.06, -uTime * 0.09)) * 2.0 - 1.0;
  vec2 bend = side * wave * uFlow * t * t * 0.035 * uStrength;
  vec3 reach = max(uReach * (1.0 + uDispersion * vec3(1.0, 0.0, -1.0)), vec3(0.015));
  vec3 source = inner + (outer - inner) * reach * (1.0 - exp(-t / reach));
  vec3 scale = mix(vec3(1.0), source / u, uStrength);
  vec3 sx = pow(scale, vec3(1.0 + uFlow * 0.55 * (1.0 - wx)));
  vec3 sy = pow(scale, vec3(1.0 + uFlow * 0.55 * wx));
  float streak = uBlur * t * t * 0.05 * uStrength;
  float across = uBlur * pow(t, 1.5) * 0.012 * uStrength;
  vec3 color = vec3(0.0);
  for (int k = 0; k < 6; k++) {
    float fk = float(k);
    float a = fk * 2.39996 + 0.4;
    float r = sqrt((fk + 0.5) / 6.0);
    vec2 o = bend + dir * cos(a) * r * streak + side * sin(a) * r * across;
    color.r += texture2D(uScene, toUv(vec2(p.x * sx.r, p.y * sy.r) + o)).r;
    color.g += texture2D(uScene, toUv(vec2(p.x * sx.g, p.y * sy.g) + o)).g;
    color.b += texture2D(uScene, toUv(vec2(p.x * sx.b, p.y * sy.b) + o)).b;
  }
  color /= 6.0;
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = clamp(luma + (color - luma) * (1.0 + 0.5 * t * uStrength), 0.0, 1.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const getNum = (v: unknown, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

function parseColor(colorStr: string, fallback: string): THREE.Color {
  const c = new THREE.Color();
  try {
    c.set(colorStr);
  } catch {
    c.set(fallback);
  }
  return c.convertLinearToSRGB();
}

function createCircleGeometry(radiusFraction: number) {
  const r = clamp(radiusFraction, 0, 0.5);
  const segments = r > 1e-4 ? Math.max(4, Math.ceil((r / 0.5) * 24)) : 0;
  const offset = 0.5 - r;
  const positions: number[] = [0, 0, 0];
  const uvs: number[] = [0.5, 0.5];

  const corners = [
    [1, 1, 0],
    [-1, 1, Math.PI / 2],
    [-1, -1, Math.PI],
    [1, -1, 1.5 * Math.PI],
  ];

  for (const [cx, cy, startAngle] of corners) {
    for (let s = 0; s <= segments; s++) {
      const angle = startAngle + (segments ? (s / segments) * (Math.PI / 2) : 0);
      const x = cx * offset + Math.cos(angle) * r;
      const y = cy * offset + Math.sin(angle) * r;
      positions.push(x, y, 0);
      uvs.push(x + 0.5, y + 0.5);
    }
  }

  const vertCount = positions.length / 3 - 1;
  const indices: number[] = [];
  for (let i = 1; i <= vertCount; i++) {
    indices.push(0, i, (i % vertCount) + 1);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  geom.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geom.setIndex(indices);
  geom.computeBoundingSphere();
  return geom;
}

export interface LiquidCirclesProps {
  images?: string[];
  count?: number;
  rings?: number;
  size?: number;
  sizeVariance?: number;
  radius?: number;
  reach?: number;
  spread?: number;
  depth?: number;
  tilt?: number;
  angle?: number;
  perspective?: number;
  speed?: number;
  refraction?: number;
  edge?: number;
  edges?: "all" | "sides";
  dispersion?: number;
  blur?: number;
  flow?: number;
  backgroundColor?: string;
  interactive?: boolean;
  wheel?: boolean;
  focus?: boolean;
  intro?: boolean;
  seed?: number;
  onCircleClick?: (index: number, name: string) => void;
  onCircleHover?: (index: number, name: string) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface LiquidCirclesHandle {
  replay: () => void;
  spinBy: (deg: number) => void;
}

export const LiquidCircles = forwardRef<LiquidCirclesHandle, LiquidCirclesProps>(function LiquidCircles(
  {
    images,
    count = 28,
    rings = 5,
    size = 0.24,
    sizeVariance = 0.17,
    reach = 0.79,
    radius = 0.15,
    spread = 0.36,
    depth = 0.21,
    tilt = 19,
    angle = 63,
    perspective = 70,
    speed = 12,
    refraction = 0,
    edge = 0.24,
    edges = "all",
    dispersion = 0.9,
    blur = 0.5,
    flow = 1.25,
    backgroundColor = "#f0fff6",
    interactive = true,
    wheel = false,
    focus = true,
    intro = true,
    seed = 3,
    onCircleClick,
    onCircleHover,
    className = "",
    style,
    children,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const replayRef = useRef<() => void>(() => {});
  const spinByRef = useRef<(deg: number) => void>(() => {});
  const updatePropsRef = useRef<() => void>(() => {});
  const introFinishedRef = useRef(false);

  const appItems = images && images.length > 0 ? images : APP_NAMES;
  const imageKey = appItems.join("\n");

  const propsRef = useRef({
    count,
    rings,
    reach,
    radius,
    size,
    sizeVariance,
    spread,
    depth,
    tilt,
    angle,
    perspective,
    speed,
    refraction,
    edge,
    dispersion,
    blur,
    flow,
    backgroundColor,
    interactive,
    wheel,
    focus,
    edges,
    seed,
    onCircleClick,
    onCircleHover,
    list: appItems,
  });

  useEffect(() => {
    propsRef.current = {
      count,
      rings,
      reach,
      radius,
      size,
      sizeVariance,
      spread,
      depth,
      tilt,
      angle,
      perspective,
      speed,
      refraction,
      edge,
      dispersion,
      blur,
      flow,
      backgroundColor,
      interactive,
      wheel,
      focus,
      edges,
      seed,
      onCircleClick,
      onCircleHover,
      list: appItems,
    };
  }, [
    count,
    rings,
    reach,
    radius,
    size,
    sizeVariance,
    spread,
    depth,
    tilt,
    angle,
    perspective,
    speed,
    refraction,
    edge,
    dispersion,
    blur,
    flow,
    backgroundColor,
    interactive,
    wheel,
    focus,
    edges,
    seed,
    onCircleClick,
    onCircleHover,
    appItems,
  ]);

  useImperativeHandle(ref, () => ({
    replay: () => replayRef.current(),
    spinBy: (deg) => spinByRef.current(deg),
  }));

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const doc = container.ownerDocument;
    const win = doc.defaultView ?? window;
    const urlList = imageKey.split("\n").filter(Boolean);
    const uniqueItems = Array.from(new Set(urlList));

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Build Atlas Texture for circles
    const gridCols = Math.max(1, Math.ceil(Math.sqrt(uniqueItems.length)));
    const cellSize = clamp(Math.floor(1024 / gridCols), 64, 512);
    const atlasCanvas = doc.createElement("canvas");
    atlasCanvas.width = gridCols * cellSize;
    atlasCanvas.height = gridCols * cellSize;

    const atlasTexture = new THREE.CanvasTexture(atlasCanvas);
    atlasTexture.generateMipmaps = true;
    atlasTexture.minFilter = THREE.LinearMipmapLinearFilter;
    atlasTexture.magFilter = THREE.LinearFilter;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      samples: 4,
      depthBuffer: true,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const circleUniforms = {
      uAtlas: { value: atlasTexture },
      uGrid: { value: gridCols },
      uReady: { value: 1 },
      uBackground: { value: new THREE.Color() },
      uFallback: { value: new THREE.Color() },
    };

    const circleMaterial = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: circleUniforms,
    });

    let currentRadius = clamp(getNum(propsRef.current.radius, 0.15), 0, 0.5);
    let circleGeom = createCircleGeometry(currentRadius);

    const maxCount = 64;
    const cellAttrArr = new Float32Array(maxCount);
    const revealAttrArr = new Float32Array(maxCount);
    const cellAttr = new THREE.InstancedBufferAttribute(cellAttrArr, 1);
    const revealAttr = new THREE.InstancedBufferAttribute(revealAttrArr, 1);
    revealAttr.setUsage(THREE.DynamicDrawUsage);

    circleGeom.setAttribute("aCell", cellAttr);
    circleGeom.setAttribute("aReveal", revealAttr);

    const instancedMesh = new THREE.InstancedMesh(circleGeom, circleMaterial, maxCount);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instancedMesh.frustumCulled = false;
    scene.add(instancedMesh);

    // Fullscreen Liquid Post-Processing Quad
    const postUniforms = {
      uScene: { value: renderTarget.texture },
      uAspect: { value: 1 },
      uStart: { value: new THREE.Vector2(0.76, 0.76) },
      uReach: { value: 0.32 },
      uStrength: { value: 0 },
      uDispersion: { value: 0.9 },
      uBlur: { value: 0.5 },
      uFlow: { value: 1.25 },
      uTime: { value: 0 },
      uHalfWidth: { value: 100 },
      uBackground: { value: new THREE.Color() },
      uRound: { value: 6 },
    };

    const postMaterial = new THREE.ShaderMaterial({
      vertexShader: POST_VERTEX_SHADER,
      fragmentShader: POST_FRAGMENT_SHADER,
      uniforms: postUniforms,
    });

    const quadGeom = new THREE.BufferGeometry();
    quadGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)
    );
    quadGeom.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2)
    );

    const postMesh = new THREE.Mesh(quadGeom, postMaterial);
    postMesh.frustumCulled = false;
    const postScene = new THREE.Scene();
    postScene.add(postMesh);
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Calculation vectors & helpers
    const normalV = new THREE.Vector3(0, 0, 1);
    const axisW = new THREE.Vector3(1, 0, 0);
    const axisX = new THREE.Vector3(0, 1, 0);
    const quatG = new THREE.Quaternion();
    const quatY = new THREE.Quaternion();
    const quatJ = new THREE.Quaternion();
    const matBasis = new THREE.Matrix4();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const hitPoint = new THREE.Vector3();
    const projVector = new THREE.Vector3();
    const posVector = new THREE.Vector3();
    const scaleVector = new THREE.Vector3();
    const compMatrix = new THREE.Matrix4();

    let radiusX = 1;
    let radiusY = 1;
    let centerX = 0;
    let centerY = 0;
    let baseCircleScale = 0.4;
    let circlesData: Array<{
      orbit: number;
      theta: number;
      offset: number;
      scale: number;
      cell: number;
      delay: number;
      face: number;
      faceV: number;
    }> = [];

    let width = 1;
    let height = 1;
    let rotAngle = 0;
    let rotSpeed = 0;
    let deltaWheel = 0;
    let elapsedTime = 0;
    let introTime = 0;
    let isIntroPlaying = false;
    let isIntroPending = intro && !introFinishedRef.current;
    let isAtlasLoaded = true;
    let isIntersecting = true;
    let isDisposed = false;
    let animFrameId = 0;
    let isRendering = false;
    let lastFrameTime = 0;
    let hoveredIdx = -1;
    let focusFactor = 0;
    const pointerPos = { x: 0, y: 0, inside: false };
    const dragInfo = {
      active: false,
      id: -1,
      angle: 0,
      moved: 0,
      samples: [] as Array<{ t: number; a: number }>,
    };

    const getBaseSpeed = () => THREE.MathUtils.degToRad(getNum(propsRef.current.speed, 12));

    const projectToPlane = (px: number, py: number) => {
      projVector
        .copy(axisW)
        .multiplyScalar(px)
        .addScaledVector(axisX, py)
        .project(camera);
      return { x: projVector.x, y: projVector.y };
    };

    const updateBoundsAndStart = () => {
      const p = propsRef.current;
      const ed = clamp(getNum(p.edge, 0.24), 0.05, 0.95);
      postUniforms.uStart.value.set(
        Math.max(1 - ed, 0.05),
        Math.max(1 - ed / Math.max(width / height, 0.01), 0.05)
      );
      postUniforms.uRound.value = 6 * (p.edges !== "sides" ? 1 : 0);
    };

    const layoutCircles = () => {
      const p = propsRef.current;
      const countVal = clamp(Math.round(getNum(p.count, 28)), 1, 64);
      const ringsVal = clamp(Math.round(getNum(p.rings, 5)), 1, 6);
      const spreadRatio = 1 - clamp(getNum(p.spread, 0.36), 0, 0.9);
      const varianceVal = clamp(getNum(p.sizeVariance, 0.17), 0, 0.8);

      let rngSeed =
        Math.floor(0x9e3779b1 * (getNum(p.seed, 3) + 0.37)) >>> 0 || 1;
      const random = () => {
        rngSeed ^= rngSeed << 13;
        rngSeed ^= rngSeed >>> 17;
        return (((rngSeed ^= rngSeed << 5) >>> 0) % 1e5) / 1e5;
      };

      const ringOrbits = Array.from({ length: ringsVal }, (_, i) =>
        ringsVal === 1 ? 1 : spreadRatio + ((1 - spreadRatio) * i) / (ringsVal - 1)
      );
      const orbitSum = ringOrbits.reduce((a, b) => a + b, 0);
      const countsPerRing = ringOrbits.map((r) =>
        Math.max(1, Math.floor((countVal * r) / orbitSum))
      );
      let leftover = countVal - countsPerRing.reduce((a, b) => a + b, 0);
      for (let r = ringsVal - 1; leftover > 0; r = (r - 1 + ringsVal) % ringsVal) {
        countsPerRing[r] += 1;
        leftover -= 1;
      }
      while (countsPerRing.reduce((a, b) => a + b, 0) > countVal) {
        const maxIdx = countsPerRing.indexOf(Math.max(...countsPerRing));
        countsPerRing[maxIdx] -= 1;
      }

      const prevData = circlesData;
      circlesData = [];

      ringOrbits.forEach((orbit, ringIdx) => {
        const ringCount = countsPerRing[ringIdx];
        for (let i = 0; i < ringCount; i++) {
          const idx = circlesData.length;
          const old = prevData[idx];
          circlesData.push({
            orbit,
            theta: ((i + (ringIdx % 2) * 0.5) / ringCount) * Math.PI * 2,
            offset: (random() - 0.5) * 2,
            scale: 1 + (2 * random() - 1) * varianceVal,
            cell: uniqueItems.indexOf(urlList[idx % urlList.length]),
            delay: (ringsVal - 1 - ringIdx) * 0.16 + (i / ringCount) * 0.42,
            face: old ? old.face : 0,
            faceV: old ? old.faceV : 0,
          });
        }
      });

      instancedMesh.count = circlesData.length;
      circlesData.forEach((c, idx) => {
        cellAttrArr[idx] = Math.max(0, c.cell);
      });
      cellAttr.needsUpdate = true;
      if (hoveredIdx >= circlesData.length) hoveredIdx = -1;
    };

    const updateColorsAndMaterials = () => {
      const p = propsRef.current;
      const bgColor = parseColor(p.backgroundColor, "#f0fff6");
      const isLight =
        0.2126 * bgColor.r + 0.7152 * bgColor.g + 0.0722 * bgColor.b > 0.5;

      circleUniforms.uBackground.value.copy(bgColor);
      postUniforms.uBackground.value.copy(bgColor);
      updateBoundsAndStart();

      circleUniforms.uFallback.value
        .copy(bgColor)
        .lerp(isLight ? new THREE.Color(0, 0, 0) : new THREE.Color(1, 1, 1), 0.08);

      renderer.setClearColor(bgColor, 1);

      const refr = clamp(getNum(p.refraction, 0), 0, 2.5);
      postUniforms.uReach.value = 0.12 / Math.max(refr, 0.05);
      postUniforms.uDispersion.value = clamp(getNum(p.dispersion, 0.9), 0, 0.9);
      postUniforms.uBlur.value = clamp(getNum(p.blur, 0.5), 0, 3);
      postUniforms.uFlow.value = clamp(getNum(p.flow, 1.25), 0, 3);
    };

    const updateProjection = () => {
      const p = propsRef.current;
      const fovRad = THREE.MathUtils.degToRad(clamp(getNum(p.perspective, 70), 10, 100));
      camera.fov = THREE.MathUtils.radToDeg(
        2 * Math.atan(Math.tan(fovRad / 2) / Math.max(width / height, 0.01))
      );
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const angleVal =
        Math.PI / 2 - Math.atan2(height, width) + THREE.MathUtils.degToRad(getNum(p.angle, 63));
      const tiltVal = THREE.MathUtils.degToRad(clamp(getNum(p.tilt, 19), 0, 80));

      const v1 = new THREE.Vector3(-Math.sin(angleVal), Math.cos(angleVal), 0);
      const v2 = new THREE.Vector3(
        Math.cos(angleVal) * Math.cos(tiltVal),
        Math.sin(angleVal) * Math.cos(tiltVal),
        -Math.sin(tiltVal)
      );

      normalV.crossVectors(v2, v1).normalize();
      axisW.set(1, 0, 0).projectOnPlane(normalV).normalize();
      axisX.crossVectors(normalV, axisW).normalize();
      matBasis.makeBasis(axisW, axisX, normalV);
      quatG.setFromRotationMatrix(matBasis);
      plane.setFromNormalAndCoplanarPoint(normalV, new THREE.Vector3(0, 0, 0));

      const reachVal = clamp(getNum(p.reach, 0.79), 0.2, 1.6);
      updateBoundsAndStart();
      const startY = postUniforms.uStart.value.y;
      const sizeVal = clamp(getNum(p.size, 0.24), 0.05, 0.8);

      radiusX = 1;
      radiusY = 1;
      centerX = 0;
      centerY = 0;

      for (let step = 0; step < 6; step++) {
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;
        for (let i = 0; i < 64; i++) {
          const th = (i / 64) * Math.PI * 2;
          const pt = projectToPlane(
            centerX + Math.cos(th) * radiusX,
            centerY + Math.sin(th) * radiusY
          );
          minX = Math.min(minX, pt.x);
          maxX = Math.max(maxX, pt.x);
          minY = Math.min(minY, pt.y);
          maxY = Math.max(maxY, pt.y);
        }
        const spanX = Math.max((maxX - minX) / 2, 0.001);
        const spanY = Math.max((maxY - minY) / 2, 0.001);
        const cFactor =
          sizeVal * Math.min(radiusX, radiusY) * 0.5 * (spanY / radiusY);
        const dFactor =
          p.edges === "sides"
            ? clamp(0.84 - cFactor, 0.3, 0.9)
            : clamp(startY - 0.45 * cFactor, 0.3, 0.95);
        const avgY = (minY + maxY) / 2;
        centerX -= (((minX + maxX) / 2) * radiusX) / spanX * 0.9;
        centerY -= (avgY * radiusY) / spanY * 0.9;
        radiusX *= reachVal / spanX;
        radiusY *= dFactor / spanY;
      }

      baseCircleScale = sizeVal * Math.min(radiusX, radiusY);
      postUniforms.uAspect.value = width / height;
    };

    const handleResize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      const dpr = Math.min(2, win.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      renderTarget.setSize(Math.round(width * dpr), Math.round(height * dpr));
      postUniforms.uHalfWidth.value = (width * dpr) / 2;
      updateProjection();
    };

    // Update Simulation & Tick
    const updatePhysicsAndMatrices = (delta: number) => {
      const p = propsRef.current;
      elapsedTime += delta;
      postUniforms.uTime.value = elapsedTime;

      if (pointerPos.inside && !dragInfo.active && p.interactive) {
        const found = findCircleAtPoint(pointerPos.x, pointerPos.y);
        if (found !== hoveredIdx) {
          hoveredIdx = found;
          container.style.cursor =
            found >= 0 && (p.onCircleClick || p.onCircleHover) ? "pointer" : "grab";
          if (p.onCircleHover) {
            p.onCircleHover(found, found >= 0 ? p.list[found % p.list.length] : "");
          }
        }
      }

      focusFactor +=
        ((hoveredIdx >= 0 && p.focus ? 1 : 0) - focusFactor) *
        (1 - Math.exp(-delta / 0.35));

      if (!dragInfo.active) {
        rotSpeed +=
          (getBaseSpeed() * (1 - 0.8 * focusFactor) - rotSpeed) *
          (1 - Math.exp(-delta / 0.9));
        rotAngle += rotSpeed * delta;
      }

      if (deltaWheel !== 0) {
        const dw = deltaWheel * (1 - Math.exp(-delta / 0.16));
        rotAngle += dw;
        if (Math.abs((deltaWheel -= dw)) < 1e-4) deltaWheel = 0;
      }

      if (!p.interactive && hoveredIdx !== -1) hoveredIdx = -1;

      const refr = clamp(getNum(p.refraction, 0), 0, 2.5);
      const depthVal = clamp(getNum(p.depth, 0.21), 0, 1);
      let needsRedraw = false;
      let allSettled = true;

      if (isIntroPlaying) introTime += delta;
      const introProgress = isIntroPlaying ? easeOutCubic(introTime / 1.9) : 1;

      circlesData.forEach((circle, idx) => {
        let reveal = 1;
        if (isIntroPlaying) {
          const prog = clamp((introTime - circle.delay) / 1.25, 0, 1);
          reveal = easeOutCubic(prog);
          if (prog < 1) allSettled = false;
        } else if (!isAtlasLoaded) {
          reveal = 0;
        }

        const isHovered = idx === hoveredIdx && p.focus;
        const targetFace = isHovered ? 1 : 0;
        const springDamping = 2 * Math.sqrt(60) * 0.82;
        circle.faceV += (60 * (targetFace - circle.face) - springDamping * circle.faceV) * delta;
        circle.face += circle.faceV * delta;

        if (
          Math.abs(circle.faceV) > 5e-4 ||
          Math.abs(targetFace - circle.face) > 5e-4
        ) {
          needsRedraw = true;
        }

        const faceClamped = clamp(circle.face, 0, 1);
        const th = circle.theta + rotAngle - (1 - introProgress) * 1.4;
        const orb = circle.orbit * (0.25 + 0.75 * reveal);
        const sz =
          baseCircleScale *
          circle.scale *
          (1 + 0.14 * faceClamped) *
          (0.35 + 0.65 * reveal);

        posVector
          .copy(axisW)
          .multiplyScalar(centerX + Math.cos(th) * radiusX * orb)
          .addScaledVector(axisX, centerY + Math.sin(th) * radiusY * orb)
          .addScaledVector(
            normalV,
            (circle.offset * depthVal + 0.06 * faceClamped) * Math.min(radiusX, radiusY)
          );

        scaleVector.set(sz, sz, sz);
        quatY.copy(quatG).slerp(quatJ, faceClamped);
        compMatrix.compose(posVector, quatY, scaleVector);

        instancedMesh.setMatrixAt(idx, compMatrix);
        revealAttrArr[idx] = reveal;
      });

      instancedMesh.instanceMatrix.needsUpdate = true;
      revealAttr.needsUpdate = true;

      postUniforms.uStrength.value =
        Math.min(refr, 1) * (isIntroPlaying ? easeOutCubic(introTime / 1.6) : 1);

      if (isIntroPlaying && allSettled) isIntroPlaying = false;
      return needsRedraw;
    };

    const renderScenes = () => {
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);
    };

    const onAnimFrame = (timeMs: number) => {
      animFrameId = 0;
      isRendering = true;
      const dt = Math.min(0.05, lastFrameTime ? (timeMs - lastFrameTime) / 1000 : 1 / 60);
      lastFrameTime = timeMs;

      const needsMore = updatePhysicsAndMatrices(dt);
      renderScenes();
      isRendering = false;

      // Active revolving condition: as long as speed is active or user is dragging, keep looping!
      const baseSpd = getBaseSpeed();
      const hasMotion = Math.abs(baseSpd) > 1e-4 || Math.abs(rotSpeed) > 1e-4;

      if (
        !isDisposed &&
        isIntersecting &&
        !doc.hidden &&
        (hasMotion || isIntroPlaying || dragInfo.active || deltaWheel !== 0 || needsMore)
      ) {
        animFrameId = win.requestAnimationFrame(onAnimFrame);
      } else {
        lastFrameTime = 0;
      }
    };

    const requestFrame = () => {
      if (!animFrameId && !isRendering && !isDisposed && isIntersecting && !doc.hidden) {
        animFrameId = win.requestAnimationFrame(onAnimFrame);
      }
    };

    const startIntro = () => {
      if (isIntroPending && isAtlasLoaded && isIntersecting) {
        isIntroPending = false;
        introFinishedRef.current = true;
        isIntroPlaying = true;
        introTime = 0;
        requestFrame();
      }
    };

    // Draw app icons directly into canvas atlas synchronously
    const ctx = atlasCanvas.getContext("2d");
    if (ctx) {
      uniqueItems.forEach((item, idx) => {
        const col = idx % gridCols;
        const row = Math.floor(idx / gridCols);
        const x = col * cellSize;
        const y = row * cellSize;
        drawAppIconToCanvas(ctx, item, x, y, cellSize);
      });
      atlasTexture.needsUpdate = true;
      circleUniforms.uReady.value = 1;
      isAtlasLoaded = true;
    }

    // Pointer & Drag Interactions
    const screenToPlane = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      const ndc = new THREE.Vector2(normX, normY);

      raycaster.setFromCamera(ndc, camera);
      if (!raycaster.ray.intersectPlane(plane, hitPoint)) return null;

      const px = hitPoint.dot(axisW) - centerX;
      const py = hitPoint.dot(axisX) - centerY;
      return { x: px / radiusX, y: py / radiusY, px, py };
    };

    const findCircleAtPoint = (clientX: number, clientY: number) => {
      const pt = screenToPlane(clientX, clientY);
      if (!pt) return -1;
      let closestIdx = -1;
      let minDistance = Infinity;

      circlesData.forEach((c, idx) => {
        const th = c.theta + rotAngle;
        const ox = Math.cos(th) * radiusX * c.orbit;
        const oy = Math.sin(th) * radiusY * c.orbit;
        const dist = Math.hypot(pt.px - ox, pt.py - oy);
        const sz = baseCircleScale * c.scale * 0.5;
        const cornerDist = 2 * currentRadius * sz;
        const dx = Math.abs(pt.px - ox) - (sz - cornerDist);
        const dy = Math.abs(pt.py - oy) - (sz - cornerDist);
        if (
          Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) +
            Math.min(Math.max(dx, dy), 0) -
            cornerDist <
            0 &&
          dist < minDistance
        ) {
          closestIdx = idx;
          minDistance = dist;
        }
      });
      return closestIdx;
    };

    const getPointerAngle = (clientX: number, clientY: number) => {
      const pt = screenToPlane(clientX, clientY);
      return pt ? Math.atan2(pt.y, pt.x) : null;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!propsRef.current.interactive || (e.pointerType === "mouse" && e.button !== 0))
        return;
      const ang = getPointerAngle(e.clientX, e.clientY);
      if (ang !== null) {
        dragInfo.active = true;
        dragInfo.id = e.pointerId;
        dragInfo.angle = ang;
        dragInfo.moved = 0;
        dragInfo.samples = [{ t: e.timeStamp, a: rotAngle }];
        container.setPointerCapture?.(e.pointerId);
        requestFrame();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = propsRef.current;
      if (dragInfo.active && e.pointerId === dragInfo.id) {
        const ang = getPointerAngle(e.clientX, e.clientY);
        if (ang !== null) {
          let diff = ang - dragInfo.angle;
          if (diff > Math.PI) diff -= 2 * Math.PI;
          if (diff < -Math.PI) diff += 2 * Math.PI;
          rotAngle += diff;
          dragInfo.angle = ang;
          dragInfo.moved += Math.abs(diff);
          dragInfo.samples.push({ t: e.timeStamp, a: rotAngle });
          if (dragInfo.samples.length > 6) dragInfo.samples.shift();
        }
        requestFrame();
        return;
      }

      if (!p.interactive || e.pointerType !== "mouse") return;
      pointerPos.x = e.clientX;
      pointerPos.y = e.clientY;
      pointerPos.inside = true;

      const found = findCircleAtPoint(e.clientX, e.clientY);
      if (found !== hoveredIdx) {
        hoveredIdx = found;
        container.style.cursor = found >= 0 && (p.onCircleClick || p.onCircleHover) ? "pointer" : "grab";
        if (p.onCircleHover) {
          p.onCircleHover(found, found >= 0 ? p.list[found % p.list.length] : "");
        }
        requestFrame();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragInfo.active || e.pointerId !== dragInfo.id) return;
      dragInfo.active = false;
      container.releasePointerCapture?.(e.pointerId);

      const firstSample = dragInfo.samples[0];
      const lastSample = dragInfo.samples[dragInfo.samples.length - 1];
      const duration =
        lastSample && firstSample ? (lastSample.t - firstSample.t) / 1000 : 0;
      rotSpeed =
        duration > 0.008 && lastSample && firstSample
          ? clamp((lastSample.a - firstSample.a) / duration, -6, 6)
          : getBaseSpeed();

      const p = propsRef.current;
      container.style.cursor = hoveredIdx >= 0 && p.onCircleClick ? "pointer" : "grab";

      if (dragInfo.moved < 0.01 && p.onCircleClick) {
        const found = findCircleAtPoint(e.clientX, e.clientY);
        if (found >= 0) p.onCircleClick(found, p.list[found % p.list.length]);
      }
      requestFrame();
    };

    const onPointerLeave = () => {
      pointerPos.inside = false;
      if (hoveredIdx !== -1) {
        hoveredIdx = -1;
        if (propsRef.current.onCircleHover) {
          propsRef.current.onCircleHover(-1, "");
        }
        requestFrame();
      }
    };

    const onWheel = (e: WheelEvent) => {
      const p = propsRef.current;
      if (!p.interactive || !p.wheel) return;
      e.preventDefault();
      const factor = 1;
      const delta = clamp(
        (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * factor,
        -240,
        240
      );
      deltaWheel += 0.0045 * delta;
      requestFrame();
    };

    replayRef.current = () => {
      isIntroPending = true;
      introFinishedRef.current = false;
      startIntro();
    };

    spinByRef.current = (deg) => {
      deltaWheel += THREE.MathUtils.degToRad(getNum(deg, 0));
      requestFrame();
    };

    updatePropsRef.current = () => {
      const newRad = clamp(getNum(propsRef.current.radius, 0.15), 0, 0.5);
      if (newRad !== currentRadius) {
        currentRadius = newRad;
        const oldGeom = circleGeom;
        circleGeom = createCircleGeometry(newRad);
        circleGeom.setAttribute("aCell", cellAttr);
        circleGeom.setAttribute("aReveal", revealAttr);
        instancedMesh.geometry = circleGeom;
        oldGeom.dispose();
        cellAttr.needsUpdate = true;
        revealAttr.needsUpdate = true;
      }
      updateColorsAndMaterials();
      updateProjection();
      layoutCircles();
      updatePhysicsAndMatrices(0);
      renderScenes();
      requestFrame();
    };

    updateColorsAndMaterials();
    handleResize();
    layoutCircles();
    updatePhysicsAndMatrices(0);
    renderScenes();

    if (isIntroPending && isIntersecting) startIntro();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
      updatePhysicsAndMatrices(0);
      renderScenes();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver((entries) => {
      if ((isIntersecting = entries.some((entry) => entry.isIntersecting))) {
        startIntro();
        requestFrame();
      }
    });
    intersectionObserver.observe(container);

    const onVisChange = () => requestFrame();
    doc.addEventListener("visibilitychange", onVisChange);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("wheel", onWheel, { passive: false });

    requestFrame();

    return () => {
      isDisposed = true;
      win.cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      doc.removeEventListener("visibilitychange", onVisChange);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("wheel", onWheel);

      replayRef.current = () => {};
      spinByRef.current = () => {};
      updatePropsRef.current = () => {};

      atlasTexture.dispose();
      renderTarget.dispose();
      circleGeom.dispose();
      circleMaterial.dispose();
      instancedMesh.dispose();
      quadGeom.dispose();
      postMaterial.dispose();
      renderer.dispose();
    };
  }, [imageKey, intro]);

  useEffect(() => {
    updatePropsRef.current();
  }, [
    count,
    rings,
    size,
    sizeVariance,
    radius,
    reach,
    spread,
    depth,
    tilt,
    angle,
    perspective,
    speed,
    refraction,
    edge,
    edges,
    dispersion,
    blur,
    flow,
    backgroundColor,
    interactive,
    wheel,
    focus,
    seed,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden select-none", className)}
      style={{
        backgroundColor,
        cursor: interactive ? "grab" : undefined,
        touchAction: interactive ? "pan-y" : undefined,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {children}
    </div>
  );
});

LiquidCircles.displayName = "LiquidCircles";
