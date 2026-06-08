# Implementation Plan — P4 Ingegno

**Goal:** Build and deploy Ingegno, a mini SaaS that generates premium public profiles for modern polymaths. Users sign up, fill a dashboard, and get a public page at `ingegno.app/[username]` that shows their projects, narrative, roles, and live activity feed (manual updates + GitHub commits).

**Spec:** `docs/superpowers/specs/2026-05-16-ingegno-design.md`  
**Stitch prompt:** `docs/superpowers/specs/2026-05-16-ingegno-stitch-prompt.md`  
**Folder:** `Portfolio/P4 - Ingegno/`

---

## Architecture

```
app/
  page.tsx                      ← Landing page (public)
  (auth)/
    login/page.tsx              ← Email+password login
    signup/page.tsx             ← New account + username claim
  auth/callback/route.ts        ← Supabase OAuth exchange
  dashboard/
    layout.tsx                  ← DashboardNav sidebar wrapper (auth guard)
    page.tsx                    ← Redirect to /dashboard/profile
    profile/page.tsx            ← Profile editor
    projects/page.tsx           ← Projects CRUD
    updates/page.tsx            ← Updates feed + form
    settings/page.tsx           ← GitHub OAuth + account settings
  [username]/
    page.tsx                    ← Public profile (Server Component)
    not-found.tsx               ← 404 for unknown/private usernames
  api/
    github/callback/route.ts    ← GitHub OAuth callback (server-only)
    github/sync/route.ts        ← Manual commit sync trigger
    og/[username]/route.tsx     ← @vercel/og OG image (edge runtime)
  actions/
    auth.ts                     ← signUp, signIn, signOut
    profile.ts                  ← updateProfile, updatePublicStatus, uploadAvatar
    projects.ts                 ← createProject, updateProject, deleteProject, reorder
    updates.ts                  ← createUpdate, deleteUpdate
    github.ts                   ← updateReposToShow, getUserRepos, disconnectGitHub

components/
  landing/                      ← Navbar, Hero, TheProblem, Features, TheName, Pricing, FinalCTA, LandingFooter
  dashboard/                    ← DashboardNav, ProfileForm, ProjectForm, ProjectsClient, UpdateForm, GitHubConnect, RepoSelector
  profile/                      ← ProfileNavbar, ProfileHero, ProfileNarrative, ProjectGrid, ActivityFeed, ProfileFooter
  ui/                           ← BlurText, icons

lib/
  supabase/client.ts            ← createBrowserClient
  supabase/server.ts            ← createServerClient + cookies
  types.ts                      ← Profile, Project, Update, GithubActivity, ActivityItem
  utils.ts                      ← cn(), getDomainFromUrl()
  plan.ts                       ← getVisibleProjects(), getLockedProjects(), canAddProject()
  plan.test.ts                  ← Vitest unit tests for freemium logic

supabase/migrations/
  001_initial_schema.sql        ← All tables + RLS + storage policies
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Styling | Tailwind CSS + custom liquid-glass CSS classes |
| Auth + DB | Supabase (`@supabase/ssr`) |
| Animations | Framer Motion |
| OG Images | `@vercel/og` (edge runtime) |
| Testing | Vitest |
| Deploy | Vercel |

## Design System Summary

- **Background:** `#000` black throughout — landing, dashboard, public profile
- **Headings:** Instrument Serif italic (`font-heading italic`) via CSS variable `--font-heading`
- **Body:** Barlow (`font-body`) via CSS variable `--font-body`
- **Text opacity scale:** `text-white` → `text-white/80` → `text-white/60` → `text-white/40` → `text-white/30` → `text-white/20`
- **Liquid glass components:** `.liquid-glass` (blur 4px) and `.liquid-glass-strong` (blur 50px) — custom CSS classes in `globals.css`
- **Freemium:** Free = first 2 projects public; Pro = all projects public. No limit on adding projects.

## Security Constraints (non-negotiable)

- `access_token` (GitHub) — **never** sent to client; only used in Route Handlers and Server Actions
- `SUPABASE_SERVICE_ROLE_KEY` — server env only, never in client bundle
- RLS enabled on all 5 tables from day 1
- `github_connections` table: owner-only access, never public SELECT

---

## Tasks

### Task 1: Project Scaffold

**Files:**
- Create: `Portfolio/P4 - Ingegno/` (via create-next-app)
- Create: `Portfolio/P4 - Ingegno/.env.local.example`
- Create: `Portfolio/P4 - Ingegno/CLAUDE.md`

- [ ] **Step 1: Run create-next-app inside `Portfolio/`**

```bash
cd Portfolio
npx create-next-app@latest "P4 - Ingegno" --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd "P4 - Ingegno"
```

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install framer-motion @supabase/ssr @supabase/supabase-js clsx @vercel/og
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D vitest @vitejs/plugin-react
```

- [ ] **Step 4: Create `.env.local.example`**

```bash
# .env.local.example
# Copy this file to .env.local and fill in your values.
# NEVER commit .env.local to git.

# ── Supabase ──────────────────────────────────────────────────────────────────
# Find these in: Supabase Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-only. NEVER expose in client bundle.
# Find in: Supabase Dashboard → Project Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ── GitHub OAuth ───────────────────────────────────────────────────────────────
# Create a GitHub OAuth App at: https://github.com/settings/developers
# Authorization callback URL: http://localhost:3000/api/github/callback (dev)
#                             https://ingegno.app/api/github/callback (prod)
# client_id is public (NEXT_PUBLIC_) — used in client-side redirect
# client_secret is server-only — never prefix with NEXT_PUBLIC_
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

- [ ] **Step 5: Create `CLAUDE.md`**

```markdown
# CLAUDE.md — P4 Ingegno

## Project
**Ingegno** — premium public profiles for modern polymaths.
Public URL pattern: `ingegno.app/[username]`
This is P4 of a freelance portfolio (mini SaaS).

## Stack
- Next.js 14+ App Router (TypeScript)
- Tailwind CSS — no CSS modules, no styled-components
- Supabase (`@supabase/ssr` + `@supabase/supabase-js`) — Postgres + Auth + Storage
- Framer Motion — subtle animations only
- `@vercel/og` — OG image generation
- `clsx` — conditional class utility via `cn()` in `lib/utils.ts`
- vitest — unit tests

## Key Rules
- All mutations via Server Actions — never API routes for mutations
- Server Components by default; `use client` only when state/hooks/interactivity required
- `lib/supabase/client.ts` = browser client (createBrowserClient)
- `lib/supabase/server.ts` = server client (createServerClient + cookies())
- `SUPABASE_SERVICE_ROLE_KEY` server env only — never in client bundle
- RLS always on for all tables — never bypass with service_role in app logic
- `access_token` (GitHub) server-side only — never sent to client
- Follow Stitch design language: Instrument Serif headings, Barlow body, black background, liquid-glass components

## Dashboard Routes
- `/dashboard` — overview / profile summary
- `/dashboard/profile` — edit profile (name, tagline, roles, narrative, avatar)
- `/dashboard/projects` — manage projects (add, edit, reorder, delete)
- `/dashboard/updates` — post updates (text + optional image, link to project)
- `/dashboard/settings` — GitHub OAuth connect, account settings, plan status

## Auth Routes
- `/login` — email+password login
- `/signup` — new account creation → username claim
- `/auth/callback` — Supabase OAuth callback handler

## Public Route
- `/[username]` — public profile page (Server Component, reads from Supabase)

## Supabase Tables
- `profiles` — user profile data, plan (free/pro), is_public flag
- `projects` — projects per user, display_order, status
- `updates` — manual updates / log entries, optional image, optional project link
- `github_connections` — OAuth token + repos_to_show config (server-only access)
- `github_activity` — cached commits from GitHub API

## Freemium Logic
- Free: all projects stored, only first 2 shown publicly
- Pro: all projects shown publicly
- Functions in `lib/plan.ts`: `getVisibleProjects`, `getLockedProjects`, `canAddProject`

## Commits
Conventional format in English: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`
```

- [ ] **Step 6: Initialize git and commit**

```bash
git init
git add .
git commit -m "chore: initial Next.js 14 scaffold with dependencies"
```

---

### Task 2: Global Design System + Shared Types

**Files:**
- Modify: `Portfolio/P4 - Ingegno/tailwind.config.ts`
- Modify: `Portfolio/P4 - Ingegno/app/globals.css`
- Modify: `Portfolio/P4 - Ingegno/app/layout.tsx`
- Create: `Portfolio/P4 - Ingegno/lib/types.ts`
- Create: `Portfolio/P4 - Ingegno/lib/utils.ts`
- Create: `Portfolio/P4 - Ingegno/lib/plan.ts`
- Create: `Portfolio/P4 - Ingegno/lib/plan.test.ts`
- Create: `Portfolio/P4 - Ingegno/vitest.config.ts`

- [ ] **Step 1: Replace `tailwind.config.ts` with the project design system config**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
}

export default config
```

- [ ] **Step 2: Update `app/layout.tsx` to load Google Fonts via `next/font/google` and expose CSS variables**

```typescript
import type { Metadata } from 'next'
import { Instrument_Serif, Barlow } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  variable: '--font-heading',
})

const barlow = Barlow({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Ingegno',
  description: 'Premium public profiles for modern polymaths.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${barlow.variable} font-body`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Update `app/globals.css` — keep Tailwind directives, add base styles and liquid-glass classes**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: #000;
  color: #fff;
}

.liquid-glass {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%,
    rgba(255,255,255,0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass-strong {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border: none;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
}

.liquid-glass-strong::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.5) 0%,
    rgba(255,255,255,0.2) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.2) 80%,
    rgba(255,255,255,0.5) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

@keyframes rotate3d {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

- [ ] **Step 4: Create `lib/types.ts`**

```typescript
export interface Profile {
  id: string
  username: string
  full_name: string | null
  tagline: string | null
  roles: string[]
  narrative: string | null
  avatar_url: string | null
  is_public: boolean
  plan: 'free' | 'pro'
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  status: 'in_progress' | 'launched'
  url: string | null
  display_order: number
  created_at: string
}

export interface Update {
  id: string
  user_id: string
  project_id: string | null
  content: string
  image_url: string | null
  created_at: string
}

export interface GithubActivity {
  id: string
  user_id: string
  repo_name: string
  commit_message: string
  commit_sha: string
  committed_at: string
}

export interface ActivityItem {
  id: string
  type: 'github_commit' | 'manual_update'
  content: string
  repo_name?: string
  image_url?: string
  created_at: string
}
```

- [ ] **Step 5: Create `lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}
```

- [ ] **Step 6: Create `lib/plan.ts`**

```typescript
import type { Project } from './types'

export function canAddProject(_plan: 'free' | 'pro', _projectCount: number): boolean {
  return true // No limit on adding — gate is on visibility, not creation
}

export function getVisibleProjects(projects: Project[], plan: 'free' | 'pro'): Project[] {
  return plan === 'pro' ? projects : projects.slice(0, 2)
}

export function getLockedProjects(projects: Project[], plan: 'free' | 'pro'): Project[] {
  return plan === 'free' ? projects.slice(2) : []
}
```

- [ ] **Step 7: Create `lib/plan.test.ts`**

```typescript
import { describe, it, expect } from 'vitest'
import { canAddProject, getVisibleProjects, getLockedProjects } from './plan'
import type { Project } from './types'

const makeProject = (i: number): Project => ({
  id: `p${i}`,
  user_id: 'u1',
  name: `Project ${i}`,
  description: null,
  status: 'in_progress',
  url: null,
  display_order: i,
  created_at: new Date().toISOString(),
})

describe('canAddProject', () => {
  it('always returns true regardless of plan or count', () => {
    expect(canAddProject('free', 0)).toBe(true)
    expect(canAddProject('free', 10)).toBe(true)
    expect(canAddProject('pro', 100)).toBe(true)
  })
})

describe('getVisibleProjects', () => {
  const projects = [makeProject(1), makeProject(2), makeProject(3)]

  it('returns first 2 for free plan', () => {
    expect(getVisibleProjects(projects, 'free')).toHaveLength(2)
    expect(getVisibleProjects(projects, 'free')[0].id).toBe('p1')
  })

  it('returns all for pro plan', () => {
    expect(getVisibleProjects(projects, 'pro')).toHaveLength(3)
  })
})

describe('getLockedProjects', () => {
  const projects = [makeProject(1), makeProject(2), makeProject(3)]

  it('returns projects beyond 2 for free plan', () => {
    expect(getLockedProjects(projects, 'free')).toHaveLength(1)
    expect(getLockedProjects(projects, 'free')[0].id).toBe('p3')
  })

  it('returns empty array for pro plan', () => {
    expect(getLockedProjects(projects, 'pro')).toHaveLength(0)
  })
})
```

- [ ] **Step 8: Create `vitest.config.ts`**

> ⚠️ Vitest does not read config from `package.json` under a `"vitest"` key. Config must live in `vitest.config.ts`.

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 9: Add `"test": "vitest run"` to `package.json` scripts**

Open `package.json` and add to the `"scripts"` section only:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run"
}
```

- [ ] **Step 10: Run tests and verify all 6 pass**

```bash
npm run test
```

Expected output:
```
✓ lib/plan.test.ts (6)
  ✓ canAddProject (1)
  ✓ getVisibleProjects (2)
  ✓ getLockedProjects (2)

