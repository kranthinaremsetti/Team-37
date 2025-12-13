from llm import call_llm

async def generate_concept_mastery(worker):
    prompt = f"""
     You must follow these rules strictly:
1. Base your analysis ONLY on visible evidence: snippets, entry files, commit messages, and languages.
2. Do NOT assume or invent algorithms, architecture layers, or logic if not clearly shown.
3. If the snippets are too small or generic to evaluate concept mastery, state that limitation.
4. Tone must be concise, professional, and judge-friendly.
5. Output ONLY a 4–5 sentence insight summary.

DATA:
Snippets: {worker.snippets}
Commit Messages: {[c.message for c in worker.metadata.commits]}
Languages Used: {worker.metadata.languages}
Entry Files: {worker.staticMetrics.entryFiles}

TASK:
Assess the developer’s concept mastery in terms of:
- architecture understanding
- logic quality
- API design visible from snippets
- reasoning depth based on structure and commit patterns

The evaluation must reflect ONLY what is observable, and clearly state if the available data restricts deeper assessment.

    """
    return await call_llm(prompt)
