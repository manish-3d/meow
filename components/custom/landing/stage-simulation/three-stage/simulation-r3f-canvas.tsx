"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { LoneMascot3D } from "./lone-mascot-3d";
import { Thanos3DParticles } from "./thanos-3d-particles";
import { Bot3DResearcher } from "./bot-3d-researcher";
import { Bot3DSocial } from "./bot-3d-social";
import { Bot3DCoding } from "./bot-3d-coding";
import { Bot3DJob } from "./bot-3d-job";
import { Connecting3DCables } from "./connecting-3d-cables";

interface SimulationR3FCanvasProps {
  phase: 1 | 2 | 3 | 4 | 5 | 6;
  activeBotId?: string;
  onSelectBot?: (botId: string) => void;
}

// ── 3D Scene Controller with smooth lerping & quadrant physics ──
function SimulationScene({ phase, activeBotId, onSelectBot }: SimulationR3FCanvasProps) {
  const loneRef = useRef<THREE.Group>(null);
  const botTLRef = useRef<THREE.Group>(null);
  const botTRRef = useRef<THREE.Group>(null);
  const botBLRef = useRef<THREE.Group>(null);
  const botBRRef = useRef<THREE.Group>(null);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  // Target coordinates for the 4 quadrants (Isometric layout)
  // Top-Left: Research Bot
  // Top-Right: Social Media Bot
  // Bottom-Left: Coding Bot
  // Bottom-Right: Job Bot
  const TARGET_TL = new THREE.Vector3(-3.4, 0, -2.2);
  const TARGET_TR = new THREE.Vector3(3.4, 0, -2.2);
  const TARGET_BL = new THREE.Vector3(-3.4, 0, 2.2);
  const TARGET_BR = new THREE.Vector3(3.4, 0, 2.2);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // ── Phase 1: Lone Center Mascot ──
    if (loneRef.current) {
      if (phase === 1) {
        loneRef.current.visible = true;
        loneRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 8);
        loneRef.current.position.set(0, 0, 0);
      } else if (phase === 2) {
        // Shrink & disintegrate
        loneRef.current.visible = true;
        loneRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 5);
      } else {
        loneRef.current.visible = false;
        loneRef.current.scale.set(0, 0, 0);
      }
    }

    // ── Phase 3, 4, 5, 6: Quadrant Islands Outward Flight & Settle ──
    const showQuad = phase >= 3;

    // Helper for interpolating quadrant positions
    const updateQuadrant = (
      ref: React.RefObject<THREE.Group | null>,
      target: THREE.Vector3,
      burstOffset: THREE.Vector3
    ) => {
      if (!ref.current) return;
      if (!showQuad) {
        ref.current.visible = false;
        ref.current.scale.set(0, 0, 0);
        ref.current.position.set(0, 0, 0);
        return;
      }

      ref.current.visible = true;

      if (phase === 3) {
        // Pop-Out Genesis: Spring burst near center
        ref.current.scale.lerp(new THREE.Vector3(0.95, 0.95, 0.95), delta * 9);
        ref.current.position.lerp(burstOffset, delta * 9);
      } else if (phase === 4) {
        // Outward Flight: Expanding outwards
        ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 6);
        const midPoint = target.clone().multiplyScalar(0.75);
        ref.current.position.lerp(midPoint, delta * 5);
      } else {
        // Phase 5 & 6: Settle into exact positions with gentle idle float
        ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 7);
        const idleY = Math.sin(t * 1.8 + target.x) * 0.08;
        const finalTarget = new THREE.Vector3(target.x, target.y + idleY, target.z);
        ref.current.position.lerp(finalTarget, delta * 6);
      }
    };

    updateQuadrant(botTLRef, TARGET_TL, new THREE.Vector3(-1.4, 0.4, -0.9));
    updateQuadrant(botTRRef, TARGET_TR, new THREE.Vector3(1.4, 0.4, -0.9));
    updateQuadrant(botBLRef, TARGET_BL, new THREE.Vector3(-1.4, -0.2, 0.9));
    updateQuadrant(botBRRef, TARGET_BR, new THREE.Vector3(1.4, -0.2, 0.9));

    // Camera Framing
    if (phase === 1 || phase === 2) {
      // Closer zoom on center lone mascot
      state.camera.position.lerp(new THREE.Vector3(6.5, 5.5, 7.5), delta * 4);
    } else {
      // Wide cinematic isometric view framing all 4 quadrants
      state.camera.position.lerp(new THREE.Vector3(11.5, 9.5, 13.5), delta * 4);
    }
    state.camera.lookAt(cameraTargetRef.current);
  });

  return (
    <>
      {/* ── AMBIENT & DIRECTIONAL LIGHTING (MINECRAFT SUNLIGHT) ── */}
      <ambientLight intensity={0.9} color="#e0f2fe" />
      <directionalLight
        position={[14, 20, 12]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#ffffff"
      />
      <directionalLight position={[-10, 8, -10]} intensity={0.4} color="#bef264" />

      {/* ── PHASE 1: LONE MASCOT PERCHED IN CENTER ── */}
      <group ref={loneRef}>
        <LoneMascot3D />
      </group>

      {/* ── PHASE 2: THANOS PARTICLE DISPERSAL ── */}
      <Thanos3DParticles active={phase === 2} />

      {/* ── PHASE 5 & 6: CONNECTING DATA CABLES ── */}
      <Connecting3DCables active={phase >= 5} />

      {/* ── THE 4 SPECIALIZED 3D AGENT ISLANDS ── */}
      {/* 1. TOP-LEFT: RESEARCH BOT */}
      <group
        ref={botTLRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectBot?.("research-bot");
        }}
      >
        <Bot3DResearcher isHovered={activeBotId === "research-bot"} />
      </group>

      {/* 2. TOP-RIGHT: SOCIAL MEDIA BOT */}
      <group
        ref={botTRRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectBot?.("social-bot");
        }}
      >
        <Bot3DSocial />
      </group>

      {/* 3. BOTTOM-LEFT: CODING BOT */}
      <group
        ref={botBLRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectBot?.("coding-bot");
        }}
      >
        <Bot3DCoding />
      </group>

      {/* 4. BOTTOM-RIGHT: JOB BOT */}
      <group
        ref={botBRRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectBot?.("job-bot");
        }}
      >
        <Bot3DJob />
      </group>
    </>
  );
}

export function SimulationR3FCanvas(props: SimulationR3FCanvasProps) {
  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [11.5, 9.5, 13.5], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <SimulationScene {...props} />
      </Canvas>
    </div>
  );
}
