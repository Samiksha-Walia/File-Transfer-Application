import multer from 'multer';
//import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();  // Load .env file

const storage = multer.memoryStorage({
    url: process.env.MONGO_URI,  // ✅ Using your MongoDB URI from .env
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        const filename = `${Date.now()}-messenger-${file.originalname}`;

        if (match.indexOf(file.mimetype) === -1) {
            return {
                bucketName: 'photos',
                filename: filename
            };
        }

        return {
            bucketName: 'photos',  // ✅ GridFS collection will be 'photos.files' and 'photos.chunks'
            filename: filename
        };
    }
});

export const upload = multer({ storage });
