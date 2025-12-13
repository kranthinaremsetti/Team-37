import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your_gemini_api_key_here":
    raise ValueError("GEMINI_API_KEY not found or not set correctly in .env file")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

async def call_llm(prompt: str):
    response = model.generate_content(
        prompt,
        generation_config={"temperature": 0.3}
    )
    return response.text
