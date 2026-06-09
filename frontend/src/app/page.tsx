"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BackendStatus {
  status: string;
  message: string;
  database: string;
  timestamp: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendUrl, setBackendUrl] = useState("http://127.0.0.1:8000");

  const checkConnection = async (url = backendUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${url}/api/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStatus(data);
    } catch (err: any) {
      console.error(err);
      setStatus(null);
      setError(err.message || "Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              E
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              English Everywhere
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              Next.js 15 + Laravel 11 + MySQL
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 items-start relative z-10">
        {/* Left Side: Setup Panel */}
        <section className="flex-1 space-y-6 w-full">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Project Scaffold Scoped Successfully!
            </h1>
            <p className="text-slate-400 text-base max-w-xl">
              Your stack is initialized and ready. Follow the guide to start your servers and database.
            </p>
          </div>

          {/* Steps Card */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">Scaffold Architecture</h2>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-semibold text-sm shrink-0 border border-indigo-500/20">
                  1
                </div>
                <div>
                  <h3 className="text-slate-200 font-semibold">Start the Database (MySQL)</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Open <strong className="text-indigo-400">DBngin</strong> from your Applications folder. Create a new MySQL local server (port 3306) and start it. 
                    Then create the database <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded text-xs">english_everywhere</code>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-semibold text-sm shrink-0 border border-indigo-500/20">
                  2
                </div>
                <div>
                  <h3 className="text-slate-200 font-semibold">Run Laravel Backend API</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    In your terminal, navigate to the <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded text-xs">backend/</code> directory and run:
                  </p>
                  <pre className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-indigo-300 mt-2 border border-slate-800/60 overflow-x-auto">
                    php artisan serve
                  </pre>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-semibold text-sm shrink-0 border border-indigo-500/20">
                  3
                </div>
                <div>
                  <h3 className="text-slate-200 font-semibold">Run Next.js Frontend</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Open another terminal window, navigate to <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded text-xs">frontend/</code> and run:
                  </p>
                  <pre className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-indigo-300 mt-2 border border-slate-800/60 overflow-x-auto">
                    npm run dev
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Connection Status Widget */}
        <section className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Connection Status</h2>
              {loading ? (
                <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
              ) : status ? (
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
              ) : (
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
              )}
            </div>

            {/* Input URL */}
            <div className="space-y-2 mb-6">
              <label className="text-xs text-slate-400 font-semibold">Backend Endpoint</label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://127.0.0.1:8000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            {/* Connection Info */}
            <div className="space-y-4 min-h-[120px] flex flex-col justify-center">
              {loading && (
                <div className="text-center py-4 space-y-2">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Testing connection...</p>
                </div>
              )}

              {!loading && status && (
                <div className="space-y-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                  <p className="text-sm text-emerald-400 font-medium">✓ Connected</p>
                  <p className="text-xs text-slate-300">{status.message}</p>
                  <div className="border-t border-slate-800/80 pt-2.5 mt-2 flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Database:</span>
                    <span className="text-indigo-400 uppercase">{status.database}</span>
                  </div>
                </div>
              )}

              {!loading && error && (
                <div className="space-y-3 bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                  <p className="text-sm text-red-400 font-medium">✗ Disconnected</p>
                  <p className="text-xs text-slate-400">
                    Failed to reach backend at <code className="text-red-300 font-mono text-[11px]">{backendUrl}</code>. Make sure your Laravel server is running.
                  </p>
                </div>
              )}

              {!loading && !status && !error && (
                <div className="text-center py-4 text-xs text-slate-500">
                  No connection test performed yet.
                </div>
              )}
            </div>

            <button
              onClick={() => checkConnection()}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-indigo-500/10"
            >
              Test Connection
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 English Everywhere stack initializer. Built for performance and aesthetics.</p>
      </footer>
    </div>
  );
}

