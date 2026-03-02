"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 font-display flex items-center justify-center px-6 py-24 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
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
                <div className="relative mb-8">
                    {/* Shadow layer */}
                    <div className="absolute inset-0 translate-x-3 translate-y-3">
                        <h1 className="text-[12rem] md:text-[18rem] font-black tracking-tighter uppercase leading-none text-neutral-900 opacity-20 select-none">
                            404
                        </h1>
                    </div>
                    {/* Main layer */}
                    <h1 className="relative text-[12rem] md:text-[18rem] font-black tracking-tighter uppercase leading-none text-transparent select-none"
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
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary border-b-4 border-l-4 border-neutral-900" />
                    
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-neutral-900 border-2 border-neutral-900 flex items-center justify-center shadow-[3px_3px_0_#171717] rotate-45">
                                <span className="material-symbols-outlined text-xl text-primary -rotate-45">error</span>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                                    Page Not Found
                                </h2>
                                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-neutral-500 mt-1">
                                    Error Code: 404
                                </p>
                            </div>
                        </div>

                        <p className="text-sm font-bold text-neutral-600 leading-relaxed mb-8 border-l-4 border-primary pl-4 py-2 bg-neutral-50">
                            The requested resource could not be located in the system archive. 
                            This page may have been moved, deleted, or never existed.
                        </p>

                        {/* Quick links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <Link href="/" 
                                className="flex items-center gap-2 bg-neutral-900 border-4 border-neutral-900 text-white px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 transition-all group">
                                <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">home</span>
                                Homepage
                            </Link>
                            <Link href="/store" 
                                className="flex items-center gap-2 bg-primary border-4 border-neutral-900 text-neutral-900 px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 transition-all group">
                                <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">storefront</span>
                                Browse Store
                            </Link>
                        </div>

                        {/* Additional options */}
                        <div className="pt-6 border-t-4 border-neutral-900 flex flex-wrap gap-3">
                            <span className="text-[8px] font-black tracking-[0.3em] uppercase text-neutral-400">Quick Nav:</span>
                            <Link href="/profile" className="text-[8px] font-black tracking-widest uppercase text-neutral-600 hover:text-primary transition-colors underline">
                                Profile
                            </Link>
                            <Link href="/cart" className="text-[8px] font-black tracking-widest uppercase text-neutral-600 hover:text-primary transition-colors underline">
                                Cart
                            </Link>
                            <Link href="/contact" className="text-[8px] font-black tracking-widest uppercase text-neutral-600 hover:text-primary transition-colors underline">
                                Contact
                            </Link>
                            <Link href="/faq" className="text-[8px] font-black tracking-widest uppercase text-neutral-600 hover:text-primary transition-colors underline">
                                FAQ
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System message */}
                <div className="mt-6 text-center">
                    <p className="text-[8px] font-mono text-neutral-400 tracking-wider">
                        <span className="text-primary font-black">SYS_ERR_404</span> • RESOURCE_NOT_FOUND • {new Date().toISOString()}
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
