"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { db } from "@/lib/firebase";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

export default function SliceExperience() {
    const containerRef = useRef(null);
    const [featuredGames, setFeaturedGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                // Famous IGDB IDs: GTA V (1020), Elden Ring (119133), BG3 (134582), Cyberpunk 2077 (26192), Witcher 3 (1942)
                const famousIds = ["igdb-1020", "igdb-119133", "igdb-134582", "igdb-26192", "igdb-1942"];

                const gamesData = await Promise.all(
                    famousIds.map(async (id) => {
                        try {
                            const res = await fetch(`/api/games/${id}`);
                            const json = await res.json();
                            return json.success ? { id, ...json.data } : null;
                        } catch (e) {
                            console.error(`Error fetching famous game ${id}:`, e);
                            return null;
                        }
                    })
                );

                const validGames = gamesData.filter(g => g !== null);

                if (validGames.length > 0) {
                    setFeaturedGames(validGames);
                } else {
                    // Final fallback to any cached games
                    const q = query(collection(db, "games"), limit(5));
                    const snapshot = await getDocs(q);
                    const fallback = [];
                    snapshot.forEach(doc => fallback.push({ id: doc.id, ...doc.data() }));
                    setFeaturedGames(fallback);
                }
            } catch (error) {
                console.error("Critical error fetching featured games:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    useEffect(() => {
        if (!loading && featuredGames.length > 0 && containerRef.current) {
            const ctx = gsap.context(() => {
                // Force initial state to prevent visibility issues
                gsap.set(".slice-item", { opacity: 1, clearProps: "none" });
                gsap.set(".slice-content", { opacity: 1, clearProps: "none" });
                
                gsap.from(".slice-item", {
                    duration: 1.2,
                    x: 100,
                    opacity: 0,
                    stagger: 0.15,
                    ease: "expo.out",
                    delay: 0.2,
                    clearProps: "all"
                });

                gsap.from(".slice-content", {
                    duration: 1,
                    y: 30,
                    opacity: 0,
                    stagger: 0.15,
                    ease: "power3.out",
                    delay: 0.6,
                    clearProps: "all"
                });
            }, containerRef);
            
            return () => {
                ctx.revert();
                // Ensure elements remain visible after context revert
                if (containerRef.current) {
                    const items = containerRef.current.querySelectorAll('.slice-item, .slice-content');
                    items.forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = '';
                    });
                }
            };
        }
    }, [loading, featuredGames]);

    if (loading) return (
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-black font-display px-6">
            <div className="border-4 border-primary bg-neutral-900 p-8 shadow-[10px_10px_0_#ff4500] text-center max-w-sm w-full">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-primary block">
                    LOADING FEATURED GAMES
                </span>
                <p className="text-[10px] font-mono text-neutral-400 mt-2 uppercase tracking-widest">
                    PREPARING STORE SHOWCASE
                </p>
            </div>
        </div>
    );

    return (
        <div
            ref={containerRef}
            className="relative flex h-[calc(100vh-4rem)] w-full flex-col bg-black group/design-root overflow-hidden"
        >
            {/* Z-Index Structure:
                z-[1] = Watermark background
                z-[5] = Game slices container
                z-[100] = Footer
                z-[150] = Grain overlay
            */}
            
            {/* Horizontal Brand Text Watermark - Behind Everything */}
            <div className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center">
                <span className="text-white/20 text-[12vh] md:text-[15vh] font-black tracking-[0.3em] uppercase whitespace-nowrap font-outfit">
                    THE VAULT
                </span>
            </div>

            {/* Vertical Slice System */}
            <main className="flex h-full w-full slice-container bg-black relative z-[5]">
                {featuredGames.map((game, i) => {
                    const isHovered = activeIndex === i;
                    const anyHovered = activeIndex !== null;
                    const flexValue = isHovered ? 2.5 : anyHovered ? 0.7 : 1;

                    return (
                    <section
                        key={game.id}
                        onMouseEnter={() => {
                            setActiveIndex(i);
                            playHoverTick();
                        }}
                        onMouseLeave={() => setActiveIndex(null)}
                        style={{ flex: flexValue }}
                        className={`slice-item relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-crosshair group opacity-100 border-r-2 border-neutral-800`}
                    >
                        <Link 
                            href={`/store/${game.id}`} 
                            onClick={() => playMechanicalClick(1000)}
                            className="absolute inset-0 z-30"
                        ></Link>

                        {/* Dynamic Media Layer */}
                        <div className="absolute inset-0 z-0">
                            {/* Static Image Base */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 group-hover:scale-110"
                                style={{ backgroundImage: `url(${game.bg})` }}
                            ></div>

                            {/* Large Ambient Title - Very faint, atmospheric */}
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden uppercase select-none">
                                <span className="text-white/[0.02] text-[25vh] font-black tracking-[-0.1em] leading-none whitespace-nowrap rotate-[-15deg] scale-150 transition-all duration-1000 group-hover:text-white/[0.04] group-hover:scale-125">
                                    {game.title}
                                </span>
                            </div>

                            {/* Video Overlay on Hover */}
                            {game.trailer && activeIndex === i && (
                                <div className="absolute inset-0 z-15 animate-in fade-in duration-1000">
                                    <iframe
                                        src={`${game.trailer}?autoplay=1&mute=1&controls=0&loop=1&playlist=${game.trailer.split('/').pop()}`}
                                        className="absolute top-1/2 left-1/2 w-[260%] h-[100%] -translate-x-1/2 -translate-y-1/2 pointer-events-none object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 opacity-90"
                                        allow="autoplay; encrypted-media"
                                    ></iframe>
                                </div>
                            )}

                            {/* Scanline overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none -translate-y-full group-hover:animate-[scanline_2.5s_infinite] z-18" />

                            {/* Enhanced Cinematic Overlay */}
                            <div className={`absolute inset-0 z-20 transition-all duration-1000 ${activeIndex === i
                                    ? "bg-gradient-to-t from-black/90 via-black/30 to-black/40 shadow-[inset_0_0_100px_rgba(255,69,0,0.15)]"
                                    : "bg-gradient-to-t from-black/85 via-black/50 to-black/30"
                                }`}></div>
                        </div>

                        {/* Top HUD badge inside slice */}
                        <div className="absolute top-6 left-6 z-40 flex items-center justify-between right-6 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <span className="bg-neutral-950/80 backdrop-blur-sm text-white border-2 border-neutral-700 px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[2px_2px_0_#000]">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span>SPOTLIGHT 0{i + 1}</span>
                                </span>
                                {isHovered && (
                                    <div className="flex items-end gap-0.5 h-3 px-1.5 py-0.5 bg-neutral-900/80 border border-primary/40">
                                        <div className="w-1 bg-primary eq-bar-1"></div>
                                        <div className="w-1 bg-primary eq-bar-2"></div>
                                        <div className="w-1 bg-primary eq-bar-3"></div>
                                    </div>
                                )}
                            </div>

                            {game.price !== undefined && (
                                <span className="bg-primary text-neutral-900 border-2 border-neutral-900 px-3 py-1 text-xs font-mono font-black shadow-[2px_2px_0_#000]">
                                    {game.price === 0 ? "FREE" : `$${game.price}`}
                                </span>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="absolute inset-0 z-40 flex flex-col justify-end p-8 md:p-10 pointer-events-none slice-content">
                            <div className="mb-3 flex items-center gap-3">
                                <span className="text-primary font-mono text-[11px] tracking-[0.25em] font-black uppercase bg-black/70 px-3 py-1 border border-primary/40">
                                    {game.genres?.[0] || 'FEATURED TITLE'}
                                </span>
                                <div className="h-0.5 w-6 bg-primary/40"></div>
                            </div>

                            <h3 className="text-white text-3xl md:text-5xl font-black tracking-tighter leading-[0.88] uppercase mb-4 font-outfit break-normal max-w-[95%] transition-transform duration-500 group-hover:-translate-y-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                                {game.title}
                            </h3>

                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
                                <span className="btn-tactile bg-primary text-neutral-900 font-black text-xs tracking-wider uppercase px-5 py-3 border-2 border-neutral-900 shadow-[3px_3px_0_#000] flex items-center gap-2">
                                    <span>VIEW GAME DETAILS</span>
                                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                                </span>
                            </div>
                        </div>

                        {/* Vertical Indicator */}
                        <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none z-[45]">
                            <span className="text-vertical text-white/40 text-[10px] tracking-[0.5em] uppercase group-hover:text-primary transition-colors font-mono font-bold">
                                FEATURED 0{i + 1}
                            </span>
                        </div>
                    </section>
                    );
                })}
            </main>

            {/* Dynamic UI Footer Metadata */}
            <footer className="absolute bottom-0 left-0 w-full z-[100] flex items-end justify-between px-12 py-10 pointer-events-none border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent">
                <div className="flex flex-col gap-1.5">
                    <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase font-mono">
                        Storefront Spotlight
                    </span>
                    <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                        <span className="text-white text-xs font-black tracking-wider uppercase font-outfit">
                            Instant Digital Delivery • Verified Publishers
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-10 pointer-events-auto">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase text-right font-mono">
                            Platform Status
                        </span>
                        <span className="text-white text-xs font-black tracking-wider uppercase font-outfit text-emerald-400">
                            100% DRM-Free Ready
                        </span>
                    </div>
                    <div className="h-8 w-px bg-white/20"></div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase text-right font-mono">
                            Catalog
                        </span>
                        <div className="flex gap-4">
                            <span className="text-white text-xs font-black tracking-wider uppercase font-outfit">
                                Thousands of Titles
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Subtle Overlay Grain/Texture */}
            <div className="pointer-events-none absolute inset-0 z-[150] opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
    );
}
