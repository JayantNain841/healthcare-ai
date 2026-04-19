import React, { useState } from "react";
import axios from "axios";

export default function Diagnosis() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleDiagnose = async () => {
    if (!input.trim()) {
      alert("Please enter symptoms");
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/diagnose`, {
        symptoms: input
      });

      setResult(res.data.response);
    } catch (err) {
      console.error(err);
      setResult("Error diagnosing");
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl mb-4">AI Disease Diagnosis</h2>

      {/* INPUT */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter symptoms (e.g. chest pain, fatigue)"
        className="w-96 p-3 rounded bg-slate-700 border border-slate-600"
      />

      {/* BUTTON */}
      <button
        onClick={handleDiagnose}
        className="ml-4 px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-600"
      >
        Diagnose
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-6 p-4 bg-slate-800 rounded">
          <h3 className="font-bold mb-2">Diagnosis Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}