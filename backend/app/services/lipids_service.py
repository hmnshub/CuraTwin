import joblib
import os

# Safely locate and load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml_artifacts/lipids_rf.joblib")
lipids_model = joblib.load(MODEL_PATH)

def evaluate_lipid_risk(age: int, bmi: float, total_cholesterol: float, triglycerides: float) -> dict:
    """
    Predicts hyperlipidemia risk using the trained Random Forest model.
    """
    # The model expects a 2D array of features in the exact order they were trained
    input_features = [[age, bmi, total_cholesterol, triglycerides]]
    
    # Predict the risk (0 = Normal, 1 = Elevated Risk)
    prediction = lipids_model.predict(input_features)[0]
    
    if prediction == 1:
        return {
            "risk_level": "Elevated",
            "clinical_guidance": "Consider saturated fat reduction and increased aerobic cardiovascular exercise."
        }
    else:
        return {
            "risk_level": "Optimal",
            "clinical_guidance": "Lipid levels are healthy. Maintain current dietary habits."
        }