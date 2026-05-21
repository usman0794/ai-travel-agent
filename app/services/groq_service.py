import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def ask_ai(user_message: str):

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
You are an AI travel assistant.

Directly answer the user's travel request.

You cannot book hotels, flights, or payments.

You only provide:
- travel itineraries
- hotel suggestions
- budget estimates
- travel tips
- weather guidance

Never ask unnecessary introductory questions.
"""
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7
    )

    return chat_completion.choices[0].message.content