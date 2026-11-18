"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { VoxelIsland } from "./voxel-island";
import { VoxelCat } from "./voxel-cat";
import {
  CodingBotProps,
  CodingBotVisor,
  ResearcherProps,
  ResearcherGlasses,
  BuilderProps,
  BuilderHeadphones,
  WriterProps,
  SocialMediaBotHeadGear,
  SocialMediaBotProps,
} from "./bot-props";
import { BrandOrbitCubes } from "./brand-orbit-cubes";

interface VoxelBotsCanvasProps {
  activeIndex: number;
  onSelectBot: (index: number) => void;
  hoveredIndex: number | null;
  onHoverBot: (index: number | null) => void;
}

// Generate crisp Minecraft-style block sign texture matching reference image
function useSignTexture(label: string, icon: string, isBuilder: boolean, isHighlighted: boolean) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 1024, 256);

    // Pill block rounded rectangle
    const r = 72;
    ctx.beginPath();
    ctx.roundRect(20, 20, 984, 216, r);

    if (isBuilder) {
      ctx.fillStyle = "#bef264";
      ctx.fill();
      ctx.lineWidth = 16;
      ctx.strokeStyle = "#84cc16";
      ctx.stroke();
    } else {
      ctx.fillStyle = isHighlighted ? "#ffffff" : "#fbfbfb";
      ctx.fill();
      ctx.lineWidth = 12;
      ctx.strokeStyle = isHighlighted ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.15)";
      ctx.stroke();
    }

    // Text & Icon in Minecraft Monospace style
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fontSize = label.length > 13 ? 76 : (isBuilder ? 96 : 88);
    ctx.font = `bold ${fontSize}px monospace, system-ui, sans-serif`;
    ctx.fillStyle = isBuilder ? "#09090b" : "#18181b";
    ctx.fillText(`${icon}  ${label}`, 512, 130);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }, [label, icon, isBuilder, isHighlighted]);
}

