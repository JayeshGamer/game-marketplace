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

    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-12" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1 h-12 bg-primary"></div>
                        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight">FAQ</h1>
                    </div>
                    <p className="text-neutral-600 text-sm font-bold tracking-wider uppercase ml-6">Frequently Asked Questions</p>
                </div>

                {/* Search Box */}
                <div className="mb-8 bg-white border-4 border-neutral-900 p-1 shadow-[4px_4px_0_#171717]">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <span className="material-symbols-outlined text-neutral-400">search</span>
                        <input
                            type="text"
                            placeholder="SEARCH QUESTIONS..."
                            className="flex-1 bg-transparent text-sm font-bold tracking-wider uppercase outline-none placeholder:text-neutral-300"
                        />
                    </div>
                </div>

                {/* FAQ Sections */}
                <div className="space-y-8">
                    {faqs.map((section, sIdx) => (
                        <div key={sIdx} className="bg-white border-2 border-neutral-900 shadow-[4px_4px_0_#171717]">
                            <div className="bg-neutral-900 text-white px-6 py-3 border-b-2 border-neutral-900">
                                <h2 className="text-lg font-display font-black uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary"></div>
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
                                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors group"
                                            >
                                                <span className="text-sm font-display font-black uppercase tracking-tight text-left group-hover:text-primary transition-colors">
                                                    {item.q}
                                                </span>
                                                <span className={`material-symbols-outlined text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-4 text-sm text-neutral-600 leading-relaxed border-t-2 border-neutral-200 pt-4">
                                                    {item.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 bg-primary border-4 border-neutral-900 p-8 shadow-[8px_8px_0_#171717] text-center">
                    <span className="material-symbols-outlined text-5xl text-neutral-900 mb-4 block">support_agent</span>
                    <h3 className="text-2xl font-display font-black uppercase tracking-wider text-neutral-900 mb-2">Still Need Help?</h3>
                    <p className="text-sm font-bold text-neutral-700 mb-6">Our support team is available 24/7</p>
                    <Link href="/contact" className="inline-block bg-neutral-900 text-white border-4 border-neutral-900 px-8 py-3 font-display font-black tracking-wider uppercase text-sm shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 transition-all">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
