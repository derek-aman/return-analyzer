const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateSellerSummary = async (reasonsFormatted) => {
  if (!process.env.GROQ_API_KEY) {
    return `Summary (fallback): ${reasonsFormatted.split("\n").length} returns. Consider better packaging, clearer sizing charts, and shipping SLAs.`;
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a smart AI analyst for e-commerce sellers.
Given the following return reasons and their categories, do the following:

- Summarize return patterns
- Give percentage breakdowns per category
- Suggest 3-5 actionable insights

Returns:
${reasonsFormatted}`,
        },
      ],
      max_tokens: 1000,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("Summary Error:", err.message);
    return `Summary unavailable. Error: ${err.message}`;
  }
};

module.exports = generateSellerSummary;
