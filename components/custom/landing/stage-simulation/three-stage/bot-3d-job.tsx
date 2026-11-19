"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Sign text texture helper
function useSignText(text: string, bgColor: string) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 256, 128);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 52px monospace, sans-serif";
    ctx.fillText(text, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [text, bgColor]);
}

export function Bot3DJob() {
  const searchSignRef = useRef<THREE.Group>(null);
  const applySignRef = useRef<THREE.Group>(null);
  const pulsePointRef = useRef<THREE.Mesh>(null);

  const searchText = useSignText("Search", "#dc2626");
  const applyText = useSignText("Apply", "#84cc16");

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Floating Search sign bobbing
    if (searchSignRef.current) {
      searchSignRef.current.position.y = 1.05 + Math.sin(t * 2.2) * 0.08;
      searchSignRef.current.rotation.y = -0.25 + Math.sin(t * 1.5) * 0.06;
    }

    // Floating Apply sign bobbing
    if (applySignRef.current) {
      applySignRef.current.position.y = 1.15 + Math.cos(t * 2.4 + 1) * 0.08;
      applySignRef.current.rotation.y = 0.35 + Math.cos(t * 1.6) * 0.06;
    }

    // Glowing data packet moving down the dirt path
    if (pulsePointRef.current) {
      const progress = (t * 0.8) % 1;
      pulsePointRef.current.position.x = -0.8 + progress * 1.8;
      pulsePointRef.current.position.z = -0.8 + progress * 1.8;
      pulsePointRef.current.position.y = 0.26 + Math.sin(progress * Math.PI) * 0.08;
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
      <mesh position={[1.75, -0.35, -0.8]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.28]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      {/* ── 2. WINDING DIRT PATHWAY (MINECRAFT STYLE) ── */}
      {/* Curved pathway segments across the grass */}
      <mesh position={[-0.8, 0.205, -0.8]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.7]} />
        <meshStandardMaterial color="#a16207" roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, 0.205, -0.1]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[1.2, 0.02, 0.8]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>
      <mesh position={[0.7, 0.205, 0.7]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[1.3, 0.02, 0.85]} />
        <meshStandardMaterial color="#a16207" roughness={0.9} />
      </mesh>

      {/* Glowing animated path packet */}
      <mesh ref={pulsePointRef} position={[-0.8, 0.26, -0.8]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* ── 3. 3D "SEARCH" MARKER SIGN (RED/CORAL HEART) ── */}
      <group ref={searchSignRef} position={[-0.85, 1.05, 0.3]} rotation={[0, -0.25, 0]}>
        {/* Wooden Post */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.12, 0.9, 0.12]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Sign Block */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.1, 0.55, 0.22]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Textured Sign Face */}
        <mesh position={[0, 0.15, 0.115]}>
          <planeGeometry args={[1.04, 0.5]} />
          {searchText ? (
            <meshBasicMaterial map={searchText} />
          ) : (
            <meshBasicMaterial color="#dc2626" />
          )}
        </mesh>
      </group>

      {/* ── 4. 3D "APPLY" MARKER SIGN (GREEN) ── */}
      <group ref={applySignRef} position={[0.85, 1.15, -0.4]} rotation={[0, 0.35, 0]}>
        {/* Wooden Post */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <boxGeometry args={[0.12, 0.9, 0.12]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Sign Block */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.05, 0.55, 0.22]} />
          <meshStandardMaterial color="#84cc16" roughness={0.4} />
        </mesh>
        {/* Textured Sign Face */}
        <mesh position={[0, 0.15, 0.115]}>
          <planeGeometry args={[0.99, 0.5]} />
          {applyText ? (
            <meshBasicMaterial map={applyText} />
          ) : (
            <meshBasicMaterial color="#84cc16" />
          )}
        </mesh>
      </group>

      {/* ── 5. MINI VOXEL TREES ON EDGES ── */}
      {/* Tree 1 (Top-Left corner) */}
      <group position={[-1.3, 0.2, -1.2]}>
        {/* Trunk */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.18]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        {/* Foliage lower cube */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.65, 0.45, 0.65]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
        {/* Foliage upper crown */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.35, 0.42]} />
          <meshStandardMaterial color="#16a34a" roughness={0.8} />
        </mesh>
      </group>

      {/* Tree 2 (Bottom-Right corner) */}
      <group position={[1.3, 0.2, 1.2]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.16, 0.45, 0.16]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.55, 0.4, 0.55]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
