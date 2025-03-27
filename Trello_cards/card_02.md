### **Card 2: Web Data Model Implementation**
**Objective:** Create a robust data model for structural elements with persistence capabilities.

---

### **1. Define Core Data Interfaces**
#### **1.1 Node Interface**
```typescript
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
```

#### **1.2 Beam Interface**
```typescript
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
```

---

### **2. Implement State Management**
#### **2.1 MobX Store Configuration**
```typescript
// src/stores/structure.ts
import { makeAutoObservable } from "mobx";
import { INode, IBeam } from "../types/structure";

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
    if (!this.nodes.has(startNodeId) throw Error("Invalid start node");
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
```

---

### **3. Implement JSON Import/Export**
#### **3.1 Validation Schema (Zod)**
```typescript
// src/utils/validation.ts
import { z } from "zod";

const Vector3Schema = z.tuple([
  z.number(), z.number(), z.number()
]);

export const StructureSchema = z.object({
  nodes: z.array(z.object({
    id: z.string().uuid(),
    position: Vector3Schema,
    constraints: z.object({
      x: z.boolean(),
      y: z.boolean(),
      z: z.boolean(),
      rotation: z.boolean()
    }),
    loads: z.array(z.object({
      force: Vector3Schema,
      moment: Vector3Schema
    }))
  })),
  beams: z.array(z.object({
    id: z.string().uuid(),
    startNodeId: z.string().uuid(),
    endNodeId: z.string().uuid(),
    material: z.object({
      youngsModulus: z.number().positive(),
      area: z.number().positive(),
      inertia: z.object({
        x: z.number().positive(),
        y: z.number().positive(),
        z: z.number().positive()
      })
    })
  }))
});
```

#### **3.2 Import/Export Service**
```typescript
// src/services/io.service.ts
import { StructureSchema } from "../utils/validation";
import { structureStore } from "../stores/structure";

export class StructureIO {
  static export() {
    return JSON.stringify({
      nodes: Array.from(structureStore.nodes.entries()),
      beams: Array.from(structureStore.beams.entries())
    });
  }

  static import(json: string) {
    const raw = JSON.parse(json);
    const result = StructureSchema.safeParse(raw);
    
    if (!result.success) {
      throw new Error("Invalid structure file: " + 
        result.error.issues.map(i => i.message).join(", "));
    }

    structureStore.nodes = new Map(result.data.nodes.map(n => [n.id, n]));
    structureStore.beams = new Map(result.data.beams.map(b => [b.id, b]));
  }
}
```

---

### **4. Connect to Rendering System**
#### **4.1 Observer Components**
```tsx
// src/components/StructureRenderer.tsx
import { observer } from "mobx-react-lite";
import { structureStore } from "../stores/structure";

const StructureRenderer = observer(() => {
  return (
    <>
      {Array.from(structureStore.nodes.values()).map(node => (
        <Node 
          key={node.id} 
          position={node.position}
          constraints={node.constraints}
        />
      ))}
      
      {Array.from(structureStore.beams.values()).map(beam => {
        const startNode = structureStore.nodes.get(beam.startNodeId)!;
        const endNode = structureStore.nodes.get(beam.endNodeId)!;
        return (
          <Beam
            key={beam.id}
            start={startNode.position}
            end={endNode.position}
            material={beam.material}
          />
        );
      })}
    </>
  );
});
```

#### **4.2 Update Scene Component**
```tsx
// src/components/Scene.tsx
import { StructureRenderer } from "./StructureRenderer";

// Inside Canvas component:
<StructureRenderer />
<Suspense fallback={null}>
  <gridHelper args={[10, 10]} /> // Visual reference
</Suspense>
```

---

### **5. Testing Protocol**
#### **5.1 Unit Tests (Vitest)**
```typescript
// tests/structure.test.ts
import { structureStore } from "../src/stores/structure";
import { StructureIO } from "../src/services/io.service";

describe("Structure Model", () => {
  beforeEach(() => {
    structureStore.nodes.clear();
    structureStore.beams.clear();
  });

  test("Add valid beam", () => {
    structureStore.addNode([0,0,0]);
    structureStore.addNode([3,0,0]);
    const nodes = Array.from(structureStore.nodes.keys());
    expect(() => structureStore.addBeam(nodes[0], nodes[1])).not.toThrow();
  });

  test("Export/import roundtrip", () => {
    // ...Test full cycle with validation
  });
});
```

#### **5.2 Manual Validation Checklist**
1. **Node Operations**
   - Add nodes at various positions
   - Verify UUID generation uniqueness
   - Check localStorage persistence after refresh

2. **Beam Operations**
   - Create beams between valid nodes
   - Attempt invalid beams (same node, non-existent nodes)
   - Verify material defaults

3. **Import/Export**
   - Export empty structure → Validate JSON schema
   - Import sample structure from Frame3DD
   - Test error handling for malformed files

---

### **Key Technical Decisions**
1. **Map vs Object Storage**  
   - `Map` preserves insertion order and handles keys better than plain objects
   - Enforces type safety for node/beam lookups

2. **Zod Validation**  
   - Catches corrupted/invalid files during import
   - Provides clear error messages for users

3. **MobX Optimization**  
   - Fine-grained reactivity only updates changed components
   - Automatic dependency tracking for efficient renders

4. **UUID Generation**  
   - Browser-native `crypto.randomUUID()` for security
   - Fallback to `uuid` library if needed (Safari <15.4)

---

### **Common Pitfalls & Solutions**
**Problem:** Nodes/beams not rendering after add  
**Fix:** Ensure components are wrapped in `observer()` and store methods are `makeAutoObservable`

**Problem:** Imported beams reference missing nodes  
**Fix:** Use Zod's `.refine()` to validate node references exist

**Problem:** LocalStorage quota exceeded  
**Fix:** Implement LRU caching or IndexedDB for large structures

---

### **Completion Criteria**
✅ All node/beam operations through store methods  
✅ Validated JSON import/export with error handling  
✅ Auto-save to localStorage on changes  
✅ Rendering system reacts to store changes  
✅ Comprehensive test coverage (>80%)  

Next move to **Card 4: Drag-and-Drop UI Tools** to enable user interactions with this data model.