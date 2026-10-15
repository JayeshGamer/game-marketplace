"use client";

import { useState } from "react";
import Link from "next/link";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

const faqs = [
    {
        category: "Account & Profile",
        questions: [
            { q: "How do I create a GameVault account?", a: "Click 'Sign In' in the top navigation bar or visit /register. You can create your free account in under 30 seconds using your email address." },
            { q: "Can I change my username or email address?", a: "Yes! Navigate to Account Settings from the top right profile menu to update your gamer tag, display name, and email address anytime." },
            { q: "How do I reset my account password?", a: "Click 'Forgot Password' on the login screen or change your password directly in your Account Settings under the Password & Security tab." },
        ]
    },
    {
        category: "Purchases, Keys & Payments",
        questions: [
            { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay with zero hidden processing fees." },
            { q: "Are game purchases delivered instantly?", a: "Yes! The moment your checkout completes, your game license is automatically added to your GameVault Library and is ready to download immediately." },
            { q: "What is your refund policy?", a: "You can request a full, no-questions-asked refund within 14 days of purchase, provided you have played less than 2 hours of the game." },
        ]
    },
    {
        category: "Game Library & Downloads",
        questions: [
            { q: "Where can I find and download my games?", a: "Click 'My Library' in the top navbar or visit your Profile page. Every game you own is saved there forever with direct download links." },
            { q: "Can I play my games offline?", a: "Yes! All games available on GameVault are 100% DRM-free. Once downloaded and installed, you can play completely offline without an internet connection." },
            { q: "How many computers can I install my games on?", a: "You can download and install your purchased games on up to 5 personal devices." },
        ]
    },
    {
        category: "System Requirements & Support",
        questions: [
            { q: "How do I check if my PC can run a game?", a: "Every game's store page features a detailed System Requirements card showing minimum and recommended processor, memory, and graphics card specs." },
            { q: "What if a game won't launch or crashes?", a: "First check that your graphics drivers are up to date and your PC meets the minimum specs. If the issue persists, contact our 24/7 Player Support." },
            { q: "How do I contact customer support?", a: "Visit our Contact Support page to send a message. Our team operates 24/7 and responds to all inquiries within 24 hours." },
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
        <div className="min-h-screen bg-[#f4f4f5] pt-36 pb-20 px-4 sm:px-6 md:px-12 font-display">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 border-b-4 border-neutral-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2.5 h-10 bg-primary inline-block"></span>
                            <span className="text-xs font-mono font-black tracking-widest uppercase text-neutral-500">
                                HELP CENTER & STORE GUIDE
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight text-neutral-900">
                            Frequently Asked Questions
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-neutral-900 text-primary border-2 border-neutral-900 font-mono text-xs shadow-[2px_2px_0_#ff4500]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-white font-bold">ALL GUIDES UPDATED</span>
                    </div>
                </div>

                {/* Search Box */}
                <div className="mb-10 bg-white border-4 border-neutral-900 p-2 shadow-[6px_6px_0_#171717] focus-within:shadow-[8px_8px_0_#ff4500] transition-shadow relative">
                    <span className="absolute top-1 left-2 text-neutral-400 font-mono text-xs pointer-events-none select-none">+</span>
                    <div className="flex items-center gap-3 px-4 py-3">
                        <span className="material-symbols-outlined text-neutral-500 text-2xl">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions, refunds, DRM-free downloads, account..."
                            className="flex-1 bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => {
                                    playMechanicalClick(650, 0.15);
                                    setSearchQuery("");
                                }} 
                                className="btn-tactile text-neutral-400 hover:text-primary"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* FAQ Sections */}
                <div className="space-y-8">
                    {filteredFaqs.length === 0 ? (
                        <div className="bg-white border-4 border-neutral-900 p-12 text-center shadow-[6px_6px_0_#171717]">
                            <p className="text-sm font-bold uppercase text-neutral-600 tracking-wider mb-4">
                                No questions found matching your search.
                            </p>
                            <button 
                                onClick={() => {
                                    playMechanicalClick(650, 0.15);
                                    setSearchQuery("");
                                }} 
                                className="btn-tactile bg-primary border-2 border-neutral-900 px-6 py-2.5 text-xs font-black uppercase shadow-[3px_3px_0_#171717]"
                            >
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        filteredFaqs.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-4">
                                <div className="flex items-center gap-3 border-b-2 border-neutral-900 pb-2">
                                    <div className="w-2 h-2 bg-primary"></div>
                                    <h2 className="text-base font-display font-black tracking-wider uppercase text-neutral-900">
                                        {section.category}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {section.questions.map((faq, qIdx) => {
                                        const id = `${sIdx}-${qIdx}`;
                                        const isOpen = activeIndex === id;

                                        return (
                                            <div 
                                                key={qIdx}
                                                className="bg-white border-4 border-neutral-900 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#ff4500] transition-all relative overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => {
                                                        playMechanicalClick();
                                                        setActiveIndex(isOpen ? null : id);
                                                    }}
                                                    onMouseEnter={() => playHoverTick()}
                                                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display"
                                                >
                                                    <span className="text-sm md:text-base font-bold text-neutral-900">
                                                        {faq.q}
                                                    </span>
                                                    <div className={`w-8 h-8 flex items-center justify-center border-2 border-neutral-900 shrink-0 transition-transform ${
                                                        isOpen ? 'bg-primary rotate-180' : 'bg-neutral-100'
                                                    }`}>
                                                        <span className="material-symbols-outlined text-lg">
                                                            expand_more
                                                        </span>
                                                    </div>
                                                </button>

                                                {isOpen && (
                                                    <div className="px-5 pb-5 pt-1 border-t-2 border-neutral-200 text-sm font-medium text-neutral-700 leading-relaxed bg-neutral-50/50">
                                                        <p>{faq.a}</p>
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

                {/* Still Need Help Footer Banner */}
                <div className="mt-12 bg-neutral-900 text-white p-8 border-4 border-neutral-900 shadow-[8px_8px_0_#ff4500] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white mb-1">
                            Still have questions?
                        </h3>
                        <p className="text-xs text-neutral-400 font-medium">
                            Our gamer support team is here 24/7 to help you with purchases, installs, and game keys.
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        onClick={() => playMechanicalClick()}
                        onMouseEnter={() => playHoverTick()}
                        className="btn-tactile bg-primary text-neutral-900 border-2 border-neutral-900 px-6 py-3 font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0_#fff] hover:shadow-[5px_5px_0_#fff] shrink-0"
                    >
                        Contact Player Support
                    </Link>
                </div>

            </div>
        </div>
    );
}
