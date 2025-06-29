const express = require('express');
const router = express.Router();
const {
  analyzeReason,
  getReturnsBySeller,
  getReturnById,
  updateReturn,
  deleteReturn
} = require('../controllers/analyzeController');

// Create (POST)
router.post('/', analyzeReason);

// Read all for a seller
router.get('/seller/:sellerId', getReturnsBySeller);

// Read one by ID
router.get('/:id', getReturnById);

// Update by ID
router.put('/:id', updateReturn);

// Delete by ID
router.delete('/:id', deleteReturn);

module.exports = router;
