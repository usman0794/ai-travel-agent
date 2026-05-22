from pydantic import BaseModel
from typing import Optional


class TripCreateSchema(BaseModel):
    destination: str
    days: int
    budget: float


class TripUpdateSchema(BaseModel):
    destination: Optional[str] = None
    days: Optional[int] = None
    budget: Optional[float] = None


class TripResponseSchema(BaseModel):
    id: int
    destination: str
    days: int
    budget: float
    status: str

    class Config:
        from_attributes = True