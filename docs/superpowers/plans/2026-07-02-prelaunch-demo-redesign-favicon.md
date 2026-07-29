# Pre-Launch: Demo Profile + Redesign Verification + Favicon — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar los 3 bloqueantes de lanzamiento antes del 3 jul 2026: crear el perfil demo `ingegno.app/leonardo` en producción, verificar el redesign en vivo (teclado + contraste + Lighthouse), y sustituir el favicon por defecto de Next.js por el de marca.

**Architecture:** Objetivo 1 se resuelve con un seed script idempotente (`scripts/seed-demo-profile.ts`) que usa el admin API de Supabase con service role: crea el usuario auth, sube imágenes a Storage e inserta perfil/proyectos/updates. Objetivo 2 es verificación sobre producción (ingegno.app) con fixes aplicados en código. Objetivo 3 usa `ImageResponse` de `next/og` (mismo patrón que el `opengraph-image.tsx` existente) para generar `app/icon.tsx` y `app/apple-icon.tsx`.

**Tech Stack:** Next.js 14+ App Router, Supabase (`@supabase/supabase-js` admin client), Supabase Storage (buckets `avatars` y `project-images`, públicos), `next/og` ImageResponse, Lighthouse CLI, tsx.

**Deadline:** TODO antes del 3 jul (mañana). Prioridad: Fase 1 hoy mismo.

---

## Contexto verificado (2 jul 2026, BD de producción `qnryfbyjxzjkmslynnto`)

Hechos comprobados hoy — el ejecutor NO necesita re-verificarlos, pero sí conocerlos:

- `profiles` tiene 1 fila (`trustinraul`, `is_public=false`). El perfil `leonardo` **no existe** → `ingegno.app/leonardo` da 404. Confirmado.
- `profiles.id` tiene **FK a `auth.users.id`** → no se puede insertar un perfil sin crear antes un usuario auth.
- **No hay trigger** `handle_new_user`: el perfil lo inserta la app en signup (`app/actions/auth.ts:46`). Un seed por SQL debe insertar el perfil explícitamente.
- Schema `profiles`: `id, username, full_name, tagline, roles text[], narrative, avatar_url, is_public bool, plan ('free'|'pro'), links jsonb (default '[]'), contact_email, welcome_email_sent_at, created_at`.
- Schema `projects`: `id, user_id, name, description, status ('in_progress'|'launched'), url, display_order int, cover_image_url, created_at`.
- Schema `updates`: `id, user_id, project_id (nullable), content, image_url, created_at`.
- Links shape (lib/types.ts): `{ type: 'github'|'x'|'linkedin'|'instagram'|'youtube'|'website'|'custom', label: string, url: string }`, máx 8 (`lib/links.ts: MAX_LINKS`).
- Buckets Storage: `avatars` y `project-images`, ambos públicos, convención de path `${userId}/archivo` (ver `app/actions/account.ts:17`).
- El perfil público (`app/[username]/page.tsx`) renderiza: ProfileHero (avatar, tagline, roles), ProfileNarrative, ProjectGrid (recibe `plan` — free limita visibilidad), ActivityFeed (updates + github mezclados, límite 20), ProfileFooter (badge "Made with Ingegno" si plan free).
- Assets Da Vinci ya descargados y en dominio público en `_resources/brand/`: `davinci_vitruvian_man.jpg` (1400×1903), `davinci_notebook_anatomy.jpg` (1168×1676), `davinci_codex_flight.jpg` (700×548), `davinci_self_portrait.jpg` (420×659). También duplicados en `public/images/`.
- 🐛 **Bug encontrado:** `app/layout.tsx:21` → `metadataBase: new URL('https://p4-ingegno.vercel.app')`. Con el dominio ya en vivo, los og:image y URLs canónicas apuntan al dominio Vercel. Se corrige en Task 6.
- Favicon actual: `app/favicon.ico` (default de Next.js). No hay favicon en `public/`.
- `package.json` no tiene script de seed; tests con `vitest run`.

