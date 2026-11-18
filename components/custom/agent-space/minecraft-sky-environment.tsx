"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// =========================================================================
// 1. VOXEL CAT WEARING HEADPHONES
// =========================================================================

function HeadphoneCat() {
  const headGroup = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const tailGroup = useRef<THREE.Group>(null);

  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic blinking
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const triggerBlink = () => {
      const delay = 2600 + Math.random() * 2600;
      timeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          triggerBlink();
        }, 140);
      }, delay);
    };
    triggerBlink();
    return () => clearTimeout(timeout);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle head breathing / idle tilt
    if (headGroup.current) {
      headGroup.current.position.y = 1.05 + Math.sin(t * 1.8) * 0.025;
      headGroup.current.rotation.y = Math.sin(t * 1.1) * 0.08;
      headGroup.current.rotation.x = Math.sin(t * 1.4) * 0.035;
      headGroup.current.rotation.z = Math.cos(t * 0.9) * 0.02;
    }

    // Gentle wagging tail
    if (tailGroup.current) {
      tailGroup.current.rotation.y = Math.sin(t * 2.8) * 0.32;
      tailGroup.current.rotation.z = Math.cos(t * 2.2) * 0.14;
    }

    // Blink scaling
    const eyeScaleY = isBlinking ? 0.12 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;
  });

  // Palette matching the reference image
  const furWhite = "#FAF9F6";
  const calicoPatch = "#E08244"; // Cute warm orange-brown calico patch
  const earPink = "#FFAAA6";
  const eyeBlack = "#18181B";
  const eyeSparkle = "#FFFFFF";
  const nosePink = "#33272A";
  const headphoneBand = "#2E1065"; // Deep purple headband
  const headphoneCup = "#7C3AED"; // Bright violet ear cushion
  const pawAccent = "#F472B6"; // Pink paw emblem on headphones

  return (
    <group position={[0, 0.28, 0]}>
      {/* --- HEAD GROUP --- */}
      <group ref={headGroup} position={[0, 1.05, 0]}>
        {/* Head Main Cube (1.24w x 1.04h x 1.04d) */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.24, 1.04, 1.04]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        {/* Calico spot on right side of head (matching reference cat) */}
        <mesh position={[0.42, 0.32, 0.3]}>
          <boxGeometry args={[0.42, 0.42, 0.48]} />
          <meshStandardMaterial color={calicoPatch} roughness={0.7} />
        </mesh>

        {/* Cheeks / Jaw subtle flare */}
        <mesh position={[0.64, -0.16, 0.06]} castShadow>
          <boxGeometry args={[0.12, 0.42, 0.54]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[-0.64, -0.16, 0.06]} castShadow>
          <boxGeometry args={[0.12, 0.42, 0.54]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        {/* Left Ear Base */}
        <mesh position={[-0.4, 0.64, 0]} castShadow>
          <boxGeometry args={[0.32, 0.34, 0.32]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        {/* Left Ear Tip */}
        <mesh position={[-0.42, 0.84, 0]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.18]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        {/* Left Ear Pink Inner */}
        <mesh position={[-0.39, 0.62, 0.16]}>
          <boxGeometry args={[0.2, 0.22, 0.04]} />
          <meshStandardMaterial color={earPink} roughness={0.7} />
        </mesh>

        {/* Right Ear Base (Calico tinted) */}
        <mesh position={[0.4, 0.64, 0]} castShadow>
          <boxGeometry args={[0.32, 0.34, 0.32]} />
          <meshStandardMaterial color={calicoPatch} roughness={0.7} />
        </mesh>
        {/* Right Ear Tip */}
        <mesh position={[0.42, 0.84, 0]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.18]} />
          <meshStandardMaterial color={calicoPatch} roughness={0.7} />
        </mesh>
        {/* Right Ear Pink Inner */}
        <mesh position={[0.39, 0.62, 0.16]}>
          <boxGeometry args={[0.2, 0.22, 0.04]} />
          <meshStandardMaterial color={earPink} roughness={0.7} />
        </mesh>

        {/* Left Eye */}
        <group position={[-0.3, 0.04, 0.53]}>
          <mesh ref={leftEyeRef}>
            <boxGeometry args={[0.2, 0.24, 0.04]} />
            <meshStandardMaterial color={eyeBlack} roughness={0.3} />
          </mesh>
          <mesh position={[-0.035, 0.045, 0.03]}>
            <boxGeometry args={[0.065, 0.065, 0.02]} />
            <meshBasicMaterial color={eyeSparkle} />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.3, 0.04, 0.53]}>
          <mesh ref={rightEyeRef}>
            <boxGeometry args={[0.2, 0.24, 0.04]} />
            <meshStandardMaterial color={eyeBlack} roughness={0.3} />
          </mesh>
          <mesh position={[-0.035, 0.045, 0.03]}>
            <boxGeometry args={[0.065, 0.065, 0.02]} />
            <meshBasicMaterial color={eyeSparkle} />
          </mesh>
        </group>

        {/* Nose & Mouth */}
        <mesh position={[0, -0.06, 0.53]}>
          <boxGeometry args={[0.09, 0.07, 0.04]} />
          <meshStandardMaterial color={nosePink} roughness={0.6} />
        </mesh>
        <mesh position={[-0.06, -0.15, 0.53]}>
          <boxGeometry args={[0.09, 0.035, 0.025]} />
          <meshStandardMaterial color="#262626" roughness={0.6} />
        </mesh>
        <mesh position={[0.06, -0.15, 0.53]}>
          <boxGeometry args={[0.09, 0.035, 0.025]} />
          <meshStandardMaterial color="#262626" roughness={0.6} />
        </mesh>

        {/* Whisker details */}
        <mesh position={[-0.52, -0.08, 0.51]}>
          <boxGeometry args={[0.2, 0.025, 0.02]} />
          <meshStandardMaterial color="#52525b" roughness={0.8} />
        </mesh>
        <mesh position={[-0.5, -0.15, 0.51]}>
          <boxGeometry args={[0.18, 0.025, 0.02]} />
          <meshStandardMaterial color="#52525b" roughness={0.8} />
        </mesh>
        <mesh position={[0.52, -0.08, 0.51]}>
          <boxGeometry args={[0.2, 0.025, 0.02]} />
          <meshStandardMaterial color="#52525b" roughness={0.8} />
        </mesh>
        <mesh position={[0.5, -0.15, 0.51]}>
          <boxGeometry args={[0.18, 0.025, 0.02]} />
          <meshStandardMaterial color="#52525b" roughness={0.8} />
        </mesh>

        {/* --- HEADPHONES ACCESSORY --- */}
        <group position={[0, 0.22, 0]}>
          {/* Headband arch across top */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1.38, 0.1, 0.24]} />
            <meshStandardMaterial color={headphoneBand} roughness={0.5} />
          </mesh>

          {/* Left Ear Cushion */}
          <group position={[-0.7, 0.04, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.46, 0.42]} />
              <meshStandardMaterial
                color={headphoneCup}
                roughness={0.4}
                emissive={headphoneCup}
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Cute pink paw print / disc on outer side of ear cup */}
            <mesh position={[-0.12, 0, 0]}>
              <boxGeometry args={[0.03, 0.2, 0.2]} />
              <meshStandardMaterial color={pawAccent} roughness={0.5} />
            </mesh>
          </group>

          {/* Right Ear Cushion */}
          <group position={[0.7, 0.04, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.46, 0.42]} />
              <meshStandardMaterial
                color={headphoneCup}
                roughness={0.4}
                emissive={headphoneCup}
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Cute pink paw print / disc on outer side of ear cup */}
            <mesh position={[0.12, 0, 0]}>
              <boxGeometry args={[0.03, 0.2, 0.2]} />
              <meshStandardMaterial color={pawAccent} roughness={0.5} />
            </mesh>
          </group>
        </group>
      </group>

      {/* --- BODY / TORSO --- */}
      <group position={[0, 0.38, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.84, 0.7, 0.72]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        {/* Soft chest belly fluff */}
        <mesh position={[0, 0.02, 0.37]}>
          <boxGeometry args={[0.48, 0.48, 0.03]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
      </group>

      {/* --- FRONT PAWS RESTING FORWARD --- */}
      <mesh position={[-0.3, 0.12, 0.38]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.28]} />
        <meshStandardMaterial color={furWhite} roughness={0.7} />
      </mesh>
      <mesh position={[0.3, 0.12, 0.38]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.28]} />
        <meshStandardMaterial color={furWhite} roughness={0.7} />
      </mesh>

      {/* --- BACK TAIL --- */}
      <group ref={tailGroup} position={[0, 0.22, -0.36]}>
        <mesh position={[0, 0.1, -0.16]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.28]} />
          <meshStandardMaterial color={furWhite} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.28, -0.26]} castShadow>
          <boxGeometry args={[0.14, 0.24, 0.14]} />
          <meshStandardMaterial color={calicoPatch} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 2. HANGING VINES UNDER THE FLOATING WOODEN PLATFORM
