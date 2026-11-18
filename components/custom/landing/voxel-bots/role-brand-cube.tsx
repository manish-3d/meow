"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { siGithub, siGoogle, siNotion, siInstagram } from "simple-icons";

export type RoleBrandType = "github" | "google" | "notion" | "instagram" | "code";

interface RoleBrandCubeProps {
  brand: RoleBrandType;
  position: [number, number, number];
  size?: number;
  phase?: number;
  isHovered?: boolean;
}

function createRoleBrandTexture(brand: RoleBrandType): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 256, 256);

  // Rounded cube face border & background
  const r = 44;
  ctx.beginPath();
  ctx.roundRect(12, 12, 232, 232, r);

  if (brand === "instagram") {
    // Instagram gradient background
    const grad = ctx.createLinearGradient(16, 240, 240, 16);
    grad.addColorStop(0, "#feda75");
    grad.addColorStop(0.25, "#fa7e1e");
    grad.addColorStop(0.5, "#d62976");
    grad.addColorStop(0.75, "#962fbf");
    grad.addColorStop(1, "#4f5bd5");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.stroke();

    // White Instagram camera icon
    ctx.save();
    ctx.translate(128, 128);
    const scale = 146 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fillStyle = "#ffffff";
    ctx.fill(new Path2D(siInstagram.path));
    ctx.restore();
  } else if (brand === "github") {
    // Crisp white cube with GitHub Octocat
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#e4e4e7";
    ctx.stroke();

    ctx.save();
    ctx.translate(128, 128);
    const scale = 144 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fillStyle = "#18181b";
    ctx.fill(new Path2D(siGithub.path));
    ctx.restore();
  } else if (brand === "google") {
    // Clean white cube with Google G logo
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#e4e4e7";
    ctx.stroke();

    ctx.save();
    ctx.translate(128, 128);
    const scale = 140 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fillStyle = "#4285F4"; // Google Brand Blue
    ctx.fill(new Path2D(siGoogle.path));
    ctx.restore();
  } else if (brand === "notion") {
    // Clean white cube with Notion 'N' logo
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#e4e4e7";
    ctx.stroke();

    ctx.save();
    ctx.translate(128, 128);
    const scale = 142 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fillStyle = "#000000";
    ctx.fill(new Path2D(siNotion.path));
    ctx.restore();
  } else if (brand === "code") {
    // Vibrant Lime Code Cube with </>
    ctx.fillStyle = "#bef264";
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#84cc16";
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 96px monospace, system-ui, sans-serif";
    ctx.fillStyle = "#09090b";
    ctx.fillText("</>", 128, 134);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function RoleBrandCube({
  brand,
  position,
  size = 0.42,
  phase = 0,
  isHovered = false,
}: RoleBrandCubeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => createRoleBrandTexture(brand), [brand]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // Organic floating bobbing beside each bot
    const idleBob = Math.sin(t * 2.2 + phase) * 0.08;
    const hoverLift = isHovered ? 0.12 : 0;
    meshRef.current.position.y = position[1] + idleBob + hoverLift;
    meshRef.current.position.x = position[0] + Math.cos(t * 1.5 + phase) * 0.04;
    meshRef.current.position.z = position[2] + Math.sin(t * 1.2 + phase) * 0.03;

    // Smooth continuous 3D rotation
    meshRef.current.rotation.y = t * 0.6 + phase * 0.5;
    meshRef.current.rotation.x = Math.sin(t * 0.9 + phase) * 0.14;
  });

  const materials = useMemo(() => {
    if (!texture) {
      return new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 });
    }

    const faceMat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    // Same brand logo mapped to all 6 faces so it is visible from every angle
    return [faceMat, faceMat, faceMat, faceMat, faceMat, faceMat];
  }, [texture]);

  // Subtle accent light color
  const lightColor = useMemo(() => {
    switch (brand) {
      case "github":
        return "#ffffff";
      case "google":
        return "#60a5fa";
      case "notion":
        return "#e2e8f0";
      case "instagram":
        return "#f43f5e";
      case "code":
        return "#bef264";
      default:
        return "#ffffff";
    }
  }, [brand]);

  return (
    <group ref={meshRef} position={position}>
      {/* 3D Cute Small Brand Cube */}
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[size, size, size]} />
      </mesh>

      {/* Wireframe border edge for Minecraft voxel style */}
      <mesh>
        <boxGeometry args={[size * 1.015, size * 1.015, size * 1.015]} />
        <meshBasicMaterial
          color={brand === "code" ? "#a3e635" : "#e4e4e7"}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Gentle local point light for floating ambience */}
      <pointLight
        color={lightColor}
        intensity={isHovered ? 1.6 : 0.8}
        distance={2.2}
        decay={2}
      />
    </group>
  );
}
