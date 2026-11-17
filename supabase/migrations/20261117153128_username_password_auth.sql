-- Username sign-in uses a stable internal alias, so usernames must be unique
-- independent of capitalization and cannot change without updating that alias.
create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username))
  where username is not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  requested_username text;
  chosen_username text;
  chosen_display_name text;
begin
  requested_username := lower(btrim(coalesce(new.raw_user_meta_data->>'username', '')));
  chosen_display_name := coalesce(
    nullif(btrim(new.raw_user_meta_data->>'display_name'), ''),
    nullif(btrim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(requested_username, ''),
    'Nexus üyesi'
  );

  if requested_username ~ '^[a-z0-9_-]{3,24}$' then
    chosen_username := requested_username;
  else
    chosen_username := 'user-' || substr(new.id::text, 1, 8);
  end if;

  insert into public.profiles(id, username, display_name)
  values(new.id, chosen_username, chosen_display_name)
  on conflict(id) do update
    set username = excluded.username,
        display_name = excluded.display_name;

  return new;
end;
$$;

-- Profile editing must not desynchronize the username from the Auth alias.
revoke update (username) on table public.profiles from authenticated;

-- The public PostgREST wrapper should run with the caller's privileges; only
-- the private helper is SECURITY DEFINER and it only updates auth.uid()'s row.
create or replace function public.consume_ai_request()
returns boolean
language sql
volatile
security invoker
set search_path = pg_catalog, private, auth
as $$ select private.consume_ai_request() $$;

revoke all on function public.consume_ai_request() from public, anon;
grant execute on function public.consume_ai_request() to authenticated;
