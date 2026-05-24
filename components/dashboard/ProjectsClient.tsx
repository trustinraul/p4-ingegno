'use client'

import { useState } from 'react'
import { deleteProject, moveProjectUp, moveProjectDown } from '@/app/actions/projects'
import ProjectForm from './ProjectForm'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  url: string | null
  display_order: number
}

interface ProjectsClientProps {
  projects: Project[]
  lockedIds: string[]
}

export default function ProjectsClient({ projects, lockedIds }: ProjectsClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const lockedSet = new Set(lockedIds)

  return (
    <div className="space-y-4">
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="liquid-glass rounded-[1rem] px-5 py-2.5 text-sm font-body text-white/70 hover:text-white border border-white/[0.1] hover:border-white/20 transition-colors"
        >
          + Add project
        </button>
      )}

      {showAddForm && (
        <ProjectForm onClose={() => setShowAddForm(false)} />
      )}

      {projects.length === 0 && !showAddForm && (
        <p className="text-sm font-body text-white/40">
          No projects yet. Add your first project to showcase your work.
        </p>
      )}

      <div className="space-y-3">
        {projects.map((project, idx) => {
          const isLocked = lockedSet.has(project.id)

          if (editingId === project.id) {
            return (
              <ProjectForm
                key={project.id}
                project={project}
                onClose={() => setEditingId(null)}
              />
            )
          }

          return (
            <div
              key={project.id}
              className={cn(
                'liquid-glass rounded-[1.25rem] p-6 space-y-3 transition-opacity',
                isLocked && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-heading italic text-white text-lg leading-tight">
                      {project.name}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-body px-2.5 py-0.5 rounded-full border',
                        project.status === 'launched'
                          ? 'border-emerald-400/30 text-emerald-400/70'
                          : 'border-amber-400/30 text-amber-400/70'
                      )}
                    >
                      {project.status === 'launched' ? 'Launched' : 'In Progress'}
                    </span>
                    {isLocked && (
                      <span className="text-xs font-body text-white/30 border border-white/10 px-2.5 py-0.5 rounded-full">
                        Not visible (free plan)
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm font-body text-white/50 mt-1.5 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-body text-white/30 hover:text-white/60 transition-colors mt-1 inline-block truncate max-w-xs"
                    >
                      {project.url}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <form action={moveProjectUp.bind(null, project.id)}>
                    <button
                      type="submit"
                      disabled={idx === 0}
                      className="p-2 text-white/30 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveProjectDown.bind(null, project.id)}>
                    <button
                      type="submit"
                      disabled={idx === projects.length - 1}
                      className="p-2 text-white/30 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </form>
                  <button
                    onClick={() => setEditingId(project.id)}
                    className="p-2 text-white/30 hover:text-white/70 transition-colors text-sm font-body"
                  >
                    Edit
                  </button>
                  <form action={deleteProject.bind(null, project.id)}>
                    <button
                      type="submit"
                      className="p-2 text-white/20 hover:text-red-400/70 transition-colors text-sm font-body"
                      onClick={(e) => {
                        if (!confirm(`Delete "${project.name}"?`)) e.preventDefault()
                      }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
