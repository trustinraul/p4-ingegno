# Claude Code — Image Integration Prompt
## Ingegno Landing Page · Da Vinci Assets

> Paste this entire file as your first message in Claude Code after opening the project folder.

---

## Context

Ingegno is a premium public profile platform for multi-disciplinary founders and creators. Brand identity: Renaissance + technology. The landing page is built in Next.js 14 App Router, React, Tailwind CSS, Framer Motion, dark mode (#000 background), liquid-glass UI components, Instrument Serif italic headings, Barlow body.

Four Da Vinci public-domain images have been downloaded and optimized. They live at:

```
public/images/
  davinci_vitruvian_man.jpg      (1400×1903, 751 KB)
  davinci_notebook_anatomy.jpg   (1168×1676, 460 KB)
  davinci_self_portrait.jpg      (420×659,    70 KB)
  davinci_codex_flight.jpg       (700×548,    76 KB)
```

Usage notes are in `_resources/brand/IMAGES.md`. Read it before touching anything.

---

## Task

Integrate the Da Vinci images as **decorative background elements** across the landing page components. These are not content images — they are visual texture that reinforces the Renaissance identity. Every image must be:

- Rendered with `next/image` (never `<img>`)
- Declared `aria-hidden="true"` and `alt=""` (decorative, not meaningful)
- Wrapped in `pointer-events-none select-none`
- At very low opacity (2–5% range) with `mix-blend-luminosity` to blend into the dark theme
- Animated in with Framer Motion `whileInView` (matching the site's existing reveal pattern)
- Performance-optimized: always include a `sizes` prop

Do not change copy, layout, or existing functionality. Only add image layers.

---

## Changes — file by file

### 1. `components/landing/TheName.tsx` — PRIMARY

**This section talks directly about Da Vinci. It is the highest-priority integration.**

Currently, the section has a decorative large italic "i" as an absolute background element (opacity 0.025). Keep it. Add a `davinci_vitruvian_man.jpg` image layer behind the text but in front of the decorative "i" — or replace the "i" if having both feels cluttered (your call after seeing both). The image should feel like it's barely there, like ink absorbed into dark paper.

Exact implementation:

```tsx
import Image from 'next/image'

// Inside the <section>, as a new absolute div BEFORE the <div className="relative z-10 ...">:
<motion.div
  className="absolute right-0 top-0 h-full w-1/2 pointer-events-none select-none"
  style={{ zIndex: 1 }}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 1.2, ease: 'easeOut' }}
  aria-hidden="true"
>
  <Image
    src="/images/davinci_vitruvian_man.jpg"
    alt=""
    fill
    className="object-cover object-center"
    style={{ opacity: 0.04, mixBlendMode: 'luminosity' }}
    sizes="50vw"
  />
</motion.div>
```

Adjust opacity between 0.03 and 0.05 until the figure is subliminal — visible on close inspection, not competing with text. The image is tall (portrait orientation) and will align naturally with the section's full height. The text is left-aligned (`max-w-2xl`), so the image on the right creates a natural composition.

---

### 2. `components/landing/FinalCTA.tsx` — SECONDARY

This section is currently just centered text on pure black — the weakest visual moment on the page. Adding `davinci_notebook_anatomy.jpg` as a full-section background texture will give it depth without changing its minimalist character.

```tsx
import Image from 'next/image'

// Make the <section> position: relative, then add inside it as first child:
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
    style={{ opacity: 0.03, mixBlendMode: 'luminosity' }}
    sizes="100vw"
  />
</motion.div>
```

Wrap the existing text content in `<div className="relative z-10">` so it sits above the image layer. Target opacity: 0.025–0.04. The anatomical sketch texture at this opacity reads as dark paper grain, not as an identifiable drawing.

---

### 3. `components/landing/Hero.tsx` — TERTIARY (careful)

The Hero already has two layers (wireframe SVG + radial glow). A third image layer risks muddying it. Only add if it looks right — do not force it.

If you add: use `davinci_codex_flight.jpg` (700×548, horizontal, flight machine sketches). Position it in the upper-right quadrant, not covering the center where the headline and preview card live. Opacity: 0.02–0.03 max. It should feel like a ghost watermark in the corner, not a feature.

```tsx
// Optional — upper-right only, not full-fill:
<motion.div
  className="absolute top-0 right-0 w-80 h-64 pointer-events-none select-none"
  style={{ zIndex: 1 }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1.6, ease: 'easeOut', delay: 1.5 }}
  aria-hidden="true"
>
  <Image
    src="/images/davinci_codex_flight.jpg"
    alt=""
    fill
    className="object-cover object-top"
    style={{ opacity: 0.025, mixBlendMode: 'luminosity' }}
    sizes="320px"
  />
</motion.div>
```

If it looks busy with the existing SVG geometry, skip it.

---

### 4. `davinci_self_portrait.jpg` — Reserve for profile/about page

Do NOT use the self-portrait on the landing page. Reserve it for a potential About or Profile demo context where a portrait image makes semantic sense. Using a face on the landing would feel like a random photo, not texture.

---

## What NOT to change

- Do not touch copy in any section
- Do not modify the liquid-glass CSS classes
- Do not change padding, margin, or layout
- Do not remove or replace the decorative "i" in TheName unless the combination with the Vitruvian Man image looks cluttered
- Do not add images to TheProblem or Features — the card grids there are clean and don't need texture
- Do not add images to Pricing — pricing cards need high legibility, texture would undermine trust

---

## Quality check after implementation

1. Screenshot the TheName section at desktop (1440px) and mobile (375px)
2. Confirm the Vitruvian Man image is subliminal: visible on inspection, not competing with the text
3. Confirm the FinalCTA section has noticeably more depth without feeling cluttered
4. Confirm all images have `alt=""` and `aria-hidden="true"`
5. Confirm no layout shifts (CLS) — use `fill` + fixed parent height, not width/height attributes
6. Confirm `next/image` is being used (not `<img>`)
7. Run `npm run build` — there should be no new errors or warnings from the image additions

---

## Secondary improvements (optional, lower priority)

These are design issues unrelated to images. Do them only if you have time and confidence.

### A. Feature cards — remove number prefixes

In `components/landing/Features.tsx`, each card has a `{feature.number}` (`01`, `02`, `03`) displayed at the top. These are redundant because the cards are not a sequence — they're parallel features. The title already communicates each feature without needing a number. Remove the number `<p>` element from each card and redistribute the vertical space.

### B. FinalCTA — add a subtle radial glow

The FinalCTA section feels cold. Add a faint radial glow similar to the one in Hero, pointing upward:

```tsx
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(139,92,246,0.04) 0%, transparent 70%)',
    zIndex: 2,
  }}
/>
```

This uses the brand violet accent (#8B5CF6) as a very faint upward bloom, connecting the CTA visually to the site's color system without making it loud. Keep opacity at 4% max.

---

## Files to touch (summary)

| File | Change | Priority |
|---|---|---|
| `components/landing/TheName.tsx` | Add Vitruvian Man as absolute bg image | Must-have |
| `components/landing/FinalCTA.tsx` | Add notebook anatomy as full-section texture | Must-have |
| `components/landing/Hero.tsx` | Add codex flight sketch in upper-right corner | Optional |
| `components/landing/Features.tsx` | Remove `01/02/03` number prefixes | Optional |

No new packages needed. `next/image` is already available in Next.js 14.

---

*Generated by Cowork session — 8 jun 2026*
