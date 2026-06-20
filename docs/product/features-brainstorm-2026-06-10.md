# Brainstorm de features — Ingegno

> Sesión de ideación, 10 jun 2026. Backlog estratégico, **no** roadmap comprometido.
> Regla vigente del proyecto: YAGNI hasta validar con usuarios reales. Esto es munición
> para después del lanzamiento, no trabajo a meter antes del 27 jun. Las pocas excepciones
> pre-launch están marcadas explícitamente.

Leyenda de esfuerzo (solo dev, tu stack): **S** = horas · **M** = 1-3 días · **L** = semana+ · **XL** = multi-semana
Leyenda de horizonte: 🟢 pre-launch viable · 🔵 V1.x (mes 1-3) · 🟣 V2+ / moonshot

---

## TL;DR estratégico

El foso de Ingegno no es "otro perfil bonito" — es **el hilo conductor** (la palabra
*ingegno* misma) + **build-in-public con casa**. Casi todo lo defensible cuelga de ahí.
Los competidores tienen las piezas sueltas: creativesignature.app tiene el hilo conductor
pero solo texto y sin presentación; IndieLogs tiene build-in-public pero feo y solo indie
hackers; Linktree/Carrd no tienen ni concepto de proyecto.

Antes del 27 jun **no metas features nuevas** salvo 2 que son vergonzosas de no tener
(ver §0). Todo lo demás se prioriza con datos reales del mes 1.

---

## §0 — Lo que es vergonzoso NO tener (revisar pre-launch)

Esto no son "features nuevas", son agujeros de table-stakes que pueden costar credibilidad
el día del lanzamiento. Merece 30 min de decisión consciente: meter ahora o aceptar el hueco.

1. **Imágenes en proyectos** — 🟢 **M**. El spec define proyecto como nombre+descripción+estado+URL.
   Un portfolio "visualmente premium" sin un solo screenshot del proyecto es contradictorio.
   Mínimo: 1 imagen de portada por proyecto (ya tienes Supabase Storage + el patrón de avatar).
   *Esto es lo único que yo consideraría seriamente meter antes de lanzar.*

2. **Links sociales / contacto** — 🟢 **S**. ¿Cómo te escribe un inversor o cliente desde el
   perfil? Hoy no hay un bloque de contacto ni de redes. Un array `links[]` (label + url + icono)
   + un botón "Get in touch" (mailto o link). Barato y básico.

3. **QR del perfil** — 🟢 **S**. El canal es Instagram/TikTok + eventos. Un QR descargable
   (genera client-side) convierte "bio de IG" y "founder en un meetup" en visitas. Trivial.

4. **Borrar cuenta / exportar datos** — 🟢 **S**. Mercado global con tráfico UE → GDPR.
   "Delete account" y un export básico no son opcionales legalmente. Settings ya existe.

5. **Editar perfil desde móvil** — 🟢 (verificar). Ya pasaste test móvil a 375px del perfil
   público; confirma que el **dashboard** también es usable en móvil — vas a captar tráfico
   desde IG, la gente va a entrar a editar desde el teléfono.

---

## §1 — Table-stakes que faltan (backlog post-launch)

Cosas que las herramientas comparables dan por hechas. No urgentes, pero esperables.

- **Analytics de visitas** — 🔵 **M**. Marcado V2 en spec, pero un contador de visitas + fuente
  de tráfico es de lo primero que pide un build-in-public ("¿está funcionando mi outreach?").
  Es además gancho directo de Pro. Empieza simple: page views + referrer, sin dashboards complejos.
- **Media rica en proyectos** — 🔵 **M**. Galería (varias imágenes), embed de Loom/YouTube/Figma.
  El multi-hyphenate enseña código *y* diseño *y* vídeo; necesita formatos distintos.
- **Sección de skills / stack** — 🔵 **S**. Tags de tecnologías y disciplinas. Refuerza el "qué hago".
- **Testimonios** — 🔵 **M**. Pain #4 (credibilidad). Bloque de quotes con nombre + rol + avatar.
  Tú los metes a mano en V1; el "endorse público" es §3.
- **Indicador "Now / Open to"** — 🔵 **S**. "Currently building X" / "Open to collaborations /
  investment / freelance". Estado vivo, muy de founder, y abre la puerta a oportunidades inbound.
