require("dotenv").config();
const mongoose = require("mongoose");
const ReturnReason = require("../models/ReturnReason");
const classifyReasonWithAI = require("../ai/classifyReason");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/returns_ai";

const seedData = [
  { userId: "u1", productId: "pA", sellerId: "s1", reasonText: "The zipper was broken when it arrived." },
  { userId: "u2", productId: "pA", sellerId: "s1", reasonText: "It came two weeks late, missed the event." },
  { userId: "u3", productId: "pB", sellerId: "s1", reasonText: "Size L fits like S, too tight." },
  { userId: "u4", productId: "pB", sellerId: "s2", reasonText: "Changed my mind after purchase." },
  { userId: "u5", productId: "pC", sellerId: "s2", reasonText: "Box was dented and item scratched." },
  { userId: "u6", productId: "pC", sellerId: "s2", reasonText: "Color slightly different than expected." }
];

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Seeding…");
  await ReturnReason.deleteMany({});

  for (const item of seedData) {
    const aiPrediction = await classifyReasonWithAI(item.reasonText);
    await ReturnReason.create({ ...item, aiPrediction });
    console.log(`Inserted: ${item.reasonText} -> ${aiPrediction}`);
  }

  console.log("Done.");
  await mongoose.disconnect();
  process.exit(0);
})();
