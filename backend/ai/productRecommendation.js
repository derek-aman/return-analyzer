const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

function fallbackRecommendation() {
  return {
    action: "Discount",
    reason: "Many returns mention sizing/fit or dissatisfaction; discount to move inventory and review size guide."
  };
}

const generateProductRecommendation = async (productId, reasonTextList) => {
  if (!process.env.GEMINI_API_KEY) return fallbackRecommendation();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a retail operations assistant.
Given a list of return reasons for product ${productId}, choose one action:
- Restock (quality is fine; demand is stable)
- Discount (quality ok but high returns from preference/fit)
- Discard (defect/quality issue likely)

Return JSON only like:
{"action":"Restock|Discount|Discard","reason":"short reason"}

Reasons:
${reasonTextList}
`;
  const result = await model.generateContent(prompt);
  // Best effort to parse JSON
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch {
    return fallbackRecommendation();
  }
};

module.exports = generateProductRecommendation;