// =========================================================================

function HangingVine({
  position,
  length = 4,
  offset = 0,
}: {
  position: [number, number, number];
  length?: number;
  offset?: number;
}) {
  const vineRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (vineRef.current) {
      vineRef.current.rotation.z = Math.sin(t * 1.5 + offset) * 0.08;
      vineRef.current.rotation.x = Math.cos(t * 1.2 + offset) * 0.05;
    }
  });

  const greenPalette = ["#4d7c0f", "#65a30d", "#3f6212", "#84cc16"];

  return (
    <group ref={vineRef} position={position}>
      {Array.from({ length }).map((_, i) => {
        const segColor = greenPalette[i % greenPalette.length];
        const segWidth = 0.12 + (i % 2) * 0.03;
        const segHeight = 0.22 + (i % 3) * 0.04;
        const xJitter = ((i % 2) - 0.5) * 0.03;
        return (
          <mesh
            key={i}
            position={[xJitter, -i * 0.22 - 0.1, 0]}
            castShadow
          >
            <boxGeometry args={[segWidth, segHeight, 0.07]} />
            <meshStandardMaterial color={segColor} roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// =========================================================================
// 3. FLOATING WOODEN PLATFORM (MINECRAFT OAK PLANKS)
// =========================================================================

function FloatingIslandGroup() {
  const platformGroup = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Positioned cleanly in the upper-left sky pocket with full margin so ears and platform edges never clip
  const anchorX = -viewport.width / 2 + 1.35;
  const anchorY = viewport.height / 2 - 1.15;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (platformGroup.current) {
      // Gentle floating / bobbing animation
      platformGroup.current.position.y = anchorY + Math.sin(t * 1.6) * 0.05;
      platformGroup.current.position.x = anchorX;
      platformGroup.current.rotation.z = Math.sin(t * 1.1) * 0.015;
      platformGroup.current.rotation.x = Math.cos(t * 1.3) * 0.01;
    }
  });

  // Minecraft Oak Planks palette
  const oakLight = "#b47b48";
  const oakMed = "#9e6533";
  const oakDark = "#7e4a1e";
  const oakUnderside = "#653a17";

  return (
    <group
      ref={platformGroup}
      position={[anchorX, anchorY, 0]}
      scale={0.38}
    >
      {/* Cat sitting atop the platform */}
      <group position={[0, 0.22, 0.1]} scale={1}>
        <HeadphoneCat />
      </group>

      {/* --- OAK PLANKS MAIN SURFACE (2.6w x 0.38h x 2.2d) --- */}
      {/* Center Wood Slab */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.38, 2.1]} />
        <meshStandardMaterial color={oakMed} roughness={0.85} />
      </mesh>

      {/* Planks Grooves & Wood Planks Texture Variations */}
      <mesh position={[-0.75, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.03, 2.06]} />
        <meshStandardMaterial color={oakLight} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.03, 2.06]} />
        <meshStandardMaterial color={oakMed} roughness={0.85} />
      </mesh>
      <mesh position={[0.75, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.03, 2.06]} />
        <meshStandardMaterial color={oakDark} roughness={0.9} />
      </mesh>

      {/* Edge details / stepped timber corner logs */}
      <mesh position={[-1.28, 0.02, 0.85]} castShadow>
        <boxGeometry args={[0.1, 0.34, 0.36]} />
        <meshStandardMaterial color={oakDark} roughness={0.9} />
      </mesh>
      <mesh position={[1.28, 0.02, 0.85]} castShadow>
        <boxGeometry args={[0.1, 0.34, 0.36]} />
        <meshStandardMaterial color={oakLight} roughness={0.8} />
      </mesh>
      <mesh position={[0.55, -0.22, 1.06]} castShadow>
        <boxGeometry args={[0.45, 0.1, 0.08]} />
        <meshStandardMaterial color={oakMed} roughness={0.85} />
      </mesh>

      {/* Underside stepped support blocks */}
      <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.28, 1.6]} />
        <meshStandardMaterial color={oakUnderside} roughness={0.9} />
      </mesh>
      <mesh position={[0.15, -0.46, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.2, 1.0]} />
        <meshStandardMaterial color={oakUnderside} roughness={0.95} />
      </mesh>

      {/* --- HANGING GREEN VINES UNDERNEATH --- */}
      {/* Front edge vines */}
      <HangingVine position={[-1.0, -0.2, 1.05]} length={6} offset={0.2} />
      <HangingVine position={[-0.7, -0.2, 1.05]} length={4} offset={1.1} />
      <HangingVine position={[-0.38, -0.2, 1.05]} length={7} offset={2.4} />
      <HangingVine position={[0.15, -0.2, 1.05]} length={3} offset={3.2} />
      <HangingVine position={[0.8, -0.2, 1.05]} length={5} offset={4.1} />
      <HangingVine position={[1.05, -0.2, 1.05]} length={3} offset={0.8} />

      {/* Left side vines */}
      <HangingVine position={[-1.26, -0.2, 0.3]} length={5} offset={1.7} />
      <HangingVine position={[-1.26, -0.2, -0.3]} length={4} offset={2.9} />
    </group>
  );
}

