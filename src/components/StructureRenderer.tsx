import { observer } from "mobx-react-lite";
import { structureStore } from "../stores/structure";
import Node from './Node';
import Beam from './Beam';

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

export default StructureRenderer;
