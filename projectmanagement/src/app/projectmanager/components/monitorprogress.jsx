"use client"

import React, { useState, useMemo } from 'react';

export default function MonitorProgress({ project, tasks = [], onBack }) {
  const [filter, setFilter] = useState('all'); // all, active, completed

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(t => t.status !== 'done');
    if (filter === 'completed') return tasks.filter(t => t.status === 'done');
    return tasks;
  }, [tasks, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'inprogress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    return { total, completed, inProgress, todo, completionRate };
  }, [tasks]);

  const getStatusColor = (status) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-700 border-gray-200',
      'inprogress': 'bg-blue-100 text-blue-700 border-blue-200',
      'review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'done': 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[status] || colors['todo'];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-100 text-red-700 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Low': 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[priority] || colors['Medium'];
  };

  return (
    <div className="w-full">
      <header className="flex items-center gap-4 mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Back to Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Monitor Progress</h2>
          <p className="text-sm text-gray-600">
            {project?.name ? `Track progress for ${project.name}` : 'Track task progress and project metrics'}
          </p>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Tasks</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">In Progress</div>
          <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Completed</div>
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Completion Rate</div>
          <div className="text-3xl font-bold text-[#EF4444]">{stats.completionRate}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <div className="text-sm font-medium text-gray-600">
            {stats.completed} of {stats.total} tasks completed
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#EF4444] to-red-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-gray-500 font-medium">No tasks found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filter or create new tasks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'High' ? 'bg-red-500' :
                    task.priority === 'Medium' ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {task.owner && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {task.owner}
                        </div>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                  {task.status === 'todo' ? 'To Do' :
                   task.status === 'inprogress' ? 'In Progress' :
                   task.status === 'review' ? 'Review' :
                   'Done'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

