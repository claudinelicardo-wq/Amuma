# Product Requirements

## Positioning
An affordable, personalized PMOS wellness and accountability companion for Filipino women. Not a medical app.

## Principles
Sustainable habits over perfection · consistency over extreme routines · education over misinformation · encouragement over guilt · personalization over generic advice · accessibility over expensive subscriptions.

## Coaching modes
| Mode | Behavior |
| --- | --- |
| Guided | AMUMA recommends habits, builds plans, coaches, suggests adjustments |
| Self-Directed | User creates own habits, routines, goals, reminders |
| Hybrid | Recommendations offered; user keeps control |

Users can switch modes at any time without losing data. **The AI never changes goals on its own; every goal change needs explicit approval.**

## Safety rules (apply to all AI and content)
- No diagnosis, cure or treatment claims; no promises of reversing insulin resistance.
- Never prescribe or adjust medication or supplement dosage.
- Never recommend unsafe fasting or extreme dieting.
- Distinguish education from medical advice; encourage professional care when appropriate.
- Never shame missed habits. Never label traditional Filipino foods "forbidden".
- Weight, glucose and lab data are optional; weight loss is never the sole success measure.

## Features (MVP)
1. **Onboarding** — account, then optional/skippable health context, goals, lifestyle, food preferences, allergies, budget, exercise, time, coaching and notification preference, consent. Ends with an editable seven-day starter plan (accept / edit / reject / create own). Sensitive info is never required to create an account.
2. **Home** — greeting, date, check-in, today's habits and progress, Glucose Smart tip, coach message, weekly summary. Uncluttered.
3. **Habits** — create/edit/delete/pause/reschedule, reminders, frequency, daily/weekly targets, complete/skip logging, history, built-in suggestions (nutrition, activity, hydration, sleep, stress, general) and custom habits.
4. **AMUMA Coach** — hybrid rules engine + AI. Rules produce routine recommendations; AI provides conversation, explanations and summaries. Offers easier alternatives, helps restart after missed days, weekly accountability summaries.
5. **Glucose Smart** — education items (title, description, instructions, food examples, evidence level, references, review date, safety notes): fiber-first, protein pairing, balanced Filipino meals, post-meal movement, sleep/stress, sustainable routines. Accessible from Home and Coach.
6. **Filipino food database** — expandable; name, category, serving, calories, macros, fiber, preparation, portion notes, nutritional uncertainty. Meal suggestions by preference, budget, availability, cooking access. No unsupported claims.
7. **Community** — chronological feed; text/photo posts; like, comment; edit/delete own; anonymous posting (identity visible only to moderators); report; admin moderation from day one. Free for all. **Out of scope:** DMs, complex groups, live events.
8. **My Progress** — weekly completion, habit history, check-in history, symptom journal, activity history, milestones, weekly reflection.
9. **Settings** — profile, health preferences, coaching mode, appearance, notifications, subscription, privacy and consent, account deletion.

## Subscription
| | Free | AMUMA Plus (₱99/mo) |
| --- | --- | --- |
| Habits, symptom journal, community, basic Glucose Smart, custom habits | ✔ | ✔ |
| AI coaching | Limited | Expanded, adaptive weekly plans |
| Meal guidance / challenges / insights | Basic | Expanded, full challenges, advanced insights |

No payment processing until explicitly requested. The architecture must allow later Apple/Google IAP (entitlement table fed by store receipts via server).

## Non-functional
Light/dark/system themes with saved preference · accessible contrast, 44pt touch targets, font scaling · small iPhone and common Android support · loading/error/empty/success states everywhere · no mock data in production features.
