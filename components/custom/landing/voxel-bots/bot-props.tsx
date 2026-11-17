"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// ==========================================
// 1. RESEARCHER PROPS
// ==========================================
export function ResearcherProps({ isHovered = false }: { isHovered?: boolean }) {
  const magnifierRef = useRef<THREE.Group>(null);
  const floatingDoc1 = useRef<THREE.Group>(null);
  const floatingDoc2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (magnifierRef.current) {
      magnifierRef.current.position.y = 1.6 + Math.sin(t * 2.2) * 0.15;
      magnifierRef.current.position.x = 0.8 + Math.cos(t * 1.8) * 0.2;
      magnifierRef.current.rotation.z = Math.sin(t * 1.5) * 0.25;
      magnifierRef.current.rotation.y = t * 0.6;
    }
    if (floatingDoc1.current) {
      floatingDoc1.current.position.y = 1.3 + Math.sin(t * 2 + 1) * 0.12;
      floatingDoc1.current.rotation.y = t * 0.4;
      floatingDoc1.current.rotation.z = Math.sin(t * 1.2) * 0.15;
    }
    if (floatingDoc2.current) {
      floatingDoc2.current.position.y = 1.1 + Math.cos(t * 1.8 + 2) * 0.1;
      floatingDoc2.current.rotation.y = -t * 0.5;
    }
  });

  return (
    <>
      {/* --- Open Green Book in front of paws --- */}
      <group position={[0, 0.16, 0.52]} rotation={[0.2, 0, 0]}>
        {/* Spine */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.52]} />
          <meshStandardMaterial color="#1b4332" roughness={0.8} />
        </mesh>
        {/* Left Book Page Slab */}
        <mesh position={[-0.22, 0.02, 0]} rotation={[0, 0, 0.12]} castShadow>
          <boxGeometry args={[0.38, 0.06, 0.48]} />
          <meshStandardMaterial color="#fefae0" roughness={0.9} />
        </mesh>
        {/* Left Cover Trim */}
        <mesh position={[-0.23, -0.02, 0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.4, 0.02, 0.5]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
        </mesh>
        {/* Right Book Page Slab */}
        <mesh position={[0.22, 0.02, 0]} rotation={[0, 0, -0.12]} castShadow>
          <boxGeometry args={[0.38, 0.06, 0.48]} />
          <meshStandardMaterial color="#fefae0" roughness={0.9} />
        </mesh>
        {/* Right Cover Trim */}
        <mesh position={[0.23, -0.02, 0]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.4, 0.02, 0.5]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
        </mesh>
        {/* Page text lines voxels */}
        <mesh position={[-0.22, 0.055, -0.08]}>
          <boxGeometry args={[0.26, 0.01, 0.03]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        <mesh position={[-0.22, 0.055, 0.04]}>
          <boxGeometry args={[0.24, 0.01, 0.03]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        <mesh position={[0.22, 0.055, -0.08]}>
          <boxGeometry args={[0.26, 0.01, 0.03]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        <mesh position={[0.22, 0.055, 0.04]}>
          <boxGeometry args={[0.24, 0.01, 0.03]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
      </group>

      {/* --- Stack of Books next to the Cat --- */}
      <group position={[-0.92, 0.12, 0.28]} rotation={[0, 0.35, 0]}>
        {/* Bottom Book: Crimson */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[0.55, 0.1, 0.62]} />
          <meshStandardMaterial color="#991b1b" roughness={0.8} />
        </mesh>
        <mesh position={[0.02, 0.05, 0]}>
          <boxGeometry args={[0.52, 0.08, 0.58]} />
          <meshStandardMaterial color="#fefae0" roughness={0.9} />
        </mesh>

        {/* Middle Book: Deep Navy */}
        <mesh position={[-0.02, 0.15, 0.02]} rotation={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.52, 0.09, 0.58]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0.02]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[0.48, 0.07, 0.54]} />
          <meshStandardMaterial color="#fefae0" roughness={0.9} />
        </mesh>

        {/* Top Book: Forest Gold */}
        <mesh position={[0.01, 0.24, -0.01]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.48, 0.08, 0.54]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
        <mesh position={[0.02, 0.24, -0.01]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.44, 0.06, 0.5]} />
          <meshStandardMaterial color="#fefae0" roughness={0.9} />
        </mesh>
      </group>

      {/* --- Floating Magnifying Glass --- */}
      <group ref={magnifierRef} position={[0.85, 1.6, 0.6]}>
        {/* Rim ring (lime tinted) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.3, 0.055, 8, 20]} />
          <meshStandardMaterial
            color="#a3e635"
            emissive="#a3e635"
            emissiveIntensity={isHovered ? 0.7 : 0.3}
            roughness={0.4}
          />
        </mesh>
        {/* Glass Lens */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
          <meshStandardMaterial
            color="#dcfce7"
            transparent
            opacity={0.65}
            roughness={0.1}
          />
        </mesh>
        {/* Handle */}
        <mesh position={[0.26, -0.26, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.38, 8]} />
          <meshStandardMaterial color="#18181b" roughness={0.6} />
        </mesh>
      </group>

      {/* --- Floating Documents --- */}
      <group ref={floatingDoc1} position={[-1.1, 1.4, 0.7]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.44, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        {/* Document lines */}
        <mesh position={[0, 0.08, 0.015]}>
          <boxGeometry args={[0.25, 0.02, 0.005]} />
          <meshStandardMaterial color="#a1a1aa" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.22, 0.02, 0.005]} />
          <meshStandardMaterial color="#a1a1aa" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.08, 0.015]}>
          <boxGeometry args={[0.18, 0.02, 0.005]} />
          <meshStandardMaterial color="#a1a1aa" roughness={0.9} />
        </mesh>
      </group>

      <group ref={floatingDoc2} position={[1.2, 1.1, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.4, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.06, 0.015]}>
          <boxGeometry args={[0.22, 0.02, 0.005]} />
          <meshStandardMaterial color="#a1a1aa" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.04, 0.015]}>
          <boxGeometry args={[0.2, 0.02, 0.005]} />
          <meshStandardMaterial color="#a1a1aa" roughness={0.9} />
        </mesh>
      </group>
    </>
  );
}

