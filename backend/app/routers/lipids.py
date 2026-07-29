from fastapi import APIRouter
from pydantic import BaseModel
from app.services.lipids_service import evaluate_lipid_risk

router = APIRouter()

# This defines the exact data shape React is allowed to send
class LipidFeatures(BaseModel):
    age: int
    bmi: float
    total_cholesterol: float
    triglycerides: float

@router.post("/predict")
def predict_lipids(features: LipidFeatures):
    # Pass the data from React directly into your trained ML model
    return evaluate_lipid_risk(
        age=features.age,
        bmi=features.bmi,
        total_cholesterol=features.total_cholesterol,
        triglycerides=features.triglycerides
    )