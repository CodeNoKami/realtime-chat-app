import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import path from 'path';
import { app, server } from './lib/socket.js';

import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

app.use(
   cors({
      origin: ['http://localhost:5173'],
      credentials: true,
   })
);
app.use(json({ limit: '50MB' }));
app.use(urlencoded({ limit: '50MB', extended: true }));
app.use(cookieParser());

app.use('/auth', userRoutes);
app.use('/messages', messageRoutes);

const PORT = process.env.PORT;
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, '../frontend/dist')));

   app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
   });
}

server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
   connectDB();
});
