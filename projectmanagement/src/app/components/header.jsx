"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOrg, setShowOrg] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
        setShowCreate(false);
        setShowNotifs(false);
        setShowOrg(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#FAFAFA] border-b border-gray-100 shadow-sm h-16">
      <div className="h-full">
        <div className="h-full flex items-center justify-between gap-4 max-w-full px-4">
          {/* Left: logo + system name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-red-500 flex items-center justify-center text-white font-bold">PM</div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-semibold text-[#0F0F0F]">Project Management</span>
                <span className="text-xs text-[#0F0F0F]">Org Admin</span>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 px-4">
            <div className="max-w-2xl mx-auto">
              <label className="relative block">
                <span className="sr-only">Search</span>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#0F0F0F]">🔍</span>
                <input
                  className="w-full border border-gray-400 rounded-lg py-2 pl-10 pr-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20 text-[#0F0F0F]"
                  placeholder="Search projects, users, tasks..."
                  aria-label="Search"
                />
              </label>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowCreate(s => !s)} className="inline-flex items-center px-3 py-1.5 bg-[#EF4444] text-white rounded-md text-sm font-semibold shadow-sm hover:brightness-95">Create project</button>
                {showCreate && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded shadow-md py-2 text-sm">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[#0F0F0F]">New project</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[#0F0F0F]">From template</button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setShowNotifs(s => !s)} className="p-2 rounded-md hover:bg-slate-50">
                  <span className="sr-only">Notifications</span>
                  <svg className="w-5 h-5 text-[#0F0F0F]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/></svg>
                  <span className="inline-block ml-2 bg-[#EF4444] text-white text-xs px-2 py-0.5 rounded-full">3</span>
                </button>
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded shadow-md py-2 text-sm">
                    <div className="px-3 py-2 text-[#0F0F0F]">No new notifications</div>
                  </div>
                )}
              </div>
            </div>

            {/* Org switcher + role */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setShowOrg(s => !s)} className="flex items-center gap-2 px-3 py-1.5 border border-gray-400 rounded-md text-sm hover:bg-slate-50">
                  <span className="font-medium text-[#0F0F0F]">Acme Co</span>
                  <svg className="w-3 h-3 text-[#0F0F0F]" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {showOrg && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded shadow-md py-2 text-sm">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[#0F0F0F]">Acme Co</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[#0F0F0F]">Client Corp</button>
                  </div>
                )}
              </div>

              <div className="text-xs bg-gray-100 text-[#0F0F0F] px-2 py-1 rounded">Admin</div>
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(s => !s)} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-[#0F0F0F]">N</div>
                <svg className="w-4 h-4 text-[#0F0F0F]" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded shadow-md py-1 text-sm">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[#0F0F0F]">Profile</button>
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/settings');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[#0F0F0F]"
                  >
                    Settings
                  </button>
                  <div className="border-t border-gray-100" />
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[#0F0F0F]">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
