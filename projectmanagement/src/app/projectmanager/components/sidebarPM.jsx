"use client"

import React, { useEffect, useState } from 'react'
import ProjectsDashboard from './projectsdashboard'
import Backlog from './backlog'
import KanbanBoard from './kanbanboard'
import CalendarView from './calendarview'
import Reports from './reports'
import CreateEditProject from './createeditproject'
import AddMembers from './addmembers'
import CreateTask from './createtask'
import AssignMember from './assignmember'
import MonitorProgress from './monitorprogress'

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ProjectsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 7h18" />
      <path d="M6 21V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
      <path d="M10 11h4v4h-4z" />
    </svg>
  )
}

function BacklogIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

function KanbanIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="6" height="18" rx="1" />
      <rect x="10" y="7" width="6" height="14" rx="1" />
      <rect x="17" y="11" width="4" height="10" rx="1" />
    </svg>
  )
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  )
}

function ReportsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 13v6M12 9v10M17 5v14" />
    </svg>
  )
}

const ITEMS = [
  { id: 'dashboard', label: 'Projects Dashboard', icon: ProjectsIcon },
  { id: 'backlog', label: 'Backlog', icon: BacklogIcon },
  { id: 'kanban', label: 'Kanban', icon: KanbanIcon },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'reports', label: 'Reports', icon: ReportsIcon },
]

export default function SidebarPM() {
  const [active, setActive] = useState(0)
  const [view, setView] = useState('main') // main, assignMember, monitorProgress
  const [openCreateProject, setOpenCreateProject] = useState(false)
  const [openAddMembers, setOpenAddMembers] = useState(false)
  const [openCreateTask, setOpenCreateTask] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [currentTask, setCurrentTask] = useState(null)
  const [projectMembers, setProjectMembers] = useState([])

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
    if (hash) {
      const idx = ITEMS.findIndex(i => i.id === hash)
      if (idx >= 0) setActive(idx)
    }
  }, [])

  function onNavigate(i) {
    setActive(i)
    setView('main')
    if (typeof window !== 'undefined') window.location.hash = ITEMS[i].id
  }

  function renderContent() {
    if (view === 'assignMember') {
      return (
        <AssignMember
          task={currentTask}
          members={projectMembers}
          onBack={() => setView('createTask')}
          onSave={(assignedMembers) => {
            setView('main')
            setActive(0) // Go back to dashboard
          }}
        />
      )
    }
    if (view === 'monitorProgress') {
      return (
        <MonitorProgress
          project={currentProject}
          tasks={[]} // You can pass actual tasks here
          onBack={() => {
            setView('main')
            setActive(0) // Go back to dashboard
          }}
        />
      )
    }

    // Main views
    switch (active) {
      case 0:
        return (
          <ProjectsDashboard
            onCreateProject={() => setOpenCreateProject(true)}
            onAddMembers={() => setOpenAddMembers(true)}
            onMonitorProgress={() => setView('monitorProgress')}
          />
        )
      case 1:
        return <Backlog onCreateTask={() => setOpenCreateTask(true)} />
      case 2:
        return <KanbanBoard onCreateTask={() => setOpenCreateTask(true)} />
      case 3:
        return <CalendarView onCreateTask={() => setOpenCreateTask(true)} />
      case 4:
        return <Reports />
      default:
        return <ProjectsDashboard />
    }
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] flex bg-white">
      <nav className="w-20 border-r border-gray-200 bg-white sticky top-16 self-start h-[calc(100vh-7rem)] flex flex-col items-center py-5 gap-4 shadow-sm">
        {/* Create Project Button */}
        {(view === 'main' || view === 'monitorProgress') && (
          <div className="w-full flex flex-col items-center px-2">
            <div className="relative group w-full flex justify-center">
              <button
                aria-label="Create project"
                title="Create project"
                onClick={() => {
                  setCurrentProject(null)
                  setOpenCreateProject(true)
                }}
                className="w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 text-white bg-gradient-to-br from-[#EF4444] to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg hover:scale-105"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
              <span className="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs font-semibold px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
                New Project
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-gray-900 border-b-4 border-b-transparent"></span>
              </span>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-10 h-px bg-gray-200"></div>

        {/* Navigation Items */}
        {(view === 'main' || view === 'monitorProgress') && (
          <div className="flex-1 flex flex-col items-center gap-1 w-full px-2">
            {ITEMS.map((item, i) => {
              const Icon = item.icon
              const isActive = active === i
              return (
                <div key={item.id} className="relative group w-full flex justify-center">
                  <button
                    aria-label={item.label}
                    title={item.label}
                    onClick={() => onNavigate(i)}
                    className={`relative w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#EF4444] text-white shadow-lg shadow-red-200/50 scale-105' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#EF4444] rounded-r-full"></div>
                    )}
                    <Icon className="w-5 h-5 transition-transform" />
                  </button>

                  {/* Tooltip */}
                  <span className="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs font-semibold px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
                    {item.label}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-gray-900 border-b-4 border-b-transparent"></span>
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="w-full px-2">
          <div className="w-full h-px bg-gray-200 mb-2"></div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>

      {/* Modals */}
      <CreateEditProject
        open={openCreateProject}
        project={currentProject}
        onClose={() => setOpenCreateProject(false)}
        onSave={(project) => {
          setCurrentProject(project)
          setOpenCreateProject(false)
          setOpenAddMembers(true)
        }}
      />

      <AddMembers
        open={openAddMembers}
        project={currentProject}
        members={projectMembers}
        onClose={() => setOpenAddMembers(false)}
        onSave={(members) => {
          setProjectMembers(members)
          setOpenAddMembers(false)
        }}
      />

      <CreateTask
        open={openCreateTask}
        project={currentProject}
        onClose={() => setOpenCreateTask(false)}
        onSave={(task) => {
          setCurrentTask(task)
          setOpenCreateTask(false)
          setView('assignMember')
        }}
      />
    </div>
  )
}