// =========================================================================
// 4. VOXEL MINECRAFT CLOUDS DRIFTING HORIZONTALLY
// =========================================================================

interface CloudItem {
  id: number;
  initialX: number;
  yRatio: number; // relative to upper half of viewport
  z: number;
  width: number;
  height: number;
  depth: number;
  speed: number;
}

function VoxelCloud({ cloud }: { cloud: CloudItem }) {
  const meshRef = useRef<THREE.Group>(null);
  const currentX = useRef(cloud.initialX);
  const { viewport } = useThree();

  const wrapBoundary = viewport.width / 2 + 5;
  const cloudY = viewport.height * cloud.yRatio;

  useFrame((_, delta) => {
    if (meshRef.current) {
      currentX.current += cloud.speed * delta;
      if (currentX.current > wrapBoundary) {
        currentX.current = -wrapBoundary;
      }
      meshRef.current.position.x = currentX.current;
      meshRef.current.position.y = cloudY;
    }
  });

  return (
    <group
      ref={meshRef}
      position={[cloud.initialX, cloudY, cloud.z]}
      scale={0.75}
    >
      {/* Main Base Cloud Slab (Minecraft flat voxel shape) */}
      <mesh castShadow={false}>
        <boxGeometry args={[cloud.width, 0.38, cloud.depth]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.85}
          roughness={0.9}
        />
      </mesh>
      {/* Stepped top block */}
      <mesh position={[0.3, 0.26, 0]}>
        <boxGeometry args={[cloud.width * 0.6, 0.28, cloud.depth * 0.75]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.88}
          roughness={0.9}
        />
      </mesh>
      {/* Side extension block */}
      <mesh position={[-cloud.width * 0.28, -0.06, 0.1]}>
        <boxGeometry args={[cloud.width * 0.45, 0.26, cloud.depth * 0.65]} />
        <meshStandardMaterial
          color="#F8FAFC"
          transparent
          opacity={0.82}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

function VoxelCloudsSky() {
  const clouds: CloudItem[] = useMemo(
    () => [
      { id: 1, initialX: -4, yRatio: 0.38, z: -3, width: 4.2, height: 0.38, depth: 2.0, speed: 0.25 },
      { id: 2, initialX: 4, yRatio: 0.44, z: -4.5, width: 5.2, height: 0.38, depth: 2.4, speed: 0.18 },
      { id: 3, initialX: 8.5, yRatio: 0.34, z: -2.5, width: 3.6, height: 0.38, depth: 1.8, speed: 0.3 },
      { id: 4, initialX: -9, yRatio: 0.42, z: -5, width: 5.6, height: 0.38, depth: 2.6, speed: 0.15 },
    ],
    []
  );

  return (
    <>
      {clouds.map((cloud) => (
        <VoxelCloud key={cloud.id} cloud={cloud} />
      ))}
    </>
  );
}

// =========================================================================
// 5. MAIN MINECRAFT SKY ENVIRONMENT EXPORT
// =========================================================================

export function MinecraftSkyEnvironment() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #b9ddf8 0%, #d8ecf8 35%, #ebf4fb 65%, #fee6db 100%)",
      }}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ pointerEvents: "none", width: "100%", height: "100%" }}
      >
        {/* Soft, warm Minecraft morning lighting */}
        <ambientLight color="#ffffff" intensity={0.9} />
        <directionalLight
          position={[6, 10, 8]}
          intensity={1.3}
          color="#fff8ed"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-8, -4, -4]} intensity={0.3} color="#bae6fd" />
        <hemisphereLight
          color="#bae6fd"
          groundColor="#fed7aa"
          intensity={0.65}
        />

        {/* Upper-left: Floating wooden platform with headphone cat and hanging vines */}
        <FloatingIslandGroup />

        {/* Upper sky & Upper-right: Drifting Minecraft voxel clouds */}
        <VoxelCloudsSky />

        {/* Note: Lower-left and Lower-right are kept 100% empty as strictly required! */}
      </Canvas>
    </div>
  );
}
