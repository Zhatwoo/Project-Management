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
    <div id="settings" className="bg-gray-50 p-5 rounded-lg shadow text-black">
      <header className="mb-3">
        <h3 className="text-lg font-bold">Organization Settings</h3>
        <p className="text-sm text-black">Update organization profile, billing and integrations</p>
      </header>

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex gap-4 flex-wrap">
          <label className="flex-1 flex flex-col text-sm">Organization name
            <input className="mt-1 px-3 py-2 border rounded" value={orgName} onChange={e=>setOrgName(e.target.value)} required />
          </label>

          <label className="flex-1 flex flex-col text-sm">Logo
            <input className="mt-1 px-3 py-2 border rounded" type="file" accept="image/*" />
            <small className="text-xs text-black">PNG or SVG, max 2MB</small>
          </label>
        </div>

        <div className="flex gap-4 flex-wrap">
          <label className="flex-1 flex flex-col text-sm">Timezone
            <select className="mt-1 px-3 py-2 border rounded" value={timezone} onChange={e=>setTimezone(e.target.value)}>
              <option>UTC</option>
              <option>America/Los_Angeles</option>
              <option>Asia/Manila</option>
              <option>Europe/London</option>
            </select>
          </label>

          <label className="flex-1 flex flex-col text-sm">Billing plan
            <select className="mt-1 px-3 py-2 border rounded" value={billingPlan} onChange={e=>setBillingPlan(e.target.value)}>
              <option>Free</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
          </label>
        </div>

        <fieldset className="border border-gray-100 p-3 rounded">
          <legend className="font-semibold">Integrations</legend>
          <div className="flex gap-6 mt-2 flex-wrap">
            <div className="flex-1">
              <div className="font-semibold">Slack</div>
              <div className="flex items-center gap-3 mt-2">
                <button type="button" className="border border-gray-200 px-3 py-2 rounded" onClick={()=>toggleIntegration('slack')}>{integrations.slack ? 'Disconnect' : 'Connect'}</button>
                <span className="text-sm text-black">{integrations.slack ? 'Connected' : 'Not connected'}</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="font-semibold">GitHub</div>
              <div className="flex items-center gap-3 mt-2">
                <button type="button" className="border border-gray-200 px-3 py-2 rounded" onClick={()=>toggleIntegration('github')}>{integrations.github ? 'Disconnect' : 'Connect'}</button>
                <span className="text-sm text-black">{integrations.github ? 'Connected' : 'Not connected'}</span>
              </div>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end">
          <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Save changes</button>
        </div>
      </form>
    </div>
  );
}
