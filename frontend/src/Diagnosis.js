import React, { useState } from "react";
import axios from "axios";

function Diagnosis() {

  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);

  const diagnose = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/diagnose",
        { symptoms }
      );

      setResult(response.data.diagnosis);

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>AI Disease Diagnosis</h2>

      <input
        type="text"
        placeholder="Enter symptoms (e.g. fever, cough)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <button
        onClick={diagnose}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        Diagnose
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>

          <h3>{result.message}</h3>

          <ul>

            {result.results.map((item, index) => (

              <li key={index}>
                {item.disease} (confidence: {(item.score * 100).toFixed(1)}%)
              </li>

            ))}

          </ul>

          <p style={{ color: "red" }}>
            {result.warning}
          </p>

        </div>
      )}

    </div>
  );
}

export default Diagnosis;