"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

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
    "historical": "#92400e", "western": "#b45309", "crime": "#9f1239",
    "thriller": "#4b5563", "comedy": "#f59e0b", "war": "#57534e",
    "space": "#1e3a5f", "mythology": "#92400e", "medieval": "#713f12",
    "anime": "#f43f5e", "sandbox": "#059669", "battle royale": "#dc2626",
    "soulslike": "#44403c", "roguelike": "#64748b", "rogue-like": "#64748b",
    "metroidvania": "#7c3aed", "action-adventure": "#ea580c",
};
function genreColor(g = "") {
    return GENRE_COLORS[g.toLowerCase().trim()] ?? "#525252";
}

// ── Fisher-Yates shuffle ─────────────────────────────────────────────────────
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── Cycling accent colour (shuffle deck — no repeats until all shown) ────────
function useAccentCycle(genreList) {
    const colors = [...new Set(genreList.map(g => genreColor(g)).filter(c => c !== "#525252"))];
    const fallback = "#ff4500";
    const [state, setState] = useState(() => ({
        deck: shuffleArray(colors.length > 1 ? [...Array(colors.length).keys()] : [0]),
        pos: 0,
    }));
    useEffect(() => {
        if (colors.length <= 1) return;
        const t = setInterval(() => {
            setState(prev => {
                const next = prev.pos + 1;
                if (next >= prev.deck.length) {
                    return { deck: shuffleArray([...Array(colors.length).keys()]), pos: 0 };
                }
                return { ...prev, pos: next };
            });
        }, 30000);
        return () => clearInterval(t);
    }, [colors.length]);
    if (colors.length === 0) return fallback;
    return colors[state.deck[state.pos] ?? 0] ?? fallback;
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

// ── Wishlist hook ─────────────────────────────────────────────────────────────
function useWishlist(gameId) {
    const { user } = useAuth();
    const [inWishlist, setInWishlist] = useState(false);
    const [wLoading, setWLoading] = useState(false);

    useEffect(() => {
        if (!user) { setInWishlist(false); return; }
        getDoc(doc(db, "users", user.uid)).then(snap => {
            if (snap.exists()) {
                const list = snap.data().wishlist || [];
                setInWishlist(list.some(g => g.id === gameId));
            }
        });
    }, [user, gameId]);

    const toggleWishlist = useCallback(async (game) => {
        if (!user) return;
        setWLoading(true);
        try {
            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);
            const current = snap.exists() ? (snap.data().wishlist || []) : [];
            const already = current.some(g => g.id === gameId);
            const next = already
                ? current.filter(g => g.id !== gameId)
                : [...current, { id: game.id, title: game.title, price: game.price, cover: game.cover }];
            await setDoc(ref, { wishlist: next }, { merge: true });
            setInWishlist(!already);
        } catch (e) {
            console.error("Wishlist toggle failed:", e);
        } finally {
            setWLoading(false);
        }
    }, [user, gameId]);

    return { inWishlist, toggleWishlist, wLoading };
}

