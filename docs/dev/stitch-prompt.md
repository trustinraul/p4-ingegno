# Ingegno — Stitch Build Prompt

**Product:** Ingegno — premium public profiles for modern Da Vincis  
**Tagline:** "Your life's work, in one URL."  
**Aesthetic:** Same design language as Aetheris Voyage — liquid glass, pure black background, Instrument Serif italic headings, cinematic Framer Motion animations. Adapted for human profiles, not space travel.  
**Visual references:** Aetheris Voyage (attached screenshots), Dribbble Skin & Scent e-commerce, Dribbble Avon 3D Pearls — extract the dark luxury, 3D floating elements, editorial serif type, and premium spacing.

---

## Tech Stack (CDN-only, pinned)

```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
<script src="https://unpkg.com/framer-motion@11.11.17/dist/framer-motion.js"></script>
<script>window.Motion = window.FramerMotion;</script>
```

Body: `bg: #000`. Page is a React app mounted on `#root`. All components exported via `window.X = X`. Fonts via Google Fonts: `family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600`.

---

## Shared Design System

### Tailwind Config

```js
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['Instrument Serif', 'serif'],
        body: ['Barlow', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '9999px',
      },
    },
  },
}
```

### Liquid Glass CSS (exact, in `<style>` block)

```css
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
```

### Animation Defaults (Framer Motion)

Standard entrance: `initial: { filter: 'blur(10px)', opacity: 0, y: 20 }`, animate to `{ filter: 'blur(0px)', opacity: 1, y: 0 }`, `transition: { duration: 0.6, ease: 'easeOut' }`. Stagger children by 0.15s.

**BlurText component (word-by-word, identical to Aetheris):** IntersectionObserver triggers at 10% visibility. Splits text by spaces. Each word is a `motion.span` with 3-step keyframes: `{ filter: 'blur(10px)', opacity: 0, y: 50 }` → `{ filter: 'blur(5px)', opacity: 0.5, y: -5 }` → `{ filter: 'blur(0px)', opacity: 1, y: 0 }`. Duration 0.7s, `times: [0, 0.5, 1]`, `ease: easeOut`. Delay = `(i * 100) / 1000` seconds. `display: inline-block`, `marginRight: 0.28em`. Parent `<p>` is `display: flex; flexWrap: wrap; justifyContent: center; rowGap: 0.1em`.

**Inline SVG icons (all currentColor stroke, no lucide import):**  
ArrowUpRight: 24×24, paths `M7 17L17 7` + `M7 7h10v10`, strokeWidth 2, strokeLinecap/Join round.  
Play: 24×24 filled polygon `6 4 20 12 6 20 6 4`.  
GitHub: 20×20, standard Octocat SVG path.  
Pulse/Activity: 24×24, path `M22 12h-4l-3 9L9 3l-3 9H2`, strokeWidth 2.

---

## Page 1 — Landing Page (`/`)

### Navbar (fixed, top-4, px-8 lg:px-16, z-50)

Left: 48×48 liquid-glass circle containing italic Instrument Serif lowercase "i" in white — the Ingegno logomark.  
Center (desktop only): liquid-glass pill, `px-1.5 py-1.5`, holding 4 text links — Home · Features · Pricing · About — each `px-3 py-2 text-sm font-medium font-body text-white/90`. Followed by white pill button "Get your profile ↗" (`bg-white text-black font-body font-medium whitespace-nowrap`).  
Right: 48×48 invisible spacer.

---

### Section 1 — Hero (full-height, `#000` bg)

**Background 3D element:** A large wireframe icosahedron (20-faced polyhedron) rendered via CSS 3D transforms or SVG, positioned center-bottom of the viewport, 70% of viewport height. White strokes at `rgba(255,255,255,0.05)`, no fill. The polyhedron spins 360° continuously over 60s via `@keyframes rotate3d { from { transform: rotateY(0deg) rotateX(15deg); } to { transform: rotateY(360deg) rotateX(15deg); } }`, `animation-timing-function: linear`, `transform-style: preserve-3d`. Behind it: `radial-gradient(circle at 50% 75%, rgba(255,255,255,0.04) 0%, transparent 55%)`.

**Content (flex flex-col items-center justify-center min-h-screen pt-20 pb-24 px-4 text-center, z-10 relative):**

