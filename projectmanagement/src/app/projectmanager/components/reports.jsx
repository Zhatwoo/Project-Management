"use client"

import React, { useMemo, useState, useEffect } from 'react'

// PM-only Reports page: Burndown chart, Completion rate, Time-tracking summary

const SAMPLE_SPRINT = {
  name: 'Sprint 12',
  days: 14,
  start: '2025-11-17',
  plannedPoints: 40,
  // completedPointsPerDay: cumulative completed points by day index (0..days)
  completedByDay: [0, 4, 7, 10, 12, 16, 20, 23, 27, 30, 33, 36, 38, 40],
}

const SAMPLE_TASKS = [
  { id: 'r1', title: 'Implement auth', completed: true, timeHours: 12 },
  { id: 'r2', title: 'Landing page copy', completed: false, timeHours: 3 },
  { id: 'r3', title: 'Payment provider research', completed: true, timeHours: 6 },
  { id: 'r4', title: 'Onboarding flow', completed: false, timeHours: 8 },
  { id: 'r5', title: 'API docs', completed: true, timeHours: 4 },
]

function Sparkline({ points = [], width = 240, height = 48, stroke = '#ef4444' }) {
  if (!points.length) return null
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = Math.max(1, max - min)
  const step = width / Math.max(1, points.length - 1)
  const coords = points.map((p, i) => `${i * step},${height - ((p - min) / range) * height}`).join(' ')
  return (
    <svg width={width} height={height} className="block">
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={coords} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BarChart({ data = [], labels = [], width = 300, height = 120, color = '#EF4444' }) {
  if (!data || !data.length) return null
  const max = Math.max(...data, 1)
  const barWidth = width / data.length
  return (
    <svg width={width} height={height} className="block">
      {data.map((v, i) => {
        const h = Math.round((v / max) * (height - 24))
        const x = i * barWidth + 6
        const y = height - h - 16
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth - 12} height={h} rx="4" fill={color} />
            <text x={x + (barWidth - 12) / 2} y={height - 4} fontSize="10" textAnchor="middle" fill="#374151">{labels[i] || i + 1}</text>
            <text x={x + (barWidth - 12) / 2} y={y - 4} fontSize="10" textAnchor="middle" fill="#111827">{v}</text>
          </g>
        )
      })}
    </svg>
  )
}

function PieChart({ data = {}, size = 120, colors = ['#ef4444', '#f97316', '#60a5fa', '#34d399'] }) {
  const entries = Object.entries(data)
  const total = entries.reduce((s, [, v]) => s + v, 0)
  if (!entries.length || total === 0) return null
  let angle = 0
  const r = size / 2
  const cx = r
  const cy = r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {entries.map(([k, v], i) => {
        const slice = v / total
        const start = angle * Math.PI * 2
        angle += slice
        const end = angle * Math.PI * 2
        const x1 = cx + r * Math.cos(start)
        const y1 = cy + r * Math.sin(start)
        const x2 = cx + r * Math.cos(end)
        const y2 = cy + r * Math.sin(end)
        const large = slice > 0.5 ? 1 : 0
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
        const color = colors[i % colors.length]
        return <path key={k} d={path} fill={color} stroke="#fff" strokeWidth="0.5" />
      })}
    </svg>
  )
}

function BurndownChart({ sprint }) {
  // expected ideal line from plannedPoints to 0
  const days = sprint.days
  const ideal = Array.from({ length: days }, (_, i) => Math.round(sprint.plannedPoints * (1 - i / (days - 1))))
  const actual = sprint.completedByDay.map(c => Math.max(0, sprint.plannedPoints - c))
  // we want arrays of remaining points per day
  return (
    <div className="w-full bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3 text-black">
        <div className="font-medium">Burndown — {sprint.name}</div>
        <div className="text-sm text-gray-500">Planned: {sprint.plannedPoints} pts • {sprint.days} days</div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Sparkline points={ideal} stroke="#94a3b8" />
          <div className="-mt-6">
            <Sparkline points={actual} stroke="#ef4444" />
          </div>
        </div>
        <div className="w-40 text-sm text-gray-600">
          <div>Start: {sprint.plannedPoints} pts</div>
          <div>Remaining: {actual[actual.length - 1] || 0} pts</div>
          <div>Completed: {sprint.completedByDay[sprint.completedByDay.length - 1] || 0} pts</div>
        </div>
      </div>
    </div>
  )
}

export default function Reports({ sprint = SAMPLE_SPRINT, tasks = SAMPLE_TASKS }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem('reports-data')
      if (raw) return JSON.parse(raw)
    } catch (e) {}
    return { sprint, tasks }
  })

  useEffect(() => {
    try { localStorage.setItem('reports-data', JSON.stringify(data)) } catch (e) {}
  }, [data])

  const totalTasks = data.tasks.length
  const completedCount = data.tasks.filter(t => t.completed).length
  const pendingCount = totalTasks - completedCount
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100)

  const totalHours = data.tasks.reduce((s, t) => s + (t.timeHours || 0), 0)
  const byMember = useMemo(() => {
    // sample breakdown: split timeHours evenly across fake members for demo
    const members = { Alice: 0, Bob: 0, Carlos: 0 }
    data.tasks.forEach((t, i) => {
      const names = Object.keys(members)
      members[names[i % names.length]] += t.timeHours || 0
    })
    return members
  }, [data.tasks])

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black">Reports (PM)</h2>
        <div className="text-sm text-gray-600">Overview of sprint progress, completion, and time tracking</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <BurndownChart sprint={data.sprint} />

          <div className="mt-4 bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-black">Completion Rate</div>
              <div className="text-sm text-gray-700">{completedCount}/{totalTasks} tasks</div>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded overflow-hidden">
              <div className="h-4 bg-[#EF4444]" style={{ width: `${completionRate}%` }} />
            </div>
            <div className="mt-3 text-sm text-gray-700">Completion: {completionRate}%</div>

            <div className="mt-6">
              <div className="font-medium mb-2 text-black">Tasks Overview</div>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-sm text-gray-700">Completed</div>
                  <div className="text-sm text-gray-700">Pending</div>
                </div>
                <BarChart data={[completedCount, pendingCount]} labels={[`Done (${completedCount})`, `Pending (${pendingCount})`]} width={320} height={140} />
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-1 bg-white border rounded-lg p-4">
          <div className="font-medium mb-2 text-black">Time Tracking Summary</div>
          <div className="text-sm text-gray-700 mb-3">Total logged hours: {totalHours}h</div>
          <div className="flex items-center gap-4">
            <div>
              <PieChart data={byMember} size={140} />
            </div>
            <div className="flex-1">
              <ul className="space-y-2">
                {Object.entries(byMember).map(([name, hrs], idx) => (
                  <li key={name} className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">{name}</div>
                    <div className="text-sm font-medium text-black">{hrs}h</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">Tip: integrate a time-tracking provider to sync real hours.</div>
        </aside>
      </div>
    </div>
  )
}
