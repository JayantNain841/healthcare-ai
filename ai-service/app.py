from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# =========================
# ✅ LOAD ARTIFACTS
# =========================
model = joblib.load("model.pkl")
columns = joblib.load("columns.pkl")
scaler = joblib.load("scaler.pkl")

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

        # Clean invalid values
        df.replace([np.inf, -np.inf], 0, inplace=True)

        # =========================
        # ✅ ALIGN COLUMNS
        # =========================
        df = df.reindex(columns=columns, fill_value=0)

        print("FINAL DF:", df)

        # =========================
        # ✅ SCALING (VERY IMPORTANT)
        # =========================
        scaled_input = scaler.transform(df)

        print("SCALED INPUT:", scaled_input)

        # =========================
        # ✅ MODEL PREDICTION
        # =========================
        probs = model.predict_proba(scaled_input)

        print("PROBABILITIES:", probs)

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
        print("ERROR:", str(e))
        return jsonify({"error": str(e)})

# =========================
# ✅ RUN APP
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)