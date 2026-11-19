"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface Connecting3DCablesProps {
  active: boolean;
}

export function Connecting3DCables({ active }: Connecting3DCablesProps) {
  const pulse1Ref = useRef<THREE.Mesh>(null);
  const pulse2Ref = useRef<THREE.Mesh>(null);

  // Curve 1: Research Bot (top-left) to Job Bot (bottom-right)
  const curve1 = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-3.2, 0.2, -1.8),
      new THREE.Vector3(0, -0.6, 0),
      new THREE.Vector3(3.2, 0.2, 1.8)
    );
  }, []);

  // Curve 2: Social Bot (top-right) to Coding Bot (bottom-left)
  const curve2 = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(3.2, 0.2, -1.8),
      new THREE.Vector3(0, -0.6, 0),
      new THREE.Vector3(-3.2, 0.2, 1.8)
    );
  }, []);

  const tubeGeo1 = useMemo(() => new THREE.TubeGeometry(curve1, 32, 0.04, 8, false), [curve1]);
  const tubeGeo2 = useMemo(() => new THREE.TubeGeometry(curve2, 32, 0.04, 8, false), [curve2]);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    // Pulse 1 travels along curve1
    if (pulse1Ref.current) {
      const p1 = (t * 0.4) % 1;
      const pos1 = curve1.getPoint(p1);
      pulse1Ref.current.position.copy(pos1);
    }

    // Pulse 2 travels along curve2
    if (pulse2Ref.current) {
      const p2 = ((t * 0.4) + 0.5) % 1;
      const pos2 = curve2.getPoint(p2);
      pulse2Ref.current.position.copy(pos2);
    }
  });

  if (!active) return null;

  return (
    <group>
      {/* Cable 1 */}
      <mesh geometry={tubeGeo1}>
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>
      {/* Pulse 1 */}
      <mesh ref={pulse1Ref}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Cable 2 */}
      <mesh geometry={tubeGeo2}>
        <meshBasicMaterial color="#6e9e35" transparent opacity={0.6} />
      </mesh>
      {/* Pulse 2 */}
      <mesh ref={pulse2Ref}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color="#84cc16" />
      </mesh>
    </group>
  );
}