## Decisión resuelta: vía de creación del perfil demo

**Opción (a) — registro por la app + rellenar por dashboard:** ejercita el flow real (incluido welcome email), pero es 100% manual, no reproducible, no ejecutable por Claude Code, y `plan='pro'` no se puede poner desde el dashboard (no hay Stripe) → requiere SQL igualmente. Tampoco permite backdatear los updates (saldrían 3 updates con el mismo minuto, cantoso en un feed "build in public").

**Opción (b) — seed script con service role (RECOMENDADA):** un solo comando, idempotente (re-ejecutable si algo falla), ejecutable por Claude Code, versionado en el repo, permite `plan='pro'` y backdatear updates. El welcome email no se dispara (el signup de la app no se ejecuta) — irrelevante para una persona ficticia, y el flow de welcome email ya está probado con `trustinraul`.

**Se implementa (b).** (a) queda como fallback manual si el script diera problemas: signup en ingegno.app/signup con `rcalvosanz+leonardo@gmail.com`, rellenar dashboard, y ejecutar a mano los UPDATE de `plan` y `created_at` del Task 3.

## Decisiones abiertas (defaults elegidos — cambiar antes de ejecutar si no convencen)

1. **`contact_email` del demo:** default `rcalvosanz+leonardo@gmail.com` (recibe correo real en tu inbox; el botón "Get in touch" funciona de verdad). Alternativa: configurar forward `hello@ingegno.app` — más limpio pero requiere infra de email que no existe hoy.
2. **URLs de proyectos:** default `null` (los proyectos de una persona ficticia no pueden enlazar a sitios que 404ean el día 1). Alternativa descartada: enlazar a repos falsos.
3. **Links sociales:** default 2 links reales que cargan y refuerzan la identidad renacentista (archivo digital de Da Vinci + Wikimedia). Alternativa: dejar `links=[]`.
4. **Favicon:** default `ImageResponse` con Instrument Serif italic real (fidelidad total de marca, mismo patrón que `opengraph-image.tsx`). Alternativa: SVG estático con paths geométricos (cero runtime, menos fiel).

---

# FASE 1 — Perfil demo `leonardo` (BLOQUEANTE — ejecutar HOY)

### Task 1: Seed script con contenido completo

**Files:**
- Create: `scripts/seed-demo-profile.ts`

- [ ] **Step 1: Verificar que las env vars existen**

Run: `grep -c "SUPABASE_SERVICE_ROLE_KEY\|NEXT_PUBLIC_SUPABASE_URL" .env.local`
Expected: `2` (o más). Si falta `SUPABASE_SERVICE_ROLE_KEY`, cópiala del dashboard de Supabase (Settings → API) a `.env.local`. NUNCA commitearla.

- [ ] **Step 2: Verificar que tsx está disponible**

Run: `npx tsx --version`
Expected: versión impresa (lo descarga si no está). No añadirlo a dependencies — se usa vía npx.

- [ ] **Step 3: Crear `scripts/seed-demo-profile.ts` con este contenido exacto**

