# Database Schema (planned)

PostgreSQL via Supabase. UUID PKs (`gen_random_uuid()`), `created_at`/`updated_at` timestamptz on all tables, FKs with `on delete cascade` to `auth.users` for user data. Delivered as migrations in `supabase/migrations/` starting Milestone 1. **No migrations exist yet.**

## Tables
| Table | Key columns / notes |
| --- | --- |
| profiles | `id` = auth.users.id, display_name, avatar_path, coaching_mode (`guided/self_directed/hybrid`), appearance, onboarding_completed_at |
| health_profiles | user_id, pcos_diagnosis_status, goals[], activity_level, dietary_restrictions[], allergies[], budget_tier, exercise_prefs[], daily_minutes, optional weight/height. All nullable; separate from profiles |
| user_consents | user_id, consent_type (`privacy_policy`, `health_data`, `ai_processing`), granted, version, granted_at, revoked_at |
| habits | user_id, title, category, source (`custom/suggested/ai_approved`), target_value/unit, target_period, status (`active/paused/archived`) |
| habit_schedules | habit_id, frequency (`daily/weekly/custom`), days_of_week, time_of_day, reminder_enabled |
| habit_logs | habit_id, user_id, log_date, status (`completed/skipped`), value, note; unique (habit_id, log_date) |
| daily_checkins | user_id, checkin_date, mood, energy, sleep_quality, symptoms jsonb, note; unique (user_id, date) |
| coaching_sessions | user_id, started_at, summary |
| coaching_recommendations | user_id, session_id, kind, payload jsonb, rationale, status (`pending/accepted/rejected`), decided_at. Goal changes only apply when accepted |
| weekly_reviews | user_id, week_start, stats jsonb, ai_summary, reflection |
| glucose_hacks | (content, readable by all authenticated) title, description, instructions, food_examples, evidence_level, references jsonb, reviewed_at, safety_notes, tier |
| glucose_hack_logs | user_id, hack_id, log_date |
| glucose_challenges | (content) title, description, duration_days, tier; plus per-user progress table later |
| symptom_logs | user_id, logged_at, symptom, severity, note |
| meal_logs | user_id, logged_at, meal_type, description, food_ids[], photo_path |
| foods (planned add) | name, category, serving, kcal, protein_g, carbs_g, fat_g, fiber_g, prep_method, portion_notes, uncertainty |
| community_posts | author_id, body, image_paths[], is_anonymous, status (`visible/hidden/removed`), edited_at |
| community_comments | post_id, author_id, body, is_anonymous, status |
| community_reactions | post_id, user_id, type; unique (post_id, user_id) |
| community_reports | reporter_id, target_type, target_id, reason, status, resolved_by |
| community_moderators | user_id, role (`moderator/admin`), granted_at |
| notifications | user_id, kind, title, body, scheduled_for, read_at |
| subscriptions | user_id, plan (`free/plus`), status, provider (`none/apple/google`), provider_ref, current_period_end |

`foods` is an addition required by the Filipino food database (section 6F) and wasn't in the initial table list.

## RLS strategy
- Default deny; `enable row level security` on every table.
- User-owned tables: `using (user_id = auth.uid())` for select/insert/update/delete; `with check` on writes.
- Content tables (glucose_*, foods): select for `authenticated`; writes service-role only.
- Community: select visible posts for authenticated users through public views that null `author_id` when `is_anonymous`; authors edit/delete own; moderators (via `is_moderator()` security-definer function) can see authors and update `status`; reports insertable by any user, readable by moderators only.
- `subscriptions` and `user_consents` revocation: users read; writes to subscriptions are server-only.
- Every policy gets a SQL test.

## Indexes
`(user_id, log_date)` on logs/check-ins; `(created_at desc)` on posts; `(post_id)` on comments/reactions; partial index on `habits(user_id) where status='active'`.
