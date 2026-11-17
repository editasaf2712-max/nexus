-- Per-user write throttles enforced in PostgreSQL so REST requests cannot bypass them.
create index if not exists messages_sender_created_idx on public.messages(sender_id,created_at desc);
create index if not exists module_comments_author_created_idx on public.module_comments(author_id,created_at desc);
create index if not exists follows_follower_created_idx on public.follows(follower_id,created_at desc);
create index if not exists post_likes_user_created_idx on public.post_likes(user_id,created_at desc);
create or replace function private.enforce_social_rate_limit() returns trigger language plpgsql security definer set search_path=pg_catalog,public,auth as $$
declare actor uuid; amount bigint; max_per_hour integer;
begin
 if tg_table_name='posts' then actor:=new.author_id; max_per_hour:=30; select count(*) into amount from public.posts where author_id=actor and created_at>now()-interval '1 hour';
 elsif tg_table_name='comments' then actor:=new.author_id; max_per_hour:=60; select count(*) into amount from public.comments where author_id=actor and created_at>now()-interval '1 hour';
 elsif tg_table_name='messages' then actor:=new.sender_id; max_per_hour:=120; select count(*) into amount from public.messages where sender_id=actor and created_at>now()-interval '1 hour';
 elsif tg_table_name='module_comments' then actor:=new.author_id; max_per_hour:=60; select count(*) into amount from public.module_comments where author_id=actor and created_at>now()-interval '1 hour';
 elsif tg_table_name='follows' then actor:=new.follower_id; max_per_hour:=100; select count(*) into amount from public.follows where follower_id=actor and created_at>now()-interval '1 hour';
 elsif tg_table_name='post_likes' then actor:=new.user_id; max_per_hour:=240; select count(*) into amount from public.post_likes where user_id=actor and created_at>now()-interval '1 hour';
 else return new; end if;
 if actor is distinct from auth.uid() then raise exception 'Invalid actor' using errcode='42501'; end if;
 if amount>=max_per_hour then raise exception 'Rate limit exceeded. Try again later.' using errcode='P0001'; end if;
 return new;
end $$;
revoke all on function private.enforce_social_rate_limit() from public,anon,authenticated;
drop trigger if exists limit_social_posts on public.posts;create trigger limit_social_posts before insert on public.posts for each row execute function private.enforce_social_rate_limit();
drop trigger if exists limit_social_comments on public.comments;create trigger limit_social_comments before insert on public.comments for each row execute function private.enforce_social_rate_limit();
drop trigger if exists limit_social_messages on public.messages;create trigger limit_social_messages before insert on public.messages for each row execute function private.enforce_social_rate_limit();
drop trigger if exists limit_social_module_comments on public.module_comments;create trigger limit_social_module_comments before insert on public.module_comments for each row execute function private.enforce_social_rate_limit();
drop trigger if exists limit_social_follows on public.follows;create trigger limit_social_follows before insert on public.follows for each row execute function private.enforce_social_rate_limit();
drop trigger if exists limit_social_likes on public.post_likes;create trigger limit_social_likes before insert on public.post_likes for each row execute function private.enforce_social_rate_limit();
