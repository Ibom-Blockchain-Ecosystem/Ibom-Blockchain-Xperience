-- Run in Supabase SQL Editor, after 0001-0004.
--
-- "Registering" twice with the same email shouldn't create two rows.
-- Contact and partner-application messages are different — someone can
-- legitimately write in more than once — so those two are left alone;
-- this only applies to the two true signup/registration forms.

create unique index if not exists waitlist_entries_email_key
  on waitlist_entries (lower(email));

-- One signup per email per continent — someone can still ask to be
-- notified about more than one continent, just not the same one twice.
create unique index if not exists continent_signups_email_continent_key
  on continent_signups (lower(email), continent);
