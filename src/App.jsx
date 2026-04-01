import React, { useState } from 'react';
import RobotBuilder from './components/RobotBuilder';
import Arena from './components/Arena';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('builder'); // 'builder' or 'arena'
  const [myRobot, setMyRobot] = useState(null);

  const handleDeploy = (selections) => {
    setMyRobot(selections);
    setGameState('arena');
  };

  return (
    <div className="app-layout">
      {gameState === 'builder' && (
        <div className="builder-screen">
          <RobotBuilder onDeploy={handleDeploy} />
        </div>
      )}

      {gameState === 'arena' && (
        <div className="arena-screen">
          <Arena robot={myRobot} />
        </div>
      )}
    </div>
  );
}

export default App;
