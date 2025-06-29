import { mongoose } from '../database.js';
import { GridFSBucket } from 'mongodb';
import mime from 'mime-types';

const url = 'http://localhost:5000';

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const db = mongoose.connection.client.db();
        const bucket = new GridFSBucket(db, { bucketName: 'photos' });

        const filename = `${Date.now()}-${req.file.originalname}`;
        const uploadStream = bucket.openUploadStream(filename);
        uploadStream.end(req.file.buffer);

        uploadStream.on('finish', () => {
            const fileUrl = `${url}/api/file/${filename}`;
            return res.status(200).json({
                url: fileUrl,
                filename: filename
            });
        });

        uploadStream.on('error', (error) => {
            console.log(error);
            res.status(500).send('Error uploading file.');
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error uploading file.');
    }
};




export const getImage = async (req, res) => {
    try {
        const db = mongoose.connection.client.db();
        const bucket = new GridFSBucket(db, { bucketName: 'photos' });

        const file = await db.collection('photos.files').findOne({ filename: req.params.filename });

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

        // Optional: force download for non-images
        if (!contentType.startsWith('image/')) {
            res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
        }
        
        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error in getImage:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

