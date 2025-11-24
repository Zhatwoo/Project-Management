"use client";

import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Settings from "./components/settings";

export default function SettingsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Settings />
        </div>
      </div>
      <Footer />
    </>
  );
}