Badge (delay 0.3s): liquid-glass pill — chip "Beta" (`bg-white text-black text-xs font-semibold font-body px-3 py-1`) + "Now in early access — claim your username" (`text-sm text-white/80 font-body pr-3`).

Headline (BlurText, delay 0.4s): `"Your life's work. One URL."` — `text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-3px] max-w-3xl text-center`.

Subheadline (delay 0.7s): `"Stop explaining yourself. Ingegno gives multi-disciplinary founders, creators, and builders a single premium page that presents who you are, what you build, and how you think."` — `text-base md:text-lg text-white/60 font-body font-light max-w-lg leading-relaxed mt-5`.

CTAs (delay 0.9s, `flex gap-4 mt-8 justify-center flex-wrap`):  
– Primary: liquid-glass-strong pill `px-6 py-3 text-sm font-medium font-body text-white` — "Claim your username ↗"  
– Secondary: bare text `text-sm text-white/40 font-body hover:text-white/70 transition-colors` — "See an example profile →"

Preview card (delay 1.1s, `mt-16 w-full max-w-xl mx-auto`): liquid-glass card `rounded-[1.5rem] p-1`. Inside: dark `rounded-[1.25rem] bg-white/[0.02] p-8 flex flex-col items-center gap-4` — decorative mockup of a profile. Contains: circular avatar placeholder `w-20 h-20 rounded-full bg-white/10 flex items-center justify-center font-heading italic text-white/30 text-2xl` showing "L". Below: italic serif name `"Leonardo"` at `text-4xl font-heading italic text-white/80`. Below: 3 liquid-glass pills inline — "Founder" · "Designer" · "Builder". This is purely illustrative.

Partner strip (delay 1.3s, `mt-16 flex flex-col items-center gap-4 pb-4`): liquid-glass pill "Profiles already live" (`text-xs font-body text-white/50 px-3.5 py-1`). Row of 5 italic serif names `text-2xl font-heading italic text-white/60 tracking-tight gap-10 md:gap-14`: Aria · Kai · Remi · Soren · Luca.

---

### Section 2 — The Problem

Background: `#000`. `py-32 px-8 md:px-20`.

Kicker: `text-xs font-body text-white/30 tracking-widest uppercase mb-12` — `// The problem`

Pull quote (BlurText): `'"So... what exactly do you do?"'` — `font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-[-2px] max-w-3xl`.

Attribution (delay 0.5s after BlurText): `text-sm font-body text-white/30 mt-6 font-light italic` — "Asked to every founder, creator, and builder who refuses to pick a lane."

Three pain point cards (`grid grid-cols-1 md:grid-cols-3 gap-5 mt-24`). Each: liquid-glass `rounded-[1.25rem] p-7 min-h-[200px] flex flex-col justify-between`. Top: icon (20×20, white/40). Bottom: Title `font-heading italic text-white text-2xl leading-tight`. Body `text-sm text-white/60 font-body font-light leading-relaxed mt-3`.

Card 1 — icon: overlapping squares. Title: "Your portfolio looks like three people built it." Body: "When your work spans design, code, and writing, no single format can hold it all."  
Card 2 — icon: broken chain link. Title: "Clients don't know how to refer you." Body: "Without a clear narrative, word-of-mouth breaks down before it even starts."  
Card 3 — icon: tools/wrench. Title: "The tools are wrong for you." Body: "Linktree is too shallow. Notion is too ugly. Framer is too complex. Nothing fits."

---

### Section 3 — Features

Background: `#000` with centered radial glow `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)`. `py-32 px-8 md:px-20`.

Kicker: `// What Ingegno gives you`

Heading (BlurText): `"Built for people who can't be put in a box."` — same headline style, `max-w-2xl`.

Three feature cards (same structure as Aetheris Capabilities, `grid grid-cols-1 md:grid-cols-3 gap-6 mt-20`). Each: liquid-glass `rounded-[1.25rem] p-7 min-h-[380px] flex flex-col`.

Top row: 44×44 nested liquid-glass square `rounded-[0.75rem]` with white SVG icon. Pills row `flex flex-wrap justify-end gap-1.5 max-w-[65%]` — 4 liquid-glass pills `text-[11px] text-white/70 font-body px-3 py-1`.

Middle: `flex-1` spacer.

