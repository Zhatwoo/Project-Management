"use client"

import React, { useState } from "react";
import NewUser from "./newuser";
import Permissions from "./permissions";

export default function UserManagement({ initialUsers }) {
  const [view, setView] = useState("list"); // "list", "invite", "permissions"
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(initialUsers || [
    { id: 1, name: "Alice Rivera", email: "alice@acme.com", role: "Admin", active: true },
    { id: 2, name: "Carlos Mendez", email: "carlos@acme.com", role: "PM", active: true },
    { id: 3, name: "Maya Lee", email: "maya@acme.com", role: "Member", active: true },
    { id: 4, name: "Client Corp", email: "client@clientco.com", role: "Client", active: false },
  ]);

  const filtered = users.filter(u => {
    const q = query.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  function setRole(id, role) {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  }

  function toggleActive(id) {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  }

  function handleInviteSent(newUser) {
    const id = Math.max(0, ...users.map(u => u.id)) + 1;
    setUsers([{ id, name: newUser.name, email: newUser.email, role: newUser.role, active: true }, ...users]);
    setView("list");
  }

  function handleRoleChange(userId, newRole, permissions) {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setView("list");
    setSelectedUser(null);
  }

  function handleInviteClick() {
    setView("invite");
  }

  function handleRoleChangeClick(user) {
    setSelectedUser(user);
    setView("permissions");
  }

  if (view === "invite") {
    return <NewUser onBack={() => setView("list")} onInviteSent={handleInviteSent} />;
  }

  if (view === "permissions") {
    return (
      <Permissions
        onBack={() => {
          setView("list");
          setSelectedUser(null);
        }}
        user={selectedUser}
        onRoleChange={handleRoleChange}
      />
    );
  }

  function initialsFor(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    <div id="users" className="w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">User Management</h3>
          <p className="text-sm text-gray-600">Manage organization users, roles and access</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              className="pl-10 pr-4 py-3 rounded-lg border border-gray-200 w-full sm:w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
              placeholder="Search users by name or email" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
            />
          </div>
          <button 
            onClick={handleInviteClick}
            className="px-4 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite User
          </button>
        </div>
      </header>

      <main className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="text-sm text-gray-500 font-medium">No users found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search query</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                          {initialsFor(user.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "Admin" ? "bg-red-100 text-red-700 border border-red-200" :
                          user.role === "PM" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                          user.role === "Member" ? "bg-green-100 text-green-700 border border-green-200" :
                          "bg-purple-100 text-purple-700 border border-purple-200"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.active 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {user.active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button 
                          className="px-3 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors" 
                          onClick={() => toggleActive(user.id)}
                        >
                          {user.active ? 'Deactivate' : 'Reactivate'}
                        </button>
                        <button 
                          className="px-3 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-semibold transition-colors" 
                          onClick={() => handleRoleChangeClick(user)}
                        >
                          Change Role
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
