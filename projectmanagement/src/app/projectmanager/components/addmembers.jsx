"use client"

import React, { useState, useEffect } from 'react';

export default function AddMembers({ open = false, project, members: initialMembers = [], onClose = () => {}, onSave = () => {} }) {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setMembers(initialMembers || []);
      setEmail('');
      setRole('Member');
    }
  }, [open, initialMembers]);

  function addMember() {
    if (!email.trim()) return;
    if (members.some(m => m.email === email.trim())) {
      alert('Member already added');
      return;
    }
    const newMember = { 
      id: Date.now() + Math.random(), 
      email: email.trim(), 
      role,
      name: email.split('@')[0]
    };
    setMembers([...members, newMember]);
    setEmail('');
    setRole('Member');
  }

  function changeRole(id, newRole) {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
  }

  function removeMember(id) {
    setMembers(members.filter(m => m.id !== id));
  }

  function initialsFor(email) {
    if (!email) return "?";
    const parts = email.split("@")[0] || "";
    return parts.slice(0, 2).toUpperCase();
  }

  async function handleSave() {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500)); // simulate API
      onSave(members);
      setEmail('');
      setRole('Member');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save members');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 pt-10 sm:pt-0">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-members-title"
        aria-describedby="add-members-desc"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#EF4444] to-red-600">
          <h3 id="add-members-title" className="text-lg font-semibold text-white">
            Add Team Members
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            aria-label="Close dialog" 
            className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2 py-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div id="add-members-desc" className="p-6 space-y-5 overflow-auto max-h-[75vh]">
          {project?.name && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-1">Project</div>
              <div className="text-sm font-semibold text-gray-900">{project.name}</div>
            </div>
          )}

          <div>
            <div className="text-sm font-semibold mb-3 text-gray-900">Invite New Members</div>

            <div className="flex gap-2 mb-4">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMember())}
                placeholder="email@example.com"
                type="email"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all text-sm"
              />
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all cursor-pointer shadow-sm"
              >
                <option>Member</option>
                <option>PM</option>
                <option>Admin</option>
                <option>Client</option>
              </select>
              <button
                type="button"
                onClick={addMember}
                className="px-5 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3 text-gray-900">Project Members</div>
            {members.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-sm font-semibold text-gray-600 mb-1">No members yet</p>
                <p className="text-xs text-gray-400">Add someone above to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                        {initialsFor(m.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">{m.email}</div>
                        <div className="text-xs text-gray-500 truncate">{m.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        value={m.role}
                        onChange={e => changeRole(m.id, e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all text-xs font-semibold cursor-pointer shadow-sm"
                      >
                        <option>PM</option>
                        <option>Member</option>
                        <option>Admin</option>
                        <option>Client</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => removeMember(m.id)}
                        className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-sm font-semibold text-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#EF4444] transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Members'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

