"use client"

import React, { useMemo, useState, useEffect } from 'react'

// Simple calendar view: shows tasks grouped by date for the visible month,
// highlights milestones, and supports prev/next month navigation.

const SAMPLE_TASKS = [
  { id: 'a1', title: 'Signup page copy', due: '2025-11-25', milestone: false, project: 'Website' },
  { id: 'a2', title: 'Payment provider decision', due: '2025-11-28', milestone: true, project: 'Billing' },
  { id: 'a3', title: 'Onboarding flow', due: '2025-12-02', milestone: false, project: 'Product' },
  { id: 'a4', title: 'Release v1.0', due: '2025-12-15', milestone: true, project: 'Release' },
  { id: 'a5', title: 'Write API docs', due: '2025-11-30', milestone: false, project: 'Docs' },
]

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function formatDateISO(d) {
  const dt = new Date(d)
  return dt.toISOString().slice(0, 10)
}

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0,0,0,0)
  return d
}
export default function CalendarView({ tasks: initialTasks, onCreateTask }) {
  const [today] = useState(() => new Date())
  const [visible, setVisible] = useState(() => startOfMonth(new Date()))
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('calendar-tasks')
      return raw ? JSON.parse(raw) : initialTasks || SAMPLE_TASKS
    } catch (e) {
      return initialTasks || SAMPLE_TASKS
    }
  })

  useEffect(() => {
    try { localStorage.setItem('calendar-tasks', JSON.stringify(tasks)) } catch (e) {}
  }, [tasks])

  const monthStart = useMemo(() => startOfMonth(visible), [visible])
  const monthEnd = useMemo(() => endOfMonth(visible), [visible])

  const grouped = useMemo(() => {
    const map = {}
    const startISO = formatDateISO(monthStart)
    const endISO = formatDateISO(monthEnd)
    for (const t of tasks) {
      if (!t.due) continue
      if (showMilestonesOnly && !t.milestone) continue
      if (query) {
        const q = query.toLowerCase()
        if (!t.title.toLowerCase().includes(q) && !(t.project || '').toLowerCase().includes(q)) continue
      }
      const d = t.due.slice(0, 10)
      if (d >= startISO && d <= endISO) {
        map[d] = map[d] || []
        map[d].push(t)
      }
    }
    // ensure days in month exist in order
    const out = []
    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      const iso = formatDateISO(d)
      out.push({ date: iso, tasks: (map[iso] || []).slice() })
    }
    return out
  }, [tasks, monthStart, monthEnd, showMilestonesOnly, query])

  function prevMonth() { setVisible(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function nextMonth() { setVisible(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }

  function addSampleTaskOn(dateISO) {
    const id = 't' + Math.random().toString(36).slice(2, 8)
    const newTask = { id, title: 'New task ' + id, due: dateISO, milestone: false, project: 'Misc' }
    setTasks(s => [newTask, ...s])
  }

  const weekStart = useMemo(() => startOfWeek(visible), [visible])
  const weekDays = useMemo(() => {
    const arr = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [weekStart])

  // tasks in the visible week
  const weekTasks = useMemo(() => {
    const startISO = formatDateISO(weekDays[0])
    const end = new Date(weekDays[6]); end.setHours(23,59,59,999)
    const endISO = formatDateISO(end)
    return tasks.filter(t => {
      if (!t.due) return false
      const d = t.due.slice(0,10)
      return d >= startISO && d <= endISO
    })
  }, [tasks, weekDays])

  const ganttRows = useMemo(() => {
    if (!weekTasks || weekTasks.length === 0) {
      return Array.from({ length: 5 }).flatMap((_, r) => {
        const left = (
          <div key={`ph-left-${r}`} className="py-3 px-3 border-t">
            <div className="font-medium text-black text-sm text-gray-600">&nbsp;</div>
            <div className="text-xs text-gray-400 mt-1">&nbsp;</div>
          </div>
        )
        const days = weekDays.map(d => (
          <div key={d.toISOString() + '-ph-' + r} className="py-3 px-3 border-t border-l text-center">
            <div className="h-6 w-6 mx-auto" />
          </div>
        ))
        return [left, ...days]
      })
    }

    return weekTasks.flatMap(t => {
      const dueISO = t.due ? t.due.slice(0,10) : ''
      const left = (
        <div key={`task-left-${t.id}`} className="py-3 px-3 border-t"> 
          <div className="font-medium text-black">{t.title}</div>
          <div className="text-xs text-gray-500">{t.project}</div>
        </div>
      )
      const days = weekDays.map(d => {
        const iso = formatDateISO(d)
        const isDue = iso === dueISO
        return (
          <div key={`${t.id}-${iso}`} className="py-3 px-3 border-t border-l text-center">
            {isDue ? (
              <div className="inline-block bg-[#EF4444] text-white text-xs px-2 py-1 rounded">Due</div>
            ) : (
              <div className="h-6 w-6 mx-auto" />
            )}
          </div>
        )
      })
      return [left, ...days]
    })
  }, [weekTasks, weekDays])

  return (
    <div className="w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Calendar View</h2>
          <p className="text-sm text-gray-600">View tasks by date and manage your project timeline</p>
        </div>
        {onCreateTask && (
          <button
            onClick={onCreateTask}
            className="px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        )}
      </header>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-3">
            <button 
              onClick={prevMonth} 
              className="p-2 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="px-5 py-2.5 font-bold text-lg bg-gradient-to-r from-[#EF4444] to-red-600 text-white rounded-lg shadow-md min-w-[200px] text-center">
              {visible.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            </div>
            <button 
              onClick={nextMonth} 
              className="p-2 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all"
              aria-label="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 sm:flex-initial min-w-[250px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="Search tasks or projects..." 
                className="pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white w-full" 
              />
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all">
              <input 
                type="checkbox" 
                checked={showMilestonesOnly} 
                onChange={e => setShowMilestonesOnly(e.target.checked)} 
                className="w-4 h-4 rounded border-gray-300 text-[#EF4444] focus:ring-[#EF4444]/30" 
              />
              <span className="text-sm font-semibold text-gray-700">Milestones only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Sidebar */}
        <aside className="col-span-1 bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EF4444] to-red-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Month Calendar</h3>
              <p className="text-xs text-gray-500">Click a date to add task</p>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-5">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center font-bold text-xs text-gray-600 py-2">
                {d}
              </div>
            ))}
            {(() => {
              const cells = []
              const firstDay = new Date(monthStart).getDay()
              for (let i=0;i<firstDay;i++) cells.push(<div key={'b'+i} className="h-12" />)
              for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate()+1)) {
                const iso = formatDateISO(d)
                const count = (grouped.find(g => g.date === iso)?.tasks.length) || 0
                const isToday = formatDateISO(d) === formatDateISO(today)
                const dayTasks = grouped.find(g => g.date === iso)?.tasks || []
                const hasMilestone = dayTasks.some(t => t.milestone)
                cells.push(
                  <button 
                    key={iso} 
                    onClick={() => addSampleTaskOn(iso)} 
                    className={`relative h-14 p-2 rounded-lg border-2 transition-all group ${
                      isToday 
                        ? 'ring-2 ring-[#EF4444] bg-gradient-to-br from-red-50 to-red-100 border-[#EF4444] shadow-md' 
                        : 'hover:bg-gray-50 hover:border-gray-300 border-gray-200 bg-white'
                    }`}
                    title={`${d.getDate()} ${visible.toLocaleString(undefined, { month: 'short' })} - ${count} task${count !== 1 ? 's' : ''}`}
                  > 
                    <div className={`text-sm font-bold ${isToday ? 'text-[#EF4444]' : 'text-gray-800'}`}>
                      {d.getDate()}
                    </div>
                    {count > 0 && (
                      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        hasMilestone 
                          ? 'bg-yellow-400 text-yellow-900' 
                          : 'bg-[#EF4444] text-white'
                      }`}>
                        {count}
                      </div>
                    )}
                    {hasMilestone && (
                      <div className="absolute top-1 right-1">
                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              }
              return cells
            })()}
          </div>
          {/* Tasks List */}
          <div className="mt-6 pt-5 border-t-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-sm">Upcoming Tasks</h4>
              <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {grouped.reduce((sum, day) => sum + day.tasks.length, 0)} total
              </div>
            </div>
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
              {grouped.filter(day => day.tasks.length > 0).map(day => (
                <div key={day.date} className="p-3 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:border-[#EF4444] hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EF4444] to-red-600 flex items-center justify-center text-white text-xs font-bold">
                        {new Date(day.date).getDate()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(day.date).toLocaleDateString(undefined, { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#EF4444] bg-red-50 px-2 py-1 rounded-full">
                      {day.tasks.length}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {day.tasks.map(t => (
                      <li key={t.id} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#EF4444] transition-colors">
                        {t.milestone ? (
                          <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-[#EF4444] mt-0.5 flex-shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900 truncate">{t.title}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{t.project}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {grouped.filter(day => day.tasks.length > 0).length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-500">No tasks scheduled</p>
                  <p className="text-xs text-gray-400 mt-1">Click a date to add a task</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Weekly Gantt View */}
        <main className="col-span-2">
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Weekly Timeline</h3>
                  <p className="text-xs text-gray-500">
                    {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-gray-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                {weekTasks.length} task{weekTasks.length !== 1 ? 's' : ''} this week
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-[240px_repeat(7,1fr)] gap-0 items-start min-w-[800px]">
                {/* Header Row */}
                <div className="py-3 px-4 text-sm font-bold text-gray-700 bg-gray-50 border-b-2 border-gray-200 rounded-tl-lg">
                  Task
                </div>
                {weekDays.map((d, idx) => {
                  const isToday = formatDateISO(d) === formatDateISO(today)
                  return (
                    <div 
                      key={d.toISOString()} 
                      className={`py-3 px-4 text-sm text-center font-bold border-b-2 border-l-2 border-gray-200 ${
                        isToday ? 'bg-gradient-to-br from-red-50 to-red-100 border-[#EF4444]' : 'bg-gray-50'
                      } ${idx === 6 ? 'rounded-tr-lg' : ''}`}
                    >
                      <div className={`${isToday ? 'text-[#EF4444]' : 'text-gray-700'}`}>
                        {d.toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div className={`text-xs mt-1 ${isToday ? 'text-[#EF4444] font-bold' : 'text-gray-600'}`}>
                        {d.getDate()}
                      </div>
                    </div>
                  )
                })}

                {/* Spacer Row */}
                <div className="col-span-8 h-2 bg-gray-100"></div>

                {/* Task Rows */}
                {weekTasks.length === 0 ? (
                  <div className="col-span-8 py-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-500 mb-1">No tasks this week</p>
                    <p className="text-xs text-gray-400">Create tasks to see them on the timeline</p>
                  </div>
                ) : (
                  weekTasks.map(t => {
                    const dueISO = t.due ? t.due.slice(0,10) : ''
                    return (
                      <React.Fragment key={t.id}>
                        <div className="py-4 px-4 border-b border-l border-gray-200 bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            {t.milestone && (
                              <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                            <div className="font-semibold text-sm text-gray-900 truncate">{t.title}</div>
                          </div>
                          <div className="text-xs text-gray-500 truncate">{t.project}</div>
                        </div>
                        {weekDays.map((d, idx) => {
                          const iso = formatDateISO(d)
                          const isDue = iso === dueISO
                          const isToday = iso === formatDateISO(today)
                          return (
                            <div 
                              key={`${t.id}-${iso}`} 
                              className={`py-4 px-3 border-b border-l-2 text-center ${
                                isToday ? 'bg-red-50 border-[#EF4444]' : 'bg-white border-gray-200'
                              }`}
                            >
                              {isDue ? (
                                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#EF4444] to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Due
                                </div>
                              ) : (
                                <div className="h-6"></div>
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
