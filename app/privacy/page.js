export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-12" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1 h-12 bg-primary"></div>
                        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight">Privacy Policy</h1>
                    </div>
                    <p className="text-neutral-600 text-sm font-bold tracking-wider uppercase ml-6">Last Updated: March 3, 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] p-8 space-y-8 text-neutral-700 leading-relaxed">
                    
                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            Information We Collect
                        </h2>
                        <p className="text-sm mb-3">We collect the following information:</p>
                        <ul className="list-disc list-inside text-sm space-y-2 pl-4">
                            <li><strong>Account Information:</strong> Email, username, password (encrypted)</li>
                            <li><strong>Payment Information:</strong> Billing details processed securely through payment providers</li>
                            <li><strong>Usage Data:</strong> Games played, purchase history, device information</li>
                            <li><strong>Technical Data:</strong> IP address, browser type, operating system</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            How We Use Your Information
                        </h2>
                        <p className="text-sm mb-3">Your data is used to:</p>
                        <ul className="list-disc list-inside text-sm space-y-2 pl-4">
                            <li>Provide and maintain GameVault services</li>
                            <li>Process transactions and send purchase confirmations</li>
                            <li>Improve user experience and platform functionality</li>
                            <li>Send important updates and security notifications</li>
                            <li>Prevent fraud and ensure platform security</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            Data Security
                        </h2>
                        <p className="text-sm">
                            We implement industry-standard security measures including encryption, secure servers, and regular security audits. 
                            However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            Third-Party Services
                        </h2>
                        <p className="text-sm">
                            We use third-party services for payment processing, analytics, and content delivery. 
                            These services have their own privacy policies and data handling practices.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            Your Rights
                        </h2>
                        <p className="text-sm mb-3">You have the right to:</p>
                        <ul className="list-disc list-inside text-sm space-y-2 pl-4">
                            <li>Access your personal data</li>
                            <li>Request data correction or deletion</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Export your data in a portable format</li>
                            <li>Lodge a complaint with data protection authorities</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            Cookies & Tracking
                        </h2>
                        <p className="text-sm">
                            We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                            and remember your preferences. You can control cookie settings through your browser.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            Children's Privacy
                        </h2>
                        <p className="text-sm">
                            GameVault is not intended for users under 13 years of age. We do not knowingly collect 
                            personal information from children.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary"></div>
                            Contact Us
                        </h2>
                        <p className="text-sm">
                            For privacy-related questions or requests, contact us at <span className="font-mono text-primary">privacy@gamevault.com</span>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
