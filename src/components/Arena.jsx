import React, { useEffect, useRef, useState } from 'react';
import { useMultiplayer } from '../hooks/useMultiplayer';

const Arena = ({ robot }) => {
  const canvasRef = useRef(null);
  const { playersRef, projectilesRef, move, shoot, notifyHit, myId } = useMultiplayer(robot);
  
  const [points, setPoints] = useState(0);
  
  // Use REFS for input to avoid re-renders on every key press
  const keysRef = useRef({});
  const timeRef = useRef(0);
  
  const myPlayerRef = useRef({
    x: Math.random() * 600 + 100,
    y: Math.random() * 400 + 100,
    angle: 0,
    lastMoveUpdate: 0,
    hp: 100,
    maxHp: 100,
    spikeCount: robot.spikeCount,
    spikeDistance: robot.spikeDistance,
    points: 0
  });

  useEffect(() => {
    const handleKeyDown = (e) => { keysRef.current[e.code] = true; };
    const handleKeyUp = (e) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const gameLoop = () => {
      timeRef.current += 0.02;
      update();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const update = () => {
      const p = myPlayerRef.current;
      const keys = keysRef.current;
      const speed = 4;
      const turnSpeed = 0.05;

      let moved = false;
      if (keys['ArrowUp'] || keys['KeyW']) {
        p.x += Math.cos(p.angle) * speed;
        p.y += Math.sin(p.angle) * speed;
        moved = true;
      }
      if (keys['ArrowDown'] || keys['KeyS']) {
        p.x -= Math.cos(p.angle) * speed;
        p.y -= Math.sin(p.angle) * speed;
        moved = true;
      }
      if (keys['ArrowLeft'] || keys['KeyA']) {
        p.angle -= turnSpeed;
        moved = true;
      }
      if (keys['ArrowRight'] || keys['KeyD']) {
        p.angle += turnSpeed;
        moved = true;
      }

      p.x = Math.max(20, Math.min(1180, p.x));
      p.y = Math.max(20, Math.min(780, p.y));

      // Collision detection
      const time = timeRef.current;
      const mySpikes = [];
      for (let i = 0; i < p.spikeCount; i++) {
        const spikeAngle = time + (i * 2 * Math.PI / p.spikeCount);
        const spikeX = p.x + Math.cos(spikeAngle) * p.spikeDistance;
        const spikeY = p.y + Math.sin(spikeAngle) * p.spikeDistance;
        mySpikes.push({ x: spikeX, y: spikeY });
      }

      // Check spike hits on enemies
      Object.values(playersRef.current).forEach(other => {
        if (other.id === myId) return;
        // Check if any spike hits enemy circle
        mySpikes.forEach(spike => {
          const sdx = spike.x - other.x;
          const sdy = spike.y - other.y;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          if (sdist < 30) { // Spike hit enemy circle
            notifyHit(other.id, 10); // Damage
            p.points += 10; // Gain points
            setPoints(p.points);
          }
        });

        // Check spike-spike collision
        const otherSpikes = [];
        for (let i = 0; i < other.spikeCount; i++) {
          const spikeAngle = time + (i * 2 * Math.PI / other.spikeCount);
          const spikeX = other.x + Math.cos(spikeAngle) * other.spikeDistance;
          const spikeY = other.y + Math.sin(spikeAngle) * other.spikeDistance;
          otherSpikes.push({ x: spikeX, y: spikeY });
        }
        mySpikes.forEach(mySpike => {
          otherSpikes.forEach(otherSpike => {
            const dx = mySpike.x - otherSpike.x;
            const dy = mySpike.y - otherSpike.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 20) { // Spike collision
              p.spikeCount = Math.max(1, p.spikeCount - 1);
              // Note: can't modify other directly, need to emit
            }
          });
        });
      });

      if (moved && Date.now() - p.lastMoveUpdate > 30) {
        move({ x: p.x, y: p.y, angle: p.angle, spikeCount: p.spikeCount, spikeDistance: p.spikeDistance, points: p.points });
        p.lastMoveUpdate = Date.now();
      }
    };

    const draw = () => {
      const time = timeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      for (let i = 0; i <= canvas.width; i += 50) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
      for (let i = 0; i <= canvas.height; i += 50) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
      ctx.stroke();

      // Draw players
      const allPlayers = { ...playersRef.current, [myId]: { ...myPlayerRef.current, id: myId } };
      Object.values(allPlayers).forEach(pInfo => {
        if (!pInfo) return;
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(pInfo.x, pInfo.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = pInfo.id === myId ? '#3498db' : '#e74c3c';
        ctx.shadowBlur = 15;
        ctx.shadowColor = pInfo.id === myId ? '#3498db' : '#e74c3c';
        ctx.fill();
        ctx.closePath();
        
        // Draw spikes
        const spikeCount = pInfo.spikeCount || 1;
        const spikeDistance = pInfo.spikeDistance || 100;
        for (let i = 0; i < spikeCount; i++) {
          const spikeAngle = time + (i * 2 * Math.PI / spikeCount);
          const spikeX = pInfo.x + Math.cos(spikeAngle) * spikeDistance;
          const spikeY = pInfo.y + Math.sin(spikeAngle) * spikeDistance;
          ctx.beginPath();
          ctx.arc(spikeX, spikeY, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#f1c40f';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#f1c40f';
          ctx.fill();
          ctx.closePath();
        }
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(pInfo.id === myId ? "YOU" : "ENEMY", pInfo.x, pInfo.y - 50);

        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(pInfo.x - 20, pInfo.y - 45, 40, 5);
        ctx.fillStyle = '#e74c3c';
        const hpPerc = pInfo.hp / (pInfo.maxHp || 100);
        ctx.fillRect(pInfo.x - 20, pInfo.y - 45, 40 * Math.max(0, hpPerc), 5);
      });

      projectilesRef.current.forEach(proj => {
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = proj.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = proj.color;
        ctx.fill();
        ctx.closePath();
      });
    };

    gameLoop();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [robot, myId]); // Stable dependencies

  return (
    <div className="arena-wrapper">
      <div className="arena-ui glass">
        <h3>Orb Combat Arena</h3>
        <p>WASD to move | Spikes deal damage on contact</p>
      </div>
      <canvas ref={canvasRef} width={1200} height={800} className="game-canvas glass" />
      <div className="upgrade-ui glass">
        <h4>Upgrades</h4>
        <p>Points: {points}</p>
        <button 
          className="upgrade-btn glow-button" 
          onClick={() => { 
            const p = myPlayerRef.current;
            if (p.points >= 10) { 
              p.points -= 10; 
              p.spikeCount = Math.min(20, p.spikeCount + 1); 
              setPoints(p.points); 
              move({ x: p.x, y: p.y, angle: p.angle, spikeCount: p.spikeCount, spikeDistance: p.spikeDistance, points: p.points }); 
            } 
          }}
        >
          Buy Spike (+1, 10 pts)
        </button>
        <button 
          className="upgrade-btn glow-button" 
          onClick={() => { 
            const p = myPlayerRef.current;
            if (p.points >= 10) { 
              p.points -= 10; 
              p.spikeDistance = Math.min(200, p.spikeDistance + 20); 
              setPoints(p.points); 
              move({ x: p.x, y: p.y, angle: p.angle, spikeCount: p.spikeCount, spikeDistance: p.spikeDistance, points: p.points }); 
            } 
          }}
        >
          Increase Distance (+20, 10 pts)
        </button>
      </div>
      <style jsx>{`
        .arena-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .arena-ui { padding: 10px 30px; text-align: center; }
        .game-canvas { background: #020617; border: 2px solid var(--primary); box-shadow: 0 0 50px rgba(52, 152, 219, 0.2); }
        .upgrade-ui { padding: 20px; text-align: center; max-width: 300px; }
        .upgrade-btn { margin: 5px; font-size: 0.8rem; padding: 8px 16px; }
      `}</style>
    </div>
  );
};

export default Arena;
