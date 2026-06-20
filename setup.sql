-- Run this once in Supabase SQL Editor

create table if not exists interview_prep_kv (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table interview_prep_kv enable row level security;

-- Permissive policy: anon key can read/write (no login, single-user app)
create policy "anon full access"
  on interview_prep_kv
  for all
  to anon
  using (true)
  with check (true);

-- RLS policies only take effect once the role also has the underlying
-- table-level grant — without this, PostgREST returns 42501 "permission
-- denied" before RLS is even evaluated.
grant select, insert, update, delete on public.interview_prep_kv to anon;
