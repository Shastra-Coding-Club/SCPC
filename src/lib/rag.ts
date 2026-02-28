import { SCPC_CONTEXT } from "./knowledge";

/* ─── chunk the knowledge base by ## headers ──────────────────────── */

interface Chunk {
  id: string;
  title: string;
  body: string;
  keywords: string[];
}

function buildChunks(): Chunk[] {
  const sections = SCPC_CONTEXT.split(/\n#\s+\*\*/);
  const chunks: Chunk[] = [];

  for (const raw of sections) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // extract title from the first line (between ** markers or plain)
    const titleMatch = trimmed.match(/^([^*\n]+)\**/);
    const title = (titleMatch?.[1] ?? trimmed.split("\n")[0])
      .replace(/\*+/g, "")
      .trim();

    if (!title) continue;

    const body = trimmed;
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // extract keywords: lowercase words > 2 chars from the full section
    const words = body
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const unique = [...new Set(words)];

    chunks.push({ id, title, body, keywords: unique });
  }

  return chunks;
}

const CHUNKS = buildChunks();

/* ─── keyword aliases (query words → domain terms) ────────────────── */

const ALIASES: Record<string, string[]> = {
  register: ["registration", "register", "signup", "sign", "unstop", "form"],
  prize: ["prize", "prizes", "reward", "rewards", "cash", "winner", "goodies", "swag"],
  rule: ["rule", "rules", "regulation", "regulations", "prohibited", "disqualification", "allowed", "devices"],
  schedule: ["schedule", "timeline", "time", "date", "dates", "deadline", "when", "timing", "timings", "march"],
  team: ["team", "teams", "eligibility", "members", "size", "college", "inter"],
  venue: ["venue", "address", "location", "where", "tcet", "college", "campus"],
  contact: ["contact", "email", "phone", "call", "chairperson", "committee", "organizer", "organizers", "who"],
  sponsor: ["sponsor", "sponsors", "partner", "partners", "codechef", "redbull", "red bull"],
  stage: ["stage", "round", "rounds", "qualifier", "hackathon", "finale", "competition", "structure", "format"],
  food: ["food", "breakfast", "lunch", "tea", "refreshments", "meals"],
  about: ["about", "shastra", "scpc", "mission", "motto", "tagline", "what"],
  laptop: ["laptop", "device", "devices", "bring", "carry"],
  prohibited: ["prohibited", "banned", "alcohol", "tobacco", "drugs", "items", "confiscated"],
};

/* ─── retrieve relevant chunks ────────────────────────────────────── */

export function retrieveContext(query: string, topK = 3): string {
  const q = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const qWords = q.split(/\s+/).filter((w) => w.length > 2);

  // expand query words using aliases
  const expanded = new Set(qWords);
  for (const word of qWords) {
    for (const [, synonyms] of Object.entries(ALIASES)) {
      if (synonyms.some((s) => s.includes(word) || word.includes(s))) {
        synonyms.forEach((s) => expanded.add(s));
      }
    }
  }

  // score each chunk
  const scored = CHUNKS.map((chunk) => {
    let score = 0;
    for (const qw of expanded) {
      for (const kw of chunk.keywords) {
        if (kw === qw) score += 3; // exact match
        else if (kw.includes(qw) || qw.includes(kw)) score += 1; // partial
      }
    }
    // boost title matches heavily
    const titleLower = chunk.title.toLowerCase();
    for (const qw of expanded) {
      if (titleLower.includes(qw)) score += 5;
    }
    return { chunk, score };
  });

  // sort by score desc, take topK with score > 0
  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter((s) => s.score > 0).slice(0, topK);

  // fallback: if nothing matched, return the 2 smallest chunks as general context
  if (relevant.length === 0) {
    const smallest = [...CHUNKS]
      .sort((a, b) => a.body.length - b.body.length)
      .slice(0, 2);
    return smallest.map((c) => c.body).join("\n\n");
  }

  return relevant.map((s) => s.chunk.body).join("\n\n");
}

/* ─── short system prompt (no knowledge duplication) ──────────────── */

export const SYSTEM_BASE = `You are the official support bot for SCPC 2026 (TCET Shastra). Be concise (1-3 sentences). Answer ONLY from the CONTEXT below. If the answer isn't in CONTEXT reply: "I don't have that information. Please contact the organizers." Never invent info. Use markdown links for emails (mailto:) and WhatsApp (https://wa.me/91XXXXXXXXXX).`;
