"use client";

import Link from "next/link";
import MarqueeTicker from "@/components/MarqueeTicker";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

export default function About() {
    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-36 pb-20 px-6 font-display">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="mb-12 border-b-4 border-neutral-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-3 h-8 bg-primary inline-block"></span>
                            <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-500">
                                STORE MANIFESTO // v2.0
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-neutral-900">About GameVault</h1>
                    </div>
                    <div className="flex items-center gap-3 py-2 px-4 bg-neutral-900 text-white border-2 border-neutral-900 text-xs font-mono font-bold">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>ONLINE PLAYERS: 14,892</span>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#ff4500] p-8 md:p-12 mb-8 relative overflow-hidden">
                    <span className="absolute top-2 left-3 text-neutral-400 font-mono text-sm pointer-events-none select-none z-10">+</span>
                    <span className="absolute top-2 right-3 text-neutral-400 font-mono text-sm pointer-events-none select-none z-10">+</span>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-900 flex items-center justify-center text-primary shadow-[4px_4px_0_#ff4500]">
                                <span className="material-symbols-outlined text-3xl">sports_esports</span>
                            </div>
                            <span className="font-mono text-xs font-bold tracking-widest text-neutral-400 select-none">
                                EST. 2024 • VERIFIED DIGITAL STORE
                            </span>
                        </div>
                        <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider block mb-2">
                            OUR MISSION
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-900 mb-4">Built for Gamers, Backed by Creators</h2>
                        <p className="text-base text-neutral-700 font-medium leading-relaxed max-w-3xl">
                            GameVault is an ultra-fast digital marketplace built for modern PC gamers who demand an uncluttered, responsive platform. 
                            We pair direct developer distribution with high-contrast, tactile design to deliver instant digital keys, seamless library downloads, 
                            and a hassle-free gaming experience without bloatware.
                        </p>
                    </div>
                </div>

                {/* Marquee Ribbon Break */}
                <div className="my-8 -mx-6">
                    <MarqueeTicker bgClass="bg-neutral-900 text-white border-neutral-900" />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        {
                            icon: "bolt",
                            tag: "INSTANT ACCESS",
                            title: "Instant Key Delivery",
                            desc: "Instant automated order fulfillment. Your verified game license keys are delivered straight to your account the second checkout finishes."
                        },
                        {
                            icon: "verified_user",
                            tag: "100% AUTHENTIC",
                            title: "Verified Publisher Keys",
                            desc: "Every key on GameVault comes directly from official game studios and authorized publishers. Guaranteed genuine, always redeemable."
                        },
                        {
                            icon: "desktop_windows",
                            tag: "NO SPYWARE",
                            title: "Zero Bloatware",
                            desc: "No forced background resource hogs, no invasive telemetry miners, and no popup ads. Just clean, high-performance game discovery."
                        }
                    ].map((feature, idx) => (
                        <div 
                            key={idx}
                            onMouseEnter={() => playHoverTick()}
                            className="card-lift bg-white border-4 border-neutral-900 p-6 shadow-[4px_4px_0_#171717] hover:shadow-[8px_8px_0_#ff4500] relative"
                        >
                            <span className="absolute top-1 left-2 text-neutral-400 font-mono text-xs pointer-events-none select-none">+</span>
                            <div className="flex items-center justify-between mb-4">
                                <span className="material-symbols-outlined text-primary text-3xl">{feature.icon}</span>
                                <span className="text-xs font-mono font-bold text-neutral-500 uppercase">{feature.tag}</span>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-neutral-900">{feature.title}</h3>
                            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats Matrix */}
                <div className="bg-neutral-950 border-4 border-neutral-900 shadow-[8px_8px_0_#ff4500] p-8 mb-8 relative">
                    <span className="absolute top-1 left-2 text-neutral-600 font-mono text-xs pointer-events-none select-none">+</span>
                    <span className="absolute top-1 right-2 text-neutral-600 font-mono text-xs pointer-events-none select-none">+</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-primary mb-1">10,000+</div>
                            <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">Available Titles</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-white mb-1">500K+</div>
                            <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">Active Players</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-primary mb-1">100%</div>
                            <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">Verified Keys</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-white mb-1">99.98%</div>
                            <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">Uptime Reliability</div>
                        </div>
                    </div>
                </div>

                {/* Our Story */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] p-8 relative">
                    <span className="absolute top-1 left-2 text-neutral-400 font-mono text-xs pointer-events-none select-none">+</span>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-primary inline-block"></span>
                        Why We Built GameVault
                    </h2>
                    <div className="space-y-4 text-sm text-neutral-700 font-medium leading-relaxed max-w-3xl">
                        <p>
                            We started GameVault because online game stores had become sluggish, heavy, and overloaded with bloated social features that distracted from what actually matters: playing incredible games.
                        </p>
                        <p>
                            We built GameVault as a snappy, high-contrast, gamer-centric storefront where you can find games quickly, purchase securely with transparent pricing, and enjoy your library without friction.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link 
                        href="/store" 
                        onClick={() => playMechanicalClick()}
                        onMouseEnter={() => playHoverTick()}
                        className="btn-tactile inline-block bg-primary border-4 border-neutral-900 px-12 py-5 font-black tracking-wider uppercase text-xs text-neutral-900 shadow-[6px_6px_0_#171717] hover:shadow-[10px_10px_0_#171717]"
                    >
                        EXPLORE THE STORE CATALOG →
                    </Link>
                </div>
            </div>
        </div>
    );
}
