# Claude Code Session — Task 16 + Security Audit

Read `CLAUDE.md` and `docs/plan.md` before doing anything. This prompt covers two sequential blocks of work.

---

## Block 1 — Task 16: Discover Pinterest-style Grid

Full spec is in `docs/plan.md` → Task 16. Execute all 7 steps in order.

### Critical correction (not in plan.md)
`createClient()` in this project is **async** (Next.js 16 pattern). Every call must be `await createClient()`. The plan.md code snippets omit the `await` — add it everywhere in `app/actions/collage.ts` and any other file you touch.

### Step 1 — `project_collages` table
Run this SQL in Supabase SQL Editor (copy-paste and tell the user to run it — do not run it yourself):

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

### Step 2 — `app/actions/collage.ts`
Create server action file. Use `await createClient()`. Full logic in plan.md Step 2.

Key behavior:
- `publishProjectCollage(projectId)` — validates project.status === 'launched', fetches updates with image_url IS NOT NULL ordered by created_at ASC, returns first 12. Returns `{ proposedImages: string[], error?: string }`.
- `confirmProjectCollage(projectId, orderedImageUrls)` — validates 2 ≤ length ≤ 12, upserts into project_collages, revalidates `/dashboard/projects` and `/discover`.

### Step 3 — `components/dashboard/CollagePublisher.tsx`
'use client' modal. Props: `projectId`, `projectName`, `proposedImages: string[]`, `onClose: () => void`.
- Shows images in proposed order with up/down buttons to reorder
- "Publish collage" calls `confirmProjectCollage` via `useTransition`
- Design: liquid-glass-strong modal, dark background overlay, consistent with existing dashboard modals
- Full implementation in plan.md Step 3

### Step 4 — Update `app/dashboard/projects/page.tsx`
For each project with `status === 'launched'`:
- Fetch whether a `project_collages` row exists for that project_id
- Show "Publish collage →" if no collage exists
- Show "Edit collage" if one exists
- On click: call `publishProjectCollage(projectId)` to get proposed images, render `CollagePublisher` modal
- This is a Server Component page — pass collage status down to a client component that handles the modal state

### Step 5 — Replace `app/discover/page.tsx` and discover components

**`app/discover/page.tsx`** — Server Component:
1. Fetch updates where `image_url IS NOT NULL`, join with profiles where `is_public = true`, order by `created_at DESC`, limit 60
2. Fetch `project_collages` joined with `projects` (status = 'launched') and `profiles` (is_public = true), order by `created_at DESC`
3. Merge both arrays, sort by date, render masonry grid

Use CSS masonry: `columns-2 md:columns-3 lg:columns-4 gap-3`, each card with `break-inside-avoid mb-3`.

**`components/discover/DiscoverCard.tsx`** — update card:
- Full-width image (natural aspect ratio, `width="full" height="auto"` — use `w-full h-auto` on the img)
- Caption: `update.content` truncated to ~120 chars, `text-xs font-body text-white/60`
- Author row: small avatar + `@username`, links to `/[username]`
- Hover: slight scale + overlay with author info
- Design: dark card, `rounded-2xl overflow-hidden`, liquid-glass on caption area

**`components/discover/ProjectCollageCard.tsx`** — collage card:
- Auto-advancing slideshow cycling through `image_urls` every 2.5s (use `useEffect` + `setInterval` + `useState` for current index)
- Fade transition between images (opacity CSS transition)
- Caption: project name + "Launched" badge (small violet pill)
- Author: `@username` — links to `/[username]`
- Same card shell as DiscoverCard

Move/rename `components/landing/DiscoverCard.tsx` → `components/discover/DiscoverCard.tsx`. Remove the old landing version if it's no longer used.

### Step 6 — Manual verification checklist
Output this at the end for the user to verify manually:
- [ ] Post 2+ updates with images on a test profile → `/discover` shows image cards
- [ ] Mark a project as "Launched" with 2+ linked image updates → "Publish collage →" button appears in dashboard
- [ ] CollagePublisher opens with proposed order → reorder → confirm → `/discover` shows collage card cycling images
- [ ] Profile with `is_public = false` does NOT appear in Discover
- [ ] Updates without images do NOT appear in Discover

### Step 7 — Commit
```bash
git add .
git commit -m "feat: discover pinterest grid with update cards and project collages"
```

---

## Block 2 — Task 14 Security Audit (Steps 2–10)

Full spec in `docs/plan.md` → Task 14. Step 1 (auth bug) is already done. Execute Steps 2–10.

### Step 2 — Scan for exposed API keys
Run these grep commands and report findings:
```bash
grep -r "eyJ" app components lib --include="*.ts" --include="*.tsx"
grep -r "sk_" app components lib --include="*.ts" --include="*.tsx"
grep -rn "service_role" app components lib --include="*.ts" --include="*.tsx"
grep -rn "GITHUB_CLIENT_SECRET" app components lib --include="*.ts" --include="*.tsx"
```
Fix any hardcoded secrets found. If none: confirm clean and move on.

