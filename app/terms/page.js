"use client";

import Link from "next/link";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

export default function TermsPage() {
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
                            PROTOCOL SPECIFICATION GV-TOS-2026
                        </span>
                        <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-500">
                            SECTOR_LEGAL
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-3 h-12 bg-primary"></div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-neutral-900">Terms of Service</h1>
                    </div>
                    <div className="flex items-center gap-4 mt-3 ml-7 text-neutral-600 text-[10px] font-mono font-bold tracking-wider uppercase">
                        <span>REVISION: MAR 2026.4</span>
                        <span>•</span>
                        <span>COMPLIANCE JURISDICTION: GLOBAL CYBER-GRID</span>
                    </div>
                </div>

                {/* Content Document */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] p-8 md:p-12 space-y-8 text-neutral-700 leading-relaxed relative">
                    <span className="absolute top-1 left-2 font-mono text-[10px] text-neutral-400 select-none pointer-events-none">+</span>
                    <span className="absolute top-1 right-2 font-mono text-[10px] text-neutral-400 select-none pointer-events-none">+</span>
                    
                    <div className="flex items-center justify-between pb-4 border-b-2 border-neutral-200 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                        <span>OPERATOR LICENSE MANDATE</span>
                        <span className="text-neutral-400">PAGE 01 / 01</span>
                    </div>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">01.</span>
                            Acceptance of Terms
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                            By accessing and using GameVault, you accept and agree to be bound by these Terms of Service. 
                            If you do not agree to these terms, please do not use our services. All digital licenses deployed remain bounded under current platform topology.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">02.</span>
                            Operator Credentials & Security
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed mb-3">You are responsible for:</p>
                        <ul className="list-disc list-inside text-xs md:text-sm font-medium space-y-2 pl-4 text-neutral-600">
                            <li>Maintaining the absolute confidentiality of your cryptographic passkeys and authentication tokens.</li>
                            <li>All telemetry, transactions, and licensing activities that occur under your operator ID.</li>
                            <li>Notifying platform security immediately of any unauthorized intrusion or credential compromise.</li>
                            <li>Ensuring all sector transmission details and billing records are current and validated.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">03.</span>
                            Digital Purchases & Realtime Settlement
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                            All digital transactions are settled in realtime upon verification. Prices are subject to dynamic indexing based on publisher contracts. 
                            You agree to pay all charges incurred under your account via approved payment conduits.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">04.</span>
                            License Grants & Restrictions
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed mb-3">
                            Games acquired through GameVault are non-exclusive digital licenses, not physical property. Operators may not:
                        </p>
                        <ul className="list-disc list-inside text-xs md:text-sm font-medium space-y-2 pl-4 text-neutral-600">
                            <li>Resell, sublicense, redistribute, or transfer game licenses to third-party entities.</li>
                            <li>Reverse engineer, decompile, or tamper with digital rights telemetry.</li>
                            <li>Exploit software titles for commercial display without formal publisher licensing.</li>
                            <li>Pool or share operator login credentials across concurrent active sessions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">05.</span>
                            Refund Architecture
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                            Digital purchases may be refunded within 14 Earth days of initial license provisioning, provided logged gameplay duration does not exceed 2 hours (120 minutes). 
                            All refund dispatch requests are audited automatically against system telemetry logs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                            <span className="text-primary font-mono font-bold text-sm">06.</span>
                            Sector Termination & Penalties
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                            GameVault retains the autonomous authority to revoke licenses and terminate accounts found engaging in fraud, network exploitation, or severe platform abuse.
                        </p>
                    </section>

                    {/* Footer Dispatch Stamp */}
                    <div className="pt-6 border-t-2 border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">gavel</span>
                            <span className="text-[10px] font-mono font-bold uppercase text-neutral-600">
                                LEGAL DISPATCH: <span className="text-neutral-900">LEGAL@GAMEVAULT.COM</span>
                            </span>
                        </div>
                        <Link 
                            href="/privacy"
                            onClick={() => playMechanicalClick()}
                            onMouseEnter={() => playHoverTick()}
                            className="btn-tactile bg-neutral-900 text-primary border-2 border-neutral-900 px-4 py-2 text-[10px] font-mono font-black tracking-widest uppercase hover:bg-primary hover:text-neutral-900 transition-colors shadow-[2px_2px_0_#ff4500]">
                            VIEW PRIVACY MATRIX →
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
