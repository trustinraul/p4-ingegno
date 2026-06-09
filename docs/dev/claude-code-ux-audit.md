# Claude Code — UX/UI Audit Execution Prompt
## Ingegno — Anti-AI-Slop Pass

> Ejecutar en este orden exacto. No saltarse pasos.  
> Usa el skill `/impeccable` para cada bloque.  
> Antes de empezar: `node .claude/skills/impeccable/scripts/context.mjs`

---

## BLOQUE 1 — P0: Accesibilidad crítica
**Comando:** `/impeccable audit`  
**Foco:** contraste, focus-visible, prefers-reduced-motion

### 1A. Remap de opacidades de texto (todo el codebase)
Todo el texto secundario falla WCAG AA sobre `#080808`. Regla mínima:

| Clase actual | Reemplazar por | Uso |
|---|---|---|
| `text-white/30` | `text-white/40` | Solo para captions grandes (≥18px) |
| `text-white/40` | `text-white/55` | Muted body |
| `text-white/60` | `text-white/75` | Body normal |
| `text-white/70` | `text-white/85` | Body importante |

Busca en todos los archivos `.tsx` bajo `components/` y `app/`. Haz grep de `/30`, `/40`, `/60`, `/70` y actualiza según la tabla. Excepción: no cambies valores que sean de opacidad de fondos o bordes — solo texto (`text-white/*`).

Caso especial: los labels de formulario usan `text-xs text-white/40 uppercase tracking-wider` — cambiar a `text-sm text-white/70`.

### 1B. Focus-visible en inputs y botones
Busca `focus:outline-none` en todos los `.tsx`. Reemplazar con:
```tsx
// En inputs
className="... focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black"

// En botones/links del sidebar
className="... focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
```

### 1C. prefers-reduced-motion para animaciones CSS puras
En `app/globals.css`, añadir al final:
```css
@media (prefers-reduced-motion: reduce) {
  .rotate3d-svg {
    animation: none;
  }
}
```

En `components/profile/ProfileHero.tsx` (o donde esté el scroll cue con `animation: 'bounce 2s infinite'`), reemplazar el inline style con un `motion.div` que use `useReducedMotion()`:
```tsx
import { motion, useReducedMotion } from 'framer-motion'

const prefersReducedMotion = useReducedMotion()

// En el elemento:
<motion.div
  animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
>
```

---

## BLOQUE 2 — P1: Tipografía
**Comando:** `/impeccable typeset`

### 2A. Swap Instrument Serif → EB Garamond
`Instrument_Serif` es el serif más flaggeado como AI-default. `EB Garamond` es más on-brand para el concepto renacimiento y tiene menos fingerprint de AI.

En `app/layout.tsx`:
```tsx
// Eliminar:
import { Instrument_Serif } from 'next/font/google'
const instrumentSerif = Instrument_Serif({ ... })

// Añadir:
import { EB_Garamond } from 'next/font/google'
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})
```

Actualizar el `className` del body en layout.tsx para usar `ebGaramond.variable` en lugar del anterior.  
El token CSS `--font-instrument-serif` → renombrar a `--font-heading` en globals.css (o actualizar donde se declare).  
En `tailwind.config.ts`, actualizar la family `heading` al nuevo token.

Verificar que no queden imports de `Instrument_Serif` en ningún archivo.

---

## BLOQUE 3 — P1: Reducir señales de AI
**Comando:** `/impeccable quieter`

### 3A. Eyebrows: máximo 1 por cada 3 secciones

**Landing page** — eliminar los eyebrows de todo excepto `// The problem`:
- `components/landing/Features.tsx`: eliminar el eyebrow si existe
- `components/landing/TheName.tsx`: eliminar `// The name`
- `components/landing/Pricing.tsx`: eliminar `// Pricing`
- `components/landing/FinalCTA.tsx`: eliminar eyebrow si existe

**Profile page** — eliminar todos los eyebrows de secciones:
- `components/profile/ProfileNarrative.tsx`: eliminar `// About`
- `components/profile/ProjectGrid.tsx`: eliminar `// Work`
- `components/profile/ActivityFeed.tsx`: eliminar `// Activity`

**Dashboard settings** — eliminar todos:
- Los tres headings de settings (`// Profile`, `// GitHub`, `// Account`) deben ser headings simples sin el prefijo `//`.

El eyebrow pattern es: `text-xs tracking-widest uppercase text-white/30 font-body` con contenido `// Algo`. Deja que los headings hablen solos.

### 3B. BlurText: máximo 2 usos en toda la landing

Reservar `<BlurText>` solo para:
1. El headline del Hero (`Your life's work. One URL.`)
2. El headline de Features (`Built for people who can't be put in a box.`)

Para todos los demás headings en la landing (TheProblem, TheName, Pricing, FinalCTA): reemplazar `<BlurText>` con un `motion.h2` / `motion.p` simple:
```tsx
<motion.h2
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
  className="font-heading italic text-white ..."
>
  {heading text}
</motion.h2>
```

### 3C. Liquid glass: reducir a superficies que lo merecen
Liquid glass debería estar en máximo 5-6 superficies, no en 25+. Auditar y eliminar de:
- Las tres pain-point cards en `TheProblem` (ver Bloque 6 para el nuevo layout)
- Los feature rows en `Features` (los tres cards con el violet gradient bar)
- Los items de `ActivityFeed` — usar `border-b border-white/5` en su lugar
- Las `ProjectCard` individuales — usar border sutil en lugar de glass completo

Mantener glass en: Navbar pill, Hero badge, Hero preview card, Pricing cards, image frames (Vitruvian Man, portrait).

---

## BLOQUE 4 — P1: Onboarding
**Comando:** `/impeccable onboard`

