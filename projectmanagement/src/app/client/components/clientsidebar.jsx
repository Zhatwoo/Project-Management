"use client";

import React, { useEffect, useState } from 'react';
import ClientProjectOverview from './clientprojectoverview';
import Deliverables from './deliverables';
import ReadOnlyTaskList from './readonlytasklist';
import FilesPage from './filespage';
import DiscussionPage from './discussionpage';
import ActivityLog from './activitylog';

// Icon Components
function OverviewIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function DeliverablesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function TasksIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function FilesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function DiscussionIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function ActivityIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const ITEMS = [
  { 
    id: 'overview', 
    label: 'Project Overview', 
    description: 'See your project progress and timeline',
    icon: OverviewIcon, 
    comp: ClientProjectOverview 
  },
  { 
    id: 'deliverables', 
    label: 'Deliverables', 
    description: 'Review and approve work submitted by the team',
    icon: DeliverablesIcon, 
    comp: Deliverables 
  },
  { 
    id: 'tasks', 
    label: 'Task List', 
    description: 'View all project tasks and their status',
    icon: TasksIcon, 
    comp: ReadOnlyTaskList 
  },
  { 
    id: 'files', 
    label: 'Files', 
    description: 'Access and share project files',
    icon: FilesIcon, 
    comp: FilesPage 
  },
  { 
    id: 'discussions', 
    label: 'Discussions', 
    description: 'Chat with your team about the project',
    icon: DiscussionIcon, 
    comp: DiscussionPage 
  },
  { 
    id: 'activity', 
    label: 'Activity Log', 
    description: 'See everything that happened in the project',
    icon: ActivityIcon, 
    comp: ActivityLog 
  },
];

export default function ClientSidebar() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (hash) {
      const idx = ITEMS.findIndex(i => i.id === hash);
      if (idx >= 0) setActive(idx);
    }
  }, []);

  function onNavigate(i) {
    setActive(i);
    if (typeof window !== 'undefined') window.location.hash = ITEMS[i].id;
  }

  const ActiveComp = ITEMS[active].comp;

  return (
    <div className="min-h-[calc(100vh-7rem)] flex bg-white">
      <nav className="w-20 border-r border-gray-200 bg-white sticky top-16 self-start h-[calc(100vh-7rem)] flex flex-col items-center py-5 gap-4 shadow-sm">
        {/* Navigation Items */}
        <div className="flex-1 flex flex-col items-center gap-1 w-full px-2">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = active === i;
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
                <div className="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs font-semibold px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50 max-w-xs">
                  <div className="font-semibold">{item.label}</div>
                  {item.description && (
                    <div className="text-xs font-normal text-gray-300 mt-1 whitespace-normal max-w-[200px]">
                      {item.description}
                    </div>
                  )}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-gray-900 border-b-4 border-b-transparent"></span>
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <ActiveComp />
      </main>
    </div>
  );
}

