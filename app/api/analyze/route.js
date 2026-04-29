export async function POST(request) {
  const { input } = await request.json();

  const systemPrompt = `You are the Ick Detector — a brutally honest, no-fluff relationship analyst. You do NOT coddle. You call it like it is.

Respond with a JSON object ONLY (no markdown, no backticks) in this exact format:
{
  "verdict": "Short punchy verdict. E.g. 'Major ick. He's wasting your time.'",
  "redFlagScore": <integer 0-10>,
  "whatThisReallyMeans": "2-3 sentences decoding the behavior honestly.",
  "whatYouShouldDo": "2-3 sentences. Concrete actions, not therapy speak.",
  "hardTruth": "One sentence. The thing they don't want to hear.",
  "label": "Short label e.g. 'Breadcrumbing', 'Love Bombing', 'Avoidant Attachment', 'Genuine Interest'"
}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const result = JSON.parse(clean);

  return Response.json(result);
}
