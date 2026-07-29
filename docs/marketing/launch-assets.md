# Ingegno — Assets de lanzamiento · SEGUNDA VERSIÓN

> ⚠️ **NO es el original.** El copy de campaña ya existía: `copy-semanas-0-1.md`, escrito el
> **24 jun 2026**, contiene el post de lanzamiento, los tres templates de outreach, el email de
> bienvenida, el guion del Reel 1 y templates de respuesta a comentarios.
>
> Este documento se escribió el **26 jul 2026 sin saber que el otro existía** — la campaña en Notion
> tenía todas las casillas en ⬜ y me fié de eso en vez de mirar el repo. Error de Jarvis, registrado.
>
> **Qué aporta esta versión frente a la del 24 jun:**
> - Ángulo distinto: arranca por Raúl como usuario del problema (los 18 años, las cuatro cosas a la vez), el producto no aparece hasta el cuarto párrafo
> - Dice explícitamente que hay **casi cero usuarios** — desarma la sospecha antes de que la formulen
> - Convierte **"no hay pagos activos"** en argumento en vez de omitirlo
> - **Versión aparte para Reddit**, más corta y seca (el registro de IH allí suena a nota de prensa)
> - Fechas actualizadas al lanzamiento real del 3 ago
>
> **Qué tiene el original y esto no:** guion del Reel 1 y templates de respuesta a comentarios.
>
> **DECISIÓN PENDIENTE:** leer los dos posts en voz alta y elegir uno. No mezclarlos a medias.
>
> ---
>
> **Lanzamiento: lunes 3 ago 2026, 9:00 CET** · Indie Hackers + Reddit r/SideProject
>
> **Principio que gobierna todo esto:** no tienes tracción, así que no la finjas. Lo único que
> tienes es una historia verdadera y un producto que funciona. Ambas cosas bastan si no las
> adornas. En IH y en Reddit el olor a marketing mata un post más rápido que la falta de usuarios.

---

## 1. Post de lanzamiento — Indie Hackers

**Título:**
> I'm 18 and I built a home for people who can't answer "so what do you do?"

**Cuerpo:**

Every time someone asks what I do, the answer changes depending on who's asking.

To clients I'm a web developer — I've shipped sites for local businesses in my city. To the people who follow me I'm someone who posts about training and building things. For the last month I've been building an AI assistant that runs on a VPS and manages my week. In September I start a Computer Science degree.

None of those are lies. But there's no single place I can point at and say "this is me."

GitHub shows code and nothing else. LinkedIn makes me sound like a corporate intern. Linktree is a pile of links with no story behind them. Notion public pages are functional and ugly. Carrd is cheap and looks it. Framer and Webflow are professional tools for people whose actual job is design.

So I built the thing I wanted to exist: **ingegno.app**

One URL — `ingegno.app/yourname` — that holds who you are, what you're building, and how it's going. A narrative section where you explain the thread that connects your work, because the thread is the part nobody can see. A project grid with real status, not just links. And an activity feed that pulls your GitHub commits automatically, so the page keeps moving even when you forget it exists.

The name is Italian. *Ingegno* was Da Vinci's word for the creative intelligence that connects disciplines instead of picking one. Felt like the right thing to name it after.

**Where it honestly is right now:**

It works end to end. Sign up, claim a username, write your profile, connect GitHub, publish. There's a demo profile at `ingegno.app/leonardo` if you want to see the output before signing up for anything.

It has close to zero users, because I'm posting this on day one. I'd rather say that than let you assume otherwise.

Everything is free, and I left payments out on purpose. There's a Pro tier planned — unlimited projects, no badge, €9/month — but I'm not switching it on until enough people use this that I know what's actually worth charging for. Right now there is nothing to buy even if you wanted to.

Built with Next.js, Supabase and Vercel. Over one summer, mostly alone.

**What I actually want to know:**

- Is "so what do you do?" a real problem for you, or is it just my problem?
- If you make a profile and then *don't* share it — I want to know why. That's the failure I can't see from here.
- What's the first thing that felt missing?

I'm around all day and I'll answer every comment.

---

## 2. Post de lanzamiento — Reddit r/SideProject

> **No copies el de IH.** Reddit castiga lo que suena a nota de prensa. Más corto, más seco,
> menos estructura. Y **lee las reglas del sidebar antes de postear** — cambian.

**Título:**
> I'm 18 and I built a profile page for people who do too many things to explain

**Cuerpo:**

I do a few things at once — freelance web dev, posting content, building an AI assistant for myself, and I start a CS degree in September. Every time someone asks what I do I pick whichever answer fits the room.

The tools for this are all wrong. GitHub is just code. LinkedIn wants a job title. Linktree is links with no story. Notion pages are ugly. Framer is for designers.

