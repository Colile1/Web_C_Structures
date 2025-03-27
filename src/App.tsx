//import React from 'react';
import Scene from './components/Scene';
import Toolbar from './components/Toolbar'; // Import the Toolbar component
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Toolbar onToolSelect={() => {}} /> {/* Pass a dummy function for now */}
      <Scene />
    </div>
  );
}

export default App;
