"use client"

import React from "react";

export default function OrganizationDashboard({ stats, onNavigateToUsers, onNavigateToProjects }) {
  // stats prop shape: { orgName, totalUsers, totalProjects, activeProjects, newUsers }
  const data = stats || {
    orgName: "Your Organization",
    totalUsers: 128,
    totalProjects: 34,
    activeProjects: 21,
    newUsers: 9,
    recentProjects: [
      { id: 1, name: "Website Redesign", owner: "Alice", status: "Active" },
      { id: 2, name: "Mobile App", owner: "Carlos", status: "Planning" },
      { id: 3, name: "Q4 Roadmap", owner: "Maya", status: "Active" },
    ],
  };

  const getStatusColor = (status) => {
    const colors = {
      "Active": "bg-green-100 text-green-700 border-green-200",
      "Planning": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Archived": "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || colors["Planning"];
  };

  return (
    <section id="dashboard" className="w-full flex flex-col" aria-labelledby="org-heading">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 id="org-heading" className="text-3xl font-bold text-gray-900 mb-2">{data.orgName}</h2>
          <p className="text-sm text-gray-600">Organization dashboard — overview of people and projects</p>
        </div>
        <div className="flex gap-3">
          {onNavigateToUsers && (
            <button
              onClick={onNavigateToUsers}
              className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Users
            </button>
          )}
          {onNavigateToProjects && (
            <button
              onClick={onNavigateToProjects}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View Projects
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">Total users</div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{data.totalUsers}</div>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {data.newUsers} new this month
          </div>
        </article>

        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">Total projects</div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{data.totalProjects}</div>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {data.activeProjects} active
          </div>
        </article>

        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">Active projects</div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{data.activeProjects}</div>
          <div className="text-sm text-gray-600">Currently running</div>
        </article>

        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#EF4444] to-red-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700">New users</div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{data.newUsers}</div>
          <div className="text-sm text-gray-600">This month</div>
        </article>
      </div>

      <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Recent projects
          </h3>
        </div>
        <ul className="space-y-3">
          {data.recentProjects.map((p) => (
            <li key={p.id} className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {p.owner}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(p.status)}`}>
                  {p.status}
                </span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#EF4444] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <footer className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last updated: just now
        </div>
        <button className="flex items-center gap-2 text-[#EF4444] hover:text-[#DC2626] font-medium transition-colors">
          View analytics
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </footer>
    </section>
  );
}
