const CLAUDE_API = 'https://api.anthropic.com/v1/messages';

async function callClaude(systemPrompt, userMessage) {
  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || '').join('') || '';
}

export async function autoTagTransaction(note, amount, type) {
  const system = `You are a personal finance categorizer. Given a transaction note, amount, and type (income/expense), return ONLY a JSON object with:
- category: one of [Food & Drinks, Transport, Shopping, Entertainment, Health, Housing, Salary, Freelance, Investment, Education, Utilities, Other]
- emoji: a single relevant emoji for the category
- confidence: high | medium | low

Return ONLY valid JSON, no explanation, no markdown fences.`;

  const user = `Note: "${note}", Amount: ${amount}, Type: ${type}`;

  try {
    const raw = await callClaude(system, user);
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return { category: 'Other', emoji: '💳', confidence: 'low' };
  }
}

export async function generateInsights(transactions, balance) {
  if (transactions.length < 2) return null;

  const system = `You are a friendly, sharp personal finance advisor. Analyze the user's transaction data and give 3 concise, specific, actionable insights. Be direct and personal — reference actual numbers and patterns. Each insight should be 1-2 sentences max. Return ONLY a JSON array of objects: [{title: string, body: string, type: "warning"|"tip"|"positive"}]. No markdown, no extra text.`;

  const summary = transactions.slice(0, 30).map(t =>
    `${t.type}: ${t.amount} IDR — ${t.note} (${t.category}, ${t.date})`
  ).join('\n');

  const user = `Current balance: ${balance} IDR\n\nRecent transactions:\n${summary}`;

  try {
    const raw = await callClaude(system, user);
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}
