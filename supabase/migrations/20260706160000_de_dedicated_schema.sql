-- Drive Exotiq — dedicated project schema (DriveExotiqWeb / immqxidzthwinexwlnel)
--
-- Mirrors the three DE tables previously colocated in the shared Exotiq monolith,
-- adds the one-contact funnel `interest` field (copy brief §4), and provisions the
-- marketplace waitlist + sponsor inquiry tables the redesign needs.
--
-- Security posture: every privileged read/write happens server-side via the
-- service_role key (bypasses RLS). Admin auth is app-layer (ADMIN_PASSWORD header),
-- not Postgres roles — so the monolith's app_role/super_admins policies are
-- intentionally NOT reproduced. RLS is enabled with no anon write/read grants
-- except public SELECT of active Instagram posts (the one anon-client read path).

-- ─────────────────────────── de_applications ───────────────────────────
create table if not exists public.de_applications (
  id                         uuid primary key default gen_random_uuid(),
  full_name                  text not null,
  email                      text not null,
  phone                      text not null,
  current_city               text not null,
  city_of_interest           text not null,
  brief_intro                text not null,
  invite_code                text,
  interest                   text not null default 'access'
    check (interest in ('access','drives','title-wrap','tour','drive','partnership','other')),
  created_at                 timestamptz default now(),
  status                     text default 'pending',
  reviewed_at                timestamptz,
  notes                      text,
  sms_transactional_consent  boolean default false,
  sms_marketing_consent      boolean default false,
  consent_timestamp          timestamptz,
  consent_ip                 text
);
create index if not exists idx_de_applications_created_at on public.de_applications (created_at desc);
create index if not exists idx_de_applications_email      on public.de_applications (email);
create index if not exists idx_de_applications_status     on public.de_applications (status);
create index if not exists idx_de_applications_interest   on public.de_applications (interest);
create index if not exists idx_de_applications_sms_marketing
  on public.de_applications (sms_marketing_consent) where sms_marketing_consent = true;
alter table public.de_applications enable row level security;

-- ─────────────────────────── de_booking_leads ──────────────────────────
-- Retained for the legacy /api/booking-leads path (Wheelbase/Phoenix). Not
-- surfaced on the newgen site, but kept so the route never errors if hit.
create table if not exists public.de_booking_leads (
  id                         uuid primary key default gen_random_uuid(),
  first_name                 varchar not null,
  last_name                  varchar not null,
  email                      varchar not null,
  phone                      varchar not null,
  status                     varchar not null default 'lead',
  location                   varchar default 'phoenix',
  source_page                varchar,
  date_of_birth              date,
  address                    text,
  driver_license_number      varchar,
  driver_license_expiry      date,
  insurance_provider         varchar,
  insurance_policy_number    varchar,
  insurance_expiry           date,
  utm_source                 varchar,
  utm_medium                 varchar,
  utm_campaign               varchar,
  referrer_url               text,
  session_id                 text,
  ip_address                 text,
  user_agent                 text,
  notes                      text,
  created_at                 timestamptz default now(),
  updated_at                 timestamptz default now(),
  fleet_slug                 text,
  sms_transactional_consent  boolean default false,
  sms_marketing_consent      boolean default false,
  consent_timestamp          timestamptz,
  consent_ip                 text
);
create index if not exists idx_de_booking_leads_created_at on public.de_booking_leads (created_at desc);
create index if not exists idx_de_booking_leads_email      on public.de_booking_leads (email);
create index if not exists idx_de_booking_leads_status     on public.de_booking_leads (status);
create index if not exists idx_de_booking_leads_fleet_slug on public.de_booking_leads (fleet_slug) where fleet_slug is not null;
alter table public.de_booking_leads enable row level security;

-- ─────────────────────────── de_instagram_posts ────────────────────────
create table if not exists public.de_instagram_posts (
  id             uuid primary key default gen_random_uuid(),
  post_url       text not null,
  image_url      text,
  caption        text,
  post_id        text,
  display_order  int default 0,
  is_active      boolean default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
create index if not exists idx_de_instagram_posts_active        on public.de_instagram_posts (is_active);
create index if not exists idx_de_instagram_posts_display_order on public.de_instagram_posts (display_order desc);
alter table public.de_instagram_posts enable row level security;
drop policy if exists "public reads active instagram posts" on public.de_instagram_posts;
create policy "public reads active instagram posts"
  on public.de_instagram_posts for select
  using (is_active = true);

-- ─────────────────────────── de_waitlist ───────────────────────────────
-- exotiq.rent marketplace waitlist (CTA-WAITLIST / copy brief §10.3).
create table if not exists public.de_waitlist (
  id                     uuid primary key default gen_random_uuid(),
  email                  text not null,
  city                   text,
  desired_car            text,
  source                 text default 'marketplace',
  sms_marketing_consent  boolean default false,
  consent_ip             text,
  created_at             timestamptz default now()
);
create index if not exists idx_de_waitlist_created_at on public.de_waitlist (created_at desc);
create index if not exists idx_de_waitlist_email      on public.de_waitlist (email);
alter table public.de_waitlist enable row level security;

-- ─────────────────────────── de_sponsor_inquiries ──────────────────────
-- CMP-FORM-SPONSOR (copy brief §9.6). Tier interest is separate from the
-- consumer /apply funnel; company + budget are sponsor-only fields.
create table if not exists public.de_sponsor_inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  company      text,
  email        text not null,
  phone        text,
  interest     text not null default 'not-sure'
    check (interest in ('title-wrap','tour','drive','partnership','not-sure')),
  budget       text,
  message      text,
  status       text default 'new',
  consent_ip   text,
  created_at   timestamptz default now()
);
create index if not exists idx_de_sponsor_inquiries_created_at on public.de_sponsor_inquiries (created_at desc);
create index if not exists idx_de_sponsor_inquiries_email      on public.de_sponsor_inquiries (email);
alter table public.de_sponsor_inquiries enable row level security;
