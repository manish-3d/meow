"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Key } from "lucide-react";

/* =====================================================================
   CONFIG
   ===================================================================== */
const LOOP_SECONDS = 35; // one full loop of all 7 brands
const CELL = 230; // px per brand slot
const ICON = 28; // logo height in px (max 28)
const LABEL = 12; // brand-name font size
const BAND_H = 160; // height of the track band
const RIM = 64; // half-height of the glass rails
const LOOK = "bulge"; // 'bulge' = rails pinch in at center and flare out at edges
const MAX_ANGLE = 0.85; // how far the cylinder bends at screen edges (radians)
const RIPPLE_PX = 9; // ripple strength

/* =====================================================================
   REAL LOGO PATHS (simple-icons, CC0, 24×24 viewBox)
   ===================================================================== */
const P = {
  openai:
    "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  anthropic:
    "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z",
  gemini:
    "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  deepseek:
    "M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45",
  kimi: "M21.765.351C22.998.351 24 1.353 24 2.586S22.998 4.82 21.765 4.82h-1.974c-.15 0-.26-.12-.26-.26V2.586A2.237 2.237 0 0 1 21.765.35M9.41 13.388l8.447-8.377c.16-.16.07-.471-.14-.471h-4.55s-.1.02-.14.06l-9.099 9.029c-.14.14-.35.02-.35-.21V4.81c0-.15-.1-.27-.221-.27H.22c-.12 0-.22.12-.22.27v18.57c0 .15.1.27.22.27h3.137c.12 0 .22-.12.22-.27v-3.79c0-.08.03-.16.08-.21l2.826-2.796c.07-.07.16-.08.241-.03l7.546 5.551a8.9 8.9 0 0 0 4.018 1.493c.12.01.23-.11.23-.27V19.76c0-.14-.08-.25-.19-.26a5.8 5.8 0 0 1-2.355-.942l-6.533-4.73c-.14-.09-.15-.32-.03-.441",
};

/* Canvas 2D draw utilities */
type GradientStop = [number, string];
const grad = (
  x: CanvasRenderingContext2D,
  s: number,
  stops: GradientStop[],
  x0 = 0,
  y0 = 0,
  x1 = 1,
  y1 = 1
) => {
  const g = x.createLinearGradient(x0 * s, y0 * s, x1 * s, y1 * s);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
};

const tile = (x: CanvasRenderingContext2D, s: number, fill: string | CanvasGradient) => {
  x.beginPath();
  if (typeof (x as unknown as { roundRect?: unknown }).roundRect === "function") {
    (x as unknown as { roundRect: (a: number, b: number, c: number, d: number, r: number) => void }).roundRect(0, 0, s, s, s * 0.25);
  } else {
    x.rect(0, 0, s, s);
  }
  x.fillStyle = fill;
  x.fill();
};

const path = (
  x: CanvasRenderingContext2D,
  s: number,
  d: string,
  fill: string | CanvasGradient,
  inset = 0
) => {
  x.save();
  const k = (s * (1 - inset)) / 24;
  x.translate((s * inset) / 2, (s * inset) / 2);
  x.scale(k, k);
  x.fillStyle = fill;
  x.fill(new Path2D(d));
  x.restore();
};

interface BrandDef {
  name: string;
  draw: (x: CanvasRenderingContext2D, s: number, dark: boolean) => void;
}

const BRANDS: BrandDef[] = [
  {
    name: "ChatGPT",
    draw: (x, s) => {
      tile(x, s, grad(x, s, [[0, "#1fd18b"], [1, "#0c8f6c"]]));
      path(x, s, P.openai, "#fff", 0.36);
    },
  },
  {
    name: "Claude",
    draw: (x, s) => path(x, s, P.anthropic, "#D97757"),
  },
  {
    name: "Gemini",
    draw: (x, s) =>
      path(
        x,
        s,
        P.gemini,
        grad(x, s, [[0, "#4A8CFF"], [0.55, "#9B72E8"], [1, "#E0679A"]])
      ),
  },
  {
    name: "Grok",
    draw: (x, s) => {
      tile(x, s, grad(x, s, [[0, "#f6f7f9"], [1, "#b9bdc4"]]));
      x.strokeStyle = "rgba(0,0,0,.12)";
      x.lineWidth = 1;
      x.stroke();
      path(x, s, P.x, "#0b0b0c", 0.4);
    },
  },
  {
    name: "DeepSeek",
    draw: (x, s) => path(x, s, P.deepseek, "#4D6BFE"),
  },
  {
    name: "Kimi",
    draw: (x, s, dark) => path(x, s, P.kimi, dark ? "#f4f4f5" : "#15171c"),
  },
  {
    name: "Copilot",
    draw: (x, s) => {
      x.save();
      x.scale(s / 24, s / 24);
      x.lineCap = "round";
      x.lineJoin = "round";
      const g = x.createLinearGradient(3, 20, 21, 4);
      ([
        [0, "#1E8BFF"],
        [0.45, "#8B5CF6"],
        [0.8, "#F062B5"],
        [1, "#FF9A3C"],
      ] as GradientStop[]).forEach(([o, c]) => g.addColorStop(o, c));
      x.strokeStyle = g;
      x.lineWidth = 5.2;
      x.beginPath();
      x.moveTo(5.5, 19);
      x.bezierCurveTo(5.5, 9, 7.5, 4.8, 11.2, 4.8);
      x.bezierCurveTo(14.6, 4.8, 14.4, 9, 15.6, 13.2);
      x.bezierCurveTo(16.4, 16, 17.4, 19.2, 19, 19.2);
      x.stroke();
      x.globalAlpha = 0.55;
      x.lineWidth = 2.2;
      x.strokeStyle = "#fff";
      x.beginPath();
      x.moveTo(8.4, 15);
      x.bezierCurveTo(8.4, 9.6, 9.4, 7, 11, 7);
      x.stroke();
      x.restore();
    },
  },
];
const N = BRANDS.length;

