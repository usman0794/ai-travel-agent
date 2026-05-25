from fastapi import APIRouter
from app.database.db import SessionLocal
from app.models.user_model import User
from app.schemas.auth_schema import SignupSchema, LoginSchema
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter(tags=["Auth"])


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