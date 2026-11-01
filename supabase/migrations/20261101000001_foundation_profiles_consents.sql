-- AMUMA Milestone 1: profiles, user_consents, account deletion.
-- Sensitive health data lives in separate tables (health_profiles, Milestone 2).

create extension if not exists pgcrypto;

-- Shared trigger: keep updated_at current.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 1 and 60),
  avatar_path text,
  coaching_mode text not null default 'hybrid'
    check (coaching_mode in ('guided', 'self_directed', 'hybrid')),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
-- No insert policy: rows are created only by the signup trigger.
-- No delete policy: rows are removed only via delete_my_account() / cascade.

-- ---------------------------------------------------------- user_consents
-- Append-only history: a revocation is a new row, never an update of the old one.
create table public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  consent_type text not null
    check (consent_type in ('privacy_policy', 'health_data', 'ai_processing')),
  granted boolean not null,
  policy_version text not null check (char_length(policy_version) between 1 and 40),
  created_at timestamptz not null default now()
);

create index user_consents_user_type_idx
  on public.user_consents (user_id, consent_type, created_at desc);

alter table public.user_consents enable row level security;

create policy "consents_select_own" on public.user_consents
  for select to authenticated using (user_id = (select auth.uid()));
create policy "consents_insert_own" on public.user_consents
  for insert to authenticated with check (user_id = (select auth.uid()));
-- No update/delete policies: consent history is immutable to clients.

-- ----------------------------------------------------- signup bootstrapping
-- Creates the profile and records required privacy consent atomically with signup.
-- Consent is carried in signup metadata so it works even when email confirmation
-- means no session exists yet. Signup is rejected without it.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_version text := new.raw_user_meta_data ->> 'privacy_policy_version';
  v_name text := nullif(btrim(new.raw_user_meta_data ->> 'display_name'), '');
begin
  if v_version is null or btrim(v_version) = '' then
    raise exception 'Privacy policy consent is required to create an account'
      using errcode = 'check_violation';
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, left(v_name, 60));

  insert into public.user_consents (user_id, consent_type, granted, policy_version)
  values (new.id, 'privacy_policy', true, left(btrim(v_version), 40));

  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------- account deletion
-- Deletes the caller's auth user; every user-owned table cascades from it.
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;
  delete from auth.users where id = v_uid;
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
