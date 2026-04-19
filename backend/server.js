require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const connectDB = require("./db");
const Chat = require("./models/Chat");
const axios = require("axios");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

/* -----------------------------
   ENV VARIABLES
------------------------------*/
const ML_URL = process.env.ML_SERVICE_URL;
const OLLAMA_URL = process.env.OLLAMA_URL;

/* -----------------------------
   HEART RULE ENGINE
------------------------------*/
function heartRuleScore(symptomsText) {
  const symptoms = (symptomsText || "").toLowerCase();
  let score = 0;

  if (symptoms.includes("chest pain")) score += 0.3;
  if (symptoms.includes("shortness of breath")) score += 0.25;
  if (symptoms.includes("fatigue")) score += 0.2;
  if (symptoms.includes("dizziness")) score += 0.15;
  if (symptoms.includes("sweating")) score += 0.1;

  return Math.min(score, 1);
}

/* -----------------------------
   LOAD DATASET
------------------------------*/
let diseases = [];

fs.createReadStream("./dataset/dataset.csv")
  .pipe(csv())
  .on("data", (row) => diseases.push(row))
  .on("end", () => {
    console.log("✅ Dataset loaded:", diseases.length);
  });

/* -----------------------------
   PREDICT (ML SERVICE)
------------------------------*/
app.post("/predict", async (req, res) => {
  try {
    const mappedData = {
      age: Number(req.body.age),
      trestbps: Number(req.body.trestbps),
      chol: Number(req.body.chol),
      thalach: Number(req.body.thalach),
      oldpeak: Number(req.body.oldpeak),
    };

    const response = await axios.post(
      `${ML_URL}/predict`,
      mappedData
    );

    res.json(response.data);

  } catch (error) {
    console.error("Predict Error:", error.message);

    res.json({
      ml_probability: 0,
      rule_score: 0,
      combined_score: 0,
      final_risk: "ERROR",
    });
  }
});

/* -----------------------------
   HYBRID PREDICT
------------------------------*/
app.post("/hybrid-predict", async (req, res) => {
  try {
    const { data, symptoms } = req.body;

    const mappedData = {
      age: data?.[0],
      sex: data?.[1],
      cp: data?.[2],
      trestbps: data?.[3],
      chol: data?.[4],
      fbs: data?.[5],
      restecg: data?.[6],
      thalach: data?.[7],
      exang: data?.[8],
      oldpeak: data?.[9],
      slope: data?.[10],
      ca: data?.[11],
      thal: data?.[12],
    };

    const response = await axios.post(
      `${ML_URL}/predict`,
      mappedData
    );

    const mlProb = response.data.ml_probability;
    const ruleScore = heartRuleScore(symptoms || "");
    const combinedScore = 0.7 * mlProb + 0.3 * ruleScore;

    let finalRisk = "LOW";
    if (combinedScore > 0.7) finalRisk = "HIGH";
    else if (combinedScore > 0.4) finalRisk = "MEDIUM";

    res.json({
      ml_probability: mlProb,
      rule_score: ruleScore,
      combined_score: combinedScore,
      final_risk: finalRisk,
    });

  } catch (error) {
    console.error("Hybrid Error:", error.message);
    res.status(500).json({ error: "Hybrid model failed" });
  }
});

/* -----------------------------
   AI CHAT (OLLAMA)
------------------------------*/
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    await Chat.create({ role: "user", content: userMessage });

    const ollamaRes = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: "phi3",
        prompt: userMessage,
        stream: false,
      }
    );

    const aiReply = ollamaRes.data.response;

    await Chat.create({ role: "assistant", content: aiReply });

    res.json({ response: aiReply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Error in chat" });
  }
});

/* -----------------------------
   DIAGNOSE
------------------------------*/
app.post("/diagnose", async (req, res) => {
  try {
    const { symptoms } = req.body;

    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: "phi3",
        prompt: `You are a medical assistant. Symptoms: ${symptoms}. Give disease and advice.`,
        stream: false,
      }
    );

    res.json({
      response: response.data.response || "No response",
    });

  } catch (err) {
    console.error("Diagnose error:", err);
    res.status(500).json({ error: "Diagnosis failed" });
  }
});

/* -----------------------------
   CHAT HISTORY
------------------------------*/
app.get("/chat-history", async (req, res) => {
  const chats = await Chat.find().sort({ timestamp: 1 });
  res.json(chats);
});

app.delete("/chat-history", async (req, res) => {
  await Chat.deleteMany({});
  res.json({ message: "Chat cleared" });
});

/* -----------------------------
   FILE UPLOAD
------------------------------*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded",
    file: req.file.filename,
  });
});

/* -----------------------------
   HEALTH CHECK
------------------------------*/
app.get("/", (req, res) => {
  res.send("🚀 Healthcare AI Backend Running");
});

/* -----------------------------
   START SERVER
------------------------------*/
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});