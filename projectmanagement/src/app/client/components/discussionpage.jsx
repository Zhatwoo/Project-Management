"use client";

import React, { useState, useMemo } from "react";

export default function DiscussionPage({ threads: initialThreads, teamMembers: initialTeamMembers }) {
  const teamMembers = initialTeamMembers || [
    { id: 1, name: "Alice Rivera", email: "alice@company.com", role: "Project Manager" },
    { id: 2, name: "Carlos Mendez", email: "carlos@company.com", role: "Designer" },
    { id: 3, name: "Maya Lee", email: "maya@company.com", role: "Developer" },
    { id: 4, name: "You", email: "you@company.com", role: "Client" },
  ];

  const [threads, setThreads] = useState(initialThreads || [
    {
      id: 1,
      title: "Brand Color Palette Discussion",
      author: { name: "Alice Rivera", email: "alice@company.com" },
      createdAt: "2025-11-20T10:30:00",
      content: "I'd like to discuss the brand color palette. @Carlos Mendez, can you share the latest color variations?",
      mentions: ["Carlos Mendez"],
      attachments: [
        { id: 1, name: "color-palette-v1.pdf", size: 1234567, type: "document" },
      ],
      replies: [
        {
          id: 1,
          author: { name: "Carlos Mendez", email: "carlos@company.com" },
          content: "Sure! I've attached the latest color palette. Let me know what you think. @You, your feedback would be great!",
          createdAt: "2025-11-20T11:15:00",
          mentions: ["You"],
          attachments: [
            { id: 2, name: "color-palette-final.pdf", size: 1456789, type: "document" },
          ],
        },
        {
          id: 2,
          author: { name: "You", email: "you@company.com" },
          content: "The colors look great! I especially like the primary red. @Alice Rivera, should we finalize this?",
          createdAt: "2025-11-20T14:20:00",
          mentions: ["Alice Rivera"],
          attachments: [],
        },
      ],
    },
    {
      id: 2,
      title: "Homepage Design Feedback",
      author: { name: "Maya Lee", email: "maya@company.com" },
      createdAt: "2025-11-18T09:00:00",
      content: "I've completed the initial homepage design. @You, could you review and provide feedback? I've attached the mockups.",
      mentions: ["You"],
      attachments: [
        { id: 3, name: "homepage-mockup-v1.png", size: 3456789, type: "image" },
        { id: 4, name: "homepage-mockup-v2.png", size: 3567890, type: "image" },
      ],
      replies: [
        {
          id: 3,
          author: { name: "You", email: "you@company.com" },
          content: "The design looks amazing! I have a few suggestions for the hero section. @Maya Lee, can we adjust the spacing?",
          createdAt: "2025-11-18T15:30:00",
          mentions: ["Maya Lee"],
          attachments: [],
        },
        {
          id: 4,
          author: { name: "Maya Lee", email: "maya@company.com" },
          content: "Absolutely! I'll make those adjustments and share an updated version.",
          createdAt: "2025-11-19T10:00:00",
          mentions: [],
          attachments: [
            { id: 5, name: "homepage-mockup-v2-updated.png", size: 3589012, type: "image" },
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Project Timeline Update",
      author: { name: "Alice Rivera", email: "alice@company.com" },
      createdAt: "2025-11-15T08:00:00",
      content: "I've updated the project timeline. We're slightly ahead of schedule! @Carlos Mendez @Maya Lee, great work everyone!",
      mentions: ["Carlos Mendez", "Maya Lee"],
      attachments: [
        { id: 6, name: "project-timeline-updated.xlsx", size: 567890, type: "document" },
      ],
      replies: [],
    },
  ]);

  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newReplyContent, setNewReplyContent] = useState({});
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newThreadAttachments, setNewThreadAttachments] = useState([]);
  const [replyAttachments, setReplyAttachments] = useState({});
  const [showMentionSuggestions, setShowMentionSuggestions] = useState({ visible: false, position: null, query: "" });

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function getFileIcon(type, name) {
    const ext = name.split('.').pop()?.toLowerCase();
    if (type === "image" || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }

  function extractMentions(text) {
    const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
    const matches = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  }

  function formatContentWithMentions(content) {
    const parts = [];
    const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'mention', content: match[1], full: match[0] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.substring(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  }

  function initialsFor(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  function handleFileUpload(e, type, threadId = null) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const fileObjects = files.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size,
      type: f.type.startsWith('image/') ? 'image' : 'document',
    }));

    if (type === 'thread') {
      setNewThreadAttachments([...newThreadAttachments, ...fileObjects]);
    } else if (type === 'reply' && threadId) {
      setReplyAttachments({ ...replyAttachments, [threadId]: [...(replyAttachments[threadId] || []), ...fileObjects] });
    }

    e.target.value = null;
  }

  function createThread(e) {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const mentions = extractMentions(newThreadContent);
    const newThread = {
      id: Date.now(),
      title: newThreadTitle.trim(),
      author: { name: "You", email: "you@company.com" },
      createdAt: new Date().toISOString(),
      content: newThreadContent.trim(),
      mentions,
      attachments: newThreadAttachments,
      replies: [],
    };

    setThreads([newThread, ...threads]);
    setNewThreadTitle("");
    setNewThreadContent("");
    setNewThreadAttachments([]);
    setShowNewThreadForm(false);
  }

  function addReply(threadId, e) {
    e.preventDefault();
    const content = newReplyContent[threadId] || "";
    if (!content.trim()) return;

    const mentions = extractMentions(content);
    const newReply = {
      id: Date.now(),
      author: { name: "You", email: "you@company.com" },
      content: content.trim(),
      createdAt: new Date().toISOString(),
      mentions,
      attachments: replyAttachments[threadId] || [],
    };

    setThreads(threads.map(t =>
      t.id === threadId
        ? { ...t, replies: [...t.replies, newReply] }
        : t
    ));

    setNewReplyContent({ ...newReplyContent, [threadId]: "" });
    setReplyAttachments({ ...replyAttachments, [threadId]: [] });
  }

  function removeAttachment(type, index, threadId = null) {
    if (type === 'thread') {
      setNewThreadAttachments(newThreadAttachments.filter((_, i) => i !== index));
    } else if (type === 'reply' && threadId) {
      setReplyAttachments({
        ...replyAttachments,
        [threadId]: (replyAttachments[threadId] || []).filter((_, i) => i !== index),
      });
    }
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 mb-6 border border-orange-100">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Discussions</h1>
              <p className="text-sm text-gray-700 mb-3">Have conversations with your team about the project. You can start new discussions, reply to existing ones, mention team members using @, and attach files.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-orange-200">
                  <span className="text-gray-700">💬 <strong>Start discussions</strong> about any topic</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-orange-200">
                  <span className="text-gray-700">@ <strong>Mention</strong> team members to notify them</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-orange-200">
                  <span className="text-gray-700">📎 <strong>Attach files</strong> to share documents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button
          onClick={() => setShowNewThreadForm(!showNewThreadForm)}
          className="px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Discussion
        </button>
      </div>

      {/* New Thread Form */}
      {showNewThreadForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Start a New Discussion
          </h2>
          <form onSubmit={createThread}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's this discussion about?
              </label>
              <input
                type="text"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="Example: 'Brand color feedback' or 'Homepage design questions'"
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your message
              </label>
              <textarea
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                placeholder="Type your message here... Use @ to mention team members (e.g., @Alice Rivera) to notify them."
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all resize-none bg-white"
                rows={5}
                required
              />
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2 border border-gray-200">
                <p className="font-semibold mb-1">💡 Tip: Mention team members</p>
                <p>Type @ followed by their name: {teamMembers.map(m => `@${m.name}`).join(", ")}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              {newThreadAttachments.length > 0 && (
                <div className="mb-2 space-y-2">
                  {newThreadAttachments.map((file, index) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type, file.name)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment('thread', index)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'thread')}
                  className="hidden"
                  multiple
                />
                <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Attachments
                </span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Post Discussion
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewThreadForm(false);
                  setNewThreadTitle("");
                  setNewThreadContent("");
                  setNewThreadAttachments([]);
                }}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discussion Threads */}
      <div className="space-y-6">
        {threads.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-600 font-medium">No discussions yet</p>
            <p className="text-sm text-gray-500 mt-1">Start a new discussion to get the conversation going</p>
          </div>
        ) : (
          threads.map((thread) => (
            <div key={thread.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              {/* Thread Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {initialsFor(thread.author.name)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{thread.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{thread.author.name}</span>
                        <span>•</span>
                        <span>{new Date(thread.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedThread(selectedThread === thread.id ? null : thread.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                  aria-label={selectedThread === thread.id ? "Collapse" : "Expand"}
                >
                  <svg className={`w-5 h-5 transition-transform ${selectedThread === thread.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Thread Content */}
              <div className="mb-4">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {formatContentWithMentions(thread.content).map((part, i) => (
                    part.type === 'mention' ? (
                      <span key={i} className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium mx-0.5">
                        {part.full}
                      </span>
                    ) : (
                      <span key={i}>{part.content}</span>
                    )
                  ))}
                </div>
              </div>

              {/* Thread Attachments */}
              {thread.attachments && thread.attachments.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {thread.attachments.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        {getFileIcon(file.type, file.name)}
                        <div>
                          <div className="text-xs font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-[#EF4444] hover:bg-red-50 rounded transition-all">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Replies Count */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <button
                  onClick={() => setSelectedThread(selectedThread === thread.id ? null : thread.id)}
                  className="text-sm font-medium text-[#EF4444] hover:text-[#DC2626] transition-colors"
                >
                  {thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              </div>

              {/* Replies Section */}
              {selectedThread === thread.id && (
                <div className="space-y-4 mt-4">
                  {/* Replies List */}
                  {thread.replies.map((reply) => (
                    <div key={reply.id} className="border-l-4 border-[#EF4444] pl-4 py-3 bg-gray-50 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                          {initialsFor(reply.author.name)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">{reply.author.name}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-2">
                        {formatContentWithMentions(reply.content).map((part, i) => (
                          part.type === 'mention' ? (
                            <span key={i} className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium mx-0.5">
                              {part.full}
                            </span>
                          ) : (
                            <span key={i}>{part.content}</span>
                          )
                        ))}
                      </div>
                      {reply.attachments && reply.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {reply.attachments.map((file) => (
                            <div key={file.id} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                              {getFileIcon(file.type, file.name)}
                              <div>
                                <div className="text-xs font-medium text-gray-900">{file.name}</div>
                                <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                              </div>
                              <button className="p-1 text-gray-400 hover:text-[#EF4444] hover:bg-red-50 rounded transition-all">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Reply Form */}
                  <form onSubmit={(e) => addReply(thread.id, e)} className="border-t border-gray-200 pt-4">
                    <div className="mb-3">
                      <textarea
                        value={newReplyContent[thread.id] || ""}
                        onChange={(e) => setNewReplyContent({ ...newReplyContent, [thread.id]: e.target.value })}
                        placeholder="Write a reply... Use @ to mention team members"
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all resize-none bg-white"
                        rows={3}
                      />
                    </div>
                    {(replyAttachments[thread.id] || []).length > 0 && (
                      <div className="mb-3 space-y-2">
                        {replyAttachments[thread.id].map((file, index) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.type, file.name)}
                              <div>
                                <div className="text-xs font-medium text-gray-900">{file.name}</div>
                                <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment('reply', index, thread.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'reply', thread.id)}
                          className="hidden"
                          multiple
                        />
                        <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 border border-gray-200 transition-colors flex items-center gap-2">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Attach
                        </span>
                      </label>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                      >
                        Post Reply
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

