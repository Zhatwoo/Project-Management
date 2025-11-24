"use client";

import React, { useState, useMemo } from "react";

export default function FilesPage({ files: initialFiles, folders: initialFolders }) {
  const [files, setFiles] = useState(initialFiles || [
    { id: 1, name: "project-brief.pdf", size: 2456789, type: "document", uploadedBy: "Alice Rivera", uploadedAt: "2025-11-15", folder: "Documents" },
    { id: 2, name: "design-mockup-v1.png", size: 3456789, type: "image", uploadedBy: "Carlos Mendez", uploadedAt: "2025-11-18", folder: "Designs" },
    { id: 3, name: "brand-guidelines.pdf", size: 1234567, type: "document", uploadedBy: "Maya Lee", uploadedAt: "2025-11-20", folder: "Documents" },
    { id: 4, name: "logo-final.svg", size: 45678, type: "image", uploadedBy: "Carlos Mendez", uploadedAt: "2025-11-22", folder: "Designs" },
    { id: 5, name: "meeting-notes-2025-11-20.txt", size: 12345, type: "document", uploadedBy: "Alice Rivera", uploadedAt: "2025-11-20", folder: "Meetings" },
    { id: 6, name: "color-palette.png", size: 234567, type: "image", uploadedBy: "Maya Lee", uploadedAt: "2025-11-19", folder: "Designs" },
    { id: 7, name: "project-timeline.xlsx", size: 567890, type: "document", uploadedBy: "Alice Rivera", uploadedAt: "2025-11-16", folder: "Documents" },
    { id: 8, name: "wireframes.pdf", size: 3456789, type: "document", uploadedBy: "Carlos Mendez", uploadedAt: "2025-11-17", folder: "Designs" },
  ]);

  const [folders] = useState(initialFolders || [
    { id: 1, name: "Documents", fileCount: 3 },
    { id: 2, name: "Designs", fileCount: 4 },
    { id: 3, name: "Meetings", fileCount: 1 },
  ]);

  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFolders, setShowFolders] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const filteredFiles = useMemo(() => {
    let result = files;
    
    if (selectedFolder) {
      result = result.filter(f => f.folder === selectedFolder);
    }
    
    if (query) {
      result = result.filter(f => 
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.uploadedBy.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return result;
  }, [files, selectedFolder, query]);

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function getFileIcon(type, name) {
    const ext = name.split('.').pop()?.toLowerCase();
    
    if (type === "image" || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (['pdf'].includes(ext)) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    if (['txt', 'md'].includes(ext)) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }

  function getFileTypeColor(type, name) {
    const ext = name.split('.').pop()?.toLowerCase();
    
    if (type === "image" || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
      return "bg-blue-100 text-blue-600";
    }
    
    if (['pdf'].includes(ext)) {
      return "bg-red-100 text-red-600";
    }
    
    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      return "bg-green-100 text-green-600";
    }
    
    return "bg-gray-100 text-gray-600";
  }

  function handleFileUpload(e) {
    const uploadedFiles = Array.from(e.target.files || []);
    if (!uploadedFiles.length) return;
    
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newFiles = uploadedFiles.map((f, i) => ({
        id: Date.now() + i,
        name: f.name,
        size: f.size,
        type: f.type.startsWith('image/') ? 'image' : 'document',
        uploadedBy: "You",
        uploadedAt: new Date().toISOString().split('T')[0],
        folder: selectedFolder || "Root",
      }));
      
      setFiles([...newFiles, ...files]);
      setUploading(false);
      e.target.value = null;
    }, 500);
  }

  function initialsFor(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Files</h1>
              <p className="text-sm text-gray-700 mb-3">All project files are stored here. You can upload files, download them, or organize them by folders. Files are shared with everyone on the team.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-indigo-200">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">Images</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-indigo-200">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">Documents</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-indigo-200">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-700">Spreadsheets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? 'bg-[#EF4444] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list"
                  ? 'bg-[#EF4444] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Upload Button */}
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              multiple
              disabled={uploading}
            />
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 ${
              uploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#EF4444] hover:bg-[#DC2626] text-white hover:shadow-md'
            }`}>
              {uploading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Files
                </>
              )}
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Folders */}
        {showFolders && (
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Folders
                </h3>
                <button
                  onClick={() => setShowFolders(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                  aria-label="Hide folders"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                    selectedFolder === null
                      ? 'bg-[#EF4444]/10 text-[#EF4444]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    All Files
                  </span>
                  <span className="text-xs text-gray-500">{files.length}</span>
                </button>
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                      selectedFolder === folder.name
                        ? 'bg-[#EF4444]/10 text-[#EF4444]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      {folder.name}
                    </span>
                    <span className="text-xs text-gray-500">{folder.fileCount}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#EF4444]/30 focus-within:border-[#EF4444] transition-all">
              <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files..."
                className="text-gray-700 px-2 py-2 text-sm outline-none flex-1 min-w-0"
              />
              {!showFolders && (
                <button
                  onClick={() => setShowFolders(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                  aria-label="Show folders"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Files Display */}
          {filteredFiles.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 font-medium">No files found</p>
              <p className="text-sm text-gray-500 mt-1">
                {query ? "Try adjusting your search query" : "Upload files to get started"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer"
                >
                  <div className={`w-full h-32 rounded-lg ${getFileTypeColor(file.type, file.name)} flex items-center justify-center mb-3`}>
                    {getFileIcon(file.type, file.name)}
                  </div>
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 truncate mb-1 group-hover:text-[#EF4444] transition-colors">
                      {file.name}
                    </h4>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-semibold text-white">
                        {initialsFor(file.uploadedBy)}
                      </div>
                      <span className="text-xs text-gray-600 truncate">{file.uploadedBy}</span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-[#EF4444] hover:bg-red-50 rounded transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${getFileTypeColor(file.type, file.name)} flex items-center justify-center flex-shrink-0`}>
                        {getFileIcon(file.type, file.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#EF4444] transition-colors">
                          {file.name}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {file.uploadedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {file.uploadedAt}
                          </span>
                          {file.folder && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {file.folder}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-[#EF4444] hover:bg-red-50 rounded transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

