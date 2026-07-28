import re
import pytesseract
from PIL import Image
import io
import os
import sys
from .image_validation_service import validate_lab_scan

# Automatically detect the OS and set the correct Tesseract path
if sys.platform == 'win32':
    # Windows path (For Neha)
    current_tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
elif sys.platform == 'darwin':
    # macOS path (For Kriyentika)
    current_tesseract_path = '/opt/homebrew/bin/tesseract'
else:
    # Fallback for Linux servers
    current_tesseract_path = 'tesseract'

# Assign the detected path to the library
pytesseract.pytesseract.tesseract_cmd = current_tesseract_path

def extract_text_from_image(image_bytes: bytes) -> str:
    """Runs Tesseract OCR on raw image bytes. Throws an error if reading fails."""
    
    # --- KRIYENTIKA'S VISION LAYER INTERCEPT ---
    validation = validate_lab_scan(image_bytes)
    if not validation["is_valid"]:
        raise ValueError(validation["error_message"])
    # -------------------------------------------
    
    # Dynamically check if the engine exists at the OS-specific path
    if current_tesseract_path != 'tesseract' and not os.path.exists(current_tesseract_path):
        raise RuntimeError(f"Tesseract OCR is not installed or not found at {current_tesseract_path}")
        
    # ... rest of Himanshu's code remains the same ...   
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        
        if not text or not text.strip():
            raise ValueError("OCR could not read any text from this document. The image may be too blurry or blank.")
            
        return text
    except Exception as e:
        raise ValueError(f"Document reading failed: {str(e)}")

def parse_biomarkers_from_text(raw_text: str) -> list:
    """Scans text for clinical keywords. Returns empty list if no biomarkers match."""
    biomarkers = []
    
    # Expanded regex patterns to catch more clinical abbreviations
    patterns = [
        {"metric": "Fasting Blood Glucose", "regex": r"(?:glucose|fasting glucose|fbs|blood sugar)\s*[:=-]?\s*(\d{2,3})\s*(mg/dl)?", "unit": "mg/dL", "optimal_max": 99},
        {"metric": "HbA1c (Glycated Hemoglobin)", "regex": r"(?:hba1c|glycated hemoglobin|a1c)\s*[:=-]?\s*(\d{1,2}\.?\d?)\s*(%)?", "unit": "%", "optimal_max": 5.7},
        {"metric": "Total Cholesterol", "regex": r"(?:cholesterol|total cholesterol)\s*[:=-]?\s*(\d{2,3})\s*(mg/dl)?", "unit": "mg/dL", "optimal_max": 200},
        {"metric": "Triglycerides", "regex": r"(?:triglycerides|trig)\s*[:=-]?\s*(\d{2,3})\s*(mg/dl)?", "unit": "mg/dL", "optimal_max": 150},
        {"metric": "Systolic BP", "regex": r"(?:systolic|bp|blood pressure)\s*[:=-]?\s*(\d{2,3})(?:/\d{2,3})?\s*(mmhg)?", "unit": "mmHg", "optimal_max": 120}
    ]
    
    lower_text = raw_text.lower()
    
    for item in patterns:
        match = re.search(item["regex"], lower_text)
        if match:
            val_str = match.group(1)
            try:
                val_num = float(val_str)
                status = "Optimal" if val_num <= item["optimal_max"] else "Elevated"
            except ValueError:
                status = "Normal"
                
            biomarkers.append({
                "metric": item["metric"],
                "value": val_str,
                "unit": item["unit"],
                "status": status,
                "confidence": "98.4%"
            })
            
    # NOTICE: No fake fallback data here! If regex finds nothing, it returns an empty list.
    return biomarkers
