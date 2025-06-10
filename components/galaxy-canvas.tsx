// GalaxyCanvas.tsx
// Un fondo animado 3D de galaxia con estrellas usando Three.js y react-three-fiber
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function Stars() {
  const group = useRef<THREE.Group>(null);
  const starGeo = useRef<THREE.BufferGeometry>(null);
  if (!starGeo.current) {
    const geometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 60 + Math.random() * 40;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.current = geometry;
  }
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0008;
      group.current.rotation.x += 0.0002;
    }
  });
  return (
    <group ref={group}>
      <points geometry={starGeo.current}>
        <pointsMaterial color="#b8c6ff" size={0.7} sizeAttenuation />
      </points>
    </group>
  );
}

export default function GalaxyCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 120], fov: 75 }} style={{ width: '100vw', height: '100vh', background: 'transparent' }}>
      <Stars />
      {/* Puedes agregar más efectos aquí si lo deseas */}
    </Canvas>
  );
}
