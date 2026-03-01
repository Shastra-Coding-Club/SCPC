const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Server misconfigured" },
        { status: 500 },
      );
    }

    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_SIZE) {
      return Response.json(
        { error: "Audio file too large (max 10 MB)" },
        { status: 413 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("audio");

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: "Audio file too large (max 10 MB)" },
        { status: 413 },
      );
    }

    if (file.size < 100) {
      return Response.json(
        { error: "Audio too short" },
        { status: 400 },
      );
    }

    const groqForm = new FormData();
    const ext = file.type.includes("mp4") ? "audio.mp4" : "audio.webm";
    groqForm.append("file", file, ext);
    groqForm.append("model", "whisper-large-v3");
    groqForm.append("language", "en");
    groqForm.append("response_format", "json");

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: groqForm,
      },
    );

    if (!response.ok) {
      const status = response.status;
      const errText = await response.text().catch(() => "Unknown error");
      console.error(`Groq transcription error (${status}):`, errText);

      if (status === 429) {
        return Response.json(
          { error: "Too many requests, try again shortly" },
          { status: 429 },
        );
      }
      return Response.json(
        { error: "Transcription failed" },
        { status: 502 },
      );
    }

    const result = await response.json();
    return Response.json({ text: result.text ?? "" });
  } catch (error) {
    console.error("Transcribe API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
