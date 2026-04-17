import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import HealthForm from "../components/HealthForm";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function Prediction() {

  const [result, setResult] = useState(null);

  // ✅ NEW FUNCTION (REPLACES analyze)
  const sendHealthData = async (formData) => {
    try {
      const res = await axios.post("http://localhost:5001/predict", formData);

      console.log("ML RESULT:", res.data); // 🔥 debug

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing data");
    }
  };

  const ml = result?.ml_probability ?? 0;
  const rule = result?.rule_score ?? 0;
  const combined = result?.combined_score ?? 0;

  const chartData = {
    labels: ["ML", "Rule", "Combined"],
    datasets: [
      {
        label: "Scores",
        data: [ml, rule, combined]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8 text-center">
        🧠 Hybrid Health Prediction
      </h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* LEFT PANEL */}
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg">

          <h2 className="text-xl mb-4 text-cyan-400">Patient Parameters</h2>

          {/* 🔥 REPLACED OLD INPUTS */}
          <HealthForm onSubmit={sendHealthData} />

        </div>

        {/* RIGHT PANEL */}
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg">

          <h2 className="text-xl mb-4 text-cyan-400">Result</h2>

          {result ? (
            <>
              {/* Risk Card */}
              <div className={`p-5 rounded-xl mb-5 text-center font-bold text-xl ${
                result.final_risk === "HIGH"
                  ? "bg-red-500/20 border border-red-500 text-red-400"
                  : result.final_risk === "MEDIUM"
                  ? "bg-yellow-500/20 border border-yellow-500 text-yellow-400"
                  : "bg-green-500/20 border border-green-500 text-green-400"
              }`}>
                {result.final_risk} RISK
              </div>

              {/* Scores */}
              <div className="mb-4 text-sm text-gray-300 space-y-1">
                <p>ML Score: {ml.toFixed(2)}</p>
                <p>Rule Score: {rule.toFixed(2)}</p>
                <p>Combined: {combined.toFixed(2)}</p>
              </div>

              {/* Chart */}
              <div className="bg-white p-4 rounded-xl">
                <Bar data={chartData} />
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center mt-10">
              No prediction yet
            </p>
          )}

        </div>

      </div>
    </div>
  );
}