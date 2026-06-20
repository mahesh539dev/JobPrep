# interview.prep

A self-contained interview prep app: company research, a 100-question quiz bank, a live mock interviewer, and learning notes — all tailored to a job description and a baked-in resume.

This is a single Node/Express server that (1) serves the built React frontend, and (2) proxies AI calls to OpenAI so your API key never reaches the browser. Data (job targets, quiz progress, mock interview sessions, notes) persists in Supabase, so it syncs across any device you open the deployed URL on.

## 1. Push this to GitHub

1. Create a new empty repository on GitHub (no README/license/gitignore — just empty).
2. On your machine, unzip this project, then from inside the folder:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

## 2. Deploy on Railway

1. Go to [railway.app](https://railway.app) and log in.
2. Click **New Project** → **Deploy from GitHub repo** → select the repo you just pushed.
3. Railway will auto-detect this as a Node project (via Nixpacks) and run `npm install` then `npm run build` then `npm start` automatically — no config needed for that part.
4. Go to your new service → **Variables** tab → add:
   - `OPENAI_API_KEY` = your OpenAI API key (starts with `sk-...`, from platform.openai.com/api-keys)
5. Go to **Settings** → **Networking** → click **Generate Domain**. Railway will give you a public URL like `https://your-app.up.railway.app` — that's your app, working identically on desktop and mobile.

That's it — one service, one URL, syncs everywhere.

## 3. Supabase (already set up)

The app expects a Supabase table called `interview_prep_kv` with columns `key` (text, primary key), `value` (jsonb), `updated_at` (timestamptz). If you haven't already, run `setup.sql` (included separately) in your Supabase project's SQL Editor once.

The Supabase URL and anon key are already baked into `src/App.jsx` (search for `SUPABASE_URL`). If you ever rotate your Supabase keys, update them there and redeploy.

## Local development

```
npm install
cp .env.example .env   # then edit .env and add your real OPENAI_API_KEY
npm run dev:server      # starts the backend on :8787
```
In a second terminal:
```
npm run dev              # starts the Vite dev server on :5173, proxies /api to :8787
```
Open http://localhost:5173

## Notes on cost

Every quiz batch, company research, notes generation, and mock interview turn calls OpenAI with web search enabled where relevant — each of those costs real money against your OpenAI account. There's no hard cap built in; keep an eye on usage at platform.openai.com/usage if that matters to you.

## Changing the AI model

In `server.js`, change the `DEFAULT_MODEL` constant if you want a different OpenAI model (e.g. a cheaper one for cost, or a different reasoning tier).
