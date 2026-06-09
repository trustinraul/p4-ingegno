---
timestamp: 2026-06-09T15-55-06Z
slug: landing-dashboard-full-reaudit
---
## Design Health Score

| # | Heurística | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | OnboardingChecklist excelente; formularios auth sin loading state visible |
| 2 | Match System / Real World | 3 | Lenguaje limpio; "Ingegno badge" puede confundir |
| 3 | User Control and Freedom | 3 | Dashboard nav claro; no hay undo en delete |
| 4 | Consistency and Standards | 2 | Eyebrows // Profile/GitHub/Account vivos en Settings; form labels uppercase en auth |
| 5 | Error Prevention | 2 | Auth inline ✅; sin validación en tiempo real; sin confirmación delete |
| 6 | Recognition Rather Than Recall | 2 | Sidebar icon-only en mobile sin tooltip visible |
| 7 | Flexibility & Efficiency | 2 | Sin atajos de teclado, sin bulk actions |
| 8 | Aesthetic & Minimalist Design | 3 | Mejora sustancial post-audit; Settings ruidoso |
| 9 | Error Recovery | 2 | Auth errors claros; dashboard save/sync error state no visible |
| 10 | Help & Documentation | 1 | Sin tooltips, sin contextual help, sin onboarding text en GitHub sync |
| Total | | 23/40 | Acceptable |

## Anti-Patterns Verdict

El producto ya NO lee como AI puro. La identidad EB Garamond italic + dark glass + Da Vinci imagery tiene voz. Pero 3 focos de regresión persisten: Settings eyebrows (// Profile/GitHub/Account), form labels con uppercase tracking en auth, em dash en Hero badge.

Deterministic scan: exit 0, findings empty — los bloques anteriores eliminaron los markers más obvios del árbol.

## Priority Issues

[P1] Settings page: 3 eyebrows sin limpiar — app/dashboard/settings/page.tsx
[P1] Form labels con eyebrow pattern en auth — app/(auth)/login/page.tsx
[P1] TheProblem mobile — alternancia left/right sin breakpoint en components/landing/TheProblem.tsx
[P2] Em dash en Hero badge — components/landing/Hero.tsx
[P2] prefers-reduced-motion ausente en landing whileInView animations

## Persona Red Flags

Jordan: Settings page con // eyebrows → "parece plantilla" → riesgo de abandono antes de completar setup. GitHub sync sin tooltip → abandono en paso técnico.
Casey: TheProblem en 375px con alternancia left/right en columna única → visualmente confuso.

## Minor Observations

- text-white/45 en text-xs (Pricing labels "forever") borderline WCAG AA — subir a /55
- Pricing checkmarks usan ✓ y — Unicode en lugar de SVGs
- ProjectGrid empty state sin CTA para añadir proyecto
- Discover empty state usa liquid-glass (inconsistencia menor)
- Footer sin Terms/Privacy links
- font-heading italic en dashboard UI (tensión con design-taste rule pero coherente con brand identity)
