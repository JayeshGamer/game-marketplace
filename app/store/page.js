"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import MarqueeTicker from "@/components/MarqueeTicker";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

// ── Genre colour palette — covers all IGDB genres + common themes ────────────
const GENRE_COLORS = {
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
    { label: "Free to Play", fn: (p) => p === 0 },
    { label: "Under $20",    fn: (p) => p > 0 && p < 20 },
    { label: "$20 to $40",   fn: (p) => p >= 20 && p < 40 },
    { label: "$40 to $60",   fn: (p) => p >= 40 && p < 60 },
    { label: "Over $60",     fn: (p) => p >= 60 },
];

const SORT_OPTIONS = [
    { value: "title_asc",   label: "Title: A → Z" },
    { value: "title_desc",  label: "Title: Z → A" },
    { value: "price_asc",   label: "Price: Low to High" },
    { value: "price_desc",  label: "Price: High to Low" },
    { value: "rating_desc", label: "Top Rated First" },
];

export default function StoreCatalog() {
    const searchParams = useSearchParams();
    const [games, setGames]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState("");
    const [activeGenres, setActiveGenres] = useState([]);
    const [activePrices, setActivePrices] = useState([]);
    const [sort, setSort]                 = useState("rating_desc");
    const [sortOpen, setSortOpen]         = useState(false);
    // Default to catalog so user IMMEDIATELY has the full filter sidebar!
    const [viewMode, setViewMode]         = useState("catalog");
    const sortRef = useRef(null);

    // Check if we need to switch view or select genre from URL
    useEffect(() => {
        const view = searchParams.get("view");
        if (view === "featured") {
            setViewMode("featured");
        }
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

    // Derive genre list
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
        playMechanicalClick(850, 0.12);
        setActiveGenres(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g]);
    }
    function togglePrice(label) {
        playMechanicalClick(800, 0.12);
        setActivePrices(p => p.includes(label) ? p.filter(x => x !== label) : [...p, label]);
    }
    function clearAll() { 
        playMechanicalClick(650, 0.15);
        setActiveGenres([]); setActivePrices([]); setSearch(""); 
    }

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

            {/* ── TOP STORE MODE SWITCHER TABS ─────────────────────────────────── */}
            <div className="bg-neutral-900 text-white border-b-4 border-neutral-900 px-6 md:px-12 py-3">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setViewMode("catalog"); playMechanicalClick(1100); }}
                            className={`btn-tactile flex items-center gap-2.5 px-5 py-2.5 text-xs font-black tracking-wider uppercase border-2 transition-all ${
                                viewMode === "catalog"
                                    ? "bg-primary text-neutral-900 border-primary shadow-[3px_3px_0_#ffffff]"
                                    : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white"
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">filter_list</span>
                            ALL GAMES & FILTERS
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${viewMode === "catalog" ? "bg-neutral-900 text-white" : "bg-neutral-950 text-neutral-300"}`}>
                                {games.length}
                            </span>
                        </button>

                        <button
                            onClick={() => { setViewMode("featured"); playMechanicalClick(1100); }}
                            className={`btn-tactile flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-wider uppercase border-2 transition-all ${
                                viewMode === "featured"
                                    ? "bg-primary text-neutral-900 border-primary shadow-[3px_3px_0_#ffffff]"
                                    : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white"
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">star</span>
                            STORE SPOTLIGHTS
                        </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono font-medium text-neutral-400">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            INSTANT ACTIVATION
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">100% VERIFIED STEAM/PC KEYS</span>
                    </div>
                </div>
            </div>

            {viewMode === "featured" ? (
                /* ══════════════════════════════════════════════════════════════════════
                   FEATURED VIEW - Curated Spotlights & Categories
                   ══════════════════════════════════════════════════════════════════════ */
                <>
                    {/* Hero Banner */}
                    {featuredGame && (
                        <div className="relative h-[70vh] md:h-[78vh] overflow-hidden border-b-4 border-neutral-900">
                            <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${featuredGame.bg || featuredGame.cover})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/75 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                            
                            {/* Content */}
                            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-16">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2.5 h-2.5 bg-primary animate-pulse" />
                                        <span className="text-xs font-mono font-black tracking-widest uppercase text-primary">FEATURED SPOTLIGHT</span>
                                    </div>
                                    
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white mb-4"
                                        style={{ textShadow: "4px 4px 0 #000" }}>
                                        {featuredGame.title}
                                    </h1>
                                    
                                    {featuredGame.genres && featuredGame.genres.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {featuredGame.genres.slice(0, 3).map((genre, i) => (
                                                <span key={i} 
                                                    className="px-3 py-1 text-xs font-black tracking-wider uppercase text-white border-2 border-white/30 backdrop-blur-sm shadow-[2px_2px_0_#000]"
                                                    style={{ backgroundColor: genreColor(genre) + 'cc' }}>
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <p className="text-sm font-medium text-neutral-300 leading-relaxed mb-6 line-clamp-3">
                                        {featuredGame.description || "Discover an unforgettable gaming experience with high-velocity action and immersive gameplay."}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <Link href={`/store/${featuredGame.id}`}
                                            className="btn-tactile bg-primary border-4 border-neutral-900 text-neutral-900 px-8 py-4 text-xs font-black tracking-wider uppercase shadow-[6px_6px_0_#171717] hover:shadow-[8px_8px_0_#171717] flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-lg">play_arrow</span>
                                            VIEW GAME DETAILS
                                        </Link>
                                        <button 
                                            onClick={() => setViewMode("catalog")}
                                            className="btn-tactile bg-white text-neutral-900 border-4 border-neutral-900 px-8 py-4 text-xs font-black tracking-wider uppercase shadow-[6px_6px_0_#171717] hover:bg-neutral-100 flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-lg">grid_view</span>
                                            BROWSE CATALOG & FILTERS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <MarqueeTicker bgClass="bg-primary text-neutral-900 border-neutral-900" />

                    {/* Quick Stats Bar */}
                    <div className="bg-neutral-900 border-b-4 border-neutral-900 py-6">
                        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Catalog Titles", value: games.length, icon: "videogame_asset" },
                                { label: "New Releases", value: newReleases.length, icon: "new_releases" },
                                { label: "Top Rated Titles", value: popularGames.length, icon: "star" },
                                { label: "Game Genres", value: allGenres.length, icon: "category" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-neutral-950 border-2 border-neutral-800 p-4 shadow-[4px_4px_0_#000000] text-center hover:border-primary/60 transition-colors group">
                                    <span className="material-symbols-outlined text-2xl text-primary mb-1 block group-hover:scale-110 transition-transform">{stat.icon}</span>
                                    <div className="text-3xl font-black font-mono text-white mb-1 tabular-nums">{String(stat.value).padStart(3, '0')}</div>
                                    <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sections Container */}
                    <div className="max-w-screen-2xl mx-auto py-12 space-y-16">
                        {popularGames.length > 0 && (
                            <GameSection 
                                title="Popular Games" 
                                subtitle="Top Rated Titles Community Favorite"
                                icon="trending_up"
                                games={popularGames}
                                accentColor="#ff4500"
                            />
                        )}

                        {newReleases.length > 0 && (
                            <GameSection 
                                title="New Releases" 
                                subtitle="Latest Additions to the Store"
                                icon="new_releases"
                                games={newReleases}
                                accentColor="#22c55e"
                            />
                        )}

                        {sportGames.length > 0 && (
                            <GameSection 
                                title="Sports & Racing" 
                                subtitle="High-Speed Simulation and Competition"
                                icon="sports_soccer"
                                games={sportGames}
                                accentColor="#eab308"
                            />
                        )}

                        {actionGames.length > 0 && (
                            <GameSection 
                                title="Action & Shooter" 
                                subtitle="Adrenaline-Charged Fast Paced Gameplay"
                                icon="sports_esports"
                                games={actionGames}
                                accentColor="#dc2626"
                            />
                        )}

                        {adventureGames.length > 0 && (
                            <GameSection 
                                title="Adventure" 
                                subtitle="Story-Driven Journeys and World Exploration"
                                icon="explore"
                                games={adventureGames}
                                accentColor="#16a34a"
                            />
                        )}

                        {rpgGames.length > 0 && (
                            <GameSection 
                                title="Role-Playing Games" 
                                subtitle="Deep Character Progression and Quests"
                                icon="auto_stories"
                                games={rpgGames}
                                accentColor="#7c3aed"
                            />
                        )}

                        {/* Direct Jump to Catalog CTA */}
                        <div className="px-6 md:px-12">
                            <div className="bg-white border-4 border-neutral-900 p-10 md:p-14 text-center shadow-[12px_12px_0_#171717] max-w-4xl mx-auto">
                                <div className="w-16 h-16 bg-primary border-4 border-neutral-900 mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0_#171717]">
                                    <span className="material-symbols-outlined text-3xl text-neutral-900">filter_list</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">Explore Full Catalog & Filters</h2>
                                <p className="text-sm font-medium text-neutral-600 mb-8 max-w-xl mx-auto">
                                    Browse our entire store database with dedicated genre filters, price brackets, search by developer, and instant sorting.
                                </p>
                                <button 
                                    onClick={() => setViewMode("catalog")}
                                    className="btn-tactile inline-flex items-center gap-3 bg-neutral-900 border-4 border-neutral-900 text-white px-10 py-5 text-xs font-black tracking-widest uppercase shadow-[6px_6px_0_#ff4500] hover:shadow-[8px_8px_0_#ff4500]">
                                    <span className="material-symbols-outlined text-lg">tune</span>
                                    OPEN FILTER SIDEBAR & CATALOG
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* ══════════════════════════════════════════════════════════════════════
                   CATALOG VIEW - High-Converting Store with Elevated Filter Sidebar
                   ══════════════════════════════════════════════════════════════════════ */
                <>
                    {/* Page Header */}
                    <div className="pt-8 pb-6 px-6 md:px-12 border-b-4 border-neutral-900 bg-white">
                        <div className="max-w-7xl mx-auto">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-neutral-500 mb-4">
                                <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
                                <span className="text-neutral-400">/</span>
                                <span className="text-neutral-900 font-black">STORE CATALOG</span>
                            </div>

                            {/* Title & Counter */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-neutral-900">
                                        GAME CATALOG
                                    </h1>
                                    <p className="text-xs font-mono uppercase text-neutral-500 mt-2">
                                        EXPLORE {games.length} VERIFIED PC TITLES • INSTANT KEYS & DIGITAL DOWNLOADS
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-neutral-100 border-2 border-neutral-900 px-4 py-2 text-right shadow-[2px_2px_0_#171717]">
                                        <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">SHOWING</div>
                                        <div className="text-2xl font-black font-mono text-primary leading-tight">
                                            {loading ? "..." : filtered.length} <span className="text-xs text-neutral-500 font-sans">GAMES</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search bar */}
                            <div className="flex items-center border-4 border-neutral-900 bg-white focus-within:shadow-[4px_4px_0_#ff4500] transition-shadow shadow-[4px_4px_0_#171717]">
                                <span className="material-symbols-outlined text-neutral-400 text-2xl px-4 shrink-0">search</span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by game title, studio developer, or genre..."
                                    className="flex-1 bg-transparent py-3.5 text-neutral-900 placeholder-neutral-400 text-sm font-bold tracking-wide outline-none font-sans"
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="material-symbols-outlined text-neutral-400 hover:text-primary text-xl px-4 transition-colors">
                                        close
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <MarqueeTicker reverse={true} bgClass="bg-neutral-900 text-[#ff4500]" />

                    {/* ── MAIN CATALOG LAYOUT WITH ELEVATED FILTER SIDEBAR ─────────── */}
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
                        <div className="flex flex-col lg:flex-row gap-8 items-start">

                            {/* ── ELEVATED FILTER SIDEBAR ───────────────────────────── */}
                            <aside className="w-full lg:w-72 shrink-0">
                                <div className="bg-white border-4 border-neutral-900 p-6 shadow-[8px_8px_0_#171717] sticky top-28">
                                    
                                    {/* Filter header */}
                                    <div className="flex items-center justify-between border-b-4 border-neutral-900 pb-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-xl font-black">tune</span>
                                            <span className="text-sm font-black tracking-wider uppercase text-neutral-900">
                                                FILTERS
                                            </span>
                                            {activeCount > 0 && (
                                                <span className="bg-primary text-neutral-900 border-2 border-neutral-900 px-2 py-0.5 text-xs font-black tabular-nums shadow-[2px_2px_0_#171717]">
                                                    {activeCount}
                                                </span>
                                            )}
                                        </div>
                                        {activeCount > 0 && (
                                            <button 
                                                onClick={clearAll} 
                                                className="btn-tactile text-xs font-black tracking-wider uppercase text-neutral-500 hover:text-primary transition-colors flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">restart_alt</span>
                                                RESET
                                            </button>
                                        )}
                                    </div>

                                    {/* Price Filter Block */}
                                    <FilterBlock title="Price Range">
                                        <div className="space-y-1.5 pt-1">
                                            {PRICE_BUCKETS.map(bucket => {
                                                const active = activePrices.includes(bucket.label);
                                                return (
                                                    <button 
                                                        key={bucket.label} 
                                                        onClick={() => togglePrice(bucket.label)}
                                                        className={`flex items-center justify-between px-3 py-2 w-full text-left border-2 transition-all ${
                                                            active 
                                                                ? "bg-neutral-900 text-white border-neutral-900 shadow-[2px_2px_0_#ff4500]" 
                                                                : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-transparent hover:border-neutral-300"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`w-4 h-4 border-2 border-neutral-900 shrink-0 transition-all flex items-center justify-center ${active ? "bg-primary border-primary" : "bg-white"}`}>
                                                                {active && <span className="material-symbols-outlined text-xs text-neutral-900 font-black">check</span>}
                                                            </div>
                                                            <span className={`text-xs font-bold uppercase tracking-wider ${active ? "text-white font-black" : "text-neutral-700"}`}>
                                                                {bucket.label}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </FilterBlock>

                                    {/* Genre Filter Block */}
                                    <FilterBlock title="Game Genres" count={activeGenres.length}>
                                        <div className="space-y-1 pt-1 max-h-80 overflow-y-auto pr-1">
                                            {allGenres.map(genre => {
                                                const color = genreColor(genre);
                                                const active = activeGenres.includes(genre);
                                                return (
                                                    <button 
                                                        key={genre} 
                                                        onClick={() => toggleGenre(genre)}
                                                        className={`flex items-center justify-between px-3 py-2 w-full text-left border-2 transition-all ${
                                                            active 
                                                                ? "bg-neutral-900 text-white border-neutral-900 shadow-[2px_2px_0_#ff4500]" 
                                                                : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-transparent hover:border-neutral-300"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div
                                                                className={`w-3.5 h-3.5 rotate-45 shrink-0 transition-transform flex items-center justify-center border-2 ${active ? "scale-110" : ""}`}
                                                                style={{
                                                                    borderColor: color,
                                                                    backgroundColor: active ? color : "transparent",
                                                                }}
                                                            >
                                                                {active && <div className="w-1.5 h-1.5 bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-bold uppercase tracking-wider truncate ${active ? "text-white font-black" : "text-neutral-700"}`}>
                                                                {genre}
                                                            </span>
                                                        </div>
                                                        {active && <span className="material-symbols-outlined text-xs text-primary">check</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </FilterBlock>

                                    {/* Quick Store Help Note */}
                                    <div className="mt-6 pt-5 border-t-2 border-neutral-200">
                                        <div className="flex items-start gap-2.5 bg-primary/10 border-2 border-primary/30 p-3">
                                            <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">verified_user</span>
                                            <p className="text-[11px] font-medium text-neutral-700 leading-snug">
                                                All digital purchases directly link to your verified player library with lifetime access.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* ── PRODUCT CATALOG GRID ──────────────────────────────── */}
                            <main className="flex-1 min-w-0 w-full">
                                
                                {/* Grid Toolbar */}
                                <div className="flex flex-wrap items-center justify-between border-b-4 border-neutral-900 pb-4 mb-6 gap-4">
                                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-600">
                                        {loading ? "FETCHING TITLES..." : (
                                            <>SHOWING <span className="text-neutral-900 font-black">{filtered.length}</span> GAMES</>
                                        )}
                                    </span>

                                    {/* Sort Dropdown */}
                                    <div className="relative" ref={sortRef}>
                                        <button
                                            onClick={() => setSortOpen(!sortOpen)}
                                            className="btn-tactile flex items-center gap-2 text-xs font-black tracking-wider uppercase text-neutral-800 border-3 border-neutral-900 bg-white px-4 py-2 shadow-[3px_3px_0_#171717]"
                                        >
                                            <span className="material-symbols-outlined text-sm">sort</span>
                                            {SORT_OPTIONS.find(o => o.value === sort)?.label}
                                            <span className="material-symbols-outlined text-base">{sortOpen ? "expand_less" : "expand_more"}</span>
                                        </button>
                                        {sortOpen && (
                                            <div className="absolute right-0 top-full mt-2 bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#ff4500] z-50 min-w-56">
                                                {SORT_OPTIONS.map(opt => (
                                                    <button 
                                                        key={opt.value} 
                                                        onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                                        className={`w-full text-left px-4 py-3 text-xs font-black tracking-wider uppercase transition-colors border-b border-neutral-100 last:border-b-0 hover:bg-primary hover:text-neutral-900 flex items-center justify-between ${sort === opt.value ? "text-primary bg-neutral-50" : "text-neutral-700"}`}
                                                    >
                                                        {opt.label}
                                                        {sort === opt.value && <span className="material-symbols-outlined text-xs">check</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Filter Pills */}
                                {activeCount > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-neutral-100 border-2 border-neutral-300">
                                        <span className="text-[11px] font-black tracking-wider uppercase text-neutral-500 mr-1">ACTIVE:</span>
                                        {activeGenres.map(g => {
                                            const chipColor = genreColor(g);
                                            return (
                                                <button key={g} onClick={() => toggleGenre(g)}
                                                    className="btn-tactile flex items-center gap-1.5 px-3 py-1 text-xs font-black tracking-wider uppercase text-white border-2 border-neutral-900 shadow-[2px_2px_0_#171717] hover:scale-105 active:scale-95"
                                                    style={{ backgroundColor: chipColor }}
                                                >
                                                    <div className="w-2 h-2 rotate-45 bg-white/60 border border-white/40 shrink-0" />
                                                    {g}
                                                    <span className="material-symbols-outlined text-xs ml-1">close</span>
                                                </button>
                                            );
                                        })}
                                        {activePrices.map(p => (
                                            <button key={p} onClick={() => togglePrice(p)}
                                                className="btn-tactile flex items-center gap-1.5 px-3 py-1 text-xs font-black tracking-wider uppercase text-neutral-900 bg-white border-2 border-primary shadow-[2px_2px_0_#ff4500] hover:bg-primary active:scale-95 transition-colors"
                                            >
                                                {p} <span className="material-symbols-outlined text-xs ml-1">close</span>
                                            </button>
                                        ))}
                                        <button onClick={clearAll} className="btn-tactile ml-auto text-xs font-black tracking-wider uppercase text-neutral-500 hover:text-primary underline">
                                            Clear All
                                        </button>
                                    </div>
                                )}

                                {/* Results Grid */}
                                {loading ? (
                                    <LoadingSkeleton />
                                ) : filtered.length === 0 ? (
                                    <div className="border-4 border-neutral-900 bg-white p-14 text-center shadow-[8px_8px_0_#171717]">
                                        <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-900 mx-auto mb-4 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl text-neutral-400">search_off</span>
                                        </div>
                                        <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">No Games Found</h2>
                                        <p className="text-neutral-500 font-medium text-sm mb-6 max-w-sm mx-auto">
                                            We couldn't find any games matching your current active filters. Try resetting the filters or searching a different term.
                                        </p>
                                        <button onClick={clearAll} className="btn-tactile border-4 border-neutral-900 bg-primary px-8 py-3 text-xs font-black tracking-wider uppercase text-neutral-900 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717]">
                                            RESET ALL FILTERS
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filtered.map((game, i) => (
                                            <GameCard key={game.id} game={game} index={i} />
                                        ))}
                                    </div>
                                )}
                            </main>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ── FilterBlock Component ────────────────────────────────────────────────────
function FilterBlock({ title, count, children }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="mb-5 border-b-2 border-neutral-200 pb-4 last:border-0 last:pb-0 last:mb-0">
            <button 
                onClick={() => {
                    playMechanicalClick(750, 0.12);
                    setOpen(!open);
                }} 
                className="w-full flex items-center justify-between mb-2 group text-left"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wider uppercase text-neutral-800 group-hover:text-primary transition-colors">
                        {title}
                    </span>
                    {count !== undefined && count > 0 && (
                        <span className="text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.2">
                            {count}
                        </span>
                    )}
                </div>
                <span className="material-symbols-outlined text-neutral-400 text-base group-hover:text-primary transition-colors">
                    {open ? "expand_less" : "expand_more"}
                </span>
            </button>
            {open && <div>{children}</div>}
        </div>
    );
}

// ── GameSection: Horizontal scrolling section ────────────────────────────────
function GameSection({ title, subtitle, icon, games, accentColor = "#ff4500" }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        playMechanicalClick(900, 0.1);
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="px-6 md:px-12">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-6 border-b-4 border-neutral-900 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-900 border-4 flex items-center justify-center" 
                        style={{ borderColor: accentColor, boxShadow: `4px 4px 0 ${accentColor}` }}>
                        <span className="material-symbols-outlined text-2xl" style={{ color: accentColor }}>{icon}</span>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">{title}</h2>
                        <p className="text-xs font-bold tracking-wider uppercase text-neutral-500 mt-1">{subtitle}</p>
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
    const rating = game.rating ? Math.round(game.rating) : null;

    return (
        <Link
            href={`/store/${game.id}`}
            onClick={() => playMechanicalClick()}
            onMouseEnter={() => playHoverTick()}
            className="card-lift group shrink-0 w-64 snap-start flex flex-col bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] hover:shadow-[10px_10px_0_#171717] relative"
        >
            <span className="absolute top-1.5 left-2 text-neutral-400 font-mono text-xs pointer-events-none select-none z-10">+</span>
            <span className="absolute top-1.5 right-2 text-neutral-400 font-mono text-xs pointer-events-none select-none z-10">+</span>

            {/* Cover */}
            <div className="aspect-[3/4] bg-neutral-200 border-b-4 border-neutral-900 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
                    style={{ backgroundImage: game.cover ? `url(${game.cover})` : (game.bg ? `url(${game.bg})` : "none") }}
                />
                
                {/* Rating badge */}
                {rating > 0 && (
                    <div className="absolute top-2 right-2 border-2 border-neutral-900 px-2 py-0.5 flex items-center gap-1 backdrop-blur-sm" 
                        style={{ backgroundColor: accentColor }}>
                        <span className="text-xs font-black font-mono text-neutral-900 tabular-nums">★ {rating}</span>
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="w-full flex items-center justify-between text-white">
                        <span className="text-xs font-black tracking-wider uppercase">VIEW DETAILS</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
                <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-neutral-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {game.title}
                    </h3>
                    <p className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-500 truncate mt-0.5">
                        {game.developer ?? "Verified Studio"}
                    </p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-neutral-200">
                    <span className="text-base font-black font-mono text-neutral-900 tabular-nums">
                        {game.price === 0 ? "FREE" : `$${(game.price ?? 0).toFixed(2)}`}
                    </span>
                    <div className="w-8 h-8 border-2 border-neutral-900 flex items-center justify-center shadow-[2px_2px_0_#000]" style={{ backgroundColor: accentColor }}>
                        <span className="material-symbols-outlined text-base text-neutral-900">shopping_cart</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ── GameCard: For Main Catalog Grid ──────────────────────────────────────────
function GameCard({ game, index }) {
    const genres = game.genres ?? [];
    const rating = game.rating ? Math.round(game.rating) : null;

    return (
        <Link
            href={`/store/${game.id}`}
            onClick={() => playMechanicalClick()}
            onMouseEnter={() => playHoverTick()}
            className="card-lift group flex flex-col bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] hover:shadow-[12px_12px_0_#ff4500] relative"
        >
            <span className="absolute top-1.5 left-2 text-neutral-400 font-mono text-xs pointer-events-none select-none z-10">+</span>
            <span className="absolute top-1.5 right-2 text-neutral-400 font-mono text-xs pointer-events-none select-none z-10">+</span>

            {/* Cover */}
            <div className="aspect-[3/4] bg-neutral-200 border-b-4 border-neutral-900 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: game.cover ? `url(${game.cover})` : (game.bg ? `url(${game.bg})` : "none") }}
                />

                {/* Rating badge */}
                {rating > 0 && (
                    <div className="absolute top-3 right-3 bg-neutral-900 border-2 border-neutral-900 px-2.5 py-0.5 flex items-center gap-1 shadow-[2px_2px_0_#ff4500]">
                        <span className="text-primary text-xs">★</span>
                        <span className="text-xs font-black font-mono text-white tabular-nums">{rating}</span>
                    </div>
                )}
            </div>

            {/* Text zone */}
            <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                            #GV-{(game.id || "00").slice(-4).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-300 px-1.5 py-0.2 uppercase">
                            DIGITAL KEY
                        </span>
                    </div>
                    <h3 className="text-base font-black uppercase tracking-tight text-neutral-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {game.title}
                    </h3>
                    <p className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-500 truncate mt-0.5">
                        {game.developer ?? "Verified Studio"}
                    </p>

                    {/* Genre pills */}
                    {genres.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                            {genres.slice(0, 2).map((genre, i) => {
                                const color = genreColor(genre);
                                return (
                                    <div key={i} className="flex items-center gap-1 border border-neutral-900 px-1.5 py-0.5 shadow-[1px_1px_0_#171717]" style={{ backgroundColor: color }}>
                                        <div className="w-1.5 h-1.5 rotate-45 bg-white/60 border border-white/40 shrink-0" />
                                        <span className="text-[10px] font-black tracking-wider uppercase text-white leading-none whitespace-nowrap">{genre}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-neutral-200">
                    <span className="text-lg font-black font-mono text-neutral-900 tabular-nums">
                        {game.price === 0 ? "FREE" : `$${(game.price ?? 0).toFixed(2)}`}
                    </span>
                    <span className="btn-tactile bg-neutral-900 group-hover:bg-primary text-white group-hover:text-neutral-900 border-2 border-neutral-900 px-3 py-1 text-xs font-black tracking-wider uppercase flex items-center gap-1 transition-colors">
                        VIEW <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] animate-pulse">
                    <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden" />
                    <div className="p-4 flex flex-col gap-2">
                        <div className="h-4 bg-neutral-200 w-3/4" />
                        <div className="h-3 bg-neutral-100 w-1/2" />
                        <div className="h-4 bg-neutral-200 w-1/3 mt-2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
