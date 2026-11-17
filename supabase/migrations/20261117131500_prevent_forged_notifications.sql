-- Notifications are generated only by trusted database triggers, preventing forged system events.
drop policy if exists "users create notifications as actor" on public.notifications;
revoke insert on public.notifications from anon,authenticated;
