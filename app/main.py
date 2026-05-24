from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine
from app.services.groq_service import ask_ai
from app.tools.weather_tool import get_weather
from app.tools.hotel_tool import search_hotels
from app.tools.route_tool import get_route_distance

from app.routes.auth_routes import router as auth_router
from app.routes.trip_routes import router as trip_router
from app.routes.agent_routes import router as agent_router


app = FastAPI(title="AI Travel Agent API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:3000","https://your-vercel-app.vercel.app",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(trip_router)
app.include_router(agent_router)


@app.get("/")
def home():
    return {"message": "AI Travel Agent API is running"}


@app.get("/test-db")
def test_db():
    try:
        connection = engine.connect()
        connection.close()

        return {
            "status": "success",
            "message": "Database connected successfully",
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }


@app.get("/chat")
def chat(message: str):
    try:
        response = ask_ai(message)

        return {
            "response": response,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }


@app.get("/weather")
def weather(city: str):
    return get_weather(city)


@app.get("/hotels")
def hotels(city: str):
    return search_hotels(city)


@app.get("/route")
def route(origin: str, destination: str, mode: str = "drive"):
    return get_route_distance(origin, destination, mode)