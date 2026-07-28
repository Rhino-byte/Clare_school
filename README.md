# St. Clare Language Institute Website

Greenfield marketing site + LMS for St. Clare (branch of St. Francis Technical Institute, Nairobi).

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Backend | FastAPI |
| Auth | Firebase Auth (dev bypass when unset) |
| Database | Postgres (or SQLite for local demo) |
| Files | Cloudflare R2 (S3 API; local in-memory fallback) |

## Monorepo layout

```
apps/web      # Next.js public site + dashboards
apps/api      # FastAPI LMS API
packages/shared
```

## Quick start (local)

### 1. API

```powershell
cd Clare_school
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r apps\api\requirements.txt
cd apps\api
uvicorn app.main:app --reload --port 8000
```

Uses SQLite by default (`clare_school.db`) and seeds German/French/English courses plus demo users.

### 2. Web

```powershell
cd apps\web
copy .env.example .env.local   # or set NEXT_PUBLIC_API_URL
npm install
npm run dev
```

Open http://localhost:3000

### Demo login (no Firebase)

On `/login`, choose student / teacher / admin. Tokens are `dev:<uid>:<email>` and match seeded users.

## Environment

See root [`.env.example`](.env.example).

**Production**

- Set `DATABASE_URL` to Postgres
- Configure Firebase Admin + client keys
- Set Cloudflare R2 credentials (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`)
- Deploy web to Vercel; API + Postgres to Railway/Render

## Deploy frontend (Vercel)

The Next.js app lives in `apps/web` and is configured for Vercel monorepo deploys.

1. Push this repo to GitHub (already set up if you cloned from the remote).
2. In [Vercel](https://vercel.com/new), **Import** the GitHub repository.
3. Set **Root Directory** to `apps/web` (Vercel will use `apps/web/vercel.json`).
4. Add environment variables from `apps/web/.env.example`:
   - `NEXT_PUBLIC_API_URL` — your deployed FastAPI URL
   - `NEXT_PUBLIC_SITE_URL` — your Vercel production URL
   - Firebase `NEXT_PUBLIC_*` keys (optional in local demo mode)
5. Deploy. Framework preset: **Next.js**.

Local production build check:

```powershell
npm install
npm run build:web
```

## Features delivered

- Marketing pages: Home, About, Courses by language/level, Levels, Schedule/Pricing, Testimonials, Contact
- Self-registration with compulsory in-person acknowledgement
- Role dashboards (student / teacher / admin)
- Teacher module CMS (draft/publish/duplicate, R2 media)
- Student module player + progress
- Tests: MCQ, true/false, short answer, audio response
- Teacher grading queue + gradebook
- Admin user roles + marketing page editor
- SEO: sitemap.xml, robots.txt, metadata

## Launch checklist

See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).
