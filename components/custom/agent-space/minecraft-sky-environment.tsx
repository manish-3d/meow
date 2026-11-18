"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
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

  const furWhite = "#FAF9F6";
  const calicoPatch = "#E08244";
  const earPink = "#FFAAA6";
  const eyeBlack = "#18181B";
  const eyeSparkle = "#FFFFFF";
  const nosePink = "#33272A";
  const headphoneBand = "#2E1065";
  const headphoneCup = "#7C3AED";
  const pawAccent = "#F472B6";

  return (
    <group position={[0, 0.28, 0]}>
      {/* Head */}
      <group ref={headGroup} position={[0, 1.05, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.24, 1.04, 1.04]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        <mesh position={[0.42, 0.32, 0.3]}>
          <boxGeometry args={[0.42, 0.42, 0.48]} />
          <meshStandardMaterial color={calicoPatch} roughness={0.7} />
        </mesh>

        {/* Cheeks */}
        <mesh position={[0.64, -0.16, 0.06]} castShadow>
          <boxGeometry args={[0.12, 0.42, 0.54]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[-0.64, -0.16, 0.06]} castShadow>
          <boxGeometry args={[0.12, 0.42, 0.54]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.4, 0.64, 0]} castShadow>
          <boxGeometry args={[0.32, 0.34, 0.32]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[-0.42, 0.84, 0]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.18]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[-0.39, 0.62, 0.16]}>
          <boxGeometry args={[0.2, 0.22, 0.04]} />
          <meshStandardMaterial color={earPink} roughness={0.7} />
        </mesh>

        <mesh position={[0.4, 0.64, 0]} castShadow>
          <boxGeometry args={[0.32, 0.34, 0.32]} />
          <meshStandardMaterial color={calicoPatch} roughness={0.7} />
        </mesh>
        <mesh position={[0.42, 0.84, 0]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.18]} />
          <meshStandardMaterial color={calicoPatch} roughness={0.7} />
        </mesh>
        <mesh position={[0.39, 0.62, 0.16]}>
          <boxGeometry args={[0.2, 0.22, 0.04]} />
          <meshStandardMaterial color={earPink} roughness={0.7} />
        </mesh>

        {/* Eyes */}
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

        {/* Whiskers */}
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

        {/* Headphones */}
        <group position={[0, 0.22, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1.38, 0.1, 0.24]} />
            <meshStandardMaterial color={headphoneBand} roughness={0.5} />
          </mesh>
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

      {/* Body */}
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

      {/* Paws */}
      <mesh position={[-0.3, 0.12, 0.38]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.28]} />
        <meshStandardMaterial color={furWhite} roughness={0.7} />
      </mesh>
      <mesh position={[0.3, 0.12, 0.38]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.28]} />
        <meshStandardMaterial color={furWhite} roughness={0.7} />
      </mesh>

      {/* Tail */}
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
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.1, 0.12, 0.04]} />
        <meshStandardMaterial color="#27272a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.34, 0.08, 0.34]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.28, 0.24, 0.28]} />
        <meshStandardMaterial
          color="#fef08a"
          transparent
          opacity={0.35}
          roughness={0.1}
        />
      </mesh>
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
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.14, 0.16, 0.14]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>
      <pointLight color="#fbbf24" intensity={2.8} distance={5} decay={2} />
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
// 4. UPPER-LEFT CAT ISLAND (MASCOT ANCHOR)
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
      <group position={[0, 0.22, 0.1]} scale={1}>
        <HeadphoneCat />
      </group>

      {/* Oak Planks */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.38, 2.1]} />
        <meshStandardMaterial color={oakMed} roughness={0.85} />
      </mesh>
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

      {/* Underside blocks */}
      <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.28, 1.6]} />
        <meshStandardMaterial color={oakUnderside} roughness={0.9} />
      </mesh>
      <mesh position={[0.15, -0.46, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.2, 1.0]} />
        <meshStandardMaterial color={oakUnderside} roughness={0.95} />
      </mesh>

      {/* Leaf blocks */}
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

      {/* Hanging Vines */}
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
// 5. DRIFTING ISLAND 1: WOODEN PLATFORM WITH COZY LANTERN (LEFT TO RIGHT)
// =========================================================================

