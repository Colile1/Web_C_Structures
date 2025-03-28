import { Menu } from '@headlessui/react';
import { useState } from 'react';
import { structureStore } from '../stores/structure';

export const NodeContextMenu: React.FC<{ nodeId: string; position: { x: number; y: number } }> = ({ nodeId, position }) => {
  const [force, setForce] = useState<[number, number, number]>([0, 0, 0]);

  return (
    <Menu>
      <Menu.Button className="context-menu-trigger" />
      
      <Menu.Items 
        className="absolute bg-white p-4 rounded shadow-lg"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <h3 className="font-bold mb-2">Apply Force (N)</h3>
        <div className="grid grid-cols-4 gap-2">
          {['X', 'Y', 'Z'].map((axis, i) => (
            <input
              key={axis}
              type="number"
              placeholder={axis}
              className="p-1 border rounded"
              onChange={(e) => {
                const newForce: [number, number, number] = [...force];
                newForce[i] = parseFloat(e.target.value) || 0;
                setForce(newForce);
              }}
            />
          ))}
          <button
            className="bg-blue-500 text-white p-1 rounded"
            onClick={() => {
              structureStore.applyForce(nodeId, force); // Pass only nodeId and force
            }}
          >
            Apply
          </button>
        </div>
      </Menu.Items>
    </Menu>
  );
};
