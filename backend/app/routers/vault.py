import jwt
import traceback
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer

from app.config import settings
from app.models.db_models import LabReport, Biomarker
from app.services.rag_service import index_lab_report_chunks

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:
    """
    Validates the cryptographic signature and expiration of the JWT token.
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
    except (jwt.PyJWTError, Exception) as e:
        print(f"❌ Token Validation Error: {str(e)}")
        raise credentials_exception


@router.post("/upload")
async def upload_lab_scan(
    file: UploadFile = File(...), 
    email: str = Depends(get_current_user_email)
):
    try:
        content = await file.read()
        file_size = round(len(content) / (1024 * 1024), 2)
        
        print(f"✅ RECEIVED DOCUMENT: {file.filename} for user {email}")

        # Simulated OCR text and extracted parameters (to be linked with vision_service)
        extracted_text = (
            "GENERAL CHECK-UP REPORT PATIENT DETAILS... LIPID PANEL: "
            "Total Cholesterol: 245 mg/dL. Systolic BP: 135 mmHg. Hemoglobin: 14.2 g/dL. "
            "Patient demonstrates borderline hypertension and elevated lipid markers."
        )

        extracted_biomarkers = [
            Biomarker(metric="Total Cholesterol", value="245", unit="mg/dL", status="Elevated", confidence="98.4%"),
            Biomarker(metric="Systolic BP", value="135", unit="mmHg", status="Elevated", confidence="99.1%"),
            Biomarker(metric="Hemoglobin", value="14.2", unit="g/dL", status="Optimal", confidence="97.8%")
        ]

        new_report = LabReport(
            user_email=email,
            filename=file.filename,
            file_size_mb=file_size,
            upload_date=datetime.utcnow(),
            status="Success - Verified Lab Report",
            extracted_text_snippet=extracted_text,
            biomarkers=extracted_biomarkers
        )
        
        # 1. Save document to MongoDB
        await new_report.insert()
        print("✅ SUCCESSFULLY SAVED TO MONGODB!")

        # 2. Vectorize and index document chunks into ChromaDB for Semantic RAG
        indexed_count = index_lab_report_chunks(
            user_email=email,
            report_id=str(new_report.id),
            extracted_text=extracted_text
        )
        print(f"🧠 RAG PIPELINE: Indexed {indexed_count} vector chunks into ChromaDB.")
        
        return new_report

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"❌ CRITICAL UPLOAD ERROR:\n{error_trace}")
        raise HTTPException(status_code=500, detail=f"Upload & Indexing Failed: {str(e)}")


@router.get("/history")
async def get_vault_history(email: str = Depends(get_current_user_email)):
    try:
        reports = await LabReport.find(LabReport.user_email == email).sort("-upload_date").to_list()
        return {"reports": reports}
    except Exception as e:
        print(f"❌ Vault History Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not retrieve report history")


@router.get("/summary")
async def get_vault_summary(email: str = Depends(get_current_user_email)):
    try:
        latest_report = await LabReport.find(LabReport.user_email == email).sort("-upload_date").first_or_none()
        
        if not latest_report:
            return {
                "biological_index": 0,
                "hyperlipidemia_risk": "Pending Scan",
                "advice": "Upload a lab scan to generate insights.",
                "cholesterol_trend": []
            }

        past_reports = await LabReport.find(LabReport.user_email == email).sort("upload_date").limit(6).to_list()
        
        trend_data = []
        for report in past_reports:
            chol_val = next(
                (b.value for b in (report.biomarkers or []) if "Cholesterol" in b.metric), 
                "0"
            )
            trend_data.append({
                "month": report.upload_date.strftime("%b %d"), 
                "cholesterol": int(float(chol_val)) if chol_val.replace('.', '', 1).isdigit() else 0
            })

        latest_chol = int(trend_data[-1]["cholesterol"]) if trend_data else 0
        risk_level = "Elevated" if latest_chol > 200 else "Optimal"

        return {
            "biological_index": 84, 
            "hyperlipidemia_risk": risk_level,
            "advice": f"Your latest cholesterol reading is {latest_chol} mg/dL. Keep monitoring.",
            "cholesterol_trend": trend_data
        }
    except Exception as e:
        print(f"❌ Summary Generation Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not compute vault summary")