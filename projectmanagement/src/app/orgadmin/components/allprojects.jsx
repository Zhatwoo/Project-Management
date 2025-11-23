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

  return (
    <div id="projects" className="bg-gray-50 p-5 rounded-lg shadow text-black">
      <header className="flex justify-between items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold">All Projects</h3>
          <p className="text-sm text-black">Full list of organization projects (admin view)</p>
        </div>

        <div className="flex items-center gap-3">
          <input className="px-3 py-2 rounded-lg border border-gray-200 w-80" placeholder="Search projects or owner" value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="px-3 py-2 rounded border border-gray-200" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Planning</option>
            <option>Archived</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <article className="bg-white p-4 rounded-lg border border-gray-100" key={p.id}>
            <div className="flex justify-between items-center">
              <div className="font-semibold">{p.name}</div>
              <div className="inline-block bg-red-50 text-red-600 px-2 py-1 rounded-full font-semibold text-sm">{p.status}</div>
            </div>
            <div className="text-sm text-black mt-2">Owner: {p.owner}</div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="border border-gray-200 px-3 py-2 rounded" onClick={()=>alert('Open ' + p.name)}>Open</button>
              <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={()=>alert('Manage ' + p.name)}>Manage</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
