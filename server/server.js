import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import messageRoutes from './routes/message.js';
import fileRoutes from './routes/file-routes.js';
import authRoutes from './routes/auth.js';
import conversationRoutes from './routes/conversation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Increase payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Add connection status middleware
app.use((req, res, next) => {
    if (!mongoose.connection.readyState) {
        return res.status(503).json({ error: 'Database connection not ready' });
    }
    next();
});

// Routes with error handling
app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/file', fileRoutes);

// Handle uploads path for backward compatibility
app.use('/uploads/:filename', async (req, res, next) => {
    // Redirect to the new path
    res.redirect(`/api/file/${req.params.filename}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Add connection status middleware
app.use((req, res, next) => {
    if (!mongoose.connection.readyState) {
        return res.status(503).json({ error: 'Database connection not ready' });
    }
    next();
});

// Connect MongoDB and initialize GridFS before starting server
const startServer = async () => {
    try {
        await connectDB();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`File upload endpoint: http://localhost:${PORT}/api/file/upload`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

