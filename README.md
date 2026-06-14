# Ingegno — One URL. Everything you are.

A multi-tenant SaaS that gives polymaths a single premium profile for their projects, writing, skills and story. One page at `ingegno.app/username` that holds everything you do — built for the people who can't be put in a box. Built as P4 of a freelance web development portfolio.

## Live Demo

[p4-ingegno.vercel.app](https://p4-ingegno.vercel.app)

## Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React + Tailwind CSS v4
- **Auth & DB:** Supabase (PostgreSQL + Auth + Row Level Security)
- **OAuth / Sync:** GitHub OAuth — automatic commit sync
- **Animations:** Framer Motion
- **Deploy:** Vercel
- **Language:** TypeScript

## Features

- **Public profiles** at `/username` — multi-tenant, each user owns their own page
- **Project, writing and skills sections** that combine into one coherent narrative
- **GitHub commit sync** — connect your account and your activity stays live, not a static snapshot
- **Manual activity updates** for non-code work
- **Auth-protected editor** with Row Level Security — users only edit their own profile
- **Free / Pro tiers** (unlimited projects, custom domain and badge removal on Pro)
- Cinematic, editorial design — Renaissance-inspired typography
- Responsive, mobile-first

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local   # then fill in the values below

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, never exposed to the client) |
| `NEXT_PUBLIC_SITE_URL` | Base URL of the deployment (used for auth + OAuth redirects) |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | GitHub OAuth app client ID (public) |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret (server-only) |

## Notes

This is a portfolio project. The product concept is real but data is illustrative.
