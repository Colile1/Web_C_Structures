import { Sphere } from '@react-three/drei';

interface Constraints {
  x: boolean;
  y: boolean;
  z: boolean;
  rotation: boolean;
}

interface NodeProps {
  position: [number, number, number];
  constraints: Constraints; // Keep this for internal use
}

export default function Node({ position }: NodeProps) { // Remove constraints from parameters
  return (
    <Sphere args={[0.2, 32, 32]} position={position}>
      <meshStandardMaterial color="skyblue" />
    </Sphere>
  );
}
