"use client";

import React, { useMemo, useState } from "react";

export default function ReadOnlyTaskList({ tasks: initialTasks }) {
  function initialsFor(a) {
    if (!a) return "?";
    if (typeof a === "string") return a[0];
    const name = a.name || a.email || "";
    return name ? name.split(" ").map(n => n[0]).slice(0, 2).join("") : "?";
  }

  const sampleTasks = [
    { 
      id: "T-101", 
      title: "Design landing hero", 
      status: "In Progress", 
      due: "2025-12-10", 
      assignees: ["Ava"], 
      priority: "High", 
      description: "Design hero with CTA and responsive image. This task involves creating a compelling hero section that captures user attention and includes clear call-to-action buttons.",
      createdAt: "2025-11-01",
      updatedAt: "2025-11-15",
      tags: ["Design", "Frontend"],
      attachments: [],
      comments: [],
    },
    { 
      id: "T-102", 
      title: "Setup analytics", 
      status: "To Do", 
      due: "2025-12-18", 
      assignees: ["Liam"], 
      priority: "Medium", 
      description: "Integrate basic pageview tracking and set up Google Analytics dashboard for monitoring user behavior.",
      createdAt: "2025-11-05",
      updatedAt: "2025-11-05",
      tags: ["Backend", "Analytics"],
      attachments: [],
      comments: [],
    },
    { 
      id: "T-103", 
      title: "Write copy for pricing", 
      status: "Done", 
      due: "2025-11-20", 
      assignees: ["Maya"], 
      priority: "Low", 
      description: "Pricing page copy and FAQ. Create compelling pricing descriptions and answer common questions about plans and features.",
      createdAt: "2025-10-25",
      updatedAt: "2025-11-20",
      tags: ["Content", "Marketing"],
      attachments: [],
      comments: [],
    },
    { 
      id: "T-104", 
      title: "Implement auth flow", 
      status: "In Progress", 
      due: "2025-12-05", 
      assignees: ["Carlos"], 
      priority: "High", 
      description: "Login/signup and forgot-password functionality. Implement secure authentication with JWT tokens and password reset flow.",
      createdAt: "2025-11-10",
      updatedAt: "2025-11-18",
      tags: ["Backend", "Security"],
      attachments: [],
      comments: [],
    },
  ];

  const [tasks] = useState(initialTasks || sampleTasks);
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (query && !(`${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [tasks, statusFilter, query]);

  const getStatusColor = (status) => {
    const colors = {
      "To Do": "bg-gray-100 text-gray-700 border-gray-200",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
      "Done": "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || colors["To Do"];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      "Low": "bg-gray-100 text-gray-700",
      "Medium": "bg-yellow-100 text-yellow-700",
      "High": "bg-red-100 text-red-700",
    };
    return colors[priority] || colors["Medium"];
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
          {['All', 'To Do', 'In Progress', 'Done'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                statusFilter === s
                  ? 'bg-[#EF4444] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm focus-within:ring-2 focus-within:ring-[#EF4444]/30 focus-within:border-[#EF4444] transition-all">
          <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="text-gray-700 px-2 py-2 text-sm outline-none flex-1 min-w-0"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-gray-700 text-sm border-l border-gray-200 pl-3 pr-2 py-2 outline-none bg-transparent cursor-pointer"
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="col-span-2">
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 font-medium">No tasks found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search query</p>
              </div>
            ) : (
              filtered.map((t) => (
                <article
                  key={t.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
                  onClick={() => setSelected(t)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#EF4444] transition-colors">
                          {t.title}
                        </h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusColor(t.status)}`}>
                          {t.status}
                        </span>
                        {t.priority && (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getPriorityColor(t.priority)}`}>
                            {t.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{t.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Due {t.due}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {t.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex -space-x-2">
                      {(t.assignees || []).map((a, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-semibold text-white ring-2 ring-white shadow-sm"
                          title={typeof a === 'string' ? a : a.name || a.email}
                        >
                          {initialsFor(a)}
                        </div>
                      ))}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#EF4444] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Statistics
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">All Tasks</span>
                <span className="text-lg font-bold text-gray-900">{tasks.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-sm font-medium text-blue-700">To Do</span>
                <span className="text-lg font-bold text-blue-900">{tasks.filter(t => t.status === 'To Do').length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <span className="text-sm font-medium text-yellow-700">In Progress</span>
                <span className="text-lg font-bold text-yellow-900">{tasks.filter(t => t.status === 'In Progress').length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-sm font-medium text-green-700">Done</span>
                <span className="text-lg font-bold text-green-900">{tasks.filter(t => t.status === 'Done').length}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Read-Only Task Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl z-50 overflow-hidden my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">{selected.title}</h3>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                  Read-Only
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {/* Task Details - Read Only */}
              <div className="space-y-6">
                {/* Status and Priority */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(selected.status)}`}>
                    {selected.status}
                  </span>
                  {selected.priority && (
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getPriorityColor(selected.priority)}`}>
                      {selected.priority} Priority
                    </span>
                  )}
                  <span className="text-sm text-gray-500">Task ID: {selected.id}</span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Description
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200 leading-relaxed">
                    {selected.description}
                  </p>
                </div>

                {/* Task Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Due Date</div>
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {selected.due}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Assigned To</div>
                    <div className="flex items-center gap-2 mt-1">
                      {(selected.assignees || []).map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
                            {initialsFor(a)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {typeof a === 'string' ? a : a.name || a.email}
                          </span>
                        </div>
                      ))}
                      {(!selected.assignees || selected.assignees.length === 0) && (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selected.tags && selected.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Read-Only Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-yellow-800 mb-1">Read-Only View</div>
                    <div className="text-xs text-yellow-700">You are viewing this task in read-only mode. You cannot edit or modify any task details.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

