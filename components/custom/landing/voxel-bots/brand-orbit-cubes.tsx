"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { siGithub, siInstagram, siX, siYoutube } from "simple-icons";

// Official Slack SVG path segments
const SLACK_PATHS = [
  { fill: "#36C5F0", d: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" },
  { fill: "#2EB67D", d: "M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" },
  { fill: "#ECB22E", d: "M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" },
  { fill: "#E01E5A", d: "M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" },
];

type BrandType = "github" | "instagram" | "x" | "youtube" | "slack";

function createBrandFaceTexture(brand: BrandType): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 512, 512);

  // Rounded cube face background
  const r = 100;
  ctx.beginPath();
  ctx.roundRect(20, 20, 472, 472, r);

  if (brand === "instagram") {
    const grad = ctx.createLinearGradient(32, 480, 480, 32);
    grad.addColorStop(0, "#feda75");
    grad.addColorStop(0.25, "#fa7e1e");
    grad.addColorStop(0.5, "#d62976");
    grad.addColorStop(0.75, "#962fbf");
    grad.addColorStop(1, "#4f5bd5");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.stroke();

    // White Instagram camera icon
    ctx.save();
    ctx.translate(256, 256);
    const scale = 296 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fillStyle = "#ffffff";
    ctx.fill(new Path2D(siInstagram.path));
    ctx.restore();
  } else if (brand === "x") {
    ctx.fillStyle = "#111113";
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#27272a";
    ctx.stroke();

    // Crisp white X mark
    ctx.save();
    ctx.translate(256, 256);
    const scale = 280 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fillStyle = "#ffffff";
    ctx.fill(new Path2D(siX.path));
    ctx.restore();
  } else if (brand === "github") {
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#e4e4e7";
    ctx.stroke();

    // Black GitHub Octocat mark
    ctx.save();
    ctx.translate(256, 256);
    const scale = 292 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fillStyle = "#18181b";
    ctx.fill(new Path2D(siGithub.path));
    ctx.restore();
  } else if (brand === "youtube") {
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#e4e4e7";
    ctx.stroke();

    // Red YouTube Play button
    ctx.save();
    ctx.translate(256, 256);
    const scale = 304 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fillStyle = "#FF0000";
    ctx.fill(new Path2D(siYoutube.path));
    ctx.restore();
  } else if (brand === "slack") {
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#e4e4e7";
    ctx.stroke();

    // 4-Color Slack hashtag
    ctx.save();
    ctx.translate(256, 256);
    const scale = 288 / 24;
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    SLACK_PATHS.forEach(({ fill, d }) => {
      ctx.fillStyle = fill;
      ctx.fill(new Path2D(d));
    });
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

interface SingleBrandCubeProps {
  brand: BrandType;
  basePosition: [number, number, number];
  phase: number;
}

function SingleBrandCube({ brand, basePosition, phase }: SingleBrandCubeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => createBrandFaceTexture(brand), [brand]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // Organic floating bobbing
    meshRef.current.position.y = basePosition[1] + Math.sin(t * 1.8 + phase) * 0.12;
    meshRef.current.position.x = basePosition[0] + Math.cos(t * 1.2 + phase) * 0.08;
    meshRef.current.position.z = basePosition[2] + Math.sin(t * 1.5 + phase) * 0.06;

    // 3D rotation catching light
    meshRef.current.rotation.y = t * 0.35 + phase * 0.7;
    meshRef.current.rotation.x = Math.sin(t * 0.8 + phase) * 0.12;
  });

  const materials = useMemo(() => {
    if (!texture) {
      return new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 });
    }

    const faceMat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    // Materials array for all 6 box faces so logo is visible from every angle
    return [faceMat, faceMat, faceMat, faceMat, faceMat, faceMat];
  }, [texture]);

  return (
    <group ref={meshRef} position={basePosition}>
      {/* 3D Brand Logo Cube */}
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[0.92, 0.92, 0.92]} />
      </mesh>

      {/* Subtle outer glow / halo */}
      <pointLight
        color={
          brand === "instagram"
            ? "#d946ef"
            : brand === "youtube"
            ? "#f87171"
            : brand === "x"
            ? "#a1a1aa"
            : brand === "slack"
            ? "#38bdf8"
            : "#a3e635"
        }
        intensity={0.7}
        distance={2.4}
      />
    </group>
  );
}

export function BrandOrbitCubes() {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      // Gentle shimmer pulse on the orbital ring
      ringRef.current.rotation.z = t * 0.08;
    }
  });

  // Elliptical ring curve matching reference image
  const ringCurve = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,            // ax, aY
      4.8, 1.85,       // xRadius, yRadius
      0, 2 * Math.PI,  // aStartAngle, aEndAngle
      false,           // aClockwise
      0                // aRotation
    );
    const points = curve.getPoints(64).map(p => new THREE.Vector3(p.x, 0, p.y));
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  return (
    <group ref={orbitGroupRef} position={[0, 3.4, 0.3]} rotation={[0.22, 0, 0]}>
      {/* --- ORBITAL LIGHT RING (Soft lavender/purple trail encircling the Builder) --- */}
      <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.8, 0.04, 8, 80]} />
        <meshBasicMaterial
          color="#d8b4fe"
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Inner accent ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.76, 0.015, 6, 60]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* --- THE 5 FLOATING BRAND LOGO CUBES --- */}
      {/* 1. GitHub (Far Left) */}
      <SingleBrandCube
        brand="github"
        basePosition={[-4.3, -0.15, 0.4]}
        phase={0}
      />

      {/* 2. Instagram (Mid Left) */}
      <SingleBrandCube
        brand="instagram"
        basePosition={[-2.4, 0.35, -0.9]}
        phase={1.2}
      />

      {/* 3. X (Top Center) */}
      <SingleBrandCube
        brand="x"
        basePosition={[0, 0.55, -1.6]}
        phase={2.4}
      />

      {/* 4. YouTube (Mid Right) */}
      <SingleBrandCube
        brand="youtube"
        basePosition={[2.4, 0.35, -0.9]}
        phase={3.6}
      />

      {/* 5. Slack (Far Right) */}
      <SingleBrandCube
        brand="slack"
        basePosition={[4.3, -0.15, 0.4]}
        phase={4.8}
      />

      {/* Ambient floating voxel specks in the orbital stream */}
      <mesh position={[-3.3, 0.2, -0.4]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshBasicMaterial color="#bef264" />
      </mesh>
      <mesh position={[3.3, 0.2, -0.4]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshBasicMaterial color="#e9d5ff" />
      </mesh>
      <mesh position={[-1.2, 0.45, -1.3]}>
        <boxGeometry args={[0.09, 0.09, 0.09]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1.2, 0.45, -1.3]}>
        <boxGeometry args={[0.09, 0.09, 0.09]} />
        <meshBasicMaterial color="#bef264" />
      </mesh>
    </group>
  );
}
