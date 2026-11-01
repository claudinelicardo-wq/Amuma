#!/usr/bin/env bash
# Runs migrations + RLS tests on a throwaway local Postgres database (no Supabase needed).
# Requires a local Postgres server and root (uses `su postgres`). SQL is piped via stdin.
set -euo pipefail
DB=amuma_test
cd "$(dirname "$0")/../.."
run() { su postgres -c "psql -X -q -v ON_ERROR_STOP=1 -d $DB" ; }
su postgres -c "dropdb --if-exists $DB" 2>/dev/null
su postgres -c "createdb $DB"
run < supabase/tests/local_stub.sql
for f in supabase/migrations/*.sql; do run < "$f"; done
out=$(su postgres -c "psql -X -t -v ON_ERROR_STOP=1 -d $DB" < supabase/tests/rls.sql 2>&1) || { echo "$out"; su postgres -c "dropdb $DB"; exit 1; }
echo "$out" | grep -E "PASSED|FAIL|ERROR" || { echo "$out"; exit 1; }
su postgres -c "dropdb $DB"
