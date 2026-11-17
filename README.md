# Nexus

Nexus is a Turkish-first community platform built with Next.js, TypeScript, Supabase Auth/Postgres/Storage, and Render. The repository is connected to Render's `main` branch; pushing a commit to `main` starts a deployment.

## Edit on Ubuntu

The working copy is `~/Documents/Codex/nexus`.

1. Install Node.js 22 or newer.
2. Open a terminal in this folder and run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project. Keep all secret keys out of browser variables. `SUPABASE_SERVICE_ROLE_KEY` is only needed by the admin API and must remain server-side.
4. Start the local site with `npm run dev`, then open http://localhost:3000.
5. Before sharing a change, run `npm run lint` and `npm run build`. Commit and push to `main` to publish it through Render.

## Authentication

The app asks for a unique username and password only. Supabase password Auth requires an email or phone internally, so Nexus derives a non-deliverable address from the normalized username; it does not ask users for an email address. Keep Supabase Email Auth enabled and turn **Confirm email** off. The Google sign-in option is not shown. Password recovery by email is not available, so users should keep their password safe.

New usernames are normalized to lowercase ASCII with hyphens and underscores, and are 3–24 characters. The database enforces case-insensitive uniqueness and prevents profile edits from changing a username independently of its Auth alias.

## Supabase setup

The existing project is already provisioned. For a fresh database, apply the SQL in `supabase/schema.sql`, then apply each file under `supabase/migrations/` in timestamp order. Keep those migrations in Git and use forward-only changes for production. Row-level security policies are the access boundary; do not expose a service-role key to browser code.

## Features and limits

The platform includes a public feed, profiles, comments, likes, follows, saved posts, private conversations, communities, reporting, admin moderation, and four learning/building spaces (DebateHub, SkillShare, IdeaMarket, DevSpace). Some features depend on correct Supabase environment variables and RLS policies. Media uploads and some learning workflows remain limited; check the UI and database before describing any feature as complete.

Nexus AI is optional. Set `NVIDIA_API_KEY` (and optionally `NVIDIA_MODEL`) or `OPENAI_API_KEY` only in the server environment. Provider keys must never use a `NEXT_PUBLIC_` prefix. The AI endpoint requires a signed-in user and enforces a daily request limit.

## Production

Render serves the production site at [nexus-social-mpch.onrender.com](https://nexus-social-mpch.onrender.com) and deploys commits pushed to `main`. Supabase Auth redirect URLs should include the production origin and `/auth/callback`; add localhost only for local development. Never commit `.env.local` or credentials.

## Data protection

The private `nexus-media` bucket restricts uploads to each user's UUID path. Supabase backups cover Postgres but not Storage objects; back up the bucket separately if users depend on uploaded files. Review Supabase security advisories and configure Auth rate limits/CAPTCHA before opening the platform to broad public traffic.
