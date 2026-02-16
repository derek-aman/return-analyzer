const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();





const app = express();
app.use(cors());
app.use(express.json());
const analyzeRoute = require("./routes/analyzeRoute");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Error", err));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/analyze", analyzeRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
