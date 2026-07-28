import joblib
import pandas as pd


# Load trained model
model = joblib.load("../ml/models/diabetes_model.pkl")

print("Model loaded successfully")


# Sample patient data
patient = pd.DataFrame([{
    "Pregnancies": 2,
    "Glucose": 120,
    "BloodPressure": 70,
    "SkinThickness": 20,
    "Insulin": 100,
    "BMI": 28.5,
    "DiabetesPedigreeFunction": 0.5,
    "Age": 35
}])


# Prediction
prediction = model.predict(patient)


if prediction[0] == 1:
    print("Diabetes risk detected")
else:
    print("No diabetes risk detected")