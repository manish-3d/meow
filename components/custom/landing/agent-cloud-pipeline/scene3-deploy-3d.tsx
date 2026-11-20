"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

function VoxelCat() {
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.08;
      headRef.current.position.y = 0.85 + Math.sin(t * 2) * 0.02;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 3) * 0.15;
    }
  });

  return (
    <group position={[0, 0.22, 0]}>
      {/* ── Cat Body ── */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.85, 0.78, 0.75]} />
        <meshStandardMaterial color="#ffffff" roughness={0.65} />
      </mesh>
      {/* Orange Back Patch */}
      <mesh position={[0.26, 0.48, -0.08]} castShadow>
        <boxGeometry args={[0.32, 0.45, 0.52]} />
        <meshStandardMaterial color="#f97316" roughness={0.65} />
      </mesh>
      {/* Paws */}
      <mesh position={[-0.24, 0.14, 0.38]} castShadow>
        <boxGeometry args={[0.2, 0.22, 0.26]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.24, 0.14, 0.38]} castShadow>
        <boxGeometry args={[0.2, 0.22, 0.26]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Tail */}
      <group position={[0, 0.32, -0.4]}>
        <mesh ref={tailRef} position={[0, 0.25, -0.12]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.16]} />
          <meshStandardMaterial color="#f97316" roughness={0.65} />
        </mesh>
      </group>

      {/* ── Cat Head ── */}
      <group ref={headRef} position={[0, 0.85, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.02, 0.88, 0.88]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} />
        </mesh>
        {/* Calico Patch on Head */}
        <mesh position={[0.3, 0.2, 0.08]} castShadow>
          <boxGeometry args={[0.42, 0.5, 0.72]} />
          <meshStandardMaterial color="#f97316" roughness={0.65} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.34, 0.54, 0]} castShadow>
          <boxGeometry args={[0.24, 0.28, 0.24]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.34, 0.52, 0.08]}>
          <boxGeometry args={[0.16, 0.2, 0.08]} />
          <meshStandardMaterial color="#fca5a5" />
        </mesh>
        <mesh position={[0.34, 0.54, 0]} castShadow>
          <boxGeometry args={[0.24, 0.28, 0.24]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        <mesh position={[0.34, 0.52, 0.08]}>
          <boxGeometry args={[0.16, 0.2, 0.08]} />
          <meshStandardMaterial color="#fca5a5" />
        </mesh>
        {/* Eyes (Happy Curved Eyes) */}
        <mesh position={[-0.24, 0.04, 0.45]}>
          <boxGeometry args={[0.16, 0.04, 0.02]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        <mesh position={[0.24, 0.04, 0.45]}>
          <boxGeometry args={[0.16, 0.04, 0.02]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.06, 0.46]}>
          <boxGeometry args={[0.08, 0.06, 0.03]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        {/* Lime Green Headphones */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.16, 0.12, 0.26]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        <mesh position={[-0.56, 0.06, 0]} castShadow>
          <boxGeometry args={[0.16, 0.48, 0.44]} />
          <meshStandardMaterial color="#84cc16" roughness={0.3} />
        </mesh>
        <mesh position={[0.56, 0.06, 0]} castShadow>
          <boxGeometry args={[0.16, 0.48, 0.44]} />
          <meshStandardMaterial color="#84cc16" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function IslandProps() {
  const antennaLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (antennaLightRef.current) {
      antennaLightRef.current.intensity = 1.5 + Math.sin(t * 6) * 0.8;
    }
  });

  return (
    <>
      {/* ── 1. TERMINAL SCREEN ON MOUNT (ON LEFT) ── */}
      <group position={[-1.25, 0.5, 0.35]} rotation={[0, 0.35, 0]}>
        {/* Post */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.6} />
        </mesh>
        {/* Screen Casing */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.95, 0.65, 0.15]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        {/* Display Surface with `> _` */}
        <mesh position={[0, 0.65, 0.08]}>
          <planeGeometry args={[0.86, 0.56]} />
          <meshBasicMaterial color="#0c131f" />
        </mesh>
        {/* Green prompt text */}
        <mesh position={[-0.22, 0.72, 0.085]}>
          <boxGeometry args={[0.14, 0.04, 0.01]} />
          <meshStandardMaterial color="#84cc16" emissive="#84cc16" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-0.04, 0.72, 0.085]}>
          <boxGeometry args={[0.14, 0.04, 0.01]} />
          <meshStandardMaterial color="#bef264" emissive="#bef264" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* ── 2. BLUE CYLINDRICAL DATABASE STACK (BEHIND CAT) ── */}
      <group position={[0.75, 0.6, -0.7]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.24, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.24, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.24, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.4} />
        </mesh>
      </group>

      {/* ── 3. YELLOW 3D FOLDER DOCUMENT (ON RIGHT) ── */}
      <group position={[1.25, 0.6, 0.2]} rotation={[0, -0.4, 0]}>
        {/* Folder Back Tab */}
        <mesh position={[-0.1, 0.45, -0.04]} castShadow>
          <boxGeometry args={[0.3, 0.16, 0.04]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
        {/* Folder Body */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.8, 0.58, 0.16]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} />
        </mesh>
        {/* White Document Paper inside */}
        <mesh position={[0, 0.38, 0.02]} castShadow>
          <boxGeometry args={[0.66, 0.5, 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
      </group>

      {/* ── 4. ANTENNA TRANSMITTER POLE (RIGHT BEHIND) ── */}
      <group position={[1.35, 0.5, -0.9]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={3}
            roughness={0.1}
          />
        </mesh>
        <pointLight
          ref={antennaLightRef}
          position={[0, 1.3, 0]}
          color="#38bdf8"
          distance={2.5}
          intensity={1.5}
        />
      </group>

      {/* ── 5. NETWORK PORTS & CABLES ON FRONT EDGE ── */}
      <group position={[-0.4, 0.18, 1.62]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.14, 0.06]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        {/* Looping Cable */}
        <mesh position={[0, -0.15, 0.12]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
          <meshStandardMaterial color="#84cc16" emissive="#84cc16" emissiveIntensity={0.8} />
        </mesh>
      </group>

      <group position={[0.4, 0.18, 1.62]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.14, 0.06]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        {/* Looping Cable */}
        <mesh position={[0, -0.15, 0.12]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </>
  );
}

function Scene3Mesh() {
  return (
    <group position={[0, -0.35, 0]} rotation={[0.22, 0.42, 0]}>
      {/* ── 1. MINECRAFT GRASS & DIRT ISLAND BASE ── */}
      {/* Grass Top Slab */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.42, 3.8]} />
        <meshStandardMaterial color="#84cc16" roughness={0.7} />
      </mesh>

      {/* Stepped Grass Fringe Overhang */}
      <mesh position={[0, -0.26, 1.92]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.2, 0.08]} />
        <meshStandardMaterial color="#72b81e" roughness={0.8} />
      </mesh>
      <mesh position={[1.92, -0.26, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.2, 3.0]} />
        <meshStandardMaterial color="#72b81e" roughness={0.8} />
      </mesh>

      {/* Stepped Dirt Layer 1 */}
      <mesh position={[0, -0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.38, 3.5]} />
        <meshStandardMaterial color="#87532a" roughness={0.9} />
      </mesh>

      {/* Stepped Dirt Layer 2 */}
      <mesh position={[0, -0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.36, 2.9]} />
        <meshStandardMaterial color="#754522" roughness={0.9} />
      </mesh>

      {/* Stepped Dirt Tip */}
      <mesh position={[0, -1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.3, 2.1]} />
        <meshStandardMaterial color="#5e3619" roughness={0.95} />
      </mesh>

      {/* Cat Mascot */}
      <VoxelCat />

      {/* Island Props */}
      <IslandProps />
    </group>
  );
}

export function Scene3Deploy3D() {
  return (
    <div className="w-full h-[185px] sm:h-[205px] lg:h-[215px] relative select-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [5.2, 4.4, 5.8], fov: 42 }}
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
        <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#bef264" />
        <Scene3Mesh />
      </Canvas>
    </div>
  );
}
