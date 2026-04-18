from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import requests
import io
import os

app = Flask(__name__)

# =========================
# ✅ LOAD FROM S3 FUNCTION
# =========================
def load_from_s3(url):
    response = requests.get(url)
    response.raise_for_status()
    return joblib.load(io.BytesIO(response.content))


# =========================
# 🔗 S3 URLs
# =========================
MODEL_URL = "https://healthcare-ai-bucket-jayant.s3.us-east-1.amazonaws.com/model.pkl"
SCALER_URL = "https://healthcare-ai-bucket-jayant.s3.us-east-1.amazonaws.com/scaler.pkl"
COLUMNS_URL = "https://healthcare-ai-bucket-jayant.s3.us-east-1.amazonaws.com/columns.pkl"


# =========================
# ✅ LOAD ARTIFACTS (on startup)
# =========================
print("🔄 Loading ML artifacts from S3...")

model = load_from_s3(MODEL_URL)
scaler = load_from_s3(SCALER_URL)
columns = load_from_s3(COLUMNS_URL)

print("✅ Model, scaler, and columns loaded successfully")


# =========================
# ✅ HEALTH CHECK ROUTE (important for Render)
# =========================
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "ML Service is running"})


# =========================
# ✅ PREDICT ROUTE
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # =========================
        # ✅ INPUT VALIDATION
        # =========================
        required_fields = ["age", "chol", "trestbps", "thalach", "oldpeak"]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"})

        # =========================
        # ✅ CREATE DATAFRAME
        # =========================
        df = pd.DataFrame([data])
        df.fillna(0, inplace=True)

        # =========================
        # ✅ FEATURE ENGINEERING
        # =========================
        df["age_chol_ratio"] = df["age"] / (df["chol"] + 1)
        df["bp_chol"] = (df["trestbps"] * df["chol"]) / 1000
        df["age_squared"] = df["age"] ** 2
        df["chol_bp_ratio"] = df["chol"] / (df["trestbps"] + 1)
        df["heart_stress"] = (df["oldpeak"] * df["thalach"]) / 100

        df.replace([np.inf, -np.inf], 0, inplace=True)

        # =========================
        # ✅ ALIGN COLUMNS
        # =========================
        df = df.reindex(columns=columns, fill_value=0)

        # =========================
        # ✅ SCALING
        # =========================
        scaled_input = scaler.transform(df)

        # =========================
        # ✅ MODEL PREDICTION
        # =========================
        probs = model.predict_proba(scaled_input)

        class_index = list(model.classes_).index(1)
        prob = probs[0][class_index]

        # =========================
        # ✅ RULE-BASED SCORE
        # =========================
        rule_score = 0

        if data["trestbps"] > 140:
            rule_score += 0.3
        if data["chol"] > 240:
            rule_score += 0.3
        if data["age"] > 50:
            rule_score += 0.2
        if data["thalach"] < 100:
            rule_score += 0.2

        rule_score = min(rule_score, 1.0)

        # =========================
        # ✅ COMBINED SCORE
        # =========================
        combined_score = (prob * 0.7) + (rule_score * 0.3)

        # =========================
        # ✅ FINAL RISK
        # =========================
        if combined_score > 0.75:
            risk = "HIGH"
        elif combined_score > 0.45:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        # =========================
        # ✅ RESPONSE
        # =========================
        return jsonify({
            "ml_probability": float(prob),
            "rule_score": float(rule_score),
            "combined_score": float(combined_score),
            "final_risk": risk
        })

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": str(e)})


# =========================
# ✅ RUN APP (Render Compatible)
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)