/* =====================================================================
   SHADERS — cylinder curve + liquid ripple + per-card wobble + glass rails
   ===================================================================== */
const VS = `#version 300 es
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;
uniform vec2 uSize, uMouse;
uniform float uDpr, uT, uOff, uHT, uK, uR, uDark, uRipple;
uniform float uHov[${N}];
uniform sampler2D uTex;
out vec4 o;
const float CELL = ${CELL}.0;
const float N = ${N}.0;
const float BH = ${BAND_H}.0;
const float RIM = ${RIM}.0;
void main(){
  vec2 p = gl_FragCoord.xy / uDpr - uSize * 0.5;
  /* liquid ripple around the cursor */
  vec2 d = p - uMouse;
  float dist = length(d) + 0.001;
  float wave = sin(dist * 0.05 - uT * 5.0) * exp(-dist / 170.0) * uHT;
  p += d / dist * wave * uRipple + vec2(sin(p.y * 0.03 + uT * 2.0), cos(p.x * 0.025 + uT * 1.7)) * 1.6 * uHT * exp(-dist / 260.0);
  /* cylinder: screen x -> angle -> arc length; perspective scale per angle */
  float th = asin(clamp(p.x / uR, -0.999, 0.999));
  float s = 1.0 / (1.0 + uK * (1.0 - cos(th)));
  float tx = uR * th + uOff;
  float ty = p.y / s;
  /* which brand slot + spring-driven per-card liquid wobble */
  float cf = floor(tx / CELL);
  int ci = int(clamp(mod(cf, N), 0.0, N - 1.0));
  vec2 loc = vec2(tx - (cf + 0.5) * CELL, ty);
  float h = uHov[ci];
  loc += vec2(sin(loc.y * 0.09 + uT * 5.0 + float(ci)), sin(loc.x * 0.07 + uT * 4.2)) * 5.0 * h;
  loc /= 1.0 + 0.16 * h;
  vec2 uv = vec2(((float(ci) + 0.5) * CELL + loc.x) / (N * CELL), 0.5 - loc.y / BH);
  vec4 lg = texture(uTex, uv);
  lg *= mix(1.0, 0.8, pow(abs(th) / ${MAX_ANGLE.toFixed(2)}, 2.0));
  /* glass rails */
  float ay = abs(ty);
  float m1 = 1.0 - smoothstep(1.0, 2.4, abs(ay - RIM) * s);
  float m2 = (1.0 - smoothstep(0.5, 1.5, abs(ay - (RIM - 9.0)) * s)) * 0.55;
  float m3 = (1.0 - smoothstep(0.5, 1.5, abs(ay - (RIM + 7.0)) * s)) * 0.3;
  float a = clamp(m1 * 0.95 + m2 + m3, 0.0, 1.0);
  float shine = 0.5 + 0.5 * sin(p.x * 0.006 + ty * 0.02);
  vec3 rc = uDark > 0.5 ? mix(vec3(0.38), vec3(0.92), shine) : mix(vec3(0.62, 0.64, 0.67), vec3(0.98), shine);
  float ga = smoothstep(RIM - 42.0, RIM, ay) * step(ay, RIM) * 0.07;
  vec3 gc = vec3(uDark);
  vec4 under = vec4(rc * a + gc * ga * (1.0 - a), a + ga * (1.0 - a));
  o = lg + under * (1.0 - lg.a);
}`;

/* =====================================================================
   MAIN COMPONENT: IntegrationsCarousel
   ===================================================================== */
