'use client'

import { useState, useTransition } from 'react'
import { deleteProject, moveProjectUp, moveProjectDown } from '@/app/actions/projects'
import { publishProjectCollage } from '@/app/actions/collage'
import ProjectForm from './ProjectForm'
import CollagePublisher from './CollagePublisher'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  url: string | null
  display_order: number
}

interface CollageModal {
  projectId: string
  projectName: string
  proposedImages: string[]
}

interface ProjectsClientProps {
  projects: Project[]
  lockedIds: string[]
  collageProjectIds: string[]
}

export default function ProjectsClient({ projects, lockedIds, collageProjectIds }: ProjectsClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [collageModal, setCollageModal] = useState<CollageModal | null>(null)
  const [collagePendingId, setCollagePendingId] = useState<string | null>(null)
  const [collageError, setCollageError] = useState<string | null>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [isDeleting, startDelete] = useTransition()

  const lockedSet = new Set(lockedIds)
  const collageSet = new Set(collageProjectIds)

  async function handleCollageClick(project: Project) {
    setCollagePendingId(project.id)
    setCollageError(null)
    const result = await publishProjectCollage(project.id)
    setCollagePendingId(null)
    if (result.error) {
      setCollageError(result.error)
      return
    }
    setCollageModal({
      projectId: project.id,
      projectName: project.name,
      proposedImages: result.proposedImages,
    })
  }

  return (
    <div className="space-y-4">
      {collageModal && (
        <CollagePublisher
          projectId={collageModal.projectId}
          projectName={collageModal.projectName}
          proposedImages={collageModal.proposedImages}
          onClose={() => setCollageModal(null)}
        />
      )}

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="liquid-glass rounded-[1rem] px-5 py-2.5 text-sm font-body text-white/85 hover:text-white border border-white/[0.1] hover:border-white/20 transition-colors cursor-pointer"
        >
          + Add project
        </button>
      )}

      {showAddForm && (
        <ProjectForm onClose={() => setShowAddForm(false)} />
      )}

      {projects.length === 0 && !showAddForm && (
        <p className="text-sm font-body text-white/55">
          No projects yet. Add your first project to showcase your work.
        </p>
      )}

      {collageError && (
        <p className="text-sm font-body text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-xl px-4 py-3">
          {collageError}
        </p>
      )}

      <div className="space-y-3">
        {projects.map((project, idx) => {
          const isLocked = lockedSet.has(project.id)
          const hasCollage = collageSet.has(project.id)
          const isLoadingCollage = collagePendingId === project.id

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
                      <span className="text-xs font-body text-white/45 border border-white/10 px-2.5 py-0.5 rounded-full">
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
                      className="text-xs font-body text-white/45 hover:text-white/75 transition-colors mt-1 inline-block truncate max-w-xs"
                    >
                      {project.url}
                    </a>
                  )}

                  {project.status === 'launched' && (
                    <button
                      onClick={() => handleCollageClick(project)}
                      disabled={isLoadingCollage}
                      className="mt-3 text-xs font-body text-violet-400/70 hover:text-violet-400 border border-violet-400/20 hover:border-violet-400/40 rounded-full px-3 py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingCollage
                        ? 'Loading…'
                        : hasCollage
                        ? 'Edit collage'
                        : 'Publish collage →'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <form action={moveProjectUp.bind(null, project.id)}>
                    <button
                      type="submit"
                      disabled={idx === 0}
                      className="p-2 text-white/45 hover:text-white/85 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveProjectDown.bind(null, project.id)}>
                    <button
                      type="submit"
                      disabled={idx === projects.length - 1}
                      className="p-2 text-white/45 hover:text-white/85 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </form>
                  <button
                    onClick={() => setEditingId(project.id)}
                    className="p-2 text-white/45 hover:text-white/85 transition-colors text-sm font-body cursor-pointer"
                  >
                    Edit
                  </button>
                  {confirmingDeleteId === project.id ? (
                    <>
                      <button
                        onClick={() =>
                          startDelete(async () => {
                            await deleteProject(project.id)
                            setConfirmingDeleteId(null)
                          })
                        }
                        disabled={isDeleting}
                        className="p-2 text-red-400/80 hover:text-red-400 transition-colors text-sm font-body cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? 'Deleting…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(null)}
                        disabled={isDeleting}
                        className="p-2 text-white/45 hover:text-white/85 transition-colors text-sm font-body cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmingDeleteId(project.id)}
                      className="p-2 text-white/45 hover:text-red-400/70 transition-colors text-sm font-body cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
