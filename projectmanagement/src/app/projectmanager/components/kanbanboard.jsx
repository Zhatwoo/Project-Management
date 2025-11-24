"use client"

import React, { useEffect, useMemo, useState } from 'react'

const DEFAULT_DATA = {
  todo: [
    { id: 't1', title: 'Draft landing page copy', owner: 'Alice', priority: 'High' },
    { id: 't2', title: 'Create onboarding flow', owner: 'Carlos', priority: 'Medium' },
  ],
  inprogress: [
    { id: 't3', title: 'Integrate auth', owner: 'Maya', priority: 'High' },
  ],
  review: [
    { id: 't4', title: 'Review payment provider research', owner: 'Sam', priority: 'Low' },
  ],
  done: [
    { id: 't5', title: 'Set up repo', owner: 'DevOps', priority: 'Low' },
  ],
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch (e) {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {}
  }, [key, state])

  return [state, setState]
}

export default function KanbanBoard({ initial, onCreateTask }) {
  const [columns, setColumns] = useLocalStorage('kanban-columns', initial || DEFAULT_DATA)
  const [dragging, setDragging] = useState(null)
  const [hoveredColumn, setHoveredColumn] = useState(null)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')

  function onDragStart(e, fromColumn, taskId) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ fromColumn, taskId }))
    e.dataTransfer.effectAllowed = 'move'
    setDragging({ fromColumn, taskId })
  }

  function onDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function onDrop(e, toColumn) {
    e.preventDefault()
    try {
      const payload = JSON.parse(e.dataTransfer.getData('text/plain'))
      const { fromColumn, taskId } = payload
      if (!taskId) return

      if (fromColumn === toColumn) {
        setDragging(null)
        return
      }

      setColumns(prev => {
        const sourceList = Array.from(prev[fromColumn] || [])
        const idx = sourceList.findIndex(t => t.id === taskId)
        if (idx === -1) return prev
        const [task] = sourceList.splice(idx, 1)
        const destList = Array.from(prev[toColumn] || [])
        destList.unshift(task)
        return { ...prev, [fromColumn]: sourceList, [toColumn]: destList }
      })
    } catch (err) {
      // ignore
    } finally {
      setDragging(null)
    }
  }

  function addTask(column, title) {
    if (!title) return
    const id = 't' + Math.random().toString(36).slice(2, 9)
    const task = { id, title, owner: '', priority: 'Medium' }
    setColumns(prev => ({ ...prev, [column]: [task, ...(prev[column] || [])] }))
  }

  function removeTask(column, id) {
    setColumns(prev => ({ ...prev, [column]: prev[column].filter(t => t.id !== id) }))
  }

  const colOrder = [
    { key: 'todo', label: 'To Do' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'review', label: 'Review' },
    { key: 'done', label: 'Done' },
  ]

  const boardStats = useMemo(() => {
    const lists = Object.values(columns || {})
    const allTasks = lists.flat()
    const total = allTasks.length
    const done = columns?.done?.length || 0
    const inProgress = columns?.inprogress?.length || 0
    const busiest = lists.reduce(
      (acc, list, idx) => (list.length > acc.count ? { idx, count: list.length } : acc),
      { idx: 0, count: 0 }
    )
    return {
      total,
      done,
      inProgress,
      progressPct: total ? Math.round((done / total) * 100) : 0,
      busiestLabel: colOrder[busiest.idx]?.label || 'To Do',
    }
  }, [columns])

  const getColumnConfig = (key) => {
    const configs = {
      'todo': {
        gradient: 'from-gray-500 to-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
      },
      'inprogress': {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      'review': {
        gradient: 'from-yellow-500 to-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      'done': {
        gradient: 'from-green-500 to-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
    };
    return configs[key] || configs['todo'];
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'High': 'bg-red-100 text-red-700 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Low': 'bg-green-100 text-green-700 border-green-200',
    };
    return badges[priority] || badges['Medium'];
  };

  function initialsFor(name) {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    <div className="w-full">
      <header className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Kanban Board</h2>
            <p className="text-sm text-gray-600">Modern task board with filters, stats, and drag & drop interactions.</p>
          </div>
          {onCreateTask && (
            <button
              onClick={onCreateTask}
              className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </button>
          )}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <BoardStatCard label="Total Tasks" value={boardStats.total} accent="from-blue-500 to-blue-600" />
          <BoardStatCard label="In Progress" value={boardStats.inProgress} accent="from-yellow-500 to-yellow-600" />
          <BoardStatCard label="Completed" value={boardStats.done} accent="from-green-500 to-green-600" />
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Board Health</div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Overall progress</p>
              <span className="text-lg font-bold text-[#EF4444]">{boardStats.progressPct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-[#EF4444] to-red-600 h-2 rounded-full" style={{ width: `${boardStats.progressPct}%` }}></div>
            </div>
            <p className="text-xs text-gray-500">Most active column: <span className="font-semibold text-gray-900">{boardStats.busiestLabel}</span></p>
          </div>
        </section>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by task title or assignee..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] text-sm text-gray-900 placeholder:text-gray-500 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'High', 'Medium', 'Low'].map(option => (
              <button
                key={option}
                onClick={() => setPriorityFilter(option)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide border transition-all ${
                  priorityFilter === option
                    ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {option === 'all' ? 'All priorities' : option}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {colOrder.map(col => {
          const config = getColumnConfig(col.key);
          const taskCount = (columns[col.key] || []).length;
          const filteredTasks = (columns[col.key] || []).filter(task => {
            const matchesSearch = search
              ? task.title.toLowerCase().includes(search.toLowerCase()) ||
                (task.owner || '').toLowerCase().includes(search.toLowerCase())
              : true
            const matchesPriority = priorityFilter === 'all' ? true : task.priority === priorityFilter
            return matchesSearch && matchesPriority
          })
          return (
            <div key={col.key} className="flex-shrink-0 w-[320px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className={`bg-gradient-to-r ${config.gradient} px-5 py-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{col.label}</h3>
                      <p className="text-xs text-white/80 mt-0.5">{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs uppercase tracking-wide text-white/70">Visible</span>
                    <span className="font-extrabold text-lg">{filteredTasks.length}</span>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 min-h-[400px] max-h-[75vh] overflow-y-auto transition-all duration-200 ${
                  hoveredColumn === col.key 
                    ? `ring-4 ring-[#EF4444]/40 ${config.bg} border-t-4 border-[#EF4444]` 
                    : 'bg-gray-50'
                }`}
                onDragOver={onDragOver}
                onDragEnter={e => { e.preventDefault(); setHoveredColumn(col.key) }}
                onDragLeave={() => setHoveredColumn(null)}
                onDrop={e => { onDrop(e, col.key); setHoveredColumn(null) }}
                aria-label={`${col.label} column`}
                role="list"
              >
                <AddTaskInput onAdd={title => addTask(col.key, title)} placeholder={`Add task to ${col.label}...`} />

                <div className="mt-4 space-y-3">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">{taskCount === 0 ? 'No tasks yet' : 'No tasks match your filters'}</p>
                      <p className="text-xs text-gray-500">{taskCount === 0 ? 'Drag a task here or add one above' : 'Try clearing filters or search'}</p>
                    </div>
                  ) : (
                    filteredTasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={e => onDragStart(e, col.key, task.id)}
                        className={`bg-white rounded-xl p-4 shadow-md border-2 ${config.border} cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 group ${
                          dragging && dragging.taskId === task.id 
                            ? 'opacity-40 scale-95 rotate-2 shadow-2xl' 
                            : ''
                        }`}
                        role="listitem"
                        aria-grabbed={dragging && dragging.taskId === task.id}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-2 h-10 rounded-full ${
                              task.priority === 'High' ? 'bg-red-500' : 
                              task.priority === 'Medium' ? 'bg-yellow-400' : 
                              'bg-green-400'
                            }`}></div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{task.id.toUpperCase()}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <h4 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#EF4444] transition-colors">
                                {task.title}
                              </h4>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTask(col.key, task.id);
                                }} 
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                aria-label="Remove task"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <div className="flex items-center flex-wrap gap-2 mb-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityBadge(task.priority)}`}>
                                {task.priority} priority
                              </span>
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">#{col.label.replace(' ', '')}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  {initialsFor(task.owner || task.title)}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-900">{task.owner || 'Unassigned'}</p>
                                  <p className="text-[11px] text-gray-400">Owner</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Updated</p>
                                <p className="text-sm font-semibold text-gray-700">Just now</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

function AddTaskInput({ onAdd, placeholder }) {
  const [val, setVal] = useState('')
  const [focused, setFocused] = useState(false)
  
  return (
    <div className={`bg-white rounded-xl p-3 border-2 transition-all ${focused ? 'border-[#EF4444] shadow-md' : 'border-gray-200'}`}>
      <div className="flex gap-2">
        <input 
          value={val} 
          onChange={e => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (val.trim()) {
                onAdd(val.trim());
                setVal('');
              }
            }
          }}
          placeholder={placeholder} 
          className="flex-1 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent" 
        />
        <button
          onClick={() => {
            if (val.trim()) {
              onAdd(val.trim())
              setVal('')
            }
          }}
          disabled={!val.trim()}
          className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>
    </div>
  )
}

function BoardStatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white font-bold text-lg`}>
        {String(value ?? 0).padStart(2, '0')}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  )
}

