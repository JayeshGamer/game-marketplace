"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

// ── Genre colour palette ─────────────────────────────────────────────────────
const GENRE_COLORS = {
    "action": "#dc2626", "adventure": "#16a34a", "shooter": "#2563eb",
    "role-playing (rpg)": "#7c3aed", "rpg": "#7c3aed", "strategy": "#d97706",
    "sport": "#65a30d", "sports": "#65a30d", "horror": "#be123c",
    "puzzle": "#0891b2", "racing": "#ca8a04", "fighting": "#c2460a",
    "platform": "#db2777", "platformer": "#db2777", "simulator": "#0d9488",
    "simulation": "#0d9488", "indie": "#6366f1", "arcade": "#f59e0b",
    "moba": "#0ea5e9", "hack and slash/beat 'em up": "#e11d48",
    "hack and slash": "#e11d48", "beat 'em up": "#e11d48",
    "music": "#9333ea", "real time strategy (rts)": "#b45309",
    "open world": "#10b981", "dark fantasy": "#6d28d9", "fantasy": "#8b5cf6",
    "science fiction": "#06b6d4", "cyberpunk": "#eab308", "stealth": "#374151",
    "survival": "#65a30d", "survival horror": "#be123c", "post-apocalyptic": "#78350f",
};
function genreColor(g = "") {
    return GENRE_COLORS[g.toLowerCase().trim()] ?? "#ff4500";
}

// ── Bordered diamond accent icon ──────────────────────────────────────────────
function DiamondIcon({ color, size = 16 }) {
    const s = size;
    return (
        <span className="inline-flex items-center justify-center shrink-0" style={{ width: s + 4, height: s + 4 }}>
            <span
                className="flex items-center justify-center border-2 border-neutral-900 relative"
                style={{ width: s, height: s, transform: "rotate(45deg)", backgroundColor: color }}>
                <span className="absolute inset-0.75 bg-white/25" />
            </span>
        </span>
    );
}

