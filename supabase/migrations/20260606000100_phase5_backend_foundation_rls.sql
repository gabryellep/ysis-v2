-- Ysis V2 Phase 5: backend foundation data model with RLS from day one.
-- Adapted from Ysis V1 Phase 8/9 migrations. No table is public by default.

create extension if not exists pgcrypto;

create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  cloud_sync_enabled boolean not null default false,
  schema_version smallint not null default 1 check (schema_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guest_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  session_hash text not null check (btrim(session_hash) <> ''),
  purpose text not null default 'ferramenta' check (purpose in ('ferramenta', 'privacy_control')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint guest_sessions_user_session_hash_unique unique (user_id, session_hash)
);

comment on table public.guest_sessions is
  'Stores only non-sensitive session metadata for future handoff. Guest symptom text/audio must not be persisted here.';

create table public.consent_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  consent_type text not null check (
    consent_type in ('tool_processing', 'ai_processing', 'cloud_sync', 'report_generation', 'privacy_control')
  ),
  decision text not null check (decision in ('granted', 'revoked', 'declined')),
  scope text not null check (btrim(scope) <> ''),
  source text not null default 'ferramenta' check (btrim(source) <> ''),
  text_version text not null check (btrim(text_version) <> ''),
  payload jsonb not null default '{}'::jsonb,
  schema_version smallint not null default 1 check (schema_version > 0),
  created_at timestamptz not null default now()
);

create table public.privacy_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'cloud_export_requested',
      'cloud_export_completed',
      'cloud_export_failed',
      'cloud_delete_requested',
      'cloud_delete_completed',
      'cloud_delete_failed',
      'session_deleted',
      'discreet_mode_enabled',
      'discreet_mode_disabled'
    )
  ),
  category text not null check (
    category in (
      'symptom_records',
      'reports',
      'user_profile',
      'consent_logs',
      'privacy_events',
      'guest_session',
      'all_cloud_data'
    )
  ),
  source text not null default 'privacy_controls' check (btrim(source) <> ''),
  request_id uuid not null default gen_random_uuid(),
  payload jsonb not null default '{}'::jsonb,
  schema_version smallint not null default 1 check (schema_version > 0),
  created_at timestamptz not null default now()
);

create table public.symptom_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_record_id text not null check (btrim(client_record_id) <> ''),
  source text not null default 'account' check (source in ('account', 'imported')),
  payload_version text not null default 'symptom-record-v1' check (btrim(payload_version) <> ''),
  payload jsonb not null,
  recorded_on date not null,
  schema_version smallint not null default 1 check (schema_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint symptom_records_user_client_record_unique unique (user_id, client_record_id),
  constraint symptom_records_id_user_unique unique (id, user_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_report_id text not null check (btrim(client_report_id) <> ''),
  title text not null check (btrim(title) <> ''),
  purpose text not null check (
    purpose in ('consultation', 'symptoms', 'conversation', 'personal', 'gynecologist', 'psychologist', 'urgent_care', 'sensitive_situation')
  ),
  status text not null default 'draft' check (status in ('draft', 'reviewed', 'exported', 'deleted')),
  source text not null default 'account' check (source in ('account', 'imported')),
  payload_version text not null default 'structured-report-v1' check (btrim(payload_version) <> ''),
  payload jsonb not null,
  schema_version smallint not null default 1 check (schema_version > 0),
  prompt_version text,
  model_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reports_user_client_report_unique unique (user_id, client_report_id),
  constraint reports_id_user_unique unique (id, user_id)
);

create table public.report_record_links (
  report_id uuid not null,
  record_id uuid not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  relation_type text not null default 'context' check (relation_type in ('focus', 'context')),
  created_at timestamptz not null default now(),
  constraint report_record_links_pkey primary key (report_id, record_id),
  constraint report_record_links_report_fk
    foreign key (report_id, user_id)
    references public.reports (id, user_id)
    on delete cascade,
  constraint report_record_links_record_fk
    foreign key (record_id, user_id)
    references public.symptom_records (id, user_id)
    on delete cascade
);

create unique index report_record_links_single_focus_idx
  on public.report_record_links (report_id)
  where relation_type = 'focus';

create index user_profiles_created_at_idx on public.user_profiles (created_at desc);
create index guest_sessions_user_expires_at_idx on public.guest_sessions (user_id, expires_at desc);
create index consent_logs_user_type_created_at_idx on public.consent_logs (user_id, consent_type, created_at desc);
create index privacy_events_user_type_category_created_at_idx on public.privacy_events (user_id, event_type, category, created_at desc);
create index symptom_records_user_recorded_on_idx on public.symptom_records (user_id, recorded_on desc);
create index reports_user_status_created_at_idx on public.reports (user_id, status, created_at desc);
create index report_record_links_user_report_idx on public.report_record_links (user_id, report_id);
create index report_record_links_user_record_idx on public.report_record_links (user_id, record_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

create trigger symptom_records_set_updated_at
  before update on public.symptom_records
  for each row execute function public.set_updated_at();

create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.guest_sessions enable row level security;
alter table public.consent_logs enable row level security;
alter table public.privacy_events enable row level security;
alter table public.symptom_records enable row level security;
alter table public.reports enable row level security;
alter table public.report_record_links enable row level security;

create policy "Users can read their profile"
  on public.user_profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can insert their profile"
  on public.user_profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their profile"
  on public.user_profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can delete their profile"
  on public.user_profiles for delete to authenticated
  using ((select auth.uid()) = id);

create policy "Users can read their guest session metadata"
  on public.guest_sessions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their guest session metadata"
  on public.guest_sessions for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their guest session metadata"
  on public.guest_sessions for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their consent logs"
  on public.consent_logs for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their privacy events"
  on public.privacy_events for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their symptom records"
  on public.symptom_records for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users with cloud sync enabled can insert symptom records"
  on public.symptom_records for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.user_profiles as profile
      where profile.id = (select auth.uid())
        and profile.cloud_sync_enabled = true
    )
  );

create policy "Users can delete their symptom records"
  on public.symptom_records for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their reports"
  on public.reports for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can delete their reports"
  on public.reports for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their report record links"
  on public.report_record_links for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their report record links"
  on public.report_record_links for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their report record links"
  on public.report_record_links for delete to authenticated
  using ((select auth.uid()) = user_id);

create function public.log_privacy_event(
  p_event_type text,
  p_category text,
  p_result text default 'requested'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  new_request_id uuid := gen_random_uuid();
begin
  if current_user_id is null then
    raise exception 'Authentication is required to log privacy events.';
  end if;

  insert into public.privacy_events (
    user_id,
    event_type,
    category,
    payload,
    request_id
  )
  values (
    current_user_id,
    p_event_type,
    p_category,
    jsonb_build_object('result', p_result),
    new_request_id
  );

  return new_request_id;
end;
$$;

revoke all on function public.log_privacy_event(text, text, text) from public;
grant execute on function public.log_privacy_event(text, text, text) to authenticated;

-- consent_logs and privacy_events are append-only through future trusted
-- backend/service flows. Browser inserts are intentionally closed in Phase 5.
-- reports inserts are also closed until explicit cloud report sync is designed.
