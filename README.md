# AMUMA

> Managing PMOS, one step at a time.

AMUMA is a Filipino-first PMOS wellness and lifestyle companion: personalized habit tracking, adaptive AI coaching and a supportive community. *Amuma* is a Cebuano word associated with care, nurturing and looking after someone.

AMUMA is a lifestyle companion, **not a medical application**. It does not diagnose, treat or cure PMOS.

## Status

**Milestone 1 (auth) code complete.** Foundation plus Supabase auth, secure sessions, route gate and account deletion. Backend setup steps are in [supabase/README.md](supabase/README.md). Other feature screens are labelled placeholders with no mock data. See [docs/DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md).

## Stack

Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router · Supabase (Postgres, Auth, Storage, RLS) · TanStack Query · Zustand · React Hook Form + Zod · Reanimated. AI runs server-side only (Supabase Edge Functions + OpenAI).

## Getting started

```bash
npm install
cp .env.example .env     # fill in Supabase URL + anon key (public values only)
npx expo start
```

Scripts: `npm run typecheck` · `npm run lint` · `npm test` · `./supabase/tests/run-local.sh` (RLS tests on local Postgres).

Without Supabase credentials the app still launches (design system and navigation); backend features arrive from Milestone 1.

## Security rules

- Only the Supabase **anon** key is ever in the app. Service-role and OpenAI keys live in server-side secrets.
- All user data is protected by Row Level Security; the client is never trusted for authorization.
- Colors are never hardcoded in components — use `useTheme()`.

## Docs

| Doc | Purpose |
| --- | --- |
| [PRODUCT_REQUIREMENTS](docs/PRODUCT_REQUIREMENTS.md) | Scope, modes, features, safety rules |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Folder structure, layers, AI and security design |
| [DATABASE_SCHEMA](docs/DATABASE_SCHEMA.md) | Planned tables, RLS strategy |
| [DESIGN_SYSTEM](docs/DESIGN_SYSTEM.md) | Tokens, typography, components |
| [DEVELOPMENT_ROADMAP](docs/DEVELOPMENT_ROADMAP.md) | Milestones and open decisions |
