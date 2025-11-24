"use client";
import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import TMSidebar from "./components/tmsidebar";

export default function MemberPage() {
	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-50 pt-16 pb-12">
				<TMSidebar />
			</div>
			<Footer />
		</>
	);
}