Bottom: Title `font-heading italic text-white text-3xl leading-none`. Body `text-sm text-white/60 font-body font-light leading-snug mt-3 max-w-[32ch]`.

Card 1 — Identity:  
Icon: person with intersecting circles (multi-identity).  
Tags: Multi-disciplinary · Coherent · Visual · Memorable  
Title: "Your identity, finally whole."  
Body: "Define your roles, your narrative, and your visual presence. Ingegno weaves them into a single coherent story — not a list of job titles."

Card 2 — Build in public:  
Icon: pulse/activity waveform.  
Tags: GitHub · Live updates · Timeline · Authentic  
Title: "Show your work as it happens."  
Body: "Connect GitHub and post manual updates. Your activity feed becomes a live record of how you build — the most powerful trust signal that exists."

Card 3 — Premium presence:  
Icon: sparkle/star.  
Tags: Dark mode · 3D design · Editorial · Premium  
Title: "A profile that matches your ambition."  
Body: "Not a template. Not a Notion doc. A cinematic, premium public page that makes people stop scrolling."

---

### Section 4 — The Name

Background: `#000`. `py-32 px-8 md:px-20`. Two-column layout on desktop (`grid grid-cols-1 md:grid-cols-2 gap-16 items-start`).

Left column:
Kicker: `// The name`  
Word: `"ingegno"` — `font-heading italic text-white text-6xl md:text-7xl tracking-[-3px] leading-none`.  
Pronunciation: `text-sm text-white/30 font-body font-light mt-3 mb-10` — `/in·ˈjen·yo/ · Italian, Renaissance`

Three paragraphs, each `text-base text-white/60 font-body font-light leading-relaxed max-w-md mb-5`:

P1: "Leonardo da Vinci used the word ingegno to describe a quality he considered the highest form of human intelligence: the creative capacity to connect disciplines that others kept separate."

P2: "He was a painter, an engineer, an anatomist, a musician, and a cartographer — not in spite of each other, but because of each other. The connections between fields were the source of his genius."

P3: "Ingegno is built for people with that same quality — modern Da Vincis who refuse to pick a lane, and who deserve a tool that celebrates that complexity instead of flattening it."

Right column (relative, overflow hidden):  
Large decorative "i" — `font-heading italic text-[22rem] text-white/[0.025] leading-none select-none pointer-events-none absolute -top-8 -right-8`. Creates an architectural typographic backdrop.

---

### Section 5 — Pricing

Background: `#000`. `py-32 px-8 md:px-20`.

Kicker: `// Pricing`  
Heading: `"Start free. Upgrade when you're ready."` — `font-heading italic text-white text-4xl md:text-5xl leading-tight tracking-[-1px] max-w-xl`.

Two cards (`grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mt-16`):

**Free card** (liquid-glass `rounded-[1.5rem] p-8`):  
Label `text-sm font-body text-white/40 mb-3` — "Free"  
Price `font-heading italic text-white text-5xl leading-none` — "€0"  
Period `text-sm text-white/30 font-body mt-1` — "forever"  
Divider `border-t border-white/10 my-7`  
Features list `space-y-3.5`: each item `flex items-start gap-3 text-sm font-body text-white/60`. Use a small `·` as the bullet (not checkmarks — minimalist):  
· Public page at ingegno.app/username  
· Up to 2 visible projects  
· Unlimited manual updates  
· Optional GitHub connection  
· "Made with Ingegno" badge on page  
CTA (mt-8): liquid-glass pill `w-full text-center py-3 text-sm font-body font-medium text-white` — "Get started free"

**Pro card** (liquid-glass-strong `rounded-[1.5rem] p-8`):  
Badge `mb-5`: liquid-glass pill `text-xs font-body text-white/60 px-3 py-1 self-start` — "Most popular"  
Label — "Pro"  
Price — "€9"  
Period — "/ month · or €79/year"  
Divider  
Features list:  
· Everything in Free  
· Unlimited projects  
· No "Made with Ingegno" badge  
· Priority support  
· Custom domain (coming soon)  
CTA (mt-8): `bg-white text-black w-full text-center py-3 rounded-full text-sm font-body font-medium` — "Get Pro →"

---

### Section 6 — Final CTA

Background: `#000`. `py-40 px-8 text-center`.

