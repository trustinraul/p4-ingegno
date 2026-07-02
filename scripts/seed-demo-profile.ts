/**
 * Seed del perfil demo "leonardo" en producción.
 * Idempotente: re-ejecutable sin duplicar datos.
 *
 * Uso: npx tsx --env-file=.env.local scripts/seed-demo-profile.ts
 */
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

const USERNAME = 'leonardo'
const DEMO_EMAIL = 'rcalvosanz+leonardo@gmail.com'

async function getOrCreateUserId(): Promise<string> {
  const { data: existing, error } = await admin
    .from('profiles')
    .select('id')
    .eq('username', USERNAME)
    .maybeSingle()
  if (error) throw error
  if (existing) {
    console.log('Profile row already exists, reusing user', existing.id)
    return existing.id
  }
  const { data, error: createError } = await admin.auth.admin.createUser({
    email: DEMO_EMAIL,
    // Nadie necesita loguearse como leonardo; recuperable vía reset de email si hiciera falta.
    password: `${randomUUID()}Aa1!`,
    email_confirm: true,
  })
  if (createError) throw createError
  console.log('Created auth user', data.user.id)
  return data.user.id
}

async function uploadImage(bucket: string, path: string, localPath: string): Promise<string> {
  const file = await readFile(localPath)
  const { error } = await admin.storage
    .from(bucket)
    .upload(path, file, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  const { data } = admin.storage.from(bucket).getPublicUrl(path)
  console.log('Uploaded', bucket, path)
  return data.publicUrl
}

async function main() {
  const userId = await getOrCreateUserId()

  const avatarUrl = await uploadImage(
    'avatars', `${userId}/avatar.jpg`, '_resources/brand/davinci_self_portrait.jpg')
  const coverCodice = await uploadImage(
    'project-images', `${userId}/codice-cover.jpg`, '_resources/brand/davinci_notebook_anatomy.jpg')
  const coverOrnithopter = await uploadImage(
    'project-images', `${userId}/ornithopter-cover.jpg`, '_resources/brand/davinci_codex_flight.jpg')
  const coverProportions = await uploadImage(
    'project-images', `${userId}/proportions-cover.jpg`, '_resources/brand/davinci_vitruvian_man.jpg')

  const { error: profileError } = await admin.from('profiles').upsert({
    id: userId,
    username: USERNAME,
    full_name: 'Leonardo Bianchi',
    tagline: "I design interfaces, build flying machines, and draw what I can't build yet.",
    roles: [
      'Product Designer',
      'Creative Technologist',
      'Illustrator',
      'Drone Builder',
      'Writer',
      'Indie Maker',
    ],
    narrative: `I was told, repeatedly, to pick a lane. Design or engineering. Art or code. I tried — it didn't take.

By day I design product interfaces for early-stage teams. Evenings belong to the workshop: for the past two years I've been building flapping-wing aircraft from carbon rod, mylar, and the occasional broken promise. In between, I draw. The posters started as proportion studies for a client's brand and became a small printed series of their own.

None of this is a pivot. It's one practice with different instruments. The sketches inform the interfaces, the machines discipline the sketches, and the writing keeps all of it honest. This page is where the whole thing finally lives in one place — which, until now, it never did.`,
    avatar_url: avatarUrl,
    contact_email: DEMO_EMAIL,
    links: [
      { type: 'website', label: 'Digital archive', url: 'https://www.leonardodigitale.com' },
      { type: 'custom', label: 'Sketchbook shelf', url: 'https://commons.wikimedia.org/wiki/Leonardo_da_Vinci' },
    ],
    plan: 'pro',
    is_public: true,
  })
  if (profileError) throw profileError
  console.log('Profile upserted')

  // Idempotencia: borrar contenido previo del demo antes de insertar
  await admin.from('updates').delete().eq('user_id', userId)
  await admin.from('projects').delete().eq('user_id', userId)

  const { error: projectsError } = await admin.from('projects').insert([
    {
      user_id: userId,
      name: 'Codice',
      description:
        'An open-source digital notebook that treats sketches, notes, and code as one connected surface. No folders, no modes — just pages that link. Built because every tool I tried made me choose what kind of thinking I was allowed to do.',
      status: 'launched',
      url: null,
      display_order: 0,
      cover_image_url: coverCodice,
    },
    {
      user_id: userId,
      name: 'Ornithopter No. 4',
      description:
        'A flapping-wing aircraft built from carbon rod and mylar, designed entirely in my notebooks first. Numbers one through three hang on the wall as reminders. This one flew forty-one seconds last week.',
      status: 'in_progress',
      url: null,
      display_order: 1,
      cover_image_url: coverOrnithopter,
    },
    {
      user_id: userId,
      name: 'Proportion Studies',
      description:
        'A printed poster series translating classical proportion systems — Vitruvius, the golden section, musical ratios — into contemporary typography. Edition of fifty, numbered by hand.',
      status: 'launched',
      url: null,
      display_order: 2,
      cover_image_url: coverProportions,
    },
  ])
  if (projectsError) throw projectsError
  console.log('Projects inserted')

  const { error: updatesError } = await admin.from('updates').insert([
    {
      user_id: userId,
      content:
        'Ornithopter No. 4 survived its first sustained flight today — 41 seconds. The wing linkage finally holds under load. Filming the next test.',
      created_at: '2026-06-14T18:20:00Z',
    },
    {
      user_id: userId,
      content:
        'Codice v0.3 is out: linked sketches now render inline inside notes. Small feature, huge difference in how it feels to think in it.',
      created_at: '2026-06-23T09:45:00Z',
    },
    {
      user_id: userId,
      content:
        'Started sketching a fifth wing design between client work. Lighter spar, longer stroke. Old notebooks keep paying rent.',
      created_at: '2026-06-30T21:10:00Z',
    },
  ])
  if (updatesError) throw updatesError
  console.log('Updates inserted')

  console.log('\n✅ Done → https://ingegno.app/leonardo')
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
