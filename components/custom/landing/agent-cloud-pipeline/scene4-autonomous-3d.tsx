"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

function VoxelCatAutonomous() {
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.8) * 0.08;
      headRef.current.position.y = 0.85 + Math.sin(t * 2.2) * 0.02;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 3.5) * 0.18;
    }
  });

  return (
    <group position={[0, 0.22, 0]}>
      {/* ── Cat Body ── */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.85, 0.78, 0.75]} />
        <meshStandardMaterial color="#ffffff" roughness={0.65} />
      </mesh>
      {/* Orange Back Patch */}
      <mesh position={[0.26, 0.48, -0.08]} castShadow>
        <boxGeometry args={[0.32, 0.45, 0.52]} />
        <meshStandardMaterial color="#f97316" roughness={0.65} />
      </mesh>
      {/* Paws */}
      <mesh position={[-0.24, 0.14, 0.38]} castShadow>
        <boxGeometry args={[0.2, 0.22, 0.26]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.24, 0.14, 0.38]} castShadow>
        <boxGeometry args={[0.2, 0.22, 0.26]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Tail */}
      <group position={[0, 0.32, -0.4]}>
        <mesh ref={tailRef} position={[0, 0.25, -0.12]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.16]} />
          <meshStandardMaterial color="#f97316" roughness={0.65} />
        </mesh>
      </group>

      {/* ── Cat Head ── */}
      <group ref={headRef} position={[0, 0.85, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.02, 0.88, 0.88]} />
          <meshStandardMaterial color="#ffffff" roughness={0.65} />
        </mesh>
        {/* Calico Patch on Head */}
        <mesh position={[0.3, 0.2, 0.08]} castShadow>
          <boxGeometry args={[0.42, 0.5, 0.72]} />
          <meshStandardMaterial color="#f97316" roughness={0.65} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.34, 0.54, 0]} castShadow>
          <boxGeometry args={[0.24, 0.28, 0.24]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.34, 0.52, 0.08]}>
          <boxGeometry args={[0.16, 0.2, 0.08]} />
          <meshStandardMaterial color="#fca5a5" />
        </mesh>
        <mesh position={[0.34, 0.54, 0]} castShadow>
          <boxGeometry args={[0.24, 0.28, 0.24]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        <mesh position={[0.34, 0.52, 0.08]}>
          <boxGeometry args={[0.16, 0.2, 0.08]} />
          <meshStandardMaterial color="#fca5a5" />
        </mesh>
        {/* Eyes (Happy Curved Eyes) */}
        <mesh position={[-0.24, 0.04, 0.45]}>
          <boxGeometry args={[0.16, 0.04, 0.02]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        <mesh position={[0.24, 0.04, 0.45]}>
          <boxGeometry args={[0.16, 0.04, 0.02]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.06, 0.46]}>
          <boxGeometry args={[0.08, 0.06, 0.03]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        {/* Lime Green Headphones */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.16, 0.12, 0.26]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        <mesh position={[-0.56, 0.06, 0]} castShadow>
          <boxGeometry args={[0.16, 0.48, 0.44]} />
          <meshStandardMaterial color="#84cc16" roughness={0.3} />
        </mesh>
        <mesh position={[0.56, 0.06, 0]} castShadow>
          <boxGeometry args={[0.16, 0.48, 0.44]} />
          <meshStandardMaterial color="#84cc16" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function FloatingBrowserWindow() {
  const browserTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Window chrome header
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 512, 360);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 512, 48);

    // 3 window buttons
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(24, 24, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.arc(46, 24, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#84cc16";
    ctx.beginPath(); ctx.arc(68, 24, 7, 0, Math.PI * 2); ctx.fill();

    // URL bar
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(96, 12, 320, 24);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.fillText("app.meowbot.ai/agent/live", 106, 28);

    // Content cards inside browser
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(20, 64, 472, 120);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(36, 80, 140, 16);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(36, 108, 380, 10);
    ctx.fillRect(36, 126, 320, 10);
    ctx.fillRect(36, 144, 260, 10);

    // Data table / metrics bars
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(20, 200, 472, 140);
    ctx.fillStyle = "#84cc16";
    ctx.fillRect(36, 220, 80, 14);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(130, 220, 110, 14);
    ctx.fillStyle = "#f472b6";
    ctx.fillRect(254, 220, 90, 14);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <group position={[1.5, 1.3, -0.3]} rotation={[-0.1, -0.4, 0.05]}>
      {/* Window Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.3, 1.6, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Screen Surface */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.24, 1.54]} />
        {browserTexture ? (
          <meshBasicMaterial map={browserTexture} />
        ) : (
          <meshBasicMaterial color="#f8fafc" />
        )}
      </mesh>
    </group>
  );
}

