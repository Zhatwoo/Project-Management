"use client"

import React from 'react';

export default function ProjectsDashboard({ stats }) {
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
      <div className="flex flex-col gap-6">
        {/* Overview */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg text-black font-semibold mb-3">Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-black">Total projects</div>
              <div className="text-2xl text-black font-extrabold">{data.totalProjects}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-black">Active</div>
              <div className="text-2xl text-black font-extrabold">{data.active}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-black">Completed</div>
              <div className="text-2xl text-black  font-extrabold">{data.completed}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-black mb-4">Progress</h3>
            <div className="space-y-4">
              {data.progress.map(p => (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="font-medium text-black">{p.name}</div>
                    <div className="text-sm text-black">{p.pct}%</div>
                  </div>
                  <div className="w-full bg-gray-100 rounded h-2">
                    <div className="bg-[#EF4444] h-2 rounded" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming tasks */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold mb-3 text-black">Upcoming tasks</h3>
            <ul className="space-y-3 text-sm">
              {data.upcoming.map(t => (
                <li key={t.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-black">{t.title}</div>
                    <div className="text-xs text-gray-500">{t.owner}</div>
                  </div>
                  <div className="text-xs text-gray-500">{t.due}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-3 text-black">Activity</h3>
          <ul className="space-y-3 text-sm text-black">
            {data.activity.map(a => (
              <li key={a.id} className="flex justify-between items-start">
                <div>{a.text}</div>
                <div className="text-xs text-gray-500">{a.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
