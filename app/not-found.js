"use client";

import Link from "next/link";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 font-display flex items-center justify-center px-4 sm:px-6 py-28 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" 
                    style={{ 
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 20px,
                            #171717 20px,
                            #171717 22px
                        )` 
                    }} 
                />
            </div>

            <div className="relative z-10 max-w-2xl w-full">
                {/* Giant 404 */}
                <div className="relative mb-6 text-center">
                    {/* Shadow layer */}
                    <div className="absolute inset-0 translate-x-3 translate-y-3 pointer-events-none">
                        <h1 className="text-[10rem] sm:text-[14rem] md:text-[18rem] font-black tracking-tighter uppercase leading-none text-neutral-900 opacity-20 select-none">
                            404
                        </h1>
                    </div>
                    {/* Main layer */}
                    <h1 className="relative text-[10rem] sm:text-[14rem] md:text-[18rem] font-black tracking-tighter uppercase leading-none text-transparent select-none"
                        style={{
                            WebkitTextStroke: '4px #171717',
                            textStroke: '4px #171717'
                        }}>
                        404
                    </h1>
                </div>

                {/* Error card */}
                <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[12px_12px_0_#ff4500] relative"
                    style={{ animation: "slideInUp 0.5s ease-out" }}>
                    
                    {/* Corner crosshairs */}
                    <span className="absolute top-1 left-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-20">+</span>
                    <span className="absolute top-1 right-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-20">+</span>

                    {/* Corner badge */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary border-b-4 border-l-4 border-neutral-900 flex items-center justify-center">
                        <span className="font-mono text-[9px] font-black text-neutral-900 rotate-45">LOST</span>
                    </div>
                    
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-neutral-900 text-primary px-2.5 py-0.5 text-[10px] font-mono font-black tracking-wider uppercase">
                                ERROR 404
                            </span>
                            <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                                LEVEL NOT FOUND
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-neutral-900 border-2 border-neutral-900 flex items-center justify-center shadow-[3px_3px_0_#ff4500]">
                                <span className="material-symbols-outlined text-2xl text-primary">sports_esports</span>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight uppercase leading-none text-neutral-900">
                                    Page Not Found
                                </h2>
                                <p className="text-xs font-medium text-neutral-500 mt-1">
                                    The game or page you are looking for has respawned elsewhere.
                                </p>
                            </div>
                        </div>

                        <p className="text-sm font-medium text-neutral-700 leading-relaxed mb-8 border-l-4 border-primary pl-4 py-2.5 bg-neutral-100">
                            We couldn&apos;t find this game, category, or store page. It might have been unlisted, renamed, or moved during our latest store catalog update.
                        </p>

                        {/* Quick links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <Link href="/" 
                                onClick={() => playMechanicalClick()}
                                onMouseEnter={() => playHoverTick()}
                                className="btn-tactile flex items-center justify-center gap-2 bg-neutral-900 border-4 border-neutral-900 text-white px-6 py-3.5 text-xs font-display font-black tracking-wider uppercase shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group">
                                <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">home</span>
                                BACK TO HOME
                            </Link>
                            <Link href="/store" 
                                onClick={() => playMechanicalClick()}
                                onMouseEnter={() => playHoverTick()}
                                className="btn-tactile flex items-center justify-center gap-2 bg-primary border-4 border-neutral-900 text-neutral-900 px-6 py-3.5 text-xs font-display font-black tracking-wider uppercase shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group">
                                <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">storefront</span>
                                BROWSE STORE
                            </Link>
                        </div>

                        {/* Additional options */}
                        <div className="pt-6 border-t-2 border-neutral-300 flex flex-wrap items-center gap-4">
                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-500">QUICK LINKS:</span>
                            <Link href="/profile" 
                                onClick={() => playMechanicalClick()}
                                onMouseEnter={() => playHoverTick()}
                                className="text-xs font-bold uppercase text-neutral-700 hover:text-primary transition-colors underline">
                                My Library
                            </Link>
                            <Link href="/cart" 
                                onClick={() => playMechanicalClick()}
                                onMouseEnter={() => playHoverTick()}
                                className="text-xs font-bold uppercase text-neutral-700 hover:text-primary transition-colors underline">
                                Cart
                            </Link>
                            <Link href="/contact" 
                                onClick={() => playMechanicalClick()}
                                onMouseEnter={() => playHoverTick()}
                                className="text-xs font-bold uppercase text-neutral-700 hover:text-primary transition-colors underline">
                                Contact Support
                            </Link>
                            <Link href="/faq" 
                                onClick={() => playMechanicalClick()}
                                onMouseEnter={() => playHoverTick()}
                                className="text-xs font-bold uppercase text-neutral-700 hover:text-primary transition-colors underline">
                                Store FAQ
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System message */}
                <div className="mt-6 text-center">
                    <p className="text-xs font-mono text-neutral-500 tracking-wider">
                        <span className="text-primary font-black">GAMEVAULT</span> • LEVEL 404 • READY TO RESPAWN
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