Test Files  1 passed (1)
Tests       6 passed (6)
```

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: design system, shared types, freemium plan logic, and tests"
```

---

### Task 3: Supabase Schema + RLS

**Files:**
- Create: `Portfolio/P4 - Ingegno/supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create `supabase/migrations/001_initial_schema.sql`**

```sql
-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  full_name text,
  tagline text,
  roles text[],
  narrative text,
  avatar_url text,
  is_public boolean DEFAULT false,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'launched')),
  url text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE github_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  github_username text NOT NULL,
  access_token text NOT NULL,
  repos_to_show text[] DEFAULT '{}',
  last_synced_at timestamptz
);

CREATE TABLE github_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  repo_name text NOT NULL,
  commit_message text NOT NULL,
  commit_sha text NOT NULL UNIQUE,
  committed_at timestamptz NOT NULL
);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_activity ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE
  USING (auth.uid() = id);

-- projects
CREATE POLICY "projects_select" ON projects FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = projects.user_id
    AND (is_public = true OR auth.uid() = id)
  ));
CREATE POLICY "projects_all_owner" ON projects FOR ALL
  USING (auth.uid() = user_id);

-- updates
CREATE POLICY "updates_select" ON updates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = updates.user_id
    AND (is_public = true OR auth.uid() = id)
  ));
CREATE POLICY "updates_all_owner" ON updates FOR ALL
  USING (auth.uid() = user_id);

-- github_connections (owner only — never public)
CREATE POLICY "github_connections_owner" ON github_connections FOR ALL
  USING (auth.uid() = user_id);

-- github_activity
CREATE POLICY "github_activity_select" ON github_activity FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = github_activity.user_id
    AND (is_public = true OR auth.uid() = id)
  ));
CREATE POLICY "github_activity_owner" ON github_activity FOR ALL
  USING (auth.uid() = user_id);

-- ── Storage Policies ──────────────────────────────────────────────────────────
-- Run these AFTER creating the buckets manually in the Supabase dashboard.

-- avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- update-images bucket
CREATE POLICY "Update images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'update-images');
CREATE POLICY "Users can upload update images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'update-images' AND auth.uid() IS NOT NULL);
```

- [ ] **Step 2: Apply schema in Supabase dashboard**

Manual step — go to [supabase.com](https://supabase.com) → your project → SQL Editor → paste the full contents of `supabase/migrations/001_initial_schema.sql` → click Run.

Verify: all 5 tables appear under Table Editor. Verify RLS is enabled (lock icon visible on each table).

- [ ] **Step 3: Create Storage buckets in Supabase dashboard**

Manual step:
1. Go to Storage → New bucket → name: `avatars` → toggle Public on → Create
2. Go to Storage → New bucket → name: `update-images` → toggle Public on → Create

- [ ] **Step 4: Apply Storage RLS policies**

Manual step — go to SQL Editor → run the Storage Policies block from the migration file (the two `CREATE POLICY` groups at the bottom). These only work after the buckets exist.

Verify: Storage → Policies → `avatars` shows 3 policies; `update-images` shows 2 policies.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: supabase schema, RLS policies, and storage bucket policies"
```

---

### Task 4: Supabase Client Layer + Next.js Middleware

**Files:**
- Create: `Portfolio/P4 - Ingegno/lib/supabase/client.ts`
- Create: `Portfolio/P4 - Ingegno/lib/supabase/server.ts`
- Create: `Portfolio/P4 - Ingegno/middleware.ts`

- [ ] **Step 1: Create `lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create `lib/supabase/server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 3: Create `middleware.ts` at project root**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
```

- [ ] **Step 4: Copy `.env.local.example` to `.env.local` and fill in real values**

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase dashboard → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from same page
- `SUPABASE_SERVICE_ROLE_KEY` — from same page (keep secret)
- Leave GitHub vars blank for now — needed in Task 10

- [ ] **Step 5: Start dev server and verify no errors**

```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
✓ Ready in Xs
```

Visit `http://localhost:3000` — page should load (no console errors). Visit `http://localhost:3000/dashboard` — should redirect to `/login` (middleware working).

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: supabase client layer and auth middleware with route protection"
```

---

### Task 5: Auth Flow

**Files:**
- Create: `Portfolio/P4 - Ingegno/app/actions/auth.ts`
- Create: `Portfolio/P4 - Ingegno/app/(auth)/signup/page.tsx`
- Create: `Portfolio/P4 - Ingegno/app/(auth)/login/page.tsx`
- Create: `Portfolio/P4 - Ingegno/app/auth/callback/route.ts`

- [ ] **Step 1: Create `app/actions/auth.ts` with signUp, signIn, and signOut Server Actions**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = (formData.get('username') as string).toLowerCase().trim()

  if (!/^[a-z0-9-]{3,20}$/.test(username)) {
    return { error: 'Username: 3–20 characters, letters, numbers, hyphens only' }
  }
  const reserved = ['admin', 'api', 'dashboard', 'login', 'signup', 'settings']
  if (reserved.includes(username)) {
    return { error: 'That username is reserved' }
  }

  const supabase = createClient()

  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()
  if (existing) return { error: 'Username already taken' }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }
  if (!data.user) return { error: 'Signup failed — please try again' }

  await supabase.from('profiles').insert({ id: data.user.id, username })

  redirect('/dashboard/profile')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}
```

- [ ] **Step 2: Create `app/(auth)/signup/page.tsx`**

```tsx
'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

const initialState = { error: undefined as string | undefined }

export default function SignupPage() {
  const [state, formAction] = useFormState(signUp, initialState)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <span className="font-heading italic text-white text-3xl">Ingegno</span>
        </div>

        <div className="liquid-glass-strong rounded-2xl p-8">
          <h1 className="font-heading italic text-white text-2xl mb-2">
            Create your profile.
          </h1>
          <p className="font-body text-white/40 text-sm mb-8">
            Your place on the internet.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs text-white/40 uppercase tracking-wider">
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="your-handle"
                autoComplete="username"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs text-white/40 uppercase tracking-wider">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs text-white/40 uppercase tracking-wider">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {state?.error && (
              <p className="font-body text-sm text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-xl px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-2 bg-white text-black font-body text-sm font-medium rounded-full py-3 hover:bg-white/90 transition-colors"
            >
              Create profile
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-white/30 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-white/60 hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/(auth)/login/page.tsx`**

```tsx
'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'

const initialState = { error: undefined as string | undefined }

export default function LoginPage() {
  const [state, formAction] = useFormState(signIn, initialState)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <span className="font-heading italic text-white text-3xl">Ingegno</span>
        </div>

        <div className="liquid-glass-strong rounded-2xl p-8">
          <h1 className="font-heading italic text-white text-2xl mb-2">
            Sign in.
          </h1>
          <p className="font-body text-white/40 text-sm mb-8">
            Welcome back.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs text-white/40 uppercase tracking-wider">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs text-white/40 uppercase tracking-wider">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {state?.error && (
              <p className="font-body text-sm text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-xl px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-2 bg-white text-black font-body text-sm font-medium rounded-full py-3 hover:bg-white/90 transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-white/30 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-white/60 hover:text-white transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `app/auth/callback/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
```

- [ ] **Step 5: Manual verification**

Run:
```bash
npm run dev
```

Then verify:
1. Navigate to `http://localhost:3000/signup`
2. Fill in username, email, and password — submit the form
3. Confirm redirect to `/dashboard/profile`
4. Open Supabase dashboard → Authentication → Users → confirm new user row
5. Open Table Editor → `profiles` → confirm new row with correct `id` and `username`
6. Navigate to `http://localhost:3000/login`, sign in with the same credentials
7. Confirm redirect to `/dashboard`
8. Verify that navigating directly to `http://localhost:3000/dashboard` while unauthenticated (open incognito) redirects to `/login`

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: auth flow with email/password signup and login"
```

---

### Task 6: Dashboard Shell

**Files:**
- Create: `Portfolio/P4 - Ingegno/app/dashboard/layout.tsx`
- Create: `Portfolio/P4 - Ingegno/app/dashboard/page.tsx`
- Create: `Portfolio/P4 - Ingegno/components/dashboard/DashboardNav.tsx`

- [ ] **Step 1: Create `app/dashboard/layout.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url, is_public')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-black text-white flex">
      <DashboardNav
        username={profile?.username ?? ''}
        isPublic={profile?.is_public ?? false}
      />
      <main className="flex-1 ml-64 p-8 min-h-screen">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/dashboard/DashboardNav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/actions/auth'

interface DashboardNavProps {
  username: string
  isPublic: boolean
}

