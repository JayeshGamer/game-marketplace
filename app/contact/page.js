"use client";

import { useState } from 'react';
import Link from 'next/link';
import { playMechanicalClick, playHoverTick, playUplinkChirp } from '@/lib/sound';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        playUplinkChirp();

        // Simulate network submission
        await new Promise(resolve => setTimeout(resolve, 800));
        setSending(false);
        setSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        setTimeout(() => setSent(false), 5000);
    };

    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-36 pb-20 px-4 sm:px-6 md:px-12 font-display">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 border-b-4 border-neutral-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2.5 h-10 bg-primary inline-block"></span>
                            <span className="text-xs font-mono font-black tracking-widest uppercase text-neutral-500">
                                24/7 PLAYER SUPPORT & INQUIRIES
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight text-neutral-900">
                            Contact Support
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-neutral-900 text-primary border-2 border-neutral-900 font-mono text-xs shadow-[2px_2px_0_#ff4500]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-white font-bold">HELP DESK ONLINE</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Contact Info Cards */}
                    <div className="space-y-4">
                        <div 
                            onMouseEnter={() => playHoverTick()}
                            className="card-lift bg-white border-4 border-neutral-900 p-6 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#ff4500] relative"
                        >
                            <span className="absolute top-1 left-2 text-neutral-400 font-mono text-xs pointer-events-none select-none">+</span>
                            <span className="material-symbols-outlined text-primary text-3xl mb-3 block">mail</span>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-1 text-neutral-900">Email Support</h3>
                            <a href="mailto:support@gamevault.com" className="text-xs text-neutral-600 hover:text-primary font-mono font-bold">support@gamevault.com</a>
                        </div>
                        
                        <div 
                            onMouseEnter={() => playHoverTick()}
                            className="card-lift bg-white border-4 border-neutral-900 p-6 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#ff4500] relative"
                        >
                            <span className="absolute top-1 left-2 text-neutral-400 font-mono text-xs pointer-events-none select-none">+</span>
                            <span className="material-symbols-outlined text-primary text-3xl mb-3 block">schedule</span>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-1 text-neutral-900">Response SLA</h3>
                            <p className="text-xs text-neutral-600 font-mono font-bold">Under 24 Hours Guaranteed</p>
                        </div>

                        <div 
                            onMouseEnter={() => playHoverTick()}
                            className="card-lift bg-neutral-950 text-white border-4 border-neutral-900 p-6 shadow-[4px_4px_0_#ff4500] relative"
                        >
                            <span className="absolute top-1 left-2 text-neutral-600 font-mono text-xs pointer-events-none select-none">+</span>
                            <span className="material-symbols-outlined text-primary text-3xl mb-3 block">help_center</span>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-2 text-white">Need Immediate Help?</h3>
                            <Link 
                                href="/faq" 
                                onClick={() => playMechanicalClick()}
                                className="text-xs text-primary hover:text-white transition-colors font-mono font-black flex items-center gap-1"
                            >
                                BROWSE FREQUENTLY ASKED QUESTIONS &gt;
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white border-4 border-neutral-900 p-6 sm:p-8 shadow-[8px_8px_0_#171717] relative">
                        {/* Corner Crosshairs */}
                        <span className="absolute top-2 left-3 text-neutral-400 font-mono text-sm pointer-events-none select-none">+</span>
                        <span className="absolute top-2 right-3 text-neutral-400 font-mono text-sm pointer-events-none select-none">+</span>

                        <div className="flex items-center justify-between mb-6 border-b-4 border-neutral-900 pb-4">
                            <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900 flex items-center gap-3">
                                <span className="w-1.5 h-5 bg-primary inline-block"></span>
                                Send Us a Message
                            </h2>
                        </div>

                        {sent && (
                            <div className="mb-6 bg-emerald-50 border-2 border-emerald-600 text-emerald-950 p-4 font-display text-xs font-black uppercase text-center animate-fade-in shadow-[2px_2px_0_#000]">
                                Message sent successfully! Our player support team will reply within 24 hours.
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">Your Name or Gamer Tag</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full border-4 border-neutral-900 px-4 py-3 text-sm font-medium focus:outline-none focus:bg-primary/5 shadow-[2px_2px_0_#171717]"
                                        placeholder="Alex Mercer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full border-4 border-neutral-900 px-4 py-3 text-sm font-medium focus:outline-none focus:bg-primary/5 shadow-[2px_2px_0_#171717]"
                                        placeholder="alex@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full border-4 border-neutral-900 px-4 py-3 text-sm font-medium focus:outline-none focus:bg-primary/5 shadow-[2px_2px_0_#171717]"
                                    placeholder="Question about game download, purchase, or refund..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full border-4 border-neutral-900 p-4 text-sm font-medium focus:outline-none focus:bg-primary/5 shadow-[2px_2px_0_#171717]"
                                    placeholder="Tell us about your issue, order number, or question..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                onMouseEnter={() => playHoverTick()}
                                className="btn-tactile w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-4 font-display font-black tracking-wider uppercase text-xs shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <span className="material-symbols-outlined text-base animate-spin">sync</span>
                                        SENDING MESSAGE...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">send</span>
                                        SEND MESSAGE
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
