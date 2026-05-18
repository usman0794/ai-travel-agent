import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEOAPIFY_API_KEY")


def geocode_location(place: str):
    url = "https://api.geoapify.com/v1/geocode/search"

    params = {
        "text": place,
        "format": "json",
        "limit": 1,
        "apiKey": API_KEY
    }

    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    if not data.get("results"):
        return None

    result = data["results"][0]

    return {
        "name": place,
        "lat": result["lat"],
        "lon": result["lon"],
        "formatted": result.get("formatted")
    }


def get_route_distance(origin: str, destination: str, mode: str = "drive"):
    if not API_KEY:
        return {"success": False, "error": "GEOAPIFY_API_KEY is missing"}

    start = geocode_location(origin)
    end = geocode_location(destination)

    if not start:
        return {"success": False, "error": f"Origin not found: {origin}"}

    if not end:
        return {"success": False, "error": f"Destination not found: {destination}"}

    url = "https://api.geoapify.com/v1/routing"

    params = {
        "waypoints": f"{start['lat']},{start['lon']}|{end['lat']},{end['lon']}",
        "mode": mode,
        "apiKey": API_KEY
    }

    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    if response.status_code != 200 or not data.get("features"):
        return {
            "success": False,
            "error": data.get("message", "Route not found")
        }

    properties = data["features"][0]["properties"]

    distance_km = round(properties["distance"] / 1000, 2)
    duration_minutes = round(properties["time"] / 60, 0)

    return {
        "success": True,
        "origin": start,
        "destination": end,
        "mode": mode,
        "distance_km": distance_km,
        "duration_minutes": duration_minutes
    }