// Researcher Round Glasses Headgear
export function ResearcherGlasses() {
  return (
    <group position={[0, 0.04, 0.57]}>
      {/* Left Eyeglass Ring */}
      <mesh position={[-0.32, 0, 0]} castShadow>
        <torusGeometry args={[0.16, 0.03, 8, 20]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} />
      </mesh>
      {/* Right Eyeglass Ring */}
      <mesh position={[0.32, 0, 0]} castShadow>
        <torusGeometry args={[0.16, 0.03, 8, 20]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} />
      </mesh>
      {/* Center Bridge */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.24, 0.03, 0.02]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} />
      </mesh>
      {/* Side Arms */}
      <mesh position={[-0.52, 0, -0.22]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.45]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} />
      </mesh>
      <mesh position={[0.52, 0, -0.22]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.45]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ==========================================
// 2. BROWSER PROPS
// ==========================================
export function BrowserProps({ isHovered = false }: { isHovered?: boolean }) {
  const browserWindowRef = useRef<THREE.Group>(null);
  const cursorArrowRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (browserWindowRef.current) {
      browserWindowRef.current.position.y = 1.65 + Math.sin(t * 1.8) * 0.12;
      browserWindowRef.current.rotation.y = Math.sin(t * 1.2) * 0.08;
    }
    if (cursorArrowRef.current) {
      cursorArrowRef.current.position.x = 0.2 + Math.sin(t * 2.5) * 0.15;
      cursorArrowRef.current.position.y = 0.05 + Math.cos(t * 2.5) * 0.08;
    }
  });

  return (
    <>
      {/* Mini Laptop on Grass */}
      <group position={[0, 0.08, 0.58]} rotation={[0, 0, 0]}>
        {/* Laptop Base */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.62, 0.04, 0.42]} />
          <meshStandardMaterial color="#27272a" roughness={0.6} />
        </mesh>
        {/* Keyboard detail */}
        <mesh position={[0, 0.055, 0.02]}>
          <boxGeometry args={[0.52, 0.01, 0.26]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.8} />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.055, 0.16]}>
          <boxGeometry args={[0.2, 0.01, 0.08]} />
          <meshStandardMaterial color="#52525b" roughness={0.8} />
        </mesh>
        {/* Laptop Lid Screen (Open at 70 deg) */}
        <group position={[0, 0.04, -0.19]} rotation={[-0.4, 0, 0]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.62, 0.44, 0.03]} />
            <meshStandardMaterial color="#27272a" roughness={0.6} />
          </mesh>
          {/* Glowing Display Screen */}
          <mesh position={[0, 0.22, 0.02]}>
            <boxGeometry args={[0.56, 0.38, 0.01]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={isHovered ? 0.9 : 0.5}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* --- Floating Miniature Browser Window --- */}
      <group ref={browserWindowRef} position={[0.2, 1.65, 0.6]}>
        {/* Main Window Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.88, 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>

        {/* Top Header Bar */}
        <mesh position={[0, 0.35, 0.032]}>
          <boxGeometry args={[1.33, 0.14, 0.01]} />
          <meshStandardMaterial color="#f4f4f5" roughness={0.8} />
        </mesh>

        {/* Traffic Light Window Dots */}
        <mesh position={[-0.56, 0.35, 0.04]}>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-0.48, 0.35, 0.04]}>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
        <mesh position={[-0.40, 0.35, 0.04]}>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>

        {/* Search Bar Input Pill */}
        <mesh position={[0.08, 0.35, 0.04]}>
          <boxGeometry args={[0.62, 0.08, 0.01]} />
          <meshStandardMaterial color="#e4e4e7" roughness={0.9} />
        </mesh>

        {/* Browser Content Area (Mock Web Layout) */}
        <mesh position={[-0.25, 0.08, 0.032]}>
          <boxGeometry args={[0.65, 0.1, 0.005]} />
          <meshStandardMaterial color="#0284c7" roughness={0.7} />
        </mesh>
        <mesh position={[-0.15, -0.08, 0.032]}>
          <boxGeometry args={[0.85, 0.05, 0.005]} />
          <meshStandardMaterial color="#d4d4d8" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, -0.18, 0.032]}>
          <boxGeometry args={[0.75, 0.05, 0.005]} />
          <meshStandardMaterial color="#e4e4e7" roughness={0.9} />
        </mesh>

        {/* Floating 3D Mouse Cursor Pointer Arrow */}
        <group ref={cursorArrowRef} position={[0.25, 0.1, 0.1]} rotation={[0, 0, -0.3]}>
          {/* Arrow Pointer Voxel */}
          <mesh castShadow>
            <coneGeometry args={[0.09, 0.22, 3]} />
            <meshStandardMaterial color="#18181b" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[0.05, 0.12, 0.02]} />
            <meshStandardMaterial color="#18181b" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </>
  );
}

