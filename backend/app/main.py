from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.routers import vault, anemia, diabetes, hypertension, lipids, chat, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to MongoDB...")
    await init_db() 
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend engine for CuraTwin",
    lifespan=lifespan 
)

# Explicitly list your frontend URLs so allow_credentials=True is permitted
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["System"])
async def root_health_check():
    return {"status": "online"}

app.include_router(vault.router, prefix="/api/vault", tags=["Medical Vault"])
app.include_router(anemia.router, prefix="/api/ml/anemia", tags=["Anemia"])
app.include_router(diabetes.router, prefix="/api/ml/diabetes", tags=["Diabetes"])
app.include_router(hypertension.router, prefix="/api/ml/hypertension", tags=["Hypertension"])
app.include_router(lipids.router, prefix="/api/ml/lipids", tags=["Lipids"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])