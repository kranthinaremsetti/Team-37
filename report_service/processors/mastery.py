from llm import call_llm

async def generate_concept_mastery(worker):
    prompt = f"""
     You must follow these rules strictly:
1. Base your analysis ONLY on visible evidence: snippets, entry files, commit messages, and languages.
2. Look for AI/ML integration indicators: google.generativeai, openai, anthropic, genai, LLM, model calls
3. Detect advanced patterns: async/await, middleware, ORM, state management, API integrations
4. If snippets are too small/generic, state that limitation.
5. Tone must be concise, professional, and judge-friendly.
6. Output ONLY a 4-5 sentence insight summary.

DATA:
Snippets: {worker.snippets}
Commit Messages: {[c.message for c in worker.metadata.commits]}
Languages Used: {worker.metadata.languages}
Entry Files: {worker.staticMetrics.entryFiles}

KEY PATTERNS TO IDENTIFY:
AI/ML Integration:
- Imports: google.generativeai, openai, anthropic, transformers
- LLM calls: genai.GenerativeModel, client.chat, await call_llm
- AI services: prompt engineering, model configuration

Architecture Mastery:
- Design patterns: MVC, dependency injection, factory
- Async patterns: async/await, promises, concurrent processing
- API design: REST endpoints, middleware, error handling

Data Management:
- ORMs: Prisma, Mongoose, SQLAlchemy
- Validation: Pydantic, Joi, Zod
- State management: Redux, Context API

TASK:
Assess developer concept mastery focusing on:
1. AI/ML integration sophistication if present
2. Architecture and design patterns
3. Framework/library utilization depth
4. Problem-solving approach in commits

Clearly state if data restricts deeper assessment.

    """
    return await call_llm(prompt)
