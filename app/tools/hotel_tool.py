import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEOAPIFY_API_KEY")


def geocode_city(city: str):
    url = "https://api.geoapify.com/v1/geocode/search"

    params = {
        "text": city,
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
        "lat": result["lat"],
        "lon": result["lon"],
        "city": result.get("city", city),
        "country": result.get("country")
    }


def search_hotels(city: str):
    if not API_KEY:
        return {"success": False, "error": "GEOAPIFY_API_KEY is missing"}

    location = geocode_city(city)

    if not location:
        return {"success": False, "error": f"City not found: {city}"}

    url = "https://api.geoapify.com/v2/places"

    params = {
        "categories": "accommodation.hotel",
        "filter": f"circle:{location['lon']},{location['lat']},10000",
        "bias": f"proximity:{location['lon']},{location['lat']}",
        "limit": 10,
        "apiKey": API_KEY
    }

    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    hotels = []

    for place in data.get("features", []):
        properties = place.get("properties", {})

        hotels.append({
            "name": properties.get("name", "Unnamed Hotel"),
            "address": properties.get("formatted"),
            "city": properties.get("city"),
            "country": properties.get("country"),
            "latitude": properties.get("lat"),
            "longitude": properties.get("lon"),
            "distance_meters": properties.get("distance")
        })

    return {
        "success": True,
        "search_city": city,
        "location": location,
        "hotels": hotels
    }