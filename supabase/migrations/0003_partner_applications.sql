-- Run in Supabase SQL Editor, same as 0001 and 0002.

create table if not exists partner_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  org_name text not null,
  contact_name text not null,
  email text not null,
  partnership_type text not null,
  message text not null
);

alter table partner_applications enable row level security;
