from pydantic import BaseModel
from typing import List, Optional

class BiomarkerResult(BaseModel):
    metric: str
    value: str
    unit: str
    status: str
    confidence: str

class OCRUploadResponse(BaseModel):
    filename: str
    file_size_mb: float
    status: str
    extracted_text_snippet: Optional[str] = None
    biomarkers: List[BiomarkerResult]