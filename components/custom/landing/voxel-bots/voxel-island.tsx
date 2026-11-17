"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface VoxelIslandProps {
  isBuilder?: boolean;
  isHovered?: boolean;
  scale?: number;
}

export function VoxelIsland({ isBuilder = false, isHovered = false, scale = 1 }: VoxelIslandProps) {
  const floatingBlock1 = useRef<THREE.Mesh>(null);
  const floatingBlock2 = useRef<THREE.Mesh>(null);
  const floatingBlock3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (floatingBlock1.current) {
      floatingBlock1.current.position.y = 0.6 + Math.sin(t * 2 + 1) * 0.12;
      floatingBlock1.current.rotation.y = t * 0.8;
      floatingBlock1.current.rotation.x = t * 0.5;
    }
    if (floatingBlock2.current) {
      floatingBlock2.current.position.y = -0.4 + Math.sin(t * 2.2 + 2.5) * 0.1;
      floatingBlock2.current.rotation.y = -t * 0.7;
    }
    if (floatingBlock3.current) {
      floatingBlock3.current.position.y = 0.2 + Math.cos(t * 1.8 + 4) * 0.15;
      floatingBlock3.current.rotation.z = t * 0.6;
    }
  });

  // Color palette
  const grassTopColor = isBuilder ? "#80d62c" : "#6ebb2f";
  const grassSideColor = isBuilder ? "#6cb825" : "#5ea325";
  const dirtLight = "#87532a";
  const dirtMed = "#754522";
  const dirtDark = "#5e3619";
  const dirtTip = "#4a2a12";
  const limeAccent = "#bef264";

  return (
    <group scale={scale}>
      {/* --- TOP LAYER: GRASS PLATEAU --- */}
      {/* Central main grass slab */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.45, 4.2]} />
        <meshStandardMaterial color={grassTopColor} roughness={0.7} />
      </mesh>

      {/* Grass fringe tabs dripping over sides (Minecraft style stepped edge) */}
      <mesh position={[0, -0.28, 2.12]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.22, 0.12]} />
        <meshStandardMaterial color={grassSideColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.28, -2.12]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.22, 0.12]} />
        <meshStandardMaterial color={grassSideColor} roughness={0.8} />
      </mesh>
      <mesh position={[2.12, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.22, 3.2]} />
        <meshStandardMaterial color={grassSideColor} roughness={0.8} />
      </mesh>
      <mesh position={[-2.12, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.22, 3.4]} />
        <meshStandardMaterial color={grassSideColor} roughness={0.8} />
      </mesh>

      {/* Tiny grass sprout voxels on top */}
      <mesh position={[-1.4, 0.32, 1.3]} castShadow>
        <boxGeometry args={[0.18, 0.24, 0.18]} />
        <meshStandardMaterial color="#4d9419" roughness={0.7} />
      </mesh>
      <mesh position={[1.5, 0.32, -1.2]} castShadow>
        <boxGeometry args={[0.16, 0.22, 0.16]} />
        <meshStandardMaterial color="#4d9419" roughness={0.7} />
      </mesh>
      <mesh position={[1.6, 0.3, 1.1]} castShadow>
        <boxGeometry args={[0.18, 0.2, 0.18]} />
        <meshStandardMaterial color="#4d9419" roughness={0.7} />
      </mesh>
      <mesh position={[-1.6, 0.3, -1.4]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial color="#4d9419" roughness={0.7} />
      </mesh>

      {/* --- MIDDLE LAYER: DIRT FOUNDATION STEP 1 --- */}
      <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 0.5, 3.9]} />
        <meshStandardMaterial color={dirtLight} roughness={0.9} />
      </mesh>

      {/* Irregular dirt voxels on step 1 */}
      <mesh position={[1.9, -0.45, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.4, 1.2]} />
        <meshStandardMaterial color={dirtMed} roughness={0.9} />
      </mesh>
      <mesh position={[-1.9, -0.45, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.4, 1.4]} />
        <meshStandardMaterial color={dirtMed} roughness={0.9} />
      </mesh>

      {/* --- LAYER 2: DIRT STEP 2 --- */}
      <mesh position={[0, -0.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 0.5, 3.1]} />
        <meshStandardMaterial color={dirtMed} roughness={0.9} />
      </mesh>

      {/* --- LAYER 3: DIRT STEP 3 --- */}
      <mesh position={[0, -1.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.48, 2.2]} />
        <meshStandardMaterial color={dirtDark} roughness={0.9} />
      </mesh>

      {/* --- LAYER 4: STALACTITE TIP --- */}
      <mesh position={[0, -1.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.44, 1.3]} />
        <meshStandardMaterial color={dirtTip} roughness={0.95} />
      </mesh>
      <mesh position={[0, -2.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.35, 0.65]} />
        <meshStandardMaterial color={dirtTip} roughness={0.95} />
      </mesh>

      {/* Builder special: Glowing neon-lime underglow rim & point light */}
      {isBuilder && (
        <>
          {/* Lime trim under grass rim */}
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[4.28, 0.08, 4.28]} />
            <meshStandardMaterial
              color={limeAccent}
              emissive={limeAccent}
              emissiveIntensity={isHovered ? 1.4 : 0.8}
              roughness={0.4}
            />
          </mesh>

          {/* Under-island neon-green point light aura */}
          <pointLight
            position={[0, -1.6, 0]}
            color="#a3e635"
            intensity={isHovered ? 4.5 : 2.8}
            distance={5.5}
            decay={2}
          />
        </>
      )}

      {/* General hover glow if hovered */}
      {isHovered && !isBuilder && (
        <pointLight
          position={[0, -1.2, 0]}
          color="#bef264"
          intensity={2.2}
          distance={4.2}
          decay={2}
        />
      )}

      {/* --- DETACHED FLOATING ORBIT VOXELS --- */}
      <mesh ref={floatingBlock1} position={[2.6, 0.5, 1.8]} castShadow>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshStandardMaterial
          color={isBuilder ? limeAccent : "#80d62c"}
          emissive={isBuilder ? limeAccent : "#000000"}
          emissiveIntensity={isBuilder ? 0.5 : 0}
          roughness={0.7}
        />
      </mesh>

      <mesh ref={floatingBlock2} position={[-2.7, -0.5, 1.5]} castShadow>
        <boxGeometry args={[0.26, 0.26, 0.26]} />
        <meshStandardMaterial color={dirtMed} roughness={0.9} />
      </mesh>

      <mesh ref={floatingBlock3} position={[-2.4, 0.2, -2.2]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color={isBuilder ? "#a3e635" : "#6ebb2f"}
          emissive={isBuilder ? "#a3e635" : "#000000"}
          emissiveIntensity={isBuilder ? 0.4 : 0}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
