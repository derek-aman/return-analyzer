const express = require("express");
const router = express.Router();

const {
  analyzeReason,
  getReturnsBySeller,
  analyzeSellerReturns,
  smartRecommendation,
  getReturnById,
  updateReturn,
  deleteReturn,
  clearAll,
  listAll
} = require("../controllers/analyzeController");

// Health/simple utilities
router.get("/all", listAll);
router.delete("/all", clearAll);

// Main endpoints
router.post("/analyze", analyzeReason);
router.get("/seller/:sellerId", getReturnsBySeller);
router.get("/seller/:sellerId/summary", analyzeSellerReturns);
router.get("/product/:productId/recommend", smartRecommendation);
router.get("/:id", getReturnById);
router.put("/:id", updateReturn);
router.delete("/:id", deleteReturn);

module.exports = router;
