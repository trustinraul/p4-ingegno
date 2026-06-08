# Spec: Ingegno — P4 Mini SaaS
**Fecha:** 2026-05-16  
**Estado:** Aprobado  
**Proyecto:** P4 del portfolio freelance de Raúl  
**Tipo:** Mini SaaS real — con intención de monetización, no solo demo de portfolio

---

## Concepto

**Ingegno** es una plataforma de perfiles públicos premium para "Da Vincis modernos": founders early-stage, student entrepreneurs y creadores multi-disciplinares que tienen múltiples identidades creativas simultáneas y no encuentran herramienta adecuada para presentarlas de forma coherente.

El nombre viene del italiano renacentista: la palabra que usaba Da Vinci para describir la inteligencia creativa que conecta disciplinas distintas. Este origen se explica en el copy de la landing page.

**URL pública:** `ingegno.app/[username]` — una URL shareable que cuenta quién eres, qué construyes y cómo avanzas.

---

## Problema validado

Pain point #1 confirmado en investigación (Indie Hackers, Hacker News, creativesignature.app):

> "So... what exactly do you do?"

El multi-hyphenate no tiene lenguaje ni herramienta para presentar su diversidad de forma coherente. El portfolio parece hecho por tres personas distintas. Los clientes no saben cómo referirte.

**Gap de mercado confirmado:** ninguna herramienta combina diseño visualmente premium + identidad multi-disciplinar coherente + build-in-public dinámico + precio <€20/mes.

Referencia competitiva más cercana: IndieLogs (indielogs.com) — €24 lifetime, 2.156 usuarios, pero diseño no premium y solo indie hackers.

---

## Usuario objetivo

- Founder early-stage o student entrepreneur con múltiples identidades creativas
- Quiere parecer legítimo y construir marca personal
- No puede permitirse herramientas caras o de curva alta (Framer, Webflow)
- Mercado global, inglés
- WTP validado: €9–49/mes
- Canal de adquisición: Instagram/TikTok + Reddit + cold outreach

---

## Stack

Mismo stack que el resto del portfolio — sin excepciones:

| Capa | Tecnología |
|---|---|
| Meta-framework | Next.js 14+ (App Router) |
| UI | React + Tailwind CSS |
| Backend / DB | Supabase (Auth + DB + Storage) |
| Deploy | Vercel |
| UI generation | Google Stitch (página pública) |
| AI tooling | Claude Code + ui-ux-pro-max |

---

## Workflow de construcción

```
Cowork (Jarvis)       →  Stitch            →  Claude Code
Product design             UI/UX premium       Dashboard + Auth
Backend spec               Página pública      GitHub OAuth
Schema                     Componentes         DB + API calls
```

Google Stitch genera todos los componentes de la página pública (hero, narrative, project grid, activity feed). Claude Code construye el dashboard privado, auth, rutas dinámicas y lógica de backend.

---

## Arquitectura

### Rutas principales

```
/                          Landing page (marketing)
/signup                    Registro
/login                     Login
/dashboard                 Dashboard privado (protegido)
/dashboard/profile         Editor de perfil
/dashboard/projects        Gestor de proyectos
/dashboard/updates         Updates manuales
/dashboard/settings        Conexión GitHub, plan, cuenta
/[username]                Página pública (dinámica)
```

### Multi-tenancy

Patrón de rutas dinámicas de Next.js: `app/[username]/page.tsx`. Cada usuario tiene su propio perfil en `ingegno.app/[username]`. Sin subdominios en MVP — dominio custom es feature de V2.

---

## Features del MVP

### Dashboard privado (Claude Code)

- **Editor de perfil:** nombre, foto, tagline, roles (array de strings, ej: "Founder · Designer · Writer"), narrativa (200-250 palabras)
- **Gestor de proyectos (CRUD):** nombre, descripción, estado (in_progress | launched), URL, orden de visualización
- **Updates manuales:** texto + imagen opcional — aparecen en el activity feed público
- **Conexión GitHub:** OAuth opcional pero recomendado — el usuario elige qué repos mostrar, los commits se sincronizan automáticamente al activity feed
- **Toggle "Make public":** controla si el perfil es visible o está en draft

### Página pública (Google Stitch)

- **Hero cinematográfico:** nombre, foto, roles y tagline con tratamiento visual premium (dark, 3D elements, editorial typography)
- **Sección narrativa:** el pitch de quién eres — texto libre 200-250 palabras con diseño editorial
- **Project grid:** grid de proyectos con estado, descripción y link — freemium gate aquí
- **Activity feed:** mezcla cronológica de commits de GitHub y updates manuales

---

## User flows

### Flow 1 — Onboarding
Landing → Sign up (email o GitHub) → Claim username → Dashboard (perfil vacío listo)

### Flow 2 — Configurar perfil
1. Identidad: nombre, foto, tagline, roles
2. Narrativa: pitch de 200-250 palabras
3. Proyectos: mínimo 1 para poder publicar
4. Conectar GitHub (opcional, saltable — se puede hacer después desde Settings)

### Flow 3 — Publicar
Perfil guardado → toggle "Make public" → `ingegno.app/username` live → copy link + og:image para compartir

### Flow 4 — Build in public
Dashboard → "+ New update" → texto + imagen opcional → aparece en activity feed público

---

## Data architecture (Supabase)