const links = [
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/updates', label: 'Updates' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function DashboardNav({ username, isPublic }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r border-white/[0.08] flex flex-col p-6 bg-black z-40">
      {/* Logomark */}
      <div className="mb-10">
        <Link href="/dashboard">
          <span className="font-heading italic text-white text-2xl">Ingegno</span>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'px-4 py-2.5 rounded-full text-sm font-body transition-colors',
              pathname === link.href
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Bottom: view profile + sign out */}
      <div className="flex flex-col gap-2 mt-6">
        {username && (
          <Link
            href={`/${username}`}
            target="_blank"
            className="px-4 py-2 text-xs font-body text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            View profile →
          </Link>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-body text-white/30 hover:text-white/60 transition-colors w-full text-left"
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Create `app/dashboard/page.tsx`**

```tsx
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  redirect('/dashboard/profile')
}
```

- [ ] **Step 4: Manual verification**

Run:
```bash
npm run dev
```

Then verify:
1. Log in and confirm `/dashboard` immediately redirects to `/dashboard/profile`
2. Sidebar renders on the left — "Ingegno" logomark visible at top
3. Active link ("Profile") shows `bg-white/10` highlight; others render as dimmed
4. Click "Projects", "Updates", "Settings" — active link highlight follows correctly (pages will be empty/404 at this stage — expected)
5. Click "View profile →" — opens `/{username}` in a new tab
6. Click "Sign out" — redirects to `/` and clears session; navigating to `/dashboard` again redirects to `/login`

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: dashboard shell with sidebar nav and layout"
```

---

### Task 7: Profile Editor

**Files:**
- Create: `Portfolio/P4 - Ingegno/app/actions/profile.ts`
- Create: `Portfolio/P4 - Ingegno/app/dashboard/profile/page.tsx`
- Create: `Portfolio/P4 - Ingegno/components/dashboard/ProfileForm.tsx`

- [ ] **Step 1: Create `app/actions/profile.ts` with updateProfile, updatePublicStatus, and uploadAvatar**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const rolesRaw = formData.get('roles') as string
  const roles = rolesRaw
    ? rolesRaw
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
    : []

  const updates = {
    full_name: (formData.get('full_name') as string) || null,
    tagline: (formData.get('tagline') as string) || null,
    roles,
    narrative: (formData.get('narrative') as string) || null,
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function updatePublicStatus(isPublic: boolean) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({ is_public: isPublic })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return { error: 'No file provided' }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }
  revalidatePath('/dashboard/profile')
  return { success: true, url: publicUrl }
}
```

- [ ] **Step 2: Create `app/dashboard/profile/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function ProfilePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading italic text-white text-3xl">Profile</h1>
        <span
          className={`text-xs font-body px-3 py-1 rounded-full ${
            profile?.is_public
              ? 'bg-white/10 text-white/70'
              : 'bg-white/5 text-white/30'
          }`}
        >
          {profile?.is_public ? '● Live' : '○ Draft'}
        </span>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}
```

- [ ] **Step 3: Create `components/dashboard/ProfileForm.tsx`**

```tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useTransition, useState, useRef } from 'react'
import Image from 'next/image'
import { updateProfile, updatePublicStatus, uploadAvatar } from '@/app/actions/profile'
import { cn } from '@/lib/utils'

interface Profile {
  id: string
  username: string
  full_name: string | null
  tagline: string | null
  roles: string[] | null
  narrative: string | null
  avatar_url: string | null
  is_public: boolean
  plan: string
}

interface ProfileFormProps {
  profile: Profile | null
}

const initialState = { error: undefined as string | undefined, success: undefined as boolean | undefined }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-white text-black font-body text-sm font-medium rounded-full px-6 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  )
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfile, initialState)
  const [isPending, startTransition] = useTransition()

  const [roles, setRoles] = useState<string[]>(profile?.roles ?? [])
  const [roleInput, setRoleInput] = useState('')
  const [narrative, setNarrative] = useState(profile?.narrative ?? '')
  const wordCount = narrative.trim().split(/\s+/).filter(Boolean).length
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? false)
  const [toggleError, setToggleError] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarPending, setAvatarPending] = useState(false)

  function addRole(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = roleInput.trim()
      if (trimmed && !roles.includes(trimmed)) {
        setRoles([...roles, trimmed])
      }
      setRoleInput('')
    }
  }

  function removeRole(role: string) {
    setRoles(roles.filter((r) => r !== role))
  }

  function handleToggle() {
    const next = !isPublic
    setIsPublic(next)
    setToggleError(null)
    startTransition(async () => {
      const result = await updatePublicStatus(next)
      if (result?.error) {
        setIsPublic(!next)
        setToggleError(result.error)
      }
    })
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError(null)
    setAvatarPending(true)
    const fd = new FormData()
    fd.append('avatar', file)
    const result = await uploadAvatar(fd)
    setAvatarPending(false)
    if (result?.error) {
      setAvatarError(result.error)
    } else if (result?.url) {
      setAvatarUrl(result.url)
    }
  }

  const initials = (profile?.full_name ?? profile?.username ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col gap-8">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
          ) : (
            <span className="font-heading italic text-white text-xl">{initials}</span>
          )}
          {avatarPending && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-body">…</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="font-body text-sm text-white/60 hover:text-white transition-colors"
          >
            Upload photo
          </button>
          <p className="font-body text-xs text-white/25">JPG, PNG or WebP. Max 2 MB.</p>
          {avatarError && (
            <p className="font-body text-xs text-red-400/80">{avatarError}</p>
          )}
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Main form */}
      <form action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="roles" value={roles.join(',')} />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs text-white/40 uppercase tracking-wider">
              Full name
            </label>
            <input
              name="full_name"
              type="text"
              defaultValue={profile?.full_name ?? ''}
              placeholder="Ada Lovelace"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs text-white/40 uppercase tracking-wider">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={profile?.username ?? ''}
              readOnly
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white/30 font-body text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-body text-xs text-white/40 uppercase tracking-wider">
            Tagline
          </label>
          <input
            name="tagline"
            type="text"
            defaultValue={profile?.tagline ?? ''}
            placeholder="Founder · Designer · Writer"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Roles tag input */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-xs text-white/40 uppercase tracking-wider">
            Roles
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {roles.map((role) => (
              <span
                key={role}
                className="liquid-glass rounded-full px-3 py-1 text-sm font-body text-white/70 flex items-center gap-1.5"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="text-white/30 hover:text-white/70 transition-colors leading-none"
                  aria-label={`Remove ${role}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={addRole}
            placeholder="Type a role and press Enter"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Narrative */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-body text-xs text-white/40 uppercase tracking-wider">
              Narrative
            </label>
            <span
              className={cn(
                'font-body text-xs transition-colors',
                wordCount > 250 ? 'text-red-400/80' : 'text-white/25'
              )}
            >
              {wordCount}/250 words
            </span>
          </div>
          <textarea
            name="narrative"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Tell the world who you are and what you're building…"
            rows={7}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
          />
        </div>

        {state?.error && (
          <p className="font-body text-sm text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="font-body text-sm text-white/50 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            Profile saved.
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <SubmitButton />

          {/* Make public toggle */}
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-white/40">Make public</span>
            <button
              type="button"
              onClick={handleToggle}
              disabled={isPending}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors focus:outline-none disabled:opacity-50',
                isPublic ? 'bg-white/30' : 'bg-white/10'
              )}
              aria-pressed={isPublic}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>
        {toggleError && (
          <p className="font-body text-xs text-red-400/80 text-right">{toggleError}</p>
        )}
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Manual verification**

Run:
```bash
npm run dev
```

Then verify:
1. Log in and navigate to `http://localhost:3000/dashboard/profile`
2. Fill in all fields: full name, tagline, add 3 role tags, write a short narrative
3. Click "Save changes" — confirm success message appears
4. Open Supabase Table Editor → `profiles` → confirm all columns updated correctly
5. Toggle "Make public" to ON — confirm `is_public` flips to `true` in Supabase without a page reload
6. Toggle "Make public" back to OFF — confirm `is_public` returns to `false`
7. Click "Upload photo", select an image file — confirm the avatar circle updates
8. Open Supabase Storage → `avatars` bucket → confirm file at path `{user_id}/avatar.{ext}` exists
9. Confirm `avatar_url` column in `profiles` table contains the public URL
10. Confirm the word counter increments correctly as you type in the narrative field

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: profile editor with avatar upload, roles, narrative, and public toggle"
```

---

### Task 8: Projects Manager

**Files:**
- Create: `Portfolio/P4 - Ingegno/app/actions/projects.ts`
- Create: `Portfolio/P4 - Ingegno/app/dashboard/projects/page.tsx`
- Create: `Portfolio/P4 - Ingegno/components/dashboard/ProjectForm.tsx`
- Create: `Portfolio/P4 - Ingegno/components/dashboard/ProjectsClient.tsx`

- [ ] **Step 1: Create `app/actions/projects.ts` with all Server Actions**

```typescript
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('projects')
    .select('display_order')
    .eq('user_id', user.id)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = existing?.[0]?.display_order != null ? existing[0].display_order + 1 : 0

  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    status: (formData.get('status') as string) || 'in_progress',
    url: (formData.get('url') as string) || null,
    display_order: nextOrder,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('projects')
    .update({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      status: formData.get('status') as string,
      url: (formData.get('url') as string) || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  await supabase.from('projects').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard/projects')
}

export async function moveProjectUp(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: projects } = await supabase
    .from('projects')
    .select('id, display_order')
    .eq('user_id', user.id)
    .order('display_order')

  if (!projects) return
  const idx = projects.findIndex((p) => p.id === id)
  if (idx <= 0) return

  const current = projects[idx]
  const above = projects[idx - 1]

  await supabase.from('projects').update({ display_order: above.display_order }).eq('id', current.id)
  await supabase.from('projects').update({ display_order: current.display_order }).eq('id', above.id)
  revalidatePath('/dashboard/projects')
}

export async function moveProjectDown(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: projects } = await supabase
    .from('projects')
    .select('id, display_order')
    .eq('user_id', user.id)
    .order('display_order')

  if (!projects) return
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1 || idx >= projects.length - 1) return

  const current = projects[idx]
  const below = projects[idx + 1]

  await supabase.from('projects').update({ display_order: below.display_order }).eq('id', current.id)
  await supabase.from('projects').update({ display_order: current.display_order }).eq('id', below.id)
  revalidatePath('/dashboard/projects')
}
```

- [ ] **Step 2: Create `components/dashboard/ProjectForm.tsx`**

```typescript
'use client'
import { useTransition, useState } from 'react'
import { createProject, updateProject } from '@/app/actions/projects'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  url: string | null
}

interface ProjectFormProps {
  project?: Project
  onClose?: () => void
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, formData)
        : await createProject(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        onClose?.()
      }
    })
  }

  const inputClass =
    'w-full bg-white/[0.06] border border-white/[0.1] rounded-[0.75rem] px-4 py-2.5 text-sm font-body text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors'

  return (
    <form action={handleSubmit} className="liquid-glass rounded-[1.25rem] p-6 space-y-4">
      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          Name *
        </label>
        <input
          name="name"
          required
          defaultValue={project?.name}
          placeholder="Project name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={project?.description ?? ''}
          placeholder="What is this project about?"
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          Status
        </label>
        <select
          name="status"
          defaultValue={project?.status ?? 'in_progress'}
          className={inputClass}
        >
          <option value="in_progress">In Progress</option>
          <option value="launched">Launched</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          URL
        </label>
        <input
          name="url"
          type="url"
          defaultValue={project?.url ?? ''}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-sm font-body text-red-400">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-white/10 hover:bg-white/15 border border-white/[0.12] rounded-[0.75rem] px-4 py-2.5 text-sm font-body text-white transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : project ? 'Save changes' : 'Add project'}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-body text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Create `components/dashboard/ProjectsClient.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { deleteProject, moveProjectUp, moveProjectDown } from '@/app/actions/projects'
import ProjectForm from './ProjectForm'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  url: string | null
  display_order: number
}

interface ProjectsClientProps {
  projects: Project[]
  lockedIds: string[]
}