```ts
/**
 * Seed del perfil demo "leonardo" en producción.
 * Idempotente: re-ejecutable sin duplicar datos.
 *
 * Uso: npx tsx --env-file=.env.local scripts/seed-demo-profile.ts
 */
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

const USERNAME = 'leonardo'
const DEMO_EMAIL = 'rcalvosanz+leonardo@gmail.com'

async function getOrCreateUserId(): Promise<string> {
  const { data: existing, error } = await admin
    .from('profiles')
    .select('id')
    .eq('username', USERNAME)
    .maybeSingle()
  if (error) throw error
  if (existing) {
    console.log('Profile row already exists, reusing user', existing.id)
    return existing.id
  }
  const { data, error: createError } = await admin.auth.admin.createUser({
    email: DEMO_EMAIL,
    // Nadie necesita loguearse como leonardo; recuperable vía reset de email si hiciera falta.
    password: `${randomUUID()}Aa1!`,
    email_confirm: true,
  })
  if (createError) throw createError
  console.log('Created auth user', data.user.id)
  return data.user.id
}

async function uploadImage(bucket: string, path: string, localPath: string): Promise<string> {
  const file = await readFile(localPath)
  const { error } = await admin.storage
    .from(bucket)
    .upload(path, file, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  const { data } = admin.storage.from(bucket).getPublicUrl(path)
  console.log('Uploaded', bucket, path)
  return data.publicUrl
}

async function main() {
  const userId = await getOrCreateUserId()

  const avatarUrl = await uploadImage(
    'avatars', `${userId}/avatar.jpg`, '_resources/brand/davinci_self_portrait.jpg')
  const coverCodice = await uploadImage(
    'project-images', `${userId}/codice-cover.jpg`, '_resources/brand/davinci_notebook_anatomy.jpg')
  const coverOrnithopter = await uploadImage(
    'project-images', `${userId}/ornithopter-cover.jpg`, '_resources/brand/davinci_codex_flight.jpg')
  const coverProportions = await uploadImage(
    'project-images', `${userId}/proportions-cover.jpg`, '_resources/brand/davinci_vitruvian_man.jpg')

  const { error: profileError } = await admin.from('profiles').upsert({
    id: userId,
    username: USERNAME,
    full_name: 'Leonardo Bianchi',
    tagline: "I design interfaces, build flying machines, and draw what I can't build yet.",
    roles: [
      'Product Designer',
      'Creative Technologist',
      'Illustrator',
      'Drone Builder',
      'Writer',
      'Indie Maker',
    ],
    narrative: `I was told, repeatedly, to pick a lane. Design or engineering. Art or code. I tried — it didn't take.

By day I design product interfaces for early-stage teams. Evenings belong to the workshop: for the past two years I've been building flapping-wing aircraft from carbon rod, mylar, and the occasional broken promise. In between, I draw. The posters started as proportion studies for a client's brand and became a small printed series of their own.

