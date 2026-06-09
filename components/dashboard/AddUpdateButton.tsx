'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UpdateForm from './UpdateForm'

interface Project {
  id: string
  name: string
}

export default function AddUpdateButton({ projects }: { projects: Project[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  function handleSuccess() {
    setIsOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="liquid-glass rounded-full px-5 py-2.5 text-sm font-body text-white/70 hover:text-white transition-colors flex items-center gap-2"
      >
        <span className="text-base leading-none">+</span>
        Add Update
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}
        >
          <div className="liquid-glass-strong rounded-[1.5rem] p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading italic text-white text-xl">New update.</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/45 hover:text-white/70 transition-colors text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <UpdateForm projects={projects} onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </>
  )
}
