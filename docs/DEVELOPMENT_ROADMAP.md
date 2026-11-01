# Development Roadmap

## Done: Foundation
Expo SDK 58 project, dependencies, design tokens + light/dark/system theming with persisted preference, Expo Router skeleton (5 tabs, auth, onboarding, settings, Glucose Smart), UI primitives, Supabase client stub, ESLint/Jest/TypeScript, docs.

## Milestone 1 status: code complete, not yet verified against a live Supabase project
Delivered: migration 1 (profiles, user_consents, signup trigger, `delete_my_account`, RLS), SecureStore-backed session storage, Zod-validated sign-in/sign-up, session provider, route gate (`Stack.Protected`), sign out, account deletion, TextField component. Verified: RLS/trigger tests on local Postgres, 23 Jest tests, typecheck, lint, Android bundle. **Not verified:** real signup/sign-in/deletion against Supabase, email-confirmation flow, and on-device behavior (needs your Supabase project; see `supabase/README.md`).
Deferred to Milestone 2: redirect to onboarding for users without `onboarding_completed_at` (onboarding is still a placeholder, so signed-in users go straight to the tabs).

## Milestones
| # | Scope | Exit criteria |
| --- | --- | --- |
| 1 | Supabase project + first migrations (profiles, consents, RLS), auth (sign up/in/out, secure session), root route gate, account deletion | Auth flow works against real Supabase; RLS tests pass |
| 2 | Onboarding (skippable, Zod forms), health_profiles, consents, coaching mode, 7-day starter plan (rules-based) accept/edit/reject | Account creation needs no health data; plan editable |
| 3 | Home dashboard, habit CRUD, schedules, logging, history, suggestions | Daily habit completion end to end |
| 4 | Daily check-in, weekly progress, symptom journal, milestones | Weekly summary computed from real logs |
| 5 | Community feed, photos, anonymity, reporting, moderation | Anonymous identity hidden from members (tested) |
| 6 | Glucose Smart content + Filipino food database + meal suggestions | Content reviewed with references/safety notes |
| 7 | Edge Function coach, rules engine, guardrails, usage limits, weekly accountability summary | Goal changes require approval (tested) |
| 8 | Local push notifications, E2E tests, accessibility audit, beta build via EAS | TestFlight / internal track build |

## Open decisions / needs from you
1. **Supabase project** (URL + anon key) — needed for Milestone 1. Edge Functions secrets (OpenAI key) needed at Milestone 7.
2. **Brand assets** — current icon/splash are Expo template defaults.
3. **Primary color contrast** — computed ratios in DESIGN_SYSTEM.md show light-theme primary (4.33:1) and secondary text (4.03:1) just under AA; keep brand hex or darken slightly?
4. **Content** — Glucose Smart and food data need review by a qualified nutrition professional before release; I'll draft structure and clearly mark items as unreviewed.
5. **Legal** — privacy policy / health-data consent wording (Philippine Data Privacy Act) needs legal review.
6. **Moderator bootstrap** — who is the first admin?
