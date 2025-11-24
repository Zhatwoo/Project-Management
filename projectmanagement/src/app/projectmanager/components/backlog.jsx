"use client"

import React, { useState, useMemo } from 'react';

export default function Backlog({ tasks: initialTasks, onCreateTask }) {
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

  const getPriorityColor = (priority) => {
    const colors = {
      "High": "bg-red-100 text-red-700 border-red-200",
      "Medium": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Low": "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[priority] || colors["Medium"];
  };

  return (
    <section className="w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Backlog</h2>
          <p className="text-sm text-gray-600">Unscheduled tasks ready to be planned</p>
        </div>
        {onCreateTask && (
          <button
            onClick={onCreateTask}
            className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        )}
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            Unscheduled tasks
          </h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="Search tasks or owners" 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white w-full sm:w-64" 
              />
            </div>
            <button 
              onClick={() => setTasks(sample.filter(t => t.status === 'unscheduled' || t.status === 'backlog'))} 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-gray-500 font-medium">No unscheduled tasks found</p>
            <p className="text-xs text-gray-400 mt-1">All tasks have been scheduled or try adjusting your search</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map(t => (
              <li key={t.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-2 h-2 rounded-full ${t.priority === 'High' ? 'bg-red-500' : t.priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{t.title}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {t.owner}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => scheduleTask(t.id)} 
                    className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
                  >
                    Schedule
                  </button>
                  <button 
                    onClick={() => alert('Open task ' + t.id)} 
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                  >
                    Open
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
