"use client"

import React, { useState, useEffect } from 'react';

export default function CreateEditProject({ open = false, project, onClose = () => {}, onSave = () => {} }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setStartDate(project.startDate || '');
      setEndDate(project.endDate || '');
    } else if (open) {
      // Reset form when opening for new project
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    }
  }, [open, project]);

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a project name');
    setLoading(true);
    try {
      const payload = { 
        name: name.trim(), 
        description: description.trim(),
        startDate,
        endDate,
        ...(project?.id && { id: project.id })
      };
      await new Promise(r => setTimeout(r, 600)); // simulate API
      onSave(payload);
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 pt-10 sm:pt-0">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <form
        onSubmit={handleSave}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-edit-project-title"
        aria-describedby="create-edit-project-desc"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#EF4444] to-red-600">
          <h3 id="create-edit-project-title" className="text-lg font-semibold text-white">
            {project?.id ? 'Edit Project' : 'Create New Project'}
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

        <div id="create-edit-project-desc" className="p-6 space-y-5 overflow-auto max-h-[75vh]">
          <label className="block">
            <div className="text-sm font-semibold mb-2 text-gray-900 flex items-center gap-2">
              <span>Project Name</span>
              <span className="text-red-500">*</span>
            </div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all text-sm"
              placeholder="e.g. Website Redesign"
              aria-required="true"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-semibold mb-2 text-gray-900">Description</div>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all resize-none text-sm"
              placeholder="Describe the project goals and scope..."
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-semibold mb-2 text-gray-900">Start Date</div>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all text-sm"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold mb-2 text-gray-900">End Date</div>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all text-sm"
              />
            </label>
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
            type="submit" 
            disabled={loading || !name.trim()} 
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#EF4444] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {project?.id ? 'Save Changes' : 'Create Project'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

