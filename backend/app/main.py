# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import vault

# 1. Initialize the FastAPI app instance FIRST
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend engine for CuraTwin: Medical Vault OCR, Random Forest Risk Scoring, and RAG AI Chat."
)

# 2. Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Base health check route
@app.get("/", tags=["System"])
async def root_health_check():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "message": "CuraTwin AI Engine is running and ready for frontend connections."
    }

# 4. Include feature routers AFTER 'app' is defined
app.include_router(vault.router, prefix="/api/vault", tags=["Medical Vault"])