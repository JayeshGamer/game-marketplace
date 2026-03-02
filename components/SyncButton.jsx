"use client";

import { useState } from "react";

export default function SyncButton() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSync = async () => {
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch("/api/admin/igdb/sync", {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.results);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to trigger sync: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={handleSync}
                disabled={loading}
                className="bg-primary border-4 border-neutral-900 text-neutral-900 px-6 py-3 text-[14px] font-black tracking-[0.2em] uppercase transition-all shadow-[8px_8px_0_#171717] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_#171717] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-3 w-fit"
            >
                <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                    {loading ? 'sync' : 'database'}
                </span>
                {loading ? "SYNCING DATA..." : "SYNC WITH IGDB"}
            </button>

            {result && (
                <div className="bg-white border-4 border-[#00ff00] p-4 shadow-[8px_8px_0_#00ff00] animate-in fade-in slide-in-from-top-2">
                    <p className="text-[12px] font-black text-neutral-900 uppercase tracking-widest mb-2">Sync Successful</p>
                    <div className="flex gap-4 text-[10px] font-bold text-neutral-600 uppercase">
                        <span>Added: {result.added}</span>
                        <span>Updated: {result.updated}</span>
                        {result.errors.length > 0 && (
                            <span className="text-red-500">Errors: {result.errors.length}</span>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-white border-4 border-red-500 p-4 shadow-[8px_8px_0_#ef4444] animate-in fade-in slide-in-from-top-2">
                    <p className="text-[12px] font-black text-red-500 uppercase tracking-widest mb-1">Sync Failed</p>
                    <p className="text-[10px] font-bold text-neutral-600 uppercase">{error}</p>
                    {error.includes("environment variables") && (
                        <p className="text-[9px] mt-2 text-neutral-400 italic">Please check IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in .env.local</p>
                    )}
                </div>
            )}
        </div>
    );
}
