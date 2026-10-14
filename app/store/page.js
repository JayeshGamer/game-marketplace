"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

// ── Genre colour palette — covers all IGDB genres + common themes ────────────
const GENRE_COLORS = {
    // IGDB canonical genres
    "action":                       "#dc2626",
    "adventure":                    "#16a34a",
    "shooter":                      "#2563eb",
    "role-playing (rpg)":           "#7c3aed",
    "rpg":                          "#7c3aed",
    "strategy":                     "#d97706",
    "sport":                        "#65a30d",
    "sports":                       "#65a30d",
    "horror":                       "#be123c",
    "puzzle":                       "#0891b2",
    "racing":                       "#ca8a04",
    "fighting":                     "#c2460a",
    "platform":                     "#db2777",
    "platformer":                   "#db2777",
    "simulator":                    "#0d9488",
    "simulation":                   "#0d9488",
    "indie":                        "#6366f1",
    "arcade":                       "#f59e0b",
    "moba":                         "#0ea5e9",
    "hack and slash/beat 'em up":   "#e11d48",
    "hack and slash":               "#e11d48",
    "beat 'em up":                  "#e11d48",
    "music":                        "#9333ea",
    "real time strategy (rts)":     "#b45309",
    "turn-based strategy (tbs)":    "#a16207",
    "tactical":                     "#475569",
    "visual novel":                 "#ec4899",
    "point-and-click":              "#0284c7",
    "quiz/trivia":                  "#7c3aed",
    "pinball":                      "#f97316",
    "card & board game":            "#84cc16",
    "card game":                    "#84cc16",
    "board game":                   "#84cc16",
    "shoot 'em up":                 "#3b82f6",
    // IGDB themes (often stored in genres array)
    "open world":                   "#10b981",
    "dark fantasy":                 "#6d28d9",
    "fantasy":                      "#8b5cf6",
    "science fiction":              "#06b6d4",
    "sci-fi":                       "#06b6d4",
    "cyberpunk":                    "#eab308",
    "stealth":                      "#374151",
    "survival":                     "#65a30d",
    "survival horror":              "#be123c",
    "post-apocalyptic":             "#78350f",
    "historical":                   "#92400e",
    "western":                      "#b45309",
    "crime":                        "#9f1239",
    "thriller":                     "#4b5563",
    "mystery":                      "#1e3a5f",
    "comedy":                       "#f59e0b",
    "romance":                      "#f43f5e",
    "drama":                        "#7f1d1d",
    "war":                          "#57534e",
    "military":                     "#4d7c0f",
    "space":                        "#1e3a5f",
    "mythology":                    "#92400e",
    "medieval":                     "#713f12",
    "anime":                        "#f43f5e",
    "sandbox":                      "#059669",
    "battle royale":                "#dc2626",
    "mmo":                          "#0369a1",
    "mmorpg":                       "#0369a1",
    "co-op":                        "#16a34a",
    "multiplayer":                  "#2563eb",
    "soulslike":                    "#44403c",
    "rogue-like":                   "#64748b",
    "roguelike":                    "#64748b",
    "metroidvania":                 "#7c3aed",
    "tower defense":                "#d97706",
    "management":                   "#0891b2",
    "city builder":                 "#0284c7",
    "dating sim":                   "#db2777",
    "educational":                  "#16a34a",
    "third-person shooter":         "#2563eb",
    "first-person shooter":         "#1d4ed8",
    "action-adventure":             "#ea580c",
    "action adventure":             "#ea580c",
};
function genreColor(name = "") {
    return GENRE_COLORS[name.toLowerCase().trim()] ?? "#525252";
}

const PRICE_BUCKETS = [
    { label: "Free",       fn: (p) => p === 0 },
    { label: "Under $20",  fn: (p) => p > 0 && p < 20 },
    { label: "$20 – $40",  fn: (p) => p >= 20 && p < 40 },
    { label: "$40 – $60",  fn: (p) => p >= 40 && p < 60 },
    { label: "Over $60",   fn: (p) => p >= 60 },
];

