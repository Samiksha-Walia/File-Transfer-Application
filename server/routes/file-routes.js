import express from 'express';
import { upload } from '../utils/upload.js';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import path from 'path';

const router = express.Router();

// Debug middleware to log requests
router.use((req, res, next) => {
    console.log('File route accessed:', req.method, req.path);
    next();
});

// File upload route
router.post('/upload', (req, res, next) => {
    console.log('Upload middleware starting...');
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: 'File upload error', details: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log('Processing uploaded file...');
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create a unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const ext = path.extname(req.file.originalname);
        const basename = path.basename(req.file.originalname, ext);
        const safeBasename = basename.replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `${safeBasename}-${timestamp}-${randomString}${ext}`;

        // Create GridFS upload stream
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
            metadata: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype
            }
        });

        // Create readable stream from buffer and pipe to GridFS
        const readStream = new Readable();
        readStream.push(req.file.buffer);
        readStream.push(null);
        
        // Handle upload completion
        uploadStream.on('finish', () => {
            const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
            const fileUrl = `${serverUrl}/api/file/${filename}`;
            console.log('File uploaded successfully:', {
                filename,
                url: fileUrl,
                type: req.file.mimetype
            });
            
            res.json({
                url: fileUrl,
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size,
                filename: filename
            });
        });

        // Handle upload error
        uploadStream.on('error', (error) => {
            console.error('Upload stream error:', error);
            res.status(500).json({ error: 'File upload failed', details: error.message });
        });

        // Start the upload
        readStream.pipe(uploadStream);

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'File upload failed', details: error.message });
    }
});

// File download route
router.get('/:filename', async (req, res) => {
    try {
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        console.log('Looking for file:', req.params.filename);

        // Log the request details
        console.log('File request details:', {
            filename: req.params.filename,
            url: req.url,
            headers: req.headers
        });

        const file = await mongoose.connection.db
            .collection('uploads.files')
            .findOne({ filename: req.params.filename });

        if (!file) {
            console.log('File not found:', req.params.filename);
            return res.status(404).json({ error: 'File not found' });
        }

        console.log('Found file:', file.filename);

        // Set the proper content type
        const contentType = file.metadata?.mimetype || 'application/octet-stream';
        res.set('Content-Type', contentType);
        
        // Set caching headers for better performance
        res.set('Cache-Control', 'public, max-age=31536000');
        
        // Set the content disposition
        if (!contentType.startsWith('image/')) {
            res.set('Content-Disposition', `attachment; filename="${file.metadata?.originalname || file.filename}"`);
        }

        // Create a download stream and pipe it to the response
        const downloadStream = bucket.openDownloadStream(file._id);
        
        // Handle stream errors
        downloadStream.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error streaming file' });
            }
        });

        // Pipe the file to the response
        downloadStream.pipe(res);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'File download failed', details: error.message });
    }
});

export default router;

