const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Simple fallback if no API key (helps dev without internet/key)
function fallbackClassify(text = "") {
  const t = text.toLowerCase();
  if (t.includes("broken") || t.includes("crack") || t.includes("damag")) return "Damaged";
  if (t.includes("size") || t.includes("fit")) return "Wrong Size";
  if (t.includes("late") || t.includes("delay")) return "Late Delivery";
  if (t.includes("changed") || t.includes("don’t want") || t.includes("dont want")) return "Changed Mind";
  return "Other";
}

const classifyReasonWithAI = async (reasonText) => {
  if (!process.env.GEMINI_API_KEY) return fallbackClassify(reasonText);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an AI assistant that classifies customer return reasons into one of:
'Damaged', 'Wrong Size', 'Late Delivery', 'Changed Mind', or 'Other'.

Classify this reason (answer with only a single category word):
"${reasonText}"
`;
  const result = await model.generateContent(prompt);
  const out = result.response.text().trim();
  // guardrail
  const allowed = ["Damaged","Wrong Size","Late Delivery","Changed Mind","Other"];
  return allowed.includes(out) ? out : fallbackClassify(reasonText);
};

module.exports = classifyReasonWithAI;
