from beanie import Document
from pydantic import BaseModel, EmailStr, Field
from typing import List
from datetime import datetime

# --- CHAT MODELS ---
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)

class ChatHistory(Document):
    session_id: str
    messages: List[Message] = []
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "chat_history"

# --- USER MODELS ---
class User(Document):
    email: str
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "users"
        use_state_management = True

        from pydantic import BaseModel, Field
from beanie import Document
from typing import List
from datetime import datetime

class Biomarker(BaseModel):
    metric: str
    value: str
    unit: str
    status: str
    confidence: str

class LabReport(Document):
    user_email: str
    filename: str
    file_size_mb: float
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    status: str
    extracted_text_snippet: str
    biomarkers: List[Biomarker]

    class Settings:
        name = "lab_reports"