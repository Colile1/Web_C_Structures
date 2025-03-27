import React from 'react';
import { Canvas } from '@react-three/fiber';
import { structureStore } from '../stores/structure';
import Node from './Node';
import Beam from './Beam';

const Scene: React.FC = () => {
  return (
    <Canvas>
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
            material={beam.material} // Ensure material is passed correctly
          />
        );
      })}
    </Canvas>
  );
};

export default Scene;
