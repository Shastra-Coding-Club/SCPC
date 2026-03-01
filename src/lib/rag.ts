import {
  KNOWLEDGE_ABOUT,
  KNOWLEDGE_SPONSORS,
  KNOWLEDGE_PRIZES,
  KNOWLEDGE_SCHEDULE,
  KNOWLEDGE_TEAM,
  KNOWLEDGE_STRUCTURE,
  KNOWLEDGE_RULES,
  KNOWLEDGE_CONTACT,
} from "./knowledge";

export const getSystemPrompt = (userInput: string) => {
  const input = userInput.toLowerCase();
  let injectedContext = "";

  if (/(prize|win|money|cash|reward|₹|goodies|swag|first|second|third|champion)/.test(input)) {
    injectedContext += KNOWLEDGE_PRIZES + "\n";
  }

  if (/(schedule|time|when|date|deadline|march|timeline|hour|lunch|breakfast|tea|food|eat)/.test(input)) {
    injectedContext += KNOWLEDGE_SCHEDULE + "\n";
  }

  if (/(rule|allow|prohibit|ban|laptop|device|phone|cheat|plagiarism|id card|tab|window|alcohol|smoke|drug)/.test(input)) {
    injectedContext += KNOWLEDGE_RULES + "\n";
  }

  if (/(team|size|member|eligib|who can|college|branch|year|inter)/.test(input)) {
    injectedContext += KNOWLEDGE_TEAM + "\n";
  }

  if (/(structure|round|stage|qualifier|hackathon|finale|platform|codechef|format)/.test(input)) {
    injectedContext += KNOWLEDGE_STRUCTURE + "\n";
  }

  if (/(contact|email|phone|call|organizer|committee|who|chairperson|faculty)/.test(input)) {
    injectedContext += KNOWLEDGE_CONTACT + "\n";
  }

  if (/(sponsor|partner|codechef|redbull|red bull)/.test(input)) {
    injectedContext += KNOWLEDGE_SPONSORS + "\n";
  }

  if (/(about|mission|motto|tagline|venue|where|location|tcet|shastra|scpc|who are you)/.test(input)) {
    injectedContext += KNOWLEDGE_ABOUT + "\n";
  }

  if (injectedContext === "") {
    injectedContext = "No specific context needed for this query.";
  }

  return `You are the official Support Agent for the SCPC 2026 Hackathon (TCET Shastra).
You are professional, concise, and helpful.

CRITICAL INSTRUCTIONS:
1. You may ONLY answer questions using the information provided in the "KNOWLEDGE BASE" below.
2. If the user asks a question that is NOT answered in the knowledge base, you MUST reply with exactly: "I don't have that information. Please contact the organizers at the help desk."
3. IF the user is just saying hello, greeting you, or saying thanks, politely acknowledge them and ask how you can help them with SCPC 2026. Do NOT use the fallback message for simple greetings.
4. Do NOT invent, guess, or hallucinate any information, dates, rules, or prizes.
5. Keep all answers under 3 sentences if possible. Be direct.
6. Do NOT answer generic programming questions or act like a coding assistant. You are purely an event guide.
7. Use Markdown links for emails (mailto:) and WhatsApp chat links (https://wa.me/) for contact numbers.
CRITICAL: Example for WhatsApp: [8454096454](https://wa.me/918454096454).
====================
KNOWLEDGE BASE:
${injectedContext.trim()}
====================
`;
};
