import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";
import { retrieveContext, SYSTEM_BASE } from "@/lib/rag";

export const runtime = "edge";

/* ─── per-user rate limiter ───────────────────────────────────────── */

const userHits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 15_000;

function getUserRate(userId: string): number {
  const now = Date.now();
  const rec = userHits.get(userId);
  if (!rec || now - rec.windowStart > WINDOW_MS) {
    userHits.set(userId, { count: 1, windowStart: now });
    return 1;
  }
  rec.count++;
  return rec.count;
}

/* ─── global request queue (per edge instance) ────────────────────── */

let active = 0;
const MAX_ACTIVE = 12; // max concurrent Groq calls per instance
const queue: Array<() => void> = [];
const MAX_QUEUE = 200; // park up to 200 waiting requests

function acquire(): Promise<void> {
  if (active < MAX_ACTIVE) {
    active++;
    return Promise.resolve();
  }
  if (queue.length >= MAX_QUEUE) {
    return Promise.reject("overloaded");
  }
  return new Promise<void>((resolve) => queue.push(resolve));
}

function release() {
  active--;
  if (queue.length > 0) {
    active++;
    queue.shift()!();
  }
}

/* ─── models ──────────────────────────────────────────────────────── */

const PRIMARY = "compound-beta";
const FALLBACK = "compound-beta-mini";

/* ─── handler ─────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  /* acquire queue slot */
  try {
    await acquire();
  } catch {
    return new Response(
      "We're experiencing high traffic. Please try again in a moment.",
      { status: 503, headers: { "Retry-After": "5" } },
    );
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Missing GROQ_API_KEY", { status: 500 });
    }

    /* rate limit */
    const fwd = req.headers.get("x-forwarded-for");
    const userId = fwd?.split(",")[0]?.trim() || "unknown";
    const rate = getUserRate(userId);

    if (rate >= 11) {
      return new Response(
        "You're sending too many messages. Please wait a few seconds.",
        { status: 429 },
      );
    }

    const model = rate <= 6 ? PRIMARY : FALLBACK;
    const groq = createGroq({ apiKey });
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    /* ── RAG: extract last user message → retrieve only relevant chunks ── */
    const lastUserMsg =
      [...messages].reverse().find((m: any) => m.role === "user")?.content ??
      "";
    const queryText =
      typeof lastUserMsg === "string"
        ? lastUserMsg
        : Array.isArray(lastUserMsg)
          ? lastUserMsg
              .filter((p: any) => p.type === "text")
              .map((p: any) => p.text)
              .join(" ")
          : "";

    const context = retrieveContext(queryText, 3);

    const systemPrompt = `${SYSTEM_BASE}\n\nCONTEXT:\n${context}`;

    /* ── call Groq ── */
    try {
      const result = streamText({
        model: groq(model),
        system: systemPrompt,
        messages: modelMessages,
        maxOutputTokens: 300,
        temperature: 0.1,
      });

      return result.toTextStreamResponse();
    } catch (primaryErr) {
      console.warn(`${model} failed, falling back:`, primaryErr);
      const result = streamText({
        model: groq(FALLBACK),
        system: systemPrompt,
        messages: modelMessages,
        maxOutputTokens: 300,
        temperature: 0.1,
      });
      return result.toTextStreamResponse();
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Something went wrong.", { status: 500 });
  } finally {
    release();
  }
}
