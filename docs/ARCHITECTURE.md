# Architecture

## Project status
Greenfield Expo SDK 58 project (blank-typescript template), Expo Router with `src/app` as the routes directory (per the template's conventions). Continuous Native Generation: no `ios/` or `android/` folders are committed.

## Folder structure
```
src/
  app/                  Expo Router routes ONLY (thin screens)
    _layout.tsx         Providers: gesture, safe-area, query, theme, fonts
    (tabs)/             Home · Habits · Coach · Community · Progress
    (auth)/             sign-in, sign-up
    (onboarding)/       progressive onboarding
    settings/           profile, health, coaching mode, appearance, ...
    glucose-smart/      education (linked from Home + Coach)
  components/ui/        Reusable themed primitives (Text, Button, Card, Screen)
  theme/                tokens, ThemeProvider, useTheme
  features/<name>/      (added per milestone) components/, hooks/, api/, schemas/, logic/
  lib/                  env, supabase client
  stores/               Zustand stores (device-local UI state only)
  types/                shared + generated DB types
supabase/               (Milestone 1+) migrations/, functions/, seed.sql
docs/
```

## Layering
1. **UI** (`app/`, `components/`) — rendering only.
2. **Hooks** (`features/*/hooks`) — TanStack Query wrappers; own loading/error states.
3. **Data access** (`features/*/api`) — the only code calling Supabase; maps errors to typed results.
4. **Domain logic** (`features/*/logic`) — pure, unit-tested functions (streaks, rules engine).
5. **Schemas** (`features/*/schemas`) — Zod validation shared by forms and API boundaries.

State rule: **server state → TanStack Query; device-local UI state → Zustand; forms → React Hook Form + Zod.**

## Auth and routing
Supabase Auth; session tokens in `expo-secure-store` (chunked, since sessions exceed its per-value limit; AsyncStorage on web). The root layout uses `Stack.Protected`: signed out → `(auth)` only, signed in → app routes. Redirect to onboarding for incomplete profiles is added in Milestone 2. Consent to the privacy policy is passed in signup metadata and recorded by a DB trigger, which rejects signup without it. Route protection is UX only; data protection is RLS.

## AI coaching (Milestone 7)
```
App → Supabase Edge Function `coach` → (1) load approved profile + habit history under the user's JWT (RLS applies)
                                       (2) rules engine selects recommendations deterministically
                                       (3) OpenAI call for conversation / explanation / summary
                                       (4) safety layer: system prompt guardrails + output filter
                                       (5) persist to coaching_sessions / coaching_recommendations
```
- OpenAI key exists only as an Edge Function secret.
- AI returns **structured proposals** (Zod-validated JSON). A proposal that changes a goal is stored as `pending`; only a user action applies it.
- Free-tier usage limits are enforced server-side.
- Only data the user has consented to share is sent; identifiers are minimized.

## Security
- RLS on every user-owned table; default deny. Client never trusted.
- Sensitive health data (`health_profiles`, logs) kept separate from any analytics; analytics must be event-level and non-health.
- Anonymous posts: `author_id` stored but the public read path is a view that nulls it; moderators read the base table through a role-checked policy.
- Photo storage: private buckets with per-user paths and signed URLs; moderation can remove.
- Account deletion: server-side cascade function.

## Subscriptions
`subscriptions` stores plan, status, provider (`none|apple|google`), provider ids and period dates. A server-side `entitlements` check gates Plus features. Receipt validation (Apple/Google) will be an Edge Function later; no payments now.

## Testing
Jest + jest-expo + Testing Library. Pure logic is unit-tested; key flows (auth, onboarding, habit logging, posting/reporting) get component tests. RLS is tested with SQL tests against a local Supabase.
