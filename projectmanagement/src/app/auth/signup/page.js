"use client"

import React, { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    // TODO: wire to signup API
    console.log("signup", { companyCode, name, email });
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold">Create an account</h2>
          <p className="text-sm text-black mt-1">Start your free trial — no credit card required.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-black">Company code</label>
              <input id="company" type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} required className="mt-2 w-full px-4 py-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500" />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black">Full name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 w-full px-4 py-2 border rounded-lg border-gray-200" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">Email address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full px-4 py-2 border rounded-lg border-gray-200" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2 w-full px-4 py-2 border rounded-lg border-gray-200" />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-black">Confirm password</label>
              <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="mt-2 w-full px-4 py-2 border rounded-lg border-gray-200" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold">{loading ? 'Creating account…' : 'Create account'}</button>

            <div className="text-center text-sm text-black">Already have an account? <Link href="/auth/login" className="text-red-600 font-semibold">Sign in</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}
