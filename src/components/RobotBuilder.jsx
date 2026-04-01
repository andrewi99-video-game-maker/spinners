import React, { useState } from 'react';

const RobotBuilder = ({ onDeploy }) => {
  const [selections, setSelections] = useState({
    spikeCount: 1,
    spikeDistance: 100
  });

  return (
    <div className="builder-container glass">
      <div className="builder-header">
        <h1>Build Your Orb</h1>
        <p>Select your starting spikes and distance</p>
      </div>

      <div className="builder-main">
        <div className="selection-panel">
          <section>
            <h3>Spike Count</h3>
            <div className="options-grid">
              {[1, 2, 3].map(count => (
                <button 
                  key={count} 
                  className={`option-btn ${selections.spikeCount === count ? 'active' : ''}`}
                  onClick={() => setSelections({...selections, spikeCount: count})}
                >
                  {count} Spike{count > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>Spike Distance</h3>
            <div className="options-grid">
              {[50, 100, 150].map(dist => (
                <button 
                  key={dist} 
                  className={`option-btn ${selections.spikeDistance === dist ? 'active' : ''}`}
                  onClick={() => setSelections({...selections, spikeDistance: dist})}
                >
                  {dist}px
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="preview-panel">
          <div className="orb-preview">
            <div className="orb-center"></div>
            {Array.from({length: selections.spikeCount}, (_, i) => (
              <div 
                key={i} 
                className="orb-spike" 
                style={{
                  transform: `rotate(${i * 360 / selections.spikeCount}deg) translateX(${selections.spikeDistance}px)`
                }}
              ></div>
            ))}
          </div>
          
          <div className="stats-display">
            <div className="stat-item">
              <span>Spikes:</span>
              <span>{selections.spikeCount}</span>
            </div>
            <div className="stat-item">
              <span>Distance:</span>
              <span>{selections.spikeDistance}px</span>
            </div>
          </div>

          <button className="deploy-btn glow-button" onClick={() => onDeploy(selections)}>
            Enter Arena
          </button>
        </div>
      </div>

      <style jsx>{`
        .builder-container {
          max-width: 1000px;
          margin: 40px auto;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .builder-header { text-align: center; }
        .builder-header p { color: var(--text-muted); margin-top: 10px; }
        
        .builder-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .selection-panel { display: flex; flex-direction: column; gap: 25px; }
        h3 { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px; }
        
        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }

        .option-btn {
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-main);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .option-btn:hover { background: rgba(255,255,255,0.1); }
        .option-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 0 15px rgba(52, 152, 219, 0.4);
        }

        .preview-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
        }

        .orb-preview {
          position: relative;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orb-center {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 20px var(--primary);
        }

        .orb-spike {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e74c3c;
          box-shadow: 0 0 10px #e74c3c;
        }

        .stats-display { width: 100%; display: flex; flex-direction: column; gap: 15px; }
        .stat-item { display: flex; align-items: center; gap: 15px; font-weight: 700; width: 100%; }
        .stat-item span:first-child { width: 60px; font-size: 0.8rem; }

        .deploy-btn { width: 100%; margin-top: 20px; font-size: 1.2rem; padding: 20px; }
      `}</style>
    </div>
  );
};

export default RobotBuilder;
