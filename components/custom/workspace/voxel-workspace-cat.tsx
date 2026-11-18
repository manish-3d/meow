"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// =========================================================================
// 1. DRIFTING MINECRAFT VOXEL CLOUDS
// =========================================================================

interface CloudDef {
  id: number;
  initialX: number;
  yRatio: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  speed: number;
}

function DriftingCloud({ cloud }: { cloud: CloudDef }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentX = useRef(cloud.initialX);
  const { viewport } = useThree();

  const wrapBoundary = viewport.width / 2 + 5;
  const cloudY = viewport.height * cloud.yRatio;

  useFrame((_, delta) => {
    if (groupRef.current) {
      currentX.current += cloud.speed * delta;
      if (currentX.current > wrapBoundary) {
        currentX.current = -wrapBoundary;
      }
      groupRef.current.position.x = currentX.current;
      groupRef.current.position.y = cloudY;
    }
  });

  return (
    <group ref={groupRef} position={[cloud.initialX, cloudY, cloud.z]} scale={0.72}>
      {/* Base Cloud Slab */}
      <mesh castShadow={false}>
        <boxGeometry args={[cloud.width, cloud.height, cloud.depth]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.94}
          roughness={0.7}
        />
      </mesh>
      {/* Top Stepped Layer */}
      <mesh position={[0.22, cloud.height * 0.72, 0]}>
        <boxGeometry args={[cloud.width * 0.65, cloud.height * 0.65, cloud.depth * 0.78]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.96}
          roughness={0.7}
        />
      </mesh>
      {/* Side Wing Block */}
      <mesh position={[-cloud.width * 0.32, -cloud.height * 0.12, 0.12]}>
        <boxGeometry args={[cloud.width * 0.44, cloud.height * 0.68, cloud.depth * 0.62]} />
        <meshStandardMaterial
          color="#FAFAFD"
          transparent
          opacity={0.9}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

function SkyClouds() {
  const clouds: CloudDef[] = useMemo(
    () => [
      { id: 1, initialX: -4.8, yRatio: 0.37, z: -3.6, width: 3.4, depth: 1.6, height: 0.44, speed: 0.07 },
      { id: 2, initialX: 4.6, yRatio: 0.39, z: -3.8, width: 3.6, depth: 1.8, height: 0.46, speed: 0.08 },
      { id: 3, initialX: -1.2, yRatio: 0.45, z: -5.4, width: 5.0, depth: 2.2, height: 0.5, speed: 0.05 },
      { id: 4, initialX: 8.0, yRatio: 0.43, z: -4.8, width: 4.2, depth: 2.0, height: 0.45, speed: 0.06 },
    ],
    []
  );

  return (
    <>
      {clouds.map((cloud) => (
        <DriftingCloud key={cloud.id} cloud={cloud} />
      ))}
    </>
  );
}

// =========================================================================
// 2. HEADPHONE LAPTOP CAT (AUTHENTIC TO REFERENCE)
// =========================================================================

function HeadphoneLaptopCat() {
  const headGroup = useRef<THREE.Group>(null);
  const tailGroup = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const triggerBlink = () => {
      const delay = 2400 + Math.random() * 2600;
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

    // Natural head idle breathing and looking down slightly at laptop
    if (headGroup.current) {
      headGroup.current.position.y = 1.04 + Math.sin(t * 1.8) * 0.02;
      headGroup.current.rotation.y = Math.sin(t * 1.1) * 0.035;
      headGroup.current.rotation.x = 0.09 + Math.sin(t * 1.5) * 0.02;
    }

    // Elegant tail wagging
    if (tailGroup.current) {
      tailGroup.current.rotation.y = -0.3 + Math.sin(t * 2.6) * 0.28;
      tailGroup.current.rotation.z = Math.cos(t * 2.0) * 0.12;
    }

    // Blink scaling
    const eyeScaleY = isBlinking ? 0.12 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;
  });

  const furWhite = "#FFFFFF";
  const calicoOrange = "#e7853b"; // Rich calico orange ear & back patch
  const earPink = "#ffb0a8";
  const eyeBlack = "#18181b";
  const eyeSparkle = "#FFFFFF";
  const nosePink = "#362627";
  const headphoneBlack = "#1a1817";
  const headphoneLime = "#8dcb16"; // Brand Minecraft grass green

  return (
    <group position={[0, 0.28, -0.05]}>
      {/* ── HEAD ── */}
      <group ref={headGroup} position={[0, 1.04, 0]}>
        {/* Head Main Cube */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.32, 1.08, 1.1]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        {/* Calico Orange Patch on Right Side of Head & Right Ear */}
        <mesh position={[0.44, 0.34, 0.29]}>
          <boxGeometry args={[0.46, 0.46, 0.54]} />
          <meshStandardMaterial color={calicoOrange} roughness={0.7} />
        </mesh>

        {/* Left Ear (White) */}
        <mesh position={[-0.43, 0.67, 0]} castShadow>
          <boxGeometry args={[0.34, 0.36, 0.34]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[-0.45, 0.88, 0]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[-0.42, 0.65, 0.17]}>
          <boxGeometry args={[0.22, 0.24, 0.04]} />
          <meshStandardMaterial color={earPink} roughness={0.7} />
        </mesh>

        {/* Right Ear (Calico Orange) */}
        <mesh position={[0.43, 0.67, 0]} castShadow>
          <boxGeometry args={[0.34, 0.36, 0.34]} />
          <meshStandardMaterial color={calicoOrange} roughness={0.7} />
        </mesh>
        <mesh position={[0.45, 0.88, 0]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial color={calicoOrange} roughness={0.7} />
        </mesh>
        <mesh position={[0.44, 0.65, 0.17]}>
          <boxGeometry args={[0.22, 0.24, 0.04]} />
          <meshStandardMaterial color={earPink} roughness={0.7} />
        </mesh>

        {/* Left Eye */}
        <group position={[-0.33, 0.05, 0.56]}>
          <mesh ref={leftEyeRef}>
            <boxGeometry args={[0.21, 0.25, 0.04]} />
            <meshStandardMaterial color={eyeBlack} roughness={0.3} />
          </mesh>
          <mesh position={[-0.038, 0.048, 0.03]}>
            <boxGeometry args={[0.075, 0.075, 0.02]} />
            <meshBasicMaterial color={eyeSparkle} />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.33, 0.05, 0.56]}>
          <mesh ref={rightEyeRef}>
            <boxGeometry args={[0.21, 0.25, 0.04]} />
            <meshStandardMaterial color={eyeBlack} roughness={0.3} />
          </mesh>
          <mesh position={[-0.038, 0.048, 0.03]}>
            <boxGeometry args={[0.075, 0.075, 0.02]} />
            <meshBasicMaterial color={eyeSparkle} />
          </mesh>
        </group>

        {/* Nose & Mouth */}
        <mesh position={[0, -0.065, 0.56]}>
          <boxGeometry args={[0.09, 0.07, 0.04]} />
          <meshStandardMaterial color={nosePink} roughness={0.6} />
        </mesh>
        <mesh position={[-0.075, -0.16, 0.56]}>
          <boxGeometry args={[0.095, 0.035, 0.03]} />
          <meshStandardMaterial color="#262626" roughness={0.6} />
        </mesh>
        <mesh position={[0.075, -0.16, 0.56]}>
          <boxGeometry args={[0.095, 0.035, 0.03]} />
          <meshStandardMaterial color="#262626" roughness={0.6} />
        </mesh>

        {/* ── HEADPHONES (Black headband + glowing green cat cups) ── */}
        {/* Top Arch Headband */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <boxGeometry args={[1.44, 0.1, 0.28]} />
          <meshStandardMaterial color={headphoneBlack} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.68, 0]} castShadow>
          <boxGeometry args={[0.98, 0.06, 0.24]} />
          <meshStandardMaterial color={headphoneLime} roughness={0.5} />
        </mesh>

        {/* Left Earcup */}
        <group position={[-0.76, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.48, 0.48]} />
            <meshStandardMaterial color={headphoneBlack} roughness={0.5} />
          </mesh>
          <mesh position={[-0.02, 0, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.4]} />
            <meshStandardMaterial color={headphoneLime} roughness={0.4} />
          </mesh>
          {/* White Cat Silhouette on Earcup */}
          <mesh position={[-0.13, 0, 0]}>
            <boxGeometry args={[0.02, 0.18, 0.18]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Right Earcup */}
        <group position={[0.76, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.48, 0.48]} />
            <meshStandardMaterial color={headphoneBlack} roughness={0.5} />
          </mesh>
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.4]} />
            <meshStandardMaterial color={headphoneLime} roughness={0.4} />
          </mesh>
          {/* White Cat Silhouette on Earcup */}
          <mesh position={[0.13, 0, 0]}>
            <boxGeometry args={[0.02, 0.18, 0.18]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>

      {/* ── BODY ── */}
      <group position={[0, 0.44, 0]}>
        {/* Main Torso */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.02, 0.86, 1.02]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        {/* Calico Patch on Back/Side of Body */}
        <mesh position={[0.36, 0.16, -0.32]}>
          <boxGeometry args={[0.34, 0.54, 0.38]} />
          <meshStandardMaterial color={calicoOrange} roughness={0.7} />
        </mesh>

        {/* Sitting Back Legs */}
        <mesh position={[-0.56, -0.22, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 0.38, 0.72]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[0.56, -0.22, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 0.38, 0.72]} />
          <meshStandardMaterial color={calicoOrange} roughness={0.7} />
        </mesh>

        {/* Front Paws Typing on Laptop */}
        <mesh position={[-0.25, -0.25, 0.54]} castShadow>
          <boxGeometry args={[0.19, 0.18, 0.36]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[0.25, -0.25, 0.54]} castShadow>
          <boxGeometry args={[0.19, 0.18, 0.36]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        {/* Tail (Curving out to left with striped calico bands) */}
        <group ref={tailGroup} position={[-0.34, -0.16, -0.52]}>
          <mesh position={[-0.14, 0.16, -0.16]} rotation={[-0.4, -0.5, 0.3]} castShadow>
            <boxGeometry args={[0.18, 0.46, 0.18]} />
            <meshStandardMaterial color={calicoOrange} roughness={0.7} />
          </mesh>
          <mesh position={[-0.28, 0.48, -0.24]} rotation={[-0.1, -0.2, 0.4]} castShadow>
            <boxGeometry args={[0.18, 0.38, 0.18]} />
            <meshStandardMaterial color={furWhite} roughness={0.65} />
          </mesh>
          <mesh position={[-0.38, 0.76, -0.2]} rotation={[0.2, 0, 0.6]} castShadow>
            <boxGeometry args={[0.16, 0.28, 0.16]} />
            <meshStandardMaterial color={calicoOrange} roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ── VOXEL SILVER LAPTOP (OUTER LID FACING CAMERA WITH CAT LOGO) ── */}
      <group position={[0, 0.08, 0.66]}>
        {/* Base / Keyboard Tray (lying flat) */}
        <mesh position={[0, 0.02, -0.12]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.045, 0.58]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Keyboard keys */}
        <mesh position={[0, 0.048, -0.14]}>
          <boxGeometry args={[0.78, 0.012, 0.34]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* Trackpad */}
        <mesh position={[0, 0.048, 0.06]}>
          <boxGeometry args={[0.26, 0.01, 0.15]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} />
        </mesh>

        {/* Screen Hinge & Open Lid (Hinged at z=0.15, angled backwards towards cat at z=0) */}
        <group position={[0, 0.04, 0.15]} rotation={[0.5, 0, 0]}>
          {/* Silver Screen Outer Lid (Faces the camera / viewer!) */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[0.92, 0.64, 0.04]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.5} roughness={0.3} />
          </mesh>

          {/* Glowing Inner Screen Display (Facing the cat) */}
          <mesh position={[0, 0.32, -0.022]}>
            <boxGeometry args={[0.84, 0.54, 0.01]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={2.0}
              roughness={0.2}
            />
          </mesh>

          {/* Screen Light illuminating cat's face and paws */}
          <pointLight position={[0, 0.32, -0.24]} color="#60a5fa" intensity={1.6} distance={2.4} />

          {/* Black Cat Head Silhouette Logo on Outer Lid (FACES THE CAMERA!) */}
          <group position={[0, 0.32, 0.022]}>
            {/* Center Head */}
            <mesh>
              <boxGeometry args={[0.18, 0.15, 0.005]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            {/* Left Ear */}
            <mesh position={[-0.07, 0.1, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.005]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            {/* Right Ear */}
            <mesh position={[0.07, 0.1, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.005]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// =========================================================================
// 3. SINGLE CENTRAL FLOATING MINECRAFT GRASS ISLAND (ISOMETRIC 3/4 ANGLE)
// =========================================================================

function FloatingIslandHero() {
  const islandGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (islandGroup.current) {
      // Gentle floating / bobbing in the sky
      islandGroup.current.position.y = 0.58 + Math.sin(t * 1.5) * 0.05;
      islandGroup.current.rotation.y = -0.38 + Math.sin(t * 0.8) * 0.02;
    }
  });

  const grassTop = "#74c22b";
  const grassSide = "#62a820";
  const grassDark = "#528e19";
  const dirtLight = "#854f26";
  const dirtMed = "#70411d";
  const dirtDark = "#573014";
  const dirtTip = "#42230d";

  return (
    <group
      ref={islandGroup}
      position={[0, 0.58, 0]}
      rotation={[0.26, -0.38, 0]}
      scale={0.5}
    >
      {/* Cat centered comfortably on Island */}
      <group position={[0, 0.22, 0]}>
        <HeadphoneLaptopCat />
      </group>

      {/* --- TOP LAYER: GRASS PLATEAU --- */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.44, 3.2]} />
        <meshStandardMaterial color={grassTop} roughness={0.65} />
      </mesh>

      {/* Stepped Grass Overhang Fringe Tabs (Minecraft Drooping Voxel Sides) */}
      {/* Front Face Fringe */}
      <mesh position={[-0.8, -0.28, 1.61]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.24, 0.06]} />
        <meshStandardMaterial color={grassSide} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.34, 1.61]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.34, 0.06]} />
        <meshStandardMaterial color={grassSide} roughness={0.8} />
      </mesh>
      <mesh position={[0.8, -0.26, 1.61]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.2, 0.06]} />
        <meshStandardMaterial color={grassDark} roughness={0.8} />
      </mesh>

      {/* Right Face Fringe */}
      <mesh position={[1.61, -0.3, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.28, 0.65]} />
        <meshStandardMaterial color={grassSide} roughness={0.8} />
      </mesh>
      <mesh position={[1.61, -0.34, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.36, 0.7]} />
        <meshStandardMaterial color={grassSide} roughness={0.8} />
      </mesh>

      {/* Left Face Fringe */}
      <mesh position={[-1.61, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.26, 1.4]} />
        <meshStandardMaterial color={grassSide} roughness={0.8} />
      </mesh>

      {/* Grass blade tufts and tiny flowers on top */}
      <mesh position={[-1.2, 0.28, 1.1]} castShadow>
        <boxGeometry args={[0.16, 0.22, 0.16]} />
        <meshStandardMaterial color="#8dcb16" roughness={0.7} />
      </mesh>
      <mesh position={[1.2, 0.28, -1.0]} castShadow>
        <boxGeometry args={[0.14, 0.2, 0.14]} />
        <meshStandardMaterial color="#8dcb16" roughness={0.7} />
      </mesh>
      <mesh position={[1.25, 0.26, 1.0]} castShadow>
        <boxGeometry args={[0.16, 0.18, 0.16]} />
        <meshStandardMaterial color="#8dcb16" roughness={0.7} />
      </mesh>
      <mesh position={[-1.1, 0.26, -1.1]} castShadow>
        <boxGeometry args={[0.14, 0.18, 0.14]} />
        <meshStandardMaterial color="#8dcb16" roughness={0.7} />
      </mesh>
      {/* Tiny Red Flower */}
      <group position={[-1.1, 0.28, 0.8]}>
        <mesh>
          <boxGeometry args={[0.08, 0.18, 0.08]} />
          <meshStandardMaterial color="#8dcb16" />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.14, 0.12, 0.14]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* --- MIDDLE LAYER: DIRT STEP 1 --- */}
      <mesh position={[0, -0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.44, 2.8]} />
        <meshStandardMaterial color={dirtLight} roughness={0.9} />
      </mesh>

      {/* --- DIRT STEP 2 (TAPERING DOWNWARDS) --- */}
      <mesh position={[0, -0.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.42, 2.2]} />
        <meshStandardMaterial color={dirtMed} roughness={0.9} />
      </mesh>

      {/* --- DIRT STEP 3 (TAPERING APEX) --- */}
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.38, 1.5]} />
        <meshStandardMaterial color={dirtDark} roughness={0.9} />
      </mesh>

      {/* Bottom Tip Block */}
      <mesh position={[0.06, -1.48, -0.04]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.28, 0.75]} />
        <meshStandardMaterial color={dirtTip} roughness={0.9} />
      </mesh>
    </group>
  );
}

