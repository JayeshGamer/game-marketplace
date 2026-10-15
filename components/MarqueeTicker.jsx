"use client";

import React from "react";

const TICKER_ITEMS = [
    { text: "VAULT-NET v4.2 // ONLINE", tag: "SYS_OK", alert: false },
    { text: "100% VERIFIED DRM-FREE ASSET ARCHIVES", tag: "CORE", alert: false },
    { text: "INSTANT LOW-LATENCY DOWNLOAD CLUSTERS", tag: "SPEED", alert: true },
    { text: "GLOBAL OPERATORS ACTIVE: 14,892", tag: "LIVE", alert: false },
    { text: "SECURE HARDWARE ENCRYPTED TRANSACTIONS", tag: "LOCK", alert: false },
    { text: "NEXT-GEN CROSS-PLATFORM COMPATIBILITY", tag: "SYNC", alert: true },
    { text: "MIL-SPEC TELEMETRY PROTOCOL ACTIVE", tag: "STATUS", alert: false },
    { text: "ZERO BLOAT // MAXIMUM GAMEPLAY FOCUS", tag: "VAULT", alert: false },
];

export default function MarqueeTicker({ reverse = false, bgClass = "bg-primary text-neutral-900" }) {
    const doubleItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

    return (
        <div className={`w-full overflow-hidden border-y-4 border-neutral-900 ${bgClass} py-2.5 select-none font-mono relative z-20 shadow-[0_4px_0_#171717]`}>
            <div className={reverse ? "animate-marquee-reverse flex items-center gap-8 whitespace-nowrap" : "animate-marquee flex items-center gap-8 whitespace-nowrap"}>
                {doubleItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-xs font-black tracking-widest uppercase">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rotate-45 bg-neutral-900 border border-neutral-900 inline-block"></span>
                            <span className="bg-neutral-900 text-white px-2 py-0.5 text-[9px] font-black border border-neutral-900 tracking-wider">
                                {item.tag}
                            </span>
                            <span>{item.text}</span>
                        </span>
                        <span className="text-neutral-900/60 font-black tracking-tight">///</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
