from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.vault import OCRUploadResponse
from app.services.ocr_service import extract_text_from_image, parse_biomarkers_from_text

router = APIRouter()

@router.post("/upload", response_model=OCRUploadResponse)
async def upload_lab_report(file: UploadFile = File(...)):
    """Accepts a medical report image/PDF, runs OCR, and strictly validates biomarkers."""
    if not file.filename.endswith(('.png', '.jpg', '.jpeg', '.pdf')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload PNG, JPG, or PDF.")
        
    contents = await file.read()
    file_size_mb = round(len(contents) / (1024 * 1024), 2)
    
    # 1. Run Tesseract OCR
    try:
        raw_text = extract_text_from_image(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    # 2. Parse clinical metrics
    extracted_biomarkers = parse_biomarkers_from_text(raw_text)
    
    # 3. STRICT VALIDATION: If no biomarkers were found, reject as Invalid Document!
    if not extracted_biomarkers:
        raise HTTPException(
            status_code=400, 
            detail="Invalid Document: Could not detect any recognized clinical biomarkers (Glucose, HbA1c, Cholesterol, BP) in this image. Please upload a clear medical lab report."
        )
    
    return {
        "filename": file.filename,
        "file_size_mb": file_size_mb,
        "status": "Success - Verified Lab Report",
        "extracted_text_snippet": raw_text[:150] + "..." if len(raw_text) > 150 else raw_text,
        "biomarkers": extracted_biomarkers
    }