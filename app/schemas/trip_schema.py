from pydantic import BaseModel
from typing import Optional


class TripCreateSchema(BaseModel):
    destination: str
    days: int
    budget: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class TripUpdateSchema(BaseModel):
    destination: Optional[str] = None
    days: Optional[int] = None
    budget: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class TripResponseSchema(BaseModel):
    id: int
    destination: str
    days: int
    budget: float
    status: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None

    class Config:
        from_attributes = True