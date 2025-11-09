import express from 'express';
import { upload } from '../utils/upload.js';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import { Readable } from 'stream';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log('File route handler:', req.method, req.path);
    next();
});

// File upload route
router.post('/upload', (req, res, next) => {
    console.log('Upload middleware starting');
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Upload middleware error:', err);
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    console.log('Upload request received', {
        file: req.file ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file'
    });

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create a unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const safeOriginalname = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
        const filename = `${safeOriginalname}-${timestamp}-${randomString}`;

        // Create GridFS bucket
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        // Create a readable stream from buffer
        const readStream = new Readable();
        readStream.push(req.file.buffer);
        readStream.push(null);

        // Create upload stream
        const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
            metadata: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype
            }
        });

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
                size: req.file.size
            });
        });

        // Handle upload errors
        uploadStream.on('error', (error) => {
            console.error('Upload stream error:', error);
            res.status(500).json({
                error: 'File upload failed',
                details: error.message
            });
        });

        // Start the upload
        readStream.pipe(uploadStream);

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'File upload failed',
            details: error.message
        });
    }
});

// File download route
router.get('/:filename', async (req, res) => {
    try {
        console.log('Download request for file:', req.params.filename);
        
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        const file = await mongoose.connection.db
            .collection('uploads.files')
            .findOne({ filename: req.params.filename });

        if (!file) {
            console.log('File not found:', req.params.filename);
            return res.status(404).json({ error: 'File not found' });
        }

        console.log('Found file:', {
            filename: file.filename,
            contentType: file.metadata?.mimetype
        });

        // Set appropriate headers
        res.set('Content-Type', file.metadata?.mimetype || 'application/octet-stream');
        res.set('Cache-Control', 'public, max-age=31536000');

        if (!file.metadata?.mimetype?.startsWith('image/')) {
            res.set('Content-Disposition', `attachment; filename="${file.metadata?.originalname || file.filename}"`);
        }

        // Stream the file
        const downloadStream = bucket.openDownloadStreamByName(file.filename);
        downloadStream.pipe(res);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            error: 'File download failed',
            details: error.message
        });
    }
});

export default router;