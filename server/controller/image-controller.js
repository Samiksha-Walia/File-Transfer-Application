import { mongoose } from '../database.js';
import { GridFSBucket } from 'mongodb';
import mime from 'mime-types';

const url = 'http://localhost:5000';

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
                code: 'NO_FILE'
            });
        }

        // File is already saved by multer-gridfs-storage
        const fileUrl = `${url}/api/file/${req.file.filename}`;
        return res.status(200).json({
            url: fileUrl,
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size
        });

    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
            error: 'Error uploading file',
            details: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
};




export const getImage = async (req, res) => {
    try {
        const db = mongoose.connection.client.db();
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        const file = await db.collection('uploads.files').findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

        downloadStream.on('error', (error) => {
            console.error('Stream error:', error);
            res.status(404).json({ message: "File not found" });
        });

        // Determine content type from filename
        const contentType = mime.lookup(file.filename) || 'application/octet-stream';
        res.set('Content-Type', contentType);

        // Set cache control headers
        res.set('Cache-Control', 'public, max-age=31557600'); // Cache for 1 year
        res.set('Last-Modified', file.uploadDate.toUTCString());

        // Set download header for non-viewable files
        const isViewable = contentType.startsWith('image/') || contentType.startsWith('video/') || contentType === 'application/pdf';
        if (!isViewable) {
            res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
        }
        
        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error in getImage:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

