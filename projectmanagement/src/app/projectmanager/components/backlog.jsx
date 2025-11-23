"use client"

import React, { useState, useMemo } from 'react';

export default function Backlog({ tasks: initialTasks }) {
  const sample = initialTasks || [
    { id: 1, title: 'Draft landing page copy', owner: 'Alice', status: 'unscheduled', priority: 'High' },
    { id: 2, title: 'Create onboarding flow', owner: 'Carlos', status: 'unscheduled', priority: 'Medium' },
    { id: 3, title: 'Research payment providers', owner: 'Maya', status: 'unscheduled', priority: 'Low' },
    { id: 4, title: 'Write API docs', owner: 'Sam', status: 'backlog', priority: 'Low' },
  ];

  const [query, setQuery] = useState('');
  const [tasks, setTasks] = useState(sample.filter(t => t.status === 'unscheduled' || t.status === 'backlog'));

  const filtered = useMemo(() => tasks.filter(t => !query || t.title.toLowerCase().includes(query.toLowerCase()) || (t.owner && t.owner.toLowerCase().includes(query.toLowerCase()))), [tasks, query]);

  function scheduleTask(id) {
    setTasks(ts => ts.filter(t => t.id !== id));
    // In a real app we'd call an API and move task to a sprint / schedule
  }

  return (
    <section className="w-full">
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">Backlog — unscheduled tasks</h3>
          <div className="flex items-center gap-2">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks or owners" className="px-3 py-2 border rounded-md text-black" />
            <button onClick={() => setTasks(sample.filter(t => t.status === 'unscheduled' || t.status === 'backlog'))} className="px-3 py-2 text-sm text-white bg-red-500 border rounded">Reset</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-sm text-gray-500">No unscheduled tasks found.</div>
        ) : (
          <ul className="space-y-3">
            {filtered.map(t => (
              <li key={t.id} className="flex items-center justify-between border border-gray-100 rounded p-3">
                <div>
                  <div className="font-medium text-black">{t.title}</div>
                  <div className="text-xs text-gray-500">{t.owner} • {t.priority}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => scheduleTask(t.id)} className="px-3 py-1 bg-[#EF4444] text-white rounded text-sm">Schedule</button>
                  <button onClick={() => alert('Open task ' + t.id)} className="px-3 py-1 border rounded border-gray-400 text-gray-500 text-sm">Open</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
