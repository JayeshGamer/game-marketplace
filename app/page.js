"use client";

import { useEffect, useState } from "react";
import SliceExperience from "@/components/SliceExperience";
import CustomCursor from "@/components/CustomCursor";
import { StorefrontRow, FreeGamesBlock, ListCard } from "@/components/StorefrontComponents";


export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        // Curated list of popular game IDs from IGDB
        const gameIds = [
          "igdb-1020",   // GTA V
          "igdb-119133", // Elden Ring
          "igdb-134582", // Baldur's Gate 3
          "igdb-26192",  // Cyberpunk 2077
          "igdb-1942",   // Witcher 3
          "igdb-103298", // Red Dead Redemption 2
          "igdb-121",    // Minecraft
          "igdb-127",    // Skyrim
          "igdb-11208",  // Dark Souls
          "igdb-1877",   // Sekiro
          "igdb-1029",   // God of War
          "igdb-25076",  // Hades
        ];

        const gamesData = await Promise.all(
          gameIds.map(async (id) => {
            try {
              const res = await fetch(`/api/games/${id}`);
              const json = await res.json();
              return json.success ? { id, ...json.data } : null;
            } catch (e) {
              console.error(`Error fetching game ${id}:`, e);
              return null;
            }
          })
        );

        const validGames = gamesData.filter(g => g !== null);
        setGames(validGames);
      } catch (error) {
        console.error("Error fetching games for Home page:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center font-display px-6">
        <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[12px_12px_0_#ff4500] max-w-md w-full text-center">
          <div className="size-14 bg-neutral-900 border-2 border-neutral-900 mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0_#ff4500]">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">sync</span>
          </div>
          <span className="bg-neutral-900 text-white px-3 py-1 text-[9px] font-black tracking-[0.3em] uppercase mb-3 inline-block">
            SYSTEM BOOT
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-neutral-900 mb-2">
            INITIALIZING VAULT
          </h2>
          <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
            ESTABLISHING ENCRYPTED UPLINK // VERIFYING DATASETS
          </p>
          <div className="w-full bg-neutral-100 border-2 border-neutral-900 h-2 mt-6 overflow-hidden">
            <div className="h-full bg-primary w-2/3 animate-[pulse_1.5s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // Slice up the games for different sections
  const discoverList = games.slice(0, 4);
  const secondaryList = games.slice(2, 6);
  // Fake some free games for the promo block
  const freeGames = games.slice(0, 2).map((g, i) => ({ ...g, endDate: i === 0 ? "THIS WEEK" : "NEXT WEEK", price: 0 }));
  const saleList = games.slice(1, 5).map(g => ({ ...g, discount: 20, oldPrice: (g.price * 1.20).toFixed(2), price: (g.price * 0.8).toFixed(2) }));

  return (
    <>
      <CustomCursor />
      
      {/* Existing Hero Component - Full Bleed */}
      <div className="w-full mb-16">
        <SliceExperience />
      </div>

      <div className="flex flex-col w-full min-h-screen text-neutral-900 font-display relative bg-[#f5f5f7]">
        {/* Neo-Brutalist Background Layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Bold halftone dot pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, #18181b 2px, transparent 2px)`,
            backgroundSize: '28px 28px',
            opacity: 0.08
          }}></div>
          
          {/* Diagonal grid pattern - more visible */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, #ff4500 2px, transparent 2px),
              linear-gradient(-45deg, #ff4500 2px, transparent 2px)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.06
          }}></div>
          
          {/* Large geometric shapes - bold and visible */}
          <div className="absolute -top-32 -left-32 w-80 h-80 border-[12px] border-neutral-900/12 rotate-12"></div>
          <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full border-[14px] border-primary/15"></div>
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 border-[10px] border-neutral-900/10 -rotate-6"></div>
          <div className="absolute -bottom-32 right-1/4 w-[420px] h-[420px] border-[12px] border-neutral-900/12 rotate-45"></div>
          <div className="absolute top-[55%] left-[60%] w-48 h-48 border-[8px] border-primary/10 rotate-[25deg]"></div>
          
          {/* Newsprint style horizontal lines - bolder */}
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 4px,
              #18181b 4px,
              #18181b 5px
            )`,
            opacity: 0.035
          }}></div>
          
          {/* Accent splatters - geometric confetti - more visible */}
          <div className="absolute top-[15%] right-[20%] w-8 h-8 bg-primary/20 rotate-45"></div>
          <div className="absolute top-[45%] left-[15%] w-10 h-10 bg-neutral-900/15 rounded-full"></div>
          <div className="absolute bottom-[25%] right-[35%] w-6 h-6 bg-primary/22 rotate-12"></div>
          <div className="absolute top-[60%] right-[15%] w-9 h-9 bg-neutral-900/12"></div>
          <div className="absolute bottom-[40%] left-[30%] w-7 h-7 bg-primary/18 rotate-45"></div>
          <div className="absolute top-[35%] right-[45%] w-12 h-12 bg-neutral-900/10 -rotate-12"></div>
          <div className="absolute bottom-[60%] left-[40%] w-8 h-8 bg-primary/15 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-12 w-full pb-32 relative z-10">
          {/* Discover / New Releases Section */}
          <StorefrontRow title="Discover" games={discoverList} />

          {/* Free Games Promo Block */}
          <FreeGamesBlock games={freeGames} />

          {/* Catalog Matrices (3 Column Lists) */}
          <section className="flex flex-col lg:flex-row gap-8 mb-24">
            <ListCard title="Top Sellers" games={games.slice(0, 5)} />
            <ListCard title="Most Played" games={[...games].reverse().slice(0, 5)} />
            <ListCard title="Upcoming" games={secondaryList} />
          </section>

          {/* On Sale Section */}
          <StorefrontRow title="Action Sequence" games={saleList} />
        </div>
      </div>
    </>
  );
}
