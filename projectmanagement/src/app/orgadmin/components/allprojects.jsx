"use client"

import React, { useState } from "react";

export default function AllProjects({ initial }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const projects = initial || [
    { id: 1, name: 'Website Redesign', owner: 'Alice', status: 'Active' },
    { id: 2, name: 'Mobile App', owner: 'Carlos', status: 'Planning' },
    { id: 3, name: 'Q4 Roadmap', owner: 'Maya', status: 'Active' },
    { id: 4, name: 'Onboarding Flow', owner: 'Sam', status: 'Archived' },
  ];

  const filtered = projects.filter(p => {
    const q = query.toLowerCase();
    const statusOk = statusFilter === 'All' || p.status === statusFilter;
    return statusOk && (!q || p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q));
  });

  const getStatusColor = (status) => {
    const colors = {
      "Active": "bg-green-100 text-green-700 border-green-200",
      "Planning": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Archived": "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || colors["Planning"];
  };

  return (
    <div id="projects" className="w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">All Projects</h3>
          <p className="text-sm text-gray-600">Full list of organization projects (admin view)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              className="pl-10 pr-4 py-3 rounded-lg border border-gray-200 w-full sm:w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
              placeholder="Search projects or owner" 
              value={query} 
              onChange={e=>setQuery(e.target.value)} 
            />
          </div>
          <select 
            className="px-4 py-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all cursor-pointer" 
            value={statusFilter} 
            onChange={e=>setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Planning</option>
            <option>Archived</option>
          </select>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">No projects found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group" key={p.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {p.name.charAt(0)}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(p.status)}`}>
                  {p.status}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{p.name}</h4>
              <div className="text-sm text-gray-600 flex items-center gap-2 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Owner: {p.owner}
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button 
                  className="flex-1 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors" 
                  onClick={()=>alert('Open ' + p.name)}
                >
                  Open
                </button>
                <button 
                  className="flex-1 px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all" 
                  onClick={()=>alert('Manage ' + p.name)}
                >
                  Manage
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
