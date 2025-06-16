import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { app, server } from './lib/socket.js';

import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const allowedOrigins = process.env.CLIENT_URL
   ? process.env.CLIENT_URL.split(',')
   : ['http://localhost:5173'];

app.use(
   cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: false,
   })
);

app.use(json({ limit: '50MB' }));
app.use(urlencoded({ limit: '50MB', extended: true }));
app.use(cookieParser());

app.use('/auth', userRoutes);
app.use('/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
   .then(() => {
      server.listen(PORT, () => {
         console.log(`🚀 Server running on port ${PORT}`);
      });
   })
   .catch((err) => {
      console.error('❌ DB connection failed. Server not started.');
      console.error(err);
      process.exit(1);
   });
