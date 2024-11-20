const express = require('express');
const { handleLineWebhook } = require('../controllers/line');

const router = express.Router();

// Line Webhook 路由
router.post('/webhook', handleLineWebhook);

module.exports = router;