# Verificación redesign en producción — julio 2026

## Scores Lighthouse (2 jul 2026, sobre ingegno.app)

| Página | Perf M | Perf D | A11y | BP | SEO |
|---|---|---|---|---|---|
| / | 85 | 99 | 100 | 100 | 100 |
| /login | 93 | 100 | 100 | 100 | 100 |
| /signup | 96 | 100 | 100 | 100 | 100 |
| /discover | 94 | 100 | 100 | 100 | 100 |
| /leonardo | 93 | 97 | 100 | 100 | 100 |
| /dashboard | — | — | — | — | — |

`/dashboard` requiere sesión autenticada; Lighthouse CLI no la soporta. Pendiente de ejecución manual vía DevTools (Task 7 Step 2, ver Hallazgos).

`errors-in-console` (best-practices) = 1/1 en las 5 páginas públicas en carga inicial. No sustituye la revisión manual tras interactuar (abrir modales, hover), que sigue pendiente.

## Hallazgos

| # | Severidad | Página | Problema | Fix | Estado |
|---|---|---|---|---|---|
| 1 | P1 | /login, /signup | Documento sin landmark `<main>` (audit `landmark-one-main`) | Envolver el contenido en `<main>` | ✅ Arreglado, commit `8559b8d` |
| 2 | P1 | /login, /signup | Los links "Sign in" / "Create one" dentro de párrafo dependían solo del color para distinguirse del texto (audit `link-in-text-block`) | `underline underline-offset-2` en ambos links | ✅ Arreglado, commit `8559b8d` |
| 3 | P2 | Dashboard | Auditoría de teclado (Tab, foco visible, Esc en modales) y Lighthouse de `/dashboard` vía DevTools no ejecutadas — requieren sesión de navegador interactiva, no disponible en este entorno de ejecución | — | ⏳ Pendiente, checklist entregado al usuario |

Severidades: P0 = bloquea lanzamiento (romperlo por teclado, A11y <90, error de consola en flujo core) · P1 = arreglar antes del 15 jul · P2 = post-launch backlog.

Nota: no se encontraron P0. El hallazgo #3 no es un P2 de producto — es un gap de cobertura de esta verificación (sin acceso a navegador interactivo) que requiere que un humano complete Task 6 y la mitad de Task 7 Step 2 del plan antes del lanzamiento.
