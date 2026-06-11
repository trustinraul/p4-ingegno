import { describe, it, expect } from 'vitest'
import { normalizeUrl, isValidHttpUrl, validateLinks, PLATFORMS } from './links'
import type { ProfileLink } from './types'

describe('normalizeUrl', () => {
  it('prepends https:// when no scheme present', () => {
    expect(normalizeUrl('github.com/raul')).toBe('https://github.com/raul')
  })
  it('leaves https URLs untouched', () => {
    expect(normalizeUrl('https://x.com/raul')).toBe('https://x.com/raul')
  })
  it('trims surrounding whitespace', () => {
    expect(normalizeUrl('  github.com/raul  ')).toBe('https://github.com/raul')
  })
})

describe('isValidHttpUrl', () => {
  it('accepts http and https', () => {
    expect(isValidHttpUrl('https://x.com')).toBe(true)
    expect(isValidHttpUrl('http://x.com')).toBe(true)
  })
  it('rejects other schemes and garbage', () => {
    expect(isValidHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isValidHttpUrl('not a url')).toBe(false)
  })
})

describe('PLATFORMS', () => {
  it('includes the curated set and custom', () => {
    const types = PLATFORMS.map((p) => p.type)
    expect(types).toContain('github')
    expect(types).toContain('x')
    expect(types).toContain('custom')
  })
})

describe('validateLinks', () => {
  const ok: ProfileLink[] = [{ type: 'github', label: 'GitHub', url: 'https://github.com/raul' }]

  it('returns null for a valid list', () => {
    expect(validateLinks(ok)).toBeNull()
  })
  it('rejects more than 8 links', () => {
    const many = Array.from({ length: 9 }, (): ProfileLink => ({ type: 'website', label: 'Site', url: 'https://a.com' }))
    expect(validateLinks(many)).toMatch(/maximum/i)
  })
  it('rejects an invalid url', () => {
    expect(validateLinks([{ type: 'website', label: 'Site', url: 'ftp://x' }])).toMatch(/url/i)
  })
  it('rejects an empty label', () => {
    expect(validateLinks([{ type: 'custom', label: '', url: 'https://a.com' }])).toMatch(/label/i)
  })
})
