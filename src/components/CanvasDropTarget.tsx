import { useDrop } from 'react-dnd';
import * as THREE from 'three'; // Import THREE
import { structureStore } from '../stores/structure';
import { measureDragLatency } from '../utils'; // Import the latency measurement function
import { useEffect, useRef } from 'react';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define camera

export const CanvasDropTarget = () => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchThreshold = 10; // pixels

  const addNode = (position: Vector3) => {
    const endMeasure = measureLatency();
    structureStore.addNode(position);
    endMeasure();
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n') addNode();
      if (e.key === 'b') startBeamCreation();
      if (e.key === 'f') openForceMenu();
      if (e.key === 'z' && e.ctrlKey) structureStore.undo();
      if (e.key === 'y' && e.ctrlKey) structureStore.redo();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Add latency tracking
  const measureLatency = () => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      console.log(`Operation took ${duration}ms`);
    };
  };

  const [, drop] = useDrop(() => ({
    accept: ['NODE', 'BEAM'],
    drop: (_item, monitor) => {
      measureDragLatency(); // Measure drag latency
      const offset = monitor.getClientOffset();
      if (!offset) return;

      // Convert screen coords to 3D world position
      const x = (offset.x / window.innerWidth) * 2 - 1;
      const y = -(offset.y / window.innerHeight) * 2 + 1;
      
      const raycaster = new THREE.Raycaster(); // Use imported THREE
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, intersection);
      
      structureStore.addNode([intersection.x, 0, intersection.z]);
    }
  }));

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    if (deltaX > touchThreshold || deltaY > touchThreshold) {
      touchStartRef.current = null; // Cancel if dragged
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    
    const touch = event.changedTouches[0];
    const x = (touch.clientX / window.innerWidth) * 2 - 1;
    const y = -(touch.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, intersection);
    
    addNode([intersection.x, 0, intersection.z]);
    touchStartRef.current = null;
  };

  return (
    <div
      ref={drop as any}
      className="absolute inset-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};
