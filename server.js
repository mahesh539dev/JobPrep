import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8787;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("FATAL: OPENAI_API_KEY environment variable is not set.");
}

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

// Maps "model" requests from the frontend to actual OpenAI models.
// gpt-5.5 used as the default — change here if you want a different model/cost tradeoff.
const DEFAULT_MODEL = "gpt-5.5";

app.get("/api/health", (req, res) => {
  res.json({ ok: true, hasKey: !!OPENAI_API_KEY });
});

// Single endpoint the frontend calls for everything: quiz generation, research,
// notes generation, and the mock interviewer. Mirrors the shape the frontend
// previously used for Anthropic's /v1/messages so the App.jsx changes are minimal.
app.post("/api/generate", async (req, res) => {
  try {
    const { system, messages, useSearch, maxTokens } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // Responses API takes a single "input" — flatten system + conversation history
    // into one input string/array. We build a simple transcript format.
    const inputParts = [];
    if (system) {
      inputParts.push({ role: "system", content: system });
    }
    for (const m of messages) {
      inputParts.push({ role: m.role === "assistant" ? "assistant" : "user", content: m.content });
    }

    const requestBody = {
      model: DEFAULT_MODEL,
      input: inputParts,
      max_output_tokens: Math.min(Math.max(maxTokens || 4000, 16), 32000),
    };
    if (useSearch) {
      requestBody.tools = [{ type: "web_search" }];
    }

    const response = await client.responses.create(requestBody);

    const text = response.output_text || "";
    const stopReason = response.status === "incomplete" ? "max_tokens" : "complete";

    res.json({ text, stopReason });
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

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
