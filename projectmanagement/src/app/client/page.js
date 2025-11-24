"use client";

import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ClientSidebar from "./components/clientsidebar";

export default function ClientPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16 pb-12">
        <ClientSidebar />
      </div>
      <Footer />
    </>
  );
}