So I built ingegno.app. One URL with your name on it: a written narrative of the thread connecting your work, a project grid with real status, and an activity feed that syncs your GitHub commits so it doesn't go stale.

Demo profile: ingegno.app/leonardo

Honest status: launched today, basically no users, everything free. There's a paid tier planned but I haven't built payments in yet — I want to see what people actually use first. Nothing to buy.

Next.js + Supabase + Vercel, built over the summer.

If you look at it, the thing I want to hear is what made you close the tab.

---

## 3. Templates de outreach (×3)

> **Reglas:** máximo 5-6 líneas. **Nunca vender en el primer mensaje.** Referencia algo REAL suyo
> — si no puedes rellenar el hueco con algo concreto, no es tu target, pasa al siguiente.
> 50 mensajes personalizados baten a 500 copiados, y en el segundo caso te banean.

### 3.1 — Indie hackers / builders

> Hey [name] — saw you're working on [proyecto específico] alongside [la otra cosa que hacen].
>
> I built something for exactly that combination. It's a single page that holds all your projects with a written narrative of how they connect, plus it auto-syncs your GitHub commits so it stays current: ingegno.app
>
> It's free and brand new — I'm looking for people to break it more than anything. Example: ingegno.app/leonardo
>
> No pitch, genuinely just want to know if it's useful.

### 3.2 — Diseñadores / creadores multidisciplinares

> Hi [name] — your work caught my attention because [algo concreto: la mezcla de disciplinas, un proyecto].
>
> I kept running into the same thing: portfolios that look like three different people made them. So I built ingegno.app — one page where the different sides of your work sit together with a narrative explaining the thread, instead of pretending you only do one thing.
>
> Free, just launched. Example page: ingegno.app/leonardo
>
> Would love to know whether it fits how you'd actually present your work.

### 3.3 — Student entrepreneurs

> Hey [name] — noticed you're building [proyecto] while studying. Same boat, I start CS in September.
>
> The annoying part for me was having nothing to send people. GitHub is just code, LinkedIn feels fake at our age. So I made ingegno.app — one link with your projects, your story and your GitHub activity in one place.
>
> Free, launched this week. Example: ingegno.app/leonardo
>
> If you try it, tell me what's missing — I'm still shaping it.

---

## 4. Email de bienvenida

> Se dispara al registro. **Un solo CTA: publicar el perfil.** El fracaso que hay que evitar no es
> que no se registren — es que se registren, dejen el perfil a medias y no lo publiquen nunca.

**Asunto:** Your ingegno.app/[username] is reserved

**Cuerpo:**

Hey [name],

Your username is yours: **ingegno.app/[username]**

Right now it's still private. Nobody can see it until you decide they can.

Three things and it's live:

1. **Your narrative** — a couple of paragraphs on what connects the things you do. This is the part no other tool gives you, and it's the part people actually read.
2. **One project** — that's the minimum to publish. Add more whenever.
3. **Hit "Make public"** — and the URL is live and shareable.

Ten minutes, honestly.

Optional but worth it: connect GitHub. Your commits sync to the activity feed on their own, so your page keeps moving without you touching it.

**[ Finish your profile → ]**

One thing — I built this alone and it launched days ago. If something breaks or feels off, reply to this email. It comes straight to me and I read all of them.

— Raúl

---

## Notas de uso

**El lunes 3 a las 9:00 CET:**

1. IH primero, Reddit unos minutos después. No a la vez.
2. **Responde a TODOS los comentarios ese día.** En IH la visibilidad del post depende de la
   actividad — un post sin respuestas se hunde. Está marcado como crítico en la campaña.
3. Los 50 outreaches se mandan el mismo día, escalonados. No los 50 de golpe.

**Lo que NO hay que hacer:**

- Inventar tracción, usuarios o waitlist. Un solo número falso y el post se vuelve en contra.
- Postear el mismo texto en varios subreddits. Es la forma más rápida de que te marquen como spam.
- Responder a las críticas defendiéndote. En estos sitios, encajar bien una crítica dura vende
  más producto que el propio post.
- Mencionar el precio como si ya se cobrara. **No hay pagos activos** — decirlo es una ventaja,
  no una debilidad.

**El karma sigue siendo el riesgo real.** 12 puntos con cuenta de 5 años. 30 min diarios comentando
en r/SideProject, r/indiehackers y r/Entrepreneur desde hoy hasta el lanzamiento. Los filtros pesan
más el comment karma que el de posts.

**Si el post de Reddit desaparece:** no lo repostees. Escribe a los moderadores por modmail y
pregunta. Repostear tras una eliminación automática es lo que convierte un filtro en un baneo.
