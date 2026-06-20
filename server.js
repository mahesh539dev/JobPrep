import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { generate, scoreMockAnswer, MODELS } from "./server/llm.js";
import { searchCompanyIntel, searchQuizContext } from "./server/search.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8787;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("FATAL: OPENAI_API_KEY environment variable is not set.");
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, hasKey: !!OPENAI_API_KEY });
});

// Single endpoint the frontend calls for everything: quiz generation, research,
// notes generation, and the mock interviewer. Routed by req.body.feature to the
// appropriate model + search layer (see server/llm.js and server/search.js).
app.post("/api/generate", async (req, res) => {
  try {
    const { system, messages, maxTokens, feature, company, role, jd } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const options = { maxTokens: maxTokens || 4000 };

    let text;
    switch (feature) {
      case "company_intel": {
        const context = await searchCompanyIntel(company, role);
        const userPrompt = `${lastUserMsg}\n\nResearch context from web search:\n${context}`;
        text = await generate(MODELS.companyBrief, system, userPrompt, options);
        break;
      }
      case "quiz": {
        const context = await searchQuizContext(company, role, jd);
        const userPrompt = `${lastUserMsg}\n\nResearch context from web search:\n${context}`;
        text = await generate(MODELS.quiz, system, userPrompt, options);
        break;
      }
      case "notes": {
        text = await generate(MODELS.notes, system, lastUserMsg, options);
        break;
      }
      case "mock_score": {
        text = await scoreMockAnswer(system, messages);
        break;
      }
      default:
        return res.status(400).json({ error: `Unknown feature: ${feature}` });
    }

    res.json({ text, stopReason: "complete" });
  } catch (err) {
    console.error("generate error:", err);
    res.status(500).json({ error: err.message || "Generation failed" });
  }
});

// Serve the built frontend (npm run build outputs to ../dist)
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on port ${PORT}`);
});
