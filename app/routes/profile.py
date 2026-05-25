import os
import cloudinary
import cloudinary.uploader

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user_model import User
from app.services.auth_service import get_current_user_id

from pydantic import BaseModel
from app.services.auth_service import verify_password, hash_password

router = APIRouter(prefix="/profile", tags=["Profile"])

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str

@router.post("/upload-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = cloudinary.uploader.upload(
        file.file,
        folder="ai-travel-agent/profile-pictures",
        public_id=f"user_{user.id}",
        overwrite=True,
        resource_type="image",
    )

    image_url = result.get("secure_url")

    user.profile_picture = image_url
    db.commit()
    db.refresh(user)

    return {
        "message": "Profile picture uploaded successfully",
        "profile_picture": image_url,
    }


@router.put("/change-password")
def change_password(
    data: ChangePasswordSchema,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.hashed_password = hash_password(data.new_password)

    db.commit()

    return {"message": "Password changed successfully"}