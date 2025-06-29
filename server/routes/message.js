import express from 'express';
import { newMessage, getMessage } from '../controller/message-controller.js';

const router = express.Router();

router.post('/add', newMessage);
router.get('/get/:id', getMessage);

export default router;
