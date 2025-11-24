"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Settings({ user: initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser || {
    name: "John Doe",
    email: "john.doe@company.com",
    avatar: null,
    role: "Client",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskAssignments: true,
    taskUpdates: true,
    mentions: true,
    deliverableSubmissions: true,
    discussionReplies: true,
    projectUpdates: false,
    weeklyDigest: true,
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  function initialsFor(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  const [avatarError, setAvatarError] = useState("");

  function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    if (!file.type.startsWith('image/')) {
      setAvatarError("Please upload an image file (JPG, PNG, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({ ...user, avatar: reader.result });
      setAvatarError("");
      setSaveMessage("Profile picture updated! Don't forget to save your changes.");
      setTimeout(() => setSaveMessage(""), 3000);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  }

  function getPasswordStrength(password) {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const levels = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
      { label: "Very Strong", color: "bg-green-600" },
    ];
    return { strength, ...levels[Math.min(strength, 5)] };
  }

  function handleProfileSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 500);
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setSaveMessage("Password changed successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 500);
  }

  function toggleNotification(key) {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  }

  function handleNotificationSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveMessage("Notification settings saved!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 500);
  }

  return (
    <div className="w-full">
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
        >
          <svg 
            className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" 
            />
          </svg>
          <span className="group-hover:translate-x-[-2px] transition-transform duration-200">Back</span>
        </button>
      </div>

      <header className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 border border-blue-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Profile & Settings</h1>
              <p className="text-base text-gray-700 leading-relaxed mb-4">Manage your profile information, change your password, and customize your notification preferences. All your account settings in one place.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-blue-200">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Update Profile</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-blue-200">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Change Password</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-blue-200">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="text-gray-700 font-medium">Notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {saveMessage && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900">{saveMessage}</p>
          </div>
          <button
            onClick={() => setSaveMessage("")}
            className="text-green-600 hover:text-green-800 p-1 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
                </div>
            Profile Information
          </h2>
              <p className="text-sm text-gray-600 ml-13">Update your personal information and profile picture</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
              <div className="relative group">
                {user.avatar ? (
                  <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-100 shadow-lg ring-4 ring-gray-50"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                      <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-gray-100 shadow-lg ring-4 ring-gray-50">
                    {initialsFor(user.name)}
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-red-600 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl hover:scale-110 transition-all border-4 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 pt-2">
                <p className="text-base font-semibold text-gray-900 mb-2">Profile Picture</p>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">Click the camera icon to upload a new photo. We support JPG, PNG, and GIF formats. Maximum file size is 5MB.</p>
                {avatarError && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-red-800">{avatarError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 p-4 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white hover:border-gray-300"
                placeholder="Enter your full name"
                required
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This is how your name appears to other team members
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 p-4 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white hover:border-gray-300"
                placeholder="your.email@company.com"
                required
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This email is used for login and receiving notifications
              </p>
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Role
              </label>
              <div className="w-full rounded-xl border-2 border-gray-200 p-4 text-base font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100">
                {user.role}
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your role is managed by your organization administrator
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-[#EF4444] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {saving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
                </div>
              Change Password
            </h2>
              <p className="text-sm text-gray-600 ml-13">Update your password to keep your account secure</p>
            </div>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-5 py-2.5 text-sm font-semibold text-[#EF4444] hover:text-white hover:bg-[#EF4444] border-2 border-[#EF4444] rounded-xl transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-5 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 p-4 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white hover:border-gray-300"
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 p-4 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white hover:border-gray-300"
                  placeholder="Enter your new password"
                  required
                />
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">Password Strength:</span>
                      <span className={`text-xs font-semibold ${getPasswordStrength(newPassword).color.replace('bg-', 'text-')}`}>
                        {getPasswordStrength(newPassword).label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getPasswordStrength(newPassword).color}`}
                        style={{ width: `${(getPasswordStrength(newPassword).strength / 5) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <div className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={newPassword.length >= 8 ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-2 ${/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        Mix of uppercase and lowercase letters
                      </div>
                      <div className={`flex items-center gap-2 ${/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={/\d/.test(newPassword) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        Include numbers
                      </div>
                      <div className={`flex items-center gap-2 ${/[^a-zA-Z\d]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={/[^a-zA-Z\d]/.test(newPassword) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        Include special characters (!@#$% etc.)
                      </div>
                    </div>
                  </div>
                )}
                {!newPassword && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Password must be at least 8 characters long. Use a mix of letters, numbers, and symbols for better security.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-xl border-2 p-4 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 transition-all bg-white ${
                    confirmPassword && newPassword !== confirmPassword
                      ? 'border-red-300 focus:border-red-400'
                      : confirmPassword && newPassword === confirmPassword
                      ? 'border-green-300 focus:border-green-400'
                      : 'border-gray-200 hover:border-gray-300 focus:border-[#EF4444]'
                  }`}
                  placeholder="Confirm your new password"
                  required
                />
                {confirmPassword && (
                  <div className="mt-2">
                    {newPassword === confirmPassword ? (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Passwords match!
                      </p>
                    ) : (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>

              {passwordError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-900 mb-1">Error</p>
                  <p className="text-sm text-red-800">{passwordError}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-6 border-t border-gray-300">
                <button
                  type="submit"
                  disabled={saving || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all border-2 border-transparent hover:border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Notification Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                </div>
                Notification Settings
              </h2>
              <p className="text-sm text-gray-600 ml-13">Choose what email notifications you want to receive</p>
            </div>
            <button
              onClick={handleNotificationSave}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold text-[#EF4444] hover:text-white hover:bg-[#EF4444] border-2 border-[#EF4444] rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Settings
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all">
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Notifications
                </div>
                <div className="text-sm text-gray-600">Master switch for all email notifications</div>
              </div>
              <button
                onClick={() => toggleNotification('emailNotifications')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner overflow-hidden ${
                  notifications.emailNotifications ? 'bg-[#EF4444]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out will-change-transform ${
                    notifications.emailNotifications ? 'translate-x-[26px]' : 'translate-x-[4px]'
                  }`}
                />
              </button>
            </div>

            {/* Individual Notification Settings */}
            {notifications.emailNotifications && (
              <div className="space-y-3 pl-6 border-l-4 border-purple-200 bg-purple-50/30 rounded-r-xl p-4">
                <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Individual Notification Types
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Task Assignments</div>
                    <div className="text-xs text-gray-600">When you're assigned to a task</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('taskAssignments')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner flex-shrink-0 overflow-hidden ${
                      notifications.taskAssignments ? 'bg-[#EF4444]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out will-change-transform ${
                        notifications.taskAssignments ? 'translate-x-[24px]' : 'translate-x-[4px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Task Updates</div>
                    <div className="text-xs text-gray-600">When tasks you're assigned to are updated</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('taskUpdates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner flex-shrink-0 overflow-hidden ${
                      notifications.taskUpdates ? 'bg-[#EF4444]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out will-change-transform ${
                        notifications.taskUpdates ? 'translate-x-[24px]' : 'translate-x-[4px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Mentions</div>
                    <div className="text-xs text-gray-600">When someone mentions you (@yourname)</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('mentions')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner flex-shrink-0 overflow-hidden ${
                      notifications.mentions ? 'bg-[#EF4444]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out will-change-transform ${
                        notifications.mentions ? 'translate-x-[24px]' : 'translate-x-[4px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Deliverable Submissions</div>
                    <div className="text-xs text-gray-600">When new deliverables are submitted for review</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('deliverableSubmissions')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner flex-shrink-0 overflow-hidden ${
                      notifications.deliverableSubmissions ? 'bg-[#EF4444]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out will-change-transform ${
                        notifications.deliverableSubmissions ? 'translate-x-[24px]' : 'translate-x-[4px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Discussion Replies</div>
                    <div className="text-xs text-gray-600">When someone replies to your discussions</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('discussionReplies')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner flex-shrink-0 overflow-hidden ${
                      notifications.discussionReplies ? 'bg-[#EF4444]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out will-change-transform ${
                        notifications.discussionReplies ? 'translate-x-[24px]' : 'translate-x-[4px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Project Updates</div>
                    <div className="text-xs text-gray-600">When project details or timeline changes</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('projectUpdates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner flex-shrink-0 overflow-hidden ${
                      notifications.projectUpdates ? 'bg-[#EF4444]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out will-change-transform ${
                        notifications.projectUpdates ? 'translate-x-[24px]' : 'translate-x-[4px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Weekly Digest</div>
                    <div className="text-xs text-gray-600">A summary of project activity sent weekly</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('weeklyDigest')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner flex-shrink-0 overflow-hidden ${
                      notifications.weeklyDigest ? 'bg-[#EF4444]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out will-change-transform ${
                        notifications.weeklyDigest ? 'translate-x-[24px]' : 'translate-x-[4px]'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {!notifications.emailNotifications && (
              <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="font-medium text-gray-700 mb-1">Email notifications are disabled</p>
                <p className="text-xs text-gray-500">Enable email notifications above to configure individual notification types.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

