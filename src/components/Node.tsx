import { Sphere } from '@react-three/drei';

export default function Node({ position }: { position: [number, number, number] }) {
  return (
    <Sphere args={[0.2, 32, 32]} position={position}>
      <meshStandardMaterial color="skyblue" />
    </Sphere>
  );
}
