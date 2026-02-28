import { createGroq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from 'ai';
import { SCPC_CONTEXT } from '@/lib/knowledge';

export const runtime = 'edge';

const userHits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 15_000;

function getUserRate(userId: string): number {
  const now = Date.now();
  const record = userHits.get(userId);

  if (!record || now - record.windowStart > WINDOW_MS) {
    userHits.set(userId, { count: 1, windowStart: now });
    return 1;
  }

  record.count++;
  return record.count;
}

const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
const BACKUP_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const HARD_BLOCK_MESSAGE = "You're sending too many messages. Please wait a few seconds before asking another question about SCPC.";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Missing GROQ_API_KEY environment variable", { status: 500 });
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const userId = forwarded?.split(',')[0]?.trim() || 'unknown';
    const rate = getUserRate(userId);

    if (rate >= 11) {
      return new Response(HARD_BLOCK_MESSAGE, {
        status: 429,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const selectedModel = rate <= 6 ? PRIMARY_MODEL : BACKUP_MODEL;

    const groq = createGroq({ apiKey });
    const { messages } = await req.json();

    const SYSTEM_PROMPT = `
You are the official Support Agent for the SCPC 2026 Hackathon (TCET Shastra).
You are professional, concise, and helpful.

CRITICAL INSTRUCTIONS:
1. You may ONLY answer questions using the information provided in the "KNOWLEDGE BASE" below.
2. If the user asks a question that is NOT answered in the knowledge base, you MUST reply with exactly: "I don't have that information. Please contact the organizers at the help desk."
3. Do NOT invent, guess, or hallucinate any information, dates, rules, or prizes.
4. Keep all answers under 3 sentences if possible. Be direct.
5. Do NOT answer generic programming questions or act like a coding assistant. You are purely an event guide.
6. Use Markdown links for emails (mailto:) and WhatsApp chat links (https://wa.me/) for contact numbers. 
CRITICAL: Example for WhatsApp: [8454096454](https://wa.me/918454096454).
====================
KNOWLEDGE BASE:
${SCPC_CONTEXT}
====================
`;

    const modelMessages = await convertToModelMessages(messages);

    try {
      const result = streamText({
        model: groq(selectedModel),
        system: SYSTEM_PROMPT,
        messages: modelMessages,
        maxOutputTokens: 500,
        temperature: 0.1,
      });

      return result.toTextStreamResponse();
    } catch (primaryError) {
      console.warn(`Model ${selectedModel} failed, falling back to ${BACKUP_MODEL}:`, primaryError);

      const result = streamText({
        model: groq(BACKUP_MODEL),
        system: SYSTEM_PROMPT,
        messages: modelMessages,
        maxOutputTokens: 500,
        temperature: 0.1,
      });

      return result.toTextStreamResponse();
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("An error occurred during chat processing.", { status: 500 });
  }
}