function DriftingLanternIsland() {
  const groupRef = useRef<THREE.Group>(null);
  const currentX = useRef(1.8);
  const { viewport } = useThree();

  const speed = 0.18;
  const wrapRight = viewport.width / 2 + 3.5;
  const wrapLeft = -viewport.width / 2 - 3.5;
  const anchorY = viewport.height / 2 - 0.95;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      currentX.current += speed * delta;
      if (currentX.current > wrapRight) {
        currentX.current = wrapLeft;
      }
      groupRef.current.position.x = currentX.current;
      groupRef.current.position.y = anchorY + Math.sin(t * 1.5 + 1.2) * 0.04;
      groupRef.current.rotation.z = Math.sin(t * 1.1 + 0.5) * 0.012;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[currentX.current, anchorY, -1.5]}
      scale={0.28}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.38, 1.9]} />
        <meshStandardMaterial color="#9e6533" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.26, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.24, 1.4]} />
        <meshStandardMaterial color="#653a17" roughness={0.9} />
      </mesh>

      {/* Leaf Blocks */}
      <mesh position={[0.55, 0.44, -0.2]} castShadow>
        <boxGeometry args={[0.85, 0.72, 0.85]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
      </mesh>
      <mesh position={[0.45, 0.88, -0.15]} castShadow>
        <boxGeometry args={[0.6, 0.55, 0.6]} />
        <meshStandardMaterial color="#40916c" roughness={0.85} />
      </mesh>

      {/* Oak Post & Lantern */}
      <mesh position={[-0.55, 0.28, 0.2]} castShadow>
        <boxGeometry args={[0.16, 0.42, 0.16]} />
        <meshStandardMaterial color="#7e4a1e" roughness={0.8} />
      </mesh>
      <group position={[-0.55, 0.64, 0.2]}>
        <MinecraftLantern scale={1.15} />
      </group>

      {/* Vines */}
      <HangingVine position={[-0.85, -0.2, 0.95]} length={6} offset={0.5} />
      <HangingVine position={[-0.5, -0.2, 0.95]} length={4} offset={1.8} />
      <HangingVine position={[-0.1, -0.2, 0.95]} length={7} offset={3.1} />
      <HangingVine position={[0.4, -0.2, 0.95]} length={5} offset={4.2} />
      <HangingVine position={[0.75, -0.2, 0.95]} length={3} offset={1.3} />
      <HangingVine position={[1.16, -0.2, 0.2]} length={5} offset={2.2} />
    </group>
  );
}

// =========================================================================
// 6. DRIFTING ISLAND 2: WOODEN CABIN / HOUSE WITH VINES (RIGHT TO LEFT)
// =========================================================================

