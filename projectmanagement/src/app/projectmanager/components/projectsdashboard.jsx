"use client"

import React from 'react';

export default function ProjectsDashboard({ stats, onCreateProject, onAddMembers, onMonitorProgress }) {
  const data = stats || {
    totalProjects: 12,
    active: 8,
    completed: 4,
    progress: [
      { name: 'Website Redesign', pct: 72 },
      { name: 'Mobile App', pct: 45 },
      { name: 'Marketing Campaign', pct: 90 },
    ],
    upcoming: [
      { id: 1, title: 'Design review', due: 'Today', owner: 'Alice' },
      { id: 2, title: 'Sprint planning', due: 'Tomorrow', owner: 'Carlos' },
      { id: 3, title: 'Deploy staging', due: 'Nov 28', owner: 'Maya' },
    ],
    activity: [
      { id: 1, text: 'Alice uploaded new designs', time: '2h ago' },
      { id: 2, text: 'Carlos moved Mobile App to In Progress', time: '5h ago' },
      { id: 3, text: 'Maya closed issue #142', time: '1d ago' },
    ],
  };

  return (
    <section className="w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects Dashboard</h2>
          <p className="text-sm text-gray-600">Overview of your projects, progress, and activity</p>
        </div>
        <div className="flex gap-3">
          {onAddMembers && (
            <button
              onClick={onAddMembers}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Add Members
            </button>
          )}
          {onMonitorProgress && (
            <button
              onClick={onMonitorProgress}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Monitor Progress
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {/* Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-700 mb-2">Total projects</div>
              <div className="text-3xl font-bold text-blue-900">{data.totalProjects}</div>
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-700 mb-2">Active</div>
              <div className="text-3xl font-bold text-green-900">{data.active}</div>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-700 mb-2">Completed</div>
              <div className="text-3xl font-bold text-purple-900">{data.completed}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Progress
            </h3>
            <div className="space-y-5">
              {data.progress.map(p => (
                <div key={p.name}>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-sm font-bold text-gray-900">{p.pct}%</div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#EF4444] to-red-600 h-3 rounded-full transition-all duration-500 shadow-sm" 
                      style={{ width: `${p.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upcoming tasks
            </h3>
            <ul className="space-y-3">
              {data.upcoming.map(t => (
                <li key={t.id} className="flex justify-between items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{t.title}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {t.owner}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">{t.due}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h3>
          <ul className="space-y-3">
            {data.activity.map(a => (
              <li key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{a.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
