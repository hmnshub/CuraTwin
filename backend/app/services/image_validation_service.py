import cv2
import numpy as np
from typing import Dict, Any

def validate_lab_scan(image_bytes: bytes) -> Dict[str, Any]:
    """
    Evaluates an uploaded lab scan (in memory) for blurriness and general quality 
    before routing it to the OCR engine.
    """
    # Convert raw memory bytes into an OpenCV image array
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return {"is_valid": False, "error_message": "Invalid file format or corrupted image."}

    # Convert the image to grayscale for accurate contour/edge detection
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 1. Check for Blurriness using the Variance of Laplacian
    laplacian_variance = cv2.Laplacian(gray_image, cv2.CV_64F).var()
    blur_threshold = 100.0 
    
    if laplacian_variance < blur_threshold:
        return {
            "is_valid": False, 
            "error_message": "The uploaded scan is too blurry. Please retake the photo in good lighting."
        }

    return {"is_valid": True, "error_message": None}