"use client";

import React, { useRef, useState, useEffect } from "react";
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

  // Palette
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

        {/* Calico spot on right side of head */}
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
// 2. MINECRAFT VOXEL LANTERN
// =========================================================================

function MinecraftLantern({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Top Iron Ring / Handle */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.1, 0.12, 0.04]} />
        <meshStandardMaterial color="#27272a" roughness={0.5} />
      </mesh>

      {/* Iron Roof Cap */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.34, 0.08, 0.34]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>

      {/* Glass Body Panels */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.28, 0.24, 0.28]} />
        <meshStandardMaterial
          color="#fef08a"
          transparent
          opacity={0.35}
          roughness={0.1}
        />
      </mesh>

      {/* 4 Iron Corner Struts */}
      <mesh position={[-0.13, 0.12, -0.13]}>
        <boxGeometry args={[0.035, 0.24, 0.035]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>
      <mesh position={[0.13, 0.12, -0.13]}>
        <boxGeometry args={[0.035, 0.24, 0.035]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>
      <mesh position={[-0.13, 0.12, 0.13]}>
        <boxGeometry args={[0.035, 0.24, 0.035]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>
      <mesh position={[0.13, 0.12, 0.13]}>
        <boxGeometry args={[0.035, 0.24, 0.035]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>

      {/* Glowing Torch / Fire Core Inside */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.14, 0.16, 0.14]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2.2}
          roughness={0.2}
        />
      </mesh>

      {/* Warm Point Light Cast by the Lantern */}
      <pointLight color="#fbbf24" intensity={2.4} distance={4.5} decay={2} />

      {/* Iron Base Tray */}
      <mesh position={[0, -0.04, 0]} castShadow>
        <boxGeometry args={[0.34, 0.08, 0.34]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>
    </group>
  );
}

// =========================================================================
// 3. HANGING GREEN VINES
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
// 4. UPPER-LEFT FLOATING PLATFORM (CAT + OAK PLANKS + VINES + LEAVES)
// =========================================================================

function UpperLeftCatIsland() {
  const platformGroup = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const anchorX = -viewport.width / 2 + 1.35;
  const anchorY = viewport.height / 2 - 1.15;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (platformGroup.current) {
      platformGroup.current.position.y = anchorY + Math.sin(t * 1.6) * 0.05;
      platformGroup.current.position.x = anchorX;
      platformGroup.current.rotation.z = Math.sin(t * 1.1) * 0.015;
      platformGroup.current.rotation.x = Math.cos(t * 1.3) * 0.01;
    }
  });

  // Minecraft Oak Planks & Foliage palette
  const oakLight = "#b47b48";
  const oakMed = "#9e6533";
  const oakDark = "#7e4a1e";
  const oakUnderside = "#653a17";
  const leafGreen1 = "#2d6a4f";
  const leafGreen2 = "#40916c";
  const leafGreen3 = "#52b788";

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
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.38, 2.1]} />
        <meshStandardMaterial color={oakMed} roughness={0.85} />
      </mesh>

      {/* Planks Grooves */}
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

      {/* Timber Corner Logs */}
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

      {/* --- GREEN LEAF FOLIAGE BLOCKS ON BACK CORNER --- */}
      <mesh position={[-1.0, 0.38, -0.8]} castShadow>
        <boxGeometry args={[0.65, 0.6, 0.65]} />
        <meshStandardMaterial color={leafGreen1} roughness={0.85} />
      </mesh>
      <mesh position={[-0.8, 0.72, -0.75]} castShadow>
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshStandardMaterial color={leafGreen2} roughness={0.85} />
      </mesh>
      <mesh position={[1.0, 0.32, -0.7]} castShadow>
        <boxGeometry args={[0.55, 0.5, 0.55]} />
        <meshStandardMaterial color={leafGreen3} roughness={0.85} />
      </mesh>

      {/* --- HANGING GREEN VINES UNDERNEATH --- */}
      <HangingVine position={[-1.0, -0.2, 1.05]} length={6} offset={0.2} />
      <HangingVine position={[-0.7, -0.2, 1.05]} length={4} offset={1.1} />
      <HangingVine position={[-0.38, -0.2, 1.05]} length={7} offset={2.4} />
      <HangingVine position={[0.15, -0.2, 1.05]} length={3} offset={3.2} />
      <HangingVine position={[0.8, -0.2, 1.05]} length={5} offset={4.1} />
      <HangingVine position={[1.05, -0.2, 1.05]} length={3} offset={0.8} />

      <HangingVine position={[-1.26, -0.2, 0.3]} length={5} offset={1.7} />
      <HangingVine position={[-1.26, -0.2, -0.3]} length={4} offset={2.9} />
    </group>
  );
}

