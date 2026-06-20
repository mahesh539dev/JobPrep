# Interview Prep App — Architecture Spec for Claude Code

> Drop this file into your project root, then give Claude Code the prompt at the bottom.

---

## What Changes, What Does Not

| | Status | Notes |
|---|---|---|
| server/llm.js | CREATE NEW | Model router |
| server/search.js | CREATE NEW | Tavily + Exa search layer |
| server/index.js | UPDATE | Route /api/generate by feature |
| React frontend | NO CHANGE | Zero modifications |
| Supabase schema | NO CHANGE | Zero modifications |

---

## New Packages

npm install tavily exa-js

---

## New Env Vars (.env + Railway)

OPENROUTER_API_KEY=sk-or-v1-...
TAVILY_API_KEY=tvly-...
EXA_API_KEY=...

Keep existing OPENAI_API_KEY — still used for mock interview scoring only.

---

## server/llm.js — Full Code

import OpenAI from 'openai';

export const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
    'X-Title': 'Interview Prep Studio',
  },
});

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const MODELS = {
  quiz:          'deepseek/deepseek-chat',
  notes:         'deepseek/deepseek-chat',
  companyBrief:  'deepseek/deepseek-chat',
  mockInterview: 'gpt-5.5',
};

export async function generate(model, systemPrompt, userPrompt, options = {}) {
  const res = await openrouter.chat.completions.create({
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

export async function scoreMockAnswer(systemPrompt, userPrompt) {
  const res = await openai.chat.completions.create({
    model: MODELS.mockInterview,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.6,
  });
  return res.choices[0].message.content;
}

---

## server/search.js — Full Code

import { tavily } from 'tavily';
import Exa from 'exa-js';

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
const exa = new Exa(process.env.EXA_API_KEY);

export async function searchCompanyIntel(company, role) {
  const queries = [
    `${company} ${role} interview process experience questions`,
    `${company} engineering interview questions Glassdoor Blind 2025 2026`,
    `${company} engineering blog values hiring culture`,
  ];
  const results = await Promise.all(
    queries.map(q => tavilyClient.search(q, { searchDepth: 'basic', maxResults: 4, includeAnswer: true }))
  );
  return results
    .flatMap(r => r.results || [])
    .map(r => `SOURCE: ${r.url}\n${r.content || r.snippet || ''}`)
    .join('\n\n---\n\n')
    .slice(0, 12000);
}

export async function searchQuizContext(company, role, jd) {
  const jdKeywords = jd.split(/\W+/).filter(w => w.length > 5).slice(0, 8).join(' ');
  const query = `${company} ${role} technical interview questions ${jdKeywords}`;
  const result = await exa.search(query, {
    numResults: 6,
    useAutoprompt: true,
    type: 'neural',
    contents: { text: { maxCharacters: 1000 } },
  });
  return (result.results || [])
    .map(r => `SOURCE: ${r.url}\n${r.text || ''}`)
    .join('\n\n---\n\n')
    .slice(0, 10000);
}

---

## server/index.js — What to Change

ADD these two imports at the top:
  import { generate, scoreMockAnswer, MODELS } from './llm.js';
  import { searchCompanyIntel, searchQuizContext } from './search.js';

REPLACE /api/generate handler — route by feature:
  'company_intel' → searchCompanyIntel() + generate(MODELS.companyBrief, ...)
  'quiz'          → searchQuizContext() + generate(MODELS.quiz, ...)
  'mock_score'    → scoreMockAnswer() — no search
  'notes'         → generate(MODELS.notes, ...) — no search

Keep everything else in index.js unchanged.

---

## Routing + Cost Table

feature         | Search        | Model              | Cost
company_intel   | Tavily 3q     | DeepSeek V3.2      | ~$0.016
quiz            | Exa 1q/6res   | DeepSeek V3.2      | ~$0.020
mock_score      | none          | GPT-5.5 (direct)   | ~$0.150
notes           | none          | DeepSeek V3.2      | ~$0.008

---

## Model Swap Reference (change strings in MODELS in llm.js)

deepseek/deepseek-chat       → Default, best value ($0.32/$0.89 per 1M)
deepseek/deepseek-v4-flash   → Budget mode ($0.14/$0.28 per 1M)
deepseek/deepseek-r1         → Hard reasoning ($0.55/$2.19 per 1M)
deepseek/deepseek-r1:free    → Free tier for testing
qwen/qwen3-max               → Stronger reasoning ($1.60/$6.40 per 1M)
moonshotai/kimi-k2.6         → Long context ($0.57/$2.30 per 1M)
google/gemini-flash-2.5      → Google grounding ($0.30/$2.50 per 1M)
gpt-5.5 (direct OpenAI)      → Mock interview only ($5/$30 per 1M)

After implementing, show me the final versions of all three server files.