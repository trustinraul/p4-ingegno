# CLAUDE.md — P4 Ingegno

> Contexto operativo para Claude Code. Leer antes de ejecutar cualquier tarea del plan.

---

## Qué es este proyecto

**Ingegno** — Mini SaaS de perfiles públicos premium para "modern polymaths": founders, creadores, builders multi-disciplinares que necesitan un lugar que cuente su trabajo real, no un LinkedIn.

URL objetivo: `ingegno.app/[username]`  
Tagline: *"Your work, finally visible."*

---

## Documentación

| Archivo | Contenido |
|---|---|
| `docs/spec.md` | Spec de diseño completo (decisiones de producto, UX, arquitectura) |
| `docs/plan.md` | Plan de implementación — 15 tareas con código completo |
| `docs/stitch-prompt.md` | Prompt para generar el proyecto base con Google Stitch |
| `docs/research-pain-points.md` | Research de pain points validados de usuarios target |

**Empezar siempre por `docs/plan.md` — es la fuente de verdad para la ejecución.**

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ App Router |
| UI | React + Tailwind CSS |
| Auth + DB | Supabase (`@supabase/ssr`) |
| Storage | Supabase Storage (avatars, update-images) |
| Animaciones | Framer Motion |
| OG Images | `@vercel/og` (edge runtime) |
| Tests | Vitest |
| Deploy | Vercel |

---

## Base de datos — 5 tablas

```
profiles         — usuario, username, tagline, roles[], plan ('free'|'pro'), is_public
projects         — proyectos del usuario, display_order
updates          — actualizaciones por proyecto, con imagen opcional
github_connections — token OAuth de GitHub (owner-only, nunca SELECT público)
github_activity  — commits sincronizados manualmente
```

RLS activado desde el primer día. Ver Task 3 del plan para el SQL completo.

---

## Modelo freemium

- **Free**: creación ilimitada de proyectos. Solo los 2 primeros visibles en perfil público.
- **Pro**: todos los proyectos visibles.
- Lógica centralizada en `lib/plan.ts` — funciones `getVisibleProjects`, `getLockedProjects`.
- **No duplicar estas funciones en `lib/utils.ts`.**

---

## Reglas de seguridad (no negociables)

- `access_token` de GitHub: **nunca en cliente**. Solo usado server-side en Route Handlers.
- `SUPABASE_SERVICE_ROLE_KEY`: solo en variables de entorno de servidor.
- `github_connections`: RLS owner-only — sin SELECT público bajo ningún concepto.
- GitHub sync: **manual** vía botón "Sync now" en Settings. Sin webhooks en MVP.

---

## Convenciones

- App Router siempre. Nunca Pages Router.
- Server Components por defecto. `use client` solo cuando hay estado o interactividad.
- Mutations via **Server Actions** en `app/actions/<domain>.ts`. No API routes para mutations.
- Supabase clients: `lib/supabase/client.ts` (browser) y `lib/supabase/server.ts` (server).
- Vitest config en `vitest.config.ts` — no en `package.json`.
- Commits en inglés: `feat:`, `fix:`, `style:`, `refactor:`, `chore:`, `docs:`

---

## Design system

- **Dark mode first** — fondo `#000`, texto blanco con variantes de opacidad
- **Liquid glass** — clases `.liquid-glass` y `.liquid-glass-strong` (backdrop-filter + border rgba)
- **Tipografía**: Instrument Serif italic para headings, Barlow para body
- **Animaciones**: Framer Motion, `whileInView` para scroll. BlurText word-by-word en hero.
- **Paleta de acento**: `#8B5CF6` (violet-500) para CTAs y highlights

---

## Estructura de carpetas objetivo

```
P4 - Ingegno/
├── CLAUDE.md
├── docs/
│   ├── spec.md
│   ├── plan.md
│   ├── stitch-prompt.md
│   └── research-pain-points.md
├── _resources/
│   └── images/          ← refs visuales, screenshots de inspiración
├── app/
│   ├── (auth)/          ← login, signup
│   ├── (dashboard)/     ← /dashboard y subrutas
│   ├── [username]/      ← perfil público
│   ├── api/
│   │   ├── github/      ← callback + sync
│   │   └── og/          ← OG image edge route
│   ├── actions/         ← Server Actions
│   └── page.tsx         ← landing page
├── components/
│   ├── ui/              ← primitivos (BlurText, icons)
│   ├── landing/         ← secciones de la landing
│   ├── profile/         ← componentes del perfil público
│   └── dashboard/       ← componentes del dashboard
├── lib/
│   ├── supabase/        ← client.ts + server.ts
│   ├── plan.ts          ← lógica freemium
│   ├── types.ts         ← tipos TypeScript
│   └── utils.ts         ← cn(), getDomainFromUrl()
└── __tests__/
    └── plan.test.ts     ← tests de lib/plan.ts
```
