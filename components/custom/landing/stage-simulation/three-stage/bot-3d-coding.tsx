"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Texture for the glowing CRT terminal screen
function useTerminalTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark matrix/cyber terminal background
    ctx.fillStyle = "#0c131f";
    ctx.fillRect(0, 0, 512, 384);

    // Glowing green and cyan code lines
    ctx.font = "bold 26px monospace, sans-serif";
    ctx.fillStyle = "#a3e635";
    ctx.fillText("> fn spawn_agent() -> Bot {", 24, 52);

    ctx.fillStyle = "#38bdf8";
    ctx.fillText("    let cloud = VoxelCloud::new();", 24, 96);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText("    let crew = Crew::init(&config);", 24, 140);

    ctx.fillStyle = "#f59e0b";
    ctx.fillText("    crew.dispatch_all();", 24, 184);

    ctx.fillStyle = "#bef264";
    ctx.fillText("    println!(\"✓ 30/30 ok\");", 24, 228);

    ctx.fillStyle = "#a3e635";
    ctx.fillText("}", 24, 272);

    // Terminal command prompt at bottom
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("$ git commit -m \"feat: 3d agent\"", 24, 324);
    ctx.fillStyle = "#bef264";
    ctx.fillRect(490, 302, 14, 26); // Blinking cursor

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);
}

// Texture for mini terminal 1
function useMiniTerminalTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 256, 180);

    ctx.fillStyle = "#a3e635";
    ctx.font = "bold 20px monospace";
    ctx.fillText("> agent_space.ts", 16, 36);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("compiling 100%", 16, 72);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("[Ready 120fps]", 16, 110);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
}

export function Bot3DCoding() {
  const terminalScreenRef = useRef<THREE.Mesh>(null);
  const mini1Ref = useRef<THREE.Group>(null);
  const mini2Ref = useRef<THREE.Group>(null);

  const terminalTexture = useTerminalTexture();
  const miniTexture = useMiniTerminalTexture();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle CRT scanline flicker
    if (terminalScreenRef.current) {
      const mat = terminalScreenRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.94 + Math.sin(t * 12) * 0.06;
      }
    }

    // Mini displays subtle idle angle breathe
    if (mini1Ref.current) {
      mini1Ref.current.rotation.y = 0.45 + Math.sin(t * 1.5) * 0.03;
    }
    if (mini2Ref.current) {
      mini2Ref.current.rotation.y = 0.55 + Math.cos(t * 1.8) * 0.03;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* ── 1. VOXEL ISLAND BASE ── */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.4, 3.8]} />
        <meshStandardMaterial color="#84cc16" roughness={0.7} />
      </mesh>

      {/* Stepped dirt layer 1 */}
      <mesh position={[0, -0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.38, 3.5]} />
        <meshStandardMaterial color="#87532a" roughness={0.9} />
      </mesh>

      {/* Stepped dirt layer 2 */}
      <mesh position={[0, -0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.35, 3.0]} />
        <meshStandardMaterial color="#754522" roughness={0.9} />
      </mesh>

      {/* Stepped dirt bottom tip */}
      <mesh position={[0, -0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 2.2]} />
        <meshStandardMaterial color="#5e3619" roughness={0.9} />
      </mesh>

      {/* Hanging vines */}
      <mesh position={[-1.75, -0.35, 0.8]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.28]} />
        <meshStandardMaterial color="#84cc16" />
      </mesh>

      {/* ── 2. RETRO BEIGE CRT COMPUTER WORKSTATION ── */}
      <group position={[0.1, 0.2, 0]} rotation={[0, -0.22, 0]}>
        {/* CPU Base Unit Under Monitor */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.5, 0.38, 1.4]} />
          <meshStandardMaterial color="#e2ddd5" roughness={0.7} />
        </mesh>
        {/* Floppy Drive Slot */}
        <mesh position={[0.42, 0.24, 0.71]}>
          <boxGeometry args={[0.34, 0.04, 0.02]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        {/* Power Button */}
        <mesh position={[-0.5, 0.24, 0.71]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        {/* CRT Monitor Outer Shell (Beige with tapered rear) */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[1.42, 1.12, 1.15]} />
          <meshStandardMaterial color="#e5e0d8" roughness={0.7} />
        </mesh>
        {/* Monitor Bevel Face */}
        <mesh position={[0, 0.95, 0.58]} castShadow>
          <boxGeometry args={[1.32, 1.02, 0.08]} />
          <meshStandardMaterial color="#d6d1c7" roughness={0.6} />
        </mesh>

        {/* Glowing Terminal CRT Screen */}
        <mesh ref={terminalScreenRef} position={[0, 0.95, 0.63]}>
          <planeGeometry args={[1.22, 0.92]} />
          {terminalTexture ? (
            <meshBasicMaterial map={terminalTexture} transparent />
          ) : (
            <meshBasicMaterial color="#022c22" />
          )}
        </mesh>

        {/* Chunky Retro Keyboard in Front */}
        <group position={[0, 0.08, 1.05]} rotation={[-0.1, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.35, 0.12, 0.55]} />
            <meshStandardMaterial color="#e5e0d8" roughness={0.7} />
          </mesh>
          {/* Keycap area */}
          <mesh position={[0, 0.07, -0.02]}>
            <boxGeometry args={[1.25, 0.04, 0.44]} />
            <meshStandardMaterial color="#a8a29e" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ── 3. DUAL MINI AUXILIARY TERMINAL SCREENS ON LEFT ── */}
      <group ref={mini1Ref} position={[-1.15, 0.2, 0.4]} rotation={[0, 0.45, 0]}>
        {/* Mini Monitor 1 */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.55, 0.5, 0.35]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.32, 0.18]}>
          <planeGeometry args={[0.48, 0.42]} />
          {miniTexture ? (
            <meshBasicMaterial map={miniTexture} />
          ) : (
            <meshBasicMaterial color="#090d16" />
          )}
        </mesh>
      </group>

      <group ref={mini2Ref} position={[-1.25, 0.2, -0.3]} rotation={[0, 0.55, 0]}>
        {/* Mini Monitor 2 */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.58, 0.55, 0.35]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.38, 0.18]}>
          <planeGeometry args={[0.5, 0.46]} />
          <meshBasicMaterial color="#042f2e" />
        </mesh>
      </group>

      {/* ── 4. GITHUB OCTOCAT VOXEL CUBES ON RIGHT ── */}
      <group position={[1.25, 0.22, 0.6]} rotation={[0, -0.3, 0]}>
        {/* Octocat Block 1 */}
        <mesh castShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[0.44, 0.44, 0.44]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>
        {/* Octocat Face Glyph */}
        <mesh position={[0, 0.22, 0.23]}>
          <planeGeometry args={[0.32, 0.32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Octocat Block 2 Beside */}
        <mesh castShadow position={[0.48, 0.18, -0.2]}>
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>
        <mesh position={[0.48, 0.18, -0.005]}>
          <planeGeometry args={[0.26, 0.26]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
