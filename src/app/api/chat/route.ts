import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";
import { getSystemPrompt } from "@/lib/rag";

export const runtime = "edge";

const userHits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 45_000;

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

let active = 0;
const MAX_ACTIVE = 12;
const queue: Array<() => void> = [];
const MAX_QUEUE = 200;

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

const MODEL_TIERS = [
  "llama-3.3-70b-versatile",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "moonshotai/kimi-k2-instruct",
  "moonshotai/kimi-k2-instruct-0905",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-safeguard-20b",
  "qwen/qwen3-32b",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "groq/compound",
  "groq/compound-mini"
];

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

    const fwd = req.headers.get("x-forwarded-for");
    const userId = fwd?.split(",")[0]?.trim() || "unknown";
    const rate = getUserRate(userId);

    if (rate > 11) {
      return new Response(
        "You're sending too many messages. Please wait a few seconds.",
        { status: 429 },
      );
    }

    const groq = createGroq({ apiKey });
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    let queryText = "";
    for (let i = modelMessages.length - 1; i >= 0; i--) {
      const msg = modelMessages[i];
      if (msg.role === "user") {
        if (typeof msg.content === "string") {
          queryText = msg.content;
        } else if (Array.isArray(msg.content)) {
          const textPart = msg.content.find((p: any) => p.type === "text");
          if (textPart && "text" in textPart) {
            queryText = textPart.text;
          }
        }
        break;
      }
    }

    const systemPrompt = getSystemPrompt(queryText);

    let lastError: any;

    for (const modelId of MODEL_TIERS) {
      try {
        console.log(`[Fallback Router] Attempting model: ${modelId}`);
        const result = streamText({
          model: groq(modelId),
          system: systemPrompt,
          messages: modelMessages,
          maxOutputTokens: 300,
          temperature: 0.1,
          onFinish: (event) => {
            console.log(`[Token Usage] Model: ${modelId}`);
            console.log(`[Token Usage] Stats: ${JSON.stringify(event.usage)}`);
          }
        });

        const [testStream, responseStream] = result.textStream.tee();
        
        const reader = testStream.getReader();
        await reader.read(); 
        reader.releaseLock();

        return new Response(responseStream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'x-vercel-ai-data-stream': 'v1'
          }
        });
        
      } catch (err: any) {
        lastError = err;
        console.warn(`[Fallback Router] Model [${modelId}] failed!`, err.message || err.name);
        // Let it continue to the next tier!
      }
    }

    console.error("All 10 fallback models failed. Final error:", lastError);
    return new Response(
      "Our system is currently overwhelmed. Please try again in a few seconds.",
      { status: 503 }
    );

  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Something went wrong.", { status: 500 });
  } finally {
    release();
  }
}
