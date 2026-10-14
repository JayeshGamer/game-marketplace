"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
    {
        category: "Account",
        questions: [
            { q: "How do I create an account?", a: "Click 'Access Portal' in the navbar and follow the registration process. You'll need a valid email address." },
            { q: "Can I change my email?", a: "Yes, visit your Profile page and update your account settings." },
            { q: "How do I reset my password?", a: "Use the 'Forgot Password' link on the login page to receive a reset email." },
        ]
    },
    {
        category: "Purchasing",
        questions: [
            { q: "What payment methods do you accept?", a: "We accept major credit cards, PayPal, and select cryptocurrencies." },
            { q: "Are purchases instant?", a: "Yes! Games are added to your library immediately after purchase." },
            { q: "Can I get a refund?", a: "Refunds are available within 14 days if you've played less than 2 hours. See our refund policy." },
        ]
    },
    {
        category: "Games & Library",
        questions: [
            { q: "Where are my purchased games?", a: "Visit your Profile page and click the Library tab to see all your games." },
            { q: "Can I download games offline?", a: "Yes, downloaded games can be played without an internet connection." },
            { q: "How many devices can I use?", a: "Your account can be used on up to 5 devices simultaneously." },
        ]
    },
    {
        category: "Technical",
        questions: [
            { q: "System requirements?", a: "Each game page lists specific requirements. Generally, Windows 10+ or macOS 12+ required." },
            { q: "Game won't launch?", a: "Try verifying game files, updating drivers, or contact support for assistance." },
            { q: "How do I report a bug?", a: "Use the Contact page to report any technical issues with detailed information." },
        ]
    }
];

export default function FAQPage() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = faqs.map(section => ({
        ...section,
        questions: section.questions.filter(
            item =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(section => section.questions.length > 0);

    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-32 pb-20 px-6 font-display">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-12" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1.5 h-12 bg-primary"></div>
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">FAQ</h1>
                    </div>
                    <p className="text-neutral-600 text-sm font-bold tracking-wider uppercase ml-6">Frequently Asked Questions & Protocol Guidelines</p>
                </div>

                {/* Search Box */}
                <div className="mb-8 bg-white border-4 border-neutral-900 p-1 shadow-[4px_4px_0_#171717] focus-within:shadow-[6px_6px_0_#ff4500] transition-shadow">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <span className="material-symbols-outlined text-neutral-400">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH QUESTIONS, KEYWORDS, OR POLICIES..."
                            className="flex-1 bg-transparent text-sm font-mono font-bold tracking-wider uppercase outline-none placeholder:text-neutral-400"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="btn-tactile text-neutral-400 hover:text-primary">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* FAQ Sections */}
                <div className="space-y-8">
                    {filteredFaqs.length === 0 ? (
                        <div className="bg-white border-4 border-neutral-900 p-12 text-center shadow-[6px_6px_0_#171717]">
                            <p className="text-sm font-black uppercase text-neutral-500 tracking-wider">No matching queries found in database.</p>
                            <button onClick={() => setSearchQuery("")} className="btn-tactile mt-4 bg-primary border-2 border-neutral-900 px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0_#171717]">
                                Reset Query
                            </button>
                        </div>
                    ) : (
                        filteredFaqs.map((section, sIdx) => (
                            <div key={sIdx} className="bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717]">
                                <div className="bg-neutral-900 text-white px-6 py-3 border-b-4 border-neutral-900">
                                    <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-primary"></div>
                                        {section.category}
                                    </h2>
                                </div>
                                <div className="divide-y-2 divide-neutral-900">
                                    {section.questions.map((item, qIdx) => {
                                        const index = `${sIdx}-${qIdx}`;
                                        const isOpen = activeIndex === index;
                                        return (
                                            <div key={qIdx}>
                                                <button
                                                    onClick={() => setActiveIndex(isOpen ? null : index)}
                                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 active:bg-neutral-100 transition-colors group text-left"
                                                >
                                                    <span className="text-sm font-black uppercase tracking-tight text-neutral-900 group-hover:text-primary transition-colors pr-4">
                                                        {item.q}
                                                    </span>
                                                    <span className={`material-symbols-outlined text-primary transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                                                        expand_more
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-5 text-sm text-neutral-700 leading-relaxed border-t-2 border-neutral-200 pt-4 bg-neutral-50/50">
                                                        {item.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 bg-primary border-4 border-neutral-900 p-8 shadow-[8px_8px_0_#171717] text-center">
                    <span className="material-symbols-outlined text-5xl text-neutral-900 mb-4 block">support_agent</span>
                    <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900 mb-2">Still Need Help?</h3>
                    <p className="text-sm font-bold text-neutral-900/80 mb-6">Our support team is available 24/7 across all global sectors</p>
                    <Link href="/contact" className="btn-tactile inline-block bg-neutral-900 text-white border-4 border-neutral-900 px-8 py-3.5 font-black tracking-wider uppercase text-sm shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
