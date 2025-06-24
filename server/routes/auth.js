const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

require('dotenv').config();





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

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}${ext}`);
  },
});
const upload = multer({ storage });

// Endpoint to update profile picture
router.post('/upload-profile-picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('Uploaded file:', req.file);
    const imagePath = `http://localhost:5000/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.userId, { profilePicture: imagePath });
    res.json({ imageUrl: imagePath });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload image' });
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
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/auth/user
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username profilePicture about');
    res.json(user);
  } catch (err) {
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
    res.json({ token, username: user.username });
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


module.exports = router;



