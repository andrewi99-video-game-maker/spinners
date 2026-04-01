import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const players = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', (robotData) => {
    players[socket.id] = {
      id: socket.id,
      x: Math.random() * 800,
      y: Math.random() * 600,
      angle: 0,
      hp: 100,
      maxHp: 100,
      spikeCount: robotData.spikeCount,
      spikeDistance: robotData.spikeDistance,
      points: 0,
      lastShot: 0
    };
    
    // Send current players to the new player
    socket.emit('currentPlayers', players);
    
    // Notify others
    socket.broadcast.emit('newPlayer', players[socket.id]);
  });

  socket.on('move', (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      players[socket.id].angle = movementData.angle;
      players[socket.id].spikeCount = movementData.spikeCount || players[socket.id].spikeCount;
      players[socket.id].spikeDistance = movementData.spikeDistance || players[socket.id].spikeDistance;
      players[socket.id].points = movementData.points || players[socket.id].points;
      socket.broadcast.emit('playerMoved', players[socket.id]);
    }
  });

  socket.on('shoot', (shotData) => {
    socket.broadcast.emit('playerShot', {
      playerId: socket.id,
      ...shotData
    });
  });

  socket.on('hit', (data) => {
    const targetId = data.targetId;
    const damage = data.damage;
    
    if (players[targetId]) {
      players[targetId].hp -= damage;
      if (players[targetId].hp <= 0) {
        players[targetId].hp = 0;
        io.emit('playerKilled', { targetId, killerId: socket.id });
      } else {
        io.emit('playerHit', { targetId, hp: players[targetId].hp });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
