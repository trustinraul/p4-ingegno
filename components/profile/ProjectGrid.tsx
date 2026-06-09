'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from '@/components/ui/icons'
import { cn, getDomainFromUrl } from '@/lib/utils'
import { getVisibleProjects, getLockedProjects } from '@/lib/plan'
import type { Project } from '@/lib/types'

interface ProjectGridProps {
  projects: Project[]
  plan: 'free' | 'pro'
  isOwner?: boolean
}

export default function ProjectGrid({ projects, plan, isOwner }: ProjectGridProps) {
  const visible = getVisibleProjects(projects, plan)
  const locked = getLockedProjects(projects, plan)

  return (
    <section className="py-24 px-8 md:px-20 bg-black">
      {projects.length === 0 ? (
        <div className="border border-white/[0.08] rounded-[1.25rem] p-12 text-center text-sm text-white/45 font-body flex flex-col items-center gap-3">
          <span>No projects yet.</span>
          {isOwner && (
            <a href="/dashboard/profile" className="text-white/60 hover:text-white transition-colors">
              Add your first project →
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visible.map((project, i) => {
            const domain = project.url ? getDomainFromUrl(project.url) : null
            return (
              <motion.div
                key={project.id}
                initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
                whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
                className="border border-white/[0.08] rounded-[1.25rem] p-7 min-h-[240px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        project.status === 'launched' ? 'bg-green-400' : 'bg-yellow-400'
                      )}
                    />
                    <span className="text-xs font-body text-white/45 capitalize">
                      {project.status === 'in_progress' ? 'In progress' : 'Launched'}
                    </span>
                  </div>

                  <p className="font-heading italic text-white text-3xl leading-snug mb-3">
                    {project.name}
                  </p>

                  {project.description && (
                    <p className="text-sm font-body text-white/55 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>

                {project.url && domain && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-body text-white/55 hover:text-white/85 transition-colors mt-5 cursor-pointer"
                  >
                    <ArrowUpRight />
                    {domain}
                  </a>
                )}
              </motion.div>
            )
          })}

          {locked.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: (visible.length + i) * 0.1 }}
              className="border border-white/[0.08] rounded-[1.25rem] p-7 min-h-[240px] flex flex-col justify-between relative overflow-hidden"
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20 z-10" />

              {/* Lock overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/45"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <p className="text-xs font-body text-white/45 text-center px-4">
                  Upgrade to Pro to unlock
                </p>
              </div>

              {/* Blurred content behind */}
              <div className="opacity-30">
                <p className="font-heading italic text-white text-3xl leading-snug">
                  {project.name}
                </p>
                {project.description && (
                  <p className="text-sm font-body text-white/55 leading-relaxed mt-3">
                    {project.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
