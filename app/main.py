from fastapi import FastAPI
from app.database.db import engine
from app.services.groq_service import ask_ai
from app.tools.weather_tool import get_weather
from app.agents.travel_agent import ask_travel_agent
from app.tools.hotel_tool import search_hotels
from app.tools.route_tool import get_route_distance
from app.database.db import engine
from app.database.base import Base
from typing import Optional
from app.database.db import SessionLocal
from app.models.trip_model import Trip
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.models.user_model import User
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.services.auth_service import get_current_user_id
from fastapi import Depends

app = FastAPI()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateTripRequest(BaseModel):
    destination: Optional[str] = None
    days: Optional[int] = None
    budget: Optional[int] = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "AI Travel Agent Running"}

@app.get("/test-db")
def test_db():
    try:
        connection = engine.connect()
        connection.close()
        return {"status": "success", "message": "Database connected successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/chat")
def chat(message: str):
    try:
        response = ask_ai(message)
        return {"response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
@app.get("/weather")
def weather(city: str):
    return get_weather(city)

@app.get("/agent")
def agent(
    message: str,
    user_id: int = Depends(get_current_user_id)
):
    if not user_id:
        return {
            "success": False,
            "message": "Unauthorized"
        }

    response = ask_travel_agent(message, user_id)

    return {
        "response": response
    }

@app.get("/hotels")
def hotels(city: str):
    return search_hotels(city)

@app.get("/route")
def route(origin: str, destination: str, mode: str = "drive"):
    return get_route_distance(origin, destination, mode)

@app.get("/trips")
def get_trips(user_id: int = Depends(get_current_user_id)):
    if not user_id:
        return {"success": False, "message": "Unauthorized"}

    db = SessionLocal()

    try:
        trips = db.query(Trip).filter(Trip.user_id == user_id).all()

        return [
            {
                "id": trip.id,
                "destination": trip.destination,
                "days": trip.days,
                "budget": trip.budget,
                "estimated_cost": trip.estimated_cost,
                "hotels": trip.hotels,
                "selected_hotel": trip.selected_hotel,
                "status": trip.status
            }
            for trip in trips
        ]

    finally:
        db.close()

@app.patch("/trips/{trip_id}/confirm")
def confirm_trip(trip_id: int):

    db = SessionLocal()

    try:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()

        if not trip:
            return {
                "success": False,
                "message": "Trip not found"
            }

        trip.status = "confirmed"

        db.commit()
        db.refresh(trip)

        return {
            "success": True,
            "message": "Trip confirmed successfully",
            "trip_id": trip.id,
            "status": trip.status
        }

    finally:
        db.close()

@app.patch("/trips/{trip_id}/cancel")
def cancel_trip(
    trip_id: int,
    user_id: int = Depends(get_current_user_id)
):
    if not user_id:
        return {"success": False, "message": "Unauthorized"}

    db = SessionLocal()

    try:
        trip = db.query(Trip).filter(
            Trip.id == trip_id,
            Trip.user_id == user_id
        ).first()

        if not trip:
            return {"success": False, "message": "Trip not found"}

        trip.status = "cancelled"

        db.commit()
        db.refresh(trip)

        return {
            "success": True,
            "message": "Trip cancelled successfully",
            "trip_id": trip.id,
            "status": trip.status
        }

    finally:
        db.close()

@app.patch("/trips/{trip_id}")
def update_trip(
    trip_id: int,
    data: UpdateTripRequest,
    user_id: int = Depends(get_current_user_id)
):
    if not user_id:
        return {
            "success": False,
            "message": "Unauthorized"
        }

    db = SessionLocal()

    try:
        trip = db.query(Trip).filter(
            Trip.id == trip_id,
            Trip.user_id == user_id
        ).first()

        if not trip:
            return {
                "success": False,
                "message": "Trip not found"
            }

        if data.destination:
            trip.destination = data.destination

        if data.days:
            trip.days = data.days

        if data.budget:
            trip.budget = data.budget

        db.commit()
        db.refresh(trip)

        return {
            "success": True,
            "message": "Trip updated successfully",
            "trip": {
                "id": trip.id,
                "destination": trip.destination,
                "days": trip.days,
                "budget": trip.budget,
                "status": trip.status
            }
        }

    finally:
        db.close()

@app.post("/signup")
def signup(user: SignupRequest):
    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.email == user.email).first()

        if existing_user:
            return {"success": False, "message": "Email already registered"}

        new_user = User(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "message": "User created successfully",
            "user_id": new_user.id
        }

    except Exception as e:
        return {"success": False, "error": str(e)}

    finally:
        db.close()

@app.post("/login")
def login(user: LoginRequest):
    db = SessionLocal()

    try:
        db_user = db.query(User).filter(User.email == user.email).first()

        if not db_user:
            return {"success": False, "message": "Invalid email or password"}

        if not verify_password(user.password, db_user.hashed_password):
            return {"success": False, "message": "Invalid email or password"}

        token = create_access_token({
            "user_id": db_user.id,
            "email": db_user.email
        })

        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "name": db_user.name,
                "email": db_user.email
            }
        }

    finally:
        db.close()