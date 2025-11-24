"use client"

import React from 'react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#222222] border-t border-[#111]/10 text-sm text-white h-12 flex items-center z-30">
      <div className="w-full px-4 flex items-center justify-between">
        <div className="text-xs text-white">© {new Date().getFullYear()} Project Management</div>
        <div className="text-xs text-white hidden sm:block">Version 0.1.0</div>
      </div>
    </footer>
  );
}
