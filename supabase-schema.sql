-- PxP Baseball Chart — Supabase schema (stingray-tracker pattern)
--
-- Single JSON-document table per user. The full client state ships up
-- as a blob. RLS scopes everything to the signed-in user. Realtime fans
-- changes back out to that user's other devices.
--
-- Run this once in the Supabase SQL editor. After running:
--   1. Database -> Replication -> enable Realtime on `app_state`
--   2. Authentication -> Email Templates -> set "Magic Link" body to use
--      {{ .Token }} (6-digit code) instead of {{ .ConfirmationURL }}
--   3. Authentication -> SMTP -> point at Resend (host smtp.resend.com,
--      port 465, user `resend`, pass = your Resend API key)

create table if not exists app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  last_client_id text,
  updated_at timestamptz not null default now()
);

alter table app_state enable row level security;

drop policy if exists "Users read own state" on app_state;
drop policy if exists "Users insert own state" on app_state;
drop policy if exists "Users update own state" on app_state;
drop policy if exists "Users delete own state" on app_state;

create policy "Users read own state" on app_state
  for select using (auth.uid() = user_id);

create policy "Users insert own state" on app_state
  for insert with check (auth.uid() = user_id);

create policy "Users update own state" on app_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users delete own state" on app_state
  for delete using (auth.uid() = user_id);

-- Enable realtime on this table. Idempotent: ignored if already added.
do $$
begin
  begin
    execute 'alter publication supabase_realtime add table app_state';
  exception when duplicate_object then
    null;
  end;
end $$;
