from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import timedelta

from app.models.db_models import User
from app.services.auth_service import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserCreate):
    try:
        existing_user = await User.find_one({"email": payload.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_pwd = get_password_hash(payload.password)
        new_user = User(email=payload.email, hashed_password=hashed_pwd)
        await new_user.insert()
        
        return {"message": "User successfully created."}
    except HTTPException as he:
        raise he
    except Exception as e:
        # Now it will actually print the real error to your terminal!
        print(f"CRITICAL DB ERROR: {str(e)}") 
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one({"email": form_data.username})
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}