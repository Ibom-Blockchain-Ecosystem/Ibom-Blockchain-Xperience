-- Run in Supabase SQL Editor, same as 0001-0003.

create table if not exists continent_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  continent text not null
);

alter table continent_signups enable row level security;
