import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.preprocessing import StandardScaler

# =========================
# ✅ LOAD DATA
# =========================
df = pd.read_csv("dataset/heart.csv")

# =========================
# ✅ CLEAN DATA
# =========================
df.drop_duplicates(inplace=True)
df = df[df["chol"] > 50]
df = df[df["trestbps"] > 50]
df = df[df["thalach"] > 60]

# =========================
# ✅ FEATURE ENGINEERING
# =========================
df["age_squared"] = df["age"] ** 2
df["chol_bp_ratio"] = df["chol"] / (df["trestbps"] + 1)
df["heart_stress"] = (df["oldpeak"] * df["thalach"]) / 100
df["age_chol_ratio"] = df["age"] / (df["chol"] + 1)
df["bp_chol"] = (df["trestbps"] * df["chol"]) / 1000

df.replace([np.inf, -np.inf], 0, inplace=True)
df.fillna(0, inplace=True)

# =========================
# ✅ SPLIT FEATURES
# =========================
X = df.drop("target", axis=1)
y = df["target"]

# =========================
# ✅ SCALING
# =========================
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# =========================
# ✅ TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

# =========================
# ✅ MODEL (BASE)
# =========================
base_model = XGBClassifier(
    n_estimators=400,
    learning_rate=0.03,
    max_depth=5,
    min_child_weight=3,
    subsample=0.9,
    colsample_bytree=0.9,
    gamma=0.2,
    reg_alpha=0.3,
    reg_lambda=1,
    random_state=42,
    eval_metric="logloss"
)

# =========================
# ✅ CALIBRATED MODEL (FINAL)
# =========================
model = CalibratedClassifierCV(base_model, method="sigmoid", cv=3)

# Train calibrated model
model.fit(X_train, y_train)

# =========================
# ✅ CROSS VALIDATION
# =========================
scores = cross_val_score(base_model, X_scaled, y, cv=5)
print("🔥 Cross Validation Accuracy:", scores.mean())

# =========================
# ✅ EVALUATION
# =========================
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"🔥 Model Accuracy: {accuracy:.4f}")

# =========================
# ✅ DEBUG CHECK
# =========================
print("Classes:", model.classes_)
print("Sample probabilities:", model.predict_proba(X_test[:5]))

# =========================
# ✅ SAVE FILES (IMPORTANT)
# =========================
joblib.dump(model, "model.pkl")        
joblib.dump(scaler, "scaler.pkl")
joblib.dump(list(X.columns), "columns.pkl")



print("✅ Model saved successfully")