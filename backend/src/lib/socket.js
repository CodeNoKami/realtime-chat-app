import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userModel from '../models/user.model.js';

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

io.on('connection', async (socket) => {
   const userId = socket.handshake.query.userId;

   if (userId) {
      // Save socket ID
      userSocketMap[userId] = socket.id;

      // ✅ Mark user as online in DB
      await userModel.findByIdAndUpdate(userId, {
         isOnline: true,
         status: 'online',
      });

      // ✅ Emit updated online users
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
   }

   socket.on('disconnect', async () => {
      if (userId) {
         // Remove user from socket map
         delete userSocketMap[userId];

         // ✅ Mark user as offline and update lastActiveAt
         await userModel.findByIdAndUpdate(userId, {
            isOnline: false,
            status: 'offline',
            lastActiveAt: new Date(),
         });

         // ✅ Emit updated online users
         io.emit('getOnlineUsers', Object.keys(userSocketMap));
      }
   });
});

export { app, io, server };