function DriftingCottageIsland() {
  const groupRef = useRef<THREE.Group>(null);
  const currentX = useRef(-1.2);
  const { viewport } = useThree();

  const speed = 0.14;
  const wrapLeft = -viewport.width / 2 - 4.0;
  const wrapRight = viewport.width / 2 + 4.0;
  const anchorY = viewport.height / 2 - 1.25;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      currentX.current -= speed * delta;
      if (currentX.current < wrapLeft) {
        currentX.current = wrapRight;
      }
      groupRef.current.position.x = currentX.current;
      groupRef.current.position.y = anchorY + Math.sin(t * 1.7 + 2.5) * 0.035;
      groupRef.current.rotation.z = Math.sin(t * 1.2 + 1.8) * 0.01;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[currentX.current, anchorY, -2.4]}
      scale={0.25}
    >
      {/* Wood Platform */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.38, 2.4]} />
        <meshStandardMaterial color="#9e6533" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.26, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.26, 1.8]} />
        <meshStandardMaterial color="#653a17" roughness={0.9} />
      </mesh>

      {/* House Walls */}
      <mesh position={[-0.2, 0.58, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.8, 1.4]} />
        <meshStandardMaterial color="#b47b48" roughness={0.8} />
      </mesh>
      {/* Corner Pillars */}
      <mesh position={[-0.92, 0.58, 0.68]} castShadow>
        <boxGeometry args={[0.2, 0.84, 0.2]} />
        <meshStandardMaterial color="#5e3619" roughness={0.85} />
      </mesh>
      <mesh position={[0.52, 0.58, 0.68]} castShadow>
        <boxGeometry args={[0.2, 0.84, 0.2]} />
        <meshStandardMaterial color="#5e3619" roughness={0.85} />
      </mesh>
      <mesh position={[-0.92, 0.58, -0.68]} castShadow>
        <boxGeometry args={[0.2, 0.84, 0.2]} />
        <meshStandardMaterial color="#5e3619" roughness={0.85} />
      </mesh>
      <mesh position={[0.52, 0.58, -0.68]} castShadow>
        <boxGeometry args={[0.2, 0.84, 0.2]} />
        <meshStandardMaterial color="#5e3619" roughness={0.85} />
      </mesh>

      {/* Door */}
      <mesh position={[-0.2, 0.44, 0.72]}>
        <boxGeometry args={[0.3, 0.56, 0.05]} />
        <meshStandardMaterial color="#78350f" roughness={0.85} />
      </mesh>

      {/* Glowing Window */}
      <mesh position={[0.25, 0.62, 0.72]}>
        <boxGeometry args={[0.24, 0.24, 0.04]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[-0.2, 1.05, 0]} castShadow>
        <boxGeometry args={[1.8, 0.16, 1.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.85} />
      </mesh>
      <mesh position={[-0.2, 1.22, 0]} castShadow>
        <boxGeometry args={[1.3, 0.18, 1.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.85} />
      </mesh>
      <mesh position={[-0.2, 1.38, 0]} castShadow>
        <boxGeometry args={[0.8, 0.16, 1.6]} />
        <meshStandardMaterial color="#5e3619" roughness={0.9} />
      </mesh>

      {/* Chimney */}
      <mesh position={[0.35, 1.45, -0.3]} castShadow>
        <boxGeometry args={[0.24, 0.45, 0.24]} />
        <meshStandardMaterial color="#71717a" roughness={0.9} />
      </mesh>

      {/* Mini Lantern by Door */}
      <group position={[-0.55, 0.72, 0.75]}>
        <MinecraftLantern scale={0.7} />
      </group>

      {/* Foliage */}
      <mesh position={[0.95, 0.45, -0.1]} castShadow>
        <boxGeometry args={[0.7, 0.65, 0.7]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
      </mesh>

      {/* Vines */}
      <HangingVine position={[-1.1, -0.2, 1.15]} length={6} offset={0.8} />
      <HangingVine position={[-0.6, -0.2, 1.15]} length={4} offset={2.1} />
      <HangingVine position={[0.1, -0.2, 1.15]} length={7} offset={3.5} />
      <HangingVine position={[0.7, -0.2, 1.15]} length={5} offset={1.4} />
      <HangingVine position={[1.1, -0.2, 1.15]} length={3} offset={2.8} />
      <HangingVine position={[-1.35, -0.2, 0.3]} length={5} offset={3.9} />
    </group>
  );
}

// =========================================================================
// 7. TALL MINECRAFT TIMBER LAMP POST (BIG & PROMINENT)
// =========================================================================

function MinecraftLampPost({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const woodTrim = "#7e4a1e";
  const woodLog = "#9e6533";
  const stonePlinth = "#52525b";
  const ironBand = "#27272a";

  return (
    <group position={position} scale={scale}>
      {/* Cobblestone Plinth Base */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.16, 0.42]} />
        <meshStandardMaterial color={stonePlinth} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.1, 0.32]} />
        <meshStandardMaterial color={stonePlinth} roughness={0.9} />
      </mesh>

      {/* Tall Wooden Post / Pillar (Height 1.7 units) */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 1.7, 0.18]} />
        <meshStandardMaterial color={woodLog} roughness={0.85} />
      </mesh>

      {/* Decorative Iron Braces along the post */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.06, 0.22]} />
        <meshStandardMaterial color={ironBand} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[0.22, 0.06, 0.22]} />
        <meshStandardMaterial color={ironBand} roughness={0.6} />
      </mesh>

      {/* Top Cross-Cap Overhang & Brackets */}
      <mesh position={[0, 2.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.1, 0.34]} />
        <meshStandardMaterial color={woodTrim} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.1, 0.44]} />
        <meshStandardMaterial color={woodTrim} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.08, 0.28]} />
        <meshStandardMaterial color={stonePlinth} roughness={0.9} />
      </mesh>

      {/* Glowing Minecraft Lantern perched on top */}
      <group position={[0, 2.28, 0]}>
        <MinecraftLantern scale={1.15} />
      </group>

      {/* Warm Ambient Firelight */}
      <pointLight
        position={[0, 2.45, 0.25]}
        color="#fef08a"
        intensity={1.2}
        distance={4.0}
        decay={2}
      />
    </group>
  );
}

// =========================================================================
// 8. RICH GROUND TERRAIN (GRASS, TIMBER, MATCHING TALL LAMPS)
// =========================================================================

