import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import { fileURLToPath } from 'url';

import messageRoutes from './routes/message.js';
import { uploadImage, getImage } from './controller/image-controller.js';
import { upload } from './utils/upload.js';
import fileRoutes from './routes/file-routes.js';
import authRoutes from './routes/auth.js';
import conversationRoutes from './routes/conversation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/conversation', conversationRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/file', fileRoutes);

// Connect MongoDB and start server
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});