export default function ProjectsClient({ projects, lockedIds }: ProjectsClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const lockedSet = new Set(lockedIds)

  return (
    <div className="space-y-4">
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="liquid-glass rounded-[1rem] px-5 py-2.5 text-sm font-body text-white/70 hover:text-white border border-white/[0.1] hover:border-white/20 transition-colors"
        >
          + Add project
        </button>
      )}

      {showAddForm && (
        <ProjectForm onClose={() => setShowAddForm(false)} />
      )}

      {projects.length === 0 && !showAddForm && (
        <p className="text-sm font-body text-white/40">
          No projects yet. Add your first project to showcase your work.
        </p>
      )}

      <div className="space-y-3">
        {projects.map((project, idx) => {
          const isLocked = lockedSet.has(project.id)

          if (editingId === project.id) {
            return (
              <ProjectForm
                key={project.id}
                project={project}
                onClose={() => setEditingId(null)}
              />
            )
          }

          return (
            <div
              key={project.id}
              className={cn(
                'liquid-glass rounded-[1.25rem] p-6 space-y-3 transition-opacity',
                isLocked && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-heading italic text-white text-lg leading-tight">
                      {project.name}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-body px-2.5 py-0.5 rounded-full border',
                        project.status === 'launched'
                          ? 'border-emerald-400/30 text-emerald-400/70'
                          : 'border-amber-400/30 text-amber-400/70'
                      )}
                    >
                      {project.status === 'launched' ? 'Launched' : 'In Progress'}
                    </span>
                    {isLocked && (
                      <span className="text-xs font-body text-white/30 border border-white/10 px-2.5 py-0.5 rounded-full">
                        Not visible (free plan)
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm font-body text-white/50 mt-1.5 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-body text-white/30 hover:text-white/60 transition-colors mt-1 inline-block truncate max-w-xs"
                    >
                      {project.url}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <form action={moveProjectUp.bind(null, project.id)}>
                    <button
                      type="submit"
                      disabled={idx === 0}
                      className="p-2 text-white/30 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveProjectDown.bind(null, project.id)}>
                    <button
                      type="submit"
                      disabled={idx === projects.length - 1}
                      className="p-2 text-white/30 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </form>
                  <button
                    onClick={() => setEditingId(project.id)}
                    className="p-2 text-white/30 hover:text-white/70 transition-colors text-sm font-body"
                  >
                    Edit
                  </button>
                  <form action={deleteProject.bind(null, project.id)}>
                    <button
                      type="submit"
                      className="p-2 text-white/20 hover:text-red-400/70 transition-colors text-sm font-body"
                      onClick={(e) => {
                        if (!confirm(`Delete "${project.name}"?`)) e.preventDefault()
                      }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `app/dashboard/projects/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLockedProjects } from '@/lib/plan'
import ProjectsClient from '@/components/dashboard/ProjectsClient'

export default async function ProjectsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'
  const allProjects = projects ?? []
  const lockedProjects = getLockedProjects(allProjects, plan)
  const lockedIds = lockedProjects.map((p: { id: string }) => p.id)
  const showBanner = plan === 'free' && allProjects.length > 2

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading italic text-white text-3xl">Projects</h1>
      </div>

      {showBanner && (
        <div className="liquid-glass rounded-[1rem] p-4 text-sm font-body text-white/60">
          You have {allProjects.length} projects. Only the first 2 are visible on your public profile.{' '}
          <span className="text-white/80 underline underline-offset-2 cursor-pointer">
            Upgrade to Pro
          </span>{' '}
          to show all.
        </div>
      )}

      <ProjectsClient
        projects={allProjects}
        lockedIds={lockedIds}
      />
    </div>
  )
}
```

- [ ] **Step 5: Manual verification**

Create 3 projects via the dashboard form. Verify:
- First 2 cards render at full opacity with no "Not visible" label
- 3rd card renders at `opacity-60` with "Not visible (free plan)" badge
- Free plan banner appears above the list
- Use the ↑/↓ buttons to reorder — verify the new order persists on page refresh and is reflected in Supabase `display_order` column
- Edit a project → verify changes save correctly
- Delete a project → verify it disappears from both the UI and Supabase

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: projects CRUD with reorder and freemium gate"
```

---

### Task 9: Updates Manager

**Files:**
- Create: `Portfolio/P4 - Ingegno/app/actions/updates.ts`
- Create: `Portfolio/P4 - Ingegno/app/dashboard/updates/page.tsx`
- Create: `Portfolio/P4 - Ingegno/components/dashboard/UpdateForm.tsx`

- [ ] **Step 1: Create `app/actions/updates.ts`**

```typescript
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createUpdate(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const imageFile = formData.get('image') as File | null
  let image_url: string | null = null

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('update-images')
      .upload(path, imageFile)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('update-images')
        .getPublicUrl(path)
      image_url = publicUrl
    }
  }

  const { error } = await supabase.from('updates').insert({
    user_id: user.id,
    project_id: (formData.get('project_id') as string) || null,
    content: formData.get('content') as string,
    image_url,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/updates')
  return { success: true }
}

export async function deleteUpdate(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('updates').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard/updates')
}
```

- [ ] **Step 2: Create `components/dashboard/UpdateForm.tsx`**

```typescript
'use client'
import { useTransition, useState, useRef } from 'react'
import { createUpdate } from '@/app/actions/updates'

interface Project {
  id: string
  name: string
}

interface UpdateFormProps {
  projects: Project[]
}

export default function UpdateForm({ projects }: UpdateFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createUpdate(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        formRef.current?.reset()
      }
    })
  }

  const inputClass =
    'w-full bg-white/[0.06] border border-white/[0.1] rounded-[0.75rem] px-4 py-2.5 text-sm font-body text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors'

  return (
    <form ref={formRef} action={handleSubmit} className="liquid-glass rounded-[1.25rem] p-6 space-y-4">
      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          Update *
        </label>
        <textarea
          name="content"
          required
          rows={3}
          placeholder="What are you building? Share a milestone, a lesson, a decision…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.length > 0 && (
          <div>
            <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
              Project (optional)
            </label>
            <select name="project_id" className={inputClass}>
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
            Image (optional)
          </label>
          <input
            name="image"
            type="file"
            accept="image/*"
            className="w-full text-sm font-body text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-[0.5rem] file:border-0 file:text-xs file:font-body file:bg-white/10 file:text-white/60 hover:file:bg-white/15 file:cursor-pointer cursor-pointer"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm font-body text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-white/10 hover:bg-white/15 border border-white/[0.12] rounded-[0.75rem] px-5 py-2.5 text-sm font-body text-white transition-colors disabled:opacity-50"
      >
        {isPending ? 'Posting…' : 'Post update'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Create `app/dashboard/updates/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { deleteUpdate } from '@/app/actions/updates'
import UpdateForm from '@/components/dashboard/UpdateForm'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function UpdatesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: updates }, { data: projects }] = await Promise.all([
    supabase
      .from('updates')
      .select('*, projects(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('projects')
      .select('id, name')
      .eq('user_id', user.id)
      .order('display_order'),
  ])

  return (
    <div className="space-y-8">
      <h1 className="font-heading italic text-white text-3xl">Updates</h1>

      <UpdateForm projects={projects ?? []} />

      {(!updates || updates.length === 0) ? (
        <p className="text-sm font-body text-white/40 text-center py-12">
          No updates yet. Post your first update to start building in public.
        </p>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="liquid-glass rounded-[1.25rem] p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  <p className="text-sm font-body text-white/80 leading-relaxed whitespace-pre-wrap">
                    {update.content}
                  </p>

                  {update.image_url && (
                    <img
                      src={update.image_url}
                      alt="Update image"
                      className="rounded-[0.75rem] max-h-64 object-cover w-full"
                    />
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    {update.projects?.name && (
                      <span className="text-xs font-body px-2.5 py-0.5 rounded-full border border-white/10 text-white/40">
                        {update.projects.name}
                      </span>
                    )}
                    <span className="text-xs font-body text-white/30">
                      {timeAgo(update.created_at)}
                    </span>
                  </div>
                </div>

                <form action={deleteUpdate.bind(null, update.id)}>
                  <button
                    type="submit"
                    className="p-2 text-white/20 hover:text-red-400/70 transition-colors text-sm font-body shrink-0"
                    onClick={(e) => {
                      if (!confirm('Delete this update?')) e.preventDefault()
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Manual verification**

Post a text-only update → verify it appears in the feed and in Supabase `updates` table with correct `user_id` and `created_at`.

Post an update with an image → verify:
- Image appears in Supabase Storage → `update-images` bucket under `{user_id}/` folder
- `image_url` is saved in the `updates` row
- Image renders in the update card in the dashboard

Post an update linked to a project → verify the project tag appears on the card.

Delete an update → verify it disappears from both the UI and Supabase.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: updates manager with image upload and project linking"
```

---

### Task 10: Settings + GitHub OAuth + Manual Sync

**Files:**
- Create: `Portfolio/P4 - Ingegno/app/actions/github.ts`
- Create: `Portfolio/P4 - Ingegno/app/api/github/callback/route.ts`
- Create: `Portfolio/P4 - Ingegno/app/api/github/sync/route.ts`
- Create: `Portfolio/P4 - Ingegno/components/dashboard/GitHubConnect.tsx`
- Create: `Portfolio/P4 - Ingegno/components/dashboard/RepoSelector.tsx`
- Create: `Portfolio/P4 - Ingegno/app/dashboard/settings/page.tsx`

- [ ] **Step 1: Create `app/actions/github.ts`**

```typescript
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateReposToShow(repos: string[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  await supabase
    .from('github_connections')
    .update({ repos_to_show: repos })
    .eq('user_id', user.id)
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function getUserRepos(): Promise<string[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data: connection } = await supabase
    .from('github_connections')
    .select('access_token, github_username')
    .eq('user_id', user.id)
    .single()
  if (!connection) return []
  const res = await fetch(
    `https://api.github.com/users/${connection.github_username}/repos?per_page=100&sort=pushed`,
    { headers: { Authorization: `Bearer ${connection.access_token}` } }
  )
  if (!res.ok) return []
  const repos: Array<{ name: string }> = await res.json()
  return repos.map((r) => r.name)
}

export async function disconnectGitHub() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('github_connections').delete().eq('user_id', user.id)
  await supabase.from('github_activity').delete().eq('user_id', user.id)
  revalidatePath('/dashboard/settings')
}
```

- [ ] **Step 2: Create `app/api/github/callback/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/settings?error=no_code', request.url))
  }

  // Exchange code for access token — GITHUB_CLIENT_SECRET stays server-side only
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  const tokenData = await tokenRes.json()
  const accessToken: string = tokenData.access_token

  if (!accessToken) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=token_exchange_failed', request.url)
    )
  }

  // Get GitHub username — access_token used only server-side
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const githubUser = await userRes.json()

  // Store in DB — upsert (one connection per user)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  await supabase.from('github_connections').upsert({
    user_id: user.id,
    github_username: githubUser.login,
    access_token: accessToken,
  })

  return NextResponse.redirect(new URL('/dashboard/settings?connected=true', request.url))
}
```

- [ ] **Step 3: Create `app/api/github/sync/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Query includes access_token — this entire handler is server-side only
  const { data: connection } = await supabase
    .from('github_connections')
    .select('access_token, github_username, repos_to_show')
    .eq('user_id', user.id)
    .single()

  if (!connection) {
    return NextResponse.json({ error: 'No GitHub connection' }, { status: 400 })
  }

  const repos: string[] = connection.repos_to_show || []
  if (repos.length === 0) return NextResponse.json({ synced: 0 })

  let totalSynced = 0

  for (const repo of repos) {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${connection.github_username}/${repo}/commits?per_page=20`,
      { headers: { Authorization: `Bearer ${connection.access_token}` } }
    )
    if (!commitsRes.ok) continue

    const commits: Array<{
      sha: string
      commit: { message: string; author: { date: string } }
    }> = await commitsRes.json()

    for (const commit of commits) {
      const { error } = await supabase.from('github_activity').upsert(
        {
          user_id: user.id,
          repo_name: repo,
          commit_message: commit.commit.message.split('\n')[0], // first line only
          commit_sha: commit.sha,
          committed_at: commit.commit.author.date,
        },
        { onConflict: 'commit_sha', ignoreDuplicates: true }
      )
      if (!error) totalSynced++
    }
  }

  await supabase
    .from('github_connections')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('user_id', user.id)

  return NextResponse.json({ synced: totalSynced })
}
```

- [ ] **Step 4: Create `components/dashboard/RepoSelector.tsx`**

```typescript
'use client'
import { useEffect, useState, useTransition } from 'react'
import { getUserRepos, updateReposToShow } from '@/app/actions/github'

interface RepoSelectorProps {
  selectedRepos: string[]
}

export default function RepoSelector({ selectedRepos }: RepoSelectorProps) {
  const [allRepos, setAllRepos] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedRepos))
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserRepos().then((repos) => {
      setAllRepos(repos)
      setLoading(false)
    })
  }, [])

  function toggle(repo: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(repo)) {
        next.delete(repo)
      } else {
        next.add(repo)
      }
      return next
    })
  }

  function save() {
    setStatus(null)
    startTransition(async () => {
      const result = await updateReposToShow(Array.from(selected))
      setStatus(result?.error ? result.error : 'Saved')
      setTimeout(() => setStatus(null), 2000)
    })
  }

  if (loading) {
    return <p className="text-sm font-body text-white/30">Loading repos…</p>
  }

  if (allRepos.length === 0) {
    return <p className="text-sm font-body text-white/30">No repositories found.</p>
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-body text-white/40 tracking-widest uppercase">
        Repos to show on your profile
      </p>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {allRepos.map((repo) => (
          <label key={repo} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.has(repo)}
              onChange={() => toggle(repo)}
              className="accent-white/60 w-4 h-4"
            />
            <span className="text-sm font-body text-white/60 group-hover:text-white/80 transition-colors">
              {repo}
            </span>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={save}
          disabled={isPending}
          className="text-sm font-body px-4 py-2 rounded-[0.75rem] bg-white/10 hover:bg-white/15 border border-white/[0.12] text-white transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Save selection'}
        </button>
        {status && (
          <span className="text-xs font-body text-white/40">{status}</span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/dashboard/GitHubConnect.tsx`**

```typescript
'use client'
import { useState, useTransition } from 'react'
import { disconnectGitHub } from '@/app/actions/github'
import RepoSelector from './RepoSelector'

interface GitHubConnection {
  github_username: string
  repos_to_show: string[]
  last_synced_at: string | null
}

interface GitHubConnectProps {
  connection: GitHubConnection | null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minutes ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hours ago`
  return `${Math.floor(hrs / 24)} days ago`
}

