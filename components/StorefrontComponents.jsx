import Link from "next/link";

// ── Genre colour palette — covers all IGDB genres + themes ──────────────────
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
    "comedy":                       "#f59e0b",
    "war":                          "#57534e",
    "space":                        "#1e3a5f",
    "mythology":                    "#92400e",
    "medieval":                     "#713f12",
    "anime":                        "#f43f5e",
    "sandbox":                      "#059669",
    "battle royale":                "#dc2626",
    "mmo":                          "#0369a1",
    "mmorpg":                       "#0369a1",
    "soulslike":                    "#44403c",
    "rogue-like":                   "#64748b",
    "roguelike":                    "#64748b",
    "metroidvania":                 "#7c3aed",
    "action-adventure":             "#ea580c",
    "action adventure":             "#ea580c",
};

function genreColor(name = "") {
    return GENRE_COLORS[name.toLowerCase().trim()] ?? "#525252";
}

// Inline genre pills for card text area — up to 2 genres, diamond icon + label
function GenrePills({ genres }) {
    if (!genres?.length) return null;
    return (
        <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {genres.slice(0, 2).map((genre, i) => {
                const color = genreColor(genre);
                return (
                    <div key={i} className="flex items-center gap-1 border-2 border-neutral-900 px-1.5 py-0.5 shadow-[2px_2px_0_#171717]" style={{ backgroundColor: color }}>
                        <div className="w-2 h-2 rotate-45 bg-white/40 border border-white/30 shrink-0" />
                        <span className="text-[9px] font-black tracking-[0.12em] uppercase text-white whitespace-nowrap leading-none">{genre}</span>
                    </div>
                );
            })}
        </div>
    );
}

// Compact genre badges for list card rows — diamond + label, up to 2
function GenreDots({ genres }) {
    if (!genres?.length) return null;
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {genres.slice(0, 2).map((genre, i) => {
                const color = genreColor(genre);
                const label = genre.length > 9 ? genre.slice(0, 8) + "…" : genre;
                return (
                    <div key={i} className="flex items-center gap-0.5 px-1 py-px border border-neutral-900 shadow-[1px_1px_0_#171717] group-hover:border-white/50 transition-colors duration-150" style={{ backgroundColor: color }}>
                        <div className="w-1.5 h-1.5 rotate-45 bg-white/40 border border-white/25 shrink-0" />
                        <span className="text-[7.5px] font-black tracking-wide uppercase text-white leading-none whitespace-nowrap">{label}</span>
                    </div>
                );
            })}
        </div>
    );
}