Heading (BlurText): `"One URL. Everything you are."` — `font-heading italic text-white text-5xl md:text-6xl lg:text-7xl tracking-[-2px] max-w-2xl mx-auto`.

Subtext (delay 0.5s): `"Join the Da Vincis who've already claimed their name."` — `text-base text-white/40 font-body font-light mt-5`.

CTA (delay 0.7s): liquid-glass-strong pill `px-8 py-4 text-base font-medium font-body text-white mt-8` — "Claim your username ↗"

---

### Footer

`border-t border-white/[0.08] py-8 px-8 md:px-20 flex items-center justify-between`:  
Left: italic serif "Ingegno" `text-lg text-white/20 font-heading`.  
Right: `text-xs text-white/20 font-body` — "© 2026 Ingegno"

---

## Page 2 — Public Profile Page (`/[username]`)

This is the core product. Every user gets this page at `ingegno.app/[username]`. It receives real data as props — all text comes from the database, no placeholders. Design the page around the user's content being the visual centrepiece.

### Data Props Reference

```ts
interface ProfilePageProps {
  profile: {
    full_name: string      // e.g. "Leonardo Bianchi"
    username: string       // e.g. "leonardo"
    tagline: string        // e.g. "Founder · Product Designer · Writer"
    roles: string[]        // e.g. ["Founder", "Product Designer", "Writer"]
    narrative: string      // 200–250 word pitch text
    avatar_url: string     // Supabase Storage URL or null
  }
  projects: Array<{
    id: string
    name: string
    description: string
    status: 'in_progress' | 'launched'
    url: string
  }>
  activity: Array<{
    id: string
    type: 'github_commit' | 'manual_update'
    content: string        // commit message or update text
    repo_name?: string     // only for github_commit
    image_url?: string     // only for manual_update
    created_at: string     // ISO 8601
  }>
}
```

Export each section as a separate named component: `ProfileHero`, `ProfileNarrative`, `ProjectGrid`, `ActivityFeed`. The page assembles them. This is a Server Component in Next.js — no `useState`, no `useEffect`. Framer Motion scroll-triggered animations only.

---

### Minimal Navbar (fixed, top-4, px-8, z-50)

Left: italic serif "Ingegno" `text-sm text-white/30 font-heading` — links back to `/`.  
Right: liquid-glass pill `px-4 py-2 text-xs font-body text-white/60` — "Get your profile ↗" → `/signup`.

---

### Section 1 — ProfileHero (full-height)

Background: pure `#000`.

Radial glow (absolute, behind avatar, non-interactive): `position: absolute; top: 35%; left: 50%; transform: translate(-50%, -50%); width: 700px; height: 700px; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%); border-radius: 50%; pointer-events: none;`

Content (`flex flex-col items-center justify-center min-h-screen pt-20 pb-20 px-8 text-center relative z-10`):

**Avatar** (delay 0.2s): outer ring — liquid-glass `w-32 h-32 rounded-full p-1`. Inner `<img src={profile.avatar_url}>` `w-full h-full rounded-full object-cover`. If no avatar: initials circle `bg-white/[0.06] w-full h-full rounded-full flex items-center justify-center font-heading italic text-white text-4xl` showing first letter of `full_name`.

**Name** (BlurText, delay 0.4s): `{profile.full_name}` — `font-heading italic text-white text-6xl md:text-7xl lg:text-[5rem] tracking-[-3px] leading-[0.9] mt-10`.

**Tagline** (delay 0.6s): `{profile.tagline}` — `text-lg text-white/50 font-body font-light mt-4 tracking-wide`.

**Roles** (delay 0.8s): `flex flex-wrap gap-2 mt-6 justify-center`. Each `{role}` in a liquid-glass pill `px-4 py-1.5 text-sm font-body text-white/70`.

**Scroll cue** (delay 1.3s): `mt-20`, downward chevron SVG `w-5 h-5 text-white/15`, `animate-bounce` at 50% speed.

---

### Section 2 — ProfileNarrative

Background: `#000`. `py-32 px-8 md:px-20`.

Max width container: `max-w-3xl mx-auto`.

Kicker: `text-xs font-body text-white/25 tracking-widest uppercase mb-16` — `// About`

