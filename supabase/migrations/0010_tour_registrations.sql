-- Run in Supabase SQL Editor, after 0001-0009.
--
-- One registration form for every Tour stop — country + specific city —
-- replacing the external Typeform link. Same double opt-in pattern as
-- waitlist_entries/continent_signups: `verified` flips true once they
-- click the link in their confirmation email.

create table if not exists tour_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  country text not null,
  city text not null,
  verified boolean not null default false,
  verification_token uuid not null default gen_random_uuid()
);

alter table tour_registrations enable row level security;

-- One registration per email per country — someone can still register
-- for more than one country's tour stop, just not the same one twice.
create unique index if not exists tour_registrations_email_country_key
  on tour_registrations (lower(email), country);
