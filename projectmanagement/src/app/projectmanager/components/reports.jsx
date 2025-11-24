"use client"

import React, { useMemo, useState, useEffect } from 'react'

// Enhanced Reports page with comprehensive metrics

const SAMPLE_SPRINT = {
  name: 'Sprint 12',
  days: 14,
  start: '2025-11-17',
  plannedPoints: 40,
  completedByDay: [0, 4, 7, 10, 12, 16, 20, 23, 27, 30, 33, 36, 38, 40],
}

const SAMPLE_TASKS = [
  { id: 'r1', title: 'Implement auth', completed: true, timeHours: 12, priority: 'High', status: 'done', owner: 'Alice', project: 'Website Redesign' },
  { id: 'r2', title: 'Landing page copy', completed: false, timeHours: 3, priority: 'Medium', status: 'inprogress', owner: 'Carlos', project: 'Marketing' },
  { id: 'r3', title: 'Payment provider research', completed: true, timeHours: 6, priority: 'Low', status: 'done', owner: 'Maya', project: 'Billing' },
  { id: 'r4', title: 'Onboarding flow', completed: false, timeHours: 8, priority: 'High', status: 'review', owner: 'Sam', project: 'Product' },
  { id: 'r5', title: 'API docs', completed: true, timeHours: 4, priority: 'Low', status: 'done', owner: 'Alice', project: 'Documentation' },
  { id: 'r6', title: 'Database migration', completed: false, timeHours: 15, priority: 'High', status: 'todo', owner: 'Bob', project: 'Backend' },
]

const SAMPLE_PROJECTS = [
  { id: 1, name: 'Website Redesign', progress: 72, status: 'active', tasks: 24, completedTasks: 18 },
  { id: 2, name: 'Mobile App', progress: 45, status: 'active', tasks: 18, completedTasks: 8 },
  { id: 3, name: 'Marketing Campaign', progress: 90, status: 'active', tasks: 12, completedTasks: 11 },
]

