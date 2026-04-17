import React, { useState } from "react";

const HealthForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    age: "",
    trestbps: "",
    chol: "",
    thalach: "",
    oldpeak: ""
  });

  // 🔥 FIXED HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(name, value); // 🔥 DEBUG

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const formattedData = {
      age: Number(form.age),
      trestbps: Number(form.trestbps),
      chol: Number(form.chol),
      thalach: Number(form.thalach),
      oldpeak: Number(form.oldpeak),
    };

    console.log("FINAL DATA SENT:", formattedData); // 🔥 DEBUG

    onSubmit(formattedData);
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg text-white mb-4">
      <h2 className="font-bold mb-2">Enter Health Data</h2>

      <input
        type="number"
        name="age"
        placeholder="Age"
        onChange={handleChange}
        className="w-full p-2 mb-2 text-black rounded"
      />

      <input
        type="number"
        name="trestbps"
        placeholder="Blood Pressure"
        onChange={handleChange}
        className="w-full p-2 mb-2 text-black rounded"
      />

      <input
        type="number"
        name="chol"
        placeholder="Cholesterol"
        onChange={handleChange}
        className="w-full p-2 mb-2 text-black rounded"
      />

      <input
        type="number"
        name="thalach"
        placeholder="Heart Rate (thalach)"
        onChange={handleChange}
        className="w-full p-2 mb-2 text-black rounded"
      />

      <input
        type="number"
        name="oldpeak"
        placeholder="Oldpeak (stress level)"
        step="0.1"
        onChange={handleChange}
        className="w-full p-2 mb-2 text-black rounded"
      />

      <button
        onClick={handleSubmit}
        className="mt-2 bg-green-600 px-4 py-2 rounded"
      >
        Analyze Risk
      </button>
    </div>
  );
};

export default HealthForm;