export async function askPran(question: string, context: unknown): Promise<{ answer: string; source: 'gemini' | 'offline' }> {
  try {
    const response = await fetch('/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question, context }) });
    if (!response.ok) throw new Error('Ask service unavailable');
    const payload = await response.json() as { answer: string };
    return { answer: payload.answer, source: 'gemini' };
  } catch {
    return { answer: 'I am not sure yet, and here is what is missing: a configured Gemini connection or more observations from your own data.', source: 'offline' };
  }
}
