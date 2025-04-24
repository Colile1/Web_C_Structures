import { Sphere } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface NodeProps {
  position: [number, number, number];
  constraints?: {
    x: boolean;
    y: boolean;
    z: boolean;
    rotation: boolean;
  };
}

export default function Node({ position, constraints }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handlePointerDown = (event: React.PointerEvent) => {
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent & { point?: THREE.Vector3 }) => {
    if (isDragging && event.point) {
      const newPosition: [number, number, number] = [event.point.x, event.point.y, event.point.z];
      if (meshRef.current) {
        meshRef.current.position.set(newPosition[0], newPosition[1], newPosition[2]);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };
  return ( 
    <Sphere 
      ref={meshRef}
      args={[0.2, 32, 32]} 
      position={position} 
      onPointerDown={handlePointerDown} 
      onPointerMove={handlePointerMove} 
      onPointerUp={handlePointerUp}
    >
      <meshStandardMaterial color="skyblue" />
    </Sphere>
  );
}
