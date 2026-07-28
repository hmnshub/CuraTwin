# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
# 1. IMPORT ALL 5 ROUTERS (Vault + 4 ML Modules)
from app.routers import vault, anemia, diabetes, hypertension, lipids

# 2. Initialize the FastAPI app instance FIRST
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend engine for CuraTwin: Medical Vault OCR, Random Forest Risk Scoring, and RAG AI Chat."
)

# 3. Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Base health check route
@app.get("/", tags=["System"])
async def root_health_check():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "message": "CuraTwin AI Engine is running and ready for frontend connections."
    }

# 5. Include feature routers AFTER 'app' is defined
app.include_router(vault.router, prefix="/api/vault", tags=["Medical Vault"])

# --- CLINICAL ML MODULES (Developer 1 to 4) ---
app.include_router(anemia.router, prefix="/api/ml/anemia", tags=["Anemia & Hematology Engine"])
app.include_router(diabetes.router, prefix="/api/ml/diabetes", tags=["Pre-Diabetes & Glycemic Engine"])
app.include_router(hypertension.router, prefix="/api/ml/hypertension", tags=["Hypertension Risk Engine"])
app.include_router(lipids.router, prefix="/api/ml/lipids", tags=["Hyperlipidemia Risk Engine"])