function ElevatedMinecraftGround() {
  const { viewport } = useThree();
  const terrainWidth = Math.max(viewport.width + 6, 22);

  // Elevated to anchor the bottom horizon right behind the input capsule
  const posY = -viewport.height / 2 + 0.36;

  const grassTop = "#6ebb2f";
  const grassSide = "#5ea325";
  const woodLog = "#9e6533";
  const woodTrim = "#7e4a1e";
  const dirtBase = "#754522";

  // Position lamps safely inside layout with comfortable padding from screen edges
  // Using 0.82 of half-width guarantees zero clipping at edges and clear separation from chat
  const lampOffset = Math.min((viewport.width / 2) * 0.82, viewport.width / 2 - 0.75);

  return (
    <group position={[0, posY, 0.3]}>
      {/* Top Grass Plateau */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[terrainWidth, 0.42, 2.8]} />
        <meshStandardMaterial color={grassTop} roughness={0.7} />
      </mesh>

      {/* Stepped Grass Side Fringe Tabs */}
      <mesh position={[0, -0.24, 1.41]} receiveShadow>
        <boxGeometry args={[terrainWidth, 0.2, 0.08]} />
        <meshStandardMaterial color={grassSide} roughness={0.8} />
      </mesh>

      {/* Oak Log Timber Trim */}
      <mesh position={[0, -0.42, 0]} receiveShadow>
        <boxGeometry args={[terrainWidth, 0.3, 2.6]} />
        <meshStandardMaterial color={woodLog} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.42, 1.32]} castShadow receiveShadow>
        <boxGeometry args={[terrainWidth, 0.24, 0.08]} />
        <meshStandardMaterial color={woodTrim} roughness={0.9} />
      </mesh>

      {/* Dirt Foundation */}
      <mesh position={[0, -0.82, 0]} receiveShadow>
        <boxGeometry args={[terrainWidth, 0.56, 2.5]} />
        <meshStandardMaterial color={dirtBase} roughness={0.9} />
      </mesh>

      {/* --- MATCHING TALL LAMP POST (LEFT SIDE) --- */}
      <MinecraftLampPost
        position={[-lampOffset, 0.22, 0.5]}
        scale={0.95}
      />

      {/* Mini foliage shrub beside left lamp */}
      <group position={[-lampOffset + 0.5, 0.22, 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.26, 0.3]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
        </mesh>
      </group>

      {/* --- MATCHING TALL LAMP POST (RIGHT SIDE) --- */}
      <MinecraftLampPost
        position={[lampOffset, 0.22, 0.5]}
        scale={0.95}
      />

      {/* Mini foliage shrub beside right lamp */}
      <group position={[lampOffset - 0.5, 0.22, 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.26, 0.3]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
        </mesh>
      </group>

      {/* --- FLOWERS IN THE GRASS --- */}
      {/* Red Poppy */}
      <group position={[-lampOffset + 0.95, 0.22, 0.8]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.035, 0.2, 0.035]} />
          <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.15, 0.13, 0.15]} />
          <meshStandardMaterial color="#ef4444" roughness={0.6} />
        </mesh>
      </group>

      {/* Yellow Dandelion */}
      <group position={[lampOffset - 0.95, 0.22, 0.8]}>
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.035, 0.18, 0.035]} />
          <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.14, 0.13, 0.14]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 8.5 VOXEL MINECRAFT CLOUDS DRIFTING HORIZONTALLY
// =========================================================================

interface CloudItem {
  id: number;
  initialX: number;
  yRatio: number;
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
      scale={0.7}
    >
      {/* Main Base Cloud Slab (Minecraft flat voxel shape) */}
      <mesh castShadow={false}>
        <boxGeometry args={[cloud.width, 0.38, cloud.depth]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.88}
          roughness={0.9}
        />
      </mesh>
      {/* Stepped top block */}
      <mesh position={[0.3, 0.26, 0]}>
        <boxGeometry args={[cloud.width * 0.6, 0.28, cloud.depth * 0.75]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.9}
          roughness={0.9}
        />
      </mesh>
      {/* Side extension block */}
      <mesh position={[-cloud.width * 0.28, -0.06, 0.1]}>
        <boxGeometry args={[cloud.width * 0.45, 0.26, cloud.depth * 0.65]} />
        <meshStandardMaterial
          color="#F8FAFC"
          transparent
          opacity={0.85}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

function VoxelCloudsSky() {
  const clouds: CloudItem[] = useMemo(
    () => [
      { id: 1, initialX: -3.5, yRatio: 0.36, z: -3.5, width: 3.8, height: 0.38, depth: 1.8, speed: 0.12 },
      { id: 2, initialX: 3.2, yRatio: 0.42, z: -4.5, width: 4.8, height: 0.38, depth: 2.2, speed: 0.09 },
      { id: 3, initialX: 7.5, yRatio: 0.32, z: -2.8, width: 3.2, height: 0.38, depth: 1.6, speed: 0.14 },
      { id: 4, initialX: -8.0, yRatio: 0.40, z: -5.0, width: 5.0, height: 0.38, depth: 2.4, speed: 0.08 },
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
// 9. MAIN MINECRAFT LIVING WORLD EXPORT
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

        {/* 0. Drifting Minecraft voxel clouds in upper sky */}
        <VoxelCloudsSky />

        {/* 1. Upper-left: Headphone Cat sitting on wooden platform with green leaves & hanging vines */}
        <UpperLeftCatIsland />

        {/* 2. Drifting Island 1: Floating wooden platform with glowing lantern & foliage (Left to Right) */}
        <DriftingLanternIsland />

        {/* 3. Drifting Island 2: Floating wooden cabin / cottage with chimney, window, foliage & vines (Right to Left) */}
        <DriftingCottageIsland />

        {/* 4. Bottom Area: Elevated lush Minecraft grass terrain, flowers, timber beam & tall symmetrical lamp posts */}
        <ElevatedMinecraftGround />
      </Canvas>
    </div>
  );
}
