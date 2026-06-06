-- Ysis V2 Phase 6: expand privacy audit event types without opening browser writes.

alter table public.privacy_events
  drop constraint privacy_events_event_type_check;

alter table public.privacy_events
  add constraint privacy_events_event_type_check check (
    event_type in (
      'cloud_export_requested',
      'cloud_export_completed',
      'cloud_export_failed',
      'cloud_delete_requested',
      'cloud_delete_completed',
      'cloud_delete_failed',
      'session_deleted',
      'discreet_mode_enabled',
      'discreet_mode_disabled',
      'consent_granted',
      'consent_revoked',
      'guest_session_started',
      'do_not_save_preference_set'
    )
  );

-- RLS remains enabled and direct browser inserts remain closed. The backend
-- writes audit events with the service role and never stores intimate text.
