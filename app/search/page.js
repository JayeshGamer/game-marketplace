"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

// Genre colors matching store page
const GENRE_COLORS = {
    "action": "#dc2626", "adventure": "#16a34a", "shooter": "#2563eb",
    "role-playing (rpg)": "#7c3aed", "rpg": "#7c3aed", "strategy": "#d97706",
    "sport": "#65a30d", "sports": "#65a30d", "horror": "#be123c",
    "racing": "#ca8a04", "indie": "#6366f1", "simulation": "#0d9488",
};

function genreColor(name = "") {
    return GENRE_COLORS[name?.toLowerCase()?.trim()] ?? "#525252";
}

export default function SearchResults() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);

    async function handleSearch(searchQuery) {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            const response = await fetch(`/api/games/search?q=${encodeURIComponent(searchQuery)}`);
            const json = await response.json();
            
            if (json.success) {
                setSearchResults(json.data || []);
            } else {
                console.error("Search API error:", json.error);
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error searching games:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e) {
        const value = e.target.value;
        setQuery(value);
        
        // Clear existing timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        
        // Set new timer
        const newTimer = setTimeout(() => {
            handleSearch(value);
        }, 400);
        
        setDebounceTimer(newTimer);
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [debounceTimer]);

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-32 px-6 md:px-12 pb-24 font-display">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="border-b-4 border-neutral-900 pb-8 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-neutral-900 border-4 border-neutral-900 flex items-center justify-center shadow-[4px_4px_0_#ff4500]">
                            <span className="material-symbols-outlined text-2xl text-primary">search</span>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Global Search</h1>
                            <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-neutral-500 mt-1">
                                Search IGDB Database • Millions of Games
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white border-4 border-neutral-900 flex items-center gap-4 px-6 py-6 shadow-[8px_8px_0_#171717] focus-within:shadow-[10px_10px_0_#ff4500] focus-within:-translate-y-0.5 transition-all">
                        <span className="material-symbols-outlined text-neutral-400 text-3xl shrink-0">search</span>
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Search by title, developer, or genre..."
                            className="bg-transparent text-2xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 w-full outline-none placeholder:text-neutral-300"
                            autoFocus
                        />
                        {query && (
                            <button 
                                onClick={() => { setQuery(""); setSearchResults([]); setHasSearched(false); }}
                                className="material-symbols-outlined text-neutral-400 hover:text-primary text-2xl transition-colors shrink-0">
                                close
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-3">
                        {loading && (
                            <span className="material-symbols-outlined text-primary animate-spin text-xl">refresh</span>
                        )}
                        <p className="text-[11px] font-black tracking-[0.2em] uppercase">
                            {loading ? (
                                <span className="text-neutral-500">Searching IGDB...</span>
                            ) : hasSearched ? (
                                <><span className="text-primary">{searchResults.length}</span> <span className="text-neutral-600">Results Found</span></>
                            ) : (
                                <span className="text-neutral-400">Enter search query above</span>
                            )}
                        </p>
                    </div>
                    
                    {hasSearched && searchResults.length > 0 && (
                        <Link href="/store" className="text-[9px] font-black tracking-widest uppercase text-neutral-500 hover:text-primary transition-colors underline">
                            Browse Local Catalog →
                        </Link>
                    )}
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] animate-pulse">
                                <div className="aspect-square bg-neutral-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-neutral-200 w-3/4" />
                                    <div className="h-3 bg-neutral-100 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : hasSearched && searchResults.length === 0 ? (
                    <div className="bg-white border-4 border-neutral-900 p-16 text-center shadow-[10px_10px_0_#171717]">
                        <span className="material-symbols-outlined text-6xl text-neutral-200 mb-4 block">search_off</span>
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">No Results</h2>
                        <p className="text-sm font-bold text-neutral-500 mb-6">
                            No games found matching &ldquo;{query}&rdquo;. Try different keywords.
                        </p>
                        <Link href="/store" className="btn-tactile inline-block bg-primary border-4 border-neutral-900 px-8 py-3 text-[10px] font-black tracking-widest uppercase shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_#171717] transition-all">
                            Browse Store
                        </Link>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {searchResults.map((game, i) => (
                            <Link 
                                key={game.id} 
                                href={`/store/${game.id}`}
                                onClick={() => playMechanicalClick()}
                                onMouseEnter={() => playHoverTick()}
                                className="card-lift group flex flex-col bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] hover:shadow-[10px_10px_0_#ff4500] relative"
                                style={{ animation: `fadeIn 0.4s ease-out ${i * 0.05}s both` }}>
                                {/* Corner Crosshairs */}
                                <span className="absolute top-1 left-2 text-neutral-400 font-mono text-[9px] pointer-events-none select-none z-10">+</span>
                                <span className="absolute top-1 right-2 text-neutral-400 font-mono text-[9px] pointer-events-none select-none z-10">+</span>

                                <div className="relative aspect-square overflow-hidden bg-neutral-200 border-b-4 border-neutral-900">
                                    {game.cover ? (
                                        <img 
                                            src={game.cover} 
                                            alt={game.title} 
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-6xl text-neutral-300">videogame_asset</span>
                                        </div>
                                    )}
                                    
                                    {game.rating > 0 && (
                                        <div className="absolute top-2 right-2 bg-neutral-900 border-2 border-neutral-900 px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0_#ff4500]">
                                            <span className="material-symbols-outlined text-xs text-primary">star</span>
                                            <span className="text-[9px] font-black font-mono text-white tabular-nums">
                                                {(game.rating / 10).toFixed(1)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="flex items-center justify-between w-full text-white">
                                            <span className="text-[9px] font-black tracking-widest uppercase">View Game</span>
                                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col p-4 flex-grow justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-mono text-[7px] tracking-widest text-neutral-400 select-none">||| | ||</span>
                                            <span className="text-[7px] font-mono text-neutral-400 uppercase">#RADAR_{i.toString().padStart(2, "0")}</span>
                                        </div>
                                        <h3 className="text-base font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                            {game.title}
                                        </h3>
                                        {game.releaseYear && (
                                            <p className="text-[8px] font-mono font-bold text-neutral-500 tracking-wider uppercase">
                                                Released: {game.releaseYear}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-neutral-200">
                                        <span className="text-[9px] font-black tracking-wider uppercase text-neutral-400">IGDB DECRYPTED</span>
                                        <span className="material-symbols-outlined text-neutral-300 group-hover:text-primary transition-colors">open_in_new</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-4 border-neutral-900 p-16 text-center shadow-[8px_8px_0_#171717]">
                        <span className="material-symbols-outlined text-6xl text-neutral-300 mb-4 block">search</span>
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Start Your Search</h2>
                        <p className="text-sm font-bold text-neutral-500">
                            Enter a game title, developer, or genre to search the IGDB database.
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
