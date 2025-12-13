from llm import call_llm

async def generate_strengths(worker):
    prompt = f"""
    List 5–7 strengths of this project based on:

    - structure
    - code quality
    - commit patterns
    - snippet quality
    - architecture
    - routes

    Output as a plain bullet list.
    """
    raw = await call_llm(prompt)
    return [s.strip("-• ") for s in raw.split("\n") if s.strip()]
