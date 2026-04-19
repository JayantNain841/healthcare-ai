# 🧠 Healthcare AI Web Application

An AI-powered healthcare platform that combines **Machine Learning, Large Language Models (LLMs), and Microservices Architecture** to provide real-time health insights, risk prediction, and AI-assisted diagnosis.

---

## 🌐 Live Demo

👉 https://healthcare-ai-gamma.vercel.app/

---

## 🚀 Features

🫀 Heart Disease Risk Prediction (XGBoost + Calibration)  
🩺 AI Diagnosis from Symptoms (LLM-powered)  
💬 ChatGPT-style Healthcare Assistant  
📊 Interactive Data Visualization (Chart.js)  
🐳 Docker-based Microservices Architecture  
⚙️ CI/CD using GitHub Actions  

---

## 🧠 Core Innovation — Hybrid AI Architecture

Instead of relying on a single model, this system combines multiple approaches:

- **Machine Learning (XGBoost)** → Predicts health risk from structured medical data  
- **Rule-Based Logic** → Adds domain-specific medical insights for better interpretability  
- **LLM (Ollama - Phi3)** → Enables conversational diagnosis and symptom understanding  

This hybrid system improves reliability by combining predictive power, explainability, and natural language reasoning.

---

## 🏗️ Architecture
Frontend (React - Vercel)
↓
Backend (Node.js - Render)
↓
ML Service (Flask - Render)
↓
Amazon S3 (Model Storage)
↓
MongoDB Atlas (Database)
↓
Ollama (LLM via ngrok)


---

## ⚙️ Tech Stack

**Frontend:** React + Tailwind CSS  
**Backend:** Node.js (Express)  
**ML Service:** Flask (Python) + XGBoost  
**Database:** MongoDB Atlas  
**AI:** Ollama (Phi-3 / LLaMA3)  
**Cloud:** AWS S3  
**DevOps:** Docker + GitHub Actions  

---

## 🧠 ML Model

- **Algorithm:** XGBoost Classifier  
- **Calibration:** CalibratedClassifierCV  

### 🔬 Feature Engineering:
- age_squared  
- chol_bp_ratio  
- heart_stress  
- age_chol_ratio  
- bp_chol  

---

## 🔗 API Endpoints

### Backend APIs:

- `POST /chat` → AI chatbot interaction  
- `POST /diagnose` → Symptom-based diagnosis  
- `POST /predict` → Health risk prediction  
- `GET /chat-history` → Retrieve chat history  
- `DELETE /chat-history` → Clear chat history  

---

## ☁️ AWS Usage

- **Amazon S3** is used to store ML model artifacts:
  - `model.pkl`
  - `scaler.pkl`
  - `columns.pkl`

- The ML service dynamically loads these artifacts at runtime, making the system:
  - Lightweight  
  - Scalable  
  - Easy to update without redeployment  

---
🐳 Run Locally

Follow these steps to run the project locally using Docker:

docker-compose up --build

👨‍💻 Author

Jayant

⚠️ Note: Chat functionality depends on local LLM server (Ollama) and may require active backend connectivity.

