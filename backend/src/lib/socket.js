import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: [process.env.CLIENT_URL, 'http://localhost:5173'], // allow these origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // allow these HTTP methods (optional)
      credentials: true, // if you want to allow cookies or credentials
   },
});

export const getReceiverSocketId = (userId) => userSocketMap[userId];

// used for store online users
const userSocketMap = {};

io.on('connection', (socket) => {
   const userId = socket.handshake.query.userId;
   if (userId) userSocketMap[userId] = socket.id;
   io.emit('getOnlineUsers', Object.keys(userSocketMap));

   socket.on('disconnect', () => {
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
   });
});

export { app, io, server };
