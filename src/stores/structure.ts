import { makeAutoObservable } from "mobx";
import { INode, IBeam, Vector3 } from "../types/structure";

class StructureStore {
  nodes: Map<string, INode> = new Map();
  beams: Map<string, IBeam> = new Map();

  constructor() {
    makeAutoObservable(this);
    this.loadInitialState();
  }

  // Generate RFC 4122 UUIDs
  private generateId = () => crypto.randomUUID();

  // Node operations
  addNode(position: Vector3) {
    const id = this.generateId();
    this.nodes.set(id, {
      id,
      position,
      constraints: { x: false, y: false, z: false, rotation: false },
      loads: []
    });
  }

  // Beam operations
  addBeam(startNodeId: string, endNodeId: string) {
    if (!this.nodes.has(startNodeId)) throw Error("Invalid start node");
    if (!this.nodes.has(endNodeId)) throw Error("Invalid end node");
    
    const id = this.generateId();
    this.beams.set(id, {
      id,
      startNodeId,
      endNodeId,
      material: {
        youngsModulus: 2e11, // Default steel
        area: 0.01,          // 10cm² cross-section
        inertia: { x: 1e-6, y: 1e-6, z: 1e-6 },
        color: 'gray'        // Add default color property
      }
    });
  }

  // Persistence
  private loadInitialState() {
    const saved = localStorage.getItem("structure");
    if (saved) {
      const data = JSON.parse(saved);
      this.nodes = new Map(data.nodes);
      this.beams = new Map(data.beams);
    }
  }

  save() {
    localStorage.setItem("structure", 
      JSON.stringify({
        nodes: Array.from(this.nodes.entries()),
        beams: Array.from(this.beams.entries())
      })
    );
  }
}

export const structureStore = new StructureStore();
