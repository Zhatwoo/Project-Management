"use client"

import React, { useState } from 'react';

export default function CreateProjectModal({ open = false, onClose = () => {}, onCreate = () => {} }) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState([{ id: Date.now(), email: '', role: 'Member' }]);
  const [loading, setLoading] = useState(false);

  function initials(email) {
    if (!email) return ''
    const id = String(email).split('@')[0] || ''
    return id.slice(0, 2).toUpperCase()
  }

  function addMember() {
    setMembers(m => [...m, { id: Date.now() + Math.random(), email: '', role: 'Member' }]);
  }

  function removeMember(id) {
    setMembers(m => m.filter(x => x.id !== id));
  }

  function setMemberField(id, field, value) {
    setMembers(m => m.map(x => x.id === id ? { ...x, [field]: value } : x));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a project name');
    setLoading(true);
    try {
      // Structure the payload
      const payload = { name: name.trim(), members: members.filter(m => m.email.trim()) };
      await new Promise(r => setTimeout(r, 600)); // simulate API
      onCreate(payload);
      setName('');
      setMembers([{ id: Date.now(), email: '', role: 'Member' }]);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 pt-10 sm:pt-0">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <form
        onSubmit={handleCreate}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        aria-describedby="create-project-desc"
        className="relative w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 id="create-project-title" className="text-lg font-semibold text-black">Create project</h3>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EF4444] rounded-md px-2 py-1">✕</button>
        </div>

        <div id="create-project-desc" className="p-6 space-y-4 overflow-auto max-h-[70vh]">
          <label className="block">
            <div className="text-sm font-medium mb-1 text-black">Project name</div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]"
              placeholder="e.g. Website Redesign"
              aria-required="true"
              required
            />
          </label>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-black">Add members</div>
              <button type="button" onClick={addMember} className="text-sm text-[#EF4444] font-medium px-2 py-1 hover:bg-[#fff1f1] rounded">+ Add</button>
            </div>

            <div className="space-y-2">
              {members.map((m, idx) => (
                <div key={m.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-none">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                      {initials(m.email) || '—'}
                    </div>
                  </div>

                  <input
                    value={m.email}
                    onChange={e => setMemberField(m.id, 'email', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full sm:flex-1 px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]"
                  />

                  <div className="relative w-full sm:w-auto flex-none">
                    <select
                      value={m.role}
                      onChange={e => setMemberField(m.id, 'role', e.target.value)}
                      className="appearance-none pr-8 w-full sm:w-36 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EF4444]"
                      aria-label={`Role for member ${idx + 1}`}
                    >
                      <option>Member</option>
                      <option>PM</option>
                      <option>Admin</option>
                      <option>Client</option>
                    </select>
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="w-full sm:w-auto text-sm text-gray-500 hover:text-red-600 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                    aria-label={`Remove member ${idx + 1}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">Tip: enter full emails to invite members; leave blank emails to skip.</div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#EF4444] text-white font-semibold text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#EF4444]">{loading ? 'Creating…' : 'Create project'}</button>
        </div>
      </form>
    </div>
  );
}
