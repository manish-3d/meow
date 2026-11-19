"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface Thanos3DParticlesProps {
  active: boolean;
}

const PARTICLE_COUNT = 160;

export function Thanos3DParticles({ active }: Thanos3DParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate particle physics attributes
  const particles = useMemo(() => {
    const data = [];
    const colors = ["#a78bfa", "#fdba74", "#a3e635", "#bef264", "#f97316", "#ffffff", "#38bdf8"];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spawn within island cluster bounds
      const x = (Math.random() - 0.5) * 2.8;
      const y = Math.random() * 1.8 - 0.5;
      const z = (Math.random() - 0.5) * 2.8;

      // Velocities shooting upward and outward
      const vx = (Math.random() - 0.5) * 3.5;
      const vy = 2.0 + Math.random() * 4.5;
      const vz = (Math.random() - 0.5) * 3.5;

      // Rotational spin
      const rx = (Math.random() - 0.5) * 8;
      const ry = (Math.random() - 0.5) * 8;
      const rz = (Math.random() - 0.5) * 8;

      const scale = 0.08 + Math.random() * 0.12;
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);

      data.push({ x, y, z, vx, vy, vz, rx, ry, rz, scale, color, curX: x, curY: y, curZ: z });
    }
    return data;
  }, []);

  // Initialize colors on the InstancedMesh
  useMemo(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      meshRef.current.setColorAt(i, particles[i].color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [particles]);

  const startTimeRef = useRef<number | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (!active) {
      startTimeRef.current = null;
      // Hide all particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      // Physics motion
      const currentX = p.x + p.vx * elapsed;
      const currentY = p.y + p.vy * elapsed - 0.5 * 1.5 * elapsed * elapsed; // Gravity curve
      const currentZ = p.z + p.vz * elapsed;

      // Scale shrink as they dissipate
      const lifeRatio = Math.max(0, 1 - elapsed / 1.4);
      const currentScale = p.scale * lifeRatio;

      dummy.position.set(currentX, currentY, currentZ);
      dummy.rotation.set(p.rx * elapsed, p.ry * elapsed, p.rz * elapsed);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.3} metalness={0.1} />
    </instancedMesh>
  );
}
