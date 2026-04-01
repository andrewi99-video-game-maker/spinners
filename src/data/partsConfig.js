export const CHASSIS = {
  light: {
    id: 'light',
    name: 'Light Scout',
    hp: 80,
    speed: 1.2,
    color: '#34d399', // Emerald
    description: 'Fast and agile, but fragile.'
  },
  medium: {
    id: 'medium',
    name: 'Medium Striker',
    hp: 120,
    speed: 1.0,
    color: '#60a5fa', // Blue
    description: 'A balanced machine for any situation.'
  },
  heavy: {
    id: 'heavy',
    name: 'Heavy Tank',
    hp: 200,
    speed: 0.7,
    color: '#f87171', // Red
    description: 'Slow, but can take a massive beating.'
  }
};

export const WEAPONS = {
  laser: {
    id: 'laser',
    name: 'Pulse Laser',
    damage: 10,
    fireRate: 200, // ms
    range: 400,
    color: '#fbbf24', // Amber
    type: 'projectile',
    heatGen: 5
  },
  rocket: {
    id: 'rocket',
    name: 'Mega Rocket',
    damage: 40,
    fireRate: 800,
    range: 600,
    color: '#f97316', // Orange
    type: 'projectile',
    heatGen: 20
  },
  blade: {
    id: 'blade',
    name: 'Plasma Blade',
    damage: 30,
    fireRate: 400,
    range: 100,
    color: '#a78bfa', // Violet
    type: 'melee',
    heatGen: 10
  },
  plasma: {
    id: 'plasma',
    name: 'Plasma Cannon',
    damage: 25,
    fireRate: 300,
    range: 500,
    color: '#06b6d4', // Cyan
    type: 'projectile',
    heatGen: 15
  },
  railgun: {
    id: 'railgun',
    name: 'Railgun',
    damage: 50,
    fireRate: 1000,
    range: 700,
    color: '#10b981', // Emerald
    type: 'projectile',
    heatGen: 30
  },
  flamethrower: {
    id: 'flamethrower',
    name: 'Flamethrower',
    damage: 5,
    fireRate: 50,
    range: 200,
    color: '#ef4444', // Red
    type: 'projectile',
    heatGen: 2
  }
};

export const MOVEMENT = {
  wheels: {
    id: 'wheels',
    name: 'High-Speed Wheels',
    speedMultiplier: 1.2,
    turnSpeed: 0.05,
    heatGen: 1
  },
  treads: {
    id: 'treads',
    name: 'Armor Treads',
    speedMultiplier: 0.8,
    turnSpeed: 0.08,
    heatGen: 0.5
  },
  hover: {
    id: 'hover',
    name: 'Hover Jets',
    speedMultiplier: 1.0,
    turnSpeed: 0.06,
    heatGen: 2
  }
};
