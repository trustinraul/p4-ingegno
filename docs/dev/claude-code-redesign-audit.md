# Claude Code — Redesign Audit & Fix Prompt
## Ingegno Landing Page · Full Redesign Pass
*Generated via redesign-skill audit · 8 jun 2026*

> Paste this entire document as your first message in Claude Code with the project folder open.
> Work through fixes in the exact order listed. Each section has a severity level and exact code changes.

---

## Context

Ingegno is a premium public profile platform (dark mode, `#000` bg, Instrument Serif italic headings, Barlow body, `#8B5CF6` violet accent, liquid-glass UI, Framer Motion animations). The site is live at p4-ingegno.vercel.app.

The core problem: **the site looks like nothing**. Not broken — just invisible. The liquid-glass components, the decorative elements, the body text — all are tuned so low-opacity they disappear on a real screen. The redesign below fixes this without touching copy or functionality.

---

## CRITICAL — Fix these first

---

### 1. `globals.css` — Opacity crisis

**Problem:** `background: rgba(255,255,255,0.01)` on `#000` = 1% white = invisible. Every card on the site blends into the background.

**Fix in `app/globals.css`:**

```css
/* BEFORE */
.liquid-glass {
  background: rgba(255,255,255,0.01);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
}

/* AFTER */
.liquid-glass {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: none;
  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.12),
    0 1px 24px rgba(0,0,0,0.4);
}
```

```css
/* BEFORE */
.liquid-glass-strong {
  background: rgba(255,255,255,0.01);
  backdrop-filter: blur(50px);
  box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
}

/* AFTER */
.liquid-glass-strong {
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: none;
  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.18),
    0 4px 32px rgba(0,0,0,0.5);
}
```

Also add a grain overlay to the `body` so pure black has texture:

```css
body {
  background: #080808;  /* off-black, not pure #000 */
  color: #fff;
}

/* Grain overlay — add this new rule */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}
```

---

### 2. `components/landing/Hero.tsx` — Animation buries the hero

**Problem:** BlurText + Framer Motion `initial: opacity: 0` means visitors see a black screen for 4-6 seconds. The badge, subheadline, CTAs all start invisible. By 5 seconds only the headline is partially visible.

**Fix 1 — Make the hero visible immediately while it still animates:**

In the `fadeUp` variants, change the `initial` opacity from 0 to 0.2:
```tsx
const fadeUp = {
  initial: { filter: 'blur(8px)', opacity: 0.15, y: 12 },  // was: blur(10px), opacity: 0, y: 20
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
}
```

**Fix 2 — Headline line break:**

"Your life's work. One URL." wraps as:
```
Your life's work. One
URL.
```
`URL.` alone on line 3 looks broken. Fix by adjusting the headline class to prevent the bad break:
```tsx
// Change this:
className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-3px] max-w-3xl text-center"

// To this:
className="text-5xl md:text-6xl lg:text-[4.75rem] font-heading italic text-white leading-[0.9] tracking-[-2px] max-w-2xl text-center"
```

**Fix 3 — Add a violet accent glow behind the hero to break the void:**

Add this inside the `<section>`, after the wireframe SVG div and before the radial glow div:
```tsx
{/* Violet accent bloom */}
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse 40% 30% at 50% 60%, rgba(139,92,246,0.06) 0%, transparent 70%)',
    zIndex: 1,
  }}
/>
```

**Fix 4 — Raise the wireframe SVG stroke opacity:**
```tsx
// Change:
stroke="rgba(255,255,255,0.06)"
// To:
stroke="rgba(255,255,255,0.10)"
```

---

### 3. `components/landing/TheProblem.tsx` — Invisible cards and dead space

**Problem 1:** Cards have `min-h-[200px]` but only 2 text elements — creates a large empty middle.

**Problem 2:** 3 equal card grid is the most generic AI layout. This fires immediately after the hero, so visitors' first scroll hits the most templated section.

