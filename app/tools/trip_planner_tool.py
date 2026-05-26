import json
import re
from datetime import datetime, timedelta

from app.services.groq_service import ask_ai
from app.services.currency_service import prepare_budget_for_trip
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
  "source": "",
  "destination": "",
  "days": 0
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

        return {
            "source": None,
            "destination": "Kashmir",
            "days": int(days_match.group(1)) if days_match else 3,
        }


def generate_itinerary(destination: str, days: int):
    itinerary_parts = []

    for day in range(1, days + 1):
        if day == 1:
            itinerary_parts.append(
                f"""
Day {day}: Arrival in {destination}
- Hotel check-in
- Explore nearby attractions
- Try local food
"""
            )
        elif day == days:
            itinerary_parts.append(
                f"""
Day {day}: Departure Day
- Breakfast at hotel
- Final sightseeing
- Departure preparation
"""
            )
        else:
            itinerary_parts.append(
                f"""
Day {day}: Explore {destination}
- Visit famous tourist spots
- Try local food
- Shopping and evening activities
"""
            )

    return "\n".join(itinerary_parts)


def create_trip_plan(message: str, user_id: int):
    budget_data = prepare_budget_for_trip(message)

    budget = budget_data["budget"]
    budget_currency = budget_data["budget_currency"]
    estimated_cost_usd = budget_data["estimated_cost_usd"]

    details = extract_trip_details(message)

    source = details.get("source")
    destination = details.get("destination") or "Kashmir"
    days = int(details.get("days") or 3)

    start_date = datetime.now()
    end_date = start_date + timedelta(days=days)

    hotels = search_hotels(destination)
    weather = get_weather(destination)

    hotel_names = []

    if isinstance(hotels, dict):
      for hotel in hotels.get("hotels", [])[:3]:
          hotel_names.append(hotel.get("name", "Unknown Hotel"))

    elif isinstance(hotels, list):
        hotel_names = hotels[:3]

    if estimated_cost_usd is None:
        estimated_hotel_cost_usd = days * 25
        estimated_transport_cost_usd = 15
        estimated_cost_usd = estimated_hotel_cost_usd + estimated_transport_cost_usd

    if budget is None:
        budget = estimated_cost_usd
        budget_currency = "USD"

    itinerary = generate_itinerary(destination, days)

    db = SessionLocal()

    try:
        trip = Trip(
            source=source,
            destination=destination,
            days=days,
            budget=int(budget),
            budget_currency=budget_currency,
            estimated_cost_usd=int(estimated_cost_usd),
            start_date=start_date.strftime("%b %d, %Y"),
            end_date=end_date.strftime("%b %d, %Y"),
            hotels=", ".join(hotel_names),
            selected_hotel=hotel_names[0] if hotel_names else None,
            itinerary=itinerary,
            status="draft",
            user_id=user_id,
        )

        db.add(trip)
        db.commit()

    finally:
        db.close()

    return (
        f"Your {days}-day trip to {destination} is ready. "
        f"Estimated cost: ${int(estimated_cost_usd)} USD. "
        f"Open the trip card to view the full itinerary, hotel, budget, "
        f"weather and travel details."
    )