// =========================================================================
// 4. BOTTOM MINECRAFT GRASS & DIRT GROUND STRIP
// =========================================================================

function BottomGrassGround() {
  const { viewport } = useThree();
  const width = Math.max(viewport.width + 8, 26);
  // Anchored cleanly at the bottom
  const posY = -viewport.height / 2 + 0.08;

  const grassTop = "#74c22b";
  const grassSide = "#62a820";
  const dirtBase = "#70411d";

  return (
    <group position={[0, posY, 0.4]}>
      {/* Top Grass Plateau */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[width, 0.34, 2.8]} />
        <meshStandardMaterial color={grassTop} roughness={0.7} />
      </mesh>

      {/* Stepped Grass Side Fringe */}
      <mesh position={[0, -0.2, 1.41]} receiveShadow>
        <boxGeometry args={[width, 0.16, 0.08]} />
        <meshStandardMaterial color={grassSide} roughness={0.8} />
      </mesh>

      {/* Dirt Foundation */}
      <mesh position={[0, -0.56, 0]} receiveShadow>
        <boxGeometry args={[width, 0.58, 2.6]} />
        <meshStandardMaterial color={dirtBase} roughness={0.9} />
      </mesh>

      {/* Minecraft Grass Blades Sprouting Up Along Bottom Edge */}
      {[-7.2, -5.6, -4.3, -2.9, -1.5, 0.1, 1.7, 3.3, 4.9, 6.5].map((x, i) => (
        <group key={i} position={[x, 0.18, 0.6]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.18, 0.08]} />
            <meshStandardMaterial color="#8dcb16" roughness={0.7} />
          </mesh>
          <mesh position={[0.08, -0.04, 0]} castShadow>
            <boxGeometry args={[0.07, 0.11, 0.07]} />
            <meshStandardMaterial color="#62a820" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// =========================================================================
// 5. MAIN 3D WORKSPACE SCENE
// =========================================================================

export function VoxelWorkspaceScene() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #cde3fa 0%, #dbeafc 30%, #f0e6f6 60%, #fff7f2 85%, #ffffff 100%)",
      }}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.5, 7.0], fov: 42 }}
        style={{ pointerEvents: "none", width: "100%", height: "100%" }}
      >
        {/* Soft, warm Minecraft morning daylight */}
        <ambientLight color="#fffaf5" intensity={1.05} />
        <directionalLight
          position={[5, 9, 7]}
          intensity={1.4}
          color="#fff8ed"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-6, -2, -4]} intensity={0.3} color="#bae6fd" />
        <hemisphereLight color="#bae6fd" groundColor="#fed7aa" intensity={0.7} />

        {/* Drifting Clouds in Upper Sky */}
        <SkyClouds />

        {/* Central Hero: Headphone Laptop Cat on Floating Grass Island (3/4 Angle) */}
        <FloatingIslandHero />

        {/* Bottom Minecraft Grass Ground Strip */}
        <BottomGrassGround />
      </Canvas>
    </div>
  );
}
