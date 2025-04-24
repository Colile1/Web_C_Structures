import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense } from 'react'; // Import Suspense from React
import Node from './Node'; // not yet used uncomment when needed
import Beam from './Beam';  // not yet used uncomment when needed

import StructureRenderer from './StructureRenderer';
import { PerformanceMonitor } from './PerformanceMonitor';

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
      aria-label="3D structural design canvas"
      role="application"
      camera={{ position: [10, 10, 10], fov: 75 }}
      style={{ width: '100vw', height: '100vh' }}
      gl={{ 
        antialias: true,
        logarithmicDepthBuffer: true // Prevents z-fighting
      }}
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
      <PerformanceMonitor /> {/* Add this component */}
      <Stats showPanel={0} /> {/* Enable FPS counter */}
    </Canvas>
  );
}
