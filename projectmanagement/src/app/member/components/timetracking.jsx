"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";

function formatMins(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday=0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateISO(d) {
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
}

export default function TimeTracking() {
  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem("pm_time_entries");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [runningStart, setRunningStart] = useState(() => {
    try {
      const raw = localStorage.getItem("pm_running_start");
      return raw ? Number(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [manualMins, setManualMins] = useState(30);
  const [manualDate, setManualDate] = useState(formatDateISO(new Date()));
  const [manualNote, setManualNote] = useState("");

  useEffect(() => {
    localStorage.setItem("pm_time_entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (runningStart) localStorage.setItem("pm_running_start", String(runningStart));
    else localStorage.removeItem("pm_running_start");
  }, [runningStart]);

  // live elapsed for running timer
  const [, tick] = useState(0);
  const tickRef = useRef(null);
  useEffect(() => {
    if (runningStart) {
      tickRef.current = setInterval(() => tick((t) => t + 1), 1000);
    }
    return () => clearInterval(tickRef.current);
  }, [runningStart]);

  function startTimer() {
    if (runningStart) return;
    setRunningStart(Date.now());
  }

  function stopTimer() {
    if (!runningStart) return;
    const diffMins = Math.max(1, Math.round((Date.now() - runningStart) / 60000));
    const date = formatDateISO(new Date(runningStart));
    const entry = { id: Date.now(), mins: diffMins, date, note: "Timer" };
    setEntries((s) => [entry, ...s]);
    setRunningStart(null);
  }

  function addManual(e) {
    e?.preventDefault();
    const mins = Number(manualMins) || 0;
    if (mins <= 0) return;
    const entry = { id: Date.now(), mins, date: manualDate, note: manualNote || "Manual" };
    setEntries((s) => [entry, ...s]);
    setManualNote("");
  }

  function removeEntry(id) {
    setEntries((s) => s.filter((e) => e.id !== id));
  }

  const weekStart = useMemo(() => startOfWeek(new Date()), []);
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return { date: d, iso: formatDateISO(d), label: d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" }) };
    });
  }, [weekStart]);

  const totalsByDay = useMemo(() => {
    const map = {};
    for (const day of days) map[day.iso] = 0;
    for (const e of entries) {
      if (map[e.date] !== undefined) map[e.date] += e.mins;
    }
    return map;
  }, [entries, days]);

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Tracking</h1>
        <p className="text-sm text-gray-600">Track your work hours with a timer or manual entries</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="col-span-2 space-y-6">
          <div className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all ${
            runningStart ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
          }`}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${runningStart ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
              Timer
            </h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className={`text-5xl font-mono font-bold ${
                runningStart ? 'text-red-600' : 'text-gray-400'
              }`}>
                {runningStart ? (() => {
                  const s = Math.max(0, Math.floor((Date.now() - runningStart) / 1000));
                  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
                  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
                  const ss = String(s % 60).padStart(2, "0");
                  return `${hh}:${mm}:${ss}`;
                })() : "00:00:00"}
              </div>

              <div className="flex-1 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {!runningStart ? (
                    <button 
                      onClick={startTimer} 
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Timer
                    </button>
                  ) : (
                    <button 
                      onClick={stopTimer} 
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                      </svg>
                      Stop & Save
                    </button>
                  )}
                </div>
                {entries[0] && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700">Last entry:</span> {entries[0].mins}m on {entries[0].date}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Manual Time Entry
            </h2>
            <form onSubmit={addManual} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Minutes</span>
                  <input 
                    type="number" 
                    min="1" 
                    value={manualMins} 
                    onChange={(e) => setManualMins(e.target.value)} 
                    className="rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
                    placeholder="30"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Date</span>
                  <input 
                    type="date" 
                    value={manualDate} 
                    onChange={(e) => setManualDate(e.target.value)} 
                    className="rounded-lg border border-gray-200 p-3 text-sm text-gray-900 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Note (optional)</span>
                  <input 
                    value={manualNote} 
                    onChange={(e) => setManualNote(e.target.value)} 
                    placeholder="Work description" 
                    className="rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#EF4444]/30 focus:border-[#EF4444] transition-all bg-white" 
                  />
                </label>
              </div>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Add Entry
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Time Entries
              </h2>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-medium">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <div className="space-y-3">
              {entries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500 font-medium">No time entries yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start tracking your time to see entries here</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {entries.map((e) => (
                    <li key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {formatMins(e.mins).split(' ')[0]}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900">{formatMins(e.mins)}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {e.date}
                            {e.note && e.note !== "Timer" && e.note !== "Manual" && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500">{e.note}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeEntry(e.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove entry"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Weekly Timesheet
            </h3>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {days.map((d) => {
                const isToday = d.iso === formatDateISO(new Date());
                const total = totalsByDay[d.iso] || 0;
                const maxTotal = Math.max(...Object.values(totalsByDay), 1);
                const heightPercent = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                
                return (
                  <div key={d.iso} className="flex flex-col items-center">
                    <div className="text-xs font-medium text-gray-600 mb-2">{d.label.split(' ')[0]}</div>
                    <div className="w-full bg-gray-100 rounded-lg overflow-hidden relative" style={{ height: '60px' }}>
                      {total > 0 && (
                        <div 
                          className={`absolute bottom-0 w-full rounded-lg transition-all ${
                            isToday ? 'bg-gradient-to-t from-[#EF4444] to-red-400' : 'bg-gradient-to-t from-blue-500 to-blue-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-700">{formatMins(total).replace(' ', '')}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{d.label.split(' ')[1]}</div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 text-center pt-3 border-t border-gray-100">
              Week of {weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-700">Total this week</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatMins(Object.values(totalsByDay).reduce((a,b)=>a+b,0))}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-700">Total entries</span>
                <span className="text-xl font-bold text-gray-900">{entries.length}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
