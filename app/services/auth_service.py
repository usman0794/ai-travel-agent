from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from fastapi import Header
from jose import JWTError

SECRET_KEY = "usman_jami_is_the_best"  # In production, use a secure method to store this
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


from fastapi import Header
from jose import JWTError


from fastapi import Header
from jose import JWTError

def get_current_user_id(Authorization: str = Header(None)):

    if not Authorization:
        return None

    try:
        token = Authorization.replace("Bearer ", "")

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload.get("user_id")

    except JWTError:
        return None