**Fix 1 — Increase card text contrast:**
```tsx
// Body text: change white/40 → white/60
className="text-sm font-body text-white/60 leading-relaxed mt-4"

// Title: add slightly more weight
className="font-heading italic text-white text-xl leading-snug"
// No change needed here - already good
```

**Fix 2 — Remove `min-h` and let cards size to content, add padding:**
```tsx
// Change:
className="liquid-glass rounded-[1.25rem] p-7 min-h-[200px] flex flex-col justify-between"

// To:
className="liquid-glass rounded-[1.25rem] p-8 flex flex-col gap-5"
```

**Fix 3 — Break the 3-equal-column layout:**

Replace the current `grid-cols-3 gap-5` with an asymmetric layout that makes the first card wider:
```tsx
<div className="grid grid-cols-1 md:grid-cols-5 gap-5">
  <motion.div
    // first card — span 2 cols
    className="md:col-span-2 liquid-glass rounded-[1.25rem] p-8 flex flex-col gap-5"
    ...
  >
  <motion.div
    // second card — span 2 cols
    className="md:col-span-2 liquid-glass rounded-[1.25rem] p-8 flex flex-col gap-5"
    ...
  >
  <motion.div
    // third card — span 1 col (narrower, sits right)
    className="md:col-span-1 liquid-glass rounded-[1.25rem] p-8 flex flex-col gap-5"
    ...
  >
</div>
```
This way the three cards are not identical columns — it reads as editorial, not template.

---

### 4. `components/landing/Features.tsx` — Duplicate layout + numbered scaffolding

**Problem 1:** Same 3-column card grid as TheProblem, back to back. Visitor scrolls past one set of three cards and hits another set of three identical cards.

**Problem 2:** `01/02/03` numbers on features that aren't a sequence.

**Problem 3:** `min-h-[380px]` with sparse content = each card is ~60% empty.

**Fix 1 — Remove the number prefixes entirely:**
```tsx
// Delete this line from each card:
<p className="text-xs font-body text-white/20 mb-6">{feature.number}</p>
```
Update the `features` array to remove the `number` field.

**Fix 2 — Change to a different layout (not 3 equal columns):**

Use a stacked layout where each feature is a wide horizontal row:
```tsx
<div className="flex flex-col gap-4 max-w-4xl">
  {features.map((feature, i) => (
    <motion.div
      key={i}
      initial={{ filter: 'blur(10px)', opacity: 0, x: -20 }}
      whileInView={{ filter: 'blur(0px)', opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.12 }}
      className="liquid-glass rounded-[1rem] px-8 py-7 flex items-start gap-8"
    >
      {/* Accent marker */}
      <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent flex-shrink-0 mt-1" />
      <div>
        <p className="font-heading italic text-white text-2xl leading-snug mb-3">{feature.title}</p>
        <p className="text-sm font-body text-white/60 leading-relaxed max-w-xl">{feature.body}</p>
      </div>
    </motion.div>
  ))}
</div>
```
This immediately reads differently from TheProblem. It's also more legible.

---

### 5. `components/landing/TheName.tsx` — Right side void + invisible decorative "i"

**Problem 1:** The decorative "i" has `opacity: 0.025` = invisible.
**Problem 2:** The right half of the section is completely empty.
**Problem 3:** This is the brand's most important section conceptually — and it has the weakest visual presence.

**Fix 1 — Raise the "i" opacity:**
```tsx
// Change:
style={{ fontSize: '22rem', opacity: 0.025, lineHeight: 1 }}
// To:
style={{ fontSize: '22rem', opacity: 0.06, lineHeight: 1 }}
```

**Fix 2 — Add the Vitruvian Man image (already in `public/images/`):**

Add this import and div BEFORE the `<div className="relative z-10 max-w-2xl">`:

