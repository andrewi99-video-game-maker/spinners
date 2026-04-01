import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const useMultiplayer = (robotData) => {
  const [socket, setSocket] = useState(null);
  const playersRef = useRef({});
  const projectilesRef = useRef([]);
  const myIdRef = useRef(null);
  const myHpRef = useRef(robotData ? robotData.chassis.hp : 100);
  
  // We still provide a way to trigger React re-renders for UI elements (like labels)
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      myIdRef.current = newSocket.id;
      newSocket.emit('join', robotData);
    });

    newSocket.on('currentPlayers', (serverPlayers) => {
      playersRef.current = serverPlayers;
      setPlayerList(Object.keys(serverPlayers));
    });

    newSocket.on('newPlayer', (player) => {
      playersRef.current[player.id] = player;
      setPlayerList(Object.keys(playersRef.current));
    });

    newSocket.on('playerMoved', (player) => {
      if (playersRef.current[player.id]) {
        playersRef.current[player.id].x = player.x;
        playersRef.current[player.id].y = player.y;
        playersRef.current[player.id].angle = player.angle;
        playersRef.current[player.id].spikeCount = player.spikeCount;
        playersRef.current[player.id].points = player.points;
      }
    });

    newSocket.on('playerShot', (shotData) => {
      projectilesRef.current.push({
        id: Math.random(),
        x: shotData.x,
        y: shotData.y,
        angle: shotData.angle,
        ownerId: shotData.playerId,
        damage: shotData.damage,
        color: shotData.color
      });
    });

    newSocket.on('playerHit', ({ targetId, hp }) => {
      if (playersRef.current[targetId]) {
        playersRef.current[targetId].hp = hp;
      }
      if (targetId === myIdRef.current) {
        myHpRef.current = hp;
      }
    });

    newSocket.on('playerKilled', ({ targetId, killerId }) => {
      if (targetId === myIdRef.current) {
        // Handle local death elsewhere or via callback
      }
      delete playersRef.current[targetId];
      setPlayerList(Object.keys(playersRef.current));
    });

    newSocket.on('playerDisconnected', (id) => {
      delete playersRef.current[id];
      setPlayerList(Object.keys(playersRef.current));
    });

    return () => newSocket.close();
  }, [robotData]);

  const move = (movementData) => {
    if (socket) socket.emit('move', movementData);
  };

  const shoot = (shotData) => {
    if (socket) socket.emit('shoot', shotData);
  };

  const notifyHit = (targetId, damage) => {
    if (socket) socket.emit('hit', { targetId, damage });
  };

  return { socket, playersRef, projectilesRef, move, shoot, notifyHit, myId: myIdRef.current, playerList };
};
