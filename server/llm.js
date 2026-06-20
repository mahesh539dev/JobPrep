import OpenAI from 'openai';

let openrouter;
function getOpenrouter() {
  if (!openrouter) {
    openrouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'Interview Prep Studio',
      },
    });
  }
  return openrouter;
}

let openai;
function getOpenai() {
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

export const MODELS = {
  quiz:          'deepseek/deepseek-chat',
  notes:         'deepseek/deepseek-chat',
  companyBrief:  'deepseek/deepseek-chat',
  mockInterview: 'gpt-5.5',
};

export async function generate(model, systemPrompt, userPrompt, options = {}) {
  const res = await getOpenrouter().chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4000,
  });
  return res.choices[0].message.content;
}

export async function scoreMockAnswer(systemPrompt, messages) {
  const res = await getOpenai().chat.completions.create({
    model: MODELS.mockInterview,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.6,
  });
  return res.choices[0].message.content;
}