export default function GameDetails({ params }) {
    const { gameId } = use(params);
    const { addToCart, removeFromCart, cartItems } = useCart();
    const { user } = useAuth();
    const [activeShot, setActiveShot] = useState(0);
    const { inWishlist, toggleWishlist, wLoading } = useWishlist(gameId);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwned, setIsOwned] = useState(false);
    // genres + cycling accent — must be called before any early returns
    const genres = game?.genres || [];
    const accentColor = useAccentCycle(genres);
    const inCart = cartItems?.some(item => item.id === gameId);

    useEffect(() => {
        async function fetchGame() {
            try {
                const response = await fetch(`/api/games/${gameId}`);
                const json = await response.json();
                if (json.success) {
                    setGame({ id: gameId, ...json.data });
                } else {
                    console.error("Game fetch failed:", json.error);
                }
            } catch (error) {
                console.error("Error fetching game details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchGame();
    }, [gameId]);

    // Check if user owns this game
    useEffect(() => {
        if (!user) {
            setIsOwned(false);
            return;
        }
        async function checkOwnership() {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const purchased = userDoc.data().purchased || [];
                    setIsOwned(purchased.some(g => g.id === gameId));
                }
            } catch (error) {
                console.error("Error checking ownership:", error);
            }
        }
        checkOwnership();
    }, [user, gameId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6">
                <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[10px_10px_0_#ff4500] max-w-md w-full">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neutral-900">
                        <div className="w-3 h-3 bg-primary animate-ping" />
                        <span className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-900">ACCESSING VAULT ARCHIVE</span>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-neutral-200 animate-pulse border-2 border-neutral-900" />
                        <div className="h-4 bg-neutral-100 animate-pulse w-3/4 border border-neutral-300" />
                        <div className="h-4 bg-neutral-100 animate-pulse w-1/2 border border-neutral-300" />
                        <div className="pt-4 flex items-center justify-between border-t border-neutral-200 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                            <span>DECRYPTING DATA...</span>
                            <span className="text-primary font-black animate-pulse">● READY</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6">
                <div className="bg-white p-8 md:p-12 border-4 border-neutral-900 shadow-[10px_10px_0_#ff4500] max-w-md w-full text-center">
                    <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-900 flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0_#ff4500]">
                        <span className="material-symbols-outlined text-3xl text-primary">warning</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">Record Not Found</h1>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
                        The requested title ID could not be resolved in the archive index.
                    </p>
                    <Link href="/store" className="btn-tactile inline-flex items-center justify-center gap-2 w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-3.5 text-xs font-black uppercase tracking-[0.2em] shadow-[4px_4px_0_#171717]">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Return to Store
                    </Link>
                </div>
            </div>
        );
    }

    // Hero uses bg art or cover — never screenshots (those belong in their own section)
    const heroBackground = game.bg || game.cover;
    const screenshots = game.screenshots || [];
    const activeScreenshot = screenshots[activeShot];

    return (
        <div className="bg-[#f5f5f7] text-neutral-900">

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <div
                className="relative w-full h-[58vh] md:h-[74vh] flex items-end border-b-4 border-neutral-900 overflow-hidden"
                style={{ backgroundImage: heroBackground ? `url(${heroBackground})` : "none", backgroundSize: "cover", backgroundPosition: "center top" }}
            >
                {/* layered overlays */}
                <div className="absolute inset-0 bg-neutral-950/50 z-10" />
                {/* diagonal halftone grid */}
                <div className="absolute inset-0 z-10 opacity-30"
                    style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)", backgroundSize: "12px 12px" }} />
                {/* bottom ink bleed */}
                <div className="absolute bottom-0 left-0 right-0 h-3/4 z-10"
                    style={{ background: "linear-gradient(to top, #0d0d0d 0%, #0d0d0d 15%, transparent 100%)" }} />
                {/* genre-tinted left edge */}
                <div className="absolute inset-y-0 left-0 w-1 z-10" style={{ backgroundColor: accentColor }} />

                {/* ── Cover Art Box (right side) ── */}
                {game.cover && (
                    <div className="absolute right-6 md:right-12 bottom-12 z-20 border-4 border-neutral-900 bg-neutral-900 overflow-hidden transition-all duration-300"
                        style={{ width: "clamp(140px, 18vw, 220px)", aspectRatio: "3/4", boxShadow: `8px 8px 0 ${accentColor}` }}>
                        <img
                            src={game.cover}
                            alt={`${game.title} cover`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 flex flex-col gap-2.5">
                    {/* breadcrumb */}
                    <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.25em] uppercase text-neutral-500 mb-1">
                        <Link href="/store" className="hover:text-primary transition-colors">Store</Link>
                        <span className="text-neutral-700">/</span>
                        {genres[0] && <Link href={`/store?genre=${encodeURIComponent(genres[0])}`} className="hover:text-primary transition-colors">{genres[0]}</Link>}
                        {genres[0] && <span className="text-neutral-700">/</span>}
                        <span className="text-neutral-400 truncate max-w-50">{game.title}</span>
                    </div>

                    {/* genre pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {genres.slice(0, 4).map(g => (
                            <span key={g}
                                className="px-2 py-px text-[8px] font-black tracking-[0.2em] uppercase text-white border-2 border-neutral-900"
                                style={{ backgroundColor: genreColor(g), boxShadow: "3px 3px 0 #000" }}>
                                {g}
                            </span>
                        ))}
                    </div>

                    {/* title — stacked with outline variant for depth */}
                    <div className="relative">
                        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.03em] uppercase leading-[0.88] text-white select-none"
                            style={{ textShadow: "3px 3px 0 #000, 6px 6px 0 rgba(0,0,0,0.4)" }}>
                            {game.title}
                        </h1>
                    </div>

                    {/* meta strip */}
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                        {game.developer && (
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">{game.developer}</span>
                        )}
                        {game.releaseDate && (
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">{game.releaseDate}</span>
                        )}
                        {game.rating != null && (
                            <span className="text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 border-2 border-neutral-900 text-neutral-900"
                                style={{ backgroundColor: accentColor }}>
                                ★ {typeof game.rating === "number" ? game.rating.toFixed(1) : game.rating}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Body ─────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col lg:flex-row gap-10">

                {/* ── Main column ─────────────────────────── */}
                <div className="flex-1 min-w-0 space-y-10">

                    {/* ── Trailer block (full-width, no cover duplication) ── */}
                    {game.trailer && (
                        <section className="relative border-4 border-neutral-900 shadow-[8px_8px_0_#171717] bg-black overflow-hidden">
                            <div className="aspect-video">
                                <iframe src={game.trailer} className="w-full h-full" allowFullScreen title={`${game.title} trailer`} />
                            </div>
                            {/* badge — top right, genre-colored */}
                            <div className="absolute top-0 right-0 flex items-center gap-0 z-10">
                                <div className="px-3 py-1.5 text-[9px] font-black tracking-[0.25em] uppercase text-neutral-900 border-b-4 border-l-4 border-neutral-900"
                                    style={{ backgroundColor: accentColor }}>
                                    OFFICIAL TRAILER
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ── Screenshots — lightbox + filmstrip ── */}
                    {screenshots.length > 0 && (
                        <section className="space-y-0 border-4 border-neutral-900 overflow-hidden bg-black transition-all duration-300 hover:-translate-y-0.5"
                            style={{ boxShadow: "8px 8px 0 #171717" }}>
                            {/* section header bar */}
                            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b-4 border-neutral-900">
                                <div className="flex items-center gap-2.5">
                                    <DiamondIcon color={accentColor} size={14} />
                                    <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white">Screenshots</span>
                                    <span className="text-[8px] font-bold text-neutral-600 ml-0.5">{screenshots.length} images</span>
                                </div>
                                <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 border border-neutral-700 text-neutral-400">
                                    {activeShot + 1} / {screenshots.length}
                                </span>
                            </div>

                            {/* Large active preview */}
                            <div className="relative aspect-video w-full overflow-hidden">
                                <img
                                    key={activeShot}
                                    src={activeScreenshot}
                                    alt={`Screenshot ${activeShot + 1}`}
                                    className="w-full h-full object-cover"
                                    style={{ animation: "fadeIn 0.2s ease" }}
                                />
                                {/* prev/next chevrons */}
                                {screenshots.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveShot(i => (i - 1 + screenshots.length) % screenshots.length)}
                                            className="btn-tactile absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-900/90 border-2 border-neutral-700 text-white flex items-center justify-center hover:bg-primary hover:border-neutral-900 hover:text-neutral-900 text-lg font-black shadow-[2px_2px_0_#000]"
                                            aria-label="Previous screenshot">
                                            ‹
                                        </button>
                                        <button
                                            onClick={() => setActiveShot(i => (i + 1) % screenshots.length)}
                                            className="btn-tactile absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-900/90 border-2 border-neutral-700 text-white flex items-center justify-center hover:bg-primary hover:border-neutral-900 hover:text-neutral-900 text-lg font-black shadow-[2px_2px_0_#000]"
                                            aria-label="Next screenshot">
                                            ›
                                        </button>
                                    </>
                                )}
                                {/* shot index badge */}
                                <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-neutral-900/80 border border-neutral-700 text-[8px] font-black uppercase tracking-widest text-white">
                                    {activeShot + 1} / {screenshots.length}
                                </div>
                            </div>

                            {/* Filmstrip thumbnails */}
                            {screenshots.length > 1 && (
                                <div className="flex gap-0 border-t-4 border-neutral-900 overflow-x-auto"
                                    style={{ scrollbarWidth: "none" }}>
                                    {screenshots.map((src, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveShot(i)}
                                            className="relative shrink-0 h-16 aspect-video overflow-hidden border-r-2 border-neutral-800 transition-all"
                                            style={{
                                                outline: activeShot === i ? `3px solid ${accentColor}` : "none",
                                                outlineOffset: "-3px",
                                            }}
                                        >
                                            <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                                            {activeShot !== i && (
                                                <div className="absolute inset-0 bg-neutral-900/50 hover:bg-transparent transition-colors" />
                                            )}
                                            {/* active marker dot */}
                                            {activeShot === i && (
                                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5"
                                                    style={{ backgroundColor: accentColor }} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* ── About ── */}
                    <section className="bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b-4 border-neutral-900"
                            style={{ background: `linear-gradient(90deg, ${accentColor}18 0%, transparent 55%)` }}>
                            <DiamondIcon color={accentColor} size={14} />
                            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase">About This Game</h2>
                        </div>
                        <div className="p-6 text-sm leading-[1.9] text-neutral-600 font-medium">
                            {game.description || "No description available."}
                        </div>
                    </section>

                    {/* ── System Requirements ── */}
                    {game.systemRequirements && (
                        <section className="bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] overflow-hidden">
                            <div className="flex items-center gap-3 px-5 py-3.5 bg-neutral-900 border-b-4 border-neutral-900">
                                <DiamondIcon color={accentColor} size={14} />
                                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-white">System Requirements</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-6 border-b-4 md:border-b-0 md:border-r-4 border-neutral-900">
                                    <p className="text-[8px] font-black tracking-widest uppercase bg-neutral-900 text-white inline-block px-2 py-0.5 mb-4">MINIMUM</p>
                                    <ul className="space-y-3 text-xs font-medium">
                                        {[["OS", game.systemRequirements.minOS], ["CPU", game.systemRequirements.minCPU], ["RAM", game.systemRequirements.minRAM], ["GPU", game.systemRequirements.minGPU]].map(([k, v]) => (
                                            <li key={k} className="flex flex-col gap-0.5 pb-2 border-b border-neutral-100 last:border-0 last:pb-0">
                                                <span className="text-[8px] font-black tracking-widest uppercase text-neutral-400">{k}</span>
                                                <span>{v || "—"}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-6" style={{ background: `${accentColor}08` }}>
                                    <p className="text-[8px] font-black tracking-widest uppercase border-2 border-neutral-900 inline-block px-2 py-0.5 mb-4"
                                        style={{ backgroundColor: accentColor }}>RECOMMENDED</p>
                                    <ul className="space-y-3 text-xs font-medium">
                                        {[["OS", "Windows 10/11 64-bit"], ["CPU", "Modern quad-core or better"], ["RAM", "16 GB RAM"], ["GPU", "RTX 3060 / RX 6600 XT"]].map(([k, v]) => (
                                            <li key={k} className="flex flex-col gap-0.5 pb-2 border-b border-neutral-100 last:border-0 last:pb-0">
                                                <span className="text-[8px] font-black tracking-widest uppercase text-neutral-400">{k}</span>
                                                <span className="font-bold">{v}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* ── Sidebar ──────────────────────────────── */}
                <aside className="w-full lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24 self-start">

                    {/* ── Purchase / Play card ── */}
                    <div className="group/card border-4 border-neutral-900 bg-white transition-all duration-300 hover:-translate-y-1 hover:!border-primary overflow-hidden"
                        style={{ boxShadow: "8px 8px 0 #171717" }}>
                        
                        {isOwned ? (
                            /* ── OWNED - PLAY NOW ── */
                            <>
                                <div className="px-5 py-6 flex flex-col items-center justify-center gap-3 relative"
                                    style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 100%)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15), inset 0 0 8px rgba(255,255,255,0.1)" }}>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary animate-pulse"></span>
                                        <p className="text-[8px] font-black tracking-[0.3em] uppercase text-primary">In Your Library</p>
                                    </div>
                                    {game.rating != null && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <p className="text-[7px] font-bold tracking-[0.35em] uppercase text-neutral-600">Score</p>
                                                <div className="border-2 border-neutral-700 px-2.5 py-1"
                                                    style={{ backgroundColor: `${accentColor}22` }}>
                                                    <span className="text-xl font-black font-mono leading-none"
                                                        style={{ color: accentColor }}>
                                                        {typeof game.rating === "number" ? game.rating.toFixed(1) : game.rating}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="h-1 border-y-2 border-neutral-900 transition-colors duration-700"
                                    style={{ backgroundColor: accentColor }} />

                                <div className="p-4">
                                    <button
                                        className="btn-tactile group w-full border-4 border-neutral-900 py-4 text-[11px] font-black tracking-[0.25em] uppercase flex items-center justify-center gap-2.5 bg-primary text-neutral-900 shadow-[6px_6px_0_#171717] hover:shadow-[8px_8px_0_#171717]"
                                    >
                                        <span className="material-symbols-outlined text-xl transition-transform duration-200 group-hover:scale-125">play_arrow</span>
                                        Play Now
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* ── NOT OWNED - PURCHASE OPTIONS ── */
                            <>
                                {/* Dark price header */}
                                <div className="px-5 py-5 flex items-end justify-between relative"
                                    style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 100%)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15), inset 0 0 8px rgba(255,255,255,0.1)" }}>
                                    <div>
                                        <p className="text-[7px] font-bold tracking-[0.35em] uppercase text-neutral-600 mb-1.5">Base Price</p>
                                        <p className="text-[2.6rem] font-black font-mono text-white leading-none tracking-tight">${(game.price || 0).toFixed(2)}</p>
                                    </div>
                                    {game.rating != null && (
                                        <div className="flex flex-col items-end gap-1">
                                            <p className="text-[7px] font-bold tracking-[0.35em] uppercase text-neutral-600">Score</p>
                                            <div className="border-2 border-neutral-700 px-2.5 py-1"
                                                style={{ backgroundColor: `${accentColor}22` }}>
                                                <span className="text-xl font-black font-mono leading-none"
                                                    style={{ color: accentColor }}>
                                                    {typeof game.rating === "number" ? game.rating.toFixed(1) : game.rating}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Accent separator strip — cycles with genre color */}
                                <div className="h-1 border-y-2 border-neutral-900 transition-colors duration-700"
                                    style={{ backgroundColor: accentColor }} />

                                <div className="p-4 space-y-3">
                                    {/* Add / Remove cart — with icon micro-interaction */}
                                    <button
                                        onClick={() => inCart ? removeFromCart(gameId) : addToCart(game)}
                                        className={`btn-tactile group w-full border-4 border-neutral-900 py-3.5 text-[10px] font-black tracking-[0.25em] uppercase flex items-center justify-center gap-2
                                            ${inCart
                                                ? "bg-neutral-900 text-white shadow-[4px_4px_0_#ff4500] hover:shadow-[6px_6px_0_#ff4500]"
                                                : "bg-primary text-neutral-900 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717]"}`}
                                    >
                                        <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:scale-125">{inCart ? "remove_shopping_cart" : "shopping_cart"}</span>
                                        {inCart ? "Remove from Cart" : "Add to Cart"}
                                    </button>

                                    {/* Wishlist */}
                                    {user ? (
                                        <button
                                            onClick={() => toggleWishlist(game)}
                                            disabled={wLoading}
                                            className={`btn-tactile group w-full border-4 border-neutral-900 py-3 text-[10px] font-black tracking-[0.25em] uppercase flex items-center justify-center gap-2
                                                ${inWishlist
                                                    ? "bg-neutral-900 text-white shadow-[2px_2px_0_#ff4500] hover:shadow-[4px_4px_0_#ff4500]"
                                                    : "bg-white text-neutral-900 shadow-[2px_2px_0_#171717] hover:bg-neutral-50 hover:shadow-[4px_4px_0_#171717]"}`}
                                        >
                                            <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:scale-110">{inWishlist ? "favorite" : "favorite_border"}</span>
                                            {wLoading ? "···" : inWishlist ? "In Wishlist" : "Add to Wishlist"}
                                        </button>
                                    ) : (
                                        <Link href="/login"
                                            className="btn-tactile w-full border-4 border-dashed border-neutral-300 bg-transparent text-neutral-400 py-3 text-[9px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:border-neutral-900 hover:text-neutral-900 shadow-[2px_2px_0_transparent] hover:shadow-[3px_3px_0_#171717]">
                                            <span className="material-symbols-outlined text-sm">lock</span>
                                            Sign in to Wishlist
                                        </Link>
                                    )}

                                    {/* in-cart nudge */}
                                    {inCart && (
                                        <div className="flex items-center gap-2 border-2 border-neutral-900 px-3 py-2 transition-colors duration-700"
                                            style={{ backgroundColor: `${accentColor}15`, borderLeftColor: accentColor, borderLeftWidth: 4 }}>
                                            <span className="material-symbols-outlined text-sm" style={{ color: accentColor }}>check_circle</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: accentColor }}>In your cart</span>
                                            <Link href="/cart" className="ml-auto text-[8px] font-black uppercase tracking-widest underline hover:opacity-70 transition-opacity" style={{ color: accentColor }}>View →</Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── Game Info ── */}
                    <div className="border-4 border-neutral-900 bg-white shadow-[6px_6px_0_#171717] overflow-hidden">
                        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 border-b-4 border-neutral-900">
                            <DiamondIcon color={accentColor} size={13} />
                            <h3 className="text-[8px] font-black tracking-[0.3em] uppercase text-white">Game Info</h3>
                        </div>

                        <ul className="divide-y-2 divide-neutral-100">
                            {[
                                ["Developer", game.developer],
                                ["Publisher", game.publisher],
                                ["Release", game.releaseDate],
                            ].filter(([, v]) => v).map(([label, value]) => (
                                <li key={label} className="px-4 py-2.5 flex items-baseline justify-between gap-3">
                                    <span className="text-[7px] font-bold tracking-widest uppercase text-neutral-400 shrink-0">{label}</span>
                                    <span className="text-[10px] font-bold text-right leading-snug">{value}</span>
                                </li>
                            ))}
                            {genres.length > 0 && (
                                <li className="px-4 py-3">
                                    <p className="text-[7px] font-bold tracking-[0.3em] uppercase text-neutral-400 mb-2">Genres</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {genres.map(g => (
                                            <span key={g}
                                                className="px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-white border-2 border-neutral-900"
                                                style={{ backgroundColor: genreColor(g), boxShadow: "2px 2px 0 #000" }}>
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* ── Platforms ── */}
                    {game.platforms && game.platforms.length > 0 && (
                        <div className="border-4 border-neutral-900 overflow-hidden shadow-[4px_4px_0_#171717]"
                            style={{ background: "#111" }}>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 border-b-4 border-neutral-800">
                                <DiamondIcon color={accentColor} size={13} />
                                <h3 className="text-[8px] font-black tracking-[0.3em] uppercase text-white">Platforms</h3>
                            </div>
                            <ul className="p-3 space-y-px">
                                {game.platforms.map(p => (
                                    <li key={p} className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-white py-1.5 border-b border-neutral-800 last:border-0">
                                        <span className="w-2 h-2 rotate-45 inline-block shrink-0 border border-neutral-700" style={{ backgroundColor: accentColor }} />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </aside>
            </div>

            {/* Fade-in keyframe for screenshot transitions */}
            <style>{`@keyframes fadeIn { from { opacity: 0.4; transform: scale(1.01); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
    );
}
