import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { app, server } from './lib/socket.js';

import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'];

app.use(
   cors({
      origin: function (origin, callback) {
         // allow requests with no origin like mobile apps or curl requests
         if (!origin) return callback(null, true);
         if (allowedOrigins.includes(origin)) {
            callback(null, true);
         } else {
            callback(new Error('CORS policy: This origin is not allowed'));
         }
      },
      credentials: true,
   })
);

app.use(json({ limit: '50MB' }));
app.use(urlencoded({ limit: '50MB', extended: true }));
app.use(cookieParser());

app.use('/auth', userRoutes);
app.use('/messages', messageRoutes);

const PORT = process.env.PORT;

server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
   connectDB();
});
