from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.rag_service import generate_ai_response
from app.models.db_models import ChatHistory, User
from app.services.auth_service import get_current_user # <-- Import the bouncer

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: str
    user_message: str
    patient_context: str

# Notice the Depends(get_current_user) injection here:
@router.post("/")
async def chat_with_ai(
    request: ChatRequest, 
    current_user: User = Depends(get_current_user) # <-- The route is now locked!
):
    try:
        # You can now even log which user is asking the question if you want!
        # print(f"User {current_user.email} asked a question.")
        
        reply = await generate_ai_response(
            session_id=request.session_id,
            user_message=request.user_message,
            patient_context=request.patient_context
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))