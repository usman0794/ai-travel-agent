import json
import requests
from app.services.groq_service import ask_ai


def extract_budget_currency(message: str):
    prompt = f"""
Extract budget amount and currency from this user travel request.

Return JSON only:
{{
  "amount": 15000,
  "currency": "PKR"
}}

Rules:
- currency must be valid ISO code like USD, PKR, GBP, EUR, CNY, RUB, JPY, AED
- if user says yuan, return CNY
- if user says ruble/russian currency, return RUB
- if user says pound, return GBP
- if no budget found, return {{"amount": null, "currency": "USD"}}

User message:
{message}
"""

    result = ask_ai(prompt).strip()
    result = result.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(result)
        amount = data.get("amount")
        currency = data.get("currency", "USD").upper()

        if amount is None:
            return None, "USD"

        return float(amount), currency

    except Exception:
        return None, "USD"


def convert_to_usd(amount, currency):
    if amount is None:
        return None

    currency = currency.upper()

    if currency == "USD":
        return round(float(amount), 2)

    url = f"https://open.er-api.com/v6/latest/{currency}"

    response = requests.get(url, timeout=10)
    response.raise_for_status()

    data = response.json()
    usd_rate = data["rates"]["USD"]

    return round(float(amount) * usd_rate, 2)


def prepare_budget_for_trip(message: str):
    amount, currency = extract_budget_currency(message)

    if amount is None:
        return {
            "budget": None,
            "budget_currency": "USD",
            "estimated_cost_usd": None,
            "enhanced_message": message,
        }

    estimated_cost_usd = convert_to_usd(amount, currency)

    enhanced_message = f"""
{message}

Currency Normalization:
Original Budget: {amount} {currency}
Converted Budget: {estimated_cost_usd} USD

Important:
- Use USD only in final response.
- Hotel, food, transport, activities, and total cost must be in USD.
- Plan according to the converted USD budget.
"""

    return {
        "budget": int(amount),
        "budget_currency": currency,
        "estimated_cost_usd": int(estimated_cost_usd),
        "enhanced_message": enhanced_message,
    }