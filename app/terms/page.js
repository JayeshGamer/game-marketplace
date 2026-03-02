export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-12" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1 h-12 bg-primary"></div>
                        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight">Terms of Service</h1>
                    </div>
                    <p className="text-neutral-600 text-sm font-bold tracking-wider uppercase ml-6">Last Updated: March 3, 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] p-8 space-y-8 text-neutral-700 leading-relaxed">
                    
                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-sm">
                            By accessing and using GameVault, you accept and agree to be bound by these Terms of Service. 
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            2. User Accounts
                        </h2>
                        <p className="text-sm mb-3">You are responsible for:</p>
                        <ul className="list-disc list-inside text-sm space-y-2 pl-4">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                            <li>Ensuring your account information is accurate and up-to-date</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            3. Purchases & Payments
                        </h2>
                        <p className="text-sm mb-3">
                            All purchases are final unless otherwise stated in our refund policy. Prices are subject to change without notice. 
                            You agree to pay all charges incurred under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            4. License & Restrictions
                        </h2>
                        <p className="text-sm mb-3">
                            Games purchased through GameVault are licensed, not sold. You may not:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-2 pl-4">
                            <li>Resell, redistribute, or transfer licenses</li>
                            <li>Reverse engineer or modify game files</li>
                            <li>Use games for commercial purposes without authorization</li>
                            <li>Share account credentials with others</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            5. Refund Policy
                        </h2>
                        <p className="text-sm">
                            Digital purchases may be refunded within 14 days of purchase if you have played less than 2 hours. 
                            Refund requests must be submitted through your account dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            6. Termination
                        </h2>
                        <p className="text-sm">
                            We reserve the right to suspend or terminate accounts that violate these terms. 
                            Terminated accounts may lose access to purchased content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            7. Contact
                        </h2>
                        <p className="text-sm">
                            Questions about these terms? Contact us at <span className="font-mono text-primary">legal@gamevault.com</span>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
