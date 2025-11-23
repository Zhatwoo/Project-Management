"use client"

import React, { useState, useEffect } from "react";
import OrganizationDashboard from "./organizationdashboard";
import UserManagement from "./usermanagement";
import OrgSetting from "./orgsetting";
import AllProjects from "./allprojects";

const ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'users', label: 'Users', icon: UsersIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
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
      <nav className="w-20 border-r border-gray-100 bg-white sticky top-16 self-start h-[calc(100vh-7rem)] flex flex-col items-center py-6 gap-4">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = active === i;
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

              <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </div>
          );
        })}

      </nav>

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {active === 0 && <OrganizationDashboard />}
          {active === 1 && <UserManagement />}
          {active === 2 && <OrgSetting />}
          {active === 3 && <AllProjects />}
        </div>
      </main>
    </div>
  );
}

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="4" rx="2" />
      <rect x="13" y="11" width="8" height="10" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11z" />
      <path d="M6 11c1.657 0 3-1.567 3-3.5S7.657 4 6 4 3 5.567 3 7.5 4.343 11 6 11z" />
      <path d="M2 20c0-2.5 3-4.5 6-4.5s6 2 6 4.5" />
      <path d="M12 20c0-2.5 3-4.5 6-4.5s6 2 6 4.5" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.9 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.2 3.1A2 2 0 1 1 7 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V0a2 2 0 1 1 4 0v.09c.08.43.42.8 1 1.51h.02A1.65 1.65 0 0 0 18 2.2l.06-.06A2 2 0 1 1 21.1 4.2l-.06.06a1.65 1.65 0 0 0-.33 1.82V7c.43.08.8.42 1.51 1h.09a2 2 0 1 1 0 4h-.09c-.71.58-1.08.92-1.51 1v1.02z" />
    </svg>
  );
}

function ProjectsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M3 7h18" />
      <path d="M6 21V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
      <path d="M10 11h4v4h-4z" />
    </svg>
  );
}