### Tabla `profiles`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | FK a auth.users |
| username | text | unique |
| full_name | text | |
| tagline | text | |
| roles | text[] | array de strings |
| narrative | text | max ~250 palabras |
| avatar_url | text | Supabase Storage |
| is_public | boolean | default false |
| plan | enum | free \| pro |

### Tabla `projects`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK profiles |
| name | text | |
| description | text | |
| status | enum | in_progress \| launched |
| url | text | |
| display_order | int | |
| created_at | timestamptz | |

### Tabla `updates`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK profiles |
| project_id | uuid | FK projects · nullable |
| content | text | |
| image_url | text | nullable |
| created_at | timestamptz | |

### Tabla `github_connections` (opcional)
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK profiles |
| github_username | text | |
| access_token | text | encrypted — solo server-side |
| repos_to_show | text[] | repos seleccionados |
| last_synced_at | timestamptz | |

### Tabla `github_activity` (caché, opcional)
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK profiles |
| repo_name | text | |
| commit_message | text | |
| commit_sha | text | |
| committed_at | timestamptz | |

### Row Level Security
- `profiles`, `projects`, `updates`, `github_activity`: SELECT público si `is_public = true` OR `auth.uid() = user_id`
- `github_connections`: solo propietario — tokens nunca expuestos a queries públicas
- `access_token` gestionado server-side únicamente — nunca en el bundle del cliente

---

## Monetización

### Plan Free (€0 para siempre)
- 1 username · página pública
- Hasta 2 proyectos visibles
- Updates manuales ilimitados
- Conexión GitHub (opcional)
- Badge "Made with Ingegno" en la página pública

### Plan Pro (€9/mes o €79/año)
- Todo lo de Free
- Proyectos ilimitados — **este es el principal trigger de conversión**
- Sin badge "Made with Ingegno"
- Prioridad en soporte
- Dominio custom (V2)
- Analytics de visitas (V2)

### Estrategia de lanzamiento
1. Lanzar sin Stripe — funcionalidad completa gratis durante 2-4 semanas de validación
2. Recoger feedback real: ¿qué echan en falta? ¿qué pagarían?
3. Activar freemium gate (2 proyectos) y añadir Stripe solo con señal clara de willingness to pay

### Objetivos iniciales
- 50 usuarios free en mes 1
- 10 conversiones Pro en mes 2-3
- €90 MRR como primer hito

---

## Diseño visual

La página pública es el producto. El diseño debe ser visualmente premium por encima de cualquier otro proyecto del portfolio:

- Dark mode first
- Elementos 3D y efectos tipográficos editoriales (Google Stitch)
- Liquid glass / glassmorphism como lenguaje visual
- Tipografía editorial — máximo 2 familias, elegidas con Stitch
- Animaciones con Framer Motion — sutiles, cinematográficas, no decorativas
- og:image generada para cada perfil (para compartir en redes)

---

## Copy de la landing page

Entre los textos del copy profesional debe incluirse un bloque que explique el origen del nombre Ingegno: la palabra que usaba Leonardo da Vinci para describir la inteligencia creativa que conecta disciplinas distintas. Es el hilo conductor conceptual del producto y debe aparecer en la landing.

---

## Lo que queda fuera del MVP

| Feature | Motivo |
|---|---|
| Dominio personalizado | Complejidad de DNS management — V2 |
| X / Twitter | API cuesta €100/mes — inviable |
| Substack / RSS | Nice to have — V2 |
| Analytics de visitas | V2 |
| Widget embebible | V2 — standalone first, embed después como nueva ruta |
| Múltiples temas visuales | V2 |
| Feed social / follows | Fuera de scope de herramienta de perfil |
| Stripe | No hasta validar willingness to pay |

---

## Criterios de "proyecto terminado"

Mismos criterios globales del portfolio, más:

- [ ] Perfil público funcional en `ingegno.app/[username]` con diseño premium
- [ ] Dashboard privado completo (perfil, proyectos, updates, settings)
- [ ] Auth flow completo (signup, login, logout, sesión persistente)
- [ ] GitHub OAuth funcional — conector opcional, flujo sin él también funcional
- [ ] Freemium gate activo (2 proyectos en free)
- [ ] og:image generada por perfil
- [ ] README en inglés con screenshots del perfil público y del dashboard

---

## Notas de implementación

- Construcción arranca con `/writing-plans` después de aprobar este spec
- Google Stitch genera la UI de la página pública y la landing — prompt completo en `docs/superpowers/specs/2026-05-16-ingegno-stitch-prompt.md`
- `access_token` de GitHub: nunca en cliente, solo usado server-side en Route Handlers o Server Actions
- `github_activity` es caché — se popula en background, no en page load
- **GitHub sync en MVP:** sincronización manual vía botón "Sync" en Settings, no webhooks en tiempo real. Los webhooks son complejidad innecesaria para validar el producto.
- **og:image:** generada con `@vercel/og` — Route Handler en `/api/og/[username]` que renderiza una imagen server-side con el nombre, tagline y roles del perfil. ~2-3h de trabajo, incluida en scope del MVP.
- **Landing page:** ruta `/` diseñada con Stitch, igual que la página pública. Incluye copy profesional con la sección del origen del nombre Ingegno. Forma parte del MVP — es la primera impresión del producto.
- RLS activado desde el primer día (igual que P3)
- `service_role_key` solo en variables de entorno de servidor — nunca expuesto al cliente
