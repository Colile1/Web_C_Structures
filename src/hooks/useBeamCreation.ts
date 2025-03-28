import { useState } from 'react';
import { structureStore } from '../stores/structure';

export const useBeamCreation = () => {
  const [beamStart, setBeamStart] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    if (!beamStart) {
      setBeamStart(nodeId);
      // Visual feedback: highlight node
    } else {
      if (nodeId !== beamStart) {
        structureStore.addBeam(beamStart, nodeId);
      }
      setBeamStart(null);
    }
  };

  return { handleNodeClick, beamStart };
};