const SORT_OPTIONS = [
    { value: "title_asc",   label: "Title A → Z" },
    { value: "title_desc",  label: "Title Z → A" },
    { value: "price_asc",   label: "Price ↑" },
    { value: "price_desc",  label: "Price ↓" },
    { value: "rating_desc", label: "Highest Rated" },
];

export default function StoreCatalog() {
    const searchParams = useSearchParams();
    const [games, setGames]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState("");
    const [activeGenres, setActiveGenres] = useState([]);
    const [activePrices, setActivePrices] = useState([]);
    const [sort, setSort]                 = useState("title_asc");
    const [sortOpen, setSortOpen]         = useState(false);
    const [viewMode, setViewMode]         = useState("featured"); // "featured" or "catalog"
    const sortRef = useRef(null);

    // Check if we need to go directly to catalog view
    useEffect(() => {
        const genre = searchParams.get("genre");
        if (genre) {
            setViewMode("catalog");
            setActiveGenres([genre.toLowerCase()]);
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchGames() {
            try {
                const q = query(collection(db, "games"), orderBy("title", "asc"));
                const snap = await getDocs(q);
                const loaded = [];
                snap.forEach((doc) => loaded.push({ id: doc.id, ...doc.data() }));
                setGames(loaded);
            } catch (e) {
                console.error("Failed to load games:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchGames();
    }, []);

    // close sort dropdown on outside click
    useEffect(() => {
        function handle(e) { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    // Derive genre list — normalize to lowercase for consistent matching
    const allGenres = useMemo(() => {
        const set = new Set();
        games.forEach(g => g.genres?.forEach(genre => set.add(genre.toLowerCase().trim())));
        return Array.from(set).sort();
    }, [games]);

    // Filtered + sorted
    const filtered = useMemo(() => {
        let result = [...games];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(g =>
                g.title?.toLowerCase().includes(q) ||
                g.developer?.toLowerCase().includes(q) ||
                g.genres?.some(genre => genre.toLowerCase().includes(q))
            );
        }
        if (activeGenres.length) {
            // case-insensitive: normalize game genres on compare
            result = result.filter(g =>
                g.genres?.some(genre => activeGenres.includes(genre.toLowerCase().trim()))
            );
        }
        if (activePrices.length) {
            result = result.filter(g => {
                const p = g.price ?? 0;
                return activePrices.some(label => PRICE_BUCKETS.find(b => b.label === label)?.fn(p));
            });
        }
        result.sort((a, b) => {
            if (sort === "title_asc")   return (a.title ?? "").localeCompare(b.title ?? "");
            if (sort === "title_desc")  return (b.title ?? "").localeCompare(a.title ?? "");
            if (sort === "price_asc")   return (a.price ?? 0) - (b.price ?? 0);
            if (sort === "price_desc")  return (b.price ?? 0) - (a.price ?? 0);
            if (sort === "rating_desc") return (b.rating ?? 0) - (a.rating ?? 0);
            return 0;
        });
        return result;
    }, [games, search, activeGenres, activePrices, sort]);

    function toggleGenre(g) {
        setActiveGenres(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g]);
    }
    function togglePrice(label) {
        setActivePrices(p => p.includes(label) ? p.filter(x => x !== label) : [...p, label]);
    }
    function clearAll() { setActiveGenres([]); setActivePrices([]); setSearch(""); }

    const activeCount = activeGenres.length + activePrices.length;

    // Featured sections data
    const featuredGame = useMemo(() => {
        const highRated = games.filter(g => (g.rating ?? 0) > 85);
        return highRated[Math.floor(Math.random() * highRated.length)] || games[0];
    }, [games]);

    const popularGames = useMemo(() => {
        return [...games]
            .filter(g => (g.rating ?? 0) > 75)
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 12);
    }, [games]);

    const newReleases = useMemo(() => {
        return [...games]
            .sort((a, b) => {
                const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
                const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, 12);
    }, [games]);

    const sportGames = useMemo(() => {
        return games.filter(g => 
            g.genres?.some(genre => 
                genre.toLowerCase().includes('sport') || 
                genre.toLowerCase().includes('racing') ||
                g.title.toLowerCase().includes('fifa') ||
                g.title.toLowerCase().includes('fc ') ||
                g.title.toLowerCase().includes('nba') ||
                g.title.toLowerCase().includes('nfl') ||
                g.title.toLowerCase().includes('f1')
            )
        ).slice(0, 12);
    }, [games]);

    const actionGames = useMemo(() => {
        return games.filter(g => 
            g.genres?.some(genre => 
                genre.toLowerCase().includes('action') || 
                genre.toLowerCase().includes('shooter')
            )
        ).slice(0, 12);
    }, [games]);

    const adventureGames = useMemo(() => {
        return games.filter(g => 
            g.genres?.some(genre => genre.toLowerCase().includes('adventure'))
        ).slice(0, 12);
    }, [games]);

    const rpgGames = useMemo(() => {
        return games.filter(g => 
            g.genres?.some(genre => 
                genre.toLowerCase().includes('rpg') || 
                genre.toLowerCase().includes('role-playing')
            )
        ).slice(0, 12);
    }, [games]);

    return (
        <div className="min-h-screen bg-[#f5f5f7] text-neutral-900 font-display pt-28">

            {viewMode === "featured" ? (
                /* ══════════════════════════════════════════════════════════════════════
                   FEATURED VIEW - Homepage-style with sections
                   ══════════════════════════════════════════════════════════════════════ */
                <>
                    {/* Hero Banner */}
                    {featuredGame && (
                        <div className="relative h-[70vh] md:h-[80vh] overflow-hidden border-b-4 border-neutral-900">
                            {/* Background */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${featuredGame.bg || featuredGame.cover})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/70 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                            
                            {/* Content */}
                            <div className="relative z-10 h-full max-w-7xl mx-auto px-8 md:px-12 flex flex-col justify-end pb-20">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 bg-primary animate-pulse" />
                                        <span className="text-[9px] font-black tracking-[0.3em] uppercase text-primary">Featured</span>
                                    </div>
                                    
                                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-white mb-6"
                                        style={{ textShadow: "4px 4px 0 #000" }}>
                                        {featuredGame.title}
                                    </h1>
                                    
                                    {featuredGame.genres && featuredGame.genres.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {featuredGame.genres.slice(0, 3).map((genre, i) => (
                                                <span key={i} 
                                                    className="px-3 py-1 text-[9px] font-black tracking-widest uppercase text-white border-2 border-white/30 backdrop-blur-sm"
                                                    style={{ backgroundColor: genreColor(genre) + '99' }}>
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <p className="text-sm font-bold text-neutral-300 leading-relaxed mb-8 line-clamp-3">
                                        {featuredGame.description || "Experience the ultimate gaming adventure."}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <Link href={`/store/${featuredGame.id}`}
                                            className="btn-tactile bg-primary border-4 border-neutral-900 text-neutral-900 px-8 py-4 text-[11px] font-black tracking-[0.25em] uppercase shadow-[6px_6px_0_#171717] hover:shadow-[8px_8px_0_#171717] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#171717] flex items-center gap-2">
                                            <span className="material-symbols-outlined text-base">play_arrow</span>
                                            View Details
                                        </Link>
                                        <button 
                                            onClick={() => setViewMode("catalog")}
                                            className="btn-tactile bg-white/10 backdrop-blur-sm border-4 border-white/30 text-white px-8 py-4 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-white/20 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-base">grid_view</span>
                                            Browse All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Stats Bar */}
                    <div className="bg-neutral-900 border-b-4 border-neutral-900 py-8">
                        <div className="max-w-7xl mx-auto px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Games", value: games.length, icon: "videogame_asset" },
                                { label: "New This Week", value: newReleases.length, icon: "new_releases" },
                                { label: "Top Rated", value: popularGames.length, icon: "star" },
                                { label: "Genres", value: allGenres.length, icon: "category" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-neutral-950 border-2 border-neutral-800 p-4 shadow-[4px_4px_0_#000000] text-center hover:border-primary/60 transition-colors group">
                                    <span className="material-symbols-outlined text-2xl text-primary mb-1.5 block group-hover:scale-110 transition-transform">{stat.icon}</span>
                                    <div className="text-3xl md:text-4xl font-black font-mono text-white mb-1 tabular-nums">{String(stat.value).padStart(3, '0')}</div>
                                    <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-neutral-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sections Container */}
                    <div className="max-w-screen-2xl mx-auto py-12 space-y-16">
                        
                        {/* Popular Games */}
                        {popularGames.length > 0 && (
                            <GameSection 
                                title="Popular Games" 
                                subtitle="Top Rated Titles"
                                icon="trending_up"
                                games={popularGames}
                                accentColor="#ff4500"
                            />
                        )}

                        {/* New Releases */}
                        {newReleases.length > 0 && (
                            <GameSection 
                                title="New Releases" 
                                subtitle="Latest Additions"
                                icon="new_releases"
                                games={newReleases}
                                accentColor="#22c55e"
                            />
                        )}

                        {/* Sports & Racing */}
                        {sportGames.length > 0 && (
                            <GameSection 
                                title="Sports & Racing" 
                                subtitle="FIFA, F1, NBA & More"
                                icon="sports_soccer"
                                games={sportGames}
                                accentColor="#eab308"
                            />
                        )}

                        {/* Action & Shooter */}
                        {actionGames.length > 0 && (
                            <GameSection 
                                title="Action & Shooter" 
                                subtitle="High-Octane Gameplay"
                                icon="explosion"
                                games={actionGames}
                                accentColor="#dc2626"
                            />
                        )}

                        {/* Adventure */}
                        {adventureGames.length > 0 && (
                            <GameSection 
                                title="Adventure" 
                                subtitle="Epic Journeys Await"
                                icon="explore"
                                games={adventureGames}
                                accentColor="#16a34a"
                            />
                        )}

                        {/* RPG */}
                        {rpgGames.length > 0 && (
                            <GameSection 
                                title="Role-Playing Games" 
                                subtitle="Deep Story Experiences"
                                icon="auto_stories"
                                games={rpgGames}
                                accentColor="#7c3aed"
                            />
                        )}

                        {/* Browse All CTA */}
                        <div className="px-8 md:px-12">
                            <div className="bg-white border-4 border-neutral-900 p-12 text-center shadow-[12px_12px_0_#171717]">
                                <div className="max-w-2xl mx-auto">
                                    <div className="w-16 h-16 bg-primary border-4 border-neutral-900 mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0_#171717]">
                                        <span className="material-symbols-outlined text-3xl text-neutral-900">grid_view</span>
                                    </div>
                                    <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Explore Full Catalog</h2>
                                    <p className="text-sm font-bold text-neutral-600 mb-8 leading-relaxed">
                                        Browse our complete collection of {games.length}+ games with advanced filters, 
                                        sorting options, and detailed search.
                                    </p>
                                    <button 
                                        onClick={() => setViewMode("catalog")}
                                        className="btn-tactile inline-flex items-center gap-3 bg-neutral-900 border-4 border-neutral-900 text-white px-10 py-5 text-[11px] font-black tracking-[0.25em] uppercase shadow-[6px_6px_0_#ff4500] hover:shadow-[8px_8px_0_#ff4500] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#ff4500]">
                                        <span className="material-symbols-outlined text-lg">storefront</span>
                                        Browse All Games
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* ══════════════════════════════════════════════════════════════════════
                   CATALOG VIEW - Original filterable grid
                   ══════════════════════════════════════════════════════════════════════ */
                <>
                    {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
                    <div className="pt-12 pb-0 px-8 md:px-12 lg:px-16 border-b-4 border-neutral-900">
                        {/* Back to Featured */}
                        <button 
                            onClick={() => { setViewMode("featured"); clearAll(); }}
                            className="btn-tactile flex items-center gap-2 text-[10px] font-black tracking-[0.25em] uppercase text-neutral-500 hover:text-primary active:scale-98 mb-6 group">
                            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            Back to Featured
                        </button>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em] uppercase text-neutral-500 mb-8">
                            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
                            <span className="text-neutral-400">/</span>
                            <span className="text-neutral-900">CATALOG</span>
                        </div>

                        {/* Title + counter */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase leading-none text-neutral-900">
                                    CATALOG
                                </h1>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-1 pb-2">
                                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Titles indexed</span>
                                <span className="text-5xl font-black font-mono text-primary tracking-tighter tabular-nums">
                                    {loading ? "—" : String(games.length).padStart(3, "0")}
                                </span>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="flex items-center border-4 border-neutral-900 bg-white focus-within:shadow-[4px_4px_0_#ff4500] transition-shadow duration-150 -mx-1 mb-0 shadow-[4px_4px_0_#171717]">
                            <span className="material-symbols-outlined text-neutral-400 text-xl px-4 shrink-0">search</span>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search titles, developers, genres…"
                                className="flex-1 bg-transparent py-4 text-neutral-900 placeholder-neutral-400 text-[13px] font-bold tracking-wide outline-none font-mono"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="material-symbols-outlined text-neutral-400 hover:text-primary text-xl px-4 transition-colors">
                                    close
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── MAIN LAYOUT ──────────────────────────────────────────────── */}
                    <div className="flex flex-col lg:flex-row px-8 md:px-12 lg:px-16 pt-8 pb-24 gap-10">

                        {/* ── SIDEBAR ──────────────────────────────────────────────── */}
                        <aside className="w-full lg:w-56 shrink-0">
                            <div className="sticky top-24">
                                {/* Filter header */}
                                <div className="flex items-center justify-between border-b-4 border-neutral-900 pb-4 mb-6">
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-900 flex items-center gap-2">
                                        FILTERS
                                        {activeCount > 0 && (
                                            <span className="bg-primary text-neutral-900 border-2 border-neutral-900 px-1.5 py-0 text-[9px] font-black tabular-nums leading-4 shadow-[2px_2px_0_#171717]">
                                                {activeCount}
                                            </span>
                                        )}
                                    </span>
                                    {activeCount > 0 && (
                                        <button onClick={clearAll} className="text-[9px] font-black tracking-widest uppercase text-neutral-500 hover:text-primary transition-colors">
                                            RESET
                                        </button>
                                    )}
                                </div>

                                {/* Genre */}
                                <FilterBlock title="GENRE">
                                    {allGenres.map(genre => {
                                        const color = genreColor(genre);
                                        const active = activeGenres.includes(genre);
                                        return (
                                            <button key={genre} onClick={() => toggleGenre(genre)}
                                                className="flex items-center gap-2.5 py-1.5 w-full text-left group"
                                            >
                                                {/* Diamond: colored border always; filled + white inner dot when active */}
                                                <div
                                                    className={`w-3.5 h-3.5 rotate-45 shrink-0 transition-all duration-150 flex items-center justify-center border-2 ${active ? "scale-125" : "group-hover:scale-110"}`}
                                                    style={{
                                                        borderColor: color,
                                                        backgroundColor: active ? color : "transparent",
                                                    }}
                                                >
                                                    {active && <div className="w-1.5 h-1.5 bg-white" />}
                                                </div>
                                                <span
                                                    className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-150 leading-none ${active ? "font-black" : "text-neutral-500 group-hover:text-neutral-900"}`}
                                                    style={active ? { color } : {}}
                                                >
                                                    {genre}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </FilterBlock>

                                {/* Price */}
                                <FilterBlock title="PRICE">
                                    {PRICE_BUCKETS.map(bucket => {
                                        const active = activePrices.includes(bucket.label);
                                        return (
                                            <button key={bucket.label} onClick={() => togglePrice(bucket.label)}
                                                className="flex items-center gap-2.5 py-1.5 w-full text-left group"
                                            >
                                                <div className={`w-3.5 h-3.5 border-2 border-neutral-900 shrink-0 transition-all flex items-center justify-center shadow-[1px_1px_0_#171717] ${active ? "bg-primary" : "bg-white group-hover:bg-primary/10"}`}>
                                                    {active && <span className="text-[8px] text-neutral-900 font-black leading-none">✓</span>}
                                                </div>
                                                <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${active ? "text-neutral-900 font-black" : "text-neutral-500 group-hover:text-neutral-800"}`}>
                                                    {bucket.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </FilterBlock>
                            </div>
                        </aside>

                        {/* ── PRODUCT GRID ─────────────────────────────────────────── */}
                        <main className="flex-1 min-w-0">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between border-b-4 border-neutral-900 pb-4 mb-8">
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
                                    {loading ? "LOADING…" : (
                                        <><span className="text-neutral-900 font-black">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}</>
                                    )}
                                </span>

                                {/* Sort */}
                                <div className="relative" ref={sortRef}>
                                    <button
                                        onClick={() => setSortOpen(!sortOpen)}
                                        className="btn-tactile flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-neutral-600 hover:text-neutral-900 border-4 border-neutral-900 bg-white hover:bg-neutral-100 px-3 py-1.5 shadow-[3px_3px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#171717]"
                                    >
                                        <span className="material-symbols-outlined text-[13px]">sort</span>
                                        {SORT_OPTIONS.find(o => o.value === sort)?.label}
                                        <span className="material-symbols-outlined text-[13px]">{sortOpen ? "expand_less" : "expand_more"}</span>
                                    </button>
                                    {sortOpen && (
                                        <div className="absolute right-0 top-full mt-1 bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#ff4500] z-50 min-w-40">
                                            {SORT_OPTIONS.map(opt => (
                                                <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-[10px] font-black tracking-widest uppercase transition-colors border-b-2 border-neutral-100 last:border-b-0 hover:bg-primary hover:text-neutral-900 ${sort === opt.value ? "text-primary bg-neutral-50" : "text-neutral-600"}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Active filter chips */}
                            {activeCount > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <span className="text-[9px] font-black tracking-widest uppercase text-neutral-400">ACTIVE:</span>
                                    {activeGenres.map(g => {
                                        const chipColor = genreColor(g);
                                        return (
                                            <button key={g} onClick={() => toggleGenre(g)}
                                                className="btn-tactile flex items-center gap-1.5 px-2 py-1 text-[9px] font-black tracking-widest uppercase text-white border-2 border-neutral-900 shadow-[2px_2px_0_#171717] hover:scale-105 active:scale-95"
                                                style={{ backgroundColor: chipColor }}
                                            >
                                                <div className="w-1.5 h-1.5 rotate-45 bg-white/50 border border-white/40 shrink-0" />
                                                {g}
                                                <span className="material-symbols-outlined text-[10px] ml-0.5 opacity-80">close</span>
                                            </button>
                                        );
                                    })}
                                    {activePrices.map(p => (
                                        <button key={p} onClick={() => togglePrice(p)}
                                            className="btn-tactile flex items-center gap-1 px-2 py-0.5 text-[9px] font-black tracking-widest uppercase text-neutral-900 bg-white border-2 border-primary hover:bg-primary shadow-[2px_2px_0_#ff4500] active:scale-95 transition-colors"
                                        >
                                            {p} <span className="material-symbols-outlined text-[10px] ml-0.5">close</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Grid */}
                            {loading ? (
                                <LoadingSkeleton />
                            ) : filtered.length === 0 ? (
                                <div className="border-4 border-neutral-900 bg-white p-16 text-center shadow-[8px_8px_0_#171717]">
                                    <div className="text-5xl font-black tracking-tighter text-neutral-200 uppercase mb-4">0 RESULTS</div>
                                    <p className="text-neutral-400 font-bold tracking-widest uppercase text-[10px]">No titles match your filters.</p>
                                    <button onClick={clearAll} className="btn-tactile mt-6 border-4 border-neutral-900 bg-primary px-6 py-2 text-[10px] font-black tracking-widest uppercase text-neutral-900 hover:shadow-[6px_6px_0_#171717] shadow-[4px_4px_0_#171717] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_#171717]">
                                        CLEAR FILTERS
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filtered.map((game, i) => (
                                        <GameCard key={game.id} game={game} index={i} />
                                    ))}
                                </div>
                            )}
                        </main>
                    </div>
                </>
            )}
        </div>
    );
}


// ── FilterBlock ──────────────────────────────────────────────────────────────
function FilterBlock({ title, children }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="mb-6 border-b-4 border-neutral-900 pb-5">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-3 group">
                <span className="text-[9px] font-black tracking-widest uppercase text-neutral-500 group-hover:text-neutral-900 transition-colors">{title}</span>
                <span className="material-symbols-outlined text-neutral-400 text-[16px] group-hover:text-primary transition-colors">{open ? "remove" : "add"}</span>
            </button>
            {open && <div className="flex flex-col gap-0.5">{children}</div>}
        </div>
    );
}

// ── GameSection: Horizontal scrolling section ────────────────────────────────
function GameSection({ title, subtitle, icon, games, accentColor = "#ff4500" }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="px-8 md:px-12">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-6 border-b-4 border-neutral-900 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-900 border-4 flex items-center justify-center" 
                        style={{ borderColor: accentColor, boxShadow: `4px 4px 0 ${accentColor}` }}>
                        <span className="material-symbols-outlined text-2xl" style={{ color: accentColor }}>{icon}</span>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">{title}</h2>
                        <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 mt-1">{subtitle}</p>
                    </div>
                </div>
                
                {/* Scroll Buttons */}
                <div className="hidden md:flex items-center gap-2.5">
                    <button 
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                        className="btn-tactile w-10 h-10 bg-white border-3 border-neutral-900 flex items-center justify-center hover:bg-neutral-900 hover:text-white shadow-[3px_3px_0_#171717] hover:shadow-[4px_4px_0_#171717]">
                        <span className="material-symbols-outlined text-base font-black">chevron_left</span>
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                        className="btn-tactile w-10 h-10 bg-white border-3 border-neutral-900 flex items-center justify-center hover:bg-neutral-900 hover:text-white shadow-[3px_3px_0_#171717] hover:shadow-[4px_4px_0_#171717]">
                        <span className="material-symbols-outlined text-base font-black">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Scrolling Container */}
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {games.map((game, idx) => (
                    <HorizontalGameCard key={game.id} game={game} accentColor={accentColor} index={idx} />
                ))}
            </div>
        </div>
    );
}

// ── HorizontalGameCard: For scrolling sections ───────────────────────────────
function HorizontalGameCard({ game, accentColor, index }) {
    const genres = game.genres ?? [];
    const rating = game.rating ? Math.round(game.rating) : null;

    return (
        <Link
            href={`/store/${game.id}`}
            className="card-lift group shrink-0 w-60 snap-start flex flex-col bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] hover:shadow-[10px_10px_0_#171717]"
            style={{ 
                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                boxShadow: `6px 6px 0 #171717`
            }}
        >
            {/* Cover */}
            <div className="aspect-3/4 bg-neutral-200 border-b-4 border-neutral-900 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: game.cover ? `url(${game.cover})` : (game.bg ? `url(${game.bg})` : "none") }}
                />
                
                {/* Rating badge */}
                {rating > 0 && (
                    <div className="absolute top-2 right-2 border-2 border-neutral-900 px-2 py-1 flex items-center gap-1 backdrop-blur-sm" 
                        style={{ backgroundColor: accentColor }}>
                        <span className="text-[9px] font-black font-mono text-neutral-900 tabular-nums">{rating}</span>
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="w-full flex items-center justify-between text-white">
                        <span className="text-[9px] font-black tracking-widest uppercase">View Details</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </div>
                </div>

                {!game.cover && !game.bg && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-neutral-400">videogame_asset</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="text-sm font-black uppercase tracking-tight text-neutral-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {game.title}
                </h3>
                <p className="text-[8px] font-bold tracking-widest uppercase text-neutral-400 truncate">
                    {game.developer ?? "Unknown Studio"}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-neutral-200">
                    <span className="text-base font-black font-mono text-neutral-900 tabular-nums">
                        {game.price === 0 ? "FREE" : `$${(game.price ?? 0).toFixed(2)}`}
                    </span>
                    <div className="w-8 h-8 border-2 border-neutral-900 flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                        <span className="material-symbols-outlined text-base text-neutral-900">add_shopping_cart</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ── GameCard ─────────────────────────────────────────────────────────────────
function GameCard({ game, index }) {
    const genres = game.genres ?? [];
    const rating = game.rating ? Math.round(game.rating) : null;

    return (
        <Link
            href={`/store/${game.id}`}
            className="card-lift group flex flex-col bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] hover:shadow-[14px_14px_0_#ff4500]"
        >
            {/* Cover */}
            <div className="aspect-3/4 bg-neutral-200 border-b-4 border-neutral-900 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                    style={{ backgroundImage: game.cover ? `url(${game.cover})` : (game.bg ? `url(${game.bg})` : "none") }}
                />

                {/* Rating badge */}
                {rating > 0 && (
                    <div className="absolute top-3 right-3 bg-neutral-900 border-2 border-neutral-900 px-2 py-0.5 flex items-center gap-1 shadow-[2px_2px_0_#ff4500]">
                        <div className="w-1.5 h-1.5 rotate-45 bg-primary shrink-0" />
                        <span className="text-[9px] font-black font-mono text-white tabular-nums">{rating}</span>
                    </div>
                )}

                {!game.cover && !game.bg && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-neutral-400">videogame_asset</span>
                    </div>
                )}
            </div>

            {/* Text zone */}
            <div className="p-4 flex flex-col gap-1.5 flex-1">
                <h3 className="text-[13px] font-black uppercase tracking-wide text-neutral-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {game.title}
                </h3>
                <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 truncate">
                    {game.developer ?? "Unknown Studio"}
                </p>

                {/* Genre pills */}
                {genres.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        {genres.slice(0, 2).map((genre, i) => {
                            const color = genreColor(genre);
                            return (
                                <div key={i} className="flex items-center gap-1 border-2 border-neutral-900 px-1.5 py-0.5 shadow-[1px_1px_0_#171717]" style={{ backgroundColor: color }}>
                                    <div className="w-1.5 h-1.5 rotate-45 bg-white/40 border border-white/30 shrink-0" />
                                    <span className="text-[8px] font-black tracking-widest uppercase text-white leading-none whitespace-nowrap">{genre}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Rating bar */}
                {rating > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-neutral-200 relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${Math.min(rating, 100)}%` }} />
                        </div>
                        <span className="text-[8px] font-mono font-bold text-neutral-400 tabular-nums">{rating}%</span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t-4 border-neutral-900">
                    <span className="text-[15px] font-black font-mono text-neutral-900 tabular-nums">
                        {game.price === 0 ? "FREE" : `$${(game.price ?? 0).toFixed(2)}`}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-neutral-300 group-hover:text-primary transition-colors">
                        arrow_forward
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] animate-pulse">
                    <div className="aspect-3/4 bg-neutral-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-y-full animate-[scanline_2s_infinite]" />
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                        <div className="h-3 bg-neutral-200 w-3/4" />
                        <div className="h-2 bg-neutral-100 w-1/2" />
                        <div className="h-2 bg-neutral-100 w-1/3 mt-2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

