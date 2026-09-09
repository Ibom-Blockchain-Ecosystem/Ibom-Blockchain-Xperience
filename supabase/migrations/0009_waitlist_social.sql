-- Run in Supabase SQL Editor, after 0001-0008.
--
-- Ambassador applicants aren't all reachable the same way — add optional
-- social handle, WhatsApp and Telegram fields so the team has more than
-- just an email to find/verify a real, active applicant.

alter table waitlist_entries
  add column if not exists social_handle text,
  add column if not exists whatsapp text,
  add column if not exists telegram text;
