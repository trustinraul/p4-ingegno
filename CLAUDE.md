# CLAUDE.md — Ingegno

> Contexto de producto para sesiones de Cowork (Jarvis).
> Leer completo al inicio de cada sesión antes de actuar.

---

## Qué es Ingegno

Plataforma de perfiles públicos premium para "Da Vincis modernos": founders
early-stage, student entrepreneurs y creadores multi-disciplinares que tienen
múltiples identidades creativas y no encuentran herramienta para presentarlas
de forma coherente.

El nombre viene del italiano renacentista: la palabra que usaba Leonardo da Vinci
para describir la inteligencia creativa que conecta disciplinas distintas.

**URL pública:** `ingegno.app/[username]`  
**Tagline:** *"Your work, finally visible."*  
**Repo:** [trustinraul/p4-ingegno](https://github.com/trustinraul/p4-ingegno)  
**Deploy:** [p4-ingegno.vercel.app](https://p4-ingegno.vercel.app)

---

## Estado actual — 8 junio 2026

**Fase activa:** Pendiente de lanzamiento → Marketing y validación (desde ~27 jun 2026)

**Timeline de lanzamiento:**
- Sem 0 (prep): 20–27 jun → finalizar contenido, preparar outreach, setup IH/Reddit
- Sem 1 (launch): 27 jun – 4 jul → publicar post, 50 outreaches, Reel 1

### Completado ✅
- Build completo: auth, dashboard, perfil público, GitHub OAuth, freemium gate, og:image
- Security audit: API keys, sanitización de inputs, rate limiting, RLS verificado
- UI/UX polish: tipografía, espaciado, animaciones, estados vacíos
- Test móvil (375px): sin elementos rotos
- Perfil de demo publicado
- Repo público en GitHub con README

### Pendiente antes del lanzamiento
- [ ] Imágenes con identidad visual real (ver sección de dirección visual más abajo)

---

## Modelo de negocio

- **Free:** hasta 2 proyectos visibles en perfil público + badge "Made with Ingegno"
- **Pro (€9/mes o €79/año):** proyectos ilimitados, sin badge
- **Founder Pack (billed annually, precio por definir):** tier premium para early adopters — precio bloqueado, acceso anticipado a features premium según escale el producto. Activar cuando el roadmap de features premium esté más claro.
- **Stripe:** NO activar hasta señal clara de willingness to pay (≥5 usuarios)
- **Objetivo mes 1:** 60 usuarios registrados, 30 perfiles públicos activos
- **Objetivo mes 2-3:** identificar 5-10% dispuesto a pagar → activar Stripe

---

## Decisiones de producto vigentes

- GitHub sync: manual vía botón "Sync now" — sin webhooks hasta V2
- Dominio custom: V2
- Analytics de visitas: V2
- Stripe: no hasta validar willingness to pay con datos reales
- X/Twitter integration: descartada (API €100/mes)
- Product Hunt: no lanzar hasta 40+ usuarios y testimonios reales

---

## Dirección visual

La identidad de Ingegno es renacimiento + tecnología. Las imágenes tienen que
respirar eso — no stock tech, no mockups de ordenador, no lifestyle moderno.

**Dirección:**
- Obra real de Da Vinci: Hombre de Vitruvio, cuadernos de bocetos, retratos
- Textura de tinta sobre papel envejecido como elemento decorativo
- Contraste entre obra clásica y diseño oscuro del producto
- Sin imágenes generadas por IA

**Fuentes (dominio público, alta resolución):**
- [Wikimedia Commons — Leonardo da Vinci](https://commons.wikimedia.org/wiki/Leonardo_da_Vinci)
- [Web Gallery of Art](https://www.wga.hu)
- [The Met Collection](https://www.metmuseum.org/art/collection) — filtrar Open Access

**Assets en:** `_resources/brand/` y `_resources/screenshots/`

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ App Router |
| UI | React + Tailwind CSS |
| Auth + DB | Supabase (`@supabase/ssr`) |
| Storage | Supabase Storage |
| Animaciones | Framer Motion |
| OG Images | `@vercel/og` (edge runtime) |
| Deploy | Vercel |

---

## Design system

- **Dark mode first** — fondo `#000`, texto blanco con variantes de opacidad
- **Liquid glass** — `backdrop-filter` + `border rgba`
- **Tipografía:** Instrument Serif italic para headings, Barlow para body
- **Acento:** `#8B5CF6` (violet-500)
- **Animaciones:** Framer Motion, `whileInView`. BlurText word-by-word en hero.

---

## Estructura de carpetas

```
P4 - Ingegno/
├── CLAUDE.md
├── README.md
│
├── [Next.js — raíz, inamovible]
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── supabase/
│   └── ...config files
│
├── docs/
│   ├── product/          ← spec.md, research-pain-points.md, decisiones futuras
│   ├── marketing/        ← estrategia de lanzamiento, posts, outreach templates
│   └── dev/              ← plan.md, stitch-prompt.md (referencia técnica)
│
└── _resources/
    ├── brand/            ← logo, paleta, assets de identidad visual
    ├── screenshots/      ← para README y marketing
    └── copy/             ← textos de landing, taglines, variantes de copy
```

---

## Documentación

| Archivo | Contenido |
|---|---|
| `docs/product/spec.md` | Spec completo de producto, UX y arquitectura |
| `docs/product/research-pain-points.md` | Research de pain points validados |
| `docs/dev/plan.md` | Plan de implementación original (referencia técnica) |
| `docs/dev/stitch-prompt.md` | Prompt de Google Stitch para la UI |
| `Webdev/docs/briefing-futuro-raul-2026.md` | Estrategia a largo plazo |

---

## Reglas de trabajo

- No añadir features sin validar con usuarios reales — YAGNI siempre
- No activar Stripe hasta señal explícita de willingness to pay
- No lanzar en Product Hunt sin 40+ usuarios y testimonios
- Cualquier cambio técnico: revisar `docs/product/spec.md` antes de tocar código
- `access_token` de GitHub: nunca en cliente, solo server-side
- `SUPABASE_SERVICE_ROLE_KEY`: solo en variables de entorno de servidor

---

## Flujo de trabajo

```
Producto / marketing / estrategia  →  Cowork (Jarvis) — este proyecto
Cambios técnicos en el código      →  Claude Code (abrir carpeta P4 - Ingegno/)
```
