"use client"

import React, { useState } from "react";

export default function OrgSetting({ initial }) {
  const [orgName, setOrgName] = useState((initial && initial.orgName) || "Acme Co");
  const [timezone, setTimezone] = useState((initial && initial.timezone) || "UTC");
  const [billingPlan, setBillingPlan] = useState((initial && initial.billing) || "Pro");
  const [integrations, setIntegrations] = useState((initial && initial.integrations) || { slack: false, github: false });

  function toggleIntegration(key) {
    setIntegrations({ ...integrations, [key]: !integrations[key] });
  }

  function onSubmit(e) {
    e.preventDefault();
    // Save settings (placeholder)
    console.log('save org settings', { orgName, timezone, billingPlan, integrations });
    alert('Settings saved');
  }

  return (
    <div id="settings" className="w-full">
      <header className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Organization Settings</h3>
        <p className="text-sm text-gray-600">Update organization profile, billing and integrations</p>
      </header>

      <form className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Organization name</span>
            <input 
              className="px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
              value={orgName} 
              onChange={e=>setOrgName(e.target.value)} 
              required 
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Logo</span>
            <div className="flex items-center gap-3">
              <input 
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#EF4444] file:text-white hover:file:bg-[#DC2626] transition-all cursor-pointer" 
                type="file" 
                accept="image/*" 
              />
            </div>
            <small className="text-xs text-gray-500 mt-1">PNG or SVG, max 2MB</small>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Timezone</span>
            <select 
              className="px-4 py-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all cursor-pointer" 
              value={timezone} 
              onChange={e=>setTimezone(e.target.value)}
            >
              <option>UTC</option>
              <option>America/Los_Angeles</option>
              <option>Asia/Manila</option>
              <option>Europe/London</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Billing plan</span>
            <select 
              className="px-4 py-3 rounded-lg border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all cursor-pointer" 
              value={billingPlan} 
              onChange={e=>setBillingPlan(e.target.value)}
            >
              <option>Free</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
          </label>
        </div>

        <fieldset className="border border-gray-200 p-6 rounded-xl bg-gray-50">
          <legend className="px-2 text-base font-semibold text-gray-900">Integrations</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5.042 15.165a2.99 2.99 0 0 1-2.42 2.422C1.218 17.802 0 16.533 0 15.062V8.938c0-1.47 1.218-2.74 2.622-2.525a2.99 2.99 0 0 1 2.42 2.422c.782.182 1.342.742 1.524 1.524a2.99 2.99 0 0 1 2.422 2.42zm12.581 2.935a2.99 2.99 0 0 1-2.425-2.424 2.99 2.99 0 0 1-1.523-1.523 2.99 2.99 0 0 1-2.422-2.422C8.218 9.74 9.436 8.47 10.84 8.685a2.99 2.99 0 0 1 2.422 2.422c.782.181 1.342.742 1.524 1.524a2.99 2.99 0 0 1 2.42 2.422c1.404.215 2.622-1.055 2.622-2.526V8.938c0-1.47-1.218-2.74-2.622-2.525a2.99 2.99 0 0 1-2.42-2.422C13.24 3.218 12.68 2.658 11.898 2.476a2.99 2.99 0 0 1-2.422-2.42C8.072-1.358 6.854-.088 6.854 1.383v6.124c0 1.47 1.218 2.74 2.622 2.525a2.99 2.99 0 0 1 2.422 2.422c.782.181 1.342.742 1.524 1.524a2.99 2.99 0 0 1 2.42 2.422c1.404.215 2.622-1.055 2.622-2.526v-6.124c0-1.47-1.218-2.74-2.622-2.525a2.99 2.99 0 0 1-2.42-2.422C13.24 1.218 12.68.658 11.898.476A2.99 2.99 0 0 1 9.476-1.946C8.072-2.161 6.854-.891 6.854.58v6.124c0 1.47 1.218 2.74 2.622 2.525a2.99 2.99 0 0 1 2.422 2.422c.782.182 1.342.742 1.524 1.524a2.99 2.99 0 0 1 2.42 2.422c1.404.215 2.622-1.055 2.622-2.526V1.383c0-1.47-1.218-2.74-2.622-2.525z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Slack</div>
                    <div className="text-xs text-gray-500">Team communication</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  integrations.slack ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {integrations.slack ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <button 
                type="button" 
                className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  integrations.slack 
                    ? 'border border-gray-200 hover:bg-gray-50 text-gray-700' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
                onClick={()=>toggleIntegration('slack')}
              >
                {integrations.slack ? 'Disconnect' : 'Connect Slack'}
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">GitHub</div>
                    <div className="text-xs text-gray-500">Code repository</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  integrations.github ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {integrations.github ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <button 
                type="button" 
                className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  integrations.github 
                    ? 'border border-gray-200 hover:bg-gray-50 text-gray-700' 
                    : 'bg-gray-900 hover:bg-black text-white'
                }`}
                onClick={()=>toggleIntegration('github')}
              >
                {integrations.github ? 'Disconnect' : 'Connect GitHub'}
              </button>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            className="px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
