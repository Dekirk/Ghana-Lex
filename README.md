# GhanaLex AI

> AI-powered legal research &amp; case management for the Ghanaian legal fraternity — lawyers, litigants, law firms and judges.

GhanaLex AI is a proposed platform that brings AI-assisted legal research,
secure client portals, and end-to-end case management to the Ghanaian legal
fraternity on one secure, cloud-deployable application.

## ✨ Features

- **AI Legal Search** (public) — ask any question on Ghanaian law and get an
  answer clearly marked **Verified** (carries a Ghanaian statute / decree /
  C.I. / SCGLR citation) or **Unverified**, with cited authorities and a
  disclaimer.
- **Secure Client Portal** — two-code sign-in: a **Client / Practitioner Code**
  _and_ a **Case Code**, with a **Bar / Bench number** required of lawyers and
  judges. Authorisation is enforced per case file per role.
- **Case Management** — searchable dashboard of matters with a full case detail
  page (nature of the matter, court, parties, counsel, judge, documents,
  invoices, quick actions).
- **Parties &amp; Evidence** — Plaintiff / Defendant, Appellant / Respondent,
  Petitioner / Respondent cards (driven by `suitType`) with parallel document
  and evidence upload forms for both sides.
- **Case Tracking** — vertical timeline of milestones (Done / In-progress /
  Pending / Skipped) plus pending procedural deadlines.
- **Reminders** — cross-case view of hearings and deadlines with overdue,
  24-hour and outstanding tiles, priority badges, and one-click completion.
- **Billing** — Ghana Cedis (GHS) invoices with totals (billed, collected,
  outstanding, overdue), status badges, and a Mark-paid action.

## 🛠 Tech stack

- **Framework** — Next.js 16 (App Router) + TypeScript 5
- **Styling** — Tailwind CSS 4 + shadcn/ui (New York)
- **Database** — Prisma ORM with SQLite (dev) / Postgres (production)
- **AI** — `z-ai-web-dev-sdk` for chat completions on the AI Search endpoint
- **State** — Zustand (client) + TanStack Query (server)

## 🚀 Getting started

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp .env.example .env

# 3. Create the database schema
bun run db:push

# 4. Seed sample Ghanaian cases and users
bun run seed

# 5. Start the dev server
bun run dev
```

Open <http://localhost:3000> in your browser.

### Demo credentials

| Role     | Client / Practitioner Code | Bar / Bench Number  | Case Code         |
| -------- | -------------------------- | ------------------- | ----------------- |
| Lawyer   | `GH-LX-1042`               | `GBA/ACC/2014/0387` | `GLX-CS-2026-0014`|
| Judge    | `GH-JD-2031`               | `JSC/ACC/2018-014`  | `GLX-CS-2026-0014`|
| Litigant | `GH-LG-5520` (plaintiff)   | —                   | `GLX-CS-2026-0014`|
| Litigant | `GH-LG-7733` (defendant)   | —                   | `GLX-CS-2026-0014`|

The AI Legal Search is open to the public — no sign-in needed.

## 🌍 Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repo at <https://vercel.com/new>.
3. Set the `DATABASE_URL` environment variable to a hosted Postgres connection
   string (e.g. Vercel Postgres free tier). The Prisma schema is
   database-agnostic — only the `provider` line in `prisma/schema.prisma` needs
   to change from `sqlite` to `postgresql`.
4. Vercel will run `bun install` (which triggers `postinstall: prisma generate`)
   and `next build` automatically.
5. After the first deploy, run the seed against the production database, or
   recreate the schema with `prisma db push` against the production
   `DATABASE_URL`.

A `vercel.json` is included for sane defaults.

## 🔐 Security model

- Every session is bound to **both** a user code and a case code — no code, no
  entry, for any role.
- Lawyers and judges must additionally present a Bar / Bench number that
  matches the registered record.
- Litigants can only see cases where they are a recorded party.
- Document uploads are authorised against the case file and the filing party.

## 📁 Project structure

```
prisma/
  schema.prisma           # User, Firm, Case, CaseParty, Document, Milestone, Reminder, Invoice, AiQuery
scripts/
  seed.ts                 # Realistic Ghanaian sample data
src/
  app/
    api/                  # /api/login, /api/ai-search, /api/cases, /api/documents, /api/reminders, /api/invoices
    layout.tsx
    page.tsx              # Single-page app shell — switches between 8 views
  components/
    site/                 # header, sidebar, footer
    views/                # home, ai-search, client-portal, case-management, parties, case-tracking, reminders, billing
    ui/                   # shadcn/ui component library
  lib/
    db.ts                 # Prisma client
    store.ts              # Zustand app store
    types.ts              # Shared types & UI lookup tables
    hooks.ts              # useCases() hook + GHS/date formatters
vercel.json
```

## ⚠️ Disclaimer

GhanaLex AI is a **proposed** platform — concept design only. AI-generated
answers are for general legal-research purposes and are not legal advice.
Always confirm against the authoritative source and consult a qualified legal
practitioner before relying on any answer.