- **Reordenar secciones (drag-drop)** — 🔵 **M**. Control sobre la narrativa de la página.
- **Modo claro / temas** — 🟣 **M**. Hoy solo dark. No prioritario (dark es parte de la marca),
  pero algún usuario lo pedirá. Mantenlo en V2.
- **Dominio custom** — 🟣 **L**. Ya marcado V2. Gancho de Pro fuerte; déjalo donde está.
- **SEO por perfil** — 🔵 **S**. Meta tags, control de indexación, sitemap. Importa si quieres
  que los perfiles ranqueen por nombre. Barato y compuesto en el tiempo.
- **Export a CV/PDF** — 🔵 **M**. "Convierte mi perfil en un PDF para mandar". Muy pedido por
  el perfil estudiante/founder que también busca prácticas o trabajo.

---

## §2 — Diferenciadores defensibles (el foso real)

Aquí es donde Ingegno deja de ser "Linktree premium" y se vuelve categoría propia. Todo
cuelga del concepto *ingegno* = inteligencia que conecta disciplinas.

- **The Through-line (el hilo conductor)** — 🔵 **M** · ⭐ *la feature insignia*.
  IA que lee tus proyectos + narrativa y articula la frase que conecta tus disciplinas
  ("el patrón detrás de todo lo que construyes"). Es literalmente el nombre del producto y
  resuelve el pain #1 ("So... what exactly do you do?"). creativesignature.app hace solo esto
  y solo en texto — tú lo haces *visual y dentro de un perfil premium*. Defensible porque es
  tu posicionamiento, no una feature suelta.

- **Identity constellation / mapa de disciplinas** — 🟣 **L**. Visual interactivo (estilo
  cuaderno de Da Vinci) que muestra tus disciplinas como nodos y el hilo conductor como las
  líneas que los unen. Es el "show, don't tell" del multi-hyphenate. Muy on-brand, muy
  shareable, técnicamente no trivial → V2, pero es el "wow" de la categoría.

