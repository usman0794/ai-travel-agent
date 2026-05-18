import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")

def get_weather(city: str) -> dict:
    if not API_KEY:
        return {"success": False, "error": "WEATHER_API_KEY is missing"}

    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code != 200:
            return {
                "success": False,
                "city": city,
                "error": data.get("message", "Weather not found")
            }

        return {
            "success": True,
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "condition": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"]
        }

    except Exception as e:
        return {"success": False, "error": str(e)}