const express = require('express');
const { newConversation } = require('../controller/conversation-controller');

const router = express.Router();

router.post('/add', newConversation);

module.exports = router;
