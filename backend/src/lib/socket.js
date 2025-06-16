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
      userSocketMap[userId] = socket.id;

      await userModel.findByIdAndUpdate(
         userId,
         {
            isOnline: true,
            status: 'online',
         },
         {
            new: true,
         }
      );

      io.emit('getOnlineUsers', Object.keys(userSocketMap));
   }

   socket.on('disconnect', async () => {
      if (userId) {
         delete userSocketMap[userId];

         await userModel.findByIdAndUpdate(
            userId,
            {
               isOnline: false,
               status: 'offline',
               lastActiveAt: new Date(),
            },
            {
               new: true,
            }
         );

         io.emit('getOnlineUsers', Object.keys(userSocketMap));
      }
   });
});

export { app, io, server };
