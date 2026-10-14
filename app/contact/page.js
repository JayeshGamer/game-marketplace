"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert("Message sent! We'll respond within 24 hours.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSending(false);
    };

    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="mb-12" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1 h-12 bg-primary"></div>
                        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight">Contact Support</h1>
                    </div>
                    <p className="text-neutral-600 text-sm font-bold tracking-wider uppercase ml-6">We&apos;re here to help. Reach out anytime.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Contact Info Cards */}
                    <div className="space-y-4">
                        <div className="bg-white border-2 border-neutral-900 p-6 shadow-[4px_4px_0_#171717]">
                            <span className="material-symbols-outlined text-primary text-3xl mb-3 block">mail</span>
                            <h3 className="text-sm font-display font-black uppercase tracking-wider mb-2">Email</h3>
                            <a href="mailto:support@gamevault.com" className="text-xs text-neutral-600 hover:text-primary font-mono">support@gamevault.com</a>
                        </div>
                        
                        <div className="bg-white border-2 border-neutral-900 p-6 shadow-[4px_4px_0_#171717]">
                            <span className="material-symbols-outlined text-primary text-3xl mb-3 block">schedule</span>
                            <h3 className="text-sm font-display font-black uppercase tracking-wider mb-2">Hours</h3>
                            <p className="text-xs text-neutral-600 font-bold">24/7 Support Available</p>
                        </div>

                        <div className="bg-white border-2 border-neutral-900 p-6 shadow-[4px_4px_0_#171717]">
                            <span className="material-symbols-outlined text-primary text-3xl mb-3 block">forum</span>
                            <h3 className="text-sm font-display font-black uppercase tracking-wider mb-2">Community</h3>
                            <Link href="/faq" className="text-xs text-primary hover:underline font-bold">Visit FAQ</Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white border-4 border-neutral-900 p-8 shadow-[8px_8px_0_#ff4500]">
                        <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                            <div className="w-1 h-6 bg-primary"></div>
                            Send Message
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black tracking-wider uppercase text-neutral-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full border-2 border-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black tracking-wider uppercase text-neutral-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full border-2 border-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black tracking-wider uppercase text-neutral-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full border-2 border-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                    placeholder="What's this about?"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black tracking-wider uppercase text-neutral-700 mb-2">Message</label>
                                <textarea
                                    required
                                    rows="6"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full border-2 border-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                                    placeholder="Tell us what you need..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-primary border-4 border-neutral-900 px-8 py-4 font-display font-black tracking-wider uppercase text-sm shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <span className="material-symbols-outlined text-base animate-spin">sync</span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">send</span>
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
