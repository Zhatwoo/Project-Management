"use client";
import React, { useState } from "react";

export default function TaskDetail({ task: initialTask }) {
  const sample = {
    id: "T-001",
    title: "Design landing page hero",
    description:
      "Create a modern, responsive hero section with CTA and supporting copy. Include responsive image and ensure accessibility.",
    assignees: [
      { name: "Ava Reed", email: "ava@company.com" },
      { name: "Liam Chen", email: "liam@company.com" },
    ],
    due: "2025-12-10",
    status: "In Progress",
    priority: "High",
    subtasks: [
      { id: 1, title: "Hero layout", done: true },
      { id: 2, title: "Responsive images", done: false },
      { id: 3, title: "Text copy", done: false },
    ],
    attachments: [],
    comments: [
      { id: 1, author: "Ava Reed", text: "I'll prepare the asset list.", at: new Date().toISOString() },
    ],
    activity: [
      { id: 1, text: "Task created", at: new Date().toISOString() },
    ],
    timeLoggedMins: 90,
  };

  const [task, setTask] = useState(initialTask || sample);
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [logMins, setLogMins] = useState(0);

  function toggleSubtask(id) {
    setTask((t) => {
      const subtasks = t.subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s));
      const activity = [{ id: Date.now(), text: `Toggled subtask`, at: new Date().toISOString() }, ...t.activity];
      return { ...t, subtasks, activity };
    });
  }

  function addSubtask(e) {
    e?.preventDefault();
    if (!newSubtask.trim()) return;
    setTask((t) => {
      const next = { id: Date.now(), title: newSubtask.trim(), done: false };
      const subtasks = [...t.subtasks, next];
      const activity = [{ id: Date.now() + 1, text: `Added subtask: ${next.title}`, at: new Date().toISOString() }, ...t.activity];
      return { ...t, subtasks, activity };
    });
    setNewSubtask("");
  }

  function addComment(e) {
    e?.preventDefault();
    if (!newComment.trim()) return;
    setTask((t) => {
      const comment = { id: Date.now(), author: "You", text: newComment.trim(), at: new Date().toISOString() };
      const comments = [comment, ...t.comments];
      const activity = [{ id: Date.now() + 1, text: `Commented: ${newComment.trim()}`, at: new Date().toISOString() }, ...t.activity];
      return { ...t, comments, activity };
    });
    setNewComment("");
  }

  function handleFile(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setTask((t) => {
      const attachments = [
        ...t.attachments,
        ...files.map((f) => ({ id: Date.now() + Math.random(), name: f.name, size: f.size })),
      ];
      const activity = [{ id: Date.now(), text: `Uploaded ${files.length} attachment(s)`, at: new Date().toISOString() }, ...t.activity];
      return { ...t, attachments, activity };
    });
    e.target.value = null;
  }

  function updateStatus(next) {
    setTask((t) => ({ ...t, status: next, activity: [{ id: Date.now(), text: `Status → ${next}`, at: new Date().toISOString() }, ...t.activity] }));
  }

  function addTime(e) {
    e?.preventDefault();
    const mins = Number(logMins) || 0;
    if (mins <= 0) return;
    setTask((t) => ({ ...t, timeLoggedMins: t.timeLoggedMins + mins, activity: [{ id: Date.now(), text: `Logged ${mins}m`, at: new Date().toISOString() }, ...t.activity] }));
    setLogMins(0);
  }

  function initialsFor(a) {
    if (!a) return "?";
    if (typeof a === "string") {
      return a.split(" ").map((n) => n[0]).slice(0, 2).join("");
    }
    const name = a.name || a.email || "";
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  }

  const getStatusColor = (status) => {
    const colors = {
      "To Do": "bg-gray-100 text-gray-700 border-gray-200",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
      "In Review": "bg-yellow-100 text-yellow-700 border-yellow-200",
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
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>ID: <span className="font-semibold text-gray-800">{task.id}</span></span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due: <span className="font-semibold text-gray-800">{task.due}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {(task.assignees || []).map((a, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-semibold text-white ring-2 ring-white shadow-md">
                {initialsFor(a)}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">{task.description}</p>
            <textarea
              aria-label="Edit description"
              className="w-full rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] p-3 transition-all resize-none bg-white"
              placeholder="Add more details..."
              value={task.description}
              onChange={(e) => setTask((t) => ({ ...t, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Subtasks
              </h2>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-medium">
                {task.subtasks.filter(s => s.done).length} / {task.subtasks.length}
              </span>
            </div>
            <ul className="space-y-2 mb-4">
              {task.subtasks.map((s) => (
                <li key={s.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <label className="flex items-center gap-3 w-full cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={s.done} 
                      onChange={() => toggleSubtask(s.id)} 
                      className="h-5 w-5 text-[#EF4444] rounded border-gray-300 focus:ring-2 focus:ring-[#EF4444]/30 cursor-pointer" 
                    />
                    <span className={`text-sm flex-1 ${s.done ? "text-gray-400 line-through" : "text-gray-900 font-medium"}`}>
                      {s.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <form onSubmit={addSubtask} className="flex gap-2">
              <input 
                value={newSubtask} 
                onChange={(e) => setNewSubtask(e.target.value)} 
                className="flex-1 rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
                placeholder="Add a new subtask..." 
              />
              <button 
                type="submit" 
                className="px-5 py-3 bg-[#EF4444] text-white rounded-lg text-sm font-medium hover:bg-[#DC2626] transition-colors shadow-sm hover:shadow-md"
              >
                Add
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attachments
              </h2>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-medium">
                {task.attachments.length}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              {task.attachments.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  No attachments yet. Upload files to get started.
                </div>
              ) : (
                <ul className="space-y-2">
                  {task.attachments.map((a) => (
                    <li key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{a.name}</div>
                          <div className="text-xs text-gray-500">{Math.round((a.size||0)/1024)} KB</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer group">
              <input type="file" onChange={handleFile} className="hidden" multiple />
              <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Files
              </span>
            </label>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comments
            </h2>
            <form onSubmit={addComment} className="mb-6">
              <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Write a comment..." 
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all resize-none bg-white" 
                rows={3} 
              />
              <div className="mt-3 flex justify-end">
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#EF4444] text-white rounded-lg text-sm font-medium hover:bg-[#DC2626] transition-colors shadow-sm hover:shadow-md"
                >
                  Post Comment
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {task.comments.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-6">No comments yet. Be the first to comment!</div>
              ) : (
                task.comments.map((c) => (
                  <div key={c.id} className="border-l-4 border-[#EF4444] pl-4 py-2 bg-gray-50 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-gray-900">{c.author}</div>
                      <div className="text-xs text-gray-500">{new Date(c.at).toLocaleString()}</div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Activity Log
            </h2>
            <ul className="space-y-3">
              {task.activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">{a.text}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(a.at).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Status</h3>
            <select 
              value={task.status} 
              onChange={(e) => updateStatus(e.target.value)} 
              className="w-full rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all cursor-pointer"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>In Review</option>
              <option>Done</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time Tracking
            </h3>
            <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="text-xs text-gray-600 mb-1">Total Time</div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor(task.timeLoggedMins/60)}h {task.timeLoggedMins%60}m
              </div>
            </div>
            <form onSubmit={addTime} className="flex gap-2">
              <input 
                type="number" 
                min={1} 
                value={logMins} 
                onChange={(e) => setLogMins(e.target.value)} 
                placeholder="Mins"
                className="flex-1 rounded-lg border border-gray-200 p-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#EF4444] text-white rounded-lg text-sm font-medium hover:bg-[#DC2626] transition-colors shadow-sm"
              >
                Log
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Details</h3>
            <dl className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <dt className="text-sm text-gray-600">Priority</dt>
                <dd>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <dt className="text-sm text-gray-600">Due Date</dt>
                <dd className="text-sm font-semibold text-gray-900">{task.due}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-2">Assignees</dt>
                <dd className="flex -space-x-2">
                  {(task.assignees || []).map((a, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-semibold text-white ring-2 ring-white shadow-md">
                      {initialsFor(a)}
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </main>
    </div>
  );
}