Text: `{profile.narrative}` — rendered as a single `<p>`. Style: `font-heading italic text-white text-2xl md:text-3xl leading-[1.45] tracking-[-0.5px]`. The entire narrative is in Instrument Serif italic, large — editorial treatment, as if it were a printed statement. No sub-headings, no line breaks forced. The text breathes at this size.

Framer Motion: WhileInView, `initial: { opacity: 0, y: 30 }`, `animate: { opacity: 1, y: 0 }`, `transition: { duration: 0.9, ease: 'easeOut' }`.

---

### Section 3 — ProjectGrid

Background: `#000`. `py-24 px-8 md:px-20`.

Kicker: `// Work`

Grid (`grid grid-cols-1 md:grid-cols-2 gap-5 mt-14`): each project is a liquid-glass card `rounded-[1.25rem] p-7 min-h-[240px] flex flex-col justify-between group cursor-pointer`.

WhileInView stagger: each card delays by `index * 0.1`s.

**Card top:**  
Status badge (liquid-glass pill `text-xs font-body px-3 py-1 self-start flex items-center gap-2`):  
– `in_progress`: dot `w-2 h-2 rounded-full bg-white/50 animate-pulse` + text "In progress"  
– `launched`: dot `w-2 h-2 rounded-full bg-white/80` + text "Launched"

Project name (`font-heading italic text-white text-3xl leading-tight tracking-[-1px] mt-5`): `{project.name}`

Description (`text-sm text-white/55 font-body font-light leading-relaxed mt-3`): `{project.description}`

**Card bottom:**  
Link row (`flex items-center gap-1.5 text-sm font-body text-white/30 group-hover:text-white/60 transition-colors duration-300`): ArrowUpRight icon 16×16 + `{project.url}` (display domain only, trim protocol).

**Empty state** (if `projects.length === 0`): centered liquid-glass card `p-12` — `text-sm font-body text-white/25 text-center` — "No projects yet."

---

### Section 4 — ActivityFeed

Background: `#000`. `py-24 px-8 md:px-20`.

Max width: `max-w-2xl mx-auto`.

Kicker: `// Activity`

Feed (`space-y-3 mt-14`). Each activity item is a liquid-glass card `rounded-[1rem] p-5`. WhileInView stagger, `delay: index * 0.07s`.

**GitHub commit item:**  
Top row (`flex items-center gap-3`): GitHub SVG icon `w-4 h-4 text-white/35`. Repo name `text-xs font-body text-white/35 font-light`. Relative timestamp `text-xs text-white/20 ml-auto font-body` — e.g. "3 days ago".  
Commit message (`text-sm font-body text-white/70 font-light leading-relaxed mt-2`): `{activity.content}`.

**Manual update item:**  
Top row: avatar `<img>` `w-5 h-5 rounded-full object-cover`. "Posted an update" `text-xs font-body text-white/35`. Timestamp `ml-auto`.  
Update text (`text-sm font-body text-white/70 font-light leading-relaxed mt-2`): `{activity.content}`.  
If `activity.image_url`: `<img src={activity.image_url}>` `w-full rounded-[0.75rem] mt-3 object-cover max-h-52`.

**Empty state** (`py-16 text-center`): `text-sm font-body text-white/20` — "No activity yet."

---

### Footer (profile page)

`border-t border-white/[0.05] py-8 px-8 flex items-center justify-center`:

For free-plan users: liquid-glass pill `px-5 py-2 text-xs font-body text-white/25 flex items-center gap-2` — italic serif "i" logomark `font-heading text-sm text-white/30` + "Made with Ingegno". Links to `/`. This is the organic distribution loop — every free profile is a passive ad.

---

## Implementation Notes for Claude Code

- All public page sections (`ProfileHero`, `ProfileNarrative`, `ProjectGrid`, `ActivityFeed`) must be exported as named React components from separate files under `components/profile/`.
- The landing page sections are separate components under `components/landing/`.
- Framer Motion scroll animations use `whileInView` — no `useEffect` polling.
- No CSS transitions anywhere — Framer Motion exclusively.
- `rounded-[...]` values in `rem` throughout.
- All text: white. No colored backgrounds except liquid-glass.
- The profile page is a Next.js Server Component — fetch data server-side in `app/[username]/page.tsx`, pass as props. No `use client` at the page level.
- The landing page can use `use client` for animation components.
