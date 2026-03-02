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
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-neutral-900">{title}</h2>
                <Link href="/store" className="text-[12px] font-black tracking-[0.2em] uppercase text-primary border-b-4 border-transparent hover:border-primary transition-colors pb-1">
                    {actionText} <span className="material-symbols-outlined text-sm inline-block translate-y-0.5">arrow_forward</span>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {games.map((game, i) => (
                    <Link href={`/store/${game.id}`} key={i} className="group flex flex-col bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] transition-all duration-200 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#ff4500]">
                        <div className="aspect-[3/4] bg-neutral-200 border-b-4 border-neutral-900 relative overflow-hidden">
                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 mix-blend-multiply bg-cover bg-center" style={{ backgroundImage: game.cover ? `url(${game.cover})` : (game.bg ? `url(${game.bg})` : 'none') }}></div>
                            {game.discount && (
                                <div className="absolute top-4 left-4 bg-primary border-4 border-neutral-900 px-3 py-1 text-[12px] font-black tracking-widest text-neutral-900 shadow-[4px_4px_0_#171717]">
                                    -{game.discount}%
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex flex-col gap-1">
                            <h3 className="text-xl font-black uppercase tracking-wide text-neutral-900 leading-tight group-hover:text-primary transition-colors">{game.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                {game.oldPrice && <span className="text-[10px] font-mono text-neutral-500 line-through">${game.oldPrice}</span>}
                                <span className="text-[14px] font-mono font-bold text-neutral-900">${game.price}</span>
                            </div>
                            <GenrePills genres={game.genres} />
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
            <div className="flex justify-between items-end mb-12 border-b-4 border-white pb-6">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-primary font-black">card_giftcard</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">Free Games</h2>
                </div>
                <button className="text-[12px] font-black tracking-[0.2em] uppercase text-primary border-4 border-primary px-6 py-3 hover:bg-primary hover:text-neutral-900 transition-colors shadow-[4px_4px_0_#ff4500]">
                    View More
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {games.map((game, i) => (
                    <div key={i} className="group flex flex-col bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#ffffff] transition-all duration-200 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#ff4500] overflow-hidden">
                        <div className="aspect-video bg-neutral-200 border-b-4 border-neutral-900 relative overflow-hidden group/image">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-neutral-900/40"></div>
                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 bg-cover bg-center" style={{ backgroundImage: game.bg ? `url(${game.bg})` : (game.cover ? `url(${game.cover})` : 'none') }}></div>
                            
                            {/* Promotional Badge */}
                            <div className="absolute top-4 left-4 bg-primary border-4 border-neutral-900 px-4 py-2 text-[10px] font-black tracking-[0.3em] text-neutral-900 shadow-[4px_4px_0_#171717] z-20">
                                <span className="block uppercase">Free</span>
                            </div>
                            
                            {/* Corner Accent */}
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/30 to-transparent pointer-events-none z-10"></div>
                            
                            <div className="absolute bottom-4 right-4 bg-primary border-4 border-neutral-900 px-4 py-2 text-[14px] font-black tracking-[0.2em] text-neutral-900 shadow-[4px_4px_0_#171717] rotate-[-5deg] z-30 group-hover:rotate-0 transition-transform duration-300">
                                CLAIM NOW
                            </div>
                        </div>
                        <div className="p-8 flex flex-col gap-2">
                            <h3 className="text-2xl font-black uppercase tracking-wide text-neutral-900">{game.title}</h3>
                            <p className="text-[12px] font-bold tracking-widest text-neutral-500 uppercase">Available until {game.endDate}</p>
                            <GenrePills genres={game.genres} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function ListCard({ title, games }) {
    return (
        <div className="flex flex-col flex-1 border-4 border-neutral-900 bg-white p-6 shadow-[8px_8px_0_#171717]">
            <div className="group/hd mb-6 border-b-4 border-neutral-900 pb-4 hover:border-primary transition-colors duration-200 cursor-default flex justify-between items-center">
                <h3 className="text-xl font-black tracking-widest uppercase text-neutral-900 group-hover/hd:text-primary transition-colors duration-200 relative">
                    {title}
                    <span className="absolute -bottom-[5px] left-0 h-[3px] w-0 bg-primary group-hover/hd:w-full transition-all duration-300 ease-out" />
                </h3>
                <span className="material-symbols-outlined text-primary text-2xl font-black group-hover/hd:translate-x-1 transition-transform duration-200">keyboard_arrow_right</span>
            </div>
            <div className="flex flex-col gap-0">
                {games.map((game, i) => (
                    <Link href={`/store/${game.id}`} key={i} className="group flex items-center gap-3 py-3 border-b-4 border-neutral-900 last:border-b-0 transition-all duration-150 hover:bg-neutral-900 hover:px-3 hover:-mx-3">
                        {/* Rank number — black at rest, orange on hover */}
                        <span className="text-[12px] font-black font-mono text-neutral-900 group-hover:text-primary transition-colors duration-150 w-5 shrink-0 text-center tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        {/* Thumbnail */}
                        <div className="w-14 h-[72px] bg-neutral-200 border-2 border-neutral-900 shrink-0 relative overflow-hidden transition-all duration-150 group-hover:border-primary">
                            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 bg-cover bg-center" style={{ backgroundImage: game.cover ? `url(${game.cover})` : (game.bg ? `url(${game.bg})` : 'none') }}></div>
                        </div>
                        {/* Info */}
                        <div className="flex flex-col justify-center gap-1 min-w-0">
                            <h4 className="text-[12px] font-black uppercase tracking-wider text-neutral-900 group-hover:text-white transition-colors duration-150 leading-tight truncate">{game.title}</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-mono font-bold text-neutral-500 group-hover:text-primary transition-colors duration-150">{game.price === 0 ? "FREE" : `$${game.price}`}</span>
                                <GenreDots genres={game.genres} />
                            </div>
                        </div>
                        {/* Arrow reveal */}
                        <span className="material-symbols-outlined text-base text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">arrow_forward</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
