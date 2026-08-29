-- Run this once in the Supabase dashboard: SQL Editor → New query → paste
-- this whole file → Run. Kept here too so the schema has a real history
-- alongside the rest of the code, instead of only existing as clicks in
-- a dashboard no one can diff.

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null
);

-- Row Level Security is on by default for new tables. We're writing to
-- this table only from the server (with the secret key, which bypasses
-- RLS entirely), so no policy is needed for our own code to work — this
-- just makes sure nothing else can read or write this table directly.
alter table contact_messages enable row level security;