```tsx
import Image from 'next/image'

{/* Vitruvian Man — decorative background */}
<motion.div
  className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none"
  style={{ zIndex: 1 }}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 1.4, ease: 'easeOut' }}
  aria-hidden="true"
>
  <Image
    src="/images/davinci_vitruvian_man.jpg"
    alt=""
    fill
    className="object-cover object-top"
    style={{ opacity: 0.08, mixBlendMode: 'luminosity' }}
    sizes="55vw"
    priority={false}
  />
  {/* Fade out toward left edge so it doesn't cut into text */}
  <div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(to right, #080808 0%, transparent 30%)'
    }}
  />
</motion.div>
```

Note: opacity `0.08` on `#080808` background (not pure `#000`) — this is why the background change matters. With `#000`, even 0.08 looks dark; with `#080808`, it reads as a ghost image.

**Fix 3 — Raise body text contrast:**
```tsx
// Change white/50 → white/65
className="text-base font-body text-white/65 leading-relaxed mb-5"
```

---

## HIGH — Fix these second

---

### 6. `components/landing/Pricing.tsx` — Invisible bullets + misaligned feature lists

**Fix 1 — Replace dot bullets with a proper check mark:**
```tsx
// Change each list item from:
<span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />

// To (in Free tier):
<span className="text-white/30 flex-shrink-0 text-xs">—</span>

// To (in Pro tier — more visible since it's the highlighted card):
<span className="text-white/60 flex-shrink-0 text-xs">✓</span>
```

**Fix 2 — Add violet accent to the Pro pricing number:**
```tsx
// Change:
<p className="font-heading italic text-white text-5xl mb-1">€9</p>

// To:
<p className="font-heading italic text-5xl mb-1" style={{ color: '#8B5CF6' }}>€9</p>
```

This uses the brand accent for the first time in a section other than the Navbar.

**Fix 3 — Fix feature list vertical alignment across columns:**

Wrap the price area of each card in a fixed-height block:
```tsx
{/* Free card price block */}
<div className="min-h-[80px]">
  <p className="text-sm font-body text-white/40 mb-2">Free</p>
  <p className="font-heading italic text-white text-5xl mb-1">€0</p>
  <p className="text-xs font-body text-white/30 mb-8">forever</p>
</div>
{/* feature list starts here - now aligned across both cards */}

{/* Pro card price block — same min-height */}
<div className="min-h-[80px]">
  <p className="text-sm font-body text-white/40 mb-2">Pro</p>
  <p className="font-heading italic text-5xl mb-1" style={{ color: '#8B5CF6' }}>€9</p>
  <p className="text-xs font-body text-white/30 mb-8">/month · or €79/year</p>
</div>
```

---

### 7. `components/landing/FinalCTA.tsx` — Flat finish

**Problem:** Centered text on pure background with zero visual depth. The last thing visitors see before signing up.

**Fix — Add violet bloom + notebook texture:**

```tsx
import Image from 'next/image'

// Make the section relative, then add inside it as first two children:

{/* Violet upward bloom */}
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(139,92,246,0.07) 0%, transparent 70%)',
    zIndex: 0,
  }}
/>

{/* Notebook anatomy texture */}
<motion.div
  className="absolute inset-0 pointer-events-none select-none"
  style={{ zIndex: 0 }}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 1.4, ease: 'easeOut' }}
  aria-hidden="true"
>
  <Image
    src="/images/davinci_notebook_anatomy.jpg"
    alt=""
    fill
    className="object-cover object-center"
    style={{ opacity: 0.04, mixBlendMode: 'luminosity' }}
    sizes="100vw"
  />
</motion.div>

{/* Wrap existing content in relative z-10 div */}
<div className="relative z-10 flex flex-col items-center">
  {/* existing BlurText, p, and Link here */}
</div>
```

---

### 8. All sections — Eyebrow label overuse

**Problem:** Every section has `// THE PROBLEM`, `// WHAT INGEGNO GIVES YOU`, `// THE NAME`, `// PRICING` in identical small uppercase tracked text. The developer-comment syntax (`//`) is clever, but applying it identically to every section makes it a reflex, not a brand choice.

**Fix — Use the eyebrow only on 3 of the 5 sections. Remove it from Features and FinalCTA:**

