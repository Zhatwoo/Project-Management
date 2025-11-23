"use client"

import React, { useEffect, useState } from 'react'
import ProjectsDashboard from './projectsdashboard'
import ProjectMembers from './projectsmembers'
import Backlog from './backlog'
import KanbanBoard from './kanbanboard'
import CalendarView from './calendarview'
import Reports from './reports'
import CreateProjectModal from './createprojectmodal'

const ITEMS = [
  { id: 'dashboard', label: 'Projects Dashboard', icon: ProjectsIcon, comp: ProjectsDashboard },
  { id: 'members', label: 'Project Members', icon: UsersIcon, comp: ProjectMembers },
  { id: 'backlog', label: 'Backlog', icon: BacklogIcon, comp: Backlog },
  { id: 'kanban', label: 'Kanban', icon: KanbanIcon, comp: KanbanBoard },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon, comp: CalendarView },
  { id: 'reports', label: 'Reports', icon: ReportsIcon, comp: Reports },
]

export default function SidebarPM() {
  const [active, setActive] = useState(0)
  const [openCreate, setOpenCreate] = useState(false)

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
    if (hash) {
      const idx = ITEMS.findIndex(i => i.id === hash)
      if (idx >= 0) setActive(idx)
    }
  }, [])

  function onNavigate(i) {
    setActive(i)
    if (typeof window !== 'undefined') window.location.hash = ITEMS[i].id
  }

  const ActiveComp = ITEMS[active].comp

  return (
    <div className="min-h-[calc(100vh-7rem)] flex bg-white">
      <nav className="w-20 border-r border-gray-100 bg-white sticky top-16 self-start h-[calc(100vh-7rem)] flex flex-col items-center py-4 gap-4">
        <div className="w-full flex flex-col items-center gap-3">
          <div className="relative group w-full flex justify-center">
            <button
              aria-label="Create project"
              title="Create project"
              onClick={() => setOpenCreate(true)}
              className="w-11 h-11 flex items-center justify-center rounded-lg transition text-black hover:bg-slate-50"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">New Project</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center mt-2 gap-3 w-full">
          {ITEMS.map((item, i) => {
            const Icon = item.icon
            const isActive = active === i
            return (
              <div key={item.id} className="relative group w-full flex justify-center">
                <button
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => onNavigate(i)}
                  className={`w-11 h-11 flex items-center justify-center rounded-lg transition ${isActive ? 'bg-[#EF4444] text-white shadow' : 'text-black hover:bg-slate-50'}`}
                >
                  <Icon className="w-5 h-5" />
                </button>

                <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
              </div>
            )
          })}
        </div>

      </nav>

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <ActiveComp />
        </div>
      </main>

      {openCreate && <CreateProjectModal open={openCreate} onClose={() => setOpenCreate(false)} onCreate={(p) => { setOpenCreate(false); /* optionally add project to state */ }} />}
    </div>
  )
}

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProjectsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M3 7h18" />
      <path d="M6 21V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
      <path d="M10 11h4v4h-4z" />
    </svg>
  )
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11z" />
      <path d="M6 11c1.657 0 3-1.567 3-3.5S7.657 4 6 4 3 5.567 3 7.5 4.343 11 6 11z" />
      <path d="M2 20c0-2.5 3-4.5 6-4.5s6 2 6 4.5" />
      <path d="M12 20c0-2.5 3-4.5 6-4.5s6 2 6 4.5" />
    </svg>
  )
}

function BacklogIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

function KanbanIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="6" height="18" rx="1" />
      <rect x="10" y="7" width="6" height="14" rx="1" />
      <rect x="17" y="11" width="4" height="10" rx="1" />
    </svg>
  )
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  )
}

function ReportsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 13v6M12 9v10M17 5v14" />
    </svg>
  )
}
