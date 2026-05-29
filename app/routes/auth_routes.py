from fastapi import APIRouter, Header
from jose import JWTError, jwt

from app.database.db import SessionLocal
from app.models.user_model import User
from app.schemas.auth_schema import SignupSchema, LoginSchema, ChangePasswordSchema

from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)

router = APIRouter(tags=["Auth"])

def get_user_from_token(authorization: str):
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except JWTError:
        return None

@router.post("/signup")
def signup(user: SignupSchema):
    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.email == user.email).first()

        if existing_user:
            return {"success": False, "message": "Email already registered"}

        new_user = User(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(user.password),
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "message": "User created successfully",
            "user_id": new_user.id,
        }

    finally:
        db.close()


@router.post("/login")
def login(user: LoginSchema):
    db = SessionLocal()

    try:
        db_user = db.query(User).filter(User.email == user.email).first()

        if not db_user:
            return {"success": False, "message": "Invalid email or password"}

        if not verify_password(user.password, db_user.hashed_password):
            return {"success": False, "message": "Invalid email or password"}

        token = create_access_token({
            "user_id": db_user.id,
            "email": db_user.email,
        })

        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "name": db_user.name,
                "email": db_user.email,
                "profile_picture": db_user.profile_picture,
            },
        }

    finally:
        db.close()

@router.post("/change-password")
def change_password(data: ChangePasswordSchema, authorization: str = Header(None)):
    user_id = get_user_from_token(authorization)

    if not user_id:
        return {"success": False, "message": "Unauthorized"}

    db = SessionLocal()

    try:
        db_user = db.query(User).filter(User.id == user_id).first()

        if not db_user:
            return {"success": False, "message": "User not found"}

        if not verify_password(data.current_password, db_user.hashed_password):
            return {"success": False, "message": "Current password is incorrect"}

        if len(data.new_password) < 6:
            return {"success": False, "message": "New password must be at least 6 characters"}

        db_user.hashed_password = hash_password(data.new_password)

        db.commit()

        return {"success": True, "message": "Password changed successfully"}

    finally:
        db.close()