### 4A. Checklist de 3 pasos en el dashboard para nuevos usuarios
En `app/dashboard/page.tsx` (o el componente de dashboard que muestre el empty state), añadir un componente `OnboardingChecklist` que aparezca hasta que los 3 pasos estén completos:

Pasos:
1. **Add your profile info** → link a `/dashboard/settings#profile` (o `?tab=profile`)
2. **Add your first project** → link a `/dashboard/projects/new`
3. **Make your profile public** → toggle directo inline o link a settings

Lógica: consultar Supabase para determinar si hay `full_name` (paso 1), si hay al menos 1 project (paso 2), si `is_public = true` (paso 3). Cada paso completado muestra un checkmark violet. Barra de progreso simple (0/3) en la parte superior del componente.

El componente desaparece cuando los 3 están completos. Guardar en `components/dashboard/OnboardingChecklist.tsx`.

---

## BLOQUE 5 — P2: Copy y CTAs
**Comando:** `/impeccable clarify`

### 5A. Unificar CTAs a "Claim your username"
Reemplazar "Get your profile" por "Claim your username" en:
- `components/landing/Navbar.tsx` — el CTA del nav
- `components/profile/ProfileNavbar.tsx` — el CTA del nav en el perfil público

Todos los CTAs que apunten a `/signup` deben usar el mismo label.

### 5B. Arreglar "See how it works"
En `components/landing/Hero.tsx`, el CTA secundario "See how it works" apunta actualmente a `/signup`. Cambiar a:
```tsx
<a href="#features">See how it works</a>
```
Asegurarse de que la sección `Features` tenga `id="features"` (ya existe según el código actual).

---

## BLOQUE 6 — P2: Layout
**Comando:** `/impeccable layout`

### 6A. Romper el grid de 3 cards iguales en TheProblem
El layout actual `grid-cols-1 md:grid-cols-3` con tres liquid-glass cards idénticas es el patrón más flaggeado.

Reemplazar con layout asimétrico de citas/pull-quotes. El copy es fuerte — no necesita contenedor:
```tsx
<div className="max-w-4xl mx-auto flex flex-col gap-16">
  {problems.map((problem, i) => (
    <div key={i} className={`flex flex-col gap-3 ${i % 2 === 1 ? 'items-end text-right' : ''}`}>
      <p className="font-heading italic text-white text-3xl md:text-4xl leading-tight max-w-2xl">
        "{problem.quote}"
      </p>
      <p className="text-sm text-white/60 font-body">{problem.attribution}</p>
    </div>
  ))}
</div>
```

O alternativamente: mantener una estructura de columna única con tipografía grande, sin cards, con divisores `border-b border-white/5` entre cada punto.

### 6B. Alternar el orden de columnas en Features o TheName
Features: `col-span-5 image left + col-span-7 text right`  
TheName: `col-span-5 image left + col-span-7 text right` (misma estructura, consecutiva)

Cambiar TheName para que el retrato aparezca a la derecha:
```tsx
{/* Left Column: Text */}
<div className="lg:col-span-7 ... order-2 lg:order-1">

{/* Right Column: Portrait */}
<div className="lg:col-span-5 ... order-1 lg:order-2">
```

---

## BLOQUE 7 — P2: Responsive y Accesibilidad estructural
**Comando:** `/impeccable adapt`

### 7A. Mobile nav en la landing page
`components/landing/Navbar.tsx` tiene `hidden md:flex` en el nav pill, lo que deja móvil sin navegación.

Añadir un botón hamburger que aparezca en mobile:
```tsx
<button className="md:hidden" aria-label="Open menu">
  {/* Phosphor icon: List */}
</button>
```
Con un drawer o dropdown que muestre links a `#features`, `#pricing`, y el CTA.

### 7B. Aria-labels en sidebar icons
En `components/dashboard/Sidebar.tsx` (o similar), cada `<Link>` con icon-only necesita:
```tsx
<Link href="/dashboard" aria-label="Dashboard">
  <HouseIcon />
</Link>
```

### 7C. Hero móvil: reducir elementos apilados
El hero actual tiene 6+ elementos apilados antes del primer scroll en móvil. En `components/landing/Hero.tsx`:
- Ocultar la social proof strip en móvil (`hidden sm:flex`)
- Reducir `pt-32` a `pt-20` en móvil
- El preview card puede ocultarse en móvil (`hidden lg:block`) si está dentro del hero

---

## BLOQUE 8 — Final
**Comando:** `/impeccable polish`

### 8A. Detalles menores
- `discover` page: eliminar la atribución duplicada del autor (está en el hover overlay Y debajo de la imagen)
- Landing footer: añadir al menos links a `#features` y `#pricing` y copyright
- `ProfileNarrative`: cambiar `font-heading italic text-2xl` por `text-lg font-body text-white/75 leading-relaxed` — texto de usuario editado no debe estar en serif display
- Verificar que `liquid-glass` en globals.css no esté causando clipping en dropdowns o tooltips (`overflow: hidden`)

---

## Verificación final

Después de todos los bloques:
1. Abrir `http://localhost:3000` y verificar que el hero es visible sin scroll en 375px
2. Tabular por toda la landing con teclado — todos los elementos deben tener focus ring visible
3. Verificar contraste con browser DevTools (Inspect → Accessibility → Contrast)
4. Verificar que no queden instancias de `Instrument_Serif` en el codebase: `grep -r "Instrument_Serif" .`
5. Deploy a Vercel y verificar en p4-ingegno.vercel.app

---

## Qué NO tocar
- Estructura de autenticación y rutas de Supabase
- `access_token` de GitHub — solo server-side
- `SUPABASE_SERVICE_ROLE_KEY` — solo en env vars del servidor
- Features no validadas por usuarios — YAGNI
- Stripe — no activar
