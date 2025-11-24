"use client"

import React, { useState } from "react";

export default function NewUser({ onBack, onInviteSent }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (onInviteSent) {
        onInviteSent({ email, role, name: name || email.split('@')[0] });
      }
      // Reset form
      setEmail("");
      setName("");
      setRole("Member");
    }, 1000);
  }

  return (
    <div className="w-full">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Back to User Management"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Invite New User</h3>
          <p className="text-sm text-gray-600">Send an invitation to join your organization</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 mb-2">Email address *</span>
              <input
                className="px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 mb-2">Full name</span>
              <input
                className="px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
              />
            </label>
          </div>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Role *</span>
            <select
              className="px-4 py-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all cursor-pointer"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="Member">Member</option>
              <option value="PM">Project Manager</option>
              <option value="Admin">Admin</option>
              <option value="Client">Client</option>
            </select>
            <small className="text-xs text-gray-500 mt-1">
              The user will receive an email invitation with role-based access
            </small>
          </label>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <p className="text-blue-700">
                  An invitation email will be sent to {email || "the user"}. They can accept the invitation and will be granted access based on the selected role.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

