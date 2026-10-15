"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { playMechanicalClick, playHoverTick, playUplinkChirp } from "@/lib/sound";

export default function Register() {
    const { register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            playMechanicalClick(400, 0.25);
            return setError("Passwords do not match. Verification failed.");
        }

        playUplinkChirp();
        setLoading(true);
        try {
            await register(email, password);
            router.push("/profile");
        } catch (err) {
            setError(err.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-40 pb-24 px-6 md:px-12 flex items-center justify-center font-display">
            <div className="w-full max-w-lg">
                <div className="bg-neutral-950 border-4 border-neutral-900 p-8 md:p-12 shadow-[12px_12px_0_#ff4500] relative">
                    {/* Corner Crosshairs */}
                    <span className="absolute top-2 left-3 text-neutral-600 font-mono text-sm pointer-events-none select-none">+</span>
                    <span className="absolute top-2 right-3 text-neutral-600 font-mono text-sm pointer-events-none select-none">+</span>

                    <div className="mb-8 border-b-4 border-neutral-800 pb-6 flex items-start justify-between">
                        <div>
                            <span className="bg-primary text-neutral-950 px-3 py-1 text-[10px] font-black tracking-widest uppercase mb-4 inline-block border-2 border-primary shadow-[2px_2px_0_#000]">
                                Mint Credentials
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white">Register</h1>
                            <p className="text-neutral-400 text-[10px] font-mono tracking-[0.2em] uppercase mt-2">Forge a new operator identity</p>
                        </div>
                        <span className="font-mono text-[9px] tracking-widest text-neutral-500 hidden sm:inline-block">|||| | ||</span>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border-4 border-red-500 p-4 mb-8">
                            <p className="text-red-500 font-bold text-xs tracking-widest uppercase font-mono">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black tracking-widest uppercase text-neutral-300">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-neutral-900 border-4 border-neutral-800 text-white p-4 text-xs font-mono focus:outline-none focus:border-primary focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                placeholder="new.operator@vault.net"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] font-black tracking-widest uppercase text-neutral-300">Access Key (Password)</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-neutral-900 border-4 border-neutral-800 text-white p-4 text-xs font-mono focus:outline-none focus:border-primary focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] font-black tracking-widest uppercase text-neutral-300">Verify Access Key</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-neutral-900 border-4 border-neutral-800 text-white p-4 text-xs font-mono focus:outline-none focus:border-primary focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => playMechanicalClick(950, 0.2)}
                            onMouseEnter={() => playHoverTick()}
                            className="btn-tactile w-full bg-primary border-4 border-primary text-neutral-950 py-5 text-[14px] font-black tracking-[0.3em] uppercase shadow-[6px_6px_0_#ffffff] hover:bg-white active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 transition-all mt-8"
                        >
                            {loading ? "INITIALIZING NODE..." : "MINT IDENTITY [ENTER]"}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t-4 border-neutral-800 text-center flex flex-col items-center gap-4">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Already authorized?</p>
                        <Link 
                            href="/login" 
                            onClick={() => playMechanicalClick()}
                            onMouseEnter={() => playHoverTick()}
                            className="btn-tactile inline-flex items-center justify-center bg-neutral-900 border-2 border-neutral-700 text-white px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase shadow-[3px_3px_0_#ff4500] hover:border-primary hover:text-primary transition-all group"
                        >
                            Return to Login <span className="material-symbols-outlined text-[12px] ml-1.5 group-hover:translate-x-1 transition-transform inline-block">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