export default function GitHubConnect({ connection }: GitHubConnectProps) {
  const [isPendingDisconnect, startDisconnect] = useTransition()
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<string | null>(null)

  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  const callbackUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/github/callback`
      : ''

  function connectGitHub() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,repo&redirect_uri=${encodeURIComponent(callbackUrl)}`
  }

  async function syncNow() {
    setSyncing(true)
    setSyncResult(null)
    try {
      const res = await fetch('/api/github/sync', { method: 'POST' })
      const data = await res.json()
      setSyncResult(
        data.error ? `Error: ${data.error}` : `Synced ${data.synced} commits`
      )
    } catch {
      setSyncResult('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  if (!connection) {
    return (
      <div className="liquid-glass rounded-[1.25rem] p-7 space-y-4">
        <p className="text-sm font-body text-white/60">
          Connect your GitHub account to display recent commits on your public profile.
        </p>
        <button
          onClick={connectGitHub}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[0.75rem] bg-white/10 hover:bg-white/15 border border-white/[0.12] text-sm font-body text-white transition-colors"
        >
          Connect GitHub
        </button>
      </div>
    )
  }

  return (
    <div className="liquid-glass rounded-[1.25rem] p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-body text-white/80">
            @{connection.github_username}
          </p>
          {connection.last_synced_at && (
            <p className="text-xs font-body text-white/30">
              Last synced {timeAgo(connection.last_synced_at)}
            </p>
          )}
          {!connection.last_synced_at && (
            <p className="text-xs font-body text-white/30">Never synced</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={syncNow}
            disabled={syncing}
            className="px-4 py-2 text-sm font-body text-white/70 hover:text-white border border-white/[0.1] hover:border-white/20 rounded-[0.75rem] transition-colors disabled:opacity-50"
          >
            {syncing ? 'Syncing…' : 'Sync now'}
          </button>
          <form
            action={() => {
              if (!confirm('Disconnect GitHub? This will also delete your synced activity.')) return
              startDisconnect(async () => { await disconnectGitHub() })
            }}
          >
            <button
              type="submit"
              disabled={isPendingDisconnect}
              className="px-4 py-2 text-sm font-body text-white/30 hover:text-white/60 transition-colors disabled:opacity-50"
            >
              Disconnect
            </button>
          </form>
        </div>
      </div>

      {syncResult && (
        <p className="text-xs font-body text-white/40">{syncResult}</p>
      )}

      <div className="border-t border-white/[0.08] pt-6">
        <RepoSelector selectedRepos={connection.repos_to_show ?? []} />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `app/dashboard/settings/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GitHubConnect from '@/components/dashboard/GitHubConnect'
import { signOut } from '@/app/actions/auth'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Select only safe fields — NOT access_token
  const { data: connection } = await supabase
    .from('github_connections')
    .select('github_username, repos_to_show, last_synced_at')
    .eq('user_id', user.id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, username')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl space-y-12">
      <h1 className="font-heading italic text-white text-3xl">Settings</h1>

      {/* GitHub section */}
      <section>
        <h2 className="text-sm font-body text-white/40 tracking-widest uppercase mb-6">
          // GitHub
        </h2>
        <GitHubConnect connection={connection} />
      </section>

      {/* Account section */}
      <section>
        <h2 className="text-sm font-body text-white/40 tracking-widest uppercase mb-6">
          // Account
        </h2>
        <div className="liquid-glass rounded-[1.25rem] p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-white/60">Email</span>
            <span className="text-sm font-body text-white/40">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-white/60">Plan</span>
            <span className="text-xs font-body px-3 py-1 rounded-full liquid-glass text-white/60">
              {profile?.plan === 'pro' ? 'Pro' : 'Free'}
            </span>
          </div>
          <div className="border-t border-white/[0.08] pt-4">
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm font-body text-white/40 hover:text-white/70 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 7: Create GitHub OAuth App**

1. Go to https://github.com/settings/developers → OAuth Apps → New OAuth App
2. Fill in:
   - Application name: `Ingegno (dev)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/github/callback`
3. Click Register application → copy Client ID and generate a Client Secret
4. Add both to `.env.local`:
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID=<paste_client_id>
   GITHUB_CLIENT_ID=<paste_client_id>
   GITHUB_CLIENT_SECRET=<paste_client_secret>
   ```
5. For production: create a second OAuth App with callback URL `https://{vercel-url}.vercel.app/api/github/callback` and add the vars to Vercel environment variables

- [ ] **Step 8: Manual verification**

Run `npm run dev`. Go to `/dashboard/settings`:

1. Click "Connect GitHub" → browser redirects to GitHub authorization page → authorize → redirects back to `/dashboard/settings?connected=true`
2. Verify `github_connections` row exists in Supabase with correct `user_id`, `github_username`, and `access_token` (populated but never visible in client network requests)
3. Repo list loads in `RepoSelector` → select 2–3 repos → click "Save selection" → verify `repos_to_show` array updated in Supabase
4. Click "Sync now" → verify `github_activity` rows created in Supabase
5. Check browser DevTools → Network tab → confirm no request returns `access_token` in response body
6. Click "Disconnect" → confirm rows deleted → UI reverts to "Connect GitHub"

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: settings page with GitHub OAuth connect and manual sync"
```

---

### Task 11: UI Primitives

**Files:**
- Create: `Portfolio/P4 - Ingegno/components/ui/BlurText.tsx`
- Create: `Portfolio/P4 - Ingegno/components/ui/icons.tsx`

- [ ] **Step 1: Create `components/ui/BlurText.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
}

export default function BlurText({ text, className, delay = 0 }: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <p
      ref={ref}
      className={cn(className)}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: '0.1em' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={
            isVisible
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : { filter: 'blur(10px)', opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.7,
            ease: 'easeOut',
            delay: delay + (i * 100) / 1000,
          }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
```

- [ ] **Step 2: Create `components/ui/icons.tsx`**

```tsx
interface IconProps {
  className?: string
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 98 96"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  )
}

export function ActivityIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
```

- [ ] **Step 3: Manual verification**

- Temporarily import `BlurText` in `app/page.tsx` with a test string
- Run `npm run dev`
- Open `localhost:3000` — scroll down past 10% of the BlurText element and verify the word-by-word blur animation triggers
- Check browser console for no errors
- Remove the temporary test import before moving on

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add BlurText animation component and inline SVG icons"
```

---

### Task 12: Landing Page

**Files:**
- Create: `Portfolio/P4 - Ingegno/components/landing/Navbar.tsx`
- Create: `Portfolio/P4 - Ingegno/components/landing/Hero.tsx`
- Create: `Portfolio/P4 - Ingegno/components/landing/TheProblem.tsx`
- Create: `Portfolio/P4 - Ingegno/components/landing/Features.tsx`
- Create: `Portfolio/P4 - Ingegno/components/landing/TheName.tsx`
- Create: `Portfolio/P4 - Ingegno/components/landing/Pricing.tsx`
- Create: `Portfolio/P4 - Ingegno/components/landing/FinalCTA.tsx`
- Create: `Portfolio/P4 - Ingegno/components/landing/LandingFooter.tsx`
- Replace: `Portfolio/P4 - Ingegno/app/page.tsx`

- [ ] **Step 1: Create `components/landing/Navbar.tsx`**

```tsx
'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
      {/* Left: logomark */}
      <div className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="font-heading italic text-white text-xl leading-none">i</span>
      </div>

      {/* Center: nav links pill */}
      <div className="liquid-glass rounded-full px-6 py-3 hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          Home
        </Link>
        <Link href="#features" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          Features
        </Link>
        <Link href="#pricing" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          Pricing
        </Link>
        <Link href="#about" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          About
        </Link>
        <Link
          href="/signup"
          className="bg-white text-black text-sm font-body font-medium px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors flex items-center gap-1"
        >
          Get your profile
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" /><path d="M7 7h10v10" />
          </svg>
        </Link>
      </div>

      {/* Right: invisible spacer for centering */}
      <div className="w-12 h-12 flex-shrink-0 opacity-0 pointer-events-none" />
    </nav>
  )
}
```

- [ ] **Step 2: Create `components/landing/Hero.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const fadeUp = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-8 text-center">
      {/* Wireframe icosahedron background */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <svg
          width="700"
          height="700"
          viewBox="0 0 700 700"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          style={{ animation: 'rotate3d 60s linear infinite' }}
        >
          <polygon points="350,80 560,260 490,500 210,500 140,260" />
          <polygon points="350,80 560,260 620,420 350,620 80,420 140,260" />
          <line x1="350" y1="80" x2="350" y2="620" />
          <line x1="560" y1="260" x2="80" y2="420" />
          <line x1="140" y1="260" x2="620" y2="420" />
          <line x1="490" y1="500" x2="350" y2="80" />
          <line x1="210" y1="500" x2="350" y2="80" />
          <circle cx="350" cy="350" r="280" strokeDasharray="4 8" />
          <circle cx="350" cy="350" r="200" strokeDasharray="2 12" />
          <ellipse cx="350" cy="350" rx="280" ry="100" />
          <ellipse cx="350" cy="350" rx="100" ry="280" />
        </svg>
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(255,255,255,0.04) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto pt-32">
        {/* Beta badge */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="liquid-glass rounded-full px-5 py-2 flex items-center gap-3">
            <span className="text-xs font-body font-medium text-white/90 bg-white/10 px-2 py-0.5 rounded-full">
              Beta
            </span>
            <span className="text-sm font-body text-white/60">
              Now in early access — claim your username
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <BlurText
          text="Your life's work. One URL."
          delay={0.4}
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-3px] max-w-3xl text-center"
        />

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
          className="text-base md:text-lg text-white/60 font-body font-light max-w-lg leading-relaxed mt-5"
        >
          One elegant page that holds your projects, your writing, your skills, and your story — built for the people who can&apos;t be put in a box.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
          className="flex items-center gap-5 mt-2"
        >
          <Link
            href="/signup"
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-body font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Claim your username
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" /><path d="M7 7h10v10" />
            </svg>
          </Link>
          <Link
            href="/leonardo"
            className="text-sm font-body text-white/50 hover:text-white/80 transition-colors flex items-center gap-1.5"
          >
            See an example profile
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Preview card */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 1.1 }}
          className="liquid-glass rounded-[1.5rem] p-1 mt-6 w-full max-w-sm"
        >
          <div className="bg-white/[0.03] rounded-[1.25rem] p-6 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <span className="font-heading italic text-white text-2xl">L</span>
            </div>
            <span className="font-heading italic text-white text-2xl">Leonardo</span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Painter', 'Engineer', 'Anatomist'].map((role) => (
                <span
                  key={role}
                  className="liquid-glass rounded-full px-3 py-1 text-xs font-body text-white/70"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Partner strip */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 1.3 }}
          className="flex items-center gap-4 mt-4"
        >
          <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-3">
            <span className="text-xs font-body text-white/30">Profiles already live</span>
            <div className="flex gap-3">
              {['Marco', 'Sofia', 'Lena', 'Arjun', 'Mila'].map((name) => (
                <span key={name} className="text-xs font-heading italic text-white/50">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/landing/TheProblem.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const painPoints = [
  {
    title: 'Your portfolio looks like three people built it.',
    body: "A design site here. A GitHub there. A LinkedIn that doesn't match either. Clients can't connect the dots.",
  },
  {
    title: "Clients don't know how to refer you.",
    body: "You're great at what you do — but explaining what you do takes a 10-minute conversation every time.",
  },
  {
    title: 'The tools are wrong for you.',
    body: 'Behance is for designers. GitHub is for devs. Substack is for writers. None of them are built for all of the above.',
  },
]

export default function TheProblem() {
  return (
    <section className="py-32 px-8 md:px-20 bg-black">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest uppercase text-white/30 font-body mb-8"
      >
        // The problem
      </motion.p>

      <BlurText
        text='"So... what exactly do you do?"'
        className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-4xl"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-sm font-heading italic text-white/30 mt-5 mb-20"
      >
        — Every potential client, ever.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {painPoints.map((point, i) => (
          <motion.div
            key={i}
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.15 }}
            className="liquid-glass rounded-[1.25rem] p-7 min-h-[200px] flex flex-col justify-between"
          >
            <p className="font-heading italic text-white text-xl leading-snug">{point.title}</p>
            <p className="text-sm font-body text-white/40 leading-relaxed mt-4">{point.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/landing/Features.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const features = [
  {
    number: '01',
    title: 'Your identity, finally whole.',
    body: 'One page for everything you are. Projects, writing, skills, and a narrative that explains how it all connects — instead of hiding it.',
  },
  {
    number: '02',
    title: 'Show your work as it happens.',
    body: 'Sync your GitHub commits automatically. Post manual updates. Your profile is alive — not a static snapshot from 2022.',
  },
  {
    number: '03',
    title: 'A profile that matches your ambition.',
    body: 'Designed to be cinematic. Built to be fast. The tool finally looks as good as the work you put into it.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-32 px-8 md:px-20 bg-black">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest uppercase text-white/30 font-body mb-8"
      >
        // What Ingegno gives you
      </motion.p>

      <BlurText
        text="Built for people who can't be put in a box."
        className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-4xl mb-20"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.15 }}
            className="liquid-glass rounded-[1.25rem] p-7 min-h-[380px] flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-body text-white/20 mb-6">{feature.number}</p>
              <p className="font-heading italic text-white text-2xl leading-snug">{feature.title}</p>
            </div>
            <p className="text-sm font-body text-white/40 leading-relaxed">{feature.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `components/landing/TheName.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

export default function TheName() {
  return (
    <section id="about" className="py-32 px-8 md:px-20 bg-black relative overflow-hidden">
      {/* Decorative large "i" */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-heading italic text-white"
          style={{ fontSize: '22rem', opacity: 0.025, lineHeight: 1 }}
        >
          i
        </span>
      </div>

      <div className="relative z-10 max-w-2xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-white/30 font-body mb-8"
        >
          // The name
        </motion.p>

        <motion.p
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-heading italic text-white text-6xl mb-3"
        >
          ingegno
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm font-body text-white/30 mb-12"
        >
          /in·ˈjen·yo/ · Italian, Renaissance
        </motion.p>

        {[
          'Leonardo da Vinci used the word ingegno to describe a quality he considered the highest form of human intelligence: the creative capacity to connect disciplines that others kept separate.',
          'He was a painter, an engineer, an anatomist, a musician, and a cartographer — not in spite of each other, but because of each other. The connections between fields were the source of his genius.',
          'Ingegno is built for people with that same quality — modern Da Vincis who refuse to pick a lane, and who deserve a tool that celebrates that complexity instead of flattening it.',
        ].map((para, i) => (
          <motion.p
            key={i}
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 + i * 0.15 }}
            className="text-base font-body text-white/50 leading-relaxed mb-5"
          >
            {para}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `components/landing/Pricing.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const freeFeatures = [
  'Public profile at ingegno.app/username',
  'Up to 2 visible projects',
  'Manual activity updates',
  'Basic analytics',
  'Ingegno badge in footer',
]

const proFeatures = [
  'Everything in Free',
  'Unlimited projects',
  'GitHub commit sync',
  'Remove Ingegno badge',
  'Priority support',
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-8 md:px-20 bg-black">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest uppercase text-white/30 font-body mb-8"
      >
        // Pricing
      </motion.p>

      <BlurText
        text="Start free. Upgrade when you're ready."
        className="font-heading italic text-white text-5xl md:text-6xl leading-[0.9] max-w-3xl mb-16"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
        {/* Free card */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="liquid-glass rounded-[1.25rem] p-8 flex flex-col justify-between"
        >
          <div>
            <p className="text-sm font-body text-white/40 mb-2">Free</p>
            <p className="font-heading italic text-white text-5xl mb-1">€0</p>
            <p className="text-xs font-body text-white/30 mb-8">forever</p>
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-body text-white/60">
                  <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/signup"
            className="mt-8 text-center liquid-glass rounded-full px-6 py-3 text-sm font-body text-white hover:opacity-80 transition-opacity"
          >
            Get started free
          </Link>
        </motion.div>

        {/* Pro card */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="liquid-glass-strong rounded-[1.25rem] p-8 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-5 right-5">
            <span className="text-xs font-body text-white/60 bg-white/10 px-3 py-1 rounded-full">
              Most popular
            </span>
          </div>

          <div>
            <p className="text-sm font-body text-white/40 mb-2">Pro</p>
            <p className="font-heading italic text-white text-5xl mb-1">€9</p>
            <p className="text-xs font-body text-white/30 mb-8">/month · or €79/year</p>
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-body text-white/70">
                  <span className="w-1 h-1 rounded-full bg-white/50 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/signup"
            className="mt-8 text-center bg-white text-black rounded-full px-6 py-3 text-sm font-body font-medium hover:bg-white/90 transition-colors"
          >
            Get Pro →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Create `components/landing/FinalCTA.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

export default function FinalCTA() {
  return (
    <section className="py-40 px-8 text-center bg-black flex flex-col items-center">
      <BlurText
        text="One URL. Everything you are."
        className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-3xl mb-6"
      />

      <motion.p
        initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
        whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        className="text-base font-body text-white/50 mb-10"
      >
        Join the Da Vincis who&apos;ve already claimed their name.
      </motion.p>

      <motion.div
        initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
        whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
      >
        <Link
          href="/signup"
          className="liquid-glass-strong rounded-full px-8 py-4 text-sm font-body font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Claim your username
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" /><path d="M7 7h10v10" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 8: Create `components/landing/LandingFooter.tsx`**

```tsx
export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] py-8 px-8 md:px-20 flex items-center justify-between bg-black">
      <span className="font-heading italic text-white/40 text-sm">Ingegno</span>
      <span className="text-xs font-body text-white/20">© 2026 Ingegno</span>
    </footer>
  )
}
```

- [ ] **Step 9: Replace `app/page.tsx`**

```tsx
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import TheProblem from '@/components/landing/TheProblem'
import Features from '@/components/landing/Features'
import TheName from '@/components/landing/TheName'
import Pricing from '@/components/landing/Pricing'
import FinalCTA from '@/components/landing/FinalCTA'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <TheProblem />
      <Features />
      <TheName />
      <Pricing />
      <FinalCTA />
      <LandingFooter />
    </main>
  )
}
```

- [ ] **Step 10: Manual verification**

- Run `npm run dev`
- Visit `localhost:3000` — verify all 8 sections render: Navbar → Hero → TheProblem → Features → TheName → Pricing → FinalCTA → Footer
- Scroll down slowly — verify BlurText animations trigger in each section
- Verify Navbar is fixed at top and stays visible while scrolling
- Verify Pricing shows "€9" (not "$12" or "$9")
- Resize to 375px width — verify no horizontal overflow
- Check browser console for no errors

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: landing page components from design spec"
```

---

### Task 13: Public Profile Page

**Files:**
- Create: `Portfolio/P4 - Ingegno/components/profile/ProfileNavbar.tsx`
- Create: `Portfolio/P4 - Ingegno/components/profile/ProfileHero.tsx`
- Create: `Portfolio/P4 - Ingegno/components/profile/ProfileNarrative.tsx`
- Create: `Portfolio/P4 - Ingegno/components/profile/ProjectGrid.tsx`
- Create: `Portfolio/P4 - Ingegno/components/profile/ActivityFeed.tsx`
- Create: `Portfolio/P4 - Ingegno/components/profile/ProfileFooter.tsx`
- Create: `Portfolio/P4 - Ingegno/app/[username]/page.tsx`
- Create: `Portfolio/P4 - Ingegno/app/[username]/not-found.tsx`

- [ ] **Step 1: Create `components/profile/ProfileNavbar.tsx`**

```tsx
import Link from 'next/link'

export default function ProfileNavbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
      <Link href="/" className="font-heading italic text-white/30 text-sm hover:text-white/60 transition-colors">
        Ingegno
      </Link>
      <Link
        href="/signup"
        className="liquid-glass rounded-full px-5 py-2.5 text-sm font-body text-white/70 hover:text-white transition-colors flex items-center gap-2"
      >
        Get your profile
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
        </svg>
      </Link>
    </nav>
  )
}
```

- [ ] **Step 2: Create `components/profile/ProfileHero.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

interface ProfileHeroProps {
  profile: {
    full_name: string
    tagline: string | null
    roles: string[]
    avatar_url: string | null
  }
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-8 text-center">
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Avatar */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="liquid-glass rounded-full p-1 w-32 h-32"
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
              <span className="font-heading italic text-white text-3xl">{initials}</span>
            </div>
          )}
        </motion.div>

        {/* Name */}
        <BlurText
          text={profile.full_name}
          delay={0.2}
          className="font-heading italic text-white text-6xl md:text-7xl lg:text-[5rem] tracking-[-3px]"
        />

        {/* Tagline */}
        {profile.tagline && (
          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
            className="text-lg text-white/50 font-body font-light mt-4 max-w-lg"
          >
            {profile.tagline}
          </motion.p>
        )}

        {/* Roles */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.65 }}
          className="flex flex-wrap justify-center gap-2 mt-2"
        >
          {profile.roles.map((role) => (
            <span
              key={role}
              className="liquid-glass rounded-full px-4 py-1.5 text-sm font-body text-white/70"
            >
              {role}
            </span>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ animation: 'bounce 2s infinite' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/15"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/profile/ProfileNarrative.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'

interface ProfileNarrativeProps {
  narrative: string | null
}

export default function ProfileNarrative({ narrative }: ProfileNarrativeProps) {
  if (!narrative) return null

  return (
    <section className="py-32 px-8 md:px-20 bg-black">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-white/30 font-body mb-10"
        >
          // About
        </motion.p>

        <motion.p
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="font-heading italic text-white text-2xl md:text-3xl leading-[1.45]"
        >
          {narrative}
        </motion.p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/profile/ProjectGrid.tsx`**

> ⚠️ Imports `getVisibleProjects` and `getLockedProjects` from `@/lib/plan` (where they are defined), and `getDomainFromUrl` + `cn` from `@/lib/utils`. Do NOT add these freemium functions to `lib/utils.ts` — they already exist in `lib/plan.ts`.

```tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from '@/components/ui/icons'
import { cn, getDomainFromUrl } from '@/lib/utils'
import { getVisibleProjects, getLockedProjects } from '@/lib/plan'
import type { Project } from '@/lib/types'

interface ProjectGridProps {
  projects: Project[]
  plan: 'free' | 'pro'
}

export default function ProjectGrid({ projects, plan }: ProjectGridProps) {
  const visible = getVisibleProjects(projects, plan)
  const locked = getLockedProjects(projects, plan)

  return (
    <section className="py-24 px-8 md:px-20 bg-black">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest uppercase text-white/30 font-body mb-10"
      >
        // Work
      </motion.p>

      {projects.length === 0 ? (
        <div className="liquid-glass rounded-[1.25rem] p-12 text-center text-sm text-white/25 font-body">
          No projects yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Visible cards */}
          {visible.map((project, i) => {
            const domain = getDomainFromUrl(project.url ?? '')
            return (
              <motion.div
                key={project.id}
                initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
                whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
                className="liquid-glass rounded-[1.25rem] p-7 min-h-[240px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        project.status === 'launched' ? 'bg-green-400' : 'bg-yellow-400'
                      )}
                    />
                    <span className="text-xs font-body text-white/30 capitalize">
                      {project.status === 'in_progress' ? 'In progress' : 'Launched'}
                    </span>
                  </div>

                  <p className="font-heading italic text-white text-3xl leading-snug mb-3">
                    {project.name}
                  </p>

                  {project.description && (
                    <p className="text-sm font-body text-white/40 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-body text-white/40 hover:text-white/70 transition-colors mt-5"
                  >
                    <ArrowUpRight />
                    {domain}
                  </a>
                )}
              </motion.div>
            )
          })}

          {/* Locked cards */}
          {locked.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: (visible.length + i) * 0.1 }}
              className="liquid-glass rounded-[1.25rem] p-7 min-h-[240px] flex flex-col justify-between relative overflow-hidden"
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 opacity-50 blur-[2px] bg-black/20 z-10" />

              {/* Lock overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/30"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <p className="text-xs font-body text-white/30 text-center px-4">
                  Upgrade to Pro to unlock
                </p>
              </div>

              {/* Blurred content behind */}
              <div className="opacity-30">
                <p className="font-heading italic text-white text-3xl leading-snug">
                  {project.name}
                </p>
                {project.description && (
                  <p className="text-sm font-body text-white/40 leading-relaxed mt-3">
                    {project.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 5: Create `components/profile/ActivityFeed.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { GitHubIcon } from '@/components/ui/icons'
import type { ActivityItem } from '@/lib/types'

interface ActivityFeedProps {
  activity: ActivityItem[]
  profile: {
    avatar_url: string | null
    full_name: string
  }
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function ActivityFeed({ activity, profile }: ActivityFeedProps) {
  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="py-24 px-8 md:px-20 bg-black">
      <div className="max-w-2xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-white/30 font-body mb-10"
        >
          // Activity
        </motion.p>

        {activity.length === 0 ? (
          <div className="liquid-glass rounded-[1rem] p-8 text-center text-sm text-white/25 font-body">
            No activity yet.
          </div>
        ) : (
          <div className="space-y-3">
            {activity.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
                whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.07 }}
                className="liquid-glass rounded-[1rem] p-5"
              >
                {item.type === 'github_commit' ? (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <GitHubIcon className="text-white/40 flex-shrink-0" />
                      <span className="text-sm font-body text-white/40">{item.repo_name}</span>
                      <span className="text-xs font-body text-white/20 ml-auto">
                        {getRelativeTime(item.created_at)}
                      </span>
                    </div>
                    <p className="text-sm font-body text-white/70 leading-relaxed pl-8">
                      {item.content}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[8px] font-heading italic text-white/60">{initials}</span>
                        </div>
                      )}
                      <span className="text-sm font-body text-white/40">Posted an update</span>
                      <span className="text-xs font-body text-white/20 ml-auto">
                        {getRelativeTime(item.created_at)}
                      </span>
                    </div>
                    <p className="text-sm font-body text-white/70 leading-relaxed pl-8">
                      {item.content}
                    </p>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt="Update"
                        className="mt-4 rounded-[0.75rem] w-full object-cover max-h-64 ml-8"
                        style={{ maxWidth: 'calc(100% - 2rem)' }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `components/profile/ProfileFooter.tsx`**

```tsx
import Link from 'next/link'

interface ProfileFooterProps {
  plan: 'free' | 'pro'
}

export default function ProfileFooter({ plan }: ProfileFooterProps) {
  if (plan === 'pro') {
    return <footer className="h-16 bg-black" />
  }

  return (
    <footer className="py-8 px-8 bg-black flex justify-center">
      <Link
        href="/"
        className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <span className="font-heading italic text-white text-sm">i</span>
        <span className="text-sm font-body text-white/50">Made with Ingegno</span>
      </Link>
    </footer>
  )
}
```

- [ ] **Step 7: Create `app/[username]/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProfileNavbar from '@/components/profile/ProfileNavbar'
import ProfileHero from '@/components/profile/ProfileHero'
import ProfileNarrative from '@/components/profile/ProfileNarrative'
import ProjectGrid from '@/components/profile/ProjectGrid'
import ActivityFeed from '@/components/profile/ActivityFeed'
import ProfileFooter from '@/components/profile/ProfileFooter'
import type { ActivityItem } from '@/lib/types'

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, tagline, is_public')
    .eq('username', params.username)
    .single()

  if (!profile?.is_public) return { title: 'Ingegno' }

  return {
    title: `${profile.full_name} — Ingegno`,
    description: profile.tagline ?? undefined,
    openGraph: {
      images: [`/api/og/${params.username}`],
    },
  }
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .eq('is_public', true)
    .single()

  if (!profile) notFound()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', profile.id)
    .order('display_order')

  const [{ data: githubActivity }, { data: updates }] = await Promise.all([
    supabase
      .from('github_activity')
      .select('*')
      .eq('user_id', profile.id)
      .order('committed_at', { ascending: false })
      .limit(20),
    supabase
      .from('updates')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const activity: ActivityItem[] = [
    ...(githubActivity ?? []).map((a) => ({
      id: a.id,
      type: 'github_commit' as const,
      content: a.commit_message,
      repo_name: a.repo_name,
      created_at: a.committed_at,
    })),
    ...(updates ?? []).map((u) => ({
      id: u.id,
      type: 'manual_update' as const,
      content: u.content,
      image_url: u.image_url ?? undefined,
      created_at: u.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20)

  return (
    <main className="bg-black min-h-screen">
      <ProfileNavbar />
      <ProfileHero profile={profile} />
      <ProfileNarrative narrative={profile.narrative} />
      <ProjectGrid projects={projects ?? []} plan={profile.plan} />
      <ActivityFeed
        activity={activity}
        profile={{ avatar_url: profile.avatar_url, full_name: profile.full_name }}
      />
      <ProfileFooter plan={profile.plan} />
    </main>
  )
}
```

- [ ] **Step 8: Create `app/[username]/not-found.tsx`**

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="bg-black min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <p className="font-heading italic text-white/20 text-8xl mb-6">404</p>
      <p className="font-body text-white/40 text-lg mb-8">This profile doesn&apos;t exist or isn&apos;t public yet.</p>
      <Link
        href="/"
        className="liquid-glass rounded-full px-6 py-3 text-sm font-body text-white/60 hover:text-white transition-colors"
      >
        Go home
      </Link>
    </main>
  )
}
```

- [ ] **Step 9: Manual verification**

- In Supabase dashboard, set `is_public = true` on a test profile
- Run `npm run dev`
- Visit `localhost:3000/{username}` — verify all sections render: ProfileNavbar → ProfileHero → ProfileNarrative → ProjectGrid → ActivityFeed → ProfileFooter
- Verify freemium gate: free plan + 3 projects → 3rd card shows locked overlay with blur
- Visit a username that doesn't exist → verify `not-found.tsx` renders
- Verify ProfileFooter shows "Made with Ingegno" on free plan and is blank on pro
- Verify activity feed shows GitHub commits and manual updates merged and sorted by date

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: public profile page components and [username] route"
```

---

### Task 14: OG Image Route

**Files:**
- Create: `Portfolio/P4 - Ingegno/app/api/og/[username]/route.tsx`

- [ ] **Step 1: Create `app/api/og/[username]/route.tsx`**

> Note: `@vercel/og` with `runtime = 'edge'` does not support `next/font`. Fonts render as browser-default serif/sans-serif in the OG image. Acceptable for MVP. For V2, load Instrument Serif as base64 and pass it via `fonts: [{ name: 'Instrument Serif', data: fontBuffer, style: 'italic' }]`.

```tsx
import { ImageResponse } from '@vercel/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, tagline, roles, is_public')
    .eq('username', params.username)
    .single()

  if (!profile?.is_public) {
    return new Response('Not found', { status: 404 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontStyle: 'italic',
            color: '#fff',
            fontWeight: 400,
            letterSpacing: '-3px',
            lineHeight: 0.9,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          {profile.full_name}
        </div>

        {/* Tagline */}
        {profile.tagline && (
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'sans-serif',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            {profile.tagline}
          </div>
        )}

        {/* Roles */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(profile.roles ?? []).slice(0, 4).map((role: string) => (
            <div
              key={role}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 16,
                fontFamily: 'sans-serif',
              }}
            >
              {role}
            </div>
          ))}
        </div>

        {/* Ingegno branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 18,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.2)',
            fontFamily: 'serif',
          }}
        >
          ingegno.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

- [ ] **Step 2: Manual verification**

- Run `npm run dev`
- Visit `localhost:3000/api/og/{username}` (profile with `is_public = true`) — verify a 1200×630 image renders with name, tagline, and role pills
- Visit `localhost:3000/api/og/nonexistent-user` — verify 404 response
- Open `localhost:3000/{username}` → DevTools → Elements → `<head>` → confirm `og:image` meta tag points to `/api/og/{username}`

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: OG image route for public profiles"
```

---

### Task 15: Deploy

**Files:**
- Create: `Portfolio/P4 - Ingegno/README.md`

- [ ] **Step 1: Push to GitHub**

Create a new repo `trustinraul/p4-ingegno` on github.com (private initially). Then:

```bash
cd "Portfolio/P4 - Ingegno"
git remote add origin https://github.com/trustinraul/p4-ingegno.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Create Vercel project**

- Go to vercel.com → New Project → Import Git Repository → select `p4-ingegno`
- Framework preset: Next.js
- Root directory: `.` (not a monorepo — leave as default)
- Do NOT deploy yet — add environment variables first

- [ ] **Step 3: Add environment variables in Vercel**

In Vercel → Project Settings → Environment Variables, add ALL of the following (for Production, Preview, and Development):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GITHUB_CLIENT_ID
NEXT_PUBLIC_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

Copy values from your local `.env.local`. After adding all variables, trigger the first deploy.

- [ ] **Step 4: Update GitHub OAuth App callback URL**

- Go to github.com → Settings → Developer Settings → OAuth Apps → Ingegno
- Update "Authorization callback URL" to `https://{your-vercel-url}.vercel.app/api/github/callback`
- Once a custom domain is set up, update again to `https://ingegno.app/api/github/callback`

- [ ] **Step 5: Update Supabase Auth redirect URLs**

- Go to Supabase Dashboard → Authentication → URL Configuration
- Add to "Redirect URLs": `https://{your-vercel-url}.vercel.app/**`
- Also add `https://ingegno.app/**` if using a custom domain

- [ ] **Step 6: Test production deploy**

- Create an account on the production URL
- Fill in profile: name, tagline, roles, narrative
- Add 3+ projects (to test freemium gate)
- Set `is_public = true`
- Visit `https://{vercel-url}/{username}` — verify all profile sections render
- Visit `https://{vercel-url}/api/og/{username}` — verify OG image generates at 1200×630
- Connect GitHub OAuth — verify commits appear in activity feed
- Test on mobile at 375px — verify no horizontal overflow

- [ ] **Step 7: Write `README.md`**

```md
# Ingegno

Premium public profiles for modern polymaths — founders, creators, and multi-disciplinary builders who refuse to pick a lane.

**Live:** [p4-ingegno.vercel.app](https://p4-ingegno.vercel.app)

## Stack
- Next.js 14+ (App Router)
- React + Tailwind CSS
- Supabase (Auth + PostgreSQL + Storage)
- Framer Motion
- Vercel

## Features
- Public profile page at `/[username]` with cinematic dark design
- Dashboard: profile editor, projects CRUD, manual updates
- GitHub OAuth + manual commit sync to activity feed
- OG image generation per profile (`/api/og/[username]`)
- Freemium gate: 2 visible projects on Free, unlimited on Pro

## Run locally
\`\`\`bash
npm install
cp .env.local.example .env.local
# Fill in Supabase and GitHub credentials
npm run dev
\`\`\`

## Screenshots
[add after deploy]
```

- [ ] **Step 8: Final checklist**

Verify every item before marking P4 as complete:

```
- [ ] Deployed on Vercel with working public URL
- [ ] GitHub repo with English README
- [ ] Responsive design at 375px — no horizontal overflow
- [ ] No console.error or critical warnings in production
- [ ] Environment variables in Vercel, not in repo
- [ ] Auth flow works end-to-end in production (sign up, log in, log out)
- [ ] Public profile page renders at /{username}
- [ ] OG image generates at /api/og/{username}
- [ ] Freemium gate working: 3rd+ project locked on free plan
- [ ] GitHub sync: commits appear in activity feed after "Sync now"
```

- [ ] **Step 9: Commit README and push**

```bash
git add README.md
git commit -m "docs: add README for portfolio"
git push
```

After verifying everything works in production, make the GitHub repo public:
- GitHub → Repository Settings → Danger Zone → Change repository visibility → Public

---

## Phase 2 — Polish, Security & Redesign

Executed after the initial MVP build. Goal: ship a product that is visually coherent, secure, and free of critical bugs before public launch.

---

### Task 14: Debug + Security Audit + UI/UX Refinement

**Files affected:** varies per step — no single source of truth

- [x] **Step 1: Fix auth bug on signup**

Auth flow had 4 chained bugs: missing `emailRedirectTo`, profile INSERT without active session, misleading error message on retry (Supabase email enumeration protection), and missing session refresh middleware. Fixed by:
- Adding `emailRedirectTo` pointing to `/auth/callback` in `signUp` action
- Moving profile creation to `app/auth/callback/route.ts` (after session is active) for the email confirmation flow; inserting directly in `signUp` when `data.session` is non-null (email confirmation disabled)
- Confirming `proxy.ts` handles session refresh — `middleware.ts` was not needed
- Disabling Supabase email confirmation for development (rate limit on built-in SMTP); to re-enable in production with Resend as SMTP

- [ ] **Step 2: Scan for exposed API keys**

Review all `.ts` / `.tsx` files for hardcoded secrets or keys that should live in env vars. Check:
- No `SUPABASE_SERVICE_ROLE_KEY` references outside server-only files
- No `GITHUB_CLIENT_SECRET` references in client components or public routes
- No API keys, tokens, or passwords in any `'use client'` file
- Confirm `.env.local` is in `.gitignore`

```bash
grep -r "eyJ" app components lib --include="*.ts" --include="*.tsx"
grep -r "sk_" app components lib --include="*.ts" --include="*.tsx"
grep -rn "service_role" app components lib --include="*.ts" --include="*.tsx"
```

- [ ] **Step 3: Sanitize all user inputs**

Review every form field and Server Action for missing validation:
- `signUp`: username regex already validated (`/^[a-z0-9-]{3,20}$/`), reserved words list present
- `updateProfile`: validate `full_name` max length, `tagline` max length, `narrative` word count (≤250), `roles` array length (≤10)
- `createProject` / `updateProject`: validate `name` not empty, `url` format if provided
- `createUpdate`: validate `content` not empty, max 2000 chars
- All file uploads: validate MIME type and size server-side (not just client `accept` attribute)

- [ ] **Step 4: Add rate limiting**

Apply rate limiting to the most sensitive endpoints to prevent abuse:
- `app/auth/callback/route.ts` — limit code exchange attempts per IP
- `app/actions/auth.ts` — signUp and signIn (Supabase handles this internally via GoTrue, but verify)
- `app/api/github/sync/route.ts` — prevent manual sync spam (e.g. max 1 request per 5 min per user)
- Use Vercel's built-in rate limiting or a simple in-memory counter with `next/headers` for the sync route

- [ ] **Step 5: Final security review**

Run through the OWASP Top 10 checklist for the current surface:
- No SQL injection risk (Supabase parameterized queries via JS client)
- XSS: no `dangerouslySetInnerHTML` — confirm no raw HTML rendering anywhere
- CSRF: Server Actions use Next.js built-in CSRF protection via same-origin cookies
- Auth bypass: confirm all `/dashboard/**` routes check `supabase.auth.getUser()` server-side, not just client cookies
- RLS: confirm no query uses `service_role_key` for user-owned data reads — only for admin operations
- `github_connections`: confirm `access_token` column never returned in any SELECT used by client components

- [ ] **Step 6: Visual harmony audit**

Review all pages for typographic and spacing consistency:
- Font sizes: headings use `font-heading italic`, body copy uses `font-body`. No mixed usage.
- Spacing: `space-y-8` or `space-y-12` between sections. No inconsistent gaps.
- Text opacity scale: `text-white` → `/80` → `/60` → `/40` → `/30` → `/20`. No out-of-scale values.
- Rounded corners: cards use `rounded-[1.25rem]`, buttons use `rounded-full`, inputs use `rounded-xl`.
- Liquid glass consistency: `.liquid-glass` for subtle containers, `.liquid-glass-strong` for overlays and auth forms.
- Check all pages: landing, `/discover`, `/dashboard`, `/dashboard/profile`, `/dashboard/projects`, `/dashboard/settings`, `/[username]`

- [ ] **Step 7: Add meaningful images**

Replace any placeholder or missing visuals with images that reinforce the Ingegno identity:
- Landing hero: one strong visual that evokes the Da Vinci / polymath concept (e.g., sketch, geometry, Renaissance reference)
- `/discover` page: consider a subtle background texture or visual treatment that distinguishes it from the landing
- Source from Unsplash (search: "Da Vinci sketch", "Renaissance geometry", "polymath", "builder")
- All images: use Next.js `<Image>` with correct `width`, `height`, and `alt` attributes

- [ ] **Step 8: Mobile test at 375px**

Open DevTools → device emulation → iPhone SE (375px width). Test every route:
- `/` — landing: navbar collapses correctly, hero text doesn't overflow, pricing cards stack vertically
- `/discover` — grid collapses to 1 column, cards readable
- `/signup` and `/login` — forms fill available width, no horizontal scroll
- `/dashboard` — sidebar: on mobile the sidebar should either be hidden by default or overlay mode. Adjust `DashboardShell` if needed.
- `/dashboard/profile` — ProfileForm fields stack correctly
- `/dashboard/projects` — project cards readable
- `/[username]` — ProfileHero text scales down, ProjectGrid is 1 column, ActivityFeed items readable
- Fix any overflow, truncation, or layout breakage found

- [ ] **Step 9: Make GitHub repo public**

Before making public, verify:
- `.gitignore` includes `.env.local`, `.env*.local`
- No secrets in git history (`git log --all --full-history -- .env.local`)
- `README.md` exists and is accurate

```bash
# Check for accidental secret commits
git log --all --oneline | head -20
git diff HEAD~5..HEAD -- .env.local
```

Then: GitHub → Repository Settings → Danger Zone → Change repository visibility → Public

- [ ] **Step 10: Final review pass**

End-to-end review before declaring the project finished:
- TypeScript: run `npx tsc --noEmit` — zero errors
- No `console.error` or unhandled promise rejections in browser DevTools
- Run Vitest: `npm run test` — `lib/plan.test.ts` passes
- Re-run security checklist from Step 5
- Check Vercel deployment logs for runtime errors
- Verify OG image generates correctly at `/api/og/[username]`

---

### Task 15: Discover Page + Dashboard Redesign

**Implemented 2026-05-26.**

> ⚠️ **Pending redesign — see Task 16 below.** The current `DiscoverCard` (profile preview card) is superseded by the Pinterest-style grid spec. Task 16 replaces `DiscoverCard` and `app/discover/page.tsx`.

**New files:**
- `app/discover/page.tsx` — grid of all public profiles, sorted by recent activity
- `components/landing/DiscoverCard.tsx` — profile card with avatar, roles, activity counter (updates in last 3.5 days) — **to be replaced in Task 16**
- `components/dashboard/DashboardShell.tsx` — Client Component wrapper managing sidebar collapse state
- `components/dashboard/AddUpdateButton.tsx` — "Add Update" button + inline modal with UpdateForm
- `components/ui/icons.tsx` — added `HomeIcon`, `FolderIcon`, `SettingsIcon`, `CompassIcon`, `MenuIcon`

**Modified files:**
- `components/landing/Navbar.tsx` — added "Discover" tab in center nav pill
- `components/dashboard/DashboardNav.tsx` — new collapsible sidebar: links (Dashboard, Projects, Settings, Discover), hamburger toggle, icon-only mode when collapsed
- `app/dashboard/layout.tsx` — uses `DashboardShell` instead of hardcoded `ml-64` layout
- `app/dashboard/page.tsx` — replaced redirect with read-only profile view (ProfileHero + ProfileNarrative + ProjectGrid + ActivityFeed + AddUpdateButton); empty state if `full_name` is null
- `app/dashboard/profile/page.tsx` — heading changed to "Edit Profile"
- `app/dashboard/settings/page.tsx` — added "// Profile" section with "Edit profile →" button
- `components/dashboard/UpdateForm.tsx` — added optional `onSuccess` callback prop

**User flow after redesign:**
- Visitor: Landing → Discover tab → grid of profiles → click card → `/[username]` public profile
- Da Vinci (creator): Dashboard → sees own profile read-only → "Add Update" button for quick posts → Settings → "Edit profile" → edit form

---

---

### Task 16: Discover — Pinterest-style Grid

Replaces the current profile-card grid with a visual, image-first grid. The unit of discovery is no longer the profile — it's a single piece of work.

**Design concept:** Masonry grid of visual cards. Two card types share the same grid:
1. **Update card** — a single update that has an image attached. The image fills the card; the update's text content is the caption below. Clicking the card goes to the author's public profile.
2. **Project collage card** — manually activated by the user once a project is marked "Launched". Shows a slideshow/collage of all images from updates linked to that project. The user triggers it from their dashboard, Ingegno proposes an ordering of the images before publishing, and the user confirms. Caption is the project name + status badge. Clicking goes to the author's public profile.

Cards without images are excluded from the Discover grid. A user with no image updates simply doesn't appear until they post one.

**Grid behavior:** Masonry layout (variable card height based on image aspect ratio), sorted by `created_at` descending. No pagination in MVP — limit 60 items on initial load.

**Files:**
- Replace: `app/discover/page.tsx` — fetch updates with images + published project collages, build masonry grid
- Replace: `components/discover/DiscoverCard.tsx` (rename from `landing/DiscoverCard.tsx`) — image card with caption and author attribution
- Create: `components/discover/ProjectCollageCard.tsx` — slideshow card for completed projects
- Create: `app/actions/collage.ts` — `publishProjectCollage(projectId)` Server Action: validates project is "launched", fetches all linked update images, returns ordered proposals; `confirmProjectCollage(projectId, orderedImageUrls)` stores final collage
- Modify: `supabase/migrations/` — add `project_collages` table: `id`, `user_id`, `project_id` (unique), `image_urls text[]`, `published_at`, `created_at`
- Modify: `app/dashboard/projects/page.tsx` — "Launched" projects show a "Publish collage →" button if no collage exists yet; if collage exists, show "Edit collage"
- Create: `components/dashboard/CollagePublisher.tsx` — modal: shows Ingegno's proposed image order (draggable to reorder), "Publish" button calls `confirmProjectCollage`

**RLS for `project_collages`:**
- SELECT: `EXISTS (SELECT 1 FROM profiles WHERE id = project_collages.user_id AND (is_public = true OR auth.uid() = id))`
- ALL owner: `auth.uid() = user_id`

**Constraints:**
- Update cards: only updates where `image_url IS NOT NULL` appear in Discover
- Project collage cards: only appear after user confirms via `CollagePublisher` — never auto-published
- `image_urls` array in `project_collages`: minimum 2 images required to publish a collage; maximum 12
- Collage proposals from Ingegno: order images by `updates.created_at` ascending (chronological build narrative) as the default proposal — user can reorder before confirming
- No Discover card links to a profile with `is_public = false`

- [ ] **Step 1: Add `project_collages` table to Supabase**

Run in SQL Editor:

```sql
CREATE TABLE project_collages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL UNIQUE,
  image_urls text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_collages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "collages_select" ON project_collages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = project_collages.user_id
    AND (is_public = true OR auth.uid() = id)
  ));
CREATE POLICY "collages_owner" ON project_collages FOR ALL
  USING (auth.uid() = user_id);
```

- [ ] **Step 2: Create `app/actions/collage.ts`**

```typescript
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Returns proposed image order (chronological) for user to review before confirming
export async function publishProjectCollage(projectId: string): Promise<{
  proposedImages: string[]
  error?: string
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { proposedImages: [], error: 'Not authenticated' }

  // Verify project is launched and owned by user
  const { data: project } = await supabase
    .from('projects')
    .select('status')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) return { proposedImages: [], error: 'Project not found' }
  if (project.status !== 'launched') return { proposedImages: [], error: 'Project must be launched first' }

  // Fetch all updates linked to this project that have images, ordered chronologically
  const { data: updates } = await supabase
    .from('updates')
    .select('image_url, created_at')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: true })

  const images = (updates ?? []).map((u) => u.image_url as string)

  if (images.length < 2) {
    return { proposedImages: [], error: 'Need at least 2 images linked to this project to create a collage' }
  }

  return { proposedImages: images.slice(0, 12) }
}

export async function confirmProjectCollage(projectId: string, orderedImageUrls: string[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  if (orderedImageUrls.length < 2) return { error: 'Minimum 2 images required' }
  if (orderedImageUrls.length > 12) return { error: 'Maximum 12 images allowed' }

  const { error } = await supabase
    .from('project_collages')
    .upsert({ user_id: user.id, project_id: projectId, image_urls: orderedImageUrls })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  revalidatePath('/discover')
  return { success: true }
}
```

- [ ] **Step 3: Create `components/dashboard/CollagePublisher.tsx`**

Modal triggered from the projects dashboard. Shows proposed image order, allows drag-to-reorder (or simple up/down buttons for MVP), then confirms.

```typescript
'use client'
import { useState, useTransition } from 'react'
import { confirmProjectCollage } from '@/app/actions/collage'
import Image from 'next/image'

interface CollagePublisherProps {
  projectId: string
  projectName: string
  proposedImages: string[]
  onClose: () => void
}

export default function CollagePublisher({ projectId, projectName, proposedImages, onClose }: CollagePublisherProps) {
  const [images, setImages] = useState(proposedImages)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function moveUp(i: number) {
    if (i === 0) return
    const next = [...images]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    setImages(next)
  }

  function moveDown(i: number) {
    if (i === images.length - 1) return
    const next = [...images]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    setImages(next)
  }

  function confirm() {
    startTransition(async () => {
      const result = await confirmProjectCollage(projectId, images)
      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="liquid-glass-strong rounded-[1.5rem] p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-6">
        <div>
          <h2 className="font-heading italic text-white text-2xl">Publish collage</h2>
          <p className="text-sm font-body text-white/40 mt-1">{projectName}</p>
        </div>

        <p className="text-xs font-body text-white/40 tracking-widest uppercase">
          Ingegno&apos;s proposed order — reorder before publishing
        </p>

        <div className="space-y-3">
          {images.map((url, i) => (
            <div key={url} className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="text-white/30 hover:text-white/70 disabled:opacity-20 text-sm transition-colors"
                >↑</button>
                <button
                  type="button"
                  onClick={() => moveDown(i)}
                  disabled={i === images.length - 1}
                  className="text-white/30 hover:text-white/70 disabled:opacity-20 text-sm transition-colors"
                >↓</button>
              </div>
              <span className="text-xs font-body text-white/20">{i + 1} / {images.length}</span>
            </div>
          ))}
        </div>

        {error && <p className="text-sm font-body text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={confirm}
            disabled={isPending}
            className="flex-1 bg-white text-black font-body text-sm font-medium rounded-full py-3 hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Publishing…' : 'Publish collage'}
          </button>
          <button
            onClick={onClose}
            className="px-5 text-sm font-body text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update `app/dashboard/projects/page.tsx`**

For each project with `status === 'launched'`, fetch whether a collage exists and show the "Publish collage →" / "Edit collage" button. On click, call `publishProjectCollage(projectId)` to get the proposed images, then render `CollagePublisher`.

Pass `collageStatus` (none | published) to `ProjectsClient` so it can render the button per card.

- [ ] **Step 5: Replace `app/discover/page.tsx` and `DiscoverCard`**

`app/discover/page.tsx` fetches two datasets in parallel:
1. Updates with `image_url IS NOT NULL`, joined with `profiles` (is_public = true), ordered by `created_at` DESC, limit 60
2. `project_collages` joined with `projects` (status = 'launched') and `profiles` (is_public = true), ordered by `created_at` DESC

Merge and sort by date. Render as a CSS masonry grid (`columns-2 md:columns-3 lg:columns-4`).

`components/discover/DiscoverCard.tsx` — update card:
- Full-width image (natural aspect ratio, no crop)
- Caption: `update.content` truncated to ~120 chars
- Author: `@username` with small avatar — links to `/[username]`

`components/discover/ProjectCollageCard.tsx` — collage card:
- Auto-advancing slideshow (CSS animation or simple interval), cycles through `image_urls`
- Caption: project name + "Launched" badge
- Author: `@username` — links to `/[username]`

- [ ] **Step 6: Manual verification**

- Post 2+ updates with images on a public profile → visit `/discover` → verify image cards appear
- Mark a project as "Launched" with 2+ linked image updates → click "Publish collage →" → verify `CollagePublisher` opens with proposed order → reorder → confirm → visit `/discover` → verify collage card appears and cycles through images
- Verify a profile with `is_public = false` does not appear in Discover
- Verify updates without images do not appear in Discover

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: discover pinterest grid with update cards and project collages"
```

---

## Future Ideas (V2 Backlog)

Features not in MVP scope. To be prioritized after launch validation.

### Networking — DV-to-DV messaging
Direct messaging system between creators inside the platform. Inbox in dashboard, notification badge. Scope: one-to-one messages, no group threads in V1.

### Discover with mandatory sign-up
Gate the Discover page (or individual profile views) behind authentication. Motivation: capture more registrations, build a closed creator network. Trade-off: reduces viral discovery. Evaluate with data before implementing.

### Premium social media widgets (Pro feature)
Widgets that appear on the public profile alongside the existing activity feed. The user links a social account; the widget shows recent activity counts (e.g., "1 new reel · 2 carousels · 5 stories" for Instagram). Each network requires its own OAuth integration. Priority order based on user demand: Instagram → YouTube → LinkedIn. Inspired by the existing GitHub activity feed pattern already in the product.
