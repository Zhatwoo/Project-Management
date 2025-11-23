"use client"

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(true);
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		// TODO: replace with real auth call
		console.log("signin", { code, email, password, remember });
		setTimeout(() => setLoading(false), 700);
	};

	const onSocial = (provider) => {
		console.log("social sign-in", provider);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100">
				<div className="p-8">
					<h2 className="text-2xl font-bold">Welcome back</h2>
					<p className="text-sm text-black mt-1">Sign in to continue to your workspace</p>

					<form onSubmit={onSubmit} className="mt-6 space-y-4">
						<div>
							<label htmlFor="code" className="block text-sm font-medium text-black">Company code</label>
							<input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} required className="mt-2 w-full px-4 py-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500" />
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-black">Email address</label>
							<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full px-4 py-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500" />
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
							<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2 w-full px-4 py-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500" />
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 text-sm text-black">
								<input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4" />
								<span>Remember me</span>
							</label>
							<a href="#" className="text-sm text-red-600 font-medium">Forgot password?</a>
						</div>

						<button type="submit" disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold">
							{loading ? 'Signing in…' : 'Sign In'}
						</button>

						<div className="text-center text-sm text-black">
							Don’t have an account? <Link href="/auth/signup" className="text-red-600 font-semibold">Sign up</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
