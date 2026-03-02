"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SpatialCanvas() {
    const containerRef = useRef(null);

    useEffect(() => {
        // Basic GSAP setup
        const ctx = gsap.context(() => {
            // gsap.from("h1", { duration: 1.5, opacity: 0, y: 50, ease: "power3.out" });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative h-[calc(100vh-4rem)] w-full flex flex-col overflow-hidden bg-background-dark"
        >
            {/* Full Bleed Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 canvas-overlay z-10"></div>
                <div
                    className="w-full h-full bg-cover bg-center transition-all duration-1000"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3QNoM0RwNwRsh3D0rm1h1PLGJUAJdIeseArhytlroIq8lhKoSf9YPbC-R-l7KNkivpuULFn2s1gQzTdrjaZTvuhrsgk2jt-M-23e1Cb9j7E9AaKPJ6mZyog2cQNDqRNMl8cL-J1F-FgaiKvxaWnFwm2eRxglvbdMoVcVJCN6rhTixTsVaPXfzgL0p7nlAwVElVsqdFub2lL0j71YDKYmShR_LOE_zsT9r9Cx9tOF74RHzmE-5xXpi3tmQcW0r4-ai9l-s6QIAHw')",
                    }}
                ></div>
            </div>

            {/* Main Hero Narrative */}
            <main className="relative z-20 flex-1 flex flex-col justify-end px-12 pb-24">
                <div className="max-w-4xl space-y-6">
                    <div className="overflow-hidden">
                        <h4 className="text-primary text-xs font-black tracking-[0.4em] uppercase mb-2">
                            01 // ARCHITECTURAL COORDINATES
                        </h4>
                        <h1 className="text-neutral-900 text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase">
                            Cinematic<br />Frontiers
                        </h1>
                    </div>
                    <p className="text-neutral-900/70 text-lg max-w-xl font-light leading-relaxed">
                        Experience spatial interactive storytelling through an architectural
                        lens. A controlled sequence of visual depth and intentional motion.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <button className="bg-primary text-neutral-900 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:scale-105">
                            Enter Narrative
                        </button>
                        <button className="border border-neutral-900/30/20 text-neutral-900 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-colors">
                            View Dossier
                        </button>
                    </div>
                </div>
            </main>

            {/* Spatial Navigation Points (Floating Coordinates) */}
            <div className="absolute inset-0 pointer-events-none z-30">
                {/* Coord 1 */}
                <div className="absolute top-1/3 left-1/4 pointer-events-auto group cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="size-2 bg-primary rounded-full ring-4 ring-primary/20"></div>
                        <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-neutral-900 font-bold tracking-widest uppercase">
                                Sector A-1
                            </span>
                            <span className="text-[8px] text-primary font-mono tracking-tighter">
                                40.7128° N, 74.0060° W
                            </span>
                        </div>
                    </div>
                </div>

                {/* Coord 2 */}
                <div className="absolute top-1/2 right-1/3 pointer-events-auto group cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="size-2 bg-neutral-200 rounded-full ring-4 ring-slate-100/20 group-hover:bg-primary group-hover:ring-primary/20 transition-all"></div>
                        <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-neutral-900 font-bold tracking-widest uppercase">
                                The Void
                            </span>
                            <span className="text-[8px] text-neutral-600 font-mono tracking-tighter">
                                UNDEFINED_NULL
                            </span>
                        </div>
                    </div>
                </div>

                {/* Coord 3 */}
                <div className="absolute bottom-1/4 right-1/4 pointer-events-auto group cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="size-2 bg-neutral-200 rounded-full ring-4 ring-slate-100/20 group-hover:bg-primary group-hover:ring-primary/20 transition-all"></div>
                        <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-neutral-900 font-bold tracking-widest uppercase">
                                Core Signal
                            </span>
                            <span className="text-[8px] text-neutral-600 font-mono tracking-tighter">
                                SIG_STRENGTH_98%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Timeline Controller */}
            <footer className="relative z-50 px-12 py-10 border-t border-neutral-900/30/10 flex items-center justify-between">
                <div className="flex gap-12">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-neutral-600 font-bold tracking-widest uppercase">
                            Active Sequence
                        </span>
                        <div className="flex gap-2">
                            <div className="h-1 w-12 bg-primary"></div>
                            <div className="h-1 w-12 bg-neutral-200/20 hover:bg-neutral-200/40 cursor-pointer transition-colors"></div>
                            <div className="h-1 w-12 bg-neutral-200/20 hover:bg-neutral-200/40 cursor-pointer transition-colors"></div>
                            <div className="h-1 w-12 bg-neutral-200/20 hover:bg-neutral-200/40 cursor-pointer transition-colors"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-neutral-600 font-bold tracking-widest uppercase">
                            Atmospheric
                        </span>
                        <span className="text-xs text-neutral-900 font-medium tracking-wide">
                            62% Humidity // 14°C
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-neutral-900 text-sm">
                            volume_up
                        </span>
                        <div className="w-24 h-[1px] bg-neutral-200/20 relative">
                            <div className="absolute top-0 left-0 h-full w-2/3 bg-primary"></div>
                        </div>
                    </div>
                    <div className="text-neutral-900 text-xs font-mono tracking-tighter opacity-60">
                        00:42 // 03:15
                    </div>
                </div>
            </footer>

            {/* Right Side Vertical Info */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-8">
                <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-slate-100/20 to-transparent"></div>
                <div className="rotate-90 origin-center whitespace-nowrap">
                    <span className="text-[10px] text-neutral-900/40 font-bold tracking-[0.5em] uppercase italic">
                        Spatial Motion Driven Experience
                    </span>
                </div>
                <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-slate-100/20 to-transparent"></div>
            </div>
        </div>
    );
}
