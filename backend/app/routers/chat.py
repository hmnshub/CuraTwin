from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import base64
import json

from app.services.rag_service import generate_ai_response
from app.models.db_models import ChatHistory

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class ChatRequest(BaseModel):
    session_id: str
    user_message: str
    patient_context: str = ""

# 1. BULLETPROOF TOKEN DECODER (Same as Vault!)
async def get_current_user_email(token: str = Depends(oauth2_scheme)):
    try:
        payload_b64 = token.split(".")[1]
        payload_b64 += "=" * ((4 - len(payload_b64) % 4) % 4) 
        payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
        payload = json.loads(payload_json)
        
        email = payload.get("sub")
        if not email:
            raise ValueError("Token missing email field")
        return email
    except Exception as e:
        print(f"Token Decode Error: {str(e)}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")


@router.post("/")
async def chat_with_ai(
    request: ChatRequest, 
    email: str = Depends(get_current_user_email)
):
    try:
        # Pass the email to the service so it can fetch Vault lab reports
        reply = await generate_ai_response(
            session_id=request.session_id,
            user_message=request.user_message,
            user_email=email,  # <-- THIS WAS MISSING
            patient_context=request.patient_context
        )
        
        # Note: We removed the ChatHistory.insert() from here because 
        # rag_service.py is already handling the database memory saving!
        
        return {"reply": reply}
    except Exception as e:
        print(f"❌ Chat POST Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process chat")


@router.get("/history")
async def get_chat_history(email: str = Depends(get_current_user_email)):
    try:
        # 2. SAFER DICTIONARY QUERY
        history = await ChatHistory.find({"user_email": email}).sort("+timestamp").to_list()
        
        return {"history": history}
    except Exception as e:
        print(f"❌ History Fetch Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not retrieve chat history")