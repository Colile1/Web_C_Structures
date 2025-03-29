import * as THREE from 'three';

// Utility function for screen-to-world conversion
export const screenToWorld = (clientX: number, clientY: number, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
  const rect = renderer.domElement.getBoundingClientRect();
  
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersection = new THREE.Vector3();
  raycaster.ray.intersectPlane(groundPlane, intersection);
  
  return [intersection.x, 0, intersection.z] as [number, number, number];
};
