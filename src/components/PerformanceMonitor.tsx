import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const PerformanceMonitor = () => {
  const framesRef = useRef(0);
  const lastCheckRef = useRef(performance.now());
  const avgFpsRef = useRef<number[]>([]);

  useFrame(() => {
    framesRef.current++;
    const now = performance.now();
    
    if (now - lastCheckRef.current >= 1000) {
      const fps = framesRef.current;
      avgFpsRef.current.push(fps);
      if (avgFpsRef.current.length > 60) avgFpsRef.current.shift();
      
      if (fps < 55) {
        console.warn(`Low FPS detected: ${fps}`);
      }
      
      framesRef.current = 0;
      lastCheckRef.current = now;
    }
  });

  return null;
};