- **GitHub → changelog legible por humanos** — 🔵 **M**. Hoy el plan es volcar commits crudos
  al feed. Un commit `fix: null check` no le dice nada a un inversor. IA que agrupa los commits
  de la semana y los traduce a un update legible ("Esta semana: terminé auth y arreglé el
  onboarding"). Convierte ruido en narrativa. Diferenciador claro vs IndieLogs.

- **"How to introduce me" generator** — 🔵 **S**. Genera el blurb de 2 líneas con el que otros
  te presentan ("Raúl construye X, además hace Y"). Pain #1 literal: *los clientes no saben
  cómo referirte*. Botón "copiar" → se comparte solo.

- **Build-in-public como artefacto cinematográfico** — 🔵 **M**. El timeline no como lista
  aburrida sino como historia visual con milestones destacados (launched, first user, etc.).
  Es la "casa" que el pain #3 dice que no existe.

- **Brand kit derivado del perfil** — 🟣 **L**. Pain #5 (consistencia visual sin diseñador).
  Tu perfil ya define colores/tipo/estética; deriva de ahí plantillas exportables (avatar,
  banner, plantilla de post) en tu identidad renacimiento. Esto enlaza directo con §3.

---

## §3 — Motor de viralidad / sharing (tu foco)

El producto crece si compartir es el comportamiento por defecto, no un extra.

- **OG card premium por update y por proyecto** — 🟢/🔵 **S-M**. Ya generas og:image por perfil
  con @vercel/og. Extiéndelo: cada update y cada proyecto tiene su propia imagen al compartir.
  Cada link que sale a IG/X/LinkedIn se ve premium → el diseño *es* el marketing (Design Principle #1).
  *Posible candidato pre-launch si el coste es bajo, porque multiplica el alcance de cada share.*

- **"Share as story/post"** — 🔵 **M**. Botón que convierte un milestone/update en una imagen
  vertical lista para IG Story o cuadrada para feed, en tu estética. Resuelve §2 brand-kit a
  pequeña escala y ataca pain #5. Esto es viralidad + IA agéntica juntas.

- **Ingegno Wrapped / Year-in-review** — 🟣 **M**. "Tu año construyendo": recap visual de proyectos
  lanzados, commits, milestones. Spotify Wrapped para founders. Altísimo potencial viral una vez
  haya datos acumulados (→ fin de año, no antes).

- **Badge "Made with Ingegno" → loop de referido** — 🔵 **S**. Ya existe el badge en free. Conviértelo
  en motor: cada perfil free es un anuncio. Añade incentivo ("invita 3 → 1 mes Pro") cuando actives Pro.

- **Endorse / kudos público** — 🟣 **M**. Visitantes (con login social ligero) endorsan una skill
  o dejan un testimonio. Genera social proof real (pain #4) *y* tráfico de vuelta (el que endorsa
  comparte). Cuidado con spam → moderación.

- **Directorio / "Profile of the week"** — 🟣 **M**. Página pública que destaca perfiles.
  Loop de descubrimiento + SEO + sensación de comunidad de "Da Vincis". Necesita masa crítica primero.

- **Widget embebible** — 🟣 **M**. Ya marcado V2. Changelog/perfil embebible en tu web personal →
  cada web ajena es un backlink y un anuncio.

---

## §4 — IA agéntica (tu foco)

De "editor de perfil" a "colaborador que mantiene tu presencia viva". Esto es lo que ningún
competidor está haciendo y encaja con la personalidad de marca (*intelligent*).

- **Onboarding por entrevista** — 🔵 **M**. En vez de formularios vacíos (problema de la página
  en blanco), un agente te entrevista en 4-5 preguntas y rellena tagline, roles y narrativa en
  borrador. Mata la fricción #1 del activation. Alto impacto en conversión perfil→publicado.

- **AI narrative writer / inline assist** — 🔵 **M**. Botones "mejorar / acortar / reescribir en
  tono de marca" en cada campo de texto. El usuario rara vez sabe escribir su propio pitch.

- **Recap semanal automático (agente)** — 🔵 **M** · ⭐. Un agente revisa tus commits + updates de
  la semana y te redacta un borrador de post build-in-public para que apruebes y publiques. Esto
  es viralidad + agéntico + retención (te da motivo para volver cada semana). Encaja con el patrón
  de tareas programadas.

- **Build-in-public en autopiloto** — 🟣 **L** · *moonshot*. El agente monitoriza tu GitHub, detecta
  milestones ("lanzaste algo", "primer release") y te propone updates al móvil para aprobar con un
  tap. Mantiene el perfil vivo sin que toques nada. Este es el "Jarvis para tu marca personal".

- **AI Profile Coach** — 🔵 **M**. Audita tu perfil y da recomendaciones accionables ("tu tagline es
  genérica", "te falta un proyecto launched", "tu narrativa tiene 3 ideas, enfócala"). Sube calidad
  media de perfiles (= credibilidad del producto, Design Principle #1) y empuja a Pro.

- **Concierge del perfil público** — 🟣 **L** · *moonshot*. Chat en tu perfil entrenado con tus
  proyectos/narrativa: un visitante pregunta "¿tiene experiencia con X?" y responde por ti.
  Muy on-brand (*intelligent*), diferenciador brutal, pero coste de inferencia y riesgo de
  alucinación → V2 con cuidado.

- **Hero/thumbnails generados en estilo renacimiento** — 🟣 **M**. Image-gen para portadas de
  proyecto coherentes con la marca (pain #5). Riesgo: el CLAUDE.md dice "sin imágenes generadas por
  IA" en la identidad — aplicaría solo a assets del usuario, no a la marca Ingegno. Decisión consciente.

---

## §5 — Dashboard: la casa del usuario (tu foco)

Es lo que el usuario ve cada vez que vuelve. Si el dashboard no engancha, no hay build-in-public.

- **Profile strength meter** — 🔵 **S** · ⭐. Score de completitud estilo LinkedIn ("perfil 60% —
  añade un proyecto launched para llegar a 80%"). Barato, motivador, sube calidad media de perfiles
  y da un objetivo claro post-onboarding. Complementa el checklist que ya añadiste.

- **Live preview lado a lado** — 🔵 **M**. Editas a la izquierda, ves el perfil premium actualizarse
  a la derecha. Es table-stakes de un *builder* de perfiles y refuerza el "wow" del diseño cada vez
  que editas. Alto impacto percibido.

- **Quick-add update (y desde móvil / share sheet)** — 🔵 **S-M**. Bajar a cero la fricción de
  publicar un update es lo que sostiene el build-in-public. Idealmente desde el móvil en 2 taps.

- **Momentum / streak tracker** — 🔵 **S**. Racha de semanas con update. Pain #5 (consistencia).
  Gamifica el hábito que hace que un perfil parezca vivo y no abandonado. Cuidado: que no sea ansioso.

- **Insights ligeros en el dashboard** — 🔵 **M** (depende de analytics). "Tu perfil tuvo 40 visitas
  esta semana, +20%". Dopamina honesta que engancha. Combina con §1 analytics.

- **Updates programados / borradores** — 🔵 **M**. Escribe ahora, publica luego. Útil para quien
  acumula y dosifica.

- **Command palette (⌘K)** — 🟣 **S**. Para el power user. Bajo impacto, alto encanto. V2.

- **Estados vacíos que enseñan** — 🟢 **S**. Ya tienes onboarding checklist y estados vacíos pulidos;
  asegúrate de que cada sección vacía muestra un ejemplo real de cómo se ve bien rellena.

---

## §6 — Moonshots (apuestas de categoría, V2+)

- **Ingegno Network** — 🟣 **XL**. Descubrir otros Da Vincis y *matching de colaboración* ("ambos
  cruzáis diseño+código"). El perfil deja de ser estático y se vuelve red. Aquí el producto pasa de
  herramienta a plataforma con efectos de red. Riesgo: dispersión vs el foco de "herramienta de perfil".

- **Capa de credibilidad verificada** — 🟣 **L**. Conecta GitHub stars, revenue de Stripe, etc. →
  badges verificados con datos reales. Ataca pain #4 (credibilidad) con prueba, no con palabras.
  "Verified: $2k MRR" pesa más que cualquier testimonio.

- **Oportunidades inbound / "Open to"** — 🟣 **L**. Si hay masa de founders + señal "open to
  investment/collab/hire", Ingegno se convierte en capa de talento donde aterriza demanda. Modelo de
  negocio alternativo (no solo suscripción).

- **Perfil adaptativo por audiencia** — 🟣 **L**. Pegas a quién se lo mandas (inversor / cliente /
  recruiter) y el perfil reordena énfasis para esa audiencia. Un perfil, varias caras.

---

## Vista de priorización (impacto × esfuerzo)

**Hazlo ya-ish (alto impacto, bajo esfuerzo):**
Imágenes en proyectos · Links/contacto · QR · Profile strength meter · OG card por update ·
"How to introduce me" · Badge→referido

**Apuesta grande (alto impacto, esfuerzo medio-alto):**
The Through-line · Recap semanal agéntico · GitHub→changelog legible · Onboarding por entrevista ·
Live preview · Analytics

**Foso a largo plazo (alto impacto, alto esfuerzo):**
Identity constellation · Build-in-public autopiloto · Concierge del perfil · Capa de credibilidad ·
Ingegno Network

**Encanto / relleno (bajo impacto):**
Command palette · Modo claro · Streak tracker

---

## Recomendación honesta

1. **Pre-launch (antes 27 jun):** resiste meter features. Como mucho, las 2 de §0 que rompen la
   promesa de marca: **imágenes en proyectos** y **links de contacto** (+ QR si sobra una hora).
   Un perfil "premium" sin imágenes ni forma de contactar es un agujero, no una feature pendiente.
2. **Mes 1 (validación):** mide qué piden los primeros usuarios y mira analytics. No construyas
   sobre suposiciones — para eso lanzas sin Stripe.
3. **Primera feature post-validación, casi seguro:** **The Through-line**. Es el nombre del producto,
   resuelve el pain #1 y es lo que te separa de "otro Linktree". Si una sola cosa define Ingegno V1.x,
   es esa.
4. **El combo que engancha + crece:** **Recap semanal agéntico** + **OG cards por update**. Te da
   motivo para volver cada semana y hace que cada share parezca premium. Viralidad + retención + IA
   en una sola línea de inversión.
