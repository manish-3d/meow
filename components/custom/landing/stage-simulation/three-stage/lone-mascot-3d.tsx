"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function LoneMascot3D({ isHovered = false }: { isHovered?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Idle floating sway [-0.15 to 0.15]
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2.0) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.08;
    }

    if (headRef.current) {
      headRef.current.position.y = 1.05 + Math.sin(t * 2.2) * 0.03;
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.08;
      headRef.current.rotation.x = Math.sin(t * 1.8) * 0.04;
    }

    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 3.5) * 0.4;
      tailRef.current.rotation.z = Math.cos(t * 2.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── 1. VOXEL ISLAND BASE ── */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.4, 3.2]} />
        <meshStandardMaterial color="#84cc16" roughness={0.7} />
      </mesh>

      {/* Stepped dirt layer 1 */}
      <mesh position={[0, -0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.35, 2.9]} />
        <meshStandardMaterial color="#87532a" roughness={0.9} />
      </mesh>

      {/* Stepped dirt layer 2 */}
      <mesh position={[0, -0.62, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.32, 2.4]} />
        <meshStandardMaterial color="#754522" roughness={0.9} />
      </mesh>

      {/* Hanging vines */}
      <mesh position={[-1.4, -0.3, 0.9]} castShadow>
        <boxGeometry args={[0.08, 0.55, 0.28]} />
        <meshStandardMaterial color="#84cc16" />
      </mesh>
      <mesh position={[1.4, -0.35, -0.7]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.3]} />
        <meshStandardMaterial color="#a3e635" />
      </mesh>

      {/* ── 2. 3D CALICO CAT MASCOT WITH HEADPHONES ── */}
      <group position={[0, 0.2, 0]}>
        {/* Cat Body */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.92, 0.85, 0.82]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.65} />
        </mesh>

        {/* Orange Patch on Back */}
        <mesh position={[0.3, 0.52, -0.1]} castShadow>
          <boxGeometry args={[0.36, 0.5, 0.56]} />
          <meshStandardMaterial color="#f97316" roughness={0.65} />
        </mesh>

        {/* Tail */}
        <group position={[0, 0.35, -0.44]}>
          <mesh ref={tailRef} position={[0, 0.28, -0.15]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.55, 0.18]} />
            <meshStandardMaterial color="#f97316" roughness={0.65} />
          </mesh>
        </group>

        {/* Paws Resting Forward */}
        <mesh position={[-0.26, 0.15, 0.42]} castShadow>
          <boxGeometry args={[0.22, 0.25, 0.3]} />
          <meshStandardMaterial color="#FAFAFA" />
        </mesh>
        <mesh position={[0.26, 0.15, 0.42]} castShadow>
          <boxGeometry args={[0.22, 0.25, 0.3]} />
          <meshStandardMaterial color="#FAFAFA" />
        </mesh>

        {/* ── HEAD GROUP ── */}
        <group ref={headRef} position={[0, 1.05, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.1, 0.94, 0.94]} />
            <meshStandardMaterial color="#FAFAFA" roughness={0.65} />
          </mesh>

          {/* Calico Patch on Head */}
          <mesh position={[0.34, 0.22, 0.1]} castShadow>
            <boxGeometry args={[0.46, 0.54, 0.78]} />
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

          {/* Right Ear */}
          <mesh position={[0.38, 0.58, 0]} castShadow>
            <boxGeometry args={[0.26, 0.32, 0.26]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <mesh position={[0.38, 0.56, 0.08]}>
            <boxGeometry args={[0.18, 0.22, 0.1]} />
            <meshStandardMaterial color="#fca5a5" />
          </mesh>

          {/* Happy Eyes */}
          <mesh position={[-0.26, 0.04, 0.48]}>
            <boxGeometry args={[0.18, 0.05, 0.02]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0.26, 0.04, 0.48]}>
            <boxGeometry args={[0.18, 0.05, 0.02]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>

          {/* Nose */}
          <mesh position={[0, -0.06, 0.49]}>
            <boxGeometry args={[0.1, 0.08, 0.04]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>

          {/* Headphones */}
          <mesh position={[0, 0.54, 0]} castShadow>
            <boxGeometry args={[1.24, 0.14, 0.28]} />
            <meshStandardMaterial color="#18181b" roughness={0.4} />
          </mesh>
          {/* Lime Green Cups */}
          <mesh position={[-0.6, 0.08, 0]} castShadow>
            <boxGeometry args={[0.18, 0.52, 0.48]} />
            <meshStandardMaterial color="#84cc16" roughness={0.3} />
          </mesh>
          <mesh position={[0.6, 0.08, 0]} castShadow>
            <boxGeometry args={[0.18, 0.52, 0.48]} />
            <meshStandardMaterial color="#84cc16" roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
