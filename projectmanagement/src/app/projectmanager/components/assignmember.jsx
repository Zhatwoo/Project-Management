"use client"

import React, { useState } from 'react';

export default function AssignMember({ task, members = [], onBack, onSave }) {
  const [selectedMembers, setSelectedMembers] = useState(task?.assignedTo || []);
  const [loading, setLoading] = useState(false);

  function toggleMember(memberId) {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
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
      if (onSave) onSave(selectedMembers);
      if (onBack) onBack();
    } catch (err) {
      console.error(err);
      alert('Failed to assign members');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assign Member</h2>
          <p className="text-sm text-gray-600">
            {task?.title ? `Assign team members to "${task.title}"` : 'Select team members to work on this task'}
          </p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl space-y-6">
        {task && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-1">Task</div>
            <div className="text-lg font-semibold text-gray-900">{task.title}</div>
            {task.description && (
              <div className="text-sm text-gray-600 mt-2">{task.description}</div>
            )}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Available team members</h3>
          {members.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-sm text-gray-500 font-medium">No team members available</p>
              <p className="text-xs text-gray-400 mt-1">Add members to the project first</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map(member => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={`w-full flex items-center justify-between gap-3 p-4 border-2 rounded-lg transition-all ${
                      isSelected
                        ? 'border-[#EF4444] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {initialsFor(member.email)}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{member.email}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedMembers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-800 mb-2">
              {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
            </div>
            <div className="text-xs text-blue-700">
              These members will be notified and can start working on the task.
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || selectedMembers.length === 0}
            className="px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            {loading ? 'Assigning...' : 'Assign Members'}
          </button>
        </div>
      </div>
    </div>
  );
}

