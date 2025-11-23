"use client"

import React from "react";

export default function OrganizationDashboard({ stats }) {
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

  return (
    <section id="dashboard" className="w-full flex flex-col text-black font-sans" aria-labelledby="org-heading">
      <header className="flex justify-between items-center gap-4 mb-4">
        <div>
          <h2 id="org-heading" className="text-lg font-bold">{data.orgName}</h2>
          <p className="text-sm text-black">Organization dashboard — overview of people and projects</p>
        </div>

        <div className="flex gap-3">
        </div>
      </header>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <article className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-xl w-9 h-9 flex items-center justify-center bg-red-100 rounded-lg">👥</span>
            <div className="text-sm text-black font-semibold">Total users</div>
          </div>
          <div className="mt-3 text-3xl font-extrabold">{data.totalUsers}</div>
          <div className="mt-2 text-sm text-black">{data.newUsers} new this month</div>
        </article>

        <article className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-xl w-9 h-9 flex items-center justify-center bg-red-100 rounded-lg">📁</span>
            <div className="text-sm text-black font-semibold">Total projects</div>
          </div>
          <div className="mt-3 text-3xl font-extrabold">{data.totalProjects}</div>
          <div className="mt-2 text-sm text-black">{data.activeProjects} active</div>
        </article>

        <article className="bg-white rounded-lg p-4 border border-gray-100 col-span-2">
          <h3 className="text-base font-semibold mb-3">Recent projects</h3>
          <ul className="flex flex-col gap-3">
            {data.recentProjects.map((p) => (
              <li key={p.id} className="flex justify-between items-center p-2 rounded-md bg-gradient-to-b from-gray-50 to-white">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-black">{p.owner} • <span className="inline-block bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold">{p.status}</span></div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <footer className="mt-auto flex justify-between text-sm text-black py-6">
        <div>Last updated: just now</div>
        <div className="text-red-600">View analytics →</div>
      </footer>
    </section>
  );
}
