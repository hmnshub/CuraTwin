from fastapi import APIRouter
from app.services.diabetes_service import predict_diabetes


router = APIRouter()


@router.post("/predict")
async def diabetes_prediction(data: dict):
    result = predict_diabetes(data)
    return result