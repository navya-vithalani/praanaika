import type { VercelRequest, VercelResponse } from '@vercel/node';

const forbidden = /caus(e|es|ed|ing)|diagnos\w*|cure[sd]?|treat(s|ed|ment)?|disease|disorder|prescri\w*/i;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return response.status(503).json({ error: 'Gemini is not configured' });
  const { question, context, model = process.env.GEMINI_MODEL || 'gemini-3.1-flash' } = request.body ?? {};
  if (typeof question !== 'string' || question.length > 500) return response.status(400).json({ error: 'Invalid question' });
  const prompt = `You are Pran in Praanaika, a wellness observation tool. Answer only from the supplied synthetic or user data. Never diagnose, name conditions, state causes, prescribe, recommend treatment, or invent numbers. Use wording like coincided with, went together, was different around that time, or unusual for you. If the data is insufficient, abstain. Keep the answer to two warm sentences and include what else was different when relevant.\n\nQuestion: ${question}\nData context: ${JSON.stringify(context).slice(0, 12000)}`;
  const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 220 } }) });
  if (!geminiResponse.ok) return response.status(502).json({ error: 'Gemini request failed' });
  const payload = await geminiResponse.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const answer = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join(' ').trim() || 'I am not sure yet, and here is what is missing.';
  return response.status(200).json({ answer: forbidden.test(answer) ? 'I am not sure yet, and I need more evidence from your own data.' : answer, model });
}
