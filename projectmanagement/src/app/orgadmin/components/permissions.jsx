"use client"

import React, { useState } from "react";

export default function Permissions({ onBack, user, onRoleChange }) {
  const [selectedRole, setSelectedRole] = useState(user?.role || "Member");
  const [permissions, setPermissions] = useState({
    canCreateProjects: selectedRole === "Admin" || selectedRole === "PM",
    canManageUsers: selectedRole === "Admin",
    canViewAllProjects: selectedRole === "Admin" || selectedRole === "PM",
    canManageSettings: selectedRole === "Admin",
    canInviteUsers: selectedRole === "Admin",
    canDeleteProjects: selectedRole === "Admin",
  });

  const roleDefinitions = {
    Admin: {
      description: "Full access to all organization features and settings",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    PM: {
      description: "Can create and manage projects, view all projects",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    Member: {
      description: "Can view assigned projects and contribute to tasks",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    Client: {
      description: "Read-only access to assigned projects",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };

  function handleRoleChange(newRole) {
    setSelectedRole(newRole);
    // Update permissions based on role
    const newPermissions = {
      canCreateProjects: newRole === "Admin" || newRole === "PM",
      canManageUsers: newRole === "Admin",
      canViewAllProjects: newRole === "Admin" || newRole === "PM",
      canManageSettings: newRole === "Admin",
      canInviteUsers: newRole === "Admin",
      canDeleteProjects: newRole === "Admin",
    };
    setPermissions(newPermissions);
  }

  function handleSave() {
    if (onRoleChange && user) {
      onRoleChange(user.id, selectedRole, permissions);
    }
    if (onBack) {
      onBack();
    }
  }

  const permissionLabels = {
    canCreateProjects: "Create Projects",
    canManageUsers: "Manage Users",
    canViewAllProjects: "View All Projects",
    canManageSettings: "Manage Organization Settings",
    canInviteUsers: "Invite New Users",
    canDeleteProjects: "Delete Projects",
  };

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
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Manage Permissions</h3>
          <p className="text-sm text-gray-600">
            {user ? `Change role and permissions for ${user.name}` : "Configure user role and access permissions"}
          </p>
        </div>
      </header>

      <div className="space-y-6">
        {user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xl shadow-sm">
                {user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Role</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(roleDefinitions).map(([role, def]) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedRole === role
                    ? "border-[#EF4444] bg-red-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{role}</span>
                  {selectedRole === role && (
                    <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600">{def.description}</p>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${roleDefinitions[selectedRole]?.color || ""}`}>
                {selectedRole}
              </span>
              <span className="text-sm text-gray-600">Selected role</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissions Overview</h4>
          <div className="space-y-3">
            {Object.entries(permissions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  {value ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-900">{permissionLabels[key]}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {value ? "Allowed" : "Denied"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

