"use client"

import React, { useState } from "react";

export default function UserManagement({ initialUsers }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(initialUsers || [
    { id: 1, name: "Alice Rivera", email: "alice@acme.com", role: "Admin", active: true },
    { id: 2, name: "Carlos Mendez", email: "carlos@acme.com", role: "PM", active: true },
    { id: 3, name: "Maya Lee", email: "maya@acme.com", role: "Member", active: true },
    { id: 4, name: "Client Corp", email: "client@clientco.com", role: "Client", active: false },
  ]);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

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

  function invite(e) {
    e.preventDefault();
    if (!inviteEmail) return;
    const id = Math.max(0, ...users.map(u => u.id)) + 1;
    setUsers([{ id, name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, active: true }, ...users]);
    setInviteEmail("");
    setInviteRole("Member");
    setShowInvite(false);
  }

  return (
    <div id="users" className="bg-gray-50 p-5 rounded-lg shadow text-black">
      <header className="flex justify-between items-center gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold">User Management</h3>
          <p className="text-sm text-black">Manage organization users, roles and access</p>
        </div>

        <div className="flex items-center gap-3">
          <input className="px-3 py-2 rounded-lg border border-gray-200 w-full sm:w-80" placeholder="Search users by name or email" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </header>

      <main>
        <div role="table" aria-label="List of users" className="block rounded-lg overflow-hidden">
          <div role="row" className="grid grid-cols-1 sm:grid-cols-4 gap-3 px-3 py-2 text-sm font-semibold text-black bg-transparent">
            <div>Name</div>
            <div className="hidden sm:block">Role</div>
            <div className="hidden sm:block">Status</div>
            <div className="text-right">Actions</div>
          </div>

          {filtered.map(user => (
            <div role="row" key={user.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 py-3 px-3 items-center border-t border-gray-100">
              <div className="flex flex-col">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-black">{user.email}</div>
              </div>

              <div className="hidden sm:block">
                <select className="px-3 py-2 rounded-lg border border-gray-200" value={user.role} onChange={e => setRole(user.id, e.target.value)}>
                  <option>Admin</option>
                  <option>PM</option>
                  <option>Member</option>
                  <option>Client</option>
                </select>
              </div>

              <div className="hidden sm:block">
                <span className={user.active ? 'inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold' : 'inline-block bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-semibold'}>{user.active ? 'Active' : 'Deactivated'}</span>
              </div>

              <div className="flex gap-2 justify-end flex-wrap sm:flex-nowrap">
                <button className="border border-gray-200 px-2 py-1 rounded-md" onClick={() => toggleActive(user.id)}>{user.active ? 'Deactivate' : 'Reactivate'}</button>
                <button className="text-black font-semibold" onClick={() => alert('Open profile for ' + user.email)}>Profile</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showInvite && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div role="dialog" aria-modal="true" className="bg-white rounded-lg p-5 w-full max-w-md shadow-lg">
            <h4 className="text-lg font-semibold mb-2">Invite a user</h4>
            <form onSubmit={invite} className="flex flex-col gap-3">
              <label className="flex flex-col text-sm">Email
                <input className="px-3 py-2 border rounded" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
              </label>

              <label className="flex flex-col text-sm">Role
                <select className="px-3 py-2 border rounded" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  <option>Member</option>
                  <option>PM</option>
                  <option>Admin</option>
                  <option>Client</option>
                </select>
              </label>

              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="border border-gray-200 px-3 py-2 rounded" onClick={() => setShowInvite(false)}>Cancel</button>
                <button className="bg-red-500 text-white px-3 py-2 rounded" type="submit">Send invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
