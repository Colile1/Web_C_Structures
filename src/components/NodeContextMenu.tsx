import { Menu } from '@headlessui/react';
import { useState } from 'react';
import { useStore } from '../stores/structure';

export const NodeContextMenu = ({ nodeId, position }) => {
  const [force, setForce] = useState([0, 0, 0]);
  const store = useStore();

  return (
    <Menu>
      <Menu.Button className="context-menu-trigger" />
      
      <Menu.Items 
        className="absolute bg-white p-4 rounded shadow-lg"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
        role="application"
        aria-label="3D structural design canvas"
        aria-description="Use construction tools to place nodes and connect beams"
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
                const newForce = [...force];
                newForce[i] = Number(e.target.value);
                setForce(newForce);
              }}
            />
          ))}
          <button
            className="bg-blue-500 text-white p-1 rounded"
            onClick={() => store.applyForce(nodeId, force)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                store.applyForce(nodeId, force);
              }
            }}
          >
            Add Node (N)
          </button>
        </div>
      </Menu.Items>
    </Menu>
  );
};
