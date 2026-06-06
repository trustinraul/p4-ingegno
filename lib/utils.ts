import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export function validateImageUpload(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Only JPEG, PNG, WebP, or GIF images are allowed'
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image must be under 5 MB'
  }
  return null
}
