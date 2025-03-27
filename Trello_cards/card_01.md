### **Card 1: WebGL Rendering Pipeline Setup**
**Objective:** Create a foundational 3D rendering environment using Three.js in React with camera controls.

---

### **Step 1: Project Setup**
#### **1.1 Initialize React Project**
```bash
npm create vite@latest c_structures_web -- --template react-ts
cd c_structures_web
npm install three @types/three @react-three/fiber @react-three/drei
```

#### **1.2 Folder Structure**
```
/src
  /components
    Scene.tsx
  /styles
    scene.css
  App.tsx
  main.tsx
```

---

### **Step 2: Three.js Scene Initialization**
#### **2.1 Create Basic Scene Component** (`Scene.tsx`)
```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Scene() {
  return (
    <Canvas 
      camera={{ position: [10, 10, 10], fov: 75 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </Canvas>
  );
}
```

#### **2.2 Integrate with App Component** (`App.tsx`)
```tsx
import Scene from './components/Scene';

function App() {
  return (
    <div className="app-container">
      <Scene />
    </div>
  );
}
```

---

### **Step 3: Render Basic 3D Shapes**
#### **3.1 Create Node Component** (`Node.tsx`)
```tsx
import { Sphere } from '@react-three/drei';

export default function Node({ position }: { position: [number, number, number] }) {
  return (
    <Sphere args={[0.2, 32, 32]} position={position}>
      <meshStandardMaterial color="skyblue" />
    </Sphere>
  );
}
```

#### **3.2 Create Beam Component** (`Beam.tsx`)
```tsx
import { Cylinder } from '@react-three/drei';

export default function Beam({ 
  start, 
  end 
}: { 
  start: [number, number, number], 
  end: [number, number, number] 
}) {
  const position = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];

  const length = Math.sqrt(
    (end[0] - start[0]) ** 2 +
    (end[1] - start[1]) ** 2 +
    (end[2] - start[2]) ** 2
  );

  const direction = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];

  return (
    <Cylinder
      args={[0.1, 0.1, length, 8]}
      position={position as [number, number, number]}
      rotation={[
        Math.atan2(direction[1], direction[0]),
        -Math.acos(direction[2] / length),
        0
      ]}
    >
      <meshStandardMaterial color="gray" />
    </Cylinder>
  );
}
```

#### **3.3 Update Scene Component**
```tsx
// Add to Scene.tsx
import Node from './Node';
import Beam from './Beam';

// Inside Canvas component:
<Node position={[0, 0, 0]} />
<Node position={[3, 0, 0]} />
<Beam start={[0, 0, 0]} end={[3, 0, 0]} />
```

---

### **Step 4: Implement Camera Controls**
#### **4.1 Configure OrbitControls** (Already added in Step 2.1)
- **Pan:** Enabled by default (mouse right-click + drag)
- **Zoom:** Mouse wheel/pinch gesture
- **Rotate:** Left-click + drag

#### **4.2 Add Control Limits** (Prevent extreme zoom/rotation)
```tsx
<OrbitControls
  minDistance={5}
  maxDistance={50}
  minPolarAngle={0}
  maxPolarAngle={Math.PI / 2}
  enableDamping
  dampingFactor={0.05}
/>
```

---

### **Step 5: Testing & Optimization**
#### **5.1 Verify Rendering**
```bash
npm run dev
```
- Check for two nodes connected by a beam
- Test all camera controls

#### **5.2 Performance Checks**
- Open Chrome DevTools → Performance tab
- Record session while rotating/zooming
- Ensure FPS stays ≥60
- Verify GPU memory usage in Three.js stats:
  ```tsx
  import { Stats } from '@react-three/drei';
  // Add <Stats /> to Scene component
  ```

#### **5.3 Responsive Design**
```css
/* scene.css */
.app-container {
  position: fixed;
  width: 100%;
  height: 100%;
  touch-action: none; /* Prevent scroll conflicts */
}

canvas {
  outline: none; /* Remove focus border */
}
```

---

### **Step 6: Documentation**
#### **6.1 Add Scene Component Docs**
```tsx
/**
 * Core 3D rendering component for C_Structures Web
 * Features:
 * - Three.js canvas with WebGL 2.0 context
 * - Adaptive camera (perspective)
 * - Physics-space coordinate system (Y-up)
 * - Anti-aliasing (MSAA 4x)
 */
```

#### **6.2 Known Issues Log**
```md
## Rendering Pipeline Notes
- Mobile: WebGL 2.0 not supported on some iOS devices (fallback needed)
- High-DPI: Canvas scaling for Retina displays
- Z-Fighting: Add small offset to beam/node positions
```

---

### **Dependencies**
1. **@react-three/fiber**: React reconciler for Three.js
2. **@react-three/drei**: Prebuilt Three.js components
3. **three**: Core WebGL library
4. **Vite**: Bundler with hot-reload

### **Validation Criteria**
✅ Renders at least 2 nodes + 1 beam  
✅ Camera can orbit/zoom/pan smoothly  
✅ No visible z-fighting between objects  
✅ Consistent 60 FPS on mid-range hardware  
✅ Responsive to screen size changes  

### **Next Steps**
1. Connect to data model (Card 2)
2. Add interactive node placement (Card 4)
3. Implement force visualization (Card 5)

This setup establishes the visual foundation while maintaining performance for complex structural simulations. The React Three Fiber architecture allows incremental complexity addition while keeping rendering logic declarative.