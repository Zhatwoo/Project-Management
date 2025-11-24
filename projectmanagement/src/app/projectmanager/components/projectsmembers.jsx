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

  function initialsFor(email) {
    if (!email) return "?";
    const parts = email.split("@")[0] || "";
    return parts.slice(0, 2).toUpperCase();
  }

  return (
    <section className="w-full">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Members</h2>
        <p className="text-sm text-gray-600">Assign members and manage their roles in this project</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Assign members
        </h3>

        <div className="flex gap-2 mb-6">
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="email@example.com" 
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
          />
          <button 
            onClick={addMember} 
            className="px-5 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>

        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-sm text-gray-500 font-medium">No members yet</p>
              <p className="text-xs text-gray-400 mt-1">Add someone above to get started</p>
            </div>
          ) : (
            members.map(m => (
              <div key={m.id} className="flex items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {initialsFor(m.email)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{m.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={m.role} 
                    onChange={e => changeRole(m.id, e.target.value)} 
                    className="px-3 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all text-sm font-medium cursor-pointer"
                  >
                    <option>PM</option>
                    <option>Member</option>
                    <option>Client</option>
                  </select>

                  <button 
                    onClick={() => removeMember(m.id)} 
                    className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
