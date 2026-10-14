import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t-4 border-neutral-900 bg-neutral-900 text-neutral-400 py-12 px-12 font-display select-none mt-24 space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-12 max-w-7xl mx-auto">

                {/* Brand */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-3 group">
                        <svg className="w-7 h-7 fill-current text-primary group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                        </svg>
                        <span className="text-xl font-black tracking-[0.3em] uppercase text-white group-hover:text-primary transition-colors">VAULT</span>
                    </Link>
                    <p className="text-[10px] tracking-[0.2em] uppercase max-w-xs">
                        The ultimate cinematic marketplace experience.
                        <br />
                        Secure. Fast. Immersive.
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-16 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <div className="flex flex-col gap-4">
                        <span className="text-white tracking-widest mb-2">Explore</span>
                        <Link href="/store" className="hover:text-primary transition-colors">Store</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                        <Link href="/developer" className="hover:text-primary transition-colors">Developer Hub</Link>
                        <Link href="/search" className="hover:text-primary transition-colors">Search</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-white tracking-widest mb-2">Support</span>
                        <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-white tracking-widest mb-2">Legal</span>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    </div>
                </div>

            </div>

            <div className="h-px w-full bg-white/10 my-8 max-w-7xl mx-auto"></div>

            <div className="flex items-center justify-between text-[8px] tracking-[0.3em] uppercase max-w-7xl mx-auto">
                <span className="text-neutral-500">&copy; {new Date().getFullYear()} VAULT Marketplace. All systems operational.</span>
                <div className="flex items-center gap-2 text-white">
                    <div className="size-1.5 rounded-full bg-primary animate-pulse blur-[1px]"></div>
                    <span>Status: Nominal</span>
                </div>
            </div>
        </footer>
    );
}