// ==========================================
// 3. BUILDER PROPS (CENTERPIECE)
// ==========================================
export function BuilderProps({ isHovered = false }: { isHovered?: boolean }) {
  const codeCubeRef = useRef<THREE.Group>(null);
  const orbitCubesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (codeCubeRef.current) {
      codeCubeRef.current.position.y = 1.95 + Math.sin(t * 2.5) * 0.14;
      codeCubeRef.current.rotation.y = t * 1.4;
      codeCubeRef.current.rotation.x = Math.sin(t * 1.2) * 0.2;
    }
    if (orbitCubesRef.current) {
      orbitCubesRef.current.rotation.y = t * 0.9;
    }
  });

  return (
    <>
      {/* Coding Laptop on Grass */}
      <group position={[0, 0.1, 0.62]}>
        {/* Laptop Base */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.68, 0.045, 0.46]} />
          <meshStandardMaterial color="#18181b" roughness={0.6} />
        </mesh>
        {/* Keyboard */}
        <mesh position={[0, 0.055, 0.02]}>
          <boxGeometry args={[0.56, 0.01, 0.28]} />
          <meshStandardMaterial color="#27272a" roughness={0.8} />
        </mesh>
        {/* Screen Lid (Open at 65 deg) */}
        <group position={[0, 0.045, -0.21]} rotation={[-0.45, 0, 0]}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[0.68, 0.48, 0.035]} />
            <meshStandardMaterial color="#18181b" roughness={0.6} />
          </mesh>
          {/* Glowing Code Screen displaying lime </> */}
          <mesh position={[0, 0.24, 0.02]}>
            <boxGeometry args={[0.62, 0.42, 0.01]} />
            <meshStandardMaterial
              color="#a3e635"
              emissive="#84cc16"
              emissiveIntensity={isHovered ? 1.6 : 1.1}
              roughness={0.2}
            />
          </mesh>
          {/* Screen Light */}
          <pointLight
            position={[0, 0.24, 0.2]}
            color="#a3e635"
            intensity={isHovered ? 1.8 : 1.1}
            distance={2}
          />
        </group>
      </group>

      {/* --- Floating Glowing Code Cube (Centerpiece above Builder) --- */}
      <group ref={codeCubeRef} position={[0, 1.95, 0.1]}>
        {/* Center Lime Cube */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial
            color="#bef264"
            emissive="#a3e635"
            emissiveIntensity={isHovered ? 2.0 : 1.4}
            roughness={0.2}
          />
        </mesh>
        {/* Wireframe Outline / Edge bevel */}
        <mesh>
          <boxGeometry args={[0.57, 0.57, 0.57]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
        {/* Cube Glow Light */}
        <pointLight
          color="#a3e635"
          intensity={isHovered ? 3.8 : 2.4}
          distance={4}
          decay={2}
        />
      </group>

      {/* Orbiting Mini Lime Voxel Cubes */}
      <group ref={orbitCubesRef} position={[0, 1.8, 0]}>
        <mesh position={[1.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color="#bef264"
            emissive="#a3e635"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[-1.0, -0.3, 0.4]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial
            color="#bef264"
            emissive="#a3e635"
            emissiveIntensity={0.7}
          />
        </mesh>
        <mesh position={[0.2, 0.4, -1.0]} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshStandardMaterial
            color="#bef264"
            emissive="#a3e635"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </>
  );
}

// Builder Headphones Headgear
export function BuilderHeadphones() {
  return (
    <group position={[0, 0.22, 0]}>
      {/* Headband arch */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[1.42, 0.1, 0.2]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>
      {/* Left Ear Cushion (Lime Green) */}
      <mesh position={[-0.72, 0.05, 0]} castShadow>
        <boxGeometry args={[0.18, 0.42, 0.38]} />
        <meshStandardMaterial
          color="#a3e635"
          emissive="#84cc16"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Right Ear Cushion (Lime Green) */}
      <mesh position={[0.72, 0.05, 0]} castShadow>
        <boxGeometry args={[0.18, 0.42, 0.38]} />
        <meshStandardMaterial
          color="#a3e635"
          emissive="#84cc16"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

// ==========================================
// 4. OPERATOR PROPS
// ==========================================
export function OperatorProps({ isHovered = false }: { isHovered?: boolean }) {
  const calendarRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (calendarRef.current) {
      calendarRef.current.position.y = 1.6 + Math.sin(t * 2) * 0.12;
      calendarRef.current.rotation.y = Math.sin(t * 1.4) * 0.15;
    }
  });

  return (
    <>
      {/* Task Checklist Clipboard in Paws */}
      <group position={[0, 0.32, 0.48]} rotation={[0.45, 0, 0]}>
        {/* Wooden Board */}
        <mesh castShadow>
          <boxGeometry args={[0.54, 0.72, 0.04]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        {/* Silver Top Clip */}
        <mesh position={[0, 0.35, 0.03]} castShadow>
          <boxGeometry args={[0.24, 0.08, 0.04]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* White Paper Sheet */}
        <mesh position={[0, -0.02, 0.025]}>
          <boxGeometry args={[0.48, 0.62, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        {/* Checklist Rows with Green Checkmarks */}
        <mesh position={[-0.14, 0.16, 0.035]}>
          <boxGeometry args={[0.06, 0.06, 0.01]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
        <mesh position={[0.05, 0.16, 0.035]}>
          <boxGeometry args={[0.26, 0.02, 0.01]} />
          <meshStandardMaterial color="#71717a" roughness={0.9} />
        </mesh>

        <mesh position={[-0.14, 0.02, 0.035]}>
          <boxGeometry args={[0.06, 0.06, 0.01]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
        <mesh position={[0.05, 0.02, 0.035]}>
          <boxGeometry args={[0.26, 0.02, 0.01]} />
          <meshStandardMaterial color="#71717a" roughness={0.9} />
        </mesh>

        <mesh position={[-0.14, -0.12, 0.035]}>
          <boxGeometry args={[0.06, 0.06, 0.01]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
        <mesh position={[0.05, -0.12, 0.035]}>
          <boxGeometry args={[0.26, 0.02, 0.01]} />
          <meshStandardMaterial color="#71717a" roughness={0.9} />
        </mesh>
      </group>

      {/* Floating 3D Calendar */}
      <group ref={calendarRef} position={[0.85, 1.6, 0.4]}>
        {/* Calendar Body */}
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.68, 0.1]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Green Top Header */}
        <mesh position={[0, 0.26, 0.055]}>
          <boxGeometry args={[0.62, 0.16, 0.01]} />
          <meshStandardMaterial color="#16a34a" roughness={0.6} />
        </mesh>
        {/* Metal Binder Rings */}
        <mesh position={[-0.18, 0.35, 0]}>
          <torusGeometry args={[0.04, 0.015, 6, 12]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.18, 0.35, 0]}>
          <torusGeometry args={[0.04, 0.015, 6, 12]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Date Number Grid voxels */}
        <mesh position={[0, -0.06, 0.055]}>
          <boxGeometry args={[0.42, 0.32, 0.01]} />
          <meshStandardMaterial color="#f4f4f5" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.05, 0.065]}>
          <boxGeometry args={[0.16, 0.18, 0.01]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
      </group>
    </>
  );
}

// ==========================================
// 5. CREATOR PROPS
// ==========================================
export function CreatorProps({ isHovered = false }: { isHovered?: boolean }) {
  const speechBubbleRef = useRef<THREE.Group>(null);
  const photoCardRef = useRef<THREE.Group>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);

  const [flashing, setFlashing] = useState(false);

  // Periodic camera flash
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const triggerFlash = () => {
      const delay = 4000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setFlashing(true);
        setTimeout(() => {
          setFlashing(false);
          triggerFlash();
        }, 120);
      }, delay);
    };
    triggerFlash();
    return () => clearTimeout(timeout);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (speechBubbleRef.current) {
      speechBubbleRef.current.position.y = 1.75 + Math.sin(t * 2.2) * 0.12;
      speechBubbleRef.current.rotation.z = Math.sin(t * 1.5) * 0.08;
    }
    if (photoCardRef.current) {
      photoCardRef.current.position.y = 1.35 + Math.cos(t * 1.9) * 0.14;
      photoCardRef.current.rotation.y = t * 0.6;
    }
  });

  return (
    <>
      {/* Camera held by Paws */}
      <group position={[0, 0.3, 0.48]} rotation={[0, 0, 0]}>
        {/* Main Camera Box */}
        <mesh castShadow>
          <boxGeometry args={[0.52, 0.36, 0.28]} />
          <meshStandardMaterial color="#18181b" roughness={0.5} />
        </mesh>
        {/* Lens Barrel */}
        <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
          <meshStandardMaterial color="#27272a" roughness={0.4} />
        </mesh>
        {/* Front Lens Glass */}
        <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} />
        </mesh>
        {/* Shutter Button */}
        <mesh position={[0.16, 0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 8]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Flash bulb / point light */}
        <mesh position={[-0.16, 0.18, 0.14]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={flashing || isHovered ? 2.5 : 0.2}
          />
        </mesh>
        {(flashing || isHovered) && (
          <pointLight
            ref={flashLightRef}
            position={[0, 0.3, 0.6]}
            color="#ffffff"
            intensity={flashing ? 5.0 : 1.8}
            distance={4}
          />
        )}
      </group>

      {/* Floating Lime Speech / Media Play Bubble */}
      <group ref={speechBubbleRef} position={[0.75, 1.75, 0.4]}>
        {/* Bubble Box */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.42, 0.08]} />
          <meshStandardMaterial
            color="#a3e635"
            emissive="#84cc16"
            emissiveIntensity={isHovered ? 0.8 : 0.4}
            roughness={0.4}
          />
        </mesh>
        {/* Tail point */}
        <mesh position={[-0.14, -0.24, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.12, 0.12, 0.08]} />
          <meshStandardMaterial color="#a3e635" roughness={0.4} />
        </mesh>
        {/* Play Icon '▶' */}
        <mesh position={[0.02, 0, 0.045]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.18, 3]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>
      </group>

      {/* Floating Framed Landscape / Photo Card */}
      <group ref={photoCardRef} position={[1.1, 1.35, -0.2]}>
        {/* White Photo Card */}
        <mesh castShadow>
          <boxGeometry args={[0.48, 0.38, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Blue Sky */}
        <mesh position={[0, 0.04, 0.015]}>
          <boxGeometry args={[0.42, 0.16, 0.005]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Green Mountain / Hill */}
        <mesh position={[-0.08, -0.05, 0.016]}>
          <boxGeometry args={[0.22, 0.1, 0.005]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0.1, -0.06, 0.016]}>
          <boxGeometry args={[0.24, 0.08, 0.005]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
      </group>
    </>
  );
}