export default function ShoppingCart() {
    const { cartItems, removeFromCart, loading } = useCart();
    const [removingId, setRemovingId] = useState(null);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const taxes = 0; // Simplified
    const total = subtotal + taxes;

    const handleRemove = async (id) => {
        setRemovingId(id);
        await removeFromCart(id);
        setRemovingId(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
                <span className="text-2xl font-black uppercase tracking-[0.2em] animate-pulse">Loading Cart...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-40 px-6 md:px-12 pb-24 max-w-7xl mx-auto relative overflow-x-hidden">
            {/* Diagonal stripe pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] -z-10"
                style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #000 0px, #000 3px, transparent 3px, transparent 15px)`,
                    backgroundSize: '25px 25px'
                }}>
            </div>

            {/* Decorative geometric shapes and patterns */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                {/* Halftone dots - more visible */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, #cbd5e1 2px, transparent 2px)`,
                    backgroundSize: '32px 32px',
                    opacity: 0.35
                }}></div>
                
                {/* Orange accent diagonal lines */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 35px,
                        #fef3c7 35px,
                        #fef3c7 37px
                    )`,
                    opacity: 0.25
                }}></div>
                
                {/* Large organic blob shapes */}
                <div className="absolute -top-32 -right-32 w-[500px] h-[300px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] border-[14px] border-orange-200/40"></div>
                <div className="absolute top-[15%] -left-40 w-[400px] h-[400px] rounded-full border-[16px] border-slate-200/50"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[250px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-[12px] border-orange-200/35"></div>
                <div className="absolute -bottom-40 left-[15%] w-[450px] h-[350px] rounded-[70%_30%_50%_50%/30%_60%_40%_70%] border-[14px] border-slate-200/45"></div>
                
                {/* Medium geometric shapes */}
                <div className="absolute top-[40%] right-[25%] w-32 h-32 border-[6px] border-orange-300/30 rotate-45"></div>
                <div className="absolute top-[25%] left-[35%] w-28 h-28 rounded-full border-[6px] border-slate-300/40"></div>
                <div className="absolute bottom-[45%] left-[20%] w-36 h-36 border-[6px] border-orange-200/25 -rotate-12"></div>
                
                {/* Small accent dots */}
                <div className="absolute top-[18%] right-[15%] w-3 h-3 bg-orange-300/40 rounded-full"></div>
                <div className="absolute top-[62%] left-[12%] w-4 h-4 bg-slate-300/45 rounded-full"></div>
                <div className="absolute bottom-[28%] right-[30%] w-3 h-3 bg-orange-300/35 rounded-full"></div>
                <div className="absolute top-[75%] right-[18%] w-3.5 h-3.5 bg-slate-300/40 rounded-full"></div>
                <div className="absolute bottom-[52%] left-[45%] w-3 h-3 bg-orange-300/30 rounded-full"></div>
            </div>

            <div className="relative z-10">
                <div className="mb-10" style={{ animation: 'slideInLeft 0.6s ease-out' }}>
                    <div className="flex items-center gap-4 mb-6">
                        <DiamondIcon color="#ff4500" size={24} />
                        <div className="flex flex-col gap-1">
                            <div className="w-12 h-1 bg-primary" style={{ animation: 'expandWidth 0.5s ease-out' }}></div>
                            <div className="w-8 h-1 bg-neutral-900" style={{ animation: 'expandWidth 0.5s ease-out 0.1s both' }}></div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter" 
                            style={{ fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif", letterSpacing: '0.05em' }}>
                            Shopping Cart
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 ml-16 text-[10px] tracking-[0.3em] uppercase">
                        <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-neutral-900 bg-white">
                            <div className="w-2 h-2 bg-primary animate-pulse"></div>
                            <span className="font-black text-neutral-900">{cartItems.length} ITEMS QUEUED</span>
                        </div>
                        {cartItems.length > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-primary">
                                <span className="font-black">${subtotal.toFixed(2)} TOTAL</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="p-20 border-4 border-neutral-900 bg-white shadow-[12px_12px_0_#171717] text-center flex flex-col items-center justify-center relative overflow-hidden"
                                style={{ animation: 'fadeInScale 0.5s ease-out 0.3s both' }}>
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                                <span className="material-symbols-outlined text-[80px] text-neutral-300 mb-8" style={{ animation: 'float 3s ease-in-out infinite' }}>shopping_cart</span>
                                <h2 className="text-3xl font-display font-black uppercase tracking-wider text-neutral-900 mb-3">Cart Empty</h2>
                                <p className="text-neutral-500 font-black tracking-[0.25em] uppercase text-[10px] mb-12">NO ITEMS IN QUEUE</p>
                                <Link href="/store" className="group relative bg-primary border-4 border-neutral-900 text-neutral-900 px-12 py-6 font-black tracking-[0.25em] uppercase text-sm shadow-[6px_6px_0_#171717] hover:shadow-[12px_12px_0_#171717] transition-all overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-3">
                                        Browse Store
                                        <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-2">arrow_forward</span>
                                    </span>
                                    <div className="absolute inset-0 bg-neutral-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-primary transition-opacity z-10 font-black tracking-[0.25em]">
                                        BROWSE STORE →
                                    </span>
                                </Link>
                            </div>
                        ) : (
                            cartItems.map((item, idx) => {
                                const itemGenre = item.genres?.[0] || "action";
                                const accentColor = genreColor(itemGenre);
                                return (
                                <div key={item.id} 
                                    className="group flex flex-row gap-4 p-4 border-4 border-neutral-900 bg-white shadow-[6px_6px_0_#171717] transition-all hover:-translate-y-1 relative overflow-hidden"
                                    style={{ animation: `slideInRight 0.5s ease-out ${idx * 0.1}s both`, boxShadow: `6px 6px 0 #171717, inset 0 0 0 0 ${accentColor}`, borderLeft: `6px solid ${accentColor}` }}
                                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = `10px 10px 0 ${accentColor}, inset 0 0 0 0 ${accentColor}`}
                                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = `6px 6px 0 #171717, inset 0 0 0 0 ${accentColor}`}>
                                    {/* Genre-colored accent strip */}
                                    <div className="absolute top-0 left-0 h-full w-1.5 transition-all group-hover:w-2" style={{ backgroundColor: accentColor }}></div>
                                    {/* Animated corner accent */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: accentColor }}></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: accentColor }}></div>
                                    
                                    <div className="w-20 md:w-24 aspect-[3/4] bg-neutral-200 border-[3px] border-neutral-900 shrink-0 overflow-hidden relative group/img">
                                        {item.cover ? (
                                            <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110 group-hover/img:rotate-1" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-neutral-300 to-neutral-200"></div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-3">
                                                <Link href={`/store/${item.id}`} className="group/link flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <DiamondIcon color={accentColor} size={10} />
                                                        {item.genres && item.genres.length > 0 && (
                                                            <span className="px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-white border border-neutral-900"
                                                                style={{ backgroundColor: accentColor, boxShadow: "1px 1px 0 #000" }}>
                                                                {item.genres[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg md:text-xl font-display font-black uppercase tracking-tight text-neutral-900 transition-colors line-clamp-2"
                                                        onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = '#171717'}>
                                                        {item.title}
                                                    </h3>
                                                    <div className="w-0 h-0.5 transition-all group-hover/link:w-full mt-1" style={{ backgroundColor: accentColor }}></div>
                                                </Link>
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className="text-[7px] font-black tracking-[0.2em] uppercase text-neutral-400">PRICE</span>
                                                    <span className="text-lg font-mono font-black text-neutral-900">${(item.price || 0).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            {item.developer && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-1 h-1" style={{ backgroundColor: accentColor }}></div>
                                                    <p className="text-[9px] font-black tracking-[0.2em] uppercase text-neutral-500 line-clamp-1">{item.developer}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center text-[11px] font-bold tracking-widest uppercase text-neutral-900 mt-2">
                                            <div className="flex items-center gap-3">
                                                <span className="hidden md:inline font-black tracking-[0.3em] text-[9px]">QTY:</span>
                                                <div className="flex items-center border-[3px] border-neutral-900 bg-neutral-100 shadow-[2px_2px_0_#171717]">
                                                    <span className="px-4 font-mono bg-white py-1 text-base font-black">1</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                disabled={removingId === item.id}
                                                className="group/btn flex items-center gap-1.5 px-3 py-1.5 border-2 border-neutral-900 hover:border-neutral-900 hover:bg-red-600 hover:text-white transition-all uppercase font-black text-[9px] tracking-[0.25em] disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:rotate-12">{removingId === item.id ? "hourglass_empty" : "delete"}</span>
                                                {removingId === item.id ? "REMOVING..." : "REMOVE"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                );
                            })
                        )}
                    </div>

                    {/* Action / Summary Sidebar */}
                    {cartItems.length > 0 && (
                        <div className="w-full lg:w-80 shrink-0" style={{ animation: 'fadeIn 0.7s ease-out 0.4s both' }}>
                            <div className="sticky top-32 bg-white border-4 border-neutral-900 p-5 shadow-[8px_8px_0_#ff4500] relative overflow-hidden group/summary">
                                {/* Animated corner strips */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-neutral-900 to-primary transform -translate-x-full group-hover/summary:translate-x-0 transition-transform duration-1000"></div>
                                
                                <h2 className="text-xl font-display font-black tracking-[0.15em] uppercase mb-6 text-neutral-900 flex items-center gap-3 relative">
                                    <DiamondIcon color="#ff4500" size={16} />
                                    Order Summary
                                    <span className="material-symbols-outlined text-3xl ml-auto text-primary">receipt_long</span>
                                </h2>

                                <div className="space-y-3 text-[10px] font-black tracking-[0.15em] uppercase text-neutral-600 border-b-4 border-neutral-900 pb-5 mb-5">
                                    <div className="flex justify-between items-center p-2.5 bg-neutral-50 border-2 border-neutral-200">
                                        <span>ITEMS ({cartItems.length})</span>
                                        <span className="font-mono text-neutral-900 text-sm">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-primary bg-primary/10 p-2.5 border-2 border-primary relative overflow-hidden group/disco">
                                        <span>DISCOUNT</span>
                                        <span className="font-mono font-black text-sm">-$0.00</span>
                                        <div className="absolute inset-0 bg-primary/20 transform -translate-x-full group-hover/disco:translate-x-full transition-transform duration-500"></div>
                                    </div>
                                    <div className="flex justify-between items-center p-2.5 bg-neutral-50 border-2 border-neutral-200">
                                        <span>TAXES (EST.)</span>
                                        <span className="font-mono text-neutral-900 text-sm">${taxes.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-[11px] font-black tracking-[0.2em] uppercase text-neutral-900 mb-6 bg-gradient-to-r from-neutral-100 to-neutral-50 p-4 border-4 border-neutral-900 relative overflow-hidden">
                                    <span>TOTAL</span>
                                    <span className="text-4xl font-mono text-neutral-900 relative">
                                        <span className="absolute -top-2 -left-3 text-xs text-primary">$</span>
                                        {total.toFixed(2)}
                                    </span>
                                </div>

                                <Link href="/checkout" className="group/checkout relative block w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-4 text-center text-xs font-black tracking-[0.3em] uppercase transition-all shadow-[4px_4px_0_#171717] hover:shadow-[8px_8px_0_#ff4500] hover:border-primary hover:-translate-y-1 overflow-hidden">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Proceed to Checkout
                                        <span className="material-symbols-outlined text-base transition-transform group-hover/checkout:translate-x-2">arrow_forward</span>
                                    </span>
                                    <div className="absolute inset-0 bg-neutral-900 transform -translate-y-full group-hover/checkout:translate-y-0 transition-transform duration-300"></div>
                                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/checkout:opacity-100 text-primary transition-opacity z-10 font-black tracking-[0.3em] text-xs">
                                        CHECKOUT NOW →
                                    </span>
                                </Link>

                                <div className="mt-5 border-t-4 border-neutral-900 pt-4 relative">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 bg-primary"></div>
                                        <div className="w-1 h-1 bg-neutral-900"></div>
                                        <div className="w-1.5 h-1.5 bg-primary"></div>
                                    </div>
                                    <p className="text-center text-[8px] tracking-[0.2em] uppercase text-neutral-500 font-black leading-relaxed">
                                        SECURE ENCRYPTED<br />
                                        ALL SALES FINAL
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes expandWidth {
                    from { width: 0; }
                    to { width: 100%; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
            `}</style>
        </div>
    );
}
