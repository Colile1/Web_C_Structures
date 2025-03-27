import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense } from 'react'; // Import Suspense from React
import Node from './Node';
import Beam from './Beam';
import StructureRenderer from './StructureRenderer';

/**
 * Core 3D rendering component for C_Structures Web
 * Features:
 * - Three.js canvas with WebGL 2.0 context
 * - Adaptive camera (perspective)
 * - Physics-space coordinate system (Y-up)
 * - Anti-aliasing (MSAA 4x)
 */
export default function Scene() {
  return (
    <Canvas 
      camera={{ position: [10, 10, 10], fov: 75 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <StructureRenderer />
      <Suspense fallback={null}>
        <gridHelper args={[10, 10]} /> // Visual reference
      </Suspense>
      <OrbitControls
        minDistance={5}
        maxDistance={50}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
      <Stats />
    </Canvas>
  );
}