function Sparkline({ points = [], width = 300, height = 80, stroke = '#ef4444', fill = false }) {
  if (!points.length) return null
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = Math.max(1, max - min)
  const step = width / Math.max(1, points.length - 1)
  const coords = points.map((p, i) => `${i * step},${height - ((p - min) / range) * height}`).join(' ')
  const pathData = `M ${coords}`
  const areaPath = `M 0,${height} L ${coords} L ${width},${height} Z`
  
  return (
    <svg width={width} height={height} className="block">
      {fill && <path d={areaPath} fill={stroke} fillOpacity="0.1" />}
      <polyline 
        fill="none" 
        stroke={stroke} 
        strokeWidth="3" 
        points={coords} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BarChart({ data = [], labels = [], width = 300, height = 160, color = '#EF4444', showValues = true }) {
  if (!data || !data.length) return null
  const max = Math.max(...data, 1)
  const barWidth = width / data.length
  return (
    <svg width={width} height={height} className="block">
      {data.map((v, i) => {
        const h = Math.round((v / max) * (height - 32))
        const x = i * barWidth + 8
        const y = height - h - 20
        return (
          <g key={i}>
            <rect 
              x={x} 
              y={y} 
              width={barWidth - 16} 
              height={h} 
              rx="6" 
              fill={color}
              className="hover:opacity-80 transition-opacity"
            />
            {showValues && (
              <>
                <text 
                  x={x + (barWidth - 16) / 2} 
                  y={height - 6} 
                  fontSize="11" 
                  textAnchor="middle" 
                  fill="#6B7280"
                  fontWeight="600"
                >
                  {labels[i] || i + 1}
                </text>
                <text 
                  x={x + (barWidth - 16) / 2} 
                  y={y - 6} 
                  fontSize="12" 
                  textAnchor="middle" 
                  fill="#111827"
                  fontWeight="700"
                >
                  {v}
                </text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function PieChart({ data = {}, size = 140, colors = ['#EF4444', '#F97316', '#60A5FA', '#34D399', '#A78BFA'] }) {
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
        return (
          <path 
            key={k} 
            d={path} 
            fill={color} 
            stroke="#fff" 
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity"
          />
        )
      })}
    </svg>
  )
}

function BurndownChart({ sprint }) {
  const days = sprint.days
  const ideal = Array.from({ length: days }, (_, i) => Math.round(sprint.plannedPoints * (1 - i / (days - 1))))
  const actual = sprint.completedByDay.map(c => Math.max(0, sprint.plannedPoints - c))
  const completed = sprint.completedByDay[sprint.completedByDay.length - 1] || 0
  const remaining = actual[actual.length - 1] || 0
  
  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF4444] to-red-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Sprint Burndown</h3>
            <p className="text-xs text-gray-500">{sprint.name}</p>
          </div>
        </div>
        <div className="text-sm font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
          {sprint.plannedPoints} pts • {sprint.days} days
        </div>
      </div>
      
      <div className="flex gap-6 items-center">
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200">
          <div className="mb-2">
            <Sparkline points={ideal} stroke="#94A3B8" width={400} height={100} fill={true} />
          </div>
          <div className="-mt-20">
            <Sparkline points={actual} stroke="#EF4444" width={400} height={100} fill={true} />
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              <span className="text-xs font-semibold text-gray-600">Ideal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#EF4444]"></div>
              <span className="text-xs font-semibold text-gray-600">Actual</span>
            </div>
          </div>
        </div>
        
        <div className="w-56 space-y-3">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
            <div className="text-xs font-bold text-blue-700 mb-1">Start Points</div>
            <div className="text-2xl font-bold text-blue-900">{sprint.plannedPoints}</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
            <div className="text-xs font-bold text-gray-700 mb-1">Remaining</div>
            <div className="text-2xl font-bold text-gray-900">{remaining}</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-900">{completed}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Reports({ sprint = SAMPLE_SPRINT, tasks = SAMPLE_TASKS, projects = SAMPLE_PROJECTS }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem('reports-data')
      if (raw) return JSON.parse(raw)
    } catch (e) {}
    return { sprint, tasks, projects }
  })

  const [timeRange, setTimeRange] = useState('week') // week, month, quarter

  useEffect(() => {
    try { localStorage.setItem('reports-data', JSON.stringify(data)) } catch (e) {}
  }, [data])

  const metrics = useMemo(() => {
    const totalTasks = data.tasks.length
    const completedCount = data.tasks.filter(t => t.completed).length
    const pendingCount = totalTasks - completedCount
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100)
    
    const totalHours = data.tasks.reduce((s, t) => s + (t.timeHours || 0), 0)
    const avgHoursPerTask = totalTasks === 0 ? 0 : Math.round((totalHours / totalTasks) * 10) / 10
    
    const byStatus = {
      'To Do': data.tasks.filter(t => t.status === 'todo').length,
      'In Progress': data.tasks.filter(t => t.status === 'inprogress').length,
      'Review': data.tasks.filter(t => t.status === 'review').length,
      'Done': data.tasks.filter(t => t.status === 'done').length,
    }
    
    const byPriority = {
      'High': data.tasks.filter(t => t.priority === 'High').length,
      'Medium': data.tasks.filter(t => t.priority === 'Medium').length,
      'Low': data.tasks.filter(t => t.priority === 'Low').length,
    }
    
    const byMember = {}
    data.tasks.forEach(t => {
      if (t.owner) {
        byMember[t.owner] = (byMember[t.owner] || 0) + (t.timeHours || 0)
      }
    })
    
    const byProject = {}
    data.tasks.forEach(t => {
      if (t.project) {
        byProject[t.project] = (byProject[t.project] || 0) + 1
      }
    })
    
    const totalProjects = data.projects?.length || 0
    const activeProjects = data.projects?.filter(p => p.status === 'active').length || 0
    const avgProjectProgress = totalProjects === 0 ? 0 : Math.round(
      (data.projects?.reduce((sum, p) => sum + p.progress, 0) || 0) / totalProjects
    )
    
    return {
      totalTasks,
      completedCount,
      pendingCount,
      completionRate,
      totalHours,
      avgHoursPerTask,
      byStatus,
      byPriority,
      byMember,
      byProject,
      totalProjects,
      activeProjects,
      avgProjectProgress,
    }
  }, [data.tasks, data.projects])

  return (
    <div className="w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
          <p className="text-sm text-gray-600">Comprehensive insights into your projects, tasks, and team performance</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'quarter'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                timeRange === range
                  ? 'bg-[#EF4444] text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-sm font-semibold text-blue-100 mb-1">Total Tasks</div>
          <div className="text-3xl font-bold">{metrics.totalTasks}</div>
          <div className="text-xs text-blue-100 mt-2">{metrics.completedCount} completed</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-sm font-semibold text-green-100 mb-1">Completion Rate</div>
          <div className="text-3xl font-bold">{metrics.completionRate}%</div>
          <div className="text-xs text-green-100 mt-2">{metrics.pendingCount} pending</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-sm font-semibold text-purple-100 mb-1">Total Hours</div>
          <div className="text-3xl font-bold">{metrics.totalHours}h</div>
          <div className="text-xs text-purple-100 mt-2">Avg {metrics.avgHoursPerTask}h per task</div>
        </div>

        <div className="bg-gray-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-sm font-semibold text-white mb-1">Active Projects</div>
          <div className="text-3xl font-bold">{metrics.activeProjects}</div>
          <div className="text-xs text-white mt-2">{metrics.avgProjectProgress}% avg progress</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Burndown Chart */}
        <div className="lg:col-span-2">
          <BurndownChart sprint={data.sprint} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
            <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Velocity
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-semibold text-gray-700">This Sprint</span>
                <span className="text-lg font-bold text-blue-900">38 pts</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Last Sprint</span>
                <span className="text-lg font-bold text-gray-900">42 pts</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-semibold text-gray-700">Average</span>
                <span className="text-lg font-bold text-green-900">40 pts</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
            <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Team Activity
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tasks completed</span>
                <span className="font-bold text-gray-900">{metrics.completedCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">In progress</span>
                <span className="font-bold text-blue-600">{metrics.byStatus['In Progress']}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Under review</span>
                <span className="font-bold text-yellow-600">{metrics.byStatus['Review']}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Distribution by Status */}
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Task Distribution by Status
            </h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <BarChart 
                data={Object.values(metrics.byStatus)} 
                labels={Object.keys(metrics.byStatus)} 
                width={280} 
                height={180}
                color="#EF4444"
              />
            </div>
            <div className="space-y-3">
              {Object.entries(metrics.byStatus).map(([status, count], idx) => {
                const colors = ['bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-green-500']
                const textColors = ['text-blue-700', 'text-yellow-700', 'text-purple-700', 'text-green-700']
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${colors[idx % colors.length]}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{status}</div>
                      <div className={`text-xs font-bold ${textColors[idx % textColors.length]}`}>{count} tasks</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Task Distribution by Priority */}
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Task Distribution by Priority
            </h3>
          </div>
          <div className="flex items-center gap-6">
            <PieChart data={metrics.byPriority} size={160} colors={['#EF4444', '#F97316', '#34D399']} />
            <div className="flex-1 space-y-3">
              {Object.entries(metrics.byPriority).map(([priority, count], idx) => {
                const colors = [
                  { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
                  { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
                  { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
                ]
                const color = colors[idx % colors.length]
                return (
                  <div key={priority} className={`p-3 rounded-lg border-2 ${color.border} ${color.bg}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${color.text}`}>{priority}</span>
                      <span className={`text-lg font-bold ${color.text}`}>{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Tracking by Member */}
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time Tracking by Member
            </h3>
          </div>
          <div className="flex items-center gap-6">
            <PieChart data={metrics.byMember} size={160} />
            <div className="flex-1 space-y-3">
              {Object.entries(metrics.byMember)
                .sort(([, a], [, b]) => b - a)
                .map(([name, hrs], idx) => {
                  const percentage = metrics.totalHours > 0 ? Math.round((hrs / metrics.totalHours) * 100) : 0
                  return (
                    <div key={name} className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{name}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{hrs}h</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#EF4444] to-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percentage}% of total</div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Project Progress Overview */}
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Project Progress Overview
            </h3>
          </div>
          <div className="space-y-4">
            {data.projects?.map(project => (
              <div key={project.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EF4444] to-red-600 flex items-center justify-center text-white font-bold text-sm">
                      {project.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{project.name}</div>
                      <div className="text-xs text-gray-500">{project.completedTasks}/{project.tasks} tasks completed</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#EF4444]">{project.progress}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#EF4444] to-red-600 h-3 rounded-full transition-all shadow-sm"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
