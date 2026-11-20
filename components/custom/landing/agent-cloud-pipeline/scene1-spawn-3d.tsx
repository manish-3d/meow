"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

function RocketAndSmoke() {
  const smokeRef = useRef<THREE.Group>(null);
  const rocketRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rocketRef.current) {
      rocketRef.current.position.y = 1.35 + Math.sin(t * 3) * 0.08;
      rocketRef.current.rotation.z = Math.sin(t * 2) * 0.04;
    }
    if (smokeRef.current) {
      smokeRef.current.children.forEach((child, idx) => {
        child.position.y += Math.sin(t * 2 + idx) * 0.002;
      });
    }
  });

  return (
    <group position={[-0.1, 0, 0]}>
      {/* ── Billowing Voxel Smoke Plume Behind Monitor ── */}
      <group ref={smokeRef} position={[-0.4, 0.6, -0.6]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0.4, 0.8, -0.1]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
        </mesh>
        <mesh position={[-0.3, 0.9, 0.1]} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 1.3, -0.2]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, 1.4, 0.1]} castShadow>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
      </group>

      {/* ── 3D Rocket Launching ── */}
      <group ref={rocketRef} position={[0.2, 1.35, -0.2]} rotation={[0.1, 0.2, -0.15]}>
        {/* Rocket Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.8, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* Red / Orange Nosecone */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <coneGeometry args={[0.25, 0.45, 12]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
        {/* Lower Ring */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 12]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Fins */}
        <mesh position={[0.26, -0.25, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.16, 0.35, 0.04]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-0.26, -0.25, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.16, 0.35, 0.04]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Glowing Engine Exhaust Flame */}
        <mesh position={[0, -0.62, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.22, 0.5, 10]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f97316"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.12, 0.3, 10]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#fbbf24"
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>

        {/* ── Cute Voxel Cat Pilot Riding Rocket ── */}
        <group position={[0, 0.12, 0.22]} scale={[0.55, 0.55, 0.55]}>
          {/* Head */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.7, 0.7]} />
            <meshStandardMaterial color="#ffffff" roughness={0.65} />
          </mesh>
          {/* Calico Patch */}
          <mesh position={[0.24, 0.16, 0.08]}>
            <boxGeometry args={[0.34, 0.4, 0.58]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          {/* Ears */}
          <mesh position={[-0.28, 0.44, 0]}>
            <boxGeometry args={[0.2, 0.24, 0.2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.28, 0.42, 0.06]}>
            <boxGeometry args={[0.14, 0.16, 0.06]} />
            <meshStandardMaterial color="#fca5a5" />
          </mesh>
          <mesh position={[0.28, 0.44, 0]}>
            <boxGeometry args={[0.2, 0.24, 0.2]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <mesh position={[0.28, 0.42, 0.06]}>
            <boxGeometry args={[0.14, 0.16, 0.06]} />
            <meshStandardMaterial color="#fca5a5" />
          </mesh>
          {/* Happy Eyes */}
          <mesh position={[-0.18, 0.02, 0.36]}>
            <boxGeometry args={[0.14, 0.04, 0.02]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0.18, 0.02, 0.36]}>
            <boxGeometry args={[0.14, 0.04, 0.02]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          {/* Pink Nose */}
          <mesh position={[0, -0.06, 0.37]}>
            <boxGeometry args={[0.08, 0.06, 0.03]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>
          {/* Lime Green Headphones */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.92, 0.1, 0.22]} />
            <meshStandardMaterial color="#18181b" roughness={0.4} />
          </mesh>
          <mesh position={[-0.44, 0.04, 0]}>
            <boxGeometry args={[0.14, 0.38, 0.34]} />
            <meshStandardMaterial color="#84cc16" roughness={0.3} />
          </mesh>
          <mesh position={[0.44, 0.04, 0]}>
            <boxGeometry args={[0.14, 0.38, 0.34]} />
            <meshStandardMaterial color="#84cc16" roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Scene1Mesh() {
  const routerLedRef = useRef<THREE.PointLight>(null);
  const monitorTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Sky gradient background inside monitor
    const grad = ctx.createLinearGradient(0, 0, 0, 320);
    grad.addColorStop(0, "#bae6fd");
    grad.addColorStop(1, "#f0f9ff");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 320);

    // Billowing pixel smoke art
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(180, 140, 150, 160);
    ctx.fillRect(150, 170, 210, 130);
    ctx.fillRect(120, 200, 270, 100);

    // Rocket outline on screen
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(256, 40);
    ctx.lineTo(290, 140);
    ctx.lineTo(222, 140);
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (routerLedRef.current) {
      routerLedRef.current.intensity = 1.2 + Math.sin(t * 8) * 0.8;
    }
  });

  return (
    <group position={[0, -0.4, 0]} rotation={[0.22, 0.45, 0]}>
      {/* ── 1. ISOMETRIC DESK / WORKBENCH BASE ── */}
      {/* Top light gray surface */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.28, 3.8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>
      {/* Warm wood edge trim / bevel */}
      <mesh position={[0, -0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.92, 0.16, 3.92]} />
        <meshStandardMaterial color="#87532a" roughness={0.8} />
      </mesh>
      {/* Dark desk foundation base */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.2, 3.6]} />
        <meshStandardMaterial color="#754522" roughness={0.9} />
      </mesh>

      {/* ── 2. COMPUTER MONITOR ON STAND ── */}
      <group position={[-0.4, 0.1, -0.4]}>
        {/* Base Stand */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[1.0, 0.06, 0.75]} />
          <meshStandardMaterial color="#27272a" roughness={0.5} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 0.45, -0.05]} castShadow>
          <boxGeometry args={[0.18, 0.8, 0.14]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.5} />
        </mesh>
        {/* Monitor Frame */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.5, 1.6, 0.14]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        {/* Screen Display */}
        <mesh position={[0, 1.05, 0.076]}>
          <planeGeometry args={[2.34, 1.44]} />
          {monitorTexture ? (
            <meshBasicMaterial map={monitorTexture} />
          ) : (
            <meshBasicMaterial color="#bae6fd" />
          )}
        </mesh>
      </group>

      {/* Rocket and Cat Plume bursting from screen */}
      <RocketAndSmoke />

      {/* ── 3. BLACK ROUTER WITH 2 ANTENNAS & BLINKING LEDS ── */}
      <group position={[1.15, 0.22, -0.3]} rotation={[0, -0.15, 0]}>
        {/* Main Box */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.95, 0.22, 0.7]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        {/* Left Antenna */}
        <mesh position={[-0.32, 0.65, -0.22]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.9, 8]} />
          <meshStandardMaterial color="#27272a" roughness={0.5} />
        </mesh>
        {/* Right Antenna */}
        <mesh position={[0.32, 0.65, -0.22]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.9, 8]} />
          <meshStandardMaterial color="#27272a" roughness={0.5} />
        </mesh>
        {/* Front LED Status Bar */}
        <mesh position={[-0.25, 0.1, 0.355]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#84cc16"
            emissive="#84cc16"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[-0.1, 0.1, 0.355]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0.05, 0.1, 0.355]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#84cc16"
            emissive="#84cc16"
            emissiveIntensity={2}
          />
        </mesh>
        <pointLight
          ref={routerLedRef}
          position={[-0.1, 0.15, 0.4]}
          color="#a3e635"
          distance={1.5}
          intensity={1.2}
        />
      </group>

      {/* ── 4. DARK ISOMETRIC KEYBOARD ── */}
      <group position={[-0.2, 0.12, 0.9]} rotation={[-0.12, 0.05, 0]}>
        {/* Keyboard Tray */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.0, 0.08, 0.8]} />
          <meshStandardMaterial color="#27272a" roughness={0.5} />
        </mesh>
        {/* Key Rows */}
        <mesh position={[0, 0.045, -0.18]}>
          <boxGeometry args={[1.86, 0.02, 0.14]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[1.86, 0.02, 0.14]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.7} />
        </mesh>
        <mesh position={[-0.1, 0.045, 0.18]}>
          <boxGeometry args={[1.2, 0.02, 0.14]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.7} />
        </mesh>
      </group>

      {/* ── 5. FLOATING PIXEL CLOUDS ON LEFT ── */}
      <group position={[-1.8, 1.8, -0.8]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.35, 0.35]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.25, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[-0.25, -0.15, 0.1]}>
          <boxGeometry args={[0.4, 0.25, 0.25]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

export function Scene1Spawn3D() {
  return (
    <div className="w-full h-[185px] sm:h-[205px] lg:h-[215px] relative select-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [5.2, 4.4, 5.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} color="#f8fafc" />
        <directionalLight
          position={[6, 12, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          color="#ffffff"
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#bae6fd" />
        <Scene1Mesh />
      </Canvas>
    </div>
  );
}
