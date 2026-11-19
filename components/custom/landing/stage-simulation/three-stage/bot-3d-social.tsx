"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Billboard canvas texture for app icons
function useBillboardTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Header bar (browser/app window style)
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(0, 0, 512, 54);
    // 3 window control dots
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(32, 27, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.arc(58, 27, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#10b981";
    ctx.beginPath(); ctx.arc(84, 27, 8, 0, Math.PI * 2); ctx.fill();

    // Body area
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 54, 512, 330);

    // 1. Facebook App Icon Block
    ctx.fillStyle = "#1877f2";
    ctx.fillRect(40, 80, 110, 110);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 88px sans-serif";
    ctx.fillText("f", 90, 168);

    // 2. Instagram App Icon Block
    const igGrad = ctx.createLinearGradient(190, 80, 300, 190);
    igGrad.addColorStop(0, "#833ab4");
    igGrad.addColorStop(0.5, "#fd1d1d");
    igGrad.addColorStop(1, "#fcb045");
    ctx.fillStyle = igGrad;
    ctx.fillRect(190, 80, 110, 110);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 9;
    ctx.strokeRect(215, 105, 60, 60);
    ctx.beginPath(); ctx.arc(245, 135, 16, 0, Math.PI * 2); ctx.stroke();

    // 3. TikTok App Icon Block
    ctx.fillStyle = "#010101";
    ctx.fillRect(340, 80, 110, 110);
    ctx.fillStyle = "#00f2fe";
    ctx.font = "bold 72px sans-serif";
    ctx.fillText("♪", 370, 162);

    // 4. Twitter / X App Icon Block
    ctx.fillStyle = "#000000";
    ctx.fillRect(110, 220, 110, 110);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 82px sans-serif";
    ctx.fillText("𝕏", 140, 300);

    // 5. Slack App Icon Block
    ctx.fillStyle = "#4a154b";
    ctx.fillRect(260, 220, 110, 110);
    ctx.fillStyle = "#ecb22e";
    ctx.font = "bold 80px sans-serif";
    ctx.fillText("#", 295, 302);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);
}

export function Bot3DSocial() {
  const emoji1Ref = useRef<THREE.Group>(null);
  const emoji2Ref = useRef<THREE.Group>(null);
  const emoji3Ref = useRef<THREE.Group>(null);
  const billboardRef = useRef<THREE.Group>(null);

  const billboardTexture = useBillboardTexture();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Floating emoji cubes with organic bobbing physics
    if (emoji1Ref.current) {
      emoji1Ref.current.position.y = 1.6 + Math.sin(t * 2.5) * 0.12;
      emoji1Ref.current.rotation.y = Math.sin(t * 1.5) * 0.2;
    }
    if (emoji2Ref.current) {
      emoji2Ref.current.position.y = 1.3 + Math.sin(t * 2.8 + 1) * 0.1;
      emoji2Ref.current.rotation.y = -Math.sin(t * 1.8) * 0.2;
    }
    if (emoji3Ref.current) {
      emoji3Ref.current.position.y = 1.45 + Math.cos(t * 2.2 + 2) * 0.14;
      emoji3Ref.current.rotation.z = Math.sin(t * 1.6) * 0.15;
    }

    // Subtle billboard sway
    if (billboardRef.current) {
      billboardRef.current.rotation.y = -0.3 + Math.sin(t * 1.2) * 0.02;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* ── 1. VOXEL ISLAND BASE ── */}
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

      {/* Hanging vines */}
      <mesh position={[1.75, -0.35, 1.0]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.3]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      <mesh position={[-1.75, -0.4, -0.6]} castShadow>
        <boxGeometry args={[0.08, 0.55, 0.28]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>

      {/* ── 2. 3D SOCIAL MEDIA BILLBOARD ── */}
      <group ref={billboardRef} position={[-0.2, 0.2, 0]} rotation={[0, -0.3, 0]}>
        {/* Left Post */}
        <mesh position={[-1.1, 0.7, 0]} castShadow>
          <boxGeometry args={[0.16, 1.4, 0.16]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Right Post */}
        <mesh position={[1.1, 0.7, 0]} castShadow>
          <boxGeometry args={[0.16, 1.4, 0.16]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>

        {/* Billboard Main Board */}
        <mesh position={[0, 1.05, 0.05]} castShadow>
          <boxGeometry args={[2.45, 1.75, 0.12]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.5} />
        </mesh>

        {/* Textured App Screen on Front */}
        <mesh position={[0, 1.05, 0.12]}>
          <planeGeometry args={[2.35, 1.65]} />
          {billboardTexture ? (
            <meshBasicMaterial map={billboardTexture} />
          ) : (
            <meshBasicMaterial color="#ffffff" />
          )}
        </mesh>
      </group>

      {/* ── 3. FLOATING 3D EMOJI BLOCKS ── */}
      {/* 1. Yellow Smiling Voxel Cube */}
      <group ref={emoji1Ref} position={[-1.25, 1.6, 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.34, 0.34]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} />
        </mesh>
        {/* Smile features */}
        <mesh position={[0, 0.04, 0.175]}>
          <boxGeometry args={[0.22, 0.05, 0.02]} />
          <meshStandardMaterial color="#713f12" />
        </mesh>
      </group>

      {/* 2. White Speech Bubble Voxel Cube */}
      <group ref={emoji2Ref} position={[1.25, 1.4, 0.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.28, 0.32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Tail */}
        <mesh position={[-0.1, -0.18, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.1, 0.14, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Dots */}
        <mesh position={[0, 0, 0.165]}>
          <boxGeometry args={[0.16, 0.04, 0.02]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* 3. Red Like/Heart Cube */}
      <group ref={emoji3Ref} position={[1.35, 0.85, 1.0]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.26, 0.26]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.135]}>
          <boxGeometry args={[0.14, 0.14, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
