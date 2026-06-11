import { describe, it, expect } from 'vitest'
import { canAddProject, getVisibleProjects, getLockedProjects } from './plan'
import type { Project } from './types'

const makeProject = (i: number): Project => ({
  id: `p${i}`,
  user_id: 'u1',
  name: `Project ${i}`,
  description: null,
  status: 'in_progress',
  url: null,
  cover_image_url: null,
  display_order: i,
  created_at: new Date().toISOString(),
})

describe('canAddProject', () => {
  it('always returns true regardless of plan or count', () => {
    expect(canAddProject('free', 0)).toBe(true)
    expect(canAddProject('free', 10)).toBe(true)
    expect(canAddProject('pro', 100)).toBe(true)
  })
})

describe('getVisibleProjects', () => {
  const projects = [makeProject(1), makeProject(2), makeProject(3)]

  it('returns first 2 for free plan', () => {
    expect(getVisibleProjects(projects, 'free')).toHaveLength(2)
    expect(getVisibleProjects(projects, 'free')[0].id).toBe('p1')
  })

  it('returns all for pro plan', () => {
    expect(getVisibleProjects(projects, 'pro')).toHaveLength(3)
  })
})

describe('getLockedProjects', () => {
  const projects = [makeProject(1), makeProject(2), makeProject(3)]

  it('returns projects beyond 2 for free plan', () => {
    expect(getLockedProjects(projects, 'free')).toHaveLength(1)
    expect(getLockedProjects(projects, 'free')[0].id).toBe('p3')
  })

  it('returns empty array for pro plan', () => {
    expect(getLockedProjects(projects, 'pro')).toHaveLength(0)
  })
})
