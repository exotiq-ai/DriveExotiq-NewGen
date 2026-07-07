-- QA P2: de_waitlist had no unique constraint on email, so repeat submits
-- created duplicate rows (and duplicate admin emails in prod).
-- Case-insensitive uniqueness: the route lowercases before insert, but the
-- index guards raw-cased writes from any other path too.
-- Duplicate rows were checked (none existed) before adding this index.
create unique index if not exists de_waitlist_email_lower_uidx
  on public.de_waitlist (lower(email));