// =========================================================================
// 5. UPPER-RIGHT FLOATING TIMBER & LEAF ISLAND WITH COZY LANTERN
// =========================================================================

function UpperRightLanternIsland() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Anchored in the upper-right sky pocket with breathing room from messages
  const anchorX = viewport.width / 2 - 0.88;
  const anchorY = viewport.height / 2 - 0.85;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Counter-phase gentle bobbing
      groupRef.current.position.y = anchorY + Math.sin(t * 1.5 + 1.4) * 0.045;
      groupRef.current.position.x = anchorX;
      groupRef.current.rotation.z = Math.sin(t * 1.2 + 0.5) * 0.012;
      groupRef.current.rotation.x = Math.cos(t * 1.0 + 0.8) * 0.008;
    }
  });

  const oakLight = "#b47b48";
  const oakMed = "#9e6533";
  const oakDark = "#7e4a1e";
  const oakUnderside = "#653a17";
  const leaf1 = "#2d6a4f";
  const leaf2 = "#40916c";
  const leaf3 = "#52b788";

  return (
    <group
      ref={groupRef}
      position={[anchorX, anchorY, 0]}
      scale={0.28}
    >
      {/* --- OAK PLANKS SURFACE (2.4w x 0.38h x 2.0d) --- */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.38, 1.9]} />
        <meshStandardMaterial color={oakMed} roughness={0.85} />
      </mesh>

      {/* Planks Texture Variations */}
      <mesh position={[-0.65, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.65, 0.03, 1.86]} />
        <meshStandardMaterial color={oakLight} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.65, 0.03, 1.86]} />
        <meshStandardMaterial color={oakMed} roughness={0.85} />
      </mesh>
      <mesh position={[0.65, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.65, 0.03, 1.86]} />
        <meshStandardMaterial color={oakDark} roughness={0.9} />
      </mesh>

      {/* Stepped Underside */}
      <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.26, 1.4]} />
        <meshStandardMaterial color={oakUnderside} roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, -0.44, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.18, 0.9]} />
        <meshStandardMaterial color={oakUnderside} roughness={0.95} />
      </mesh>

      {/* --- LUSH GREEN LEAF BLOCKS ON THE ISLAND --- */}
      {/* Big Main Leaf Cluster */}
      <mesh position={[0.55, 0.44, -0.2]} castShadow>
        <boxGeometry args={[0.85, 0.72, 0.85]} />
        <meshStandardMaterial color={leaf1} roughness={0.85} />
      </mesh>
      {/* Secondary Top Leaf Block */}
      <mesh position={[0.45, 0.88, -0.15]} castShadow>
        <boxGeometry args={[0.6, 0.55, 0.6]} />
        <meshStandardMaterial color={leaf2} roughness={0.85} />
      </mesh>
      {/* Side Accent Leaf Block */}
      <mesh position={[0.9, 0.35, 0.3]} castShadow>
        <boxGeometry args={[0.55, 0.48, 0.55]} />
        <meshStandardMaterial color={leaf3} roughness={0.85} />
      </mesh>

      {/* --- MINECRAFT WOODEN FENCE POST & GLOWING LANTERN --- */}
      {/* Oak Fence Post */}
      <mesh position={[-0.55, 0.28, 0.2]} castShadow>
        <boxGeometry args={[0.16, 0.42, 0.16]} />
        <meshStandardMaterial color={oakDark} roughness={0.8} />
      </mesh>
      {/* Cozy Minecraft Lantern Resting on Fence Post */}
      <group position={[-0.55, 0.64, 0.2]}>
        <MinecraftLantern scale={1.1} />
      </group>

      {/* --- HANGING GREEN VINES UNDERNEATH --- */}
      <HangingVine position={[-0.85, -0.2, 0.95]} length={6} offset={0.5} />
      <HangingVine position={[-0.5, -0.2, 0.95]} length={4} offset={1.8} />
      <HangingVine position={[-0.1, -0.2, 0.95]} length={7} offset={3.1} />
      <HangingVine position={[0.4, -0.2, 0.95]} length={5} offset={4.2} />
      <HangingVine position={[0.75, -0.2, 0.95]} length={3} offset={1.3} />

      {/* Right-edge Vines */}
      <HangingVine position={[1.16, -0.2, 0.2]} length={5} offset={2.2} />
      <HangingVine position={[1.16, -0.2, -0.3]} length={4} offset={3.7} />
    </group>
  );
}

