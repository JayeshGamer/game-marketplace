"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { playMechanicalClick, playHoverTick, playUplinkChirp } from "@/lib/sound";

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

export default function WishlistPage() {
    const { user } = useAuth();
    const { addToCart, cartItems } = useCart();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        async function fetchWishlist() {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, "users", user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data().wishlist || [];
                    setWishlist(data);
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchWishlist();
    }, [user]);

    const removeFromWishlist = async (gameId) => {
        if (!user) return;
        playMechanicalClick(550, 0.2);
        setRemoving(gameId);
        try {
            const ref = doc(db, "users", user.uid);
            const updated = wishlist.filter(g => g.id !== gameId);
            await setDoc(ref, { wishlist: updated }, { merge: true });
            setWishlist(updated);
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        } finally {
            setRemoving(null);
        }
    };

    const clearWishlist = async () => {
        if (!user || !confirm("Clear entire wishlist?")) return;
        playMechanicalClick(650, 0.2);
        try {
            const ref = doc(db, "users", user.uid);
            await setDoc(ref, { wishlist: [] }, { merge: true });
            setWishlist([]);
        } catch (error) {
            console.error("Error clearing wishlist:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-6">
                <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[10px_10px_0_#ff4500] max-w-md w-full">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neutral-900">
                        <div className="w-3 h-3 bg-primary animate-ping" />
                        <span className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-900">ARCHIVE QUERY IN PROGRESS</span>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-neutral-200 animate-pulse border-2 border-neutral-900" />
                        <div className="h-10 bg-neutral-100 animate-pulse border border-neutral-300" />
                        <div className="pt-4 flex items-center justify-between border-t border-neutral-200 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                            <span>LOADING WISHLIST TITLES...</span>
                            <span className="text-primary font-black animate-pulse">CONNECTING</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-6 font-display">
                <div className="bg-white p-10 md:p-14 border-4 border-neutral-900 shadow-[10px_10px_0_#ff4500] max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-neutral-900 border-2 border-neutral-900 flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0_#ff4500]">
                        <span className="material-symbols-outlined text-3xl text-primary">lock</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mb-2">Sign In Required</h2>
                    <p className="text-neutral-600 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
                        Sign in to your account to view and manage your saved games wishlist.
                    </p>
                    <Link href="/login" className="btn-tactile inline-flex items-center justify-center gap-2 w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-3.5 font-black tracking-[0.2em] uppercase text-xs shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717]">
                        Sign In Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-40 px-6 md:px-12 pb-24 max-w-7xl mx-auto relative overflow-x-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.015] -z-10"
                style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 12px),
                                     repeating-linear-gradient(-45deg, #000 0px, #000 2px, transparent 2px, transparent 12px)`,
                    backgroundSize: '20px 20px'
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
                <div className="absolute -top-32 -left-32 w-[500px] h-[300px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] border-[14px] border-orange-200/40"></div>
                <div className="absolute top-[20%] -right-40 w-[400px] h-[400px] rounded-full border-[16px] border-slate-200/50"></div>
                <div className="absolute bottom-[25%] left-[12%] w-[350px] h-[250px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-[12px] border-orange-200/35"></div>
                <div className="absolute -bottom-40 right-[18%] w-[450px] h-[350px] rounded-[70%_30%_50%_50%/30%_60%_40%_70%] border-[14px] border-slate-200/45"></div>
                
                {/* Medium geometric shapes */}
                <div className="absolute top-[35%] left-[22%] w-32 h-32 border-[6px] border-orange-300/30 -rotate-45"></div>
                <div className="absolute top-[30%] right-[28%] w-28 h-28 rounded-full border-[6px] border-slate-300/40"></div>
                <div className="absolute bottom-[40%] right-[15%] w-36 h-36 border-[6px] border-orange-200/25 rotate-12"></div>
                
                {/* Small accent dots */}
                <div className="absolute top-[22%] left-[18%] w-3 h-3 bg-orange-300/40 rounded-full"></div>
                <div className="absolute top-[58%] right-[14%] w-4 h-4 bg-slate-300/45 rounded-full"></div>
                <div className="absolute bottom-[32%] left-[32%] w-3 h-3 bg-orange-300/35 rounded-full"></div>
                <div className="absolute top-[72%] left-[16%] w-3.5 h-3.5 bg-slate-300/40 rounded-full"></div>
                <div className="absolute bottom-[48%] right-[42%] w-3 h-3 bg-orange-300/30 rounded-full"></div>
            </div>

            <div className="relative z-10">
                <div className="mb-10" style={{ animation: 'slideDown 0.6s ease-out' }}>
                    <div className="flex items-center gap-6 mb-6">
                        <DiamondIcon color="#ff4500" size={24} />
                        <div className="w-2 h-12 bg-primary" style={{ animation: 'expandHeight 0.5s ease-out' }}></div>
                        <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tight font-display">
                            Wishlist
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-neutral-600 ml-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary animate-pulse"></div>
                            <span className="font-black">{wishlist.length} {wishlist.length === 1 ? 'TITLE' : 'TITLES'} SAVED</span>
                        </div>
                        {wishlist.length > 0 && (
                            <>
                                <div className="h-4 w-px bg-neutral-900"></div>
                                <button onClick={clearWishlist} className="btn-tactile font-black hover:text-primary transition-colors relative group">
                                    PURGE ALL
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

            {wishlist.length === 0 ? (
                <div className="p-16 border-4 border-neutral-900 bg-white shadow-[12px_12px_0_#171717] text-center flex flex-col items-center justify-center relative overflow-hidden"
                    style={{ animation: 'fadeInScale 0.5s ease-out 0.3s both' }}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent"></div>
                    <span className="material-symbols-outlined text-[72px] text-neutral-300 mb-8" style={{ animation: 'float 3s ease-in-out infinite' }}>favorite_border</span>
                    <h2 className="text-3xl font-display font-black uppercase tracking-wider text-neutral-900 mb-3">Wishlist Empty</h2>
                    <p className="text-neutral-500 font-black tracking-[0.25em] uppercase text-[10px] mb-10">NO GAMES ARCHIVED</p>
                    <Link href="/store" className="btn-tactile group relative bg-primary border-4 border-neutral-900 text-neutral-900 px-10 py-5 font-black tracking-[0.25em] uppercase text-sm shadow-[6px_6px_0_#171717] hover:shadow-[10px_10px_0_#171717] overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Browse Store
                            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </span>
                        <div className="absolute inset-0 bg-neutral-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-primary transition-opacity z-10 font-black tracking-[0.25em]">
                            BROWSE STORE →
                        </span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {wishlist.map((game, idx) => {
                        const inCart = cartItems?.some(item => item.id === game.id);
                        const itemGenre = game.genres?.[0] || "adventure";
                        const accentColor = genreColor(itemGenre);
                        return (
                            <div key={game.id} 
                                className="group flex gap-3 p-4 border-4 border-neutral-900 bg-white transition-all hover:-translate-y-1 hover:-translate-x-0.5 shadow-[4px_4px_0_#171717] relative overflow-hidden"
                                style={{ animation: `slideInUp 0.5s ease-out ${idx * 0.08}s both`, borderLeft: `6px solid ${accentColor}`, boxShadow: `4px 4px 0 #171717` }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `8px 8px 0 ${accentColor}`}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = `4px 4px 0 #171717`}>
                                {/* Genre-colored accent corner */}
                                <div className="absolute top-0 right-0 w-6 h-6 transform translate-x-3 -translate-y-3 rotate-45 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" style={{ backgroundColor: accentColor }}></div>
                                {/* Colored accent strip */}
                                <div className="absolute top-0 left-0 h-full w-1.5 transition-all group-hover:w-2" style={{ backgroundColor: accentColor }}></div>
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                    style={{ animation: 'scanline 2s linear infinite' }}>
                                </div>
                                
                                <div className="w-20 aspect-[3/4] bg-neutral-200 border-2 border-neutral-900 shrink-0 overflow-hidden relative group/img">
                                    {game.cover ? (
                                        <img src={game.cover} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-neutral-300 to-neutral-200"></div>
                                    )}
                                    <div className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: accentColor }}></div>
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-between py-0.5">
                                    <div>
                                        <Link href={`/store/${game.id}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <DiamondIcon color={accentColor} size={10} />
                                                {game.genres && game.genres.length > 0 && (
                                                    <span className="px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-white border border-neutral-900"
                                                        style={{ backgroundColor: accentColor, boxShadow: "1px 1px 0 #000" }}>
                                                        {game.genres[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-base font-display font-black uppercase tracking-tight transition-colors line-clamp-2" 
                                                onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
                                                onMouseLeave={(e) => e.currentTarget.style.color = '#171717'}>
                                                {game.title}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <div className="w-1 h-1" style={{ backgroundColor: accentColor }}></div>
                                            <p className="text-[8px] tracking-[0.2em] uppercase text-neutral-600 font-black">AVAILABLE</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mt-3">
                                        <span className="text-xl font-mono font-black text-neutral-900 relative">
                                            <span className="absolute -top-1.5 -left-1.5 text-[8px] text-primary opacity-50">$</span>
                                            ${game.price?.toFixed(2) || "0.00"}
                                        </span>
                                        <div className="flex gap-1.5">
                                            {!inCart ? (
                                                <button
                                                    onClick={() => {
                                                        playUplinkChirp();
                                                        addToCart(game);
                                                    }}
                                                    onMouseEnter={() => playHoverTick()}
                                                    className="btn-tactile size-9 flex items-center justify-center border-2 border-neutral-900 bg-primary hover:bg-neutral-900 text-neutral-900 hover:text-primary shadow-[2px_2px_0_#171717] hover:shadow-[3px_3px_0_#171717]"
                                                    title="Add to Cart">
                                                    <span className="material-symbols-outlined text-[18px] font-bold transition-transform group-hover:rotate-12">add_shopping_cart</span>
                                                </button>
                                            ) : (
                                                <Link href="/cart"
                                                    onClick={() => playMechanicalClick()}
                                                    onMouseEnter={() => playHoverTick()}
                                                    className="btn-tactile size-9 flex items-center justify-center border-2 border-neutral-900 bg-neutral-200 text-neutral-900 shadow-[2px_2px_0_#171717] hover:bg-primary"
                                                    title="In Cart">
                                                    <span className="material-symbols-outlined text-[18px] font-bold">shopping_cart</span>
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => removeFromWishlist(game.id)}
                                                onMouseEnter={() => playHoverTick()}
                                                disabled={removing === game.id}
                                                className="btn-tactile size-9 flex items-center justify-center border-2 border-neutral-900 bg-white hover:bg-red-500 hover:border-red-500 hover:text-white text-neutral-900 shadow-[2px_2px_0_#171717] hover:shadow-[3px_3px_0_#dc2626] disabled:opacity-50"
                                                title="Remove from Wishlist">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {removing === game.id ? "hourglass_empty" : "delete"}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes expandHeight {
                    from { height: 0; }
                    to { height: 3rem; }
                }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `}</style>
        </div>
    );
}
