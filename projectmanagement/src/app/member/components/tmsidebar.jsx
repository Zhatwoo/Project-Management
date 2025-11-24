"use client";
import React, { useState } from "react";
import MyTask from "./mytask";
import TimeTracking from "./timetracking";
import TaskDetail from "./taskdetail";

const ICONS = {
  tasks: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H6a2 2 0 00-2 2v3m12 4h3a2 2 0 002-2v-3M9 19H6a2 2 0 01-2-2v-3m12-4h3a2 2 0 012 2v3M3 7h18M3 17h18" />
    </svg>
  ),
  time: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  detail: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  ),
  add: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16m8-8H4"/>
    </svg>
  )
};

export default function TMSidebar() {
  const [active, setActive] = useState("tasks");

  const items = [
    { id: "tasks", label: "My Tasks", icon: ICONS.tasks, comp: <MyTask /> },
    { id: "time", label: "Time Tracking", icon: ICONS.time, comp: <TimeTracking /> },
    { id: "detail", label: "Task Detail (sample)", icon: ICONS.detail, comp: <TaskDetail /> },
  ];

  const activeItem = items.find((i) => i.id === active) || items[0];

  return (
    <div className="flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col items-center w-20 bg-white border-r border-gray-200 h-[calc(100vh-7rem)] sticky top-16 py-6 gap-3 shadow-sm">
        <div className="w-full flex flex-col items-center gap-2">
          {items.map((it) => (
            <div key={it.id} className="relative group w-full flex justify-center">
              <button
                aria-label={it.label}
                title={it.label}
                onClick={() => setActive(it.id)}
                className={`relative w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  active===it.id 
                    ? 'bg-[#EF4444] text-white shadow-lg shadow-red-200/50 scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {active===it.id && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#EF4444] rounded-r-full"></div>
                )}
                {it.icon}
              </button>

              <span className="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs font-medium px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
                {it.label}
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-gray-900 border-b-4 border-b-transparent"></span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200 w-full flex justify-center">
          <button 
            className="w-14 h-14 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            title="Add new"
          >
            {ICONS.add}
          </button>
        </div>
      </aside>

      {/* Mobile icon bar */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 flex justify-around py-3 shadow-sm">
        {items.map((it) => (
          <button 
            key={it.id} 
            onClick={() => setActive(it.id)} 
            className={`p-3 rounded-xl transition-all ${
              active===it.id 
                ? 'bg-[#EF4444] text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`} 
            title={it.label}
          >
            {it.icon}
          </button>
        ))}
      </div>

      <div className="flex-1">
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {active === "tasks" && activeItem.comp}
            {active === "time" && activeItem.comp}
            {active === "detail" && activeItem.comp}
          </div>
        </main>
      </div>
    </div>
  );
}