export function IntegrationsCarousel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasFallback, setHasFallback] = useState(false);

  // Interaction handlers reference
  const nudgeRef = useRef<(amount: number) => void>(() => {});

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
    });

    if (!gl) {
      setHasFallback(true);
      return;
    }

    // VAO setup for WebGL 2 spec compliance
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const U: Record<string, WebGLUniformLocation | null> = {};
    [
      "uSize",
      "uMouse",
      "uDpr",
      "uT",
      "uOff",
      "uHT",
      "uK",
      "uR",
      "uDark",
      "uRipple",
      "uHov",
      "uTex",
    ].forEach((name) => {
      U[name] = gl.getUniformLocation(prog, name);
    });

    const tex = gl.createTexture();
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const darkMQ = window.matchMedia?.("(prefers-color-scheme: dark)");

    let DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let R = 1;
    let dark =
      (darkMQ?.matches ?? false) &&
      document.documentElement.dataset.theme !== "light";
    const K = LOOK === "bulge" ? -1.0 : 1.2;

    function buildAtlas() {
      if (!gl) return;
      const tw = Math.round(N * CELL * DPR);
      const th = Math.round(BAND_H * DPR);
      const c = document.createElement("canvas");
      c.width = tw;
      c.height = th;
      const x = c.getContext("2d");
      if (!x) return;

      const S = ICON * DPR;
      const font = `500 ${LABEL * DPR}px Inter, system-ui, sans-serif`;

      BRANDS.forEach((b, i) => {
        const cx = (i + 0.5) * CELL * DPR;
        const iconTop = th / 2 - S / 2 - 12 * DPR;
        x.save();
        x.translate(cx - S / 2, iconTop);
        b.draw(x, S, dark);
        x.restore();
        x.font = font;
        x.textAlign = "center";
        x.textBaseline = "alphabetic";
        x.fillStyle = dark ? "#a1a1aa" : "#52525b";
        x.fillText(b.name, cx, iconTop + S + 18 * DPR);
      });

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    function resize() {
      if (!stage || !canvas || !gl) return;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth;
      H = stage.clientHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      gl.viewport(0, 0, canvas.width, canvas.height);
      R = W / 2 / Math.sin(MAX_ANGLE);
      buildAtlas();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const onDarkChange = (e: MediaQueryListEvent) => {
      dark = e.matches;
      buildAtlas();
    };
    darkMQ?.addEventListener("change", onDarkChange);

    /* ---------------- state ---------------- */
    const PERIOD = N * CELL;
    const AUTO = reduce ? 0 : PERIOD / LOOP_SECONDS;
    let off = 0;
    let speedMul = 1;
    let nudgeLeft = 0;
    let inertia = 0;
    let dragging = false;
    let ht = 0;
    let htTarget = 0;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    let hovered = -1;
    const hov = new Float32Array(N);
    const hovV = new Float32Array(N);

    // Provide nudge trigger to outside buttons
    nudgeRef.current = (amount: number) => {
      nudgeLeft += amount;
    };

    function cardAt(px: number, py: number) {
      const th = Math.asin(Math.max(-0.999, Math.min(0.999, px / R)));
      const s = 1 / (1 + K * (1 - Math.cos(th)));
      const tx = R * th + off;
      const ty = py / s;
      const cf = Math.floor(tx / CELL);
      const lx = tx - (cf + 0.5) * CELL;
      return Math.abs(lx) < 75 && Math.abs(ty) < 46 ? ((cf % N) + N) % N : -1;
    }

    function setPointer(e: PointerEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      tmx = e.clientX - r.left - W / 2;
      tmy = -(e.clientY - r.top - H / 2);
      hovered = cardAt(tmx, tmy);
    }

    const onPointerEnter = (e: PointerEvent) => {
      htTarget = 1;
      setPointer(e);
      mx = tmx;
      my = tmy;
    };

    const onPointerLeave = () => {
      htTarget = 0;
      hovered = -1;
    };

    let lastX = 0;
    let lastT = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
      canvas.classList.add("cursor-grabbing");
      lastX = e.clientX;
      lastT = performance.now();
      inertia = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      setPointer(e);
      if (dragging) {
        const now = performance.now();
        const dx = e.clientX - lastX;
        const dt = Math.max(now - lastT, 1) / 1000;
        off -= dx;
        inertia = (-dx / dt) * 0.6 + inertia * 0.4;
        lastX = e.clientX;
        lastT = now;
      }
    };

    const endDrag = (e: PointerEvent) => {
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
      canvas.classList.remove("cursor-grabbing");
    };

    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    /* ---------------- loop ---------------- */
    let last = performance.now();
    let running = true;
    let ready = false;
    let looping = false;
    let rafId = 0;

    function frame(now: number) {
      if (!running || !gl) {
        looping = false;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Scroll: constant auto-drift + nudges + drag inertia
      speedMul += ((dragging ? 0 : 1) - speedMul) * (1 - Math.exp(-dt * 2.5));
      const step = nudgeLeft * (1 - Math.exp(-dt * 7));
      nudgeLeft -= step;
      off += AUTO * speedMul * dt + step + (dragging ? 0 : inertia * dt);
      inertia *= Math.exp(-dt * 3.2);
      off = ((off % PERIOD) + PERIOD) % PERIOD;

      // Liquid: eased hover strength + lagging cursor
      ht += (htTarget - ht) * (1 - Math.exp(-dt * 4));
      const f = 1 - Math.exp(-dt * 10);
      mx += (tmx - mx) * f;
      my += (tmy - my) * f;

      // Per-card spring (fluid bounce)
      for (let i = 0; i < N; i++) {
        const tgt = i === hovered ? 1 : 0;
        hovV[i] += ((tgt - hov[i]) * 170 - hovV[i] * 10) * dt;
        hov[i] += hovV[i] * dt;
      }

      gl.uniform2f(U.uSize, W, H);
      gl.uniform2f(U.uMouse, mx, my);
      gl.uniform1f(U.uDpr, DPR);
      gl.uniform1f(U.uT, now / 1000);
      gl.uniform1f(U.uOff, off);
      gl.uniform1f(U.uHT, ht);
      gl.uniform1f(U.uK, K);
      gl.uniform1f(U.uR, R);
      gl.uniform1f(U.uDark, dark ? 1 : 0);
      gl.uniform1f(U.uRipple, reduce ? 0 : RIPPLE_PX);
      gl.uniform1fv(U.uHov, hov);
      gl.uniform1i(U.uTex, 0);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      rafId = requestAnimationFrame(frame);
    }

    function kick() {
      if (ready && running && !looping) {
        looping = true;
        last = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    }

    const io = new IntersectionObserver(([en]) => {
      running = en.isIntersecting;
      kick();
    });
    io.observe(stage);

    (document.fonts
      ? document.fonts.load("500 12px Inter")
      : Promise.resolve()
    ).finally(() => {
      resize();
      ready = true;
      kick();
    });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      darkMQ?.removeEventListener("change", onDarkChange);
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      if (gl) {
        gl.deleteTexture(tex);
        gl.deleteProgram(prog);
      }
    };
  }, []);

  const handlePrev = useCallback(() => {
    nudgeRef.current(-CELL);
  }, []);

  const handleNext = useCallback(() => {
    nudgeRef.current(CELL);
  }, []);

  return (
    <section
      id="integrations-carousel"
      className="relative w-full max-w-full overflow-hidden pt-10 sm:pt-14 pb-12 sm:pb-16 bg-white text-[#131316] select-none text-center"
    >
      {/* ── 1. TOP HEADLINE & BANNER ── */}
      <div className="max-w-4xl mx-auto px-4 z-10 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 mb-3 shadow-2xs">
          <Key className="size-3.5 text-neutral-800" />
          <span>bring the AI models you already pay for &middot; zero API markup</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
          integration is simple.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-500 font-light max-w-xl mx-auto">
          connect with the AI models you already love.
        </p>
      </div>

      {/* ── 2. WEBGL2 CYLINDER LENS STAGE ── */}
      <div
        className="stage relative w-full h-[300px] sm:h-[320px] mt-4 touch-pan-y"
        ref={stageRef}
      >
        <canvas
          ref={canvasRef}
          id="lens"
          className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing"
          aria-label="ChatGPT, Claude, Gemini, Grok, DeepSeek, Kimi and Copilot logos scrolling in a loop"
          role="img"
        />
        {hasFallback && (
          <div className="py-20 px-5 text-neutral-500 text-sm">
            WebGL 2 is not available in this browser.
          </div>
        )}
      </div>

      {/* ── 3. PREV / NEXT NAVIGATION CONTROLS ── */}
      <div className="flex gap-3.5 justify-center mt-3 z-10">
        <button
          onClick={handlePrev}
          className="w-8.5 h-8.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800 grid place-items-center cursor-pointer transition-all active:scale-95 shadow-2xs hover:shadow-xs"
          aria-label="Previous"
        >
          <svg
            className="w-3.5 h-3.5 stroke-current fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
            viewBox="0 0 16 16"
          >
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="w-8.5 h-8.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800 grid place-items-center cursor-pointer transition-all active:scale-95 shadow-2xs hover:shadow-xs"
          aria-label="Next"
        >
          <svg
            className="w-3.5 h-3.5 stroke-current fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
            viewBox="0 0 16 16"
          >
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </section>
  );
}