None of this is a pivot. It's one practice with different instruments. The sketches inform the interfaces, the machines discipline the sketches, and the writing keeps all of it honest. This page is where the whole thing finally lives in one place — which, until now, it never did.`,
    avatar_url: avatarUrl,
    contact_email: DEMO_EMAIL,
    links: [
      { type: 'website', label: 'Digital archive', url: 'https://www.leonardodigitale.com' },
      { type: 'custom', label: 'Sketchbook shelf', url: 'https://commons.wikimedia.org/wiki/Leonardo_da_Vinci' },
    ],
    plan: 'pro',
    is_public: true,
  })
  if (profileError) throw profileError
  console.log('Profile upserted')

  // Idempotencia: borrar contenido previo del demo antes de insertar
  await admin.from('updates').delete().eq('user_id', userId)
  await admin.from('projects').delete().eq('user_id', userId)

  const { error: projectsError } = await admin.from('projects').insert([
    {
      user_id: userId,
      name: 'Codice',
      description:
        'An open-source digital notebook that treats sketches, notes, and code as one connected surface. No folders, no modes — just pages that link. Built because every tool I tried made me choose what kind of thinking I was allowed to do.',
      status: 'launched',
      url: null,
      display_order: 0,
      cover_image_url: coverCodice,
    },
    {
      user_id: userId,
      name: 'Ornithopter No. 4',
      description:
        'A flapping-wing aircraft built from carbon rod and mylar, designed entirely in my notebooks first. Numbers one through three hang on the wall as reminders. This one flew forty-one seconds last week.',
      status: 'in_progress',
      url: null,
      display_order: 1,
      cover_image_url: coverOrnithopter,
    },
    {
      user_id: userId,
      name: 'Proportion Studies',
      description:
        'A printed poster series translating classical proportion systems — Vitruvius, the golden section, musical ratios — into contemporary typography. Edition of fifty, numbered by hand.',
      status: 'launched',
      url: null,
      display_order: 2,
      cover_image_url: coverProportions,
    },
  ])
  if (projectsError) throw projectsError
  console.log('Projects inserted')

  const { error: updatesError } = await admin.from('updates').insert([
    {
      user_id: userId,
      content:
        'Ornithopter No. 4 survived its first sustained flight today — 41 seconds. The wing linkage finally holds under load. Filming the next test.',
      created_at: '2026-06-14T18:20:00Z',
    },
    {
      user_id: userId,
      content:
        'Codice v0.3 is out: linked sketches now render inline inside notes. Small feature, huge difference in how it feels to think in it.',
      created_at: '2026-06-23T09:45:00Z',
    },
    {
      user_id: userId,
      content:
        'Started sketching a fifth wing design between client work. Lighter spar, longer stroke. Old notebooks keep paying rent.',
      created_at: '2026-06-30T21:10:00Z',
    },
  ])
  if (updatesError) throw updatesError
  console.log('Updates inserted')

  console.log('\n✅ Done → https://ingegno.app/leonardo')
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
```

Notas para el ejecutor:
- El copy de arriba es FINAL (tono premium renacimiento+tech, en inglés). No parafrasear ni "mejorar".
- `roles` son 6 (límite 10). `links` son 2 (límite 8) y ambas URLs cargan de verdad.
- `plan: 'pro'` a propósito: sin badge "Made with Ingegno" y los 3 proyectos visibles sin gate free (el gate free muestra 2).
- `url: null` en proyectos a propósito (decisión abierta nº 2): cero enlaces muertos el día del lanzamiento.
- `updates.created_at` backdatado a propósito para que el feed parezca build-in-public real.

- [ ] **Step 4: Ejecutar el seed contra producción**

Run: `npx tsx --env-file=.env.local scripts/seed-demo-profile.ts`
Expected: logs `Created auth user`, 4× `Uploaded`, `Profile upserted`, `Projects inserted`, `Updates inserted`, `✅ Done`.
Si `--env-file` no está soportado por tu versión de Node (<20.6): exportar las dos vars a mano en la shell y ejecutar sin el flag.

- [ ] **Step 5: Verificar en BD (vía Supabase MCP `execute_sql` o SQL editor)**

```sql
SELECT p.username, p.is_public, p.plan,
       array_length(p.roles, 1) AS roles,
       jsonb_array_length(p.links) AS links,
       (SELECT count(*) FROM projects  WHERE user_id = p.id) AS projects,
       (SELECT count(*) FROM projects  WHERE user_id = p.id AND cover_image_url IS NOT NULL) AS covers,
       (SELECT count(*) FROM updates   WHERE user_id = p.id) AS updates
FROM profiles p WHERE p.username = 'leonardo';
```

Expected: `leonardo | true | pro | 6 | 2 | 3 | 3 | 3`

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-demo-profile.ts
git commit -m "feat: add demo profile seed script (leonardo)"
```

### Task 2: Verificación visual del perfil en producción

**Files:** ninguno (verificación).

- [ ] **Step 1: Verificar que la URL carga (no 404)**

Run: `curl -s -o /dev/null -w "%{http_code}" https://ingegno.app/leonardo`
Expected: `200`

- [ ] **Step 2: Revisión visual en desktop**

Abrir `https://ingegno.app/leonardo` en el navegador. Checklist:
- Hero: avatar (autorretrato Da Vinci), nombre "Leonardo Bianchi", tagline, los 6 roles renderizados
- Narrative: 3 párrafos, sin overflow ni saltos raros
- ProjectGrid: 3 proyectos, cada uno con imagen de portada cargada, sin gate/badge de plan free
- ActivityFeed: 3 updates con fechas del 14, 23 y 30 de junio (orden descendente)
- Footer: SIN badge "Made with Ingegno" (plan pro)
- "Get in touch" visible + 2 links sociales que abren y cargan

