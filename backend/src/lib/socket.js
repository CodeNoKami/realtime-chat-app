import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import userModel from '../models/user.model.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.CLIENT_URL
   ? process.env.CLIENT_URL.split(',') // support multiple comma-separated origins
   : ['http://localhost:5173'];

const io = new Server(server, {
   cors: {
      origin: (origin, callback) => {
         callback(null, origin || '*'); // Reflect origin
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   },
});

export const getReceiverSocketId = (userId) => userSocketMap[userId];

const userSocketMap = {};

io.on('connection', async (socket) => {
   const userId = socket.handshake.query.userId;

   if (userId) {
      userSocketMap[userId] = socket.id;

      await userModel.findByIdAndUpdate(userId, {
         isOnline: true,
         status: 'online',
      });

      io.emit('getOnlineUsers', Object.keys(userSocketMap));
   }

   socket.on('disconnect', async () => {
      if (userId) {
         delete userSocketMap[userId];

         await userModel.findByIdAndUpdate(userId, {
            isOnline: false,
            status: 'offline',
            lastActiveAt: new Date(),
         });

         io.emit('getOnlineUsers', Object.keys(userSocketMap));
      }
   });
});

export { app, io, server };
