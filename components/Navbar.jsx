"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { playMechanicalClick, playHoverTick, toggleSound, isSoundEnabled } from '@/lib/sound';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const [soundOn, setSoundOn] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setSoundOn(isSoundEnabled());
    }, []);

    // Global keyboard shortcut: Ctrl+K or Cmd+K focuses search
    useEffect(() => {
        function handleKeyDown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                playMechanicalClick(1200);
                const searchInput = document.getElementById('navbar-game-search');
                if (searchInput) {
                    searchInput.focus();
                } else {
                    router.push('/search');
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    const handleSoundToggle = () => {
        const next = toggleSound();
        setSoundOn(next);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            playMechanicalClick(1300);
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/search');
        }
    };

    return (
        <>
            {/* Top Store Banner & Status Bar */}
            <div className="fixed top-0 left-0 w-full z-[501] h-8 bg-neutral-900 text-neutral-300 flex items-center justify-between px-4 md:px-10 border-b-2 border-neutral-900 font-mono text-[11px] font-bold select-none">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-primary">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-emerald-400 hidden sm:inline">SERVERS ONLINE</span>
                    </span>
                    <span className="text-neutral-600 hidden md:inline">•</span>
                    <span className="text-neutral-300 font-sans text-[11px] font-medium hidden md:inline">
                        Instant Game Keys & DRM-Free Downloads
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-primary font-black uppercase text-[10px] tracking-wider hidden lg:inline bg-primary/10 border border-primary/30 px-2 py-0.5">
                        WEEKEND SALE: UP TO 80% OFF
                    </span>

                    <button
                        onClick={handleSoundToggle}
                        className="btn-tactile flex items-center gap-1.5 text-neutral-300 hover:text-primary transition-colors border border-neutral-700 px-2.5 py-0.5 bg-neutral-800 active:scale-95"
                        title="Toggle Sound Effects"
                    >
                        <span className="material-symbols-outlined text-[13px]">
                            {soundOn ? "volume_up" : "volume_off"}
                        </span>
                        <span className="text-[9px] font-black tracking-wider uppercase font-mono">{soundOn ? "AUDIO: ON" : "AUDIO: OFF"}</span>
                    </button>
                </div>
            </div>

            {/* Main Gaming Marketplace Navigation Header */}
            <header className="fixed top-8 left-0 w-full z-[500] bg-white/98 border-b-4 border-neutral-900 shadow-[0_4px_0_#171717] backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 gap-4">
                    
                    {/* Brand Logo & Core Store Navigation */}
                    <div className="flex items-center gap-6 md:gap-8">
                        <Link 
                            href="/" 
                            onClick={() => playMechanicalClick(900)}
                            onMouseEnter={playHoverTick}
                            className="flex items-center gap-2 group cursor-pointer shrink-0"
                        >
                            <div className="w-10 h-10 bg-neutral-900 border-2 border-neutral-900 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200 shadow-[2px_2px_0_#ff4500]">
                                <span className="material-symbols-outlined text-2xl">sports_esports</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-neutral-900 text-xl font-display font-black tracking-tight uppercase leading-none group-hover:text-primary transition-colors">
                                    GAME<span className="text-primary">VAULT</span>
                                </span>
                                <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-neutral-500">
                                    STORE & LAUNCHER
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-5">
                            <StoreNavLink href="/store" label="Store" active={pathname === "/store"} />
                            {user && (
                                <StoreNavLink href="/profile?tab=library" label="My Library" active={pathname.includes("/profile") && pathname.includes("library")} />
                            )}
                            <StoreNavLink href="/search" label="Browse Games" active={pathname === "/search"} />
                            <StoreNavLink href="/about" label="About" active={pathname === "/about"} />
                            <StoreNavLink href="/faq" label="Help & FAQ" active={pathname === "/faq"} />
                        </nav>
                    </div>

                    {/* Center: Inline Game Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-2">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input 
                                id="navbar-game-search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search games, genres, publishers..."
                                className="w-full bg-neutral-100 hover:bg-neutral-50 focus:bg-white text-xs font-bold text-neutral-900 pl-9 pr-16 py-2 border-2 border-neutral-900 focus:outline-none focus:shadow-[3px_3px_0_#ff4500] transition-all placeholder:text-neutral-400 placeholder:font-medium"
                            />
                            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-base pointer-events-none">
                                search
                            </span>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <kbd className="hidden sm:inline-block bg-neutral-200 border border-neutral-400 text-[9px] font-mono font-bold text-neutral-600 px-1.5 py-0.5 rounded shadow-sm">
                                    Ctrl+K
                                </kbd>
                            </div>
                        </form>
                    </div>

                    {/* Right: Actions, Cart & User Profile */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <ActionButton 
                            href="/wishlist" 
                            icon="favorite" 
                            title="Wishlist"
                            badge={0}
                        />

                        <ActionButton 
                            href="/cart" 
                            icon="shopping_cart" 
                            title="Shopping Cart"
                            badge={cartItems?.length || 0}
                            highlight={cartItems?.length > 0}
                        />

                        {user ? (
                            <div className="flex items-center gap-2 pl-1 border-l-2 border-neutral-300">
                                <Link 
                                    href="/profile"
                                    onClick={() => playMechanicalClick(1100)}
                                    onMouseEnter={playHoverTick}
                                    className="btn-tactile flex items-center gap-2 bg-neutral-100 hover:bg-primary/20 border-2 border-neutral-900 px-3 py-1.5 shadow-[2px_2px_0_#171717] hover:shadow-[3px_3px_0_#ff4500] hover:-translate-y-0.5 transition-all group"
                                    title="View Profile & Library"
                                >
                                    <div className="w-5 h-5 bg-neutral-900 text-white rounded-none flex items-center justify-center font-bold text-[10px]">
                                        {user.email?.[0]?.toUpperCase() || "P"}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 hidden sm:inline">
                                        {user.displayName || user.email?.split('@')[0]}
                                    </span>
                                </Link>

                                <Link 
                                    href="/settings"
                                    onClick={() => playMechanicalClick(1100)}
                                    onMouseEnter={playHoverTick}
                                    className="btn-tactile flex items-center justify-center size-8 bg-white border-2 border-neutral-900 shadow-[2px_2px_0_#171717] hover:shadow-[3px_3px_0_#ff4500] hover:-translate-y-0.5 transition-all"
                                    title="Account Settings"
                                >
                                    <span className="material-symbols-outlined text-[16px] text-neutral-900">settings</span>
                                </Link>

                                <button
                                    onClick={() => {
                                        playMechanicalClick(700);
                                        logout();
                                    }}
                                    onMouseEnter={playHoverTick}
                                    className="btn-tactile flex items-center justify-center size-8 bg-white border-2 border-neutral-900 shadow-[2px_2px_0_#171717] hover:bg-red-500 hover:text-white hover:border-red-600 transition-all"
                                    title="Sign Out"
                                >
                                    <span className="material-symbols-outlined text-[16px]">logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 pl-1">
                                <Link 
                                    href="/login" 
                                    onClick={() => playMechanicalClick(1200)}
                                    onMouseEnter={playHoverTick}
                                    className="btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-neutral-900 border-2 border-neutral-900 shadow-[3px_3px_0_#171717] hover:shadow-[4px_4px_0_#171717] hover:-translate-y-0.5 transition-all font-display font-black text-xs uppercase tracking-wider whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-[16px]">login</span>
                                    <span>Sign In</span>
                                </Link>
                                <Link 
                                    href="/register" 
                                    onClick={() => playMechanicalClick(1200)}
                                    onMouseEnter={playHoverTick}
                                    className="hidden sm:flex btn-tactile items-center px-3 py-1.5 bg-white text-neutral-900 border-2 border-neutral-900 shadow-[2px_2px_0_#171717] hover:bg-neutral-100 transition-all font-display font-bold text-xs uppercase tracking-wider"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() => {
                                playMechanicalClick(1000);
                                setMobileMenuOpen(!mobileMenuOpen);
                            }}
                            className="lg:hidden flex items-center justify-center size-8 bg-white border-2 border-neutral-900 shadow-[2px_2px_0_#171717]"
                            title="Toggle Navigation Menu"
                        >
                            <span className="material-symbols-outlined text-lg">
                                {mobileMenuOpen ? "close" : "menu"}
                            </span>
                        </button>
                    </div>

                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t-2 border-neutral-900 bg-white p-4 space-y-3 shadow-lg">
                        <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search games, genres..."
                                className="w-full bg-neutral-100 text-xs font-bold text-neutral-900 pl-9 pr-4 py-2 border-2 border-neutral-900"
                            />
                            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-base">
                                search
                            </span>
                        </form>
                        <div className="grid grid-cols-2 gap-2">
                            <Link 
                                href="/store" 
                                onClick={() => { playMechanicalClick(); setMobileMenuOpen(false); }}
                                className="p-2 border-2 border-neutral-900 font-display font-black text-xs uppercase hover:bg-primary"
                            >
                                Store
                            </Link>
                            <Link 
                                href="/search" 
                                onClick={() => { playMechanicalClick(); setMobileMenuOpen(false); }}
                                className="p-2 border-2 border-neutral-900 font-display font-black text-xs uppercase hover:bg-primary"
                            >
                                Browse All
                            </Link>
                            <Link 
                                href="/profile?tab=library" 
                                onClick={() => { playMechanicalClick(); setMobileMenuOpen(false); }}
                                className="p-2 border-2 border-neutral-900 font-display font-black text-xs uppercase hover:bg-primary"
                            >
                                My Library
                            </Link>
                            <Link 
                                href="/wishlist" 
                                onClick={() => { playMechanicalClick(); setMobileMenuOpen(false); }}
                                className="p-2 border-2 border-neutral-900 font-display font-black text-xs uppercase hover:bg-primary"
                            >
                                Wishlist
                            </Link>
                            <Link 
                                href="/about" 
                                onClick={() => { playMechanicalClick(); setMobileMenuOpen(false); }}
                                className="p-2 border-2 border-neutral-900 font-display font-black text-xs uppercase hover:bg-primary"
                            >
                                About
                            </Link>
                            <Link 
                                href="/faq" 
                                onClick={() => { playMechanicalClick(); setMobileMenuOpen(false); }}
                                className="p-2 border-2 border-neutral-900 font-display font-black text-xs uppercase hover:bg-primary"
                            >
                                Help & FAQ
                            </Link>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}

function StoreNavLink({ href, label, active }) {
    return (
        <Link
            href={href}
            onClick={() => playMechanicalClick(1150)}
            onMouseEnter={playHoverTick}
            className={`group relative text-xs font-display font-black uppercase tracking-wider py-1 transition-colors ${
                active ? "text-primary" : "text-neutral-900 hover:text-primary"
            }`}
        >
            {label}
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200 ${
                active ? "w-full" : "w-0 group-hover:w-full"
            }`}></span>
        </Link>
    );
}

function ActionButton({ href, icon, title, badge, highlight }) {
    return (
        <Link
            href={href}
            title={title}
            onClick={() => playMechanicalClick(1300)}
            onMouseEnter={playHoverTick}
            className="group relative inline-flex items-center justify-center btn-tactile"
        >
            <div className={`size-8 sm:size-9 flex items-center justify-center border-2 border-neutral-900 shadow-[2px_2px_0_#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0_#ff4500] transition-all ${
                highlight ? 'bg-primary/20' : 'bg-white'
            }`}>
                <span className={`material-symbols-outlined text-[17px] ${
                    highlight ? 'text-primary font-bold' : 'text-neutral-900 group-hover:text-primary'
                }`}>
                    {icon}
                </span>
            </div>
            {badge > 0 && (
                <div className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-primary text-neutral-900 flex items-center justify-center border border-neutral-900 shadow-[1px_1px_0_#000] rounded-none">
                    <span className="text-[9px] font-black leading-none">{badge}</span>
                </div>
            )}
        </Link>
    );
}
