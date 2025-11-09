import multer from 'multer';
import { MongoClient, GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import dotenv from 'dotenv';
dotenv.config();

let gfsBucket;

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db();
gfsBucket = new GridFSBucket(db, { bucketName: 'uploads' });

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Log the incoming file details
        console.log('Received file:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        cb(null, true);
    }
});

export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const stream = Readable.from(file.buffer);

        // Generate a unique filename that matches the one Multer would create
const uniqueFilename = file.originalname.replace(/[^a-zA-Z0-9]/g, '-');
const timestamp = Date.now();
const randomString = Math.random().toString(36).substring(7);
const filename = `${uniqueFilename}-${timestamp}-${randomString}`;

const uploadStream = gfsBucket.openUploadStream(filename, {
            contentType: file.mimetype,
            metadata: { 
                originalname: file.originalname,
                filename: filename
            }
        });

        stream.pipe(uploadStream);

        uploadStream.on('finish', () => {
            res.status(200).json({ message: 'File uploaded successfully', id: uploadStream.id });
        });

        uploadStream.on('error', (err) => {
            res.status(500).json({ error: err.message });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { upload };
