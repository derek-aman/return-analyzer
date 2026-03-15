const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const generateSellerSummary = async (reasonsFormatted) => {
  if (!process.env.GEMINI_API_KEY) {
    // quick fallback summary
    return `Summary (fallback): ${reasonsFormatted.split("\n").length} returns. Consider better packaging, clearer sizing charts, and shipping SLAs.`;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are a smart AI analyst for e-commerce sellers.
Given the following return reasons and their categories, do the following:

- Summarize return patterns
- Give percentage breakdowns per category
- Suggest 3-5 actionable insights

Returns:
${reasonsFormatted}
`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

module.exports = generateSellerSummary;
