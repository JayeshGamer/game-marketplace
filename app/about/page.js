import Link from "next/link";

export const metadata = {
    title: "About | GameVault",
};

export default function About() {
    return (
        <div className="min-h-screen bg-[#f4f4f5] pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="mb-12" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1 h-12 bg-primary"></div>
                        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight">About GameVault</h1>
                    </div>
                    <p className="text-neutral-600 text-sm font-bold tracking-wider uppercase ml-6">The Future of Digital Game Distribution</p>
                </div>

                {/* Hero Section */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#ff4500] p-12 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-6xl text-primary mb-6 block">gamepad</span>
                        <h2 className="text-3xl font-display font-black uppercase tracking-wider text-neutral-900 mb-4">Our Mission</h2>
                        <p className="text-base text-neutral-700 leading-relaxed max-w-3xl">
                            GameVault is a next-generation digital marketplace revolutionizing how gamers discover, purchase, and experience video games. 
                            We combine cutting-edge technology with a brutalist design philosophy to deliver a powerful, no-nonsense platform 
                            that puts games first.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card-lift bg-white border-2 border-neutral-900 p-6 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#ff4500]">
                        <span className="material-symbols-outlined text-primary text-4xl mb-4 block">bolt</span>
                        <h3 className="text-lg font-display font-black uppercase tracking-wider mb-3">Lightning Fast</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Instant purchases, instant downloads. No waiting, no loading screens. Your games, ready when you are.
                        </p>
                    </div>

                    <div className="card-lift bg-white border-2 border-neutral-900 p-6 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#ff4500]">
                        <span className="material-symbols-outlined text-primary text-4xl mb-4 block">security</span>
                        <h3 className="text-lg font-display font-black uppercase tracking-wider mb-3">Secure</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Bank-level encryption, secure payment processing, and guaranteed data protection for every transaction.
                        </p>
                    </div>

                    <div className="card-lift bg-white border-2 border-neutral-900 p-6 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#ff4500]">
                        <span className="material-symbols-outlined text-primary text-4xl mb-4 block">diversity_3</span>
                        <h3 className="text-lg font-display font-black uppercase tracking-wider mb-3">Community First</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Built by gamers, for gamers. We listen to feedback and constantly evolve based on what you need.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-neutral-900 border-4 border-neutral-900 shadow-[8px_8px_0_#171717] p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-display font-black text-primary mb-2">10,000+</div>
                            <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">Games Available</div>
                        </div>
                        <div>
                            <div className="text-4xl font-display font-black text-primary mb-2">500K+</div>
                            <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">Active Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-display font-black text-primary mb-2">24/7</div>
                            <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">Support</div>
                        </div>
                        <div>
                            <div className="text-4xl font-display font-black text-primary mb-2">99.9%</div>
                            <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Our Story */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] p-8">
                    <h2 className="text-2xl font-display font-black uppercase tracking-wider text-neutral-900 mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-primary"></div>
                        Our Story
                    </h2>
                    <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
                        <p>
                            Founded in 2024, GameVault emerged from a simple frustration: digital game marketplaces were bloated, 
                            slow, and filled with unnecessary features that got in the way of what matters most—the games.
                        </p>
                        <p>
                            We set out to build something different. A platform that respects your time, your bandwidth, and your intelligence. 
                            No social features you didn&apos;t ask for. No invasive DRM. No artificial scarcity. Just pure, unadulterated access to 
                            the games you want to play.
                        </p>
                        <p>
                            Today, GameVault serves hundreds of thousands of gamers worldwide, offering everything from AAA blockbusters to 
                            indie gems, all through a lightning-fast interface that gets out of your way and lets you game.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link href="/store" className="btn-tactile inline-block bg-primary border-4 border-neutral-900 px-12 py-4 font-display font-black tracking-wider uppercase text-sm shadow-[6px_6px_0_#171717] hover:shadow-[8px_8px_0_#171717] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_#171717] transition-all">
                        Explore The Store
                    </Link>
                </div>
            </div>
        </div>
    );
}
