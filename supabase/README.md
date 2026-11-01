# Supabase setup

## One-time project setup (what you need to do)
1. Create a free project at https://supabase.com (region: Southeast Asia / Singapore is closest to the Philippines).
2. **Project Settings → API**: copy the **Project URL** and the **anon public** key into `.env` as `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Never use the `service_role` key in the app.
3. Apply the schema: either paste `migrations/*.sql` in order into **SQL Editor → Run**, or use the CLI: `npx supabase link --project-ref <ref>` then `npx supabase db push`.
4. **Authentication → Providers → Email**: keep enabled. For quick testing you may turn off "Confirm email"; for beta keep it on (the app handles both).
5. **Authentication → URL Configuration**: set Site URL / redirect to `amuma://` for email confirmation links.
6. Restart Expo (`npx expo start -c`) so the `.env` values load.

## Migrations
| File | Contents |
| --- | --- |
| `20261101000001_foundation_profiles_consents.sql` | `profiles`, `user_consents`, signup trigger (rejects signup without privacy consent), `delete_my_account()`, RLS |

## Tests
`supabase/tests/run-local.sh` applies the migrations to a throwaway local Postgres (with a small stand-in for Supabase's `auth` schema, `local_stub.sql`) and runs `rls.sql`. It verifies cross-user isolation, immutable consents, and cascade deletion. It does **not** replace testing against a real Supabase project.