// =========================================================================
// 6. BOTTOM TERRAIN: MINECRAFT GREEN GRASS & WOODEN FOUNDATION
// =========================================================================

function BottomMinecraftTerrain() {
  const { viewport } = useThree();
  const terrainWidth = Math.max(viewport.width + 6, 22);
  const posY = -viewport.height / 2 - 0.28; // Hugs bottom edge cleanly behind composer

  // Palette
  const grassTop = "#6ebb2f";
  const grassSide = "#5ea325";
  const woodLog = "#9e6533";
  const woodTrim = "#7e4a1e";
  const dirtBase = "#754522";

  return (
    <group position={[0, posY, 0.2]}>
      {/* --- TOP LAYER: MINECRAFT GRASS PLATEAU --- */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[terrainWidth, 0.36, 2.6]} />
        <meshStandardMaterial color={grassTop} roughness={0.7} />
      </mesh>

      {/* Stepped Grass Side Fringe Tabs */}
      <mesh position={[0, -0.2, 1.31]} receiveShadow>
        <boxGeometry args={[terrainWidth, 0.16, 0.06]} />
        <meshStandardMaterial color={grassSide} roughness={0.8} />
      </mesh>

      {/* --- MIDDLE LAYER: OAK LOG / WOODEN TRIM BEAM --- */}
      <mesh position={[0, -0.36, 0]} receiveShadow>
        <boxGeometry args={[terrainWidth, 0.26, 2.4]} />
        <meshStandardMaterial color={woodLog} roughness={0.85} />
      </mesh>
      {/* Front Wooden Trim Strip */}
      <mesh position={[0, -0.36, 1.22]} castShadow receiveShadow>
        <boxGeometry args={[terrainWidth, 0.22, 0.06]} />
        <meshStandardMaterial color={woodTrim} roughness={0.9} />
      </mesh>

      {/* --- BOTTOM LAYER: DIRT FOUNDATION SLAB --- */}
      <mesh position={[0, -0.68, 0]} receiveShadow>
        <boxGeometry args={[terrainWidth, 0.48, 2.3]} />
        <meshStandardMaterial color={dirtBase} roughness={0.9} />
      </mesh>

      {/* --- RIGHT-SIDE TIMBER POST WITH COMPACT LANTERN --- */}
      <group position={[viewport.width / 2 - 1.2, 0.18, 0.4]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.28, 0.2]} />
          <meshStandardMaterial color={woodTrim} roughness={0.85} />
        </mesh>
        <group position={[0, 0.22, 0]}>
          <MinecraftLantern scale={0.65} />
        </group>
      </group>

      {/* --- LEFT-SIDE MINI GRASS / LEAF SHRUB DETAIL --- */}
      <group position={[-viewport.width / 2 + 1.4, 0.14, 0.4]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.24, 0.38]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
        </mesh>
        <mesh position={[0.2, -0.04, 0.08]} castShadow>
          <boxGeometry args={[0.26, 0.18, 0.26]} />
          <meshStandardMaterial color="#40916c" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 7. MAIN MINECRAFT SKY & TERRAIN ENVIRONMENT EXPORT
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

        {/* 1. Upper-left: Floating wooden platform with headphone cat, green leaves & hanging vines */}
        <UpperLeftCatIsland />

        {/* 2. Upper-right: Floating wooden platform with green leaves, hanging vines & cozy glowing lantern */}
        <UpperRightLanternIsland />

        {/* 3. Bottom area: Subtle Minecraft green grass & wooden log foundation with cozy lantern */}
        <BottomMinecraftTerrain />
      </Canvas>
    </div>
  );
}
