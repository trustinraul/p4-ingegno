import type { Project } from './types'

export function canAddProject(_plan: 'free' | 'pro', _projectCount: number): boolean {
  return true // No limit on adding — gate is on visibility, not creation
}

export function getVisibleProjects(projects: Project[], plan: 'free' | 'pro'): Project[] {
  return plan === 'pro' ? projects : projects.slice(0, 2)
}

export function getLockedProjects(projects: Project[], plan: 'free' | 'pro'): Project[] {
  return plan === 'free' ? projects.slice(2) : []
}
