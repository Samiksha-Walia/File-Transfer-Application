import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let gfs;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        const db = conn.connection.db;
        gfs = new GridFSBucket(db, {
            bucketName: 'uploads'
        });
        
        console.log('MongoDB Connected and GridFS initialized');
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export { mongoose, connectDB, gfs };
