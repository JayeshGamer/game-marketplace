"use client";

import { useState } from "react";
import Link from "next/link";
import { playMechanicalClick, playHoverTick, playUplinkChirp } from "@/lib/sound";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email || !email.includes("@")) return;
        playUplinkChirp();
        setSubscribed(true);
        setTimeout(() => {
            setEmail("");
            setSubscribed(false);
        }, 4000);
    };

    const scrollToTop = () => {
        playMechanicalClick(950, 0.2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="border-t-4 border-neutral-900 bg-neutral-950 text-neutral-400 font-display select-none mt-24 relative overflow-hidden">
            {/* Corner Crosshairs */}
            <span className="absolute top-2 left-3 text-neutral-600 font-mono text-sm pointer-events-none select-none z-20">+</span>
            <span className="absolute top-2 right-3 text-neutral-600 font-mono text-sm pointer-events-none select-none z-20">+</span>

            {/* Industrial Hazard Warning Top Line */}
            <div className="w-full h-1.5 hazard-stripes border-b border-neutral-900 opacity-60"></div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

                    {/* Column 1: Brand & Dispatch Uplink (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-8">
                        <div>
                            <Link 
                                href="/" 
                                onClick={() => playMechanicalClick()} 
                                onMouseEnter={() => playHoverTick()}
                                className="flex items-center gap-3 group w-fit mb-4"
                            >
                                <div className="w-10 h-10 bg-primary border-2 border-primary flex items-center justify-center text-neutral-950 shadow-[4px_4px_0_#ffffff] group-hover:scale-105 transition-transform">
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-2xl font-black tracking-[0.3em] uppercase text-white group-hover:text-primary transition-colors block leading-none">
                                        GAMEVAULT
                                    </span>
                                    <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-neutral-500 uppercase">
                                        ARCHIVE CORE // 2026
                                    </span>
                                </div>
                            </Link>

                            <p className="text-xs font-mono text-neutral-400 leading-relaxed max-w-sm mb-6">
                                The high-velocity decentralized gaming registry. Curated DRM-free releases, sub-millisecond telemetry, and uncompromising neo-brutalist infrastructure.
                            </p>

                            {/* Barcode & Security Badge */}
                            <div className="flex items-center gap-4 py-2 px-3 bg-neutral-900 border-2 border-neutral-800 w-fit">
                                <div className="font-mono text-[10px] tracking-widest text-neutral-400 select-none">
                                    ||| | ||||| || ||| | |||| |
                                </div>
                                <div className="h-4 w-px bg-neutral-700"></div>
                                <span className="text-[9px] font-mono font-black text-primary tracking-widest">
                                    SHA-512 SECURED
                                </span>
                            </div>
                        </div>

                        {/* Dispatch Newsletter Subscription */}
                        <div className="bg-neutral-900/90 border-2 border-neutral-800 p-5 shadow-[4px_4px_0_#ff4500]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono font-black tracking-widest uppercase text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                                    DISPATCH TERMINAL
                                </span>
                                <span className="text-[8px] font-mono text-neutral-500">PORT: 8088</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 mb-3">
                                Receive instant telemetry alerts when weekly gratis archives unlock.
                            </p>
                            {subscribed ? (
                                <div className="bg-primary/20 border border-primary text-primary px-3 py-2 text-xs font-mono font-black uppercase text-center animate-fade-in">
                                    [UPLINK ESTABLISHED // VERIFIED]
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="OPERATOR EMAIL..."
                                        className="bg-neutral-950 border border-neutral-700 px-3 py-2 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-primary flex-1"
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        onClick={() => playMechanicalClick(800, 0.15)}
                                        className="bg-primary text-neutral-950 px-4 py-2 text-[10px] font-mono font-black tracking-widest uppercase hover:bg-white active:scale-95 transition-all shadow-[2px_2px_0_#000]"
                                    >
                                        TRANSMIT
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Nav Links Grid (4 cols) */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8 text-[11px] font-mono uppercase">
                        <div>
                            <span className="text-white font-black tracking-[0.25em] mb-4 block pb-2 border-b border-neutral-800 text-xs">
                                ARCHIVE //
                            </span>
                            <div className="flex flex-col gap-3 font-bold text-neutral-400">
                                <Link 
                                    href="/store" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> STORE CATALOG
                                </Link>
                                <Link 
                                    href="/store?genre=action" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> ACTION SECTOR
                                </Link>
                                <Link 
                                    href="/store?genre=rpg" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> RPG PROTOCOLS
                                </Link>
                                <Link 
                                    href="/search" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> GLOBAL RADAR
                                </Link>
                                <Link 
                                    href="/about" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> MANIFESTO
                                </Link>
                            </div>
                        </div>

                        <div>
                            <span className="text-white font-black tracking-[0.25em] mb-4 block pb-2 border-b border-neutral-800 text-xs">
                                PROTOCOL //
                            </span>
                            <div className="flex flex-col gap-3 font-bold text-neutral-400">
                                <Link 
                                    href="/developer" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> DEV HUB
                                </Link>
                                <Link 
                                    href="/faq" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> FAQ DISPATCH
                                </Link>
                                <Link 
                                    href="/contact" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> OPERATOR LINE
                                </Link>
                                <Link 
                                    href="/terms" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> TERMS OF USE
                                </Link>
                                <Link 
                                    href="/privacy" 
                                    onMouseEnter={() => playHoverTick()}
                                    onClick={() => playMechanicalClick()}
                                    className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1.5"
                                >
                                    <span className="text-primary text-[10px]">&gt;</span> DATA PRIVACY
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Live Telemetry Board (3 cols) */}
                    <div className="lg:col-span-3 flex flex-col justify-between">
                        <div className="bg-neutral-900 border-2 border-neutral-800 p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                                <span className="text-[10px] font-mono font-black text-white tracking-widest uppercase">
                                    SYS TELEMETRY
                                </span>
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            </div>

                            <div className="space-y-2 text-[10px] font-mono">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">NETWORK NODE:</span>
                                    <span className="text-white font-bold">EDGE-GLOBAL-01</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">PROTOCOL:</span>
                                    <span className="text-primary font-bold">HTTP/3 QUIC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">REALTIME UPTIME:</span>
                                    <span className="text-white font-bold">99.98%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">LATENCY:</span>
                                    <span className="text-emerald-400 font-bold">&lt; 14MS (OPTIMAL)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">KERNEL BUILD:</span>
                                    <span className="text-neutral-400 font-bold">v4.2.0-PROD</span>
                                </div>
                            </div>
                        </div>

                        {/* Back To Top Action */}
                        <button
                            onClick={scrollToTop}
                            onMouseEnter={() => playHoverTick()}
                            className="mt-6 w-full bg-white border-2 border-neutral-900 text-neutral-950 py-3 px-4 font-mono text-[10px] font-black tracking-[0.25em] uppercase shadow-[4px_4px_0_#ff4500] hover:bg-primary active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">north</span>
                            RETURN TO APEX
                        </button>
                    </div>

                </div>

                {/* Gigantic Viewport-Spanning Typographic Watermark */}
                <div className="border-t-2 border-neutral-800 pt-8 mt-4 overflow-hidden relative">
                    <div 
                        className="text-center font-black tracking-tighter uppercase leading-none text-transparent select-none transition-colors duration-500 hover:text-white/5 cursor-default text-[13vw]"
                        style={{
                            WebkitTextStroke: "2px #262626",
                            textStroke: "2px #262626",
                        }}
                    >
                        GAMEVAULT
                    </div>
                </div>

                {/* Subfooter Copyright & Realtime Status */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono tracking-[0.25em] uppercase text-neutral-500 pt-8 border-t border-neutral-900 gap-4">
                    <span>
                        &copy; {new Date().getFullYear()} GAMEVAULT INC. ALL REPOSITORIES SECURED.
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-neutral-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            STATUS: NOMINAL
                        </span>
                        <span>//</span>
                        <span className="text-neutral-500">MIL-SPEC 256-BIT</span>
                    </div>
                </div>
            </div>

            {/* Corner Crosshairs */}
            <span className="absolute bottom-2 left-3 text-neutral-600 font-mono text-sm pointer-events-none select-none z-20">+</span>
            <span className="absolute bottom-2 right-3 text-neutral-600 font-mono text-sm pointer-events-none select-none z-20">+</span>
        </footer>
    );
}
