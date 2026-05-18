from fastapi import FastAPI
from app.database.db import engine
from app.services.gemini_service import ask_ai
from app.tools.weather_tool import get_weather
from app.agents.travel_agent import ask_travel_agent
from app.tools.hotel_tool import search_hotels
from app.tools.route_tool import get_route_distance

from app.database.db import engine
from app.database.base import Base

from app.database.db import SessionLocal
from app.models.trip_model import Trip

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

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
def ai_agent(message: str):
    response = ask_travel_agent(message)
    return {"response": response}


@app.get("/hotels")
def hotels(city: str):
    return search_hotels(city)


@app.get("/route")
def route(origin: str, destination: str, mode: str = "drive"):
    return get_route_distance(origin, destination, mode)


@app.get("/trips")
def get_trips():

    db = SessionLocal()

    trips = db.query(Trip).all()

    result = []

    for trip in trips:
        result.append({
            "id": trip.id,
            "destination": trip.destination,
            "days": trip.days,
            "budget": trip.budget,
            "estimated_cost": trip.estimated_cost,
            "hotels": trip.hotels
        })

    db.close()

    return result