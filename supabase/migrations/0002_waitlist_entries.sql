-- Run in Supabase SQL Editor, same as 0001.

create table if not exists waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  role text not null
);

alter table waitlist_entries enable row level security;
