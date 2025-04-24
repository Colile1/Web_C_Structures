import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import { forceStore } from '../stores/forceStore';
import { ForceMaterial } from '../materials/ForceMaterial';

interface BeamProps {
  start: [number, number, number];
  end: [number, number, number];
  material?: {
    youngsModulus: number;
    area: number;
    inertia: {
      x: number;
      y: number;
      z: number;
    };
  };
  force?: number;
}

export default function Beam({ start, end, force = 0, material }: BeamProps) {
  const meshRef = useRef<THREE.Mesh>();
  
  const position = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];

  const length = Math.sqrt(
    (end[0] - start[0]) ** 2 +
    (end[1] - start[1]) ** 2 +
    (end[2] - start[2]) ** 2
  );

  const direction = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as ForceMaterial;
      material.uniforms.forceValue.value = force;
    }
  });

  return (
    <Cylinder
      ref={meshRef}
      args={[0.1, 0.1, length, 8]}
      position={position as [number, number, number]}
      rotation={[
        Math.atan2(direction[1], direction[0]),
        -Math.acos(direction[2] / length),
        0
      ]}
    >
      <ForceMaterial />
    </Cylinder>
  );
}
