"use client"

import React, { useState } from 'react';

export default function ProjectsMembers({ initial = [], onChange = () => {} }) {
  const [members, setMembers] = useState(initial);
  const [email, setEmail] = useState('');

  function addMember() {
    if (!email.trim()) return;
    if (members.some(m => m.email === email.trim())) {
      alert('Member already added');
      return;
    }
    const next = [...members, { id: Date.now() + Math.random(), email: email.trim(), role: 'Member' }];
    setMembers(next);
    setEmail('');
    onChange(next);
  }

  function changeRole(id, role) {
    const next = members.map(m => m.id === id ? { ...m, role } : m);
    setMembers(next);
    onChange(next);
  }

  function removeMember(id) {
    const next = members.filter(m => m.id !== id);
    setMembers(next);
    onChange(next);
  }

  return (
    <section className="bg-white rounded-lg shadow p-5">
      <h3 className="text-lg font-semibold mb-4 text-black">Assign members</h3>

      <div className="flex gap-2 mb-4">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="flex-1 px-3 py-2 border rounded-md text-black" />
        <button onClick={addMember} className="px-4 py-2 bg-[#EF4444] text-white rounded-md">Add</button>
      </div>

      <div className="space-y-3">
        {members.length === 0 && <div className="text-sm text-gray-500">No members yet — add someone above.</div>}

        {members.map(m => (
          <div key={m.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded p-3">
            <div>
              <div className="font-medium text-black">{m.email}</div>
            </div>

            <div className="flex items-center gap-2">
              <select value={m.role} onChange={e => changeRole(m.id, e.target.value)} className="px-3 py-2 border rounded-md">
                <option>PM</option>
                <option>Member</option>
                <option>Client</option>
              </select>

              <button onClick={() => removeMember(m.id)} className="text-sm text-gray-500 hover:text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
