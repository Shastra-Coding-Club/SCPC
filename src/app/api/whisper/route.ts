import { NextResponse } from 'next/server';

export const runtime = 'edge';

const userHits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;

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
export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const userId = forwarded?.split(',')[0]?.trim() || 'unknown';
    const rate = getUserRate(userId);

    if (rate > 20) {
      return NextResponse.json(
        { error: "Voice transcription rate limit exceeded. Please wait a minute." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const groqFormData = new FormData();
    groqFormData.append('file', audioFile, 'audio.webm');
    groqFormData.append('response_format', 'json');

    const attemptTranscription = async (model: string) => {
      const data = new FormData();
      for (const [key, value] of Array.from(groqFormData.entries())) {
        data.append(key, value);
      }
      data.append('model', model);

      return fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: data,
      });
    };

    let response = await attemptTranscription('whisper-large-v3');

    if (!response.ok) {
      console.warn("Primary whisper model failed, falling back to turbo.");
      response = await attemptTranscription('whisper-large-v3-turbo');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq Whisper API Error:", errorText);
      return NextResponse.json({ error: "Failed to transcribe audio" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Whisper Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
