"use client";

import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { VoxelIsland } from "./voxel-island";
import { VoxelCat } from "./voxel-cat";
import {
  ResearcherProps,
  ResearcherGlasses,
  BrowserProps,
  BuilderProps,
  BuilderHeadphones,
  OperatorProps,
  CreatorProps,
} from "./bot-props";

interface VoxelBotsCanvasProps {
  activeIndex: number;
  onSelectBot: (index: number) => void;
  hoveredIndex: number | null;
  onHoverBot: (index: number | null) => void;
}

// Single Island Anchor with smooth physics & bobbing
function BotIslandAnchor({
  index,
  basePosition,
  scale = 1,
  isBuilder = false,
  isSelected = false,
  isHovered = false,
  isAnyHovered = false,
  onSelect,
  onHover,
  children,
}: {
  index: number;
  basePosition: [number, number, number];
  scale?: number;
  isBuilder?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  isAnyHovered?: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const currentY = useRef(basePosition[1]);
  const currentScale = useRef(scale);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Phase offset so each island bobs with its own unique cadence
    const phase = index * 1.35;
    const idleBob = Math.sin(t * 1.8 + phase) * 0.12;

    // Hover / Selected lift target
    const targetLift = (isHovered || isSelected) ? 0.45 : 0;
    const targetScale = (isHovered || isSelected) ? scale * 1.06 : scale;

    // Lerp to target position and scale
    currentY.current = THREE.MathUtils.lerp(currentY.current, basePosition[1] + idleBob + targetLift, 0.1);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);

    groupRef.current.position.y = currentY.current;
    groupRef.current.position.x = basePosition[0];
    groupRef.current.position.z = basePosition[2];
    groupRef.current.scale.setScalar(currentScale.current);

    // Subtle rotation tilt
    groupRef.current.rotation.y = Math.sin(t * 0.8 + phase) * 0.04;
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        onHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Voxel Island Ground Foundation */}
      <VoxelIsland isBuilder={isBuilder} isHovered={isHovered || isSelected} />

      {/* Cat Character & Props */}
      {children}

      {/* Contact Shadow disc on bottom plane */}
      <mesh position={[0, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2 * scale, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={(isHovered || isSelected) ? 0.18 : 0.09}
        />
      </mesh>
    </group>
  );
}

// Camera controller that adapts to screen width and focuses active bot on mobile
function ResponsiveCameraController({ activeIndex }: { activeIndex: number }) {
  const { camera, size } = useThree();

  useFrame(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    if (isMobile) {
      // On mobile, focus camera on the active bot's X coordinate
      const botXPositions = [-9.8, -4.9, 0, 4.9, 9.8];
      const targetX = botXPositions[activeIndex] || 0;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.0, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 14.5, 0.08);
      camera.lookAt(targetX, 0.4, 0);
    } else if (isTablet) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.8, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 20.0, 0.08);
      camera.lookAt(0, 0.3, 0);
    } else {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.4, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 17.5, 0.08);
      camera.lookAt(0, 0.3, 0);
    }
  });

  return null;
}