- [ ] **Step 3: Revisión móvil a 375px**

DevTools → responsive 375px. Checklist: sin overflow horizontal, imágenes de portada no deformadas, roles envuelven bien, links pulsables.

- [ ] **Step 4: Verificar og:image**

Run: `curl -s -o /dev/null -w "%{http_code}" https://ingegno.app/api/og/leonardo`
Expected: `200`. Después pegar `https://ingegno.app/leonardo` en https://www.opengraph.xyz o el validador de X/LinkedIn y comprobar que la card muestra nombre y tagline.

- [ ] **Step 5: Enviar un mensaje de prueba por "Get in touch"**

Usar el botón/email de contacto del perfil y comprobar que llega a `rcalvosanz@gmail.com` (alias `+leonardo`).

### Task 3: Actualizar CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

> Nota: Jarvis (Cowork) ya aplicó el 2 jul la corrección del estado FALSO ("Perfil de demo publicado ✅") y del estado del dominio. Este task es el cierre: tras completar Tasks 1-2, mover "Crear perfil demo leonardo" de Pendiente a Completado en CLAUDE.md, con fecha.

- [ ] **Step 1: Editar la sección "Completado ✅" / "Pendiente antes del lanzamiento"**

Mover la línea del perfil demo a Completado: `- Perfil demo ingegno.app/leonardo creado en producción y verificado (desktop + 375px + og:image) ✅ (fecha)`

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: mark demo profile as shipped in CLAUDE.md"
```

---

# FASE 2 — Verificación final del redesign (depende de Fase 1 para /leonardo)

### Task 4: Fix de `metadataBase` (bug SEO encontrado en la auditoría previa)

**Files:**
- Modify: `app/layout.tsx:21`

- [ ] **Step 1: Corregir el dominio**

En `app/layout.tsx`, cambiar:

```ts
metadataBase: new URL('https://p4-ingegno.vercel.app'),
```

por:

```ts
metadataBase: new URL('https://ingegno.app'),
```

- [ ] **Step 2: Buscar otras referencias hardcodeadas al dominio Vercel**

Run: `grep -rn "p4-ingegno.vercel.app" app/ components/ lib/ public/ README.md`
Expected: solo referencias en docs/README (aceptables). Si aparece alguna en `app/`, `components/` o `lib/`, sustituirla por `https://ingegno.app` con el mismo patrón.

- [ ] **Step 3: Build local para confirmar que nada rompe**

Run: `npm run build`
Expected: build sin errores.

- [ ] **Step 4: Commit y deploy**

```bash
git add app/layout.tsx
git commit -m "fix: point metadataBase to ingegno.app production domain"
git push
```

Vercel despliega en el push. Verificar después: `curl -s https://ingegno.app/leonardo | grep -o 'og:image[^>]*'` → la URL del og:image debe empezar por `https://ingegno.app`.

### Task 5: Auditoría de contraste (WCAG) sobre texto de baja opacidad

**Files:**
- Modify: los que salgan del grep (esperables: `components/profile/*.tsx`, `components/dashboard/*.tsx`, `app/page.tsx`)

