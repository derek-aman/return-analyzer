const { GoogleGenerativeAI } = require('@google/generative-ai');
const ReturnReason = require('../models/ReturnReason');
require('dotenv').config();

exports.analyzeReason = async (req, res) => {
    const { userId, productId, reasonText } = req.body;

    try {
        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create prompt with instruction + user input
        const prompt = `
        You are an AI assistant that classifies customer return reasons into categories like:
        'Damaged', 'Wrong Size', 'Late Delivery', 'Changed Mind', or 'Other'.
        
        Classify the following return reason:
        "${reasonText}"
        
        Respond ONLY with one of the above categories.
        `;

        // Send prompt to Gemini
        const result = await model.generateContent(prompt);
        const aiPrediction = result.response.text().trim();

        // Save in DB
        const newEntry = new ReturnReason({ userId, productId, reasonText, aiPrediction });
        await newEntry.save();

        res.status(200).json(newEntry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gemini AI prediction failed" });
    }
};
