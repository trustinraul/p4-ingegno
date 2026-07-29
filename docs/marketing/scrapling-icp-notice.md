# Ingegno — Nota: scraping de targets de cold outreach con scrapling

**Fecha:** 22 jun 2026
**Estado:** probado (test PoC), no ejecutado a escala.
**Relación:** alimenta el canal 4 (outreach directo) de `launch-campaign.md` y el tracker de `outreach-targets.md`.
**Playbook técnico reutilizable:** `Webdev/Freelance/_scraping/` (setup del entorno, script, gotchas del sandbox).

---

## 1. Veredicto

scrapling **sí sirve** para construir el pool de targets de cold outreach del ICP de Ingegno,
con un reparto de papeles claro:

- **scrapling** → harvest del pool de candidatos + dato crudo del gancho, desde fuentes abiertas.
- **LLM (Jarvis)** → cualificación fina (¿multi-hyphenate? ¿presencia fragmentada?) + redacción del gancho de personalización por persona.
- **Claude in Chrome** (sesión logueada de Raúl) → plataformas con muro de login. NO scrapling.

scrapling no "encuentra los targets" enteros y no debe automatizar los DMs.

---

## 2. Mapa de fuentes (probado el 22 jun desde el sandbox)

| Fuente | Render | Scrapeabilidad | Uso |
|---|---|---|---|
| **old.reddit** (r/SideProject, r/SaaS, r/indiehackers) | HTML server-rendered | 🟢 Alta, ligera | Segmento A/C. Mejor ratio esfuerzo/resultado |
| **Dribbble** (`/designers`) | HTML completo (~1 MB) | 🟢 Alta | Segmento B (diseñadores multi-disciplinares) |
| **IndieHackers** | SPA, shell ligero | 🟡 Media | Necesita navegador headless (como Google Maps) |
| **IndieLogs** | SPA Nuxt (datos por API tras hidratar) | 🟡 Media | Recuperable con headless o API. ICP exacto (2.156 users) |
| **Twitter/X, Instagram, LinkedIn** | Muro de login + anti-bot | 🔴 Baja | NO scrapling → Claude in Chrome sobre sesión logueada |

Notas:
- old.reddit funciona; la API `.json` de Reddit está **bloqueada (403)** → usar el HTML de old.reddit, no el JSON.
- IndieLogs/IndieHackers son SPAs: el GET simple solo trae el shell. Para datos reales hace falta
  `DynamicFetcher` (navegador), mismo patrón que el scraper de Google Maps.

---

## 3. Resultado del test (PoC)

Una sola petición HTTP a `https://old.reddit.com/r/SideProject/new/` (con `--impersonate chrome`)
→ 24 autores únicos + el título de su post en la misma pasada. El título **es** el gancho de
personalización que exige el doc de outreach. Ejemplos reales extraídos:

- u/jorgeroo — "I built a free, open-source anime tracker…"
- u/Savings-Peanut-5501 — "Built a Mac app that turns ambient sound into spatial audio…"
- u/Pularez — "I built a social media app for people tired of social media"

Estos son ICP directo: builders activos, construyendo en público, presencia probablemente fragmentada.

---

## 4. Receta (cuando se ejecute a escala — Fase 1 / Sem 1)

1. **Setup del entorno** (una vez): `Webdev/Freelance/_scraping/setup_entorno.sh`.
2. **Harvest** desde fuentes abiertas:
   - Reddit: recorrer `/new/` y `/top/` de r/SideProject, r/SaaS, r/indiehackers → autores + título.
   - Para cada autor candidato: visitar `old.reddit.com/user/<autor>` → bio/links, ¿multi-proyecto?, actividad.
   - Dribbble: `/designers` → perfiles cuya bio mezcla código/escritura/producto.
3. **Cualificar** (filtro de `outreach-targets.md`, ≥3 criterios) y descartar empresas/influencers/inactivos.
4. **Gancho de personalización**: extraído del propio post/proyecto/bio scrapeado.
5. **Volcar al tracker** (Notion): segmento, plataforma, handle, gancho, estado.
6. **Walled platforms (X/IG/LinkedIn)**: con Claude in Chrome sobre la sesión de Raúl, no scrapling.

---

## 5. Límites y ética (no negociable)

- Solo perfiles **públicos**. Respetar rate limits; añadir delays en crawls grandes.
- scrapling **solo construye la lista**. El envío de DMs es manual y respeta los topes del plan
  (máx. 5 outreaches por plataforma por día) — automatizarlos rompe ToS y dispara baneos.
- No forzar plataformas con login mediante scraping (riesgo de ban + ToS). Esas van por Chrome logueado.
- Scraping de perfiles para outreach es zona gris de ToS: mantener volumen bajo y personalización real.
