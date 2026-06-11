import type { ProfileLink, ProfileLinkType } from './types'

export interface PlatformDef {
  type: ProfileLinkType
  label: string
  placeholder: string
}

export const PLATFORMS: PlatformDef[] = [
  { type: 'github', label: 'GitHub', placeholder: 'github.com/username' },
  { type: 'x', label: 'X', placeholder: 'x.com/username' },
  { type: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
  { type: 'instagram', label: 'Instagram', placeholder: 'instagram.com/username' },
  { type: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@channel' },
  { type: 'website', label: 'Website', placeholder: 'yoursite.com' },
  { type: 'custom', label: 'Custom', placeholder: 'https://...' },
]

export const MAX_LINKS = 8

export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateLinks(links: ProfileLink[]): string | null {
  if (links.length > MAX_LINKS) return `Maximum ${MAX_LINKS} links allowed`
  for (const link of links) {
    if (!link.label || !link.label.trim()) return 'Each link needs a label'
    if (!isValidHttpUrl(link.url)) return `Invalid URL: ${link.url || '(empty)'}`
    if (link.label.length > 40) return 'Link label must be under 40 characters'
  }
  return null
}
