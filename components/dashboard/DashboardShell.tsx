'use client'

import { useState } from 'react'
import DashboardNav from './DashboardNav'

interface DashboardShellProps {
  username: string
  isPublic: boolean
  children: React.ReactNode
}

export default function DashboardShell({ username, isPublic, children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex">
      <DashboardNav
        username={username}
        isPublic={isPublic}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((c) => !c)}
      />
      <main
        className={`flex-1 min-w-0 p-5 md:p-8 min-h-screen transition-all duration-200 ml-16 ${
          isCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
