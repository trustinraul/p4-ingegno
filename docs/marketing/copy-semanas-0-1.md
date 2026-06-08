# Ingegno — Copy & Content Scripts
## Semanas 0 y 1

**Timeline:**
- **Sem 0 — Prep:** 20–27 jun 2026
- **Sem 1 — Launch:** 27 jun – 4 jul 2026

Todo el copy público está en inglés (producto global).  
Los placeholders van entre corchetes: `[así]`.

---

## SEMANA 0 (20–27 jun) — Preparación

---

### 1. Post de lanzamiento — Indie Hackers + Reddit r/SideProject

> Publicar el **lunes 29 de junio** a las 9:00 CET.  
> Usar en IH con título tal cual. En Reddit, mismo texto pero sin el "Show IH:" del título.

---

**TÍTULO:**  
`Show IH: I built Ingegno — a premium public profile for people who do more than one thing`

---

**CUERPO:**

---

Six months ago I tried to send someone my portfolio. I had to send four links.

A GitHub. A design portfolio. A Notion doc with my other projects. And then a separate "about me" because none of the three explained who I actually was.

The person on the other end just said: *"So... what exactly do you do?"*

That question follows me everywhere. I'm a designer who codes, a founder who writes, a builder with too many disciplines to fit on a business card. Every tool I tried either flattened me into one thing or looked like I'd built my personal site on a free trial.

So I built Ingegno.

---

**What it does:**

Ingegno gives you one elegant public URL — `ingegno.app/[username]` — where everything lives together. Your projects, your writing, your skills, your story. It's designed for people who can't pick a lane, and who are tired of being penalized for it.

- Dark, premium design (not another white Notion page or Carrd template)
- GitHub sync to pull projects automatically
- Build-in-public updates on your profile
- Free tier with 2 visible projects — no credit card needed

---

**Where it fits:**

I've looked at every tool out there. Linktree is just links. Carrd screams amateur. Notion public pages are functional but ugly. Framer and Webflow are built for agencies, not solo founders. IndieLogs is close but aimed at indie hackers specifically, not multi-disciplinary people.

The gap I'm filling: visually premium, under €10/month, built specifically for the people who have multiple creative identities and want to present them coherently.

---

**The name:**

*Ingegno* is the Italian Renaissance word Leonardo da Vinci used to describe the creative intelligence that connects separate disciplines. It felt right.

---

**Where we are:**

This is a real beta. It's live, it works, auth is solid, mobile is tested. But it's early. The demo profile is at [ingegno.app/demo] — I'd love honest feedback on what's missing or broken.

If you're a multi-hyphenate founder, designer, developer, writer, or any combination of the above — this is for you. Go claim your username before someone else does.

