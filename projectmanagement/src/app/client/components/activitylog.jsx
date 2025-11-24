"use client";

import React, { useState, useMemo } from "react";

export default function ActivityLog({ activities: initialActivities, teamMembers: initialTeamMembers }) {
  const teamMembers = initialTeamMembers || [
    { id: 1, name: "Alice Rivera", email: "alice@company.com", role: "Project Manager" },
    { id: 2, name: "Carlos Mendez", email: "carlos@company.com", role: "Designer" },
    { id: 3, name: "Maya Lee", email: "maya@company.com", role: "Developer" },
    { id: 4, name: "You", email: "you@company.com", role: "Client" },
  ];

  const [activities, setActivities] = useState(initialActivities || [
    {
      id: 1,
      type: "task_created",
      user: { name: "Alice Rivera", email: "alice@company.com" },
      description: "Created task: Design landing page hero",
      target: { type: "task", id: "T-101", name: "Design landing page hero" },
      timestamp: "2025-11-20T14:30:00",
    },
    {
      id: 2,
      type: "status_changed",
      user: { name: "Carlos Mendez", email: "carlos@company.com" },
      description: "Changed status of 'Design landing page hero' from 'To Do' to 'In Progress'",
      target: { type: "task", id: "T-101", name: "Design landing page hero" },
      timestamp: "2025-11-20T15:45:00",
    },
    {
      id: 3,
      type: "comment_added",
      user: { name: "Maya Lee", email: "maya@company.com" },
      description: "Added a comment on 'Design landing page hero'",
      target: { type: "task", id: "T-101", name: "Design landing page hero" },
      timestamp: "2025-11-20T16:20:00",
    },
    {
      id: 4,
      type: "file_uploaded",
      user: { name: "Carlos Mendez", email: "carlos@company.com" },
      description: "Uploaded file: homepage-mockup-v1.png",
      target: { type: "file", id: "F-001", name: "homepage-mockup-v1.png" },
      timestamp: "2025-11-20T17:00:00",
    },
    {
      id: 5,
      type: "deliverable_approved",
      user: { name: "You", email: "you@company.com" },
      description: "Approved deliverable: Homepage Design Mockups",
      target: { type: "deliverable", id: "D-001", name: "Homepage Design Mockups" },
      timestamp: "2025-11-19T10:15:00",
    },
    {
      id: 6,
      type: "discussion_created",
      user: { name: "Alice Rivera", email: "alice@company.com" },
      description: "Started discussion: Brand Color Palette Discussion",
      target: { type: "discussion", id: "DIS-001", name: "Brand Color Palette Discussion" },
      timestamp: "2025-11-18T09:00:00",
    },
    {
      id: 7,
      type: "task_assigned",
      user: { name: "Alice Rivera", email: "alice@company.com" },
      description: "Assigned task 'Setup analytics' to Maya Lee",
      target: { type: "task", id: "T-102", name: "Setup analytics" },
      timestamp: "2025-11-17T11:30:00",
    },
    {
      id: 8,
      type: "time_logged",
      user: { name: "Maya Lee", email: "maya@company.com" },
      description: "Logged 2h 30m on 'Setup analytics'",
      target: { type: "task", id: "T-102", name: "Setup analytics" },
      timestamp: "2025-11-17T14:00:00",
    },
    {
      id: 9,
      type: "status_changed",
      user: { name: "Maya Lee", email: "maya@company.com" },
      description: "Changed status of 'Setup analytics' from 'In Progress' to 'Done'",
      target: { type: "task", id: "T-102", name: "Setup analytics" },
      timestamp: "2025-11-17T16:45:00",
    },
    {
      id: 10,
      type: "deliverable_submitted",
      user: { name: "Carlos Mendez", email: "carlos@company.com" },
      description: "Submitted deliverable: Logo Variations",
      target: { type: "deliverable", id: "D-002", name: "Logo Variations" },
      timestamp: "2025-11-16T13:20:00",
    },
    {
      id: 11,
      type: "comment_added",
      user: { name: "You", email: "you@company.com" },
      description: "Added a comment on 'Brand Color Palette Discussion'",
      target: { type: "discussion", id: "DIS-001", name: "Brand Color Palette Discussion" },
      timestamp: "2025-11-15T10:00:00",
    },
    {
      id: 12,
      type: "project_updated",
      user: { name: "Alice Rivera", email: "alice@company.com" },
      description: "Updated project timeline and milestones",
      target: { type: "project", id: "PRJ-001", name: "Website Redesign" },
      timestamp: "2025-11-14T08:30:00",
    },
  ]);

  const [userFilter, setUserFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [query, setQuery] = useState("");

  const eventTypes = [
    { value: "All", label: "All Events" },
    { value: "task_created", label: "Task Created" },
    { value: "status_changed", label: "Status Changed" },
    { value: "comment_added", label: "Comment Added" },
    { value: "file_uploaded", label: "File Uploaded" },
    { value: "deliverable_approved", label: "Deliverable Approved" },
    { value: "deliverable_submitted", label: "Deliverable Submitted" },
    { value: "discussion_created", label: "Discussion Created" },
    { value: "task_assigned", label: "Task Assigned" },
    { value: "time_logged", label: "Time Logged" },
    { value: "project_updated", label: "Project Updated" },
  ];

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (userFilter !== "All" && activity.user.name !== userFilter) return false;
      if (eventFilter !== "All" && activity.type !== eventFilter) return false;
      if (query && !activity.description.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [activities, userFilter, eventFilter, query]);

  function getEventIcon(type) {
    const icons = {
      task_created: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      status_changed: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      comment_added: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      file_uploaded: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      deliverable_approved: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      deliverable_submitted: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      discussion_created: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      task_assigned: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      time_logged: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      project_updated: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    };
    return icons[type] || (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  function getEventColor(type) {
    const colors = {
      task_created: "bg-blue-100 text-blue-600",
      status_changed: "bg-yellow-100 text-yellow-600",
      comment_added: "bg-green-100 text-green-600",
      file_uploaded: "bg-purple-100 text-purple-600",
      deliverable_approved: "bg-green-100 text-green-600",
      deliverable_submitted: "bg-blue-100 text-blue-600",
      discussion_created: "bg-indigo-100 text-indigo-600",
      task_assigned: "bg-orange-100 text-orange-600",
      time_logged: "bg-pink-100 text-pink-600",
      project_updated: "bg-gray-100 text-gray-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  }

  function getEventLabel(type) {
    const labels = {
      task_created: "Task Created",
      status_changed: "Status Changed",
      comment_added: "Comment",
      file_uploaded: "File Uploaded",
      deliverable_approved: "Deliverable Approved",
      deliverable_submitted: "Deliverable Submitted",
      discussion_created: "Discussion",
      task_assigned: "Task Assigned",
      time_logged: "Time Logged",
      project_updated: "Project Updated",
    };
    return labels[type] || type;
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function initialsFor(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  function groupActivitiesByDate(activities) {
    const groups = {};
    activities.forEach((activity) => {
      const date = new Date(activity.timestamp);
      const dateKey = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });
    return groups;
  }

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  return (
    <div className="w-full">
      <header className="mb-8">
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 border border-teal-100">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Activity Log</h1>
              <p className="text-sm text-gray-700 mb-3">See everything that's happening in your project. This shows all actions like task updates, file uploads, comments, and more. Use the filters below to find specific activities.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-teal-200">
                  <span className="text-gray-700">👤 <strong>Filter by person</strong> to see what they did</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-teal-200">
                  <span className="text-gray-700">🔍 <strong>Search</strong> for specific activities</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-teal-200">
                  <span className="text-gray-700">📅 <strong>Grouped by date</strong> for easy browsing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              👤 Who did it?
            </label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all cursor-pointer"
            >
              <option value="All">👥 Everyone</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              📋 What happened?
            </label>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all cursor-pointer"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              🔍 Search activities
            </label>
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium">No activities found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([dateKey, dateActivities]) => (
            <div key={dateKey}>
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <div className="px-4 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                  {dateKey}
                </div>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Activities for this date */}
              <div className="relative pl-8">
                {/* Timeline line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-4">
                  {dateActivities.map((activity, index) => (
                    <div key={activity.id} className="relative flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className={`absolute left-0 w-6 h-6 rounded-full ${getEventColor(activity.type)} flex items-center justify-center z-10 shadow-sm`}>
                        {getEventIcon(activity.type)}
                      </div>

                      {/* Activity Card */}
                      <div className="ml-8 flex-1 bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                                {initialsFor(activity.user.name)}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{activity.user.name}</div>
                                <div className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</div>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getEventColor(activity.type)}`}>
                                {getEventLabel(activity.type)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{activity.description}</p>
                            {activity.target && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="capitalize">{activity.target.type}</span>
                                <span>•</span>
                                <span className="font-medium">{activity.target.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(activity.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