export function StorefrontRow({ title, games, actionText = "View All" }) {
    return (
        <section className="mb-24">
            <div className="flex justify-between items-end mb-8 border-b-4 border-neutral-900 pb-4">
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-7 bg-primary border border-neutral-900 shadow-[2px_2px_0_#171717]" />
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-neutral-900">{title}</h2>
                </div>
                <Link href="/store" className="group text-[11px] font-black tracking-[0.2em] uppercase text-primary hover:text-neutral-900 transition-colors pb-1 flex items-center gap-1.5 btn-tactile">
                    {actionText} <span className="material-symbols-outlined text-sm inline-block group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {games.map((game, i) => (
                    <Link 
                        href={`/store/${game.id}`} 
                        key={i} 
                        className="group flex flex-col bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] hover:shadow-[12px_12px_0_#ff4500] hover:-translate-y-1.5 hover:-translate-x-1.5 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#171717] transition-all duration-200 card-lift"
                    >
                        <div className="aspect-[3/4] bg-neutral-900 border-b-4 border-neutral-900 relative overflow-hidden">
                            <div 
                                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-108 bg-cover bg-center" 
                                style={{ backgroundImage: game.cover ? `url(${game.cover})` : (game.bg ? `url(${game.bg})` : 'none') }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {game.discount && (
                                <div className="absolute top-3 left-3 bg-primary border-3 border-neutral-900 px-2.5 py-0.5 text-[11px] font-black tracking-widest text-neutral-900 shadow-[3px_3px_0_#171717] z-10">
                                    -{game.discount}%
                                </div>
                            )}
                            {game.rating > 0 && (
                                <div className="absolute top-3 right-3 bg-neutral-900/90 backdrop-blur-sm border-2 border-white/20 px-2 py-0.5 text-[10px] font-mono font-black text-white shadow-[2px_2px_0_#171717] z-10 flex items-center gap-1">
                                    <span className="text-primary text-[10px]">★</span>
                                    <span>{Math.round(game.rating)}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-5 flex flex-col gap-1.5 flex-1 justify-between">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-neutral-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">{game.title}</h3>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 line-clamp-1 mt-0.5">{game.developer || "Studio"}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 pt-2">
                                    {game.oldPrice && <span className="text-[11px] font-mono text-neutral-400 line-through">${game.oldPrice}</span>}
                                    <span className="text-[15px] font-mono font-black text-neutral-900">${game.price}</span>
                                </div>
                                <GenrePills genres={game.genres} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export function FreeGamesBlock({ games }) {
    return (
        <section className="mb-24 bg-neutral-900 border-4 border-neutral-900 p-8 md:p-12 shadow-[16px_16px_0_#ff4500]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b-4 border-neutral-700 pb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary border-3 border-neutral-900 flex items-center justify-center shadow-[3px_3px_0_#ffffff]">
                        <span className="material-symbols-outlined text-2xl text-neutral-900 font-black">card_giftcard</span>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white leading-none">Free Games Vault</h2>
                        <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mt-1">Exclusive Weekly Unlocks</p>
                    </div>
                </div>
                <Link href="/store" className="btn-tactile text-[11px] font-black tracking-[0.2em] uppercase text-neutral-900 bg-primary border-3 border-neutral-900 px-6 py-2.5 hover:bg-white transition-colors shadow-[4px_4px_0_#171717]">
                    View All Releases
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {games.map((game, i) => (
                    <Link 
                        href={`/store/${game.id}`} 
                        key={i} 
                        className="group flex flex-col bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#ffffff] hover:shadow-[14px_14px_0_#ff4500] hover:-translate-y-1.5 hover:-translate-x-1.5 active:translate-x-0 active:translate-y-0 transition-all duration-200 overflow-hidden"
                    >
                        <div className="aspect-video bg-neutral-950 border-b-4 border-neutral-900 relative overflow-hidden group/image">
                            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-108 bg-cover bg-center" style={{ backgroundImage: game.bg ? `url(${game.bg})` : (game.cover ? `url(${game.cover})` : 'none') }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30"></div>
                            
                            {/* Promotional Badge */}
                            <div className="absolute top-4 left-4 bg-primary border-3 border-neutral-900 px-3 py-1 text-[10px] font-black tracking-[0.25em] text-neutral-900 shadow-[3px_3px_0_#171717] z-20">
                                100% FREE
                            </div>
                            
                            <div className="absolute bottom-4 right-4 btn-tactile bg-white border-3 border-neutral-900 px-4 py-2 text-[12px] font-black tracking-[0.2em] text-neutral-900 shadow-[4px_4px_0_#171717] group-hover:bg-primary transition-colors duration-200 flex items-center gap-2">
                                <span>CLAIM NOW</span>
                                <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-2">
                            <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 group-hover:text-primary transition-colors">{game.title}</h3>
                            <p className="text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase flex items-center gap-2">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Available until {game.endDate}
                            </p>
                            <GenrePills genres={game.genres} />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export function ListCard({ title, games }) {
    return (
        <div className="flex flex-col flex-1 border-4 border-neutral-900 bg-white p-6 shadow-[8px_8px_0_#171717]">
            <div className="group/hd mb-6 border-b-4 border-neutral-900 pb-4 hover:border-primary transition-colors duration-200 cursor-default flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-5 bg-primary border border-neutral-900"></span>
                    <h3 className="text-xl font-black tracking-widest uppercase text-neutral-900 group-hover/hd:text-primary transition-colors duration-200">
                        {title}
                    </h3>
                </div>
                <span className="material-symbols-outlined text-primary text-xl font-black group-hover/hd:translate-x-1 transition-transform duration-200">arrow_forward</span>
            </div>
            <div className="flex flex-col divide-y-2 divide-neutral-200">
                {games.map((game, i) => (
                    <Link 
                        href={`/store/${game.id}`} 
                        key={i} 
                        className="group flex items-center gap-3.5 py-3.5 transition-all duration-150 hover:bg-neutral-900 hover:px-3 hover:-mx-3 rounded-none"
                    >
                        {/* Rank number */}
                        <span className="text-[13px] font-black font-mono text-neutral-900 group-hover:text-primary transition-colors duration-150 w-6 shrink-0 text-center tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        
                        {/* Game thumbnail */}
                        <div className="w-12 h-14 bg-neutral-900 border-2 border-neutral-900 shrink-0 relative overflow-hidden shadow-[2px_2px_0_#171717] group-hover:border-primary transition-colors">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110" 
                                style={{ backgroundImage: game.cover ? `url(${game.cover})` : (game.bg ? `url(${game.bg})` : 'none') }}
                            />
                        </div>

                        {/* Title & info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black uppercase tracking-tight text-neutral-900 group-hover:text-white transition-colors truncate">
                                {game.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-mono font-bold text-neutral-600 group-hover:text-neutral-300">
                                    ${game.price}
                                </span>
                                {game.rating > 0 && (
                                    <span className="text-[9px] font-mono text-neutral-400 group-hover:text-primary">
                                        ★ {Math.round(game.rating)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Arrow indicator */}
                        <span className="material-symbols-outlined text-sm text-neutral-400 group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100">
                            chevron_right
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
