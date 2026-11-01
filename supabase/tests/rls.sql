-- RLS / trigger tests. Run via supabase/tests/run-local.sh (plain Postgres + stub)
-- or against a Supabase local stack. Raises an exception on first failure.
\set ON_ERROR_STOP on
begin;

create or replace function pg_temp.assert(cond boolean, msg text) returns void language plpgsql as $$
begin if not coalesce(cond, false) then raise exception 'FAIL: %', msg; end if; end $$;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'a@x.test', '{"privacy_policy_version":"2026-11","display_name":"Ana"}'),
  ('00000000-0000-0000-0000-00000000000b', 'b@x.test', '{"privacy_policy_version":"2026-11"}');

-- signup trigger created profile + consent
select pg_temp.assert((select count(*) from public.profiles) = 2, 'profiles created by trigger');
select pg_temp.assert((select display_name from public.profiles where id='00000000-0000-0000-0000-00000000000a') = 'Ana', 'display name stored');
select pg_temp.assert((select count(*) from public.user_consents where consent_type='privacy_policy' and granted) = 2, 'privacy consent recorded');

-- signup without consent is rejected
do $$ begin
  begin
    insert into auth.users (email) values ('c@x.test');
    raise exception 'FAIL: signup without consent was allowed';
  exception when check_violation then null; end;
end $$;

-- RLS as user A
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', true);

select pg_temp.assert((select count(*) from public.profiles) = 1, 'A sees only own profile');
select pg_temp.assert((select count(*) from public.user_consents) = 1, 'A sees only own consents');

update public.profiles set coaching_mode='guided' where id='00000000-0000-0000-0000-00000000000a';
select pg_temp.assert((select coaching_mode from public.profiles) = 'guided', 'A can update own profile');

with u as (update public.profiles set display_name='hax' where id='00000000-0000-0000-0000-00000000000b' returning 1)
select pg_temp.assert((select count(*) from u) = 0, 'A cannot update B profile');

do $$ begin
  begin
    insert into public.user_consents (user_id, consent_type, granted, policy_version)
    values ('00000000-0000-0000-0000-00000000000b', 'health_data', true, 'v1');
    raise exception 'FAIL: A inserted consent for B';
  exception when insufficient_privilege then null; end;
end $$;

insert into public.user_consents (user_id, consent_type, granted, policy_version)
values ('00000000-0000-0000-0000-00000000000a', 'health_data', true, 'v1');

with u as (update public.user_consents set granted=false returning 1)
select pg_temp.assert((select count(*) from u) = 0, 'consents are immutable (no update policy)');
with d as (delete from public.user_consents returning 1)
select pg_temp.assert((select count(*) from d) = 0, 'consents cannot be deleted by client');
with d as (delete from public.profiles returning 1)
select pg_temp.assert((select count(*) from d) = 0, 'profiles cannot be deleted by client');

do $$ begin
  begin
    insert into public.profiles (id) values (gen_random_uuid());
    raise exception 'FAIL: client inserted profile';
  exception when insufficient_privilege then null; end;
end $$;

-- anon sees nothing / cannot call delete_my_account
reset role;
set local role anon;
select pg_temp.assert(has_function_privilege('anon', 'public.delete_my_account()', 'execute') = false, 'anon cannot execute delete_my_account');
reset role;

-- account deletion cascades only the caller
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', true);
select public.delete_my_account();
reset role;
select pg_temp.assert((select count(*) from auth.users) = 1, 'only A deleted');
select pg_temp.assert((select count(*) from public.profiles) = 1, 'A profile cascaded');
select pg_temp.assert((select count(*) from public.user_consents where user_id='00000000-0000-0000-0000-00000000000a') = 0, 'A consents cascaded');

-- unauthenticated delete rejected
set local role authenticated;
select set_config('request.jwt.claim.sub', '', true);
do $$ begin
  begin perform public.delete_my_account(); raise exception 'FAIL: unauthenticated delete allowed';
  exception when sqlstate '28000' then null; end;
end $$;
reset role;

select 'ALL RLS TESTS PASSED' as result;
rollback;
