import { Sphere } from '@react-three/drei';

interface NodeProps {
  position: [number, number, number];
  constraints?: {
    x: boolean;
    y: boolean;
    z: boolean;
    rotation: boolean;
  };
}

export default function Node({ position/*, constraints*/ }: NodeProps) {
  return (
    <Sphere args={[0.2, 32, 32]} position={position}>
      <meshStandardMaterial color="skyblue" />
    </Sphere>
  );
}
