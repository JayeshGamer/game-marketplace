"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

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
            let userMessage = err.message || "Failed to sign in. Please verify your email and password.";
            if (err.code === 'auth/network-request-failed' || err.message?.includes('ECONNRESET')) {
                userMessage = "Network error: Unable to reach the server. Please check your internet connection.";
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                userMessage = "Incorrect email or password. Please try again.";
            }
            setError(userMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-36 pb-24 px-4 sm:px-6 md:px-12 flex items-center justify-center font-display">
            <div className="w-full max-w-lg">
                <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[12px_12px_0_#ff4500] relative">
                    {/* Corner Crosshairs */}
                    <span className="absolute top-2 left-3 text-neutral-400 font-mono text-sm pointer-events-none select-none">+</span>
                    <span className="absolute top-2 right-3 text-neutral-400 font-mono text-sm pointer-events-none select-none">+</span>

                    <div className="mb-8 border-b-4 border-neutral-900 pb-6 flex items-start justify-between">
                        <div>
                            <span className="bg-neutral-900 text-primary px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase mb-3 inline-block border-2 border-neutral-900 shadow-[2px_2px_0_#171717]">
                                PLAYER LOGIN
                            </span>
                            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase text-neutral-900">
                                Welcome Back
                            </h1>
                            <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1.5">
                                Sign in to access your game library, saves, and wishlist.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-4 border-red-500 p-4 mb-6">
                            <p className="text-red-700 font-bold text-xs tracking-wide uppercase">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-black tracking-wider uppercase text-neutral-800">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-neutral-100 border-4 border-neutral-900 p-3.5 text-sm font-medium focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                placeholder="gamer@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-black tracking-wider uppercase text-neutral-800">Password</label>
                                <Link 
                                    href="/contact" 
                                    onClick={() => playMechanicalClick()}
                                    className="text-xs font-bold text-neutral-500 hover:text-primary transition-colors underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-neutral-100 border-4 border-neutral-900 p-3.5 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => playMechanicalClick(900, 0.2)}
                            onMouseEnter={() => playHoverTick()}
                            className="btn-tactile w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-4 text-xs font-display font-black tracking-wider uppercase shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all mt-6"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t-2 border-neutral-200 text-center">
                        <p className="text-xs font-medium text-neutral-600">
                            New to GameVault?{" "}
                            <Link 
                                href="/register"
                                onClick={() => playMechanicalClick()}
                                className="font-black text-neutral-900 hover:text-primary uppercase tracking-wider underline ml-1"
                            >
                                Create Free Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
