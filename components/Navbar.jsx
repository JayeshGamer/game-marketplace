"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    return (
        <>
            {/* Promotional Top Bar */}
            <div className="fixed top-0 left-0 w-full z-[501] h-8 bg-[#e2e8f0] flex items-center justify-center border-b border-neutral-900/10">
                <span className="text-neutral-600 text-[8px] font-bold tracking-[0.3em] uppercase">
                    INITIATE PROTOCOL // SECURE CONNECTION ESTABLISHED
                </span>
            </div>

            <header className="fixed top-8 left-0 w-full z-[500] flex items-center justify-between px-6 md:px-12 py-4 bg-background-dark border-b-2 border-neutral-900 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm">

                {/* 1. Left: Navigation */}
                <nav className="flex items-center gap-6 flex-1">
                    <NavLink href="/store" label="Store" />
                    <NavLink href="/about" label="About" />
                    <NavLink href="/faq" label="FAQ" />
                    <NavLink href="/contact" label="Contact" />
                </nav>

                {/* 2. Center: Brand Logo */}
                <div className="flex justify-center flex-shrink-0">
                    <Link href="/" className="flex flex-col items-center group cursor-pointer">
                        <div className="text-primary group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                            </svg>
                        </div>
                        <h1 className="text-neutral-900 text-xl font-black tracking-[0.3em] uppercase mt-1 group-hover:text-primary transition-colors duration-500">
                            VAULT
                        </h1>
                    </Link>
                </div>

                {/* 3. Right: Actions */}
                <div className="flex items-center justify-end gap-2 flex-1">
                    <ActionIcon href="/search" icon="search" badge={0} />
                    <ActionIcon href="/wishlist" icon="favorite" badge={0} />
                    <ActionIcon href="/cart" icon="shopping_cart" badge={cartItems?.length || 0} />

                    {user ? (
                        <>
                            {/* Settings Button */}
                            <Link href="/settings" 
                                className="btn-tactile group flex items-center justify-center size-9 bg-white border-2 border-neutral-900 shadow-[2px_2px_0_#171717] hover:shadow-[3px_3px_0_#ff4500] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                                title="Settings">
                                <span className="material-symbols-outlined text-[16px] text-neutral-900 group-hover:text-primary transition-colors">settings</span>
                            </Link>

                            {/* Compact Profile Button */}
                            <Link href="/profile" className="btn-tactile flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-neutral-900 shadow-[2px_2px_0_#171717] hover:shadow-[3px_3px_0_#ff4500] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none group">
                                <span className="material-symbols-outlined text-[16px] text-neutral-900 group-hover:text-primary transition-colors">fingerprint</span>
                                <span className="text-[9px] font-black uppercase tracking-wider text-neutral-900 hidden md:inline">{user.displayName?.split(' ')[0] || "Agent"}</span>
                            </Link>

                            <button
                                onClick={logout}
                                className="btn-tactile group flex items-center justify-center size-9 bg-white border-2 border-neutral-900 shadow-[2px_2px_0_#171717] hover:bg-red-500 hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                                title="Logout"
                            >
                                <span className="material-symbols-outlined text-[16px]">logout</span>
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="btn-tactile flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white border-2 border-neutral-900 shadow-[2px_2px_0_#ff4500] hover:shadow-[4px_4px_0_#ff4500] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-display font-black text-[10px] tracking-wider uppercase whitespace-nowrap">
                            <span className="material-symbols-outlined text-[16px]">passkey</span>
                            <span className="hidden md:inline">Login</span>
                        </Link>
                    )}
                </div>
            </header>
        </>
    );
}

// Subcomponent: Main Navigation Link
function NavLink({ href, label, icon, active = false }) {
    return (
        <Link
            href={href}
            className={`group relative flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-200 hover:-translate-y-0.5 hover:text-primary cursor-pointer whitespace-nowrap
        ${active ? 'text-primary font-black' : 'text-neutral-900'}
      `}
        >
            {icon && <span className="material-symbols-outlined text-[16px]">{icon}</span>}
            {label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200"></span>
        </Link>
    );
}

// Subcomponent: Right-side Action Icon
function ActionIcon({ href, icon, badge }) {
    return (
        <Link
            href={href}
            className="group relative inline-flex items-center justify-center btn-tactile"
        >
            <div className={`size-9 rounded-none flex items-center justify-center border-2 border-neutral-900 shadow-[2px_2px_0_#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0_#ff4500] group-active:translate-x-0 group-active:translate-y-0 group-active:shadow-none transition-[transform,box-shadow]
        ${badge ? 'bg-primary/10' : 'bg-white'}
      `}>
                <span className={`material-symbols-outlined text-[16px] transition-colors
           ${badge ? 'text-primary' : 'text-neutral-900 group-hover:text-primary'}
        `}>
                    {icon}
                </span>
            </div>
            {/* Number Badge */}
            {badge > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary flex items-center justify-center border-2 border-neutral-900 shadow-[1px_1px_0_#171717]">
                    <span className="text-[8px] font-bold text-white leading-none tabular-nums">{badge}</span>
                </div>
            )}
        </Link>
    );
}
