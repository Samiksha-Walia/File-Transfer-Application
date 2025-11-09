import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import mongoose from 'mongoose';
import { newConversation } from '../controller/conversation-controller.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();



// middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// Endpoint to update profile picture
router.post('/upload-profile-picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Processing profile picture upload:', {
      userId: req.userId,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    // Create GridFS bucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const ext = path.extname(req.file.originalname);
    const filename = `profile-${req.userId}-${timestamp}-${randomString}${ext}`;

    // Create upload stream
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        userId: req.userId,
        type: 'profile-picture',
        originalname: req.file.originalname
      }
    });

    // Create readable stream from buffer
    const readStream = new Readable();
    readStream.push(req.file.buffer);
    readStream.push(null);

    // Wait for upload to complete
    await new Promise((resolve, reject) => {
      readStream.pipe(uploadStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    const fileUrl = `${serverUrl}/api/file/${filename}`;

    // Update user with the new file URL
    const updatedUser = await User.findByIdAndUpdate(
      req.userId, 
      { profilePicture: `/api/file/${filename}` },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return full URL to client
    res.json({ 
      imageUrl: fullImageUrl,
      message: 'Profile picture updated successfully' 
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload image', error: err.message });
  }
});

// DELETE /api/auth/remove-profile-picture
router.delete('/remove-profile-picture', verifyToken, async (req, res) => {
  try {
    console.log('DELETE /remove-profile-picture hit');

    await User.findByIdAndUpdate(req.userId, { profilePicture: '' });
    res.status(200).json({ message: 'Profile picture removed' });
  } catch (err) {
    console.error('Failed to remove image:', err);
    res.status(500).json({ message: 'Failed to remove profile picture' });
  }
});


// GET /api/auth/other-users
router.get('/other-users', verifyToken, async (req, res) => {
  console.log("Fetching other users for user:", req.userId);
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select('username _id profilePicture');
    // Convert all relative paths to full URLs
    const usersWithFullUrls = users.map(user => ({
      ...user.toObject(),
      profilePicture: user.profilePicture 
        ? `http://localhost:5000${user.profilePicture}` 
        : user.profilePicture
    }));
    res.json(usersWithFullUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/auth/user
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username profilePicture about');
    
    // If there's a profile picture, ensure it's a full URL
    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    const profilePictureUrl = user.profilePicture
      ? user.profilePicture.startsWith('http')
        ? user.profilePicture
        : `${serverUrl}${user.profilePicture}`
      : '';
    
    console.log('Sending user data:', {
      username: user.username,
      profilePicture: profilePictureUrl
    });

    res.json({ 
      username: user.username, 
      _id: user._id, 
      profilePicture: profilePictureUrl, 
      about: user.about 
    });
  } catch (err) {
    console.error('Error retrieving user:', err);
    res.status(500).json({ message: 'Error retrieving user' });
  }
});


// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username,userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/update-profile
router.put('/update-profile', verifyToken, async (req, res) => {
  const { username, about } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { username, about },
      { new: true, runValidators: true }
    ).select('username about profilePicture');

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

router.post('/conversation/add',newConversation);





export default router;



