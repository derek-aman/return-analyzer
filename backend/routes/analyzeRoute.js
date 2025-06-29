const express = require('express');
const router = express.Router();
const { analyzeReason } = require('../controllers/analyzeController');

router.post('/', analyzeReason);

module.exports = router;
