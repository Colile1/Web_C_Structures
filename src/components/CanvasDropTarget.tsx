import { useDrop } from 'react-dnd';
import * as THREE from 'three'; // Import THREE
import { structureStore } from '../stores/structure';
import { measureDragLatency } from '../utils'; // Import the latency measurement function

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define camera

export const CanvasDropTarget = () => {
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

  return <div ref={drop as any} className="absolute inset-0" />; // Cast to any to resolve type issue
};
