from llm import call_llm

async def generate_weaknesses(worker):
    prompt = f"""
    List weaknesses of this project.

    Consider:
    - missing README
    - missing tests
    - unclear architecture parts
    - large unexplained LOC
    - missing documentation

    Output as a bullet list.
    """
    raw = await call_llm(prompt)
    return [w.strip("-• ") for w in raw.split("\n") if w.strip()]