Also verify:
- `.env.local` is in `.gitignore` — check `.gitignore`
- No `'use client'` file imports `SUPABASE_SERVICE_ROLE_KEY` or any `NEXT_PUBLIC_` variable that shouldn't be public

### Step 3 — Sanitize user inputs
Review every Server Action in `app/actions/`:
- `signUp`: username regex `/^[a-z0-9-]{3,20}$/` + reserved words list — verify present
- `updateProfile`: add validation for `full_name` max 100 chars, `tagline` max 140 chars, `narrative` max 2000 chars, `roles` array max 10 items
- `createProject` / `updateProject`: validate `name` not empty and max 100 chars, `url` valid URL format if provided
- `createUpdate`: validate `content` not empty and max 2000 chars
- File uploads (avatar, update images): validate MIME type (only image/*) and max size (5MB) server-side

Add a small `validateImageUpload(file: File): string | null` helper in `lib/utils.ts` if file upload validation is missing.

### Step 4 — Rate limiting on GitHub sync
In `app/api/github/sync/route.ts`: implement a simple per-user cooldown.
Use an in-memory Map with `userId → lastSyncTimestamp`. If last sync was < 5 minutes ago, return 429 with `{ error: 'Rate limit: wait 5 minutes between syncs' }`.

Simple implementation:
```typescript
const syncCooldown = new Map<string, number>()
const COOLDOWN_MS = 5 * 60 * 1000

// In route handler, after auth check:
const last = syncCooldown.get(user.id) ?? 0
if (Date.now() - last < COOLDOWN_MS) {
  return NextResponse.json({ error: 'Rate limit: wait 5 minutes between syncs' }, { status: 429 })
}
syncCooldown.set(user.id, Date.now())
```

Note: this resets on cold start (Vercel serverless). Acceptable for MVP.

### Step 5 — Security checklist
Check each item and report pass/fail:
- No `dangerouslySetInnerHTML` anywhere: `grep -r "dangerouslySetInnerHTML" app components`
- All `/dashboard/**` routes: verify they call `supabase.auth.getUser()` server-side and redirect if no user
- `github_connections`: confirm `access_token` column is never selected in any query used by client components — it should only be read in server-side Route Handlers (`app/api/github/`)
- RLS: not verifiable from code alone — remind user to spot-check in Supabase dashboard

### Step 6 — Visual harmony audit
Check all pages for consistency against the design system in CLAUDE.md:
- Font usage: `font-heading italic` on headings, `font-body` on body copy — fix any violations
- Text opacity: white → /80 → /60 → /40 → /30 → /20 — no arbitrary values like text-gray-400
- Rounded corners: `rounded-[1.25rem]` on cards, `rounded-full` on buttons, `rounded-xl` on inputs
- Liquid glass: `.liquid-glass` for containers, `.liquid-glass-strong` for overlays and modals
- Spacing: `space-y-8` or `space-y-12` between sections

Pages to check: `/`, `/discover`, `/dashboard`, `/dashboard/profile`, `/dashboard/projects`, `/dashboard/settings`, `/[username]`

Fix any violations found. Don't refactor working code — targeted fixes only.

### Step 7 — Add meaningful images
- Landing hero: if there's a placeholder or no image, add a strong visual from Unsplash that evokes the polymath/Da Vinci concept. Search terms: "da vinci sketch", "renaissance geometry", "builder workspace"
- Use Next.js `<Image>` with correct `width`, `height`, and `alt` attributes everywhere
- If images are already in place and look good, skip and move on — don't add images for the sake of it

### Step 8 — Mobile test at 375px
Open browser DevTools → device emulation → 375px width. Check these routes and fix any overflow, truncation, or layout breakage:
- `/` — hero text doesn't overflow, pricing cards stack
- `/discover` — masonry grid collapses to 2 columns on mobile (use `columns-2` as base)
- `/signup` and `/login` — forms fill width, no horizontal scroll
- `/dashboard` — sidebar: verify `DashboardShell` has mobile-friendly collapsed state (icon-only or hidden)
- `/[username]` — ProfileHero text scales, ProjectGrid is 1 column

Fix anything broken. Test particularly for `overflow-x: hidden` needs on the body.

### Step 9 — Make repo public
First run these checks:
```bash
git log --all --oneline | head -20
# Verify .gitignore includes .env.local
cat .gitignore | grep env
```

Then output this for the user to do manually:
> GitHub → Repository Settings → Danger Zone → Change repository visibility → Public

### Step 10 — Final review pass
```bash
npx tsc --noEmit
npm run test
```

Report: zero TypeScript errors + all Vitest tests passing.

Check Vercel deployment logs for runtime errors after pushing all changes.

---

## End of session
After Step 10, output a final summary:
- What was implemented (Task 16)
- What was fixed/audited (Task 14)
- Any manual steps remaining for the user (SQL migration, make repo public, Vercel env vars check)
- Project status relative to the "proyecto terminado" checklist in CLAUDE.md
