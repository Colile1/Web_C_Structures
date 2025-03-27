import React from 'react';

interface ToolbarProps {
  onToolSelect: (tool: string) => void; // Explicit type for onToolSelect
}

const Toolbar: React.FC<ToolbarProps> = ({ onToolSelect }) => {
  const handleToolSelect = (tool: string) => {
    onToolSelect(tool);
  };

  return (
    <div className="toolbar">
      <button onClick={() => handleToolSelect('node')}>Node Tool</button>
      <button onClick={() => handleToolSelect('beam')}>Beam Tool</button>
      <button onClick={() => handleToolSelect('force')}>Force Tool</button>
      <button onClick={() => handleToolSelect('selection')}>Selection Tool</button>
    </div>
  );
};

export default Toolbar; // Change to default export
