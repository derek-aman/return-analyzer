const ReturnReason = require("../models/ReturnReason");
const classifyReasonWithAI = require("../ai/classifyReason");
const generateSellerSummary = require("../ai/sellerSummary");
const generateProductRecommendation = require("../ai/productRecommendation");

// CREATE + classify
exports.analyzeReason = async (req, res) => {
  const { userId, productId, sellerId, reasonText } = req.body;
  try {
    const aiPrediction = await classifyReasonWithAI(reasonText);
    const newEntry = await ReturnReason.create({
      userId, productId, sellerId, reasonText, aiPrediction
    });
    res.status(200).json(newEntry);
  } catch (err) {
    console.error("AI/Create Error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
};

// READ ALL by seller
exports.getReturnsBySeller = async (req, res) => {
  try {
    const returns = await ReturnReason.find({ sellerId: req.params.sellerId })
      .sort({ timestamp: -1 });
    res.status(200).json(returns);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch by seller" });
  }
};

// READ ONE
exports.getReturnById = async (req, res) => {
  try {
    const ret = await ReturnReason.findById(req.params.id);
    if (!ret) return res.status(404).json({ error: "Return not found" });
    res.status(200).json(ret);
  } catch {
    res.status(500).json({ error: "Failed to get by ID" });
  }
};

// UPDATE (reclassify if reasonText provided)
exports.updateReturn = async (req, res) => {
  try {
    let updatePayload = { ...req.body };
    if (req.body.reasonText) {
      updatePayload.aiPrediction = await classifyReasonWithAI(req.body.reasonText);
    }
    const updated = await ReturnReason.findByIdAndUpdate(
      req.params.id, updatePayload, { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Return not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// DELETE
exports.deleteReturn = async (req, res) => {
  try {
    const deleted = await ReturnReason.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Return not found" });
    res.status(200).json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};

// AI summary for seller
exports.analyzeSellerReturns = async (req, res) => {
  try {
    const returns = await ReturnReason.find({ sellerId: req.params.sellerId });
    if (!returns.length) return res.status(404).json({ message: "No returns for this seller." });

    const formatted = returns
      .map((r, i) => `${i + 1}. ${r.reasonText} → (${r.aiPrediction})`).join("\n");

    const aiSummary = await generateSellerSummary(formatted);
    res.status(200).json({ summary: aiSummary });
  } catch (err) {
    console.error("Summary Error:", err);
    res.status(500).json({ error: "Summary failed" });
  }
};

// Product recommendation via AI
exports.smartRecommendation = async (req, res) => {
  try {
    const returns = await ReturnReason.find({ productId: req.params.productId });
    if (!returns.length) return res.status(404).json({ message: "No returns for this product." });

    const list = returns.map(r => `- ${r.reasonText} → (${r.aiPrediction})`).join("\n");
    const recommendation = await generateProductRecommendation(req.params.productId, list);
    res.status(200).json({ recommendation });
  } catch (err) {
    console.error("Recommendation Error:", err);
    res.status(500).json({ error: "Recommendation failed" });
  }
};

// Utilities for quick testing
exports.clearAll = async (_req, res) => {
  await ReturnReason.deleteMany({});
  res.json({ message: "All cleared" });
};

exports.listAll = async (_req, res) => {
  const all = await ReturnReason.find().sort({ timestamp: -1 });
  res.json(all);
};
