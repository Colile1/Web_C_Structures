import React, { useCallback } from 'react';

const Toolbar: React.FC = () => {
  const handleNodeToolClick = useCallback(() => {
    // Logic for dragging and placing nodes
    console.log("Node Tool activated");
  }, []);
  return (
    <div className="toolbar">
      <button className="tool" data-testid="node-tool" onClick={handleNodeToolClick}>Node Tool</button>
      <button className="tool" data-testid="beam-tool">Beam Tool</button>
      <button className="tool" data-testid="force-tool">Force Tool</button>
      <button className="tool" data-testid="selection-tool">Selection Tool</button>
    </div>
  );
};

export default Toolbar;
