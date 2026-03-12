const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const { Ollama } = require("ollama");

const app = express();
app.use(cors());
app.use(express.json());

const ollama = new Ollama();

let diseases = [];

/* -----------------------------
   Load Dataset
------------------------------*/
fs.createReadStream("../dataset/dataset.csv")
  .pipe(csv())
  .on("data", (row) => diseases.push(row))
  .on("end", () => {
    console.log("Dataset loaded:", diseases.length);
  });

/* -----------------------------
   Common diseases priority
------------------------------*/
const commonDiseases = [
  "Common Cold",
  "Flu",
  "Viral Fever",
  "Allergy",
  "Sinusitis"
];

/* -----------------------------
   Extract symptoms
------------------------------*/
function extractSymptoms(text) {

  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/[^a-z ,]/g, "")
    .split(/[ ,]+/)
    .filter(word => word.length > 2);

}

/* -----------------------------
   AI Chat Assistant
------------------------------*/
app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    const response = await ollama.chat({
      model: "phi3",
      messages: [{ role: "user", content: userMessage }]
    });

    res.json({
      reply: response.message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI assistant failed"
    });

  }

});

/* -----------------------------
   Disease Diagnosis
------------------------------*/
app.post("/diagnose", (req, res) => {

  const userSymptoms = extractSymptoms(req.body.symptoms);

  if (userSymptoms.length < 2) {
    return res.json({
      diagnosis: {
        message: "Please enter at least 2 symptoms.",
        results: [],
        warning: ""
      }
    });
  }

  let results = [];

  diseases.forEach(disease => {

    const diseaseSymptoms = Object.values(disease)
      .slice(1)
      .map(s => s.toLowerCase().replace(/_/g, " ").trim())
      .filter(Boolean);

    let matchCount = 0;

    userSymptoms.forEach(symptom => {

      diseaseSymptoms.forEach(ds => {

        if (ds.includes(symptom) || symptom.includes(ds)) {
          matchCount++;
        }

      });

    });

    const ratio = matchCount / diseaseSymptoms.length;

    if (ratio > 0) {
      results.push({
        disease: disease.Disease,
        score: ratio
      });
    }

  });

  /* -----------------------------
     Remove Duplicate Diseases
  ------------------------------*/
  let uniqueDiseases = {};

  results.forEach(item => {

    if (!uniqueDiseases[item.disease] || uniqueDiseases[item.disease] < item.score) {
      uniqueDiseases[item.disease] = item.score;
    }

  });

  results = Object.keys(uniqueDiseases).map(d => ({
    disease: d,
    score: uniqueDiseases[d]
  }));

  /* -----------------------------
     Sort by score
  ------------------------------*/
  results.sort((a, b) => b.score - a.score);

  /* -----------------------------
     Prefer common diseases
  ------------------------------*/
  results = results.sort((a, b) => {

    if (commonDiseases.includes(a.disease)) return -1;
    if (commonDiseases.includes(b.disease)) return 1;

    return b.score - a.score;

  });

  const topResults = results.slice(0, 3);

  res.json({
    diagnosis: {
      message: "Possible conditions (AI estimation only)",
      results: topResults,
      warning:
        "⚠ This is an AI-assisted symptom checker, not a medical diagnosis. Please consult a doctor."
    }
  });

});

/* -----------------------------
   Test route
------------------------------*/
app.get("/", (req, res) => {
  res.send("Healthcare AI Backend Running");
});

/* -----------------------------
   Start server
------------------------------*/
app.listen(5000, () => {
  console.log("Server running on port 5000");
});