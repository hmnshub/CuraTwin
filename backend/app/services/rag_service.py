# app/services/rag_service.py
from app.models.db_models import ChatHistory, Message

async def generate_ai_response(session_id: str, user_message: str, patient_context: str) -> str:
    # 1. Fetch existing chat history from MongoDB, or create a new one
    chat_session = await ChatHistory.find_one(ChatHistory.session_id == session_id)
    if not chat_session:
        chat_session = ChatHistory(session_id=session_id, messages=[])

    # 2. Add the user's new message to the database memory
    chat_session.messages.append(Message(role="user", content=user_message))
    await chat_session.save()

    # 3. Build the prompt for the LLM
    system_prompt = f"""
    You are CuraTwin's clinical AI assistant.
    Patient Lab Context: {patient_context}
    """
    
    # ==========================================
    # 4. LLM INTEGRATION GOES HERE
    # (e.g., response = gemini_model.generate_content(system_prompt + user_message))
    # For right now, we will return a smart placeholder so the frontend can test the DB:
    # ==========================================
    
    ai_reply = f"Based on your labs: {patient_context}, I received your question: '{user_message}'. (LLM API pending)"

    # 5. Save the AI's response to MongoDB memory
    chat_session.messages.append(Message(role="assistant", content=ai_reply))
    await chat_session.save()

    return ai_reply