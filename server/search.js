import { tavily } from 'tavily';
import Exa from 'exa-js';

let tavilyClient;
function getTavilyClient() {
  if (!tavilyClient) tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
  return tavilyClient;
}

let exa;
function getExa() {
  if (!exa) exa = new Exa(process.env.EXA_API_KEY);
  return exa;
}

export async function searchCompanyIntel(company, role) {
  const queries = [
    `${company} ${role} interview process experience questions`,
    `${company} engineering interview questions Glassdoor Blind 2025 2026`,
    `${company} engineering blog values hiring culture`,
  ];
  const results = await Promise.all(
    queries.map(q => getTavilyClient().search(q, { searchDepth: 'basic', maxResults: 4, includeAnswer: true }))
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
  const result = await getExa().search(query, {
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
