"use client";

import React, { useState } from "react";

export default function Deliverables({ deliverables: initialDeliverables }) {
  const [deliverables, setDeliverables] = useState(initialDeliverables || [
    {
      id: 1,
      title: "Homepage Design Mockups",
      description: "Initial design concepts for homepage including hero section, navigation, and footer",
      files: [
        { id: 1, name: "homepage-v1.png", size: 2456789, type: "image" },
        { id: 2, name: "homepage-v2.png", size: 2890123, type: "image" },
        { id: 3, name: "design-specs.pdf", size: 1024567, type: "document" },
      ],
      submittedBy: { name: "Carlos Mendez", email: "carlos@company.com" },
      submittedDate: "2025-11-20",
      status: "pending", // pending, approved, changes-requested
      comments: [
        { id: 1, author: "You", text: "The color scheme looks great, but can we adjust the spacing?", at: new Date().toISOString() },
        { id: 2, author: "Carlos Mendez", text: "Sure, I'll update the spacing and resubmit.", at: new Date().toISOString() },
      ],
    },
    {
      id: 2,
      title: "Logo Variations",
      description: "Three logo variations with different color schemes and layouts",
      files: [
        { id: 4, name: "logo-primary.svg", size: 45678, type: "image" },
        { id: 5, name: "logo-secondary.svg", size: 42345, type: "image" },
        { id: 6, name: "logo-dark.svg", size: 48901, type: "image" },
      ],
      submittedBy: { name: "Maya Lee", email: "maya@company.com" },
      submittedDate: "2025-11-18",
      status: "approved",
      comments: [
        { id: 3, author: "You", text: "Perfect! These look exactly what we need.", at: new Date().toISOString() },
      ],
    },
    {
      id: 3,
      title: "Brand Guidelines Document",
      description: "Complete brand guidelines including typography, colors, and usage examples",
      files: [
        { id: 7, name: "brand-guidelines.pdf", size: 5678901, type: "document" },
        { id: 8, name: "color-palette.png", size: 123456, type: "image" },
      ],
      submittedBy: { name: "Alice Rivera", email: "alice@company.com" },
      submittedDate: "2025-11-15",
      status: "changes-requested",
      comments: [
        { id: 4, author: "You", text: "Can we add more examples for social media usage?", at: new Date().toISOString() },
        { id: 5, author: "Alice Rivera", text: "Absolutely! I'll add a section for social media guidelines.", at: new Date().toISOString() },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState({});
  const [requestChangesNote, setRequestChangesNote] = useState({});

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function getFileIcon(type) {
    if (type === "image") {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }

  function getStatusColor(status) {
    const colors = {
      "pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "approved": "bg-green-100 text-green-700 border-green-200",
      "changes-requested": "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || colors["pending"];
  }

  function getStatusLabel(status) {
    const labels = {
      "pending": "Pending Review",
      "approved": "Approved",
      "changes-requested": "Changes Requested",
    };
    return labels[status] || status;
  }

  function initialsFor(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  function approveDeliverable(id) {
    setDeliverables(deliverables.map(d => 
      d.id === id ? { ...d, status: "approved" } : d
    ));
  }

  function requestChanges(id, note) {
    setDeliverables(deliverables.map(d => 
      d.id === id ? { ...d, status: "changes-requested" } : d
    ));
    if (note) {
      addComment(id, note);
    }
    setRequestChangesNote({ ...requestChangesNote, [id]: "" });
  }

  function addComment(deliverableId, text) {
    if (!text || !text.trim()) return;
    const comment = {
      id: Date.now(),
      author: "You",
      text: text.trim(),
      at: new Date().toISOString(),
    };
    setDeliverables(deliverables.map(d => 
      d.id === deliverableId 
        ? { ...d, comments: [...d.comments, comment] }
        : d
    ));
    setNewComment({ ...newComment, [deliverableId]: "" });
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-100">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Deliverables Review</h1>
              <p className="text-sm text-gray-700 mb-3">The team submits work here for your approval. You can approve it, request changes, or leave comments.</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-green-200">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-700"><strong>Yellow</strong> = Needs your review</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-700"><strong>Green</strong> = Approved</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-green-200">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-700"><strong>Red</strong> = Changes requested</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {deliverables.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500 font-medium">No deliverables yet</p>
            <p className="text-xs text-gray-400 mt-1">Deliverables will appear here when submitted by the team</p>
          </div>
        ) : (
          deliverables.map((deliverable) => (
            <div key={deliverable.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              {/* Deliverable Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{deliverable.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(deliverable.status)}`}>
                      {getStatusLabel(deliverable.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{deliverable.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Submitted by {deliverable.submittedBy.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(deliverable.submittedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {initialsFor(deliverable.submittedBy.name)}
                </div>
              </div>

              {/* Files Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Files / Assets ({deliverable.files.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {deliverable.files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors group">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        file.type === "image" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                      }`}>
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-600 hover:text-[#EF4444] hover:bg-red-50 rounded transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {deliverable.status !== "approved" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What would you like to do?
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => approveDeliverable(deliverable.id)}
                      className="flex-1 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve This Work
                    </button>
                    <button
                      onClick={() => {
                        const note = requestChangesNote[deliverable.id] || "";
                        if (note.trim() || window.confirm("Request changes without a note?")) {
                          requestChanges(deliverable.id, note);
                        }
                      }}
                      className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Request Changes
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">💡 Tip: You can also leave a comment below to ask questions or provide feedback.</p>
                </div>
              )}

              {/* Request Changes Note Input */}
              {deliverable.status !== "approved" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      What needs to be changed?
                      <span className="text-xs font-normal text-gray-500">(Optional - you can also use comments below)</span>
                    </span>
                  </label>
                  <textarea
                    value={requestChangesNote[deliverable.id] || ""}
                    onChange={(e) => setRequestChangesNote({ ...requestChangesNote, [deliverable.id]: e.target.value })}
                    placeholder="Example: 'Please adjust the colors to match our brand guidelines' or 'Can we make the logo bigger?'"
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all resize-none bg-white"
                    rows={3}
                  />
                </div>
              )}

              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments ({deliverable.comments.length})
                </h3>

                {/* Add Comment Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = newComment[deliverable.id] || "";
                    if (text.trim()) {
                      addComment(deliverable.id, text);
                    }
                  }}
                  className="mb-4"
                >
                  <textarea
                    value={newComment[deliverable.id] || ""}
                    onChange={(e) => setNewComment({ ...newComment, [deliverable.id]: e.target.value })}
                    placeholder="Add a comment..."
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all resize-none bg-white"
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {deliverable.comments.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</div>
                  ) : (
                    deliverable.comments.map((comment) => (
                      <div key={comment.id} className="border-l-4 border-[#EF4444] pl-4 py-2 bg-gray-50 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-gray-900">{comment.author}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(comment.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

