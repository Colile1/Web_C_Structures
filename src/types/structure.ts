// src/types/structure.ts
export type Vector3 = [number, number, number];

export interface INode {
  id: string;
  position: Vector3;
  constraints: {
    x: boolean;
    y: boolean;
    z: boolean;
    rotation: boolean;
  };
  loads: Array<{
    force: Vector3;
    moment: Vector3;
  }>;
}

export interface IBeam {
  id: string;
  startNodeId: string;
  endNodeId: string;
  material: {
    youngsModulus: number; // Pa (e.g., 2e11 for steel)
    area: number;         // m² (cross-sectional area)
    inertia: {           // m⁴ (moment of inertia)
      x: number;
      y: number;
      z: number;
    };
  };
  results?: {
    axialForce?: number;
    shearForces?: Vector3;
    bendingMoments?: Vector3;
  };
}
