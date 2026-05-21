import json
import re

# from app.services.gemini_service import ask_ai

from app.services.groq_service import ask_ai

from app.tools.weather_tool import get_weather
from app.tools.hotel_tool import search_hotels
from app.tools.trip_planner_tool import create_trip_plan


def extract_city_from_message(message: str) -> str:

    prompt = f"""
Extract the city name from this message.

Return only JSON format:
{{"city": "CityName"}}

Message:
{message}
"""

    result = ask_ai(prompt).strip()

    result = result.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(result)
        return data.get("city")

    except Exception:

        match = re.search(r"in ([a-zA-Z\s]+)", message.lower())

        if match:
            return match.group(1).strip().title()

        return None


def ask_travel_agent(message: str, user_id: int):

    lower_message = message.lower()

    # WEATHER TOOL
    if "weather" in lower_message:

        city = extract_city_from_message(message)

        if not city:
            return "Please tell me city name."

        weather_data = get_weather(city)

        final_prompt = f"""
You are a professional travel assistant.

User request:
{message}

Real weather data:
{weather_data}

Reply professionally and clearly.
"""

        return ask_ai(final_prompt)

    # HOTEL TOOL
    if "hotel" in lower_message or "room" in lower_message:

        city = extract_city_from_message(message)

        if not city:
            return "Please tell me city name."

        hotel_data = search_hotels(city)

        final_prompt = f"""
You are a professional AI travel booking assistant.

User request:
{message}

Real hotel API data:
{hotel_data}

Recommend best hotel options clearly.
"""

        return ask_ai(final_prompt)

    # TRIP PLANNER TOOL
    if (
        "plan" in lower_message
        or "itinerary" in lower_message
        or "trip" in lower_message
        or "travel" in lower_message
        or "book" in lower_message
    ):
        return create_trip_plan(message, user_id)

    return ask_ai(message)