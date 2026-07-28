import joblib
import pandas as pd
import os

MODEL_PATH = os.path.join(
    "ml",
    "models",
    "diabetes_model.pkl"
)


model = joblib.load(MODEL_PATH)


def predict_diabetes(data: dict):
    input_data = pd.DataFrame([data])

    prediction = model.predict(input_data)

    probability = model.predict_proba(input_data)[0][1]

    if prediction[0] == 1:
        result = "High Risk"
    else:
        result = "Low Risk"

    return {
        "risk": result,
        "probability": round(float(probability), 2)
    }