In `Features.tsx` — delete the entire `<motion.p>` eyebrow element.
In `FinalCTA.tsx` — there's no eyebrow currently, keep it that way.

This means the eyebrow appears on: TheProblem, TheName, Pricing. Those are the moments where naming the section adds value. Features and FinalCTA speak for themselves.

---

### 9. `components/landing/Hero.tsx` — Hero preview card upgrade

**Problem:** The "L" initial in a `bg-white/10` circle is a very thin avatar for a product that sells premium profile presentation.

**Fix — Add a subtle violet ring and improve the initial display:**

```tsx
{/* Avatar */}
<div className="w-14 h-14 rounded-full flex items-center justify-center relative"
  style={{
    background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0.05) 100%)',
    boxShadow: '0 0 0 1px rgba(139,92,246,0.3), inset 0 1px 1px rgba(255,255,255,0.15)'
  }}>
  <span className="font-heading italic text-white text-2xl">L</span>
</div>
```

---

## MEDIUM — Polish pass

---

### 10. All body text — Legibility

Every instance of `text-white/40` on body copy should become `text-white/60`.
Every instance of `text-white/50` on body copy should become `text-white/65`.

The only exception: metadata labels, timestamps, or tertiary text that should intentionally recede.

Quick grep and replace in codebase:
- `text-white/40` → `text-white/60` (for `font-body` elements only)
- `text-white/50` → `text-white/65` (for `font-body` elements only)

---

### 11. Add violet accent as a thread

The brand accent `#8B5CF6` currently only appears in the Navbar CTA. Add it in two more places:

**In TheProblem section headline attribution:**
```tsx
// Change:
className="text-sm font-heading italic text-white/30 mt-5 mb-20"
// To:
className="text-sm font-heading italic mt-5 mb-20"
style={{ color: 'rgba(139,92,246,0.6)' }}
```

**In Features section — the vertical bar accent (already in fix #4 above) uses `bg-gradient-to-b from-white/30` — change to violet:**
```tsx
className="w-px h-12 flex-shrink-0 mt-1"
style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.5), transparent)' }}
```

---

### 12. Hero social proof — upgrade the names

```tsx
// Change from: ['Marco', 'Sofia', 'Lena', 'Arjun', 'Mila']
// To (same count, more diverse and specific):
['Khalid', 'Valeria', 'Søren', 'Zara', 'Ren']
```
Minor, but the current list reads as placeholder. These are slightly more unusual and feel less generated.

---

## Summary — Files to touch

| File | Changes | Priority |
|---|---|---|
| `app/globals.css` | Background → `#080808`, raise liquid-glass opacity, add grain | CRITICAL |
| `components/landing/Hero.tsx` | Fix animation initial state, headline size, add violet bloom, SVG opacity | CRITICAL |
| `components/landing/TheProblem.tsx` | Asymmetric grid, raise body text, remove min-h | CRITICAL |
| `components/landing/Features.tsx` | Remove numbers, horizontal row layout, remove eyebrow | CRITICAL |
| `components/landing/TheName.tsx` | Raise "i" opacity, add Vitruvian Man image, raise body text | CRITICAL |
| `components/landing/FinalCTA.tsx` | Add violet bloom + notebook texture | HIGH |
| `components/landing/Pricing.tsx` | Aligned price blocks, check marks, violet accent on Pro price | HIGH |
| All components | `text-white/40` → `text-white/60` for body copy | MEDIUM |

---

## What NOT to change

- Copy in any section
- Navigation structure
- Routing or auth flows
- The `liquid-glass` and `liquid-glass-strong` class names (only their values)
- The `BlurText` component logic
- `@keyframes rotate3d` in globals.css
- Pricing tier structure or feature lists

---

## Test after each section

1. Screenshot at 1440px desktop width
2. Screenshot at 375px mobile
3. Confirm cards are visibly distinct from background
4. Confirm headline doesn't orphan a single word on last line
5. Check that violet accent appears in at least 3 places on scroll-through
6. Run `npm run build` — no new errors
