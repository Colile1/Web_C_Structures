import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Node from './Node';
import Beam from './Beam';

export default function Scene() {
  return (
    <Canvas 
      camera={{ position: [10, 10, 10], fov: 75 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Node position={[0, 0, 0]} />
      <Node position={[3, 0, 0]} />
      <Beam start={[0, 0, 0]} end={[3, 0, 0]} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </Canvas>
  );
}