export function VoxelBotsCanvas({
  activeIndex,
  onSelectBot,
  hoveredIndex,
  onHoverBot,
}: VoxelBotsCanvasProps) {
  const isAnyHovered = hoveredIndex !== null;

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] select-none">
      <Canvas
        shadows
        camera={{ position: [0, 3.4, 17.5], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ResponsiveCameraController activeIndex={activeIndex} />

        {/* --- LIGHTING (Soft Minecraft-Style Studio Ambient) --- */}
        <ambientLight intensity={1.35} />
        <hemisphereLight args={["#ffffff", "#f4f4f5", 0.9]} />

        {/* Main Key Sun Light */}
        <directionalLight
          position={[14, 24, 18]}
          intensity={2.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={42}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0001}
        />

        {/* Fill / Rim Light */}
        <directionalLight position={[-16, 12, -8]} intensity={0.7} color="#d9f99d" />
        <directionalLight position={[0, -10, 10]} intensity={0.3} color="#ffffff" />

        {/* --- FLOOR GRID PLANE (Soft grid as seen in Reference Image 1) --- */}
        <group position={[0, -3.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <gridHelper
            args={[42, 42, 0xe4e4e7, 0xf4f4f5]}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>

        {/* --- 1. RESEARCHER ISLAND (Far Left) --- */}
        <BotIslandAnchor
          index={0}
          basePosition={[-9.8, -0.05, -0.8]}
          scale={0.96}
          isSelected={activeIndex === 0}
          isHovered={hoveredIndex === 0}
          isAnyHovered={isAnyHovered}
          onSelect={() => onSelectBot(0)}
          onHover={(h) => onHoverBot(h ? 0 : null)}
        >
          <VoxelCat
            isHovered={hoveredIndex === 0 || activeIndex === 0}
            customHeadGear={<ResearcherGlasses />}
          >
            <ResearcherProps isHovered={hoveredIndex === 0 || activeIndex === 0} />
          </VoxelCat>
        </BotIslandAnchor>

        {/* --- 2. BROWSER ISLAND (Mid Left) --- */}
        <BotIslandAnchor
          index={1}
          basePosition={[-4.9, 0.15, 0.1]}
          scale={0.98}
          isSelected={activeIndex === 1}
          isHovered={hoveredIndex === 1}
          isAnyHovered={isAnyHovered}
          onSelect={() => onSelectBot(1)}
          onHover={(h) => onHoverBot(h ? 1 : null)}
        >
          <VoxelCat isHovered={hoveredIndex === 1 || activeIndex === 1}>
            <BrowserProps isHovered={hoveredIndex === 1 || activeIndex === 1} />
          </VoxelCat>
        </BotIslandAnchor>

        {/* --- 3. BUILDER ISLAND (Centerpiece, 1.18x Scale) --- */}
        <BotIslandAnchor
          index={2}
          basePosition={[0, 0.55, 0.85]}
          scale={1.18}
          isBuilder
          isSelected={activeIndex === 2}
          isHovered={hoveredIndex === 2}
          isAnyHovered={isAnyHovered}
          onSelect={() => onSelectBot(2)}
          onHover={(h) => onHoverBot(h ? 2 : null)}
        >
          <VoxelCat
            isHovered={hoveredIndex === 2 || activeIndex === 2}
            customHeadGear={<BuilderHeadphones />}
          >
            <BuilderProps isHovered={hoveredIndex === 2 || activeIndex === 2} />
          </VoxelCat>
        </BotIslandAnchor>

        {/* --- 4. OPERATOR ISLAND (Mid Right) --- */}
        <BotIslandAnchor
          index={3}
          basePosition={[4.9, 0.15, 0.1]}
          scale={0.98}
          isSelected={activeIndex === 3}
          isHovered={hoveredIndex === 3}
          isAnyHovered={isAnyHovered}
          onSelect={() => onSelectBot(3)}
          onHover={(h) => onHoverBot(h ? 3 : null)}
        >
          <VoxelCat isHovered={hoveredIndex === 3 || activeIndex === 3}>
            <OperatorProps isHovered={hoveredIndex === 3 || activeIndex === 3} />
          </VoxelCat>
        </BotIslandAnchor>

        {/* --- 5. CREATOR ISLAND (Far Right) --- */}
        <BotIslandAnchor
          index={4}
          basePosition={[9.8, -0.05, -0.8]}
          scale={0.96}
          isSelected={activeIndex === 4}
          isHovered={hoveredIndex === 4}
          isAnyHovered={isAnyHovered}
          onSelect={() => onSelectBot(4)}
          onHover={(h) => onHoverBot(h ? 4 : null)}
        >
          <VoxelCat isHovered={hoveredIndex === 4 || activeIndex === 4}>
            <CreatorProps isHovered={hoveredIndex === 4 || activeIndex === 4} />
          </VoxelCat>
        </BotIslandAnchor>
      </Canvas>
    </div>
  );
}
