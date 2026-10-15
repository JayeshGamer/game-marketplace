"use client";

import Link from "next/link";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-36 pb-24 px-6 md:px-12 font-display">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 relative border-b-4 border-neutral-900 pb-8" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <span className="absolute -top-3 left-0 font-mono text-[10px] text-neutral-400 select-none pointer-events-none">+</span>
                    <span className="absolute -top-3 right-0 font-mono text-[10px] text-neutral-400 select-none pointer-events-none">+</span>

                    <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-[8px] text-neutral-400 tracking-tighter">|||| | ||||| | ||</span>
                        <span className="bg-neutral-900 text-primary px-2 py-0.5 text-[9px] font-mono font-black tracking-widest uppercase">
                            DATA PRIVACY MATRIX GV-PRIV-2026
                        </span>
                        <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-500">
                            CRYPTOGRAPHIC RETENTION
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-3 h-12 bg-primary"></div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-neutral-900">Privacy Policy</h1>
                    </div>
                    <div className="flex items-center gap-4 mt-3 ml-7 text-neutral-600 text-[10px] font-mono font-bold tracking-wider uppercase">
                        <span>REVISION: MAR 2026.4</span>
                        <span>•</span>
                        <span>ZERO-KNOWLEDGE TELEMETRY ENFORCED</span>
                    </div>
                </div>

                {/* Content Document */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] p-8 md:p-12 space-y-8 text-neutral-700 leading-relaxed relative">
                    <span className="absolute top-1 left-2 font-mono text-[10px] text-neutral-400 select-none pointer-events-none">+</span>
                    <span className="absolute top-1 right-2 font-mono text-[10px] text-neutral-400 select-none pointer-events-none">+</span>
                    
                    <div className="flex items-center justify-between pb-4 border-b-2 border-neutral-200 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                        <span>DATA RETENTION PROTOCOL</span>
                        <span className="text-neutral-400">PAGE 01 / 01</span>
                    </div>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">01.</span>
                            Information Ingested
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed mb-3">Our network ingests only necessary operator telemetry:</p>
                        <ul className="list-disc list-inside text-xs md:text-sm font-medium space-y-2 pl-4 text-neutral-600">
                            <li><strong>Operator Profile:</strong> Verified email handle, public username, salted cryptographic hashes.</li>
                            <li><strong>Financial Pipeline:</strong> Encrypted transaction IDs and billing summaries processed via certified PCI-DSS conduits.</li>
                            <li><strong>Runtime Telemetry:</strong> Purchase receipts, active session duration, and licensing certificates.</li>
                            <li><strong>Hardware Metadata:</strong> Browser user agent, screen resolution, and regional latency nodes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">02.</span>
                            Application of Ingested Data
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed mb-3">Ingested telemetry is strictly deployed to:</p>
                        <ul className="list-disc list-inside text-xs md:text-sm font-medium space-y-2 pl-4 text-neutral-600">
                            <li>Authorize real-time distribution of digital software keys and verify license validity.</li>
                            <li>Process automated checkout sequences and generate immutable order vouchers.</li>
                            <li>Maintain regional CDN load-balancing for sub-14ms download handshakes.</li>
                            <li>Prevent unauthorized credential brute-forcing and mitigate DDoS vectors.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">03.</span>
                            Cryptographic Data Safeguards
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                            All user datasets are encrypted at rest with AES-256 and transmitted exclusively across TLS 1.3 encrypted conduits with HTTP/3 QUIC encapsulation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">04.</span>
                            Operator Rights & Data Portability
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed mb-3">Operators maintain sovereign rights over their dossier:</p>
                        <ul className="list-disc list-inside text-xs md:text-sm font-medium space-y-2 pl-4 text-neutral-600">
                            <li>Instant inspection of stored account records and purchase invoices.</li>
                            <li>Permanent execution of the irreversible account purge protocol in Operator Settings.</li>
                            <li>Export of all personal transaction archives in JSON format.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">05.</span>
                            Session Cookies & Local Storage
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                            GameVault leverages local browser storage solely to preserve cart allocations, sound preference toggles, and encrypted authentication tokens. No cross-site advertising trackers are injected.
                        </p>
                    </section>

                    {/* Footer Dispatch Stamp */}
                    <div className="pt-6 border-t-2 border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                            <span className="text-[10px] font-mono font-bold uppercase text-neutral-600">
                                PRIVACY OFFICER: <span className="text-neutral-900">PRIVACY@GAMEVAULT.COM</span>
                            </span>
                        </div>
                        <Link 
                            href="/terms"
                            onClick={() => playMechanicalClick()}
                            onMouseEnter={() => playHoverTick()}
                            className="btn-tactile bg-neutral-900 text-primary border-2 border-neutral-900 px-4 py-2 text-[10px] font-mono font-black tracking-widest uppercase hover:bg-primary hover:text-neutral-900 transition-colors shadow-[2px_2px_0_#ff4500]">
                            VIEW TERMS OF SERVICE →
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
