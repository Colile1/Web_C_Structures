// import React from 'react'; //not yet used uncomment when needed
import Scene from './components/Scene';
import Toolbar from './components/Toolbar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div>
        <Toolbar />
      </div>
      <div className="app-container">
        <Scene />
      </div>
    </div>
  );
}

export default App;