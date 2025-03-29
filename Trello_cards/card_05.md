# **Card 5: Real-Time Force Visualization**
**Objective:** Create dynamic visual feedback showing force distribution and structural deformation.

---

### **1. Force Color Mapping System**
#### **1.1 Shader-Based Color Interpolation**
```glsl
// src/shaders/forceShader.glsl
uniform float forceValue;
uniform vec3 colorTension;
uniform vec3 colorCompression;
uniform float maxAbsForce;

varying vec3 vColor;

void main() {
  float normalizedForce = forceValue / maxAbsForce;
  
  vec3 color = mix(
    colorCompression,
    colorTension,
    smoothstep(-1.0, 1.0, normalizedForce)
  );

  gl_FragColor = vec4(color, 1.0);
}
```

#### **1.2 Three.js Custom Material**
```tsx
// src/materials/ForceMaterial.ts
import { ShaderMaterial, UniformsUtils } from 'three';
import { forceShader } from '../shaders/forceShader';

export class ForceMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        forceValue: { value: 0 },
        maxAbsForce: { value: 1 },
        colorTension: { value: new THREE.Color(0x0000ff) },
        colorCompression: { value: new THREE.Color(0xff0000) }
      },
      vertexShader: `
        varying vec3 vColor;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vColor = color;
        }
      `,
      fragmentShader: forceShader
    });
  }
}
```

---

### **2. Beam Visualization Components**
#### **2.1 Enhanced Beam Rendering**
```tsx
// src/components/Beam.tsx
import { ForceMaterial } from '../materials/ForceMaterial';

export const Beam = ({ start, end, force }) => {
  const meshRef = useRef<THREE.Mesh>();
  const [geometry] = useState(() => {
    const length = new THREE.Vector3(...start)
      .distanceTo(new THREE.Vector3(...end));
    return new THREE.CylinderGeometry(0.1, 0.1, length, 8);
  });

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as ForceMaterial;
      material.uniforms.forceValue.value = force;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={getBeamMidpoint(start, end)}
      quaternion={getBeamRotation(start, end)}
    >
      <ForceMaterial />
    </mesh>
  );
};
```

#### **2.2 Deformation Visualization**
```typescript
// src/utils/deformation.ts
export const applyDeformation = (
  geometry: THREE.BufferGeometry,
  force: number,
  length: number
) => {
  const positionAttr = geometry.attributes.position;
  const originalPositions = positionAttr.array.clone();
  const maxDeflection = Math.min(Math.abs(force) * 0.01, length * 0.1);

  for (let i = 0; i < positionAttr.count; i++) {
    const y = originalPositions[i * 3 + 1];
    const t = y / length;
    const deflection = maxDeflection * Math.sin(t * Math.PI);
    
    positionAttr.setXYZ(
      i,
      originalPositions[i * 3],
      y,
      originalPositions[i * 3 + 2] + deflection * Math.sign(force)
    );
  }
  
  positionAttr.needsUpdate = true;
};
```

---

### **3. Dynamic Legend Component**
#### **3.1 Gradient Legend UI**
```tsx
// src/components/ForceLegend.tsx
import { useStore } from '../stores/forceStore';

export const ForceLegend = () => {
  const { minForce, maxForce } = useStore();

  return (
    <div className="fixed right-4 bottom-4 bg-white p-4 rounded-lg shadow-xl">
      <div className="flex items-center mb-2">
        <div className="w-8 h-4 mr-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
        <span className="text-sm">{minForce.toFixed(2)} N (Tension)</span>
      </div>
      <div className="flex items-center">
        <div className="w-8 h-4 mr-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
        <span className="text-sm">{maxForce.toFixed(2)} N (Compression)</span>
      </div>
    </div>
  );
};
```

#### **3.2 Auto-Scaling Color Range**
```typescript
// src/stores/forceStore.ts
import { makeAutoObservable, reaction } from 'mobx';

class ForceStore {
  maxAbsForce = 1000; // Initial default
  forces: number[] = [];

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.forces,
      () => this.updateScale()
    );
  }

  updateScale() {
    const absForces = this.forces.map(Math.abs);
    this.maxAbsForce = Math.max(1000, ...absForces);
  }
}
```

---

### **4. Performance Optimization**
#### **4.1 Instanced Meshes for Large Structures**
```tsx
// src/components/InstancedBeams.tsx
import { InstancedMesh } from 'three';

export const InstancedBeams = ({ count }) => {
  const instancedRef = useRef<InstancedMesh>();
  const { beams } = useStore();

  useEffect(() => {
    beams.forEach((beam, i) => {
      const matrix = new THREE.Matrix4();
      // Calculate position/rotation from beam data
      instancedRef.current?.setMatrixAt(i, matrix);
    });
    instancedRef.current!.instanceMatrix.needsUpdate = true;
  }, [beams]);

  return (
    <instancedMesh
      ref={instancedRef}
      args={[undefined, undefined, count]}
    >
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
      <ForceMaterial />
    </instancedMesh>
  );
};
```

#### **4.2 Web Worker Updates**
```typescript
// src/workers/forceWorker.ts
self.onmessage = (e) => {
  const { positions, forces } = e.data;
  const deformedPositions = new Float32Array(positions.length);
  
  // Parallel deformation calculation
  for (let i = 0; i < positions.length; i += 3) {
    // Apply deformation logic
  }
  
  self.postMessage({ deformedPositions });
};
```

---

### **5. Validation & Testing**
#### **5.1 Visual Regression Tests**
```javascript
// cypress/e2e/visual.cy.js
describe('Force Visualization', () => {
  it('shows correct color mapping', () => {
    cy.loadStructure('tension_test.json');
    cy.getCanvasPixels('#canvas')
      .should('have.colorAt', [100, 100], 'rgb(0, 0, 255)');
  });
});
```

#### **5.2 Performance Metrics**
```typescript
// Track frame times during simulation
const monitorFrameRate = () => {
  let frames = 0;
  let lastCheck = performance.now();
  
  const loop = () => {
    frames++;
    const now = performance.now();
    
    if (now - lastCheck >= 1000) {
      console.log(`FPS: ${frames}`);
      frames = 0;
      lastCheck = now;
    }
    
    requestAnimationFrame(loop);
  };
  
  loop();
};
```

---

### **6. Completion Criteria**
✅ Force colors update within 100ms of simulation changes  
✅ Deformation visible at >1000N loads  
✅ Legend shows current force range  
✅ 60 FPS maintained with 500+ beams  
✅ Color scheme accessible (WCAG AA compliant)  
✅ Mobile touch interactions supported  

Next proceed to **Card 3: WebAssembly Physics Engine** to connect the visualization with actual force calculations.