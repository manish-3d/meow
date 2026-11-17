"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface VoxelCatProps {
  isHovered?: boolean;
  isClicked?: boolean;
  scale?: number;
  children?: React.ReactNode; // Props / accessories (laptop, books, camera, etc.)
  customHeadGear?: React.ReactNode; // Glasses or Headphones
}

export function VoxelCat({
  isHovered = false,
  isClicked = false,
  scale = 1,
  children,
  customHeadGear,
}: VoxelCatProps) {
  const headGroup = useRef<THREE.Group>(null);
  const tailGroup = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic blinking
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const triggerBlink = () => {
      const delay = 3000 + Math.random() * 2500;
      timeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          triggerBlink();
        }, 150);
      }, delay);
    };
    triggerBlink();
    return () => clearTimeout(timeout);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle head breathing / idle tilt
    if (headGroup.current) {
      headGroup.current.position.y = 1.05 + Math.sin(t * 2) * 0.03;
      headGroup.current.rotation.y = Math.sin(t * 1.2) * 0.06;
      headGroup.current.rotation.x = Math.sin(t * 1.5) * 0.03;

      if (isHovered) {
        headGroup.current.position.y = 1.08 + Math.sin(t * 4) * 0.05;
        headGroup.current.rotation.y = Math.sin(t * 2) * 0.12;
      }
      if (isClicked) {
        headGroup.current.rotation.z = Math.sin(t * 10) * 0.15;
      }
    }

    // Gentle wagging tail
    if (tailGroup.current) {
      tailGroup.current.rotation.y = Math.sin(t * 3.5) * 0.35;
      tailGroup.current.rotation.z = Math.cos(t * 2.8) * 0.15;
      if (isHovered) {
        tailGroup.current.rotation.y = Math.sin(t * 6.5) * 0.55;
      }
    }

    // Blink scaling
    const eyeScaleY = isBlinking ? 0.15 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;
  });

  // Materials
  const furWhite = "#FAFAFA";
  const earPink = "#FFAAA6";
  const eyeBlack = "#18181B";
  const eyeWhiteSpark = "#FFFFFF";
  const nosePink = "#262626";
  const hoodieBlack = "#18181B";
  const hoodieLining = "#E4E4E7";

  return (
    <group position={[0, 0.25, 0]} scale={scale}>
      {/* --- HEAD GROUP --- */}
      <group ref={headGroup} position={[0, 1.05, 0]}>
        {/* Head Main Cube (1.28w x 1.08h x 1.08d) */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.28, 1.08, 1.08]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        {/* Cheeks / Jaw subtle flare */}
        <mesh position={[0.66, -0.16, 0.06]} castShadow>
          <boxGeometry args={[0.12, 0.44, 0.56]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        <mesh position={[-0.66, -0.16, 0.06]} castShadow>
          <boxGeometry args={[0.12, 0.44, 0.56]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>

        {/* --- EARS --- */}
        {/* Left Ear Base */}
        <mesh position={[-0.42, 0.68, 0]} castShadow>
          <boxGeometry args={[0.34, 0.36, 0.34]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        {/* Left Ear Tip */}
        <mesh position={[-0.44, 0.9, 0]} castShadow>
          <boxGeometry args={[0.2, 0.18, 0.2]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        {/* Left Ear Pink Inner */}
        <mesh position={[-0.41, 0.66, 0.17]}>
          <boxGeometry args={[0.22, 0.24, 0.04]} />
          <meshStandardMaterial color={earPink} roughness={0.7} />
        </mesh>

        {/* Right Ear Base */}
        <mesh position={[0.42, 0.68, 0]} castShadow>
          <boxGeometry args={[0.34, 0.36, 0.34]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        {/* Right Ear Tip */}
        <mesh position={[0.44, 0.9, 0]} castShadow>
          <boxGeometry args={[0.2, 0.18, 0.2]} />
          <meshStandardMaterial color={furWhite} roughness={0.65} />
        </mesh>
        {/* Right Ear Pink Inner */}
        <mesh position={[0.41, 0.66, 0.17]}>
          <boxGeometry args={[0.22, 0.24, 0.04]} />
          <meshStandardMaterial color={earPink} roughness={0.7} />
        </mesh>

        {/* --- EYES --- */}
        {/* Left Eye */}
        <group position={[-0.32, 0.04, 0.55]}>
          <mesh ref={leftEyeRef}>
            <boxGeometry args={[0.22, 0.26, 0.04]} />
            <meshStandardMaterial color={eyeBlack} roughness={0.3} />
          </mesh>
          {/* Eye Sparkle / White Specular Pupil */}
          <mesh position={[-0.04, 0.05, 0.03]}>
            <boxGeometry args={[0.07, 0.07, 0.02]} />
            <meshBasicMaterial color={eyeWhiteSpark} />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.32, 0.04, 0.55]}>
          <mesh ref={rightEyeRef}>
            <boxGeometry args={[0.22, 0.26, 0.04]} />
            <meshStandardMaterial color={eyeBlack} roughness={0.3} />
          </mesh>
          {/* Eye Sparkle / White Specular Pupil */}
          <mesh position={[-0.04, 0.05, 0.03]}>
            <boxGeometry args={[0.07, 0.07, 0.02]} />
            <meshBasicMaterial color={eyeWhiteSpark} />
          </mesh>
        </group>

        {/* --- NOSE & MOUTH --- */}
        {/* Nose */}
        <mesh position={[0, -0.06, 0.55]}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <meshStandardMaterial color={nosePink} roughness={0.6} />
        </mesh>
        {/* Cat W-mouth voxels */}
        <mesh position={[-0.07, -0.16, 0.55]}>
          <boxGeometry args={[0.1, 0.04, 0.03]} />
          <meshStandardMaterial color="#262626" roughness={0.6} />
        </mesh>
        <mesh position={[0.07, -0.16, 0.55]}>
          <boxGeometry args={[0.1, 0.04, 0.03]} />
          <meshStandardMaterial color="#262626" roughness={0.6} />
        </mesh>

        {/* Subtle Whiskers */}
        <mesh position={[-0.56, -0.08, 0.53]}>
          <boxGeometry args={[0.24, 0.03, 0.02]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.8} />
        </mesh>
        <mesh position={[-0.54, -0.16, 0.53]}>
          <boxGeometry args={[0.22, 0.03, 0.02]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.8} />
        </mesh>
        <mesh position={[0.56, -0.08, 0.53]}>
          <boxGeometry args={[0.24, 0.03, 0.02]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.8} />
        </mesh>
        <mesh position={[0.54, -0.16, 0.53]}>
          <boxGeometry args={[0.22, 0.03, 0.02]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.8} />
        </mesh>

        {/* Custom Head Gear (Glasses or Headphones) */}
        {customHeadGear}
      </group>

      {/* --- BODY / TORSO (Hoodie) --- */}
      <group position={[0, 0.38, 0]}>
        {/* Main Hoodie Block */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.72, 0.74]} />
          <meshStandardMaterial color={hoodieBlack} roughness={0.8} />
        </mesh>
        {/* Hoodie Collar / Zipper Line */}
        <mesh position={[0, 0.18, 0.38]}>
          <boxGeometry args={[0.14, 0.38, 0.02]} />
          <meshStandardMaterial color={hoodieLining} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0.38]}>
          <boxGeometry args={[0.04, 0.16, 0.02]} />
          <meshStandardMaterial color={furWhite} roughness={0.6} />
        </mesh>
      </group>

      {/* --- FRONT PAWS --- */}
      <mesh position={[-0.32, 0.12, 0.38]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.26]} />
        <meshStandardMaterial color={furWhite} roughness={0.7} />
      </mesh>
      <mesh position={[0.32, 0.12, 0.38]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.26]} />
        <meshStandardMaterial color={furWhite} roughness={0.7} />
      </mesh>

      {/* --- ARTICULATED TAIL (Back) --- */}
      <group ref={tailGroup} position={[0, 0.25, -0.38]}>
        <mesh position={[0, 0.12, -0.18]} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.3]} />
          <meshStandardMaterial color={furWhite} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.32, -0.3]} castShadow>
          <boxGeometry args={[0.15, 0.26, 0.15]} />
          <meshStandardMaterial color={furWhite} roughness={0.7} />
        </mesh>
        {/* Black tail tip accent */}
        <mesh position={[0, 0.48, -0.3]} castShadow>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshStandardMaterial color={hoodieBlack} roughness={0.8} />
        </mesh>
      </group>

      {/* --- BOT-SPECIFIC PROPS (Placed in front of paws / around cat) --- */}
      {children}
    </group>
  );
}
