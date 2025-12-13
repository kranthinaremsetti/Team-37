from llm import call_llm

async def generate_viva_questions(worker):
    prompt = f"""You must follow these rules strictly:
1. Base all questions ONLY on observable evidence:
   - architecture entry points
   - backend routes referenced in snippets
   - frontend entry file usage
   - missing README or missing tests
   - commit patterns
2. Do NOT assume or invent financial algorithms unless they are explicitly visible in the snippets or commit messages.  
   If not visible, ask general algorithm or design reasoning questions instead.
3. Output EXACTLY 8 questions.
4. Output one question per line, with no numbering and no extra commentary.
5. Tone must be clear, judge-friendly, and technically relevant.

DATA:
Snippets: {worker.snippets}
Entry Files: {worker.staticMetrics.entryFiles}
Has README: {worker.staticMetrics.hasReadme}
Commit Messages: {[c.message for c in worker.metadata.commits]}

TASK:
Generate 8 viva questions grounded strictly in the project’s observable structure, architecture, missing documentation, and code patterns.

    """

    raw = await call_llm(prompt)
    qs = [q.strip("-• ") for q in raw.split("\n") if q.strip()]
    return qs[:8]
