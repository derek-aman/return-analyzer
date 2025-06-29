const { GoogleGenerativeAI } = require('@google/generative-ai');
const ReturnReason = require('../models/ReturnReason');
require('dotenv').config();

// AI classification prompt logic
const classifyReasonWithAI = async (reasonText) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an AI assistant that classifies customer return reasons into one of:
    'Damaged', 'Wrong Size', 'Late Delivery', 'Changed Mind', or 'Other'.

    Classify this reason:
    "${reasonText}"

    Respond ONLY with one of the categories.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

// ✅ CREATE
exports.analyzeReason = async (req, res) => {
  const { userId, productId, sellerId, reasonText } = req.body;

  try {
    const aiPrediction = await classifyReasonWithAI(reasonText);

    const newEntry = new ReturnReason({
      userId,
      productId,
      sellerId,
      reasonText,
      aiPrediction
    });

    await newEntry.save();
    res.status(200).json(newEntry);
  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ error: "Gemini AI prediction failed" });
  }
};

// ✅ READ ALL BY SELLER
exports.getReturnsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const returns = await ReturnReason.find({ sellerId }).sort({ timestamp: -1 });
    res.status(200).json(returns);
  } catch (err) {
    console.error("❌ DB Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch return reasons by seller" });
  }
};

// ✅ READ ONE
exports.getReturnById = async (req, res) => {
  try {
    const returnItem = await ReturnReason.findById(req.params.id);
    if (!returnItem) return res.status(404).json({ error: "Return not found" });
    res.status(200).json(returnItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to get return by ID" });
  }
};

// ✅ UPDATE (with AI reclassification if reasonText is updated)
exports.updateReturn = async (req, res) => {
  try {
    const { reasonText } = req.body;
    let aiPrediction;

    if (reasonText) {
      aiPrediction = await classifyReasonWithAI(reasonText);
    }

    const updatePayload = {
      ...req.body,
      ...(aiPrediction && { aiPrediction })
    };

    const updated = await ReturnReason.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Return not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// ✅ DELETE
exports.deleteReturn = async (req, res) => {
  try {
    const deleted = await ReturnReason.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Return not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
