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
export default function CalendarView({ tasks: initialTasks }) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-black">Calendar — Tasks by date</h2>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">{visible.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="px-3 py-1 border rounded bg-white hover:bg-gray-50">‹ Prev</button>
          <div className="px-4 py-1 font-medium bg-white rounded shadow-sm hidden sm:block">{visible.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
          <button onClick={nextMonth} className="px-3 py-1 border rounded bg-white hover:bg-gray-50">Next ›</button>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title or project" className="ml-3 px-3 py-1 border border-gray-300 rounded text-sm text-black placeholder:text-gray-500" />
          <label className="ml-2 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showMilestonesOnly} onChange={e => setShowMilestonesOnly(e.target.checked)} className="rounded" />
            <span className="text-sm">Milestones only</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <aside className="col-span-1 bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-3">Month overview</div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center font-medium py-1 text-gray-700">{d}</div>
            ))}
            {(() => {
              const cells = []
              // leading blanks
              const firstDay = new Date(monthStart).getDay()
              for (let i=0;i<firstDay;i++) cells.push(<div key={'b'+i} />)
              for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate()+1)) {
                const iso = formatDateISO(d)
                const count = (grouped.find(g => g.date === iso)?.tasks.length) || 0
                const isToday = formatDateISO(d) === formatDateISO(today)
                cells.push(
                  <button key={iso} onClick={() => addSampleTaskOn(iso)} className={`relative h-10 p-1 rounded border ${isToday ? 'ring-2 ring-[#EF4444]' : 'hover:bg-gray-50'} bg-white`}> 
                    <div className="text-sm text-gray-800">{d.getDate()}</div>
                    {count > 0 && <div className="absolute right-1 top-1 bg-[#EF4444] text-white text-[10px] px-1 rounded-full">{count}</div>}
                  </button>
                )
              }
              return cells
            })()}
          </div>
          <div className="mt-4">
            <div className="font-medium mb-2">Tasks by date (list)</div>
            <div className="space-y-3 max-h-[40vh] overflow-auto">
              {grouped.map(day => (
                <div key={day.date} className="p-3 border rounded bg-white">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-black">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div className="text-xs text-gray-500">{day.tasks.length} tasks</div>
                  </div>
                  {day.tasks.length === 0 ? (
                    <div className="text-sm text-gray-500 mt-2">No tasks due.</div>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {day.tasks.map(t => (
                        <li key={t.id} className="text-sm text-black">{t.title} <span className="text-xs text-gray-500">• {t.project}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="col-span-2">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-black">Weekly view — {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
              <div className="text-sm text-gray-500">Week overview</div>
            </div>

            <div className="overflow-auto">
              <div className="grid grid-cols-[220px_repeat(7,1fr)] gap-0 items-start">
                <div className="py-2 px-3 text-sm font-medium text-gray-600">Task</div>
                {weekDays.map(d => (
                  <div key={d.toISOString()} className="py-2 px-3 text-sm text-center text-gray-600 border-l">{d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</div>
                ))}

                <div className="col-span-8">
                  {/* spacer to align rows header */}
                </div>

                {ganttRows}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
