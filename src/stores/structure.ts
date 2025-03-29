import { makeAutoObservable } from "mobx";
import { INode, IBeam, Vector3 } from "../types/structure";

class StructureStore {
  actionHistory: Array<{ type: string; payload: any }> = [];
  redoStack: Array<{ type: string; payload: any }> = [];
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
    this.actionHistory.push({ type: 'ADD_NODE', payload: position });
    this.redoStack = []; // Clear redo stack on new action
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
    this.actionHistory.push({ type: 'ADD_BEAM', payload: { startNodeId, endNodeId } });
    this.redoStack = []; // Clear redo stack on new action
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
        inertia: { x: 1e-6, y: 1e-6, z: 1e-6 }
      }
    });
  }

  // Undo the last action
  undo() {
    const lastAction = this.actionHistory.pop();
    if (lastAction) {
      switch (lastAction.type) {
        case 'ADD_NODE':
          // Logic to remove the last added node
          break;
        case 'ADD_BEAM':
          // Logic to remove the last added beam
          break;
      }
      this.redoStack.push(lastAction);
    }
  }

  // Redo the last undone action
  redo() {
    const lastRedo = this.redoStack.pop();
    if (lastRedo) {
      switch (lastRedo.type) {
        case 'ADD_NODE':
          // Logic to re-add the last removed node
          break;
        case 'ADD_BEAM':
          // Logic to re-add the last removed beam
          break;
      }
      this.actionHistory.push(lastRedo);
    }
  }

  applyForce(nodeId: string, force: [number, number, number]) {
    if (!this.nodes.has(nodeId)) throw Error("Invalid node ID");
    const node = this.nodes.get(nodeId);
    if (node) {
        node.loads.push({ force, moment: [0, 0, 0] });
    }
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
