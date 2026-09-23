import jwt
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from app.config import settings
from app.services.rag_service import generate_ai_response
from app.models.db_models import ChatHistory

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class ChatRequest(BaseModel):
    session_id: str
    user_message: str
    patient_context: str = ""


async def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:
    """
    Validates JWT signature and expiry using project settings.
    Prevents token tampering and cross-user data leakage.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (jwt.PyJWTError, Exception):
        raise credentials_exception


@router.post("/")
async def chat_with_ai(
    request: ChatRequest,
    email: str = Depends(get_current_user_email)
):
    try:
        reply = await generate_ai_response(
            session_id=request.session_id,
            user_message=request.user_message,
            user_email=email,
            patient_context=request.patient_context
        )
        return {"reply": reply}
    except Exception as e:
        print(f"❌ Chat POST Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process chat query")


@router.get("/history")
async def get_chat_history(email: str = Depends(get_current_user_email)):
    try:
        # Queries chat sessions matching the authenticated user's email
        history = await ChatHistory.find(ChatHistory.user_email == email).to_list()
        return {"history": history}
    except Exception as e:
        print(f"❌ History Fetch Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not retrieve chat history")