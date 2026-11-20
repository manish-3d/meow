"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

function CloudPlatformBase() {
  const labelTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 52px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Cloud platform", 256, 64);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <group position={[0, -0.4, 0]}>
      {/* ── Main Cloud Plateau ── */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.45, 3.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>

      {/* Cloud Lobes rounding the sides (Minecraft / Voxel stepped cloud shape) */}
      <mesh position={[1.85, -0.05, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.38, 2.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      <mesh position={[-1.85, -0.05, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.38, 2.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      <mesh position={[0.2, -0.05, 1.75]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.38, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      <mesh position={[-0.2, -0.05, -1.75]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.38, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>

      {/* ── Front Bevel with "Cloud platform" Label ── */}
      <mesh position={[0, -0.28, 1.62]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[2.6, 0.36, 0.1]} />
        {labelTexture ? (
          <meshBasicMaterial map={labelTexture} />
        ) : (
          <meshStandardMaterial color="#94a3b8" />
        )}
      </mesh>

      {/* ── Stepped Cloud Underside ── */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[3.1, 0.35, 2.9]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[2.3, 0.3, 2.1]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
    </group>
  );
}

function ServerRacksAndDatabase() {
  const ledRef1 = useRef<THREE.PointLight>(null);
  const ledRef2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ledRef1.current) {
      ledRef1.current.intensity = 1.0 + Math.sin(t * 7) * 0.5;
    }
    if (ledRef2.current) {
      ledRef2.current.intensity = 1.0 + Math.cos(t * 9) * 0.5;
    }
  });

  return (
    <group position={[-0.5, 0, -0.3]}>
      {/* ── 3 DARK BLADE SERVER RACKS ── */}
      {[-0.6, 0, 0.6].map((xOffset, i) => (
        <group key={i} position={[xOffset, 0.7, 0]}>
          {/* Main Chassis Frame */}
          <mesh castShadow>
            <boxGeometry args={[0.48, 1.5, 0.85]} />
            <meshStandardMaterial color="#18181b" roughness={0.4} />
          </mesh>
          {/* Front Grille Panel */}
          <mesh position={[0, 0, 0.43]}>
            <planeGeometry args={[0.42, 1.4]} />
            <meshStandardMaterial color="#27272a" roughness={0.6} />
          </mesh>
          {/* Server Unit Horizontal Slots & Status LEDs */}
          {[-0.5, -0.25, 0, 0.25, 0.5].map((yOffset, j) => (
            <group key={j} position={[0, yOffset, 0.435]}>
              <mesh>
                <boxGeometry args={[0.38, 0.12, 0.01]} />
                <meshStandardMaterial color="#09090b" roughness={0.5} />
              </mesh>
              {/* Blinking Status LED */}
              <mesh position={[-0.14, 0, 0.01]}>
                <boxGeometry args={[0.04, 0.04, 0.01]} />
                <meshStandardMaterial
                  color={j % 2 === 0 ? "#84cc16" : "#38bdf8"}
                  emissive={j % 2 === 0 ? "#84cc16" : "#38bdf8"}
                  emissiveIntensity={2.5}
                />
              </mesh>
              <mesh position={[-0.07, 0, 0.01]}>
                <boxGeometry args={[0.04, 0.04, 0.01]} />
                <meshStandardMaterial
                  color="#84cc16"
                  emissive="#84cc16"
                  emissiveIntensity={2}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      <pointLight
        ref={ledRef1}
        position={[-0.3, 0.8, 0.6]}
        color="#84cc16"
        distance={2}
        intensity={1.2}
      />
      <pointLight
        ref={ledRef2}
        position={[0.3, 0.8, 0.6]}
        color="#38bdf8"
        distance={2}
        intensity={1.2}
      />

      {/* ── 3-TIER BLUE CYLINDRICAL DATABASE (STORAGE) ── */}
      <group position={[1.4, 0.42, 0.4]}>
        {/* Tier 1 */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.04, 16]} />
          <meshStandardMaterial color="#0369a1" />
        </mesh>
        {/* Tier 2 */}
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.04, 16]} />
          <meshStandardMaterial color="#0369a1" />
        </mesh>
        {/* Tier 3 */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.4} />
        </mesh>
      </group>

      {/* ── WORKSTATION COMPUTER TERMINALS ── */}
      <group position={[1.3, 0.2, -0.4]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.7, 0.55, 0.4]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.32, 0.21]}>
          <planeGeometry args={[0.62, 0.48]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Keyboard */}
        <mesh position={[0, 0.04, 0.35]}>
          <boxGeometry args={[0.6, 0.05, 0.25]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>

      <group position={[0.65, 0.2, 0.6]} rotation={[0, -0.2, 0]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.6, 0.48, 0.35]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.28, 0.18]}>
          <planeGeometry args={[0.54, 0.42]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
}

function FloatingProgressBar() {
  const barRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (barRef.current) {
      barRef.current.position.y = 1.95 + Math.sin(t * 3) * 0.06;
    }
  });

  return (
    <group ref={barRef} position={[0, 1.95, -0.2]}>
      {/* Outer Pill Container */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.34, 0.14]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} />
      </mesh>
      {/* Inner Screen Inset */}
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[1.4, 0.26]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>
      {/* Segmented Green Battery / Progress Blocks */}
      {[-0.52, -0.32, -0.12, 0.08, 0.28, 0.48].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 0, 0.082]}>
          <boxGeometry args={[0.15, 0.18, 0.01]} />
          <meshStandardMaterial
            color="#84cc16"
            emissive="#a3e635"
            emissiveIntensity={2.2}
          />
        </mesh>
      ))}
      {/* Glow aura */}
      <pointLight position={[0, 0, 0.3]} color="#bef264" distance={2} intensity={1.5} />
    </group>
  );
}

function Scene2Mesh() {
  const domeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (domeRef.current) {
      domeRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group position={[0, -0.25, 0]} rotation={[0.22, 0.42, 0]}>
      {/* Cloud Base Platform */}
      <CloudPlatformBase />

      {/* Internal Hardware */}
      <ServerRacksAndDatabase />

      {/* Floating Progress Bar */}
      <FloatingProgressBar />

      {/* ── TRANSPARENT GLASS DOME ENCLOSURE ── */}
      <mesh ref={domeRef} position={[0, 0.6, 0]}>
        <sphereGeometry args={[2.55, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshPhysicalMaterial
          color="#dbeafe"
          transmission={0.92}
          opacity={0.38}
          transparent
          roughness={0.06}
          ior={1.4}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Dome rim highlight ring */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.45, 0.04, 12, 36]} />
        <meshStandardMaterial color="#93c5fd" emissive="#bfdbfe" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export function Scene2Provisioning3D() {
  return (
    <div className="w-full h-[185px] sm:h-[205px] lg:h-[215px] relative select-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [5.4, 4.6, 5.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} color="#f0fdf4" />
        <directionalLight
          position={[6, 12, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          color="#ffffff"
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#86efac" />
        <Scene2Mesh />
      </Canvas>
    </div>
  );
}
