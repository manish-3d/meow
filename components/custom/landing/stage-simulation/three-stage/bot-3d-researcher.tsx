"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Texture for the "Browsing AI trends >" screen
function useMonitorTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark cyber/slate background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 512, 256);

    // Glowing cyan/green header
    ctx.font = "bold 34px monospace, sans-serif";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("Browsing", 32, 70);
    ctx.fillStyle = "#22c55e";
    ctx.fillText("AI trends >", 32, 115);

    // Scrolling data bars
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(32, 140, 448, 14);
    ctx.fillRect(32, 168, 380, 14);
    ctx.fillRect(32, 196, 420, 14);

    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(32, 140, 260, 14);
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(32, 168, 190, 14);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);
}

// Texture for the laptop screen
function useLaptopTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 256, 180);

    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(16, 20, 120, 12);
    ctx.fillStyle = "#34d399";
    ctx.fillRect(16, 44, 200, 8);
    ctx.fillRect(16, 60, 170, 8);
    ctx.fillRect(16, 76, 220, 8);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
}

export function Bot3DResearcher({ isHovered = false }: { isHovered?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const leftPawRef = useRef<THREE.Mesh>(null);
  const rightPawRef = useRef<THREE.Mesh>(null);

  const monitorTexture = useMonitorTexture();
  const laptopTexture = useLaptopTexture();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Cat head breathing and gentle nod
    if (headRef.current) {
      headRef.current.position.y = 1.05 + Math.sin(t * 2.2) * 0.03;
      headRef.current.rotation.y = Math.sin(t * 1.4) * 0.08;
      headRef.current.rotation.x = Math.sin(t * 1.8) * 0.04;
    }

    // Gentle tail sway
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 3.2) * 0.35;
      tailRef.current.rotation.z = Math.cos(t * 2.5) * 0.15;
    }

    // Tapping paws on keyboard
    if (leftPawRef.current) {
      leftPawRef.current.position.y = 0.42 + Math.sin(t * 8) * 0.04;
    }
    if (rightPawRef.current) {
      rightPawRef.current.position.y = 0.42 + Math.cos(t * 8) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* ── 1. PROCEDURAL VOXEL ISLAND BASE ── */}
      {/* Grass top plate */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.4, 3.8]} />
        <meshStandardMaterial color="#6ebb2f" roughness={0.7} />
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

      {/* Hanging Minecraft vines */}
      <mesh position={[-1.75, -0.35, 1.2]} castShadow>
        <boxGeometry args={[0.08, 0.55, 0.28]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[1.75, -0.4, -0.8]} castShadow>
        <boxGeometry args={[0.08, 0.65, 0.32]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
      <mesh position={[0.8, -0.38, 1.75]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.08]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>

      {/* Tiny grass sprigs on top */}
      <mesh position={[-1.3, 0.28, 1.2]}>
        <boxGeometry args={[0.16, 0.2, 0.16]} />
        <meshStandardMaterial color="#4d9419" />
      </mesh>
      <mesh position={[1.4, 0.28, 1.1]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color="#4d9419" />
      </mesh>

      {/* ── 2. VOXEL CALICO CAT WITH HEADPHONES ── */}
      <group position={[-0.55, 0.2, 0.2]}>
        {/* Cat Body */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.88, 0.82, 0.78]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.65} />
        </mesh>

        {/* Orange Calico Patch on Back/Side */}
        <mesh position={[0.3, 0.52, -0.1]} castShadow>
          <boxGeometry args={[0.34, 0.48, 0.54]} />
          <meshStandardMaterial color="#f97316" roughness={0.65} />
        </mesh>

        {/* Tail */}
        <group position={[0, 0.35, -0.42]}>
          <mesh ref={tailRef} position={[0, 0.28, -0.15]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.55, 0.18]} />
            <meshStandardMaterial color="#f97316" roughness={0.65} />
          </mesh>
        </group>

        {/* Paws */}
        <mesh ref={leftPawRef} position={[-0.26, 0.42, 0.45]} castShadow>
          <boxGeometry args={[0.22, 0.18, 0.32]} />
          <meshStandardMaterial color="#FAFAFA" />
        </mesh>
        <mesh ref={rightPawRef} position={[0.26, 0.42, 0.45]} castShadow>
          <boxGeometry args={[0.22, 0.18, 0.32]} />
          <meshStandardMaterial color="#FAFAFA" />
        </mesh>

        {/* ── CAT HEAD GROUP ── */}
        <group ref={headRef} position={[0, 1.05, 0]}>
          {/* Main head cube */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.08, 0.92, 0.92]} />
            <meshStandardMaterial color="#FAFAFA" roughness={0.65} />
          </mesh>

          {/* Orange Calico Ear/Head Patch */}
          <mesh position={[0.32, 0.22, 0.1]} castShadow>
            <boxGeometry args={[0.46, 0.52, 0.75]} />
            <meshStandardMaterial color="#f97316" roughness={0.65} />
          </mesh>

          {/* Left Ear */}
          <mesh position={[-0.38, 0.58, 0]} castShadow>
            <boxGeometry args={[0.26, 0.32, 0.26]} />
            <meshStandardMaterial color="#FAFAFA" />
          </mesh>
          <mesh position={[-0.38, 0.56, 0.08]}>
            <boxGeometry args={[0.18, 0.22, 0.1]} />
            <meshStandardMaterial color="#fca5a5" />
          </mesh>

          {/* Right Ear (Orange) */}
          <mesh position={[0.38, 0.58, 0]} castShadow>
            <boxGeometry args={[0.26, 0.32, 0.26]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <mesh position={[0.38, 0.56, 0.08]}>
            <boxGeometry args={[0.18, 0.22, 0.1]} />
            <meshStandardMaterial color="#fca5a5" />
          </mesh>

          {/* Happy Closed Smiling Eyes (Mockup style) */}
          <mesh position={[-0.26, 0.04, 0.47]}>
            <boxGeometry args={[0.18, 0.05, 0.02]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0.26, 0.04, 0.47]}>
            <boxGeometry args={[0.18, 0.05, 0.02]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>

          {/* Nose */}
          <mesh position={[0, -0.06, 0.48]}>
            <boxGeometry args={[0.1, 0.08, 0.04]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>

          {/* ── HEADPHONES (BLACK HEADBAND + LIME GREEN CUPS) ── */}
          {/* Headband arch */}
          <mesh position={[0, 0.52, 0]} castShadow>
            <boxGeometry args={[1.22, 0.14, 0.28]} />
            <meshStandardMaterial color="#18181b" roughness={0.4} />
          </mesh>
          {/* Left Earcup (Lime Green) */}
          <mesh position={[-0.58, 0.08, 0]} castShadow>
            <boxGeometry args={[0.18, 0.52, 0.48]} />
            <meshStandardMaterial color="#84cc16" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Left Earcup Black Center Badge */}
          <mesh position={[-0.68, 0.08, 0]}>
            <boxGeometry args={[0.04, 0.24, 0.24]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          {/* Right Earcup (Lime Green) */}
          <mesh position={[0.58, 0.08, 0]} castShadow>
            <boxGeometry args={[0.18, 0.52, 0.48]} />
            <meshStandardMaterial color="#84cc16" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Right Earcup Black Center Badge */}
          <mesh position={[0.68, 0.08, 0]}>
            <boxGeometry args={[0.04, 0.24, 0.24]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
        </group>
      </group>

      {/* ── 3. LAPTOP IN FRONT OF THE CAT ── */}
      <group position={[-0.22, 0.28, 0.85]} rotation={[0, -0.2, 0]}>
        {/* Laptop base */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.68, 0.04, 0.52]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Laptop keyboard pad */}
        <mesh position={[0, 0.045, 0.06]}>
          <boxGeometry args={[0.56, 0.015, 0.32]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Laptop Screen Lid (Angled back) */}
        <group position={[0, 0.04, -0.24]} rotation={[-0.32, 0, 0]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[0.68, 0.5, 0.04]} />
            <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Screen Display */}
          <mesh position={[0, 0.25, 0.022]}>
            <planeGeometry args={[0.62, 0.44]} />
            {laptopTexture ? (
              <meshBasicMaterial map={laptopTexture} />
            ) : (
              <meshBasicMaterial color="#0f172a" />
            )}
          </mesh>
          {/* Cat logo on lid back */}
          <mesh position={[0, 0.25, -0.022]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.18, 0.18]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>
      </group>

      {/* ── 4. CRT/FLAT MONITOR DISPLAY ("Browsing AI trends >") ── */}
      <group position={[0.78, 0.28, 0.1]} rotation={[0, -0.42, 0]}>
        {/* Monitor Base Plate */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.5, 0.04, 0.4]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Monitor Neck */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.45, 0.12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Monitor Frame */}
        <mesh position={[0, 0.68, 0]} castShadow>
          <boxGeometry args={[1.42, 0.88, 0.14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Glowing Monitor Screen */}
        <mesh position={[0, 0.68, 0.075]}>
          <planeGeometry args={[1.34, 0.8]} />
          {monitorTexture ? (
            <meshBasicMaterial map={monitorTexture} />
          ) : (
            <meshBasicMaterial color="#0284c7" />
          )}
        </mesh>
      </group>

      {/* ── 5. BOOKS & ACCESSORIES ── */}
      {/* Stack of books on the island */}
      <group position={[-1.15, 0.24, -0.3]} rotation={[0, 0.3, 0]}>
        {/* Book 1 (Crimson) */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.62, 0.12, 0.72]} />
          <meshStandardMaterial color="#991b1b" roughness={0.8} />
        </mesh>
        {/* Book 2 (Deep Navy) */}
        <mesh position={[0.04, 0.18, 0]} rotation={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.58, 0.11, 0.68]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
        </mesh>
      </group>

      {/* Magnifying glass on island */}
      <group position={[-0.8, 0.22, 0.8]} rotation={[0, 0.6, 0]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.35]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 0.03, 0.25]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.2} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}
