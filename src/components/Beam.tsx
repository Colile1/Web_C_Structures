import { Cylinder } from '@react-three/drei';

interface Material {
  youngsModulus: number;
  area: number;
  inertia: { x: number; y: number; z: number; };
  color: string; // Add color property
}

interface BeamProps {
  start: [number, number, number];
  end: [number, number, number];
  material: Material; // Update material type
}

export default function Beam({ start, end, material }: BeamProps) {
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

  const rotation: [number, number, number] = [
    Math.atan2(direction[1], direction[0]),
    -Math.acos(direction[2] / length),
    0
  ];

  return (
    <Cylinder
      args={[0.1, 0.1, length, 8]}
      position={position as [number, number, number]}
      rotation={rotation}
    >
      <meshStandardMaterial color={material.color} /> {/* Use material color */}
    </Cylinder>
  );
}