// Single Island Anchor with smooth physics, bobbing, and Minecraft-style block sign
function BotIslandAnchor({
  index,
  basePosition,
  scale = 1,
  label,
  icon,
  isBuilder = false,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  children,
}: {
  index: number;
  basePosition: [number, number, number];
  scale?: number;
  label: string;
  icon: string;
  isBuilder?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const currentY = useRef(basePosition[1]);
  const currentScale = useRef(scale);

  const signTexture = useSignTexture(label, icon, isBuilder, isHovered || isSelected);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Phase offset so each island bobs with its own unique cadence
    const phase = index * 1.35;
    const idleBob = Math.sin(t * 1.8 + phase) * 0.1;

    // Hover / Selected lift target
    const targetLift = (isHovered || isSelected) ? 0.35 : 0;
    const targetScale = (isHovered || isSelected) ? scale * 1.05 : scale;

    // Lerp to target position and scale
    currentY.current = THREE.MathUtils.lerp(currentY.current, basePosition[1] + idleBob + targetLift, 0.1);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);

    groupRef.current.position.y = currentY.current;
    groupRef.current.position.x = basePosition[0];
    groupRef.current.position.z = basePosition[2];
    groupRef.current.scale.setScalar(currentScale.current);

    // Subtle rotation tilt
    groupRef.current.rotation.y = Math.sin(t * 0.8 + phase) * 0.03;
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

      {/* 3D Physical Voxel Sign Plate mounted directly on the front cliff face of the island block */}
      <mesh position={[0, -0.32, 2.18]} castShadow receiveShadow>
        <boxGeometry args={[2.7, 0.68, 0.08]} />
        <meshStandardMaterial
          color={isBuilder ? "#bef264" : "#ffffff"}
          emissive={isBuilder ? "#a3e635" : "#000000"}
          emissiveIntensity={isBuilder ? 0.6 : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Minecraft-Style Sign Face mounted on the block */}
      {signTexture && (
        <mesh position={[0, -0.32, 2.24]}>
          <planeGeometry args={[2.64, 0.65]} />
          <meshBasicMaterial
            map={signTexture}
            transparent
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Contact Shadow disc on bottom plane */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2 * scale, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={(isHovered || isSelected) ? 0.16 : 0.08}
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
      const botXPositions = [-10.8, -5.4, 0, 5.4, 10.8];
      const targetX = botXPositions[activeIndex] || 0;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.4, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 14.5, 0.08);
      camera.lookAt(targetX, 1.2, 0);
    } else if (isTablet) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.8, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 21.0, 0.08);
      camera.lookAt(0, 1.2, 0);
    } else {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.6, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 18.5, 0.08);
      camera.lookAt(0, 1.15, 0);
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
  return (
    <div className="relative w-full h-[440px] sm:h-[500px] lg:h-[540px] select-none">
      <Canvas
        shadows
        camera={{ position: [0, 3.6, 18.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ResponsiveCameraController activeIndex={activeIndex} />

        {/* --- LIGHTING (Soft Minecraft-Style Studio Ambient) --- */}
        <ambientLight intensity={1.4} />
        <hemisphereLight args={["#ffffff", "#f4f4f5", 0.9]} />

        {/* Main Key Sun Light */}
        <directionalLight
          position={[14, 24, 18]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={45}
          shadow-camera-left={-18}
          shadow-camera-right={18}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0001}
        />

        {/* Fill / Rim Light */}
        <directionalLight position={[-16, 12, -8]} intensity={0.7} color="#d9f99d" />
        <directionalLight position={[0, -10, 10]} intensity={0.3} color="#ffffff" />

        {/* --- FLOOR GRID PLANE (Soft grid as seen in Reference Image) --- */}
        <group position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <gridHelper
            args={[44, 44, 0xe4e4e7, 0xf4f4f5]}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>

        {/* --- FLOATING 3D BRAND LOGO ORBIT CUBES (GitHub, Instagram, X, YouTube, Slack) --- */}
        <BrandOrbitCubes />

        {/* --- 1. CODING BOT ISLAND (Far Left: x = -10.8, enlarged scale = 0.92) --- */}
        <BotIslandAnchor
          index={0}
          basePosition={[-10.8, 0.6, -0.4]}
          scale={0.92}
          label="Coding Bot"
          icon="</>"
          isSelected={activeIndex === 0}
          isHovered={hoveredIndex === 0}
          onSelect={() => onSelectBot(0)}
          onHover={(h) => onHoverBot(h ? 0 : null)}
        >
          <VoxelCat
            isHovered={hoveredIndex === 0 || activeIndex === 0}
            customHeadGear={<CodingBotVisor />}
          >
            <CodingBotProps isHovered={hoveredIndex === 0 || activeIndex === 0} />
          </VoxelCat>
        </BotIslandAnchor>

        {/* --- 2. RESEARCH BOT ISLAND (Mid Left: x = -5.4, enlarged scale = 0.92) --- */}
        <BotIslandAnchor
          index={1}
          basePosition={[-5.4, 0.85, 0.0]}
          scale={0.92}
          label="Research Bot"
          icon="🔍"
          isSelected={activeIndex === 1}
          isHovered={hoveredIndex === 1}
          onSelect={() => onSelectBot(1)}
          onHover={(h) => onHoverBot(h ? 1 : null)}
        >
          <VoxelCat
            isHovered={hoveredIndex === 1 || activeIndex === 1}
            customHeadGear={<ResearcherGlasses />}
          >
            <ResearcherProps isHovered={hoveredIndex === 1 || activeIndex === 1} />
          </VoxelCat>
        </BotIslandAnchor>

        {/* --- 3. AGENT BUILDER ISLAND (Centerpiece Elevated: x = 0, y = 1.35, enlarged scale = 1.15) --- */}
        <BotIslandAnchor
          index={2}
          basePosition={[0, 1.35, 0.6]}
          scale={1.15}
          label="Agent Builder"
          icon="📦"
          isBuilder
          isSelected={activeIndex === 2}
          isHovered={hoveredIndex === 2}
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

        {/* --- 4. NOTES BOT ISLAND (Mid Right: x = 5.4, enlarged scale = 0.92) --- */}
        <BotIslandAnchor
          index={3}
          basePosition={[5.4, 0.85, 0.0]}
          scale={0.92}
          label="Notes Bot"
          icon="📄"
          isSelected={activeIndex === 3}
          isHovered={hoveredIndex === 3}
          onSelect={() => onSelectBot(3)}
          onHover={(h) => onHoverBot(h ? 3 : null)}
        >
          <VoxelCat isHovered={hoveredIndex === 3 || activeIndex === 3}>
            <WriterProps isHovered={hoveredIndex === 3 || activeIndex === 3} />
          </VoxelCat>
        </BotIslandAnchor>

        {/* --- 5. SOCIAL MEDIA BOT ISLAND (Far Right: x = 10.8, enlarged scale = 0.92) --- */}
        <BotIslandAnchor
          index={4}
          basePosition={[10.8, 0.6, -0.4]}
          scale={0.92}
          label="Social Media Bot"
          icon="📢"
          isSelected={activeIndex === 4}
          isHovered={hoveredIndex === 4}
          onSelect={() => onSelectBot(4)}
          onHover={(h) => onHoverBot(h ? 4 : null)}
        >
          <VoxelCat
            isHovered={hoveredIndex === 4 || activeIndex === 4}
            customHeadGear={<SocialMediaBotHeadGear />}
          >
            <SocialMediaBotProps isHovered={hoveredIndex === 4 || activeIndex === 4} />
          </VoxelCat>
        </BotIslandAnchor>
      </Canvas>
    </div>
  );
}
