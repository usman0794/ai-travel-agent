from pydantic import BaseModel, EmailStr


class SignupSchema(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    success: bool
    access_token: str
    token_type: str