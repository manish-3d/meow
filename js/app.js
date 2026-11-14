/**
 * PROJECT: JEV // TYPESAFE AI — CINEMATIC TECH NOIR MOTION COMIC REEL
 * 1080 x 1920 Instagram Reel Synchronization & Canvas Simulation Engine
 */

(function () {
  'use strict';

  // =========================================================================
  // EMBEDDED WORD-LEVEL TRANSCRIPT (139 WORDS // EXACT PARAKEET ALIGNMENT)
  // =========================================================================
  const TRANSCRIPT_WORDS = [
  {
    "id": "w0",
    "text": "Everyone's",
    "start": 0.24,
    "end": 0.88
  },
  {
    "id": "w1",
    "text": "building",
    "start": 0.88,
    "end": 1.36
  },
  {
    "id": "w2",
    "text": "AI",
    "start": 1.36,
    "end": 1.92
  },
  {
    "id": "w3",
    "text": "that",
    "start": 1.92,
    "end": 2.16
  },
  {
    "id": "w4",
    "text": "talks.",
    "start": 2.16,
    "end": 2.8
  },
  {
    "id": "w5",
    "text": "But",
    "start": 2.8,
    "end": 2.96
  },
  {
    "id": "w6",
    "text": "what",
    "start": 2.96,
    "end": 3.12
  },
  {
    "id": "w7",
    "text": "if",
    "start": 3.12,
    "end": 3.28
  },
  {
    "id": "w8",
    "text": "I",
    "start": 3.28,
    "end": 3.44
  },
  {
    "id": "w9",
    "text": "told",
    "start": 3.44,
    "end": 3.68
  },
  {
    "id": "w10",
    "text": "you",
    "start": 3.68,
    "end": 3.92
  },
  {
    "id": "w11",
    "text": "there's",
    "start": 3.92,
    "end": 4.24
  },
  {
    "id": "w12",
    "text": "a",
    "start": 4.24,
    "end": 4.32
  },
  {
    "id": "w13",
    "text": "new",
    "start": 4.32,
    "end": 4.56
  },
  {
    "id": "w14",
    "text": "AI",
    "start": 4.56,
    "end": 5.04
  },
  {
    "id": "w15",
    "text": "model",
    "start": 5.2,
    "end": 5.52
  },
  {
    "id": "w16",
    "text": "designed",
    "start": 5.68,
    "end": 6.08
  },
  {
    "id": "w17",
    "text": "to",
    "start": 6.08,
    "end": 6.24
  },
  {
    "id": "w18",
    "text": "do",
    "start": 6.24,
    "end": 6.4
  },
  {
    "id": "w19",
    "text": "something",
    "start": 6.4,
    "end": 6.88
  },
  {
    "id": "w20",
    "text": "completely",
    "start": 6.88,
    "end": 7.44
  },
  {
    "id": "w21",
    "text": "different?",
    "start": 7.44,
    "end": 8
  },
  {
    "id": "w22",
    "text": "Meet",
    "start": 8,
    "end": 8.32
  },
  {
    "id": "w23",
    "text": "Jev",
    "start": 8.32,
    "end": 8.8
  },
  {
    "id": "w24",
    "text": "from",
    "start": 8.8,
    "end": 8.96
  },
  {
    "id": "w25",
    "text": "TypeSafe",
    "start": 8.96,
    "end": 9.84
  },
  {
    "id": "w26",
    "text": "AI.",
    "start": 9.84,
    "end": 10.32
  },
  {
    "id": "w27",
    "text": "Unlike",
    "start": 10.32,
    "end": 10.72
  },
  {
    "id": "w28",
    "text": "ChatGPT",
    "start": 10.72,
    "end": 11.52
  },
  {
    "id": "w29",
    "text": "or",
    "start": 11.52,
    "end": 11.68
  },
  {
    "id": "w30",
    "text": "Claude,",
    "start": 11.68,
    "end": 12.24
  },
  {
    "id": "w31",
    "text": "Jev",
    "start": 12.24,
    "end": 12.64
  },
  {
    "id": "w32",
    "text": "isn't",
    "start": 12.64,
    "end": 12.88
  },
  {
    "id": "w33",
    "text": "designed",
    "start": 12.88,
    "end": 13.2
  },
  {
    "id": "w34",
    "text": "to",
    "start": 13.2,
    "end": 13.28
  },
  {
    "id": "w35",
    "text": "write",
    "start": 13.28,
    "end": 13.52
  },
  {
    "id": "w36",
    "text": "essays,",
    "start": 13.52,
    "end": 14.08
  },
  {
    "id": "w37",
    "text": "generate",
    "start": 14.08,
    "end": 14.64
  },
  {
    "id": "w38",
    "text": "code,",
    "start": 14.64,
    "end": 14.96
  },
  {
    "id": "w39",
    "text": "or",
    "start": 14.96,
    "end": 15.2
  },
  {
    "id": "w40",
    "text": "hold",
    "start": 15.2,
    "end": 15.6
  },
  {
    "id": "w41",
    "text": "conversations.",
    "start": 15.6,
    "end": 16.56
  },
  {
    "id": "w42",
    "text": "It",
    "start": 16.56,
    "end": 16.8
  },
  {
    "id": "w43",
    "text": "makes",
    "start": 16.8,
    "end": 17.04
  },
  {
    "id": "w44",
    "text": "decisions.",
    "start": 17.04,
    "end": 17.76
  },
  {
    "id": "w45",
    "text": "You",
    "start": 17.76,
    "end": 17.92
  },
  {
    "id": "w46",
    "text": "give",
    "start": 17.92,
    "end": 18.16
  },
  {
    "id": "w47",
    "text": "it",
    "start": 18.16,
    "end": 18.4
  },
  {
    "id": "w48",
    "text": "information",
    "start": 18.4,
    "end": 18.8
  },
  {
    "id": "w49",
    "text": "and",
    "start": 18.88,
    "end": 19.2
  },
  {
    "id": "w50",
    "text": "specific",
    "start": 19.2,
    "end": 19.68
  },
  {
    "id": "w51",
    "text": "questions.",
    "start": 19.68,
    "end": 20.16
  },
  {
    "id": "w52",
    "text": "Should",
    "start": 20.32,
    "end": 20.64
  },
  {
    "id": "w53",
    "text": "this",
    "start": 20.64,
    "end": 20.8
  },
  {
    "id": "w54",
    "text": "request",
    "start": 20.8,
    "end": 21.2
  },
  {
    "id": "w55",
    "text": "be",
    "start": 21.2,
    "end": 21.44
  },
  {
    "id": "w56",
    "text": "escalated?",
    "start": 21.44,
    "end": 22.24
  },
  {
    "id": "w57",
    "text": "Which",
    "start": 22.24,
    "end": 22.48
  },
  {
    "id": "w58",
    "text": "category",
    "start": 22.48,
    "end": 23.04
  },
  {
    "id": "w59",
    "text": "does",
    "start": 23.04,
    "end": 23.28
  },
  {
    "id": "w60",
    "text": "it",
    "start": 23.28,
    "end": 23.44
  },
  {
    "id": "w61",
    "text": "belong",
    "start": 23.44,
    "end": 23.76
  },
  {
    "id": "w62",
    "text": "to?",
    "start": 23.76,
    "end": 24.16
  },
  {
    "id": "w63",
    "text": "How",
    "start": 24.16,
    "end": 24.4
  },
  {
    "id": "w64",
    "text": "urgent",
    "start": 24.4,
    "end": 24.8
  },
  {
    "id": "w65",
    "text": "is",
    "start": 24.8,
    "end": 24.96
  },
  {
    "id": "w66",
    "text": "it?",
    "start": 24.96,
    "end": 25.28
  },
  {
    "id": "w67",
    "text": "Jev",
    "start": 25.28,
    "end": 25.68
  },
  {
    "id": "w68",
    "text": "returns",
    "start": 25.68,
    "end": 26.08
  },
  {
    "id": "w69",
    "text": "structured",
    "start": 26.08,
    "end": 26.56
  },
  {
    "id": "w70",
    "text": "choices,",
    "start": 26.56,
    "end": 27.04
  },
  {
    "id": "w71",
    "text": "scores,",
    "start": 27.04,
    "end": 27.44
  },
  {
    "id": "w72",
    "text": "and",
    "start": 27.44,
    "end": 27.6
  },
  {
    "id": "w73",
    "text": "probabilities",
    "start": 27.6,
    "end": 28.24
  },
  {
    "id": "w74",
    "text": "that",
    "start": 28.32,
    "end": 28.56
  },
  {
    "id": "w75",
    "text": "software",
    "start": 28.56,
    "end": 29.12
  },
  {
    "id": "w76",
    "text": "can",
    "start": 29.12,
    "end": 29.36
  },
  {
    "id": "w77",
    "text": "use",
    "start": 29.36,
    "end": 29.68
  },
  {
    "id": "w78",
    "text": "directly.",
    "start": 29.68,
    "end": 30.56
  },
  {
    "id": "w79",
    "text": "No",
    "start": 30.56,
    "end": 30.8
  },
  {
    "id": "w80",
    "text": "paragraphs",
    "start": 30.8,
    "end": 31.52
  },
  {
    "id": "w81",
    "text": "to",
    "start": 31.52,
    "end": 31.76
  },
  {
    "id": "w82",
    "text": "interpret.",
    "start": 31.76,
    "end": 32.64
  },
  {
    "id": "w83",
    "text": "JUST",
    "start": 32.64,
    "end": 33.2
  },
  {
    "id": "w84",
    "text": "ES!",
    "start": 33.36,
    "end": 35.44
  },
  {
    "id": "w85",
    "text": "And",
    "start": 35.6,
    "end": 35.84
  },
  {
    "id": "w86",
    "text": "here's",
    "start": 35.84,
    "end": 36.24
  },
  {
    "id": "w87",
    "text": "the",
    "start": 36.24,
    "end": 36.4
  },
  {
    "id": "w88",
    "text": "interesting",
    "start": 36.4,
    "end": 36.88
  },
  {
    "id": "w89",
    "text": "part.",
    "start": 36.88,
    "end": 37.36
  },
  {
    "id": "w90",
    "text": "Jeff",
    "start": 37.36,
    "end": 37.84
  },
  {
    "id": "w91",
    "text": "isn't",
    "start": 37.92,
    "end": 38.16
  },
  {
    "id": "w92",
    "text": "trying",
    "start": 38.16,
    "end": 38.48
  },
  {
    "id": "w93",
    "text": "to",
    "start": 38.48,
    "end": 38.64
  },
  {
    "id": "w94",
    "text": "replace",
    "start": 38.64,
    "end": 39.2
  },
  {
    "id": "w95",
    "text": "ChatGPT.",
    "start": 39.2,
    "end": 40.4
  },
  {
    "id": "w96",
    "text": "It's",
    "start": 40.4,
    "end": 40.64
  },
  {
    "id": "w97",
    "text": "designed",
    "start": 40.64,
    "end": 41.04
  },
  {
    "id": "w98",
    "text": "to",
    "start": 41.04,
    "end": 41.2
  },
  {
    "id": "w99",
    "text": "work",
    "start": 41.2,
    "end": 41.52
  },
  {
    "id": "w100",
    "text": "alongside",
    "start": 41.52,
    "end": 42.24
  },
  {
    "id": "w101",
    "text": "models",
    "start": 42.24,
    "end": 42.8
  },
  {
    "id": "w102",
    "text": "like",
    "start": 42.8,
    "end": 43.04
  },
  {
    "id": "w103",
    "text": "it,",
    "start": 43.04,
    "end": 43.6
  },
  {
    "id": "w104",
    "text": "handling",
    "start": 43.6,
    "end": 44.16
  },
  {
    "id": "w105",
    "text": "the",
    "start": 44.16,
    "end": 44.4
  },
  {
    "id": "w106",
    "text": "smaller",
    "start": 44.4,
    "end": 45.04
  },
  {
    "id": "w107",
    "text": "decisions",
    "start": 45.04,
    "end": 45.84
  },
  {
    "id": "w108",
    "text": "that",
    "start": 45.84,
    "end": 46.08
  },
  {
    "id": "w109",
    "text": "happen",
    "start": 46.08,
    "end": 46.56
  },
  {
    "id": "w110",
    "text": "inside",
    "start": 46.56,
    "end": 47.04
  },
  {
    "id": "w111",
    "text": "AI-power",
    "start": 47.04,
    "end": 48.08
  },
  {
    "id": "w112",
    "text": "software.",
    "start": 48.08,
    "end": 48.88
  },
  {
    "id": "w113",
    "text": "Because",
    "start": 48.88,
    "end": 49.2
  },
  {
    "id": "w114",
    "text": "the",
    "start": 49.2,
    "end": 49.36
  },
  {
    "id": "w115",
    "text": "future",
    "start": 49.36,
    "end": 49.76
  },
  {
    "id": "w116",
    "text": "of",
    "start": 49.76,
    "end": 50
  },
  {
    "id": "w117",
    "text": "AI",
    "start": 50,
    "end": 50.64
  },
  {
    "id": "w118",
    "text": "might",
    "start": 50.8,
    "end": 51.2
  },
  {
    "id": "w119",
    "text": "not",
    "start": 51.2,
    "end": 51.36
  },
  {
    "id": "w120",
    "text": "just",
    "start": 51.36,
    "end": 51.6
  },
  {
    "id": "w121",
    "text": "be",
    "start": 51.6,
    "end": 51.76
  },
  {
    "id": "w122",
    "text": "about",
    "start": 51.76,
    "end": 52
  },
  {
    "id": "w123",
    "text": "making",
    "start": 52,
    "end": 52.4
  },
  {
    "id": "w124",
    "text": "models",
    "start": 52.4,
    "end": 52.88
  },
  {
    "id": "w125",
    "text": "smarter.",
    "start": 52.88,
    "end": 53.6
  },
  {
    "id": "w126",
    "text": "It",
    "start": 53.6,
    "end": 53.84
  },
  {
    "id": "w127",
    "text": "might",
    "start": 53.84,
    "end": 54.08
  },
  {
    "id": "w128",
    "text": "be",
    "start": 54.08,
    "end": 54.32
  },
  {
    "id": "w129",
    "text": "about",
    "start": 54.32,
    "end": 54.56
  },
  {
    "id": "w130",
    "text": "making",
    "start": 54.56,
    "end": 54.96
  },
  {
    "id": "w131",
    "text": "software",
    "start": 54.96,
    "end": 55.6
  },
  {
    "id": "w132",
    "text": "smarter",
    "start": 55.6,
    "end": 56.4
  },
  {
    "id": "w133",
    "text": "at",
    "start": 56.4,
    "end": 56.72
  },
  {
    "id": "w134",
    "text": "deciding",
    "start": 56.72,
    "end": 57.68
  },
  {
    "id": "w135",
    "text": "what",
    "start": 57.68,
    "end": 58
  },
  {
    "id": "w136",
    "text": "to",
    "start": 58.24,
    "end": 58.56
  },
  {
    "id": "w137",
    "text": "do",
    "start": 58.56,
    "end": 58.88
  },
  {
    "id": "w138",
    "text": "next.",
    "start": 59.2,
    "end": 60.48
  }
];

  const TOTAL_DURATION = 62.64;

  // Scene Chapter Breakdown
  const SCENES = [
    { id: 'scene-1', start: 0.00, end: 2.80, title: 'AI That Talks' },
    { id: 'scene-2', start: 2.80, end: 8.00, title: 'The Unexpected Question' },
    { id: 'scene-3', start: 8.00, end: 16.56, title: 'Meet Jev' },
    { id: 'scene-4', start: 16.56, end: 35.50, title: 'Jev Makes Decisions' },
    { id: 'scene-5', start: 35.50, end: 40.40, title: 'Inside An AI Agent' },
    { id: 'scene-6', start: 40.40, end: 48.88, title: 'Models Working Together' },
    { id: 'scene-7', start: 48.88, end: 62.64, title: 'Cinematic Finale' }
  ];

  // DOM Elements
  const viewport = document.getElementById('reel-viewport');
  const stage = document.getElementById('reel-stage');
  const audio = document.getElementById('voiceover-audio');
  const bgCanvas = document.getElementById('bg-canvas');
  const ctx = bgCanvas ? bgCanvas.getContext('2d') : null;

  const btnPlayPause = document.getElementById('btn-play-pause');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const btnRestart = document.getElementById('btn-restart');
  const btnMute = document.getElementById('btn-mute');
  const iconVol = document.getElementById('icon-vol');
  const iconMuted = document.getElementById('icon-muted');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnExport = document.getElementById('btn-export');
  const scrubber = document.getElementById('timeline-scrubber');
  const progressFill = document.getElementById('timeline-progress-fill');
  const timeDisplay = document.getElementById('time-display');
  const captionText = document.getElementById('caption-text');

  // Scene Elements
  const sceneElements = SCENES.map(s => document.getElementById(s.id));
  const cardQ1 = document.getElementById('card-q1');
  const cardQ2 = document.getElementById('card-q2');
  const cardQ3 = document.getElementById('card-q3');
  const gaugeArc = document.getElementById('gauge-arc-path');
  const gaugeText = document.getElementById('gauge-val-text');
  const meterFill = document.getElementById('meter-fill-bar');
  const jsonBox = document.getElementById('output-json-box');
  const noParagraphs = document.getElementById('no-paragraphs-overlay');
  const impactFrame = document.getElementById('impact-frame');
  const finEmblem = document.getElementById('fin-emblem');

  // Character Elements
  const char1 = document.querySelector('.char-scene-1');
  const char2 = document.querySelector('.char-scene-2');
  const char3 = document.querySelector('.char-scene-3');
  const char4Lap = document.querySelector('.char-scene-4-lap');
  const char4Point = document.querySelector('.char-scene-4-point');
  const char5 = document.querySelector('.char-scene-5');
  const char6 = document.querySelector('.char-scene-6');
  const char7 = document.querySelector('.char-scene-7');

  let isPlaying = false;
  let isScrubbing = false;
  let currentTime = 0;
  let lastTimestamp = performance.now();

  // =========================================================================
  // RESPONSIVE VIEWPORT SCALING (1080x1920 INTO ANY CONTAINER)
  // =========================================================================
  function resizeViewport() {
    if (!stage || !viewport) return;
    const availW = stage.clientWidth - 20;
    const availH = stage.clientHeight - 20;
    const targetRatio = 1080 / 1920;
    const currentRatio = availW / availH;

    let scale;
    if (currentRatio > targetRatio) {
      scale = availH / 1920;
    } else {
      scale = availW / 1080;
    }
    scale = Math.min(scale, 1.0); // Don't scale up past native 1080x1920
    viewport.style.transform = `scale(${scale})`;
  }

  window.addEventListener('resize', resizeViewport);
  resizeViewport();

  // =========================================================================
  // DYNAMIC CANVAS SIMULATION: PARTICLES, VOLUMETRIC LIGHT & SPEED LINES
  // =========================================================================
  const particles = [];
  const PARTICLE_COUNT = 140;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * 1080,
      y: Math.random() * 1920,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.7,
      size: 1.5 + Math.random() * 3.5,
      alpha: 0.15 + Math.random() * 0.6,
      color: Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(30, 136, 229, '
    });
  }

  function drawCanvasSimulation(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, 1080, 1920);

    // 1. Chiaroscuro Volumetric Light Shafts
    ctx.save();
    const grad = ctx.createLinearGradient(1080, 0, 0, 1920);
    grad.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
    grad.addColorStop(0.4, 'rgba(212, 175, 55, 0.02)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(1080, 0);
    ctx.lineTo(600, 0);
    ctx.lineTo(0, 1400);
    ctx.lineTo(0, 1920);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Dust Motes & Technical Particles
    for (let p of particles) {
      p.x += p.vx + Math.sin(t * 1.5 + p.y * 0.01) * 0.2;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = 1920;
        p.x = Math.random() * 1080;
      }
      if (p.x < 0) p.x = 1080;
      if (p.x > 1080) p.x = 0;

      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. High Energy Speed Lines on "JUST DECISIONS!" (32.64s - 35.50s)
    if (t >= 32.64 && t <= 35.50) {
      const lines = 36;
      ctx.save();
      ctx.translate(540, 960);
      for (let i = 0; i < lines; i++) {
        const angle = (i / lines) * Math.PI * 2 + (t * 4);
        const len = 350 + Math.random() * 450;
        ctx.strokeStyle = (i % 2 === 0) ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 2 + Math.random() * 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 180, Math.sin(angle) * 180);
        ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // =========================================================================
  // DETERMINISTIC SCENE & STATE RENDERER: renderFrame(t)
  // =========================================================================
  window.renderFrame = function(t) {
    currentTime = Math.max(0, Math.min(t, TOTAL_DURATION));

    // Update Scrubber and Timer UI
    if (progressFill) {
      const pct = (currentTime / TOTAL_DURATION) * 100;
      progressFill.style.width = `${pct}%`;
    }
    if (scrubber && !isScrubbing) {
      scrubber.value = currentTime;
    }
    if (timeDisplay) {
      const curM = Math.floor(currentTime / 60);
      const curS = (currentTime % 60).toFixed(2).padStart(5, '0');
      const totM = Math.floor(TOTAL_DURATION / 60);
      const totS = (TOTAL_DURATION % 60).toFixed(2).padStart(5, '0');
      timeDisplay.textContent = `0${curM}:${curS} / 0${totM}:${totS}`;
    }

    // Determine Active Scene
    let activeSceneIdx = 0;
    for (let i = 0; i < SCENES.length; i++) {
      if (currentTime >= SCENES[i].start && currentTime <= SCENES[i].end) {
        activeSceneIdx = i;
        break;
      }
    }
    if (currentTime >= SCENES[SCENES.length - 1].end) {
      activeSceneIdx = SCENES.length - 1;
    }

    sceneElements.forEach((el, idx) => {
      if (el) {
        if (idx === activeSceneIdx) el.classList.add('active');
        else el.classList.remove('active');
      }
    });

    // Character 2.5D Subtle Floating Physics
    const breathe = Math.sin(currentTime * 2.2) * 4;
    const subtleSway = Math.sin(currentTime * 1.5) * 0.01;

    if (char1) char1.style.transform = `translateX(-50%) translateY(${breathe}px) rotate(${subtleSway * 2}deg)`;
    if (char2) char2.style.transform = `translateX(-50%) translateY(${breathe}px)`;
    if (char3) char3.style.transform = `translateY(${breathe * 1.2}px)`;
    if (char4Lap) char4Lap.style.transform = `translateX(-50%) translateY(${breathe}px)`;
    if (char5) char5.style.transform = `translateY(${breathe}px)`;
    if (char6) char6.style.transform = `translateY(${breathe}px)`;
    if (char7) char7.style.transform = `translateX(-50%) translateY(${breathe * 0.8}px) scale(${1 + (currentTime - 48.88) * 0.005})`;

    // -----------------------------------------------------------------------
    // SCENE SPECIFIC DYNAMICS
    // -----------------------------------------------------------------------

    // SCENE 4: Jev Makes Decisions (16.56s - 35.50s)
    if (activeSceneIdx === 3) {
      // Decision 1: Escalation Probability (20.16s - 22.24s)
      if (currentTime >= 20.16) {
        const progress1 = Math.min(1, (currentTime - 20.16) / 1.4);
        const arcLength = 204;
        const dashOffset = arcLength * (1 - 0.894 * progress1);
        if (gaugeArc) gaugeArc.style.strokeDashoffset = dashOffset;
        if (gaugeText) gaugeText.textContent = `${(89.4 * progress1).toFixed(1)}%`;
        if (cardQ1) cardQ1.classList.add('active-focus');
      } else {
        if (gaugeArc) gaugeArc.style.strokeDashoffset = '204';
        if (gaugeText) gaugeText.textContent = '0.0%';
        if (cardQ1) cardQ1.classList.remove('active-focus');
      }

      // Decision 2: Category Tree (22.24s - 24.16s)
      if (currentTime >= 22.24) {
        if (cardQ2) cardQ2.classList.add('active-focus');
      } else {
        if (cardQ2) cardQ2.classList.remove('active-focus');
      }

      // Decision 3: Urgency Score (24.16s - 25.28s)
      if (currentTime >= 24.16) {
        const progress3 = Math.min(1, (currentTime - 24.16) / 0.8);
        if (meterFill) meterFill.style.width = `${94 * progress3}%`;
        if (cardQ3) cardQ3.classList.add('active-focus');
      } else {
        if (meterFill) meterFill.style.width = '0%';
        if (cardQ3) cardQ3.classList.remove('active-focus');
      }

      // Structured JSON Output (25.28s - 30.56s)
      if (currentTime >= 25.28 && currentTime < 30.56) {
        if (jsonBox) jsonBox.style.opacity = '1';
      }

      // No paragraphs to interpret (30.56s - 32.64s)
      if (currentTime >= 30.56 && currentTime < 32.64) {
        if (noParagraphs) noParagraphs.style.display = 'block';
      } else {
        if (noParagraphs) noParagraphs.style.display = 'none';
      }

      // JUST DECISIONS! Impact Frame (32.64s - 35.50s)
      if (currentTime >= 32.64 && currentTime <= 35.50) {
        if (impactFrame) impactFrame.classList.add('active');
        // Screen shake
        const shakeX = Math.sin(currentTime * 45) * 6;
        const shakeY = Math.cos(currentTime * 50) * 6;
        if (viewport) viewport.style.transform = `scale(${parseFloat(viewport.style.transform.replace(/[^0-9.]/g, '') || 1)}) translate(${shakeX}px, ${shakeY}px)`;
      } else {
        if (impactFrame) impactFrame.classList.remove('active');
      }
    }

    // SCENE 7: Finale Emblem Lockup
    if (activeSceneIdx === 6) {
      if (currentTime >= 57.5) {
        if (finEmblem) finEmblem.classList.add('show');
      } else {
        if (finEmblem) finEmblem.classList.remove('show');
      }
    }

    // -----------------------------------------------------------------------
    // KINETIC CAPTIONS UPDATE (EXACT WORD SYNCHRONIZATION)
    // -----------------------------------------------------------------------
    let activeWordText = '';
    for (let i = 0; i < TRANSCRIPT_WORDS.length; i++) {
      const w = TRANSCRIPT_WORDS[i];
      if (currentTime >= w.start && currentTime <= w.end + 0.3) {
        // Find current phrase window (previous 3 words + current + next 3 words)
        const startIdx = Math.max(0, i - 3);
        const endIdx = Math.min(TRANSCRIPT_WORDS.length, i + 5);
        activeWordText = TRANSCRIPT_WORDS.slice(startIdx, endIdx).map(item => {
          if (item.id === w.id) {
            return `<span style="color:var(--gold-primary); text-shadow:0 0 10px var(--gold-glow); font-size:1.15em; font-weight:800;">${item.text}</span>`;
          }
          return item.text;
        }).join(' ');
        break;
      }
    }

    if (activeWordText && captionText) {
      captionText.innerHTML = activeWordText;
    }

    // Canvas Background Particle Simulation
    drawCanvasSimulation(currentTime);
  };

  // =========================================================================
  // MAIN ANIMATION LOOP (PLAYBACK & AUDIO SYNC)
  // =========================================================================
  function animLoop(now) {
    if (isPlaying && audio && !audio.paused) {
      renderFrame(audio.currentTime);
      if (audio.currentTime >= TOTAL_DURATION) {
        pauseReel();
        renderFrame(TOTAL_DURATION);
      }
    }
    requestAnimationFrame(animLoop);
  }
  requestAnimationFrame(animLoop);

  // =========================================================================
  // CONTROLS & EVENT LISTENERS
  // =========================================================================
  function playReel() {
    isPlaying = true;
    if (iconPlay) iconPlay.classList.add('hidden');
    if (iconPause) iconPause.classList.remove('hidden');
    if (audio) {
      if (audio.currentTime >= TOTAL_DURATION) audio.currentTime = 0;
      audio.play().catch(e => console.warn('Audio play notice:', e));
    }
  }

  function pauseReel() {
    isPlaying = false;
    if (iconPlay) iconPlay.classList.remove('hidden');
    if (iconPause) iconPause.classList.add('hidden');
    if (audio) audio.pause();
  }

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      if (isPlaying) pauseReel();
      else playReel();
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      if (audio) audio.currentTime = 0;
      renderFrame(0);
      playReel();
    });
  }

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      if (audio) {
        audio.muted = !audio.muted;
        if (audio.muted) {
          iconVol.classList.add('hidden');
          iconMuted.classList.remove('hidden');
        } else {
          iconVol.classList.remove('hidden');
          iconMuted.classList.add('hidden');
        }
      }
    });
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => alert(err.message));
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Scrubber Events
  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      isScrubbing = true;
      const targetTime = parseFloat(e.target.value);
      if (audio) audio.currentTime = targetTime;
      renderFrame(targetTime);
    });
    scrubber.addEventListener('change', () => {
      isScrubbing = false;
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (isPlaying) pauseReel();
      else playReel();
    } else if (e.code === 'KeyM') {
      if (btnMute) btnMute.click();
    } else if (e.code === 'KeyF') {
      if (btnFullscreen) btnFullscreen.click();
    } else if (e.code === 'Home') {
      if (btnRestart) btnRestart.click();
    } else if (e.code === 'ArrowRight') {
      if (audio) audio.currentTime = Math.min(TOTAL_DURATION, audio.currentTime + 5);
      renderFrame(audio.currentTime);
    } else if (e.code === 'ArrowLeft') {
      if (audio) audio.currentTime = Math.max(0, audio.currentTime - 5);
      renderFrame(audio.currentTime);
    }
  });

  // Export MP4 Trigger
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'output_reel.mp4';
      link.download = 'jev_cinematic_reel.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Initialize at t = 0
  renderFrame(0);

})();
