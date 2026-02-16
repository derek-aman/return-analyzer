const mongoose = require("mongoose");

const returnReasonSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  sellerId: String,
  reasonText: String,
  aiPrediction: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReturnReason", returnReasonSchema);
