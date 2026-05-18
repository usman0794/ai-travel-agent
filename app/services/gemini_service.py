import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
]

def ask_ai(message: str) -> str:
    last_error = None

    for model in MODELS:
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=message
                )
                return response.text

            except Exception as e:
                last_error = e
                print(f"Gemini Error with {model}: {e}")
                time.sleep(2)

    return f"AI service error: {last_error}"