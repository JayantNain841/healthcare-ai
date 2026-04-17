# 🧠 Healthcare AI Web Application

An AI-powered healthcare platform combining Machine Learning, LLMs, and Microservices.

---

## 🚀 Features

* 🫀 Heart Disease Risk Prediction (XGBoost + Calibration)
* 🩺 AI Diagnosis from Symptoms (Ollama LLM)
* 💬 ChatGPT-style Healthcare Assistant
* 📊 Interactive Data Visualization
* 🐳 Docker-based Microservices Architecture
* ⚙️ CI/CD using GitHub Actions

---

## 🏗️ Architecture

Frontend (React)
↓
Backend (Node.js - Express)
↓
Flask ML Service (XGBoost Model)
↓
MongoDB (Chat Storage)
↓
Ollama (LLM - Diagnosis)

---

## ⚙️ Tech Stack

* Frontend: React + Tailwind CSS
* Backend: Node.js (Express)
* ML Service: Flask + XGBoost
* Database: MongoDB
* AI: Ollama (phi3 / llama3)
* DevOps: Docker + GitHub Actions

---

## 🧠 ML Model

* Algorithm: XGBoost Classifier
* Calibration: CalibratedClassifierCV
* Feature Engineering:

  * age_squared
  * chol_bp_ratio
  * heart_stress

---

## 🐳 Run Locally

```bash
docker-compose up --build
```

---

## 🔥 CI/CD

This project uses GitHub Actions for:

* Automated builds
* Dependency checks
* Deployment pipeline

---

## 📂 Project Structure

```
frontend/
backend/
ai-service/
dataset/
docker-compose.yml
```

---

## 👨‍💻 Author

Jayant 
