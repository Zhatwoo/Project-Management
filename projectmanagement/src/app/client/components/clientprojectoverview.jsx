"use client";

import React from "react";

export default function ClientProjectOverview({ project: initialProject }) {
  const project = initialProject || {
    id: "PRJ-001",
    name: "Website Redesign",
    description: "Complete redesign of company website with modern UI/UX, responsive design, and improved performance. Includes new branding, content strategy, and SEO optimization.",
    status: "In Progress",
    progress: 65,
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    owner: { name: "Alice Rivera", email: "alice@company.com" },
    team: [
      { name: "Alice Rivera", role: "Project Manager" },
      { name: "Carlos Mendez", role: "Designer" },
      { name: "Maya Lee", role: "Developer" },
    ],
    budget: "$50,000",
    milestones: [
      { id: 1, title: "Design Phase Complete", date: "2025-10-15", status: "completed", description: "All design mockups approved" },
      { id: 2, title: "Development Started", date: "2025-11-01", status: "completed", description: "Frontend development in progress" },
      { id: 3, title: "Beta Testing", date: "2025-12-01", status: "in-progress", description: "Internal testing phase" },
      { id: 4, title: "Launch", date: "2025-12-31", status: "upcoming", description: "Public release" },
    ],
    stats: {
      totalTasks: 48,
      completedTasks: 31,
      inProgressTasks: 12,
      pendingTasks: 5,
    },
  };

  const getStatusColor = (status) => {
    const colors = {
      "Planning": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
      "On Hold": "bg-gray-100 text-gray-700 border-gray-200",
      "Completed": "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || colors["In Progress"];
  };

  const getMilestoneStatusColor = (status) => {
    const colors = {
      "completed": "bg-green-500",
      "in-progress": "bg-blue-500",
      "upcoming": "bg-gray-300",
    };
    return colors[status] || colors["upcoming"];
  };

  function initialsFor(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-[#EF4444] flex items-center justify-center text-white shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Welcome to Your Project Dashboard</h2>
              <p className="text-sm text-gray-700">Here you can see everything about your project at a glance. Use the menu on the left to navigate to different sections.</p>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Project ID: <span className="font-semibold text-gray-800">{project.id}</span></span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Project Owner</div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {initialsFor(project.owner.name)}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{project.owner.name}</div>
                <div className="text-xs text-gray-500">{project.owner.email}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Project Summary */}
        <section className="lg:col-span-2 space-y-6">
          {/* Project Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Project Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Project Statistics */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Task Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Total Tasks
                </div>
                <div className="text-3xl font-bold text-gray-900">{project.stats.totalTasks}</div>
                <div className="text-xs text-gray-500 mt-1">All tasks in this project</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </div>
                <div className="text-3xl font-bold text-green-600">{project.stats.completedTasks}</div>
                <div className="text-xs text-gray-500 mt-1">Finished tasks</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  In Progress
                </div>
                <div className="text-3xl font-bold text-blue-600">{project.stats.inProgressTasks}</div>
                <div className="text-xs text-gray-500 mt-1">Currently being worked on</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending
                </div>
                <div className="text-3xl font-bold text-gray-600">{project.stats.pendingTasks}</div>
                <div className="text-xs text-gray-500 mt-1">Not started yet</div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Overall Progress
              </h2>
              <span className="text-2xl font-bold text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-4">
              <div 
                className="h-4 bg-gradient-to-r from-[#EF4444] to-red-600 rounded-full transition-all duration-500 shadow-sm" 
                style={{ width: `${project.progress}%` }} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">Start:</span>
                <span className="font-semibold text-gray-900">{formatDate(project.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">End:</span>
                <span className="font-semibold text-gray-900">{formatDate(project.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Team Members
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.team.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {initialsFor(member.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column - Timeline */}
        <aside className="space-y-6">
          {/* Project Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Project Details</h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <dt className="text-sm text-gray-600">Status</dt>
                <dd>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <dt className="text-sm text-gray-600">Budget</dt>
                <dd className="text-sm font-semibold text-gray-900">{project.budget}</dd>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <dt className="text-sm text-gray-600">Duration</dt>
                <dd className="text-sm font-semibold text-gray-900">
                  {Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-2">Project Owner</dt>
                <dd className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                    {initialsFor(project.owner.name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{project.owner.name}</div>
                    <div className="text-xs text-gray-500">{project.owner.role || "Project Manager"}</div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>

          {/* High-Level Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Timeline
            </h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {project.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative flex items-start gap-4">
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-8 h-8 rounded-full ${getMilestoneStatusColor(milestone.status)} flex items-center justify-center shadow-md`}>
                      {milestone.status === "completed" && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {milestone.status === "in-progress" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                      {milestone.status === "upcoming" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Milestone Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                          {formatDate(milestone.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        milestone.status === "completed" ? "bg-green-100 text-green-700" :
                        milestone.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {milestone.status === "completed" ? "Completed" :
                         milestone.status === "in-progress" ? "In Progress" :
                         "Upcoming"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

