'use client'

import { useState, useTransition } from 'react'
import { confirmProjectCollage } from '@/app/actions/collage'
import Image from 'next/image'

interface CollagePublisherProps {
  projectId: string
  projectName: string
  proposedImages: string[]
  onClose: () => void
}

export default function CollagePublisher({
  projectId,
  projectName,
  proposedImages,
  onClose,
}: CollagePublisherProps) {
  const [images, setImages] = useState(proposedImages)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function moveUp(i: number) {
    if (i === 0) return
    const next = [...images]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    setImages(next)
  }

  function moveDown(i: number) {
    if (i === images.length - 1) return
    const next = [...images]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    setImages(next)
  }

  function confirm() {
    setError(null)
    startTransition(async () => {
      const result = await confirmProjectCollage(projectId, images)
      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="liquid-glass-strong rounded-[1.5rem] p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-6">
        <div>
          <h2 className="font-heading italic text-white text-2xl">Publish collage</h2>
          <p className="text-sm font-body text-white/55 mt-1">{projectName}</p>
        </div>

        <p className="text-xs font-body text-white/55 tracking-widest uppercase">
          Ingegno&apos;s proposed order — reorder before publishing
        </p>

        <div className="space-y-3">
          {images.map((url, i) => (
            <div key={url} className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" unoptimized />
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="text-white/45 hover:text-white/85 disabled:opacity-20 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(i)}
                  disabled={i === images.length - 1}
                  className="text-white/45 hover:text-white/85 disabled:opacity-20 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  ↓
                </button>
              </div>
              <span className="text-xs font-body text-white/45">
                {i + 1} / {images.length}
              </span>
            </div>
          ))}
        </div>

        {error && <p className="text-sm font-body text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={confirm}
            disabled={isPending}
            className="flex-1 bg-white text-black font-body text-sm font-medium rounded-full py-3 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? 'Publishing…' : 'Publish collage'}
          </button>
          <button
            onClick={onClose}
            className="px-5 text-sm font-body text-white/55 hover:text-white/85 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
