const Groq = require("groq-sdk");
require("dotenv").config();

function fallbackClassify(text = "") {
  const t = text.toLowerCase();
  if (t.includes("broken") || t.includes("crack") || t.includes("damag")) return "Damaged";
  if (t.includes("size") || t.includes("fit")) return "Wrong Size";
  if (t.includes("late") || t.includes("delay")) return "Late Delivery";
  if (t.includes("changed") || t.includes("don't want") || t.includes("dont want")) return "Changed Mind";
  return "Other";
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const classifyReasonWithAI = async (reasonText) => {
  if (!process.env.GROQ_API_KEY) return fallbackClassify(reasonText);

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are an AI assistant that classifies customer return reasons into one of:
'Damaged', 'Wrong Size', 'Late Delivery', 'Changed Mind', or 'Other'.

Classify this reason (answer with only a single category word):
"${reasonText}"`,
        },
      ],
      max_tokens: 10,
    });

    const out = response.choices[0].message.content.trim();
    const allowed = ["Damaged", "Wrong Size", "Late Delivery", "Changed Mind", "Other"];
    return allowed.includes(out) ? out : fallbackClassify(reasonText);
  } catch (err) {
    console.error("Classify Error:", err.message);
    return fallbackClassify(reasonText);
  }
};

module.exports = classifyReasonWithAI;