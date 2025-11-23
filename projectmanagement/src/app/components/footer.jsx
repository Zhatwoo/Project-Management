"use client"

import React from 'react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#222222] border-t border-gray-100 text-sm text-black h-12 flex items-center z-30">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="text-xs text-white">© {new Date().getFullYear()} Project Management</div>
        <div className="text-xs text-white hidden sm:block">Version 0.1.0</div>
      </div>
    </footer>
  );
}