Referencia exacta — blanco con opacidad sobre fondo negro puro (#000), ratios calculados:

| Clase | Ratio | Texto normal (≥4.5:1) | Texto grande ≥24px o ≥18.7px bold (≥3:1) |
|---|---|---|---|
| `text-white/30` | 2.5:1 | ❌ | ❌ |
| `text-white/40` | 3.7:1 | ❌ | ✅ |
| `text-white/50` | 5.3:1 | ✅ | ✅ |
| `text-white/60` | 7.4:1 | ✅ | ✅ |

Regla de fix: texto normal → mínimo `text-white/50`; texto grande → mínimo `text-white/40`; `text-white/30` solo para elementos decorativos no textuales (divisores, iconos decorativos).

- [ ] **Step 1: Inventariar usos**

Run: `grep -rn "text-white/30\|text-white/40\|text-white/35\|text-white/45" app/ components/ --include="*.tsx"`

- [ ] **Step 2: Clasificar cada hit**

Para cada resultado, anotar en el doc de hallazgos (Task 8): ¿es texto legible por el usuario o decoración? ¿Tamaño normal o grande? → falla/pasa según la tabla.

- [ ] **Step 3: Aplicar fixes**

Subir opacidad según la regla (ej. `text-white/40` en un párrafo body → `text-white/50`). NO tocar decorativos. Mantener jerarquía visual: si todo sube a /50, revisar que los niveles sigan diferenciados (ej. primario /90, secundario /60, terciario /50).

- [ ] **Step 4: Verificar visualmente que el dark premium no se aplana**

`npm run dev` → revisar landing, perfil leonardo y dashboard. El look liquid-glass debe mantenerse.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix(a11y): raise low-opacity text to WCAG AA contrast"
```

### Task 6: Auditoría de teclado (manual, en producción tras el deploy de Task 5)

**Files:** ninguno directo; los fixes que salgan se anotan en el doc de hallazgos (Task 8) y se aplican como micro-commits.

- [ ] **Step 1: Recorrido con Tab en cada página**

Páginas: `/`, `/login`, `/signup`, `/discover`, `/leonardo`, `/dashboard` (logueado con trustinraul).
Por página: `Tab` desde el principio → el orden sigue el orden visual; `Shift+Tab` invierte; ningún elemento interactivo es inalcanzable ni hay trampas de foco.

- [ ] **Step 2: Foco visible en TODOS los interactivos**

En cada parada del Tab debe verse un anillo de foco (el redesign añadió `focus-visible`). Anotar cualquier interactivo sin indicador visible (típicos culpables: links de iconos sociales, cards clicables, botón de QR/share).

- [ ] **Step 3: Login/signup solo con teclado**

Completar login y signup enteros sin ratón: rellenar campos, enviar con Enter, navegar errores de validación. Ambos flujos deben ser completables.

- [ ] **Step 4: Modales y Escape**

Abrir cada modal/overlay (share/QR del perfil, confirmación de borrado de cuenta, banners del dashboard): `Esc` cierra, el foco queda atrapado dentro mientras está abierto y vuelve al trigger al cerrar.

- [ ] **Step 5: Registrar hallazgos**

Cada problema → entrada en el doc de hallazgos (Task 8) con página, elemento, y severidad (P0 = bloquea uso por teclado, P1 = foco invisible, P2 = orden subóptimo).

### Task 7: Lighthouse (móvil + escritorio) + consola

**Files:** reports en `docs/dev/lighthouse/` (gitignorados o commiteados, a criterio; recomendado commitear solo el resumen en el doc de hallazgos).

Metas: **Accessibility ≥ 95** (mínimo 90), **SEO ≥ 95** en páginas públicas, Performance ≥ 80 móvil / ≥ 90 desktop, Best Practices ≥ 90, **0 errores de consola**.

- [ ] **Step 1: Ejecutar Lighthouse CLI sobre las páginas públicas**

```bash
mkdir -p docs/dev/lighthouse
for path in "" "login" "signup" "discover" "leonardo"; do
  name=${path:-home}
  npx lighthouse "https://ingegno.app/$path" \
    --output html --output-path "docs/dev/lighthouse/$name-mobile.html" \
    --only-categories=performance,accessibility,best-practices,seo \
    --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless"
  npx lighthouse "https://ingegno.app/$path" \
    --output html --output-path "docs/dev/lighthouse/$name-desktop.html" \
    --only-categories=performance,accessibility,best-practices,seo \
    --preset=desktop --quiet --chrome-flags="--headless"
done
```

Expected: 10 reports HTML generados.

- [ ] **Step 2: Dashboard (requiere sesión) vía DevTools**

Lighthouse CLI no tiene sesión. Logueado como trustinraul: DevTools → pestaña Lighthouse → run móvil y desktop sobre `/dashboard`. Guardar los dos scores.

- [ ] **Step 3: SEO específico del perfil público**

En el report de `/leonardo` verificar además: `<title>` = "Leonardo Bianchi — Ingegno", meta description = tagline, og:image resuelve bajo ingegno.app (Task 4), y la página es indexable (sin `noindex`).

- [ ] **Step 4: Consola limpia**

En cada una de las 6 páginas, abrir DevTools Console con la página recién cargada + tras interactuar (abrir modal, hover en cards). Expected: 0 errores (warnings de terceros anotarlos pero no bloquean).

- [ ] **Step 5: Volcar scores y hallazgos al doc del Task 8**

### Task 8: Documento de hallazgos priorizado + aplicación de fixes

**Files:**
- Create: `docs/dev/verification-2026-07.md`
- Modify: los archivos que dicten los hallazgos P0/P1

- [ ] **Step 1: Crear el doc con esta estructura**

```markdown
# Verificación redesign en producción — julio 2026

## Scores Lighthouse (fecha)
| Página | Perf M | Perf D | A11y | BP | SEO |
|---|---|---|---|---|---|
| / | | | | | |
| /login | | | | | |
| /signup | | | | | |
| /discover | | | | | |
| /leonardo | | | | | |
| /dashboard | | | | | |

## Hallazgos
| # | Severidad | Página | Problema | Fix | Estado |
|---|---|---|---|---|---|

Severidades: P0 = bloquea lanzamiento (romperlo por teclado, A11y <90, error de consola en flujo core) · P1 = arreglar antes del 15 jul · P2 = post-launch backlog.
```

- [ ] **Step 2: Aplicar todos los P0 y P1**

Un commit por fix o grupo coherente de fixes: `fix(a11y): <qué>`. Los P2 se quedan documentados para post-launch — NO arreglarlos ahora (deadline).

- [ ] **Step 3: Re-ejecutar Lighthouse en las páginas tocadas**

Repetir el comando del Task 7 Step 1 solo para las páginas con fixes. Expected: A11y ≥ 90-95 en todas.

- [ ] **Step 4: Commit del doc**

```bash
git add docs/dev/verification-2026-07.md
git commit -m "docs: production verification findings and fixes (jul 2026)"
```

---

# FASE 3 — Favicon de marca

### Task 9: Favicon con ImageResponse (Instrument Serif "I" violeta sobre oscuro)

**Files:**
- Create: `app/fonts/InstrumentSerif-Italic.ttf`
- Create: `app/icon.tsx`
- Create: `app/apple-icon.tsx`
- Delete: `app/favicon.ico`

Concepto: monograma "I" en Instrument Serif italic, violeta `#8B5CF6` sobre `#0A0A0A`. A 16px el glifo ocupa ~80% de la altura → legible. Contraste violeta/negro ≈ 5:1. Mismo patrón `ImageResponse` que el `app/opengraph-image.tsx` existente.

- [ ] **Step 1: Descargar la fuente al repo**

```bash
mkdir -p app/fonts
curl -L -o app/fonts/InstrumentSerif-Italic.ttf \
  "https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Italic.ttf"
```

Run: `ls -la app/fonts/` → el .ttf debe pesar >40KB (si pesa <1KB es un error HTML, revisar la URL en github.com/google/fonts/tree/main/ofl/instrumentserif).

- [ ] **Step 2: Crear `app/icon.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const font = await fetch(
    new URL('./fonts/InstrumentSerif-Italic.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontFamily: 'Instrument Serif',
            fontStyle: 'italic',
            fontSize: 27,
            color: '#8B5CF6',
            lineHeight: 1,
            marginTop: -3,
          }}
        >
          I
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Instrument Serif', data: font, style: 'italic' as const }],
    }
  )
}
```

- [ ] **Step 3: Crear `app/apple-icon.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const font = await fetch(
    new URL('./fonts/InstrumentSerif-Italic.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Sin borderRadius: iOS aplica su propia máscara
          background: '#0A0A0A',
        }}
      >
        <div
          style={{
            fontFamily: 'Instrument Serif',
            fontStyle: 'italic',
            fontSize: 132,
            color: '#8B5CF6',
            lineHeight: 1,
            marginTop: -10,
          }}
        >
          I
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Instrument Serif', data: font, style: 'italic' as const }],
    }
  )
}
```

- [ ] **Step 4: Borrar el favicon por defecto**

```bash
git rm app/favicon.ico
```

(Imprescindible: si `app/favicon.ico` sigue existiendo, el navegador lo prefiere sobre `/icon`.)

- [ ] **Step 5: Verificar en local**

```bash
npm run dev
```

Run: `curl -s -o /dev/null -w "%{http_code} %{content_type}" http://localhost:3000/icon`
Expected: `200 image/png`. Repetir con `/apple-icon`. Abrir `http://localhost:3000/icon` en el navegador y comprobar a simple vista: "I" violeta legible, sin recortes.

- [ ] **Step 6: Ajuste fino de legibilidad a 16px**

Con la pestaña del dev server abierta, mirar el favicon real en la pestaña (16px). Si la "I" se ve débil: subir `fontSize` a 29-30 o el color a `#A78BFA` (violet-400, más luminoso). Un solo ciclo de ajuste, no perfeccionismo — deadline.

- [ ] **Step 7: Commit y deploy**

```bash
git add app/icon.tsx app/apple-icon.tsx app/fonts/InstrumentSerif-Italic.ttf
git commit -m "feat: brand favicon (Instrument Serif monogram) replacing Next.js default"
git push
```

- [ ] **Step 8: Verificar en producción**

- `curl -s -o /dev/null -w "%{http_code}" https://ingegno.app/icon` → `200`
- Abrir ingegno.app en ventana de incógnito (los favicons se cachean agresivamente) → pestaña con la "I" violeta
- Añadir a favoritos → icono correcto
- En iOS/Android: "Añadir a pantalla de inicio" → apple-icon correcto

---

## Criterios de éxito (resumen por objetivo)

| Objetivo | Criterio | Verificación |
|---|---|---|
| 1 — Demo | `ingegno.app/leonardo` → 200, perfil rico (3 proyectos con covers, 6 roles, 3 updates, 2 links, sin badge), bien a 375px | Task 2 completa; SQL del Task 1 Step 5 devuelve `leonardo · true · pro · 6 · 2 · 3 · 3 · 3` |
| 2 — Redesign | Doc `docs/dev/verification-2026-07.md` con scores + hallazgos; P0/P1 arreglados; A11y ≥ 90-95 en las 6 páginas; 0 errores de consola; og bajo ingegno.app | Tasks 4-8 completas; re-run Lighthouse verde |
| 3 — Favicon | "I" violeta en pestaña, favoritos y home screen móvil; `app/favicon.ico` eliminado | Task 9 Step 8 completo |

## Orden de ejecución y dependencias

```
Task 1 → Task 2 → Task 3          (Fase 1, BLOQUEANTE, hoy)
Task 4 (independiente, hoy)
Task 5 → deploy → Task 6, Task 7 → Task 8   (Fase 2; Tasks 6-7 necesitan /leonardo en vivo)
Task 9 (independiente; puede ir en paralelo a Fase 2)
```

Si el tiempo aprieta antes del 3 jul, el orden de sacrificio es: Task 8 P2s (ya excluidos) → afinado del favicon (Step 6) → nada más. Tasks 1, 2, 4 y 9 no son negociables.

