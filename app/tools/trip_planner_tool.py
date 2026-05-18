import json
import re

from app.services.gemini_service import ask_ai
from app.tools.hotel_tool import search_hotels
from app.tools.weather_tool import get_weather
from app.database.db import SessionLocal
from app.models.trip_model import Trip


def extract_trip_details(message: str):
    prompt = f"""
Extract travel details from the message.

Return ONLY valid JSON.

Format:
{{
  "destination": "",
  "days": 0,
  "budget": 0
}}

Message:
{message}
"""

    result = ask_ai(prompt).strip()
    result = result.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(result)
    except Exception:
        days_match = re.search(r"(\d+)[-\s]?day", message.lower())
        budget_match = re.search(r"under\s*(\d+)", message.lower())

        return {
            "destination": "Kashmir",
            "days": int(days_match.group(1)) if days_match else 3,
            "budget": int(budget_match.group(1)) if budget_match else 15000
        }


def create_trip_plan(message: str):
    details = extract_trip_details(message)

    destination = details.get("destination") or "Kashmir"
    days = int(details.get("days") or 3)
    budget = int(details.get("budget") or 15000)

    hotels = search_hotels(destination)
    weather = get_weather(destination)

    hotel_names = []

    for hotel in hotels.get("hotels", [])[:3]:
        hotel_names.append(hotel.get("name", "Unknown Hotel"))

    estimated_hotel_cost = days * 5000
    estimated_transport_cost = 3000
    total_estimated_cost = estimated_hotel_cost + estimated_transport_cost

    db = SessionLocal()
    try:
        trip = Trip(
            destination=destination,
            days=days,
            budget=budget,
            estimated_cost=total_estimated_cost,
            hotels=", ".join(hotel_names)
        )

        db.add(trip)
        db.commit()
    finally:
        db.close()

    final_prompt = f"""
You are a professional AI travel planner.

User request:
{message}

Trip details:
Destination: {destination}
Days: {days}
Budget: {budget} PKR

Weather:
{weather}

Hotel options:
{hotel_names}

Estimated hotel cost:
{estimated_hotel_cost} PKR

Estimated transport cost:
{estimated_transport_cost} PKR

Estimated total:
{total_estimated_cost} PKR

Create:
- short itinerary
- recommended hotels
- weather advice
- budget advice
- final estimated cost

Keep response practical and professional.
"""

    return ask_ai(final_prompt)