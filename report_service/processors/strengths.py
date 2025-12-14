from llm import call_llm

async def generate_strengths(worker):
    prompt = f"""
    You must follow these rules strictly:
1. Identify strengths ONLY from observable evidence:
   - AI/ML integration (imports, API calls, model usage)
   - snippet structure and code quality
   - file/entry organization
   - visible languages and frameworks
   - commit message patterns
   - presence/absence of documentation/tests
2. Do NOT assume architectural qualities without code evidence.
3. If fewer than 5 defensible strengths exist, list only the valid ones.
4. If no strengths are clearly supported, output:
   ["Not enough information to identify concrete strengths."]
5. Tone must be concise and professional.
6. Output ONLY a bullet list (one strength per line, start with -).

DATA:
Snippets: {worker.snippets}
Commit Messages: {[c.message for c in worker.metadata.commits]}
Languages: {worker.metadata.languages}
Entry Points: {worker.staticMetrics.entryFiles}
Has README: {worker.staticMetrics.hasReadme}
Has Tests: {worker.staticMetrics.hasTests}

STRENGTH INDICATORS WITH EVIDENCE:

🤖 AI/ML Integration:
- Google Gemini/OpenAI/Anthropic imports visible in snippets
- LLM API calls (genai.GenerativeModel, client.chat, call_llm functions)
- Prompt engineering patterns in code
- AI-powered features (analysis, generation, evaluation)

📁 Organization:
- Modular architecture with clear separation
- Organized folder structure (routes/, controllers/, services/)
- Configuration management evident

💻 Technical Quality:
- Modern async/await patterns
- Type validation (Pydantic, TypeScript)
- Error handling visible
- API integrations

📝 Documentation:
- README present
- Code comments in snippets

TASK:
Produce up to 5 strengths grounded strictly in observable facts from the data above.

    """
    raw = await call_llm(prompt)
    return [s.strip("-• ") for s in raw.split("\n") if s.strip()]
