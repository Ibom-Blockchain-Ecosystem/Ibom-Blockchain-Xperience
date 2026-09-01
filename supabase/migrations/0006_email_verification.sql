-- Run in Supabase SQL Editor, after 0001-0005.
--
-- Adds double opt-in to the two true signup forms (not contact/partners —
-- gating a message behind an email click doesn't make sense there).

alter table waitlist_entries
  add column if not exists verified boolean not null default false,
  add column if not exists verification_token uuid not null default gen_random_uuid();

alter table continent_signups
  add column if not exists verified boolean not null default false,
  add column if not exists verification_token uuid not null default gen_random_uuid(),
  add column if not exists continent_slug text not null default '';
