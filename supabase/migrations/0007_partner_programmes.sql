-- Run in Supabase SQL Editor, after 0001-0006.
--
-- Lets a partner pick which campaign(s) they want to partner or sponsor —
-- Summit, Tour, Build, or any combination ("all campaigns" is just every
-- box checked, not a separate value).

alter table partner_applications
  add column if not exists programmes text[] not null default '{}';
