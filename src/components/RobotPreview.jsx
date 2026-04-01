import React from 'react';

const RobotPreview = ({ chassis, weapon, movement }) => {
  return (
    <div className="robot-preview-container">
      <svg viewBox="0 0 200 200" className="robot-svg">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#94a3b8', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#475569', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1e293b', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Movement / Base */}
        <g className="robot-movement">
          {movement.id === 'wheels' && (
            <circle cx="100" cy="160" r="20" fill="#333" stroke="#555" strokeWidth="2" />
          )}
          {movement.id === 'treads' && (
            <rect x="60" y="150" width="80" height="25" rx="5" fill="#222" stroke="#444" strokeWidth="2" />
          )}
          {movement.id === 'hover' && (
            <path d="M70 155 L130 155 L120 170 L80 170 Z" fill={movement.color || '#3498db'} opacity="0.6" filter="url(#glow)" />
          )}
        </g>

        {/* Chassis */}
        <rect 
          x="70" y="80" width="60" height="70" rx="10" 
          fill={chassis.color} 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="2"
          filter="url(#glow)"
        />
        <rect x="80" y="90" width="40" height="20" rx="4" fill="rgba(0,0,0,0.3)" /> {/* Cockpit/Eye */}
        
        {/* Weapon */}
        <g className="robot-weapon" transform="translate(130, 100)">
          {weapon.id === 'laser' && (
            <rect x="0" y="-5" width="40" height="10" rx="2" fill={weapon.color} filter="url(#glow)" />
          )}
          {weapon.id === 'rocket' && (
            <>
              <rect x="0" y="-8" width="35" height="16" rx="2" fill="#555" />
              <path d="M35 -8 L45 0 L35 8 Z" fill={weapon.color} />
            </>
          )}
          {weapon.id === 'blade' && (
            <path d="M0 -2 L50 -10 L45 0 L50 10 L0 2 Z" fill={weapon.color} filter="url(#glow)" />
          )}
        </g>
      </svg>

      <style jsx>{`
        .robot-preview-container {
          width: 100%;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle, rgba(52, 152, 219, 0.1) 0%, transparent 70%);
        }
        .robot-svg {
          width: 250px;
          height: 250px;
          filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
        }
        .robot-movement { animation: hoverEffect 2s infinite ease-in-out; }
        @keyframes hoverEffect {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default RobotPreview;
