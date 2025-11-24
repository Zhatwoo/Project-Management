"use client"

import React, { useState, useEffect } from "react";
import OrganizationDashboard from "./organizationdashboard";
import UserManagement from "./usermanagement";
import AllProjects from "./allprojects";

const ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'users', label: 'Users', icon: UsersIcon },
  { id: 'projects', label: 'Projects', icon: ProjectsIcon },
];

export default function OrgSidebar() {
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

  return (
    <div className="min-h-[calc(100vh-7rem)] flex bg-white">
      <nav className="w-20 border-r border-gray-200 bg-white sticky top-16 self-start h-[calc(100vh-7rem)] flex flex-col items-center py-6 gap-3 shadow-sm">
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
                {isActive && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#EF4444] rounded-r-full"></div>
                )}
                <Icon className="w-5 h-5" />
              </button>

              <span className="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs font-medium px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
                {item.label}
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-gray-900 border-b-4 border-b-transparent"></span>
              </span>
            </div>
          );
        })}

      </nav>

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {active === 0 && <OrganizationDashboard onNavigateToUsers={() => onNavigate(1)} onNavigateToProjects={() => onNavigate(2)} />}
          {active === 1 && <UserManagement />}
          {active === 2 && <AllProjects />}
        </div>
      </main>
    </div>
  );
}

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="4" rx="2" />
      <rect x="13" y="11" width="8" height="10" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11z" />
      <path d="M6 11c1.657 0 3-1.567 3-3.5S7.657 4 6 4 3 5.567 3 7.5 4.343 11 6 11z" />
      <path d="M2 20c0-2.5 3-4.5 6-4.5s6 2 6 4.5" />
      <path d="M12 20c0-2.5 3-4.5 6-4.5s6 2 6 4.5" />
    </svg>
  );
}

function ProjectsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 7h18" />
      <path d="M6 21V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
      <path d="M10 11h4v4h-4z" />
    </svg>
  );
}
