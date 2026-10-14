"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.push("/profile");
        } catch (err) {
            let userMessage = err.message || "Failed to authenticate.";
            if (err.code === 'auth/network-request-failed' || err.message?.includes('ECONNRESET')) {
                userMessage = "Network Blocked: The authentication server is unreachable. Please check your firewall or API key restrictions.";
            }
            setError(userMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-40 pb-24 px-6 md:px-12 flex items-center justify-center font-display">
            <div className="w-full max-w-lg">
                <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[12px_12px_0_#ff4500]">
                    <div className="mb-8 border-b-4 border-neutral-900 pb-6">
                        <span className="bg-neutral-900 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4 inline-block border-2 border-neutral-900 shadow-[2px_2px_0_#171717]">Secure Portal</span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-neutral-900">Authenticate</h1>
                        <p className="text-neutral-600 text-[10px] tracking-[0.2em] uppercase mt-2 font-bold">Initiate Session Protocol</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border-4 border-red-500 p-4 mb-8">
                            <p className="text-red-500 font-bold text-xs tracking-widest uppercase">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[12px] font-black tracking-widest uppercase text-neutral-900">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-neutral-100 border-4 border-neutral-900 p-4 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#171717] transition-all"
                                placeholder="operator@vault.co"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[12px] font-black tracking-widest uppercase text-neutral-900">Password</label>
                                <Link href="/contact" className="text-[9px] font-bold tracking-wider uppercase text-neutral-500 hover:text-primary transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-neutral-100 border-4 border-neutral-900 p-4 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#171717] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-tactile w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-5 text-[14px] font-black tracking-[0.3em] uppercase shadow-[6px_6px_0_#171717] hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#171717] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#171717] disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none mt-8"
                        >
                            {loading ? "Authenticating..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t-4 border-neutral-900 text-center flex flex-col items-center gap-4">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-600">No active credentials?</p>
                        <Link href="/register" className="btn-tactile inline-flex items-center justify-center bg-white border-4 border-neutral-900 text-neutral-900 px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase shadow-[3px_3px_0_#171717] hover:shadow-[5px_5px_0_#171717] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_#171717] group">
                            Request Access <span className="material-symbols-outlined text-[12px] ml-1.5 group-hover:text-primary transition-colors inline-block">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
