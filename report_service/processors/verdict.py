from llm import call_llm

async def generate_verdict(score, strengths, weaknesses):
    prompt = f"""
    Create a final verdict based on:

    Final Score: {score}
    Strengths: {strengths}
    Weaknesses: {weaknesses}

    Output 2–3 sentences + Final Recommendation:
    (Shortlist / Consider / Reject)
    """
    return await call_llm(prompt)
