-- Run in Supabase SQL Editor, after 0001-0007.
--
-- Ambassador waitlist needs more than a name/email/role to be useful for
-- regional matching: which country the applicant is applying from, and
-- (optionally) why they want to be an ambassador.

alter table waitlist_entries
  add column if not exists country text not null default '',
  add column if not exists motivation text;