👉 [ingegno.app](https://ingegno.app)

---

*What's the messiest part of your online presence right now? Genuinely curious.*

---

> **Nota de uso:** La última pregunta es intencional — en IH y Reddit, los posts que abren conversación generan 3–5x más comentarios que los que solo anuncian. Responde a TODOS los comentarios en las primeras 2 horas.

---

---

### 2. Template de outreach A — Indie Hackers / Builders

> Para founders que están construyendo en público, tienen múltiples proyectos y su presencia online está fragmentada entre IH, GitHub y Twitter.  
> Enviar por DM en IH o Twitter/X.

---

**DM (Twitter / IH):**

---

Hey [Nombre] — saw your [proyecto/post específico que mencionan]. Respect for building in public.

Quick thing: I just launched Ingegno — it's a premium public profile for people like you who are running multiple projects and want one URL that actually holds everything together. Not another Linktree. More like a founder profile that looks like it cost money to build.

You can claim a username free at ingegno.app — no credit card.

Would love your honest take if you try it.

---

> **Instrucciones de personalización:**
> - Reemplaza `[proyecto/post específico]` con algo real que hayas visto de esa persona. No vagas como "tu trabajo" — menciona un proyecto concreto, un post, un lanzamiento.
> - Si tienen un perfil de IH, menciona algo de su bio o sus últimos updates.
> - Máximo 5 outreaches por plataforma por día para no parecer spam.

---

---

### 3. Template de outreach B — Diseñadores / Creativos Multi-disciplinares

> Para personas con identidad dual: diseñador que también hace desarrollo, ilustrador que también escribe, artista que también tiene un proyecto SaaS.  
> Funciona bien en LinkedIn y Instagram DM.

---

**DM (LinkedIn / Instagram):**

---

Hey [Nombre] — came across your work on [dónde lo viste: Instagram/Dribbble/su web]. Love how you blend [disciplina 1] with [disciplina 2].

I just launched something that might be useful: Ingegno is a public profile built for people who do more than one thing. One URL, premium design, holds your projects + writing + identity together — without having to maintain five different platforms.

Free to start: ingegno.app/[username-sugerido-con-su-nombre]

---

> **Instrucciones de personalización:**
> - El campo `[disciplina 1]` y `[disciplina 2]` es lo que separa este mensaje de spam genérico. Mira su bio o su trabajo antes de escribir.
> - Sugerir un username específico con su nombre aumenta la tasa de conversión — hace que la persona visualice su perfil antes de visitar la web.
> - En Instagram, envía solo si tienen DMs abiertos y tienes al menos un like reciente en su contenido.

---

---

### 4. Template de outreach C — Student Entrepreneurs / Estudiantes con proyectos

> Para estudiantes universitarios con proyectos en paralelo a los estudios. Suelen tener LinkedIn mediocre y no saben cómo presentarse.  
> Funciona bien en LinkedIn.

---

**Mensaje LinkedIn (connection request note o DM tras conectar):**

---

Hey [Nombre] — saw you're studying [carrera] while building [proyecto]. That's a hard combination to explain to people.

I just launched Ingegno — it's a free public profile designed for exactly that: people with more going on than a LinkedIn can hold. One clean URL with your projects, your story, and your building-in-public updates.

Thought it might be useful before you start job-hunting or pitching. ingegno.app — free forever for up to 2 projects.

---

> **Instrucciones de personalización:**
> - LinkedIn connection notes tienen límite de ~300 caracteres. Si vas como note, usa solo las primeras dos frases.
> - Target ideal: perfiles con "student", "founder", "building X" en la bio, y 2+ proyectos mencionados.
> - El mention de "antes de job-hunting o pitching" activa el pain de credibilidad sin historial.

---

---

### 5. Email de bienvenida (automático tras registro)

> Enviado inmediatamente tras confirmar el email.  
> Implementar como triggered email en Supabase o en el onboarding flow.

---

**Asunto:** `Your Ingegno profile is waiting`

**Preview text:** `One URL. Everything you've built. Go make it real.`

---

**CUERPO:**

---

Hey [nombre] —

You just claimed your spot at **ingegno.app/[username]**.

Now make it worth visiting.

Your profile is live but empty right now. Here's what takes 5 minutes:

1. Add your bio and what you do
2. Add one project — just a title, a description, and a link
3. Hit "Publish" and share the URL with someone

That's it. You don't need it to be perfect. The point is to have something real at a URL that's yours.

If you hit any friction or anything feels broken, reply to this email. I read every reply.

— Raúl, founder of Ingegno

*P.S. Free tier includes 2 projects. If you want unlimited, Pro is €9/month — but start with free. Upgrade when you actually need it.*

---

> **Notas de implementación:**
> - El email va firmado como Raúl (tú), no como "The Ingegno Team". En early stage, lo personal convierte mucho mejor.
> - "Reply to this email. I read every reply." — este punto es literal. Los primeros 30-40 usuarios que responden son tu research de producto más valioso.
> - El P.S. menciona Pro sin presionar — es informativo, no agresivo. No incluir link de upgrade en este email.

---

---

## SEMANA 1 (27 jun – 4 jul) — Launch

---

### 6. Script Reel 1 — Concepto Da Vinci

> **Formato:** Reel de Instagram, 20-25 segundos.  
> **Visual:** Tú hablando a cámara, cortes rápidos, texto overlay.  
> **Tono:** Directo, un poco provocador. Sin positivismo vacío.  
> **Regla:** El producto no aparece hasta los últimos 3 segundos.

---

**HOOK (0–3s) — lo que aparece antes de que decidan scrollear:**

> Texto en pantalla grande + voz:

*"You're not one thing. Stop pretending you are."*

---

**DESARROLLO (3–18s):**

*"Every tool you use is designed for someone who only does one thing.*

*Behance is for designers. GitHub is for devs. LinkedIn is for people who've already made it.*

*And you? You design AND you code. You build AND you write. You have three projects that don't have a home.*

*People meet you and ask: 'So... what do you do?' And you spend ten minutes explaining something that should take ten seconds."*

---

**GIRO + PRODUCTO (18–22s):**

*"Leonardo da Vinci had a word for people like you: ingegno.*

*I built a tool for them."*

> [Mostrar la pantalla del perfil de Ingegno — 2 segundos de B-roll del producto]

---

**CTA (22–25s):**

*"ingegno.app — link en bio."*

> Texto en pantalla: **ingegno.app — free to start**

---

> **Notas de producción:**
> - Graba en vertical, buena luz, fondo limpio o negro (alineado con la estética del producto).
> - El texto overlay en el hook tiene que aparecer solo — antes de que se escuche tu voz. Es lo que para el scroll.
> - El B-roll del producto: pantalla del perfil de demo en tu móvil o en un browser limpio. No grabes la pantalla con notificaciones visibles.
> - Si no quieres aparecer en cámara, funciona igual como texto animado + voz en off.

---

---

### 7. Templates de respuesta a comentarios (IH / Reddit)

> Para usar durante las primeras 48h del post de lanzamiento. El objetivo es extender la conversación, no solo agradecer.

---

**Si alguien pregunta cómo se diferencia de Linktree / Carrd:**

*"Linktree is just links — no concept of projects, updates, or identity. Carrd gives you a static page that looks like what it is: a €9/year template. Ingegno is closer to a founder profile that tells a story — with your projects, your build-in-public updates, and a design that doesn't scream 'I built this in a weekend.' Different category."*

---

**Si alguien pregunta por el pricing:**

*"Free tier includes 2 visible projects + all the core features. Pro is €9/month for unlimited projects and no 'Made with Ingegno' badge. The goal right now is to get real people using it — so free is genuinely free, no time limit."*

---

**Si alguien da feedback negativo / señala un problema:**

*"Appreciate the honest look. [Acknowledges specific issue]. That's on my list — what's your current setup for handling this? Trying to understand where the friction actually is before I build the wrong solution."*

---

**Si alguien dice "looks interesting" sin más:**

*"What does your current setup look like? GitHub + [something]? Trying to understand what the messy version looks like for different people."*

> El objetivo de esta respuesta es abrir conversación, no vender. Cada respuesta que da contexto sobre su setup es research de producto.

---

**Si alguien pregunta sobre el stack / cómo está construido:**

*"Next.js 14 App Router, Supabase for auth + DB, Vercel for deploy, Framer Motion for animations. The og:image generation is edge runtime via @vercel/og. Nothing exotic — boring stack, which is the point."*

---

---

## RESUMEN — Checklist de publicación

### Sem 0 (20–27 jun)
- [ ] Post de lanzamiento: redactado y revisado ← ya está arriba
- [ ] Templates de outreach: listos ← ya están arriba
- [ ] Email de bienvenida: implementado en el flow de registro
- [ ] Lista de 50 targets de outreach: preparada en Notion
- [ ] Perfil de demo: publicado y revisado en móvil

### Sem 1 (27 jun – 4 jul)
- [ ] **Lunes 29 jun, 9:00 CET:** publicar post en IH y Reddit r/SideProject
- [ ] **Lunes 29 jun:** enviar primeros 20 outreaches
- [ ] **Mar-mié 30 jun – 1 jul:** responder TODOS los comentarios
- [ ] **Mié-jue 1-2 jul:** enviar siguiente tanda de outreaches (30 restantes)
- [ ] **Vie 3 jul:** grabar y publicar Reel 1
- [ ] Tracking diario: registros, perfiles publicados, respuestas de outreach

---

*Siguiente bloque de copy: Sem 2 — update de progreso IH + post de r/Entrepreneur + Reel 2.*
