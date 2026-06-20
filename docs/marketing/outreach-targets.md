# Ingegno — Sistema de Outreach (50 targets)

**Objetivo:** 50 outreaches en semana 1 → 10-15 registros.
**Por qué importa:** los primeros 20-30 usuarios no vienen solos. Este es el canal de mayor conversión del lanzamiento y su cuello de botella. Sin la lista construida antes del 29 jun, el lanzamiento no tiene combustible.

> **Nota honesta:** este documento es el *sistema* para construir la lista rápido y bien — dónde buscar, qué queries usar, cómo cualificar y dónde registrar. No incluye 50 handles inventados (te daría perfiles falsos o muertos). Para poblarlo con personas reales: o lo haces tú en 60-90 min con las queries de abajo, o me pides que navegue (Twitter/IH/Reddit) y te devuelva una tanda de handles reales cualificados.

---

## 1. Criterios de cualificación (filtro antes de añadir a la lista)

Un buen target cumple **al menos 3** de estos:

- [ ] Tiene **2+ disciplinas o proyectos** visibles y en paralelo (diseño+código, música+negocio, escritura+producto…)
- [ ] Su presencia online está **fragmentada** (bio con 3 links distintos, "designer / dev / writer", Linktree saturado)
- [ ] **Construye en público** o comparte progreso (updates, builds, "day X of…")
- [ ] Es **early-stage**: poca tracción, sin equipo, sin web premium propia
- [ ] **18-28 años** aprox. / estudiante o solopreneur
- [ ] **DMs abiertos** o forma de contacto accesible

**Descartar si:** ya tiene web personal premium pulida, es una empresa/agencia, >50k seguidores (no convierten ni dan feedback), o cuenta inactiva (>2 meses sin postear).

---

## 2. Reparto por segmento (matchea los 3 templates de copy)

| Segmento | Template | Nº objetivo | Dónde |
|---|---|---|---|
| **A — Indie Hackers / Builders** | Outreach A | 20 | Indie Hackers, Twitter/X, r/SideProject |
| **B — Diseñadores / creativos multi-disciplinares** | Outreach B | 18 | Instagram, Dribbble, LinkedIn |
| **C — Student entrepreneurs** | Outreach C | 12 | LinkedIn, Twitter, comunidades estudiantiles |
| | | **50** | |

---

## 3. Fuentes y queries exactas (copia-pega)

### Segmento A — Indie Hackers / Builders

**Indie Hackers:**
- Recorre los "milestones" recientes y los productos con <100 followers → founders early-stage reales
- Usuarios que comentan en threads de "building in public" y "first users"
- Perfiles de IndieLogs (su competidor) — 2.156 usuarios que son tu ICP exacto

**Twitter/X — búsquedas (pega en la barra de búsqueda):**
```
("building in public" OR "build in public") ("designer" "developer") min_faves:5
"indie hacker" ("two projects" OR "multiple projects") -filter:links
("day 1 of" OR "day 30 of") building min_faves:10 -filter:replies
"my linktree" (founder OR maker) -filter:verified
```

**Reddit:** comentaristas activos (no OPs ruidosos) en r/SideProject, r/indiehackers, r/SaaS que mencionan tener varios side projects.

### Segmento B — Diseñadores / creativos multi-disciplinares

**Instagram hashtags** (filtrar por cuentas pequeñas, no influencers):
```
#multidisciplinary #creativecoder #designandcode #multipotentialite
#generalist #polymath #creativetechnologist #designengineer
```

**Dribbble:** diseñadores cuya bio menciona también código/escritura/producto, con link a un perfil fragmentado.

**Twitter/X:**
```
("designer who codes" OR "design + code" OR "designer + developer") -filter:verified
(illustrator OR designer) ("also building" OR "side project") min_faves:5
```

### Segmento C — Student entrepreneurs

**LinkedIn — búsquedas:**
```
"student" "founder" "building"
"2º Bachillerato" OR "university" "side project" founder
"studying" "while building"
```
Filtrar por: estudiantes con "building X" en el headline y 2+ proyectos en "Experience/Projects".

**Twitter/X:**
```
(student OR "at university") ("building" OR "launched") (startup OR app OR SaaS) min_faves:3
```

**Comunidades:** servers de Discord de estudiantes emprendedores, cohortes de programas tipo Buildspace/edu, grupos de Telegram de makers hispanos (tu red local en Valladolid/España cuenta como warm outreach).

---

## 4. Reglas de envío (anti-spam)

- **Máx. 5 outreaches por plataforma por día** (Twitter, IG y LinkedIn banean envíos masivos de cuentas nuevas).
- **Personalización obligatoria:** cada mensaje referencia algo *real y específico* de la persona (un proyecto, un post, un launch). Sin esto, es spam y convierte <2%.
- **Instagram:** solo si DMs abiertos + dar 1 like reciente antes de escribir.
- **LinkedIn:** connection note < 300 caracteres (usa solo las 2 primeras frases del template C).
- **Sugiere su username:** `ingegno.app/[su-nombre]` — hace que visualicen su perfil antes de visitar. Sube conversión.

---

## 5. Tracker (Notion-ready)

Copia esta tabla a Notion como base de datos. Una fila por target. (También disponible como `outreach-tracker.xlsx`.)

| # | Nombre | Segmento (A/B/C) | Plataforma | Handle / URL | Gancho de personalización | Estado | Fecha envío | Respuesta | ¿Se registró? | Notas |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | Pendiente | | | | |
| 2 | | | | | | Pendiente | | | | |
| … | | | | | | | | | | |
| 50 | | | | | | | | | | |

**Estados sugeridos:** Pendiente → Enviado → Respondió → Registrado → Activó perfil → Descartado.

**Métricas a vigilar (semanal):**
- Reply rate (objetivo >20%)
- Conversión a registro (objetivo 20-30% de los que responden)
- Qué segmento y qué gancho convierten mejor → doblar en ronda 2

---

## 6. Aceleradores opcionales

- **Oferta para los primeros 10:** "Pro gratis a cambio de un testimonio honesto." Resuelve dos problemas a la vez: conversión + testimonios para Product Hunt.
- **Founder Pack hook:** "First 50 lock founder pricing" — convierte el outreach en señal de WTP temprana sin activar Stripe.
- **Warm antes que cold:** tu red local (España, comunidad de makers/estudiantes) tiene tasa de respuesta mucho mayor. Empieza por ahí los días 1-2.

---

*Siguiente paso: poblar el tracker con 50 targets reales durante la Sem 0 (22-28 jun), listos antes del lanzamiento del 29 jun. Pídeme que navegue y te traiga una primera tanda cualificada si quieres acelerar.*