function FloatingCodeWindow() {
  return (
    <group position={[-1.4, 1.25, -0.4]} rotation={[0.08, 0.35, -0.04]}>
      {/* Window Frame */}
      <mesh castShadow>
        <boxGeometry args={[1.7, 1.3, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
      {/* Screen Surface */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.64, 1.24]} />
        <meshBasicMaterial color="#090d16" />
      </mesh>
      {/* Code Lines */}
      {[-0.38, -0.22, -0.06, 0.1, 0.26, 0.42].map((yOffset, i) => (
        <group key={i} position={[-0.65, yOffset, 0.05]}>
          <mesh position={[0.25, 0, 0]}>
            <boxGeometry args={[i % 2 === 0 ? 0.6 : 0.85, 0.04, 0.01]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#84cc16" : "#38bdf8"} />
          </mesh>
          <mesh position={[0.85, 0, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.01]} />
            <meshBasicMaterial color="#f472b6" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DigitalWaterfalls() {
  const streamRef1 = useRef<THREE.Group>(null);
  const streamRef2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (streamRef1.current) {
      streamRef1.current.position.y = -0.5 + Math.sin(t * 4) * 0.05;
    }
    if (streamRef2.current) {
      streamRef2.current.position.y = -0.5 + Math.cos(t * 4) * 0.05;
    }
  });

  return (
    <>
      {/* Left Digital Waterfall */}
      <group ref={streamRef1} position={[-1.75, -0.5, 0.8]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 1.1, 0.12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            transparent
            opacity={0.75}
            roughness={0.2}
          />
        </mesh>
        {/* Digital Bit Voxels */}
        <mesh position={[-0.1, -0.4, 0.1]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, -0.25, 0.1]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#bef264" />
        </mesh>
      </group>

      {/* Right Digital Waterfall */}
      <group ref={streamRef2} position={[1.75, -0.5, 0.8]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 1.1, 0.12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            transparent
            opacity={0.75}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.1, -0.38, 0.1]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.12, -0.2, 0.1]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#bef264" />
        </mesh>
      </group>
    </>
  );
}

function VoxelTrees() {
  return (
    <>
      {/* Tree 1: Left */}
      <group position={[-1.7, 0.25, -1.3]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.75, 0.55, 0.75]} />
          <meshStandardMaterial color="#84cc16" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.45, 0.5]} />
          <meshStandardMaterial color="#a3e635" roughness={0.8} />
        </mesh>
      </group>

      {/* Tree 2: Right */}
      <group position={[1.7, 0.25, -1.3]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.75, 0.55, 0.75]} />
          <meshStandardMaterial color="#84cc16" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.45, 0.5]} />
          <meshStandardMaterial color="#a3e635" roughness={0.8} />
        </mesh>
      </group>
    </>
  );
}

function FloatingStars() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (starsRef.current) {
      starsRef.current.children.forEach((star, idx) => {
        star.rotation.y = t * 2 + idx;
        star.position.y += Math.sin(t * 3 + idx) * 0.002;
      });
    }
  });

  return (
    <group ref={starsRef}>
      {/* Star 1 */}
      <group position={[-1.1, 2.1, 0.4]} scale={[0.18, 0.18, 0.18]}>
        <mesh>
          <boxGeometry args={[1, 1, 0.3]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.8} />
        </mesh>
      </group>
      {/* Star 2 */}
      <group position={[1.2, 2.2, 0.5]} scale={[0.16, 0.16, 0.16]}>
        <mesh>
          <boxGeometry args={[1, 1, 0.3]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.8} />
        </mesh>
      </group>
      {/* Star 3 */}
      <group position={[1.8, 0.9, 1.2]} scale={[0.14, 0.14, 0.14]}>
        <mesh>
          <boxGeometry args={[1, 1, 0.3]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.8} />
        </mesh>
      </group>
      {/* Star 4 */}
      <group position={[-1.8, 0.9, 1.2]} scale={[0.14, 0.14, 0.14]}>
        <mesh>
          <boxGeometry args={[1, 1, 0.3]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.8} />
        </mesh>
      </group>
    </group>
  );
}

function Scene4Mesh() {
  return (
    <group position={[0, -0.35, 0]} rotation={[0.22, 0.42, 0]}>
      {/* ── 1. LARGE LUSH ISOMETRIC ISLAND BASE ── */}
      {/* Main Grass Slab */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.45, 4.2]} />
        <meshStandardMaterial color="#84cc16" roughness={0.7} />
      </mesh>

      {/* Stepped Grass Fringe Overhang */}
      <mesh position={[0, -0.28, 2.12]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.22, 0.12]} />
        <meshStandardMaterial color="#72b81e" roughness={0.8} />
      </mesh>
      <mesh position={[2.12, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.22, 3.4]} />
        <meshStandardMaterial color="#72b81e" roughness={0.8} />
      </mesh>

      {/* Stepped Dirt Layers */}
      <mesh position={[0, -0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 0.42, 3.9]} />
        <meshStandardMaterial color="#87532a" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.38, 3.2]} />
        <meshStandardMaterial color="#754522" roughness={0.9} />
      </mesh>
      <mesh position={[0, -1.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.32, 2.3]} />
        <meshStandardMaterial color="#5e3619" roughness={0.95} />
      </mesh>

      {/* Cat Mascot */}
      <VoxelCatAutonomous />

      {/* Floating Windows */}
      <FloatingBrowserWindow />
      <FloatingCodeWindow />

      {/* Voxel Trees */}
      <VoxelTrees />

      {/* Digital Waterfalls */}
      <DigitalWaterfalls />

      {/* Floating Stars */}
      <FloatingStars />
    </group>
  );
}

export function Scene4Autonomous3D() {
  return (
    <div className="w-full h-[185px] sm:h-[205px] lg:h-[215px] relative select-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [5.6, 4.6, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} color="#f0fdf4" />
        <directionalLight
          position={[6, 12, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          color="#ffffff"
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#bef264" />
        <Scene4Mesh />
      </Canvas>
    </div>
  );
}
