import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getIgdbAccessToken, fetchFromIgdb, formatIgdbImageUrl, formatIgdbVideoEmbedUrl } from "@/lib/igdb";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const forceBust = searchParams.get("bust") === "true";

        // 1. Check Firestore Cache First
        const gameRef = doc(db, "games", id);
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists() && !forceBust) {
            const data = gameSnap.data();
            const lastUpdated = data.lastUpdated || 0;
            const now = Date.now();
            const staleTime = 7 * 24 * 60 * 60 * 1000; // 7 days

            // If found and not stale, return it
            if (now - lastUpdated < staleTime) {
                console.log(`[Cache Hit] Returning game data for: ${id}`);
                return NextResponse.json({ success: true, data });
            }
            console.log(`[Cache Stale] Refreshing game data for: ${id}`);
        } else if (!gameSnap.exists()) {
            console.log(`[Cache Miss] Fetching fresh data from IGDB for: ${id}`);
        } else {
            console.log(`[Cache Bust] Force-refreshing game data for: ${id}`);
        }

        // 2. Fetch from IGDB
        const accessToken = await getIgdbAccessToken();

        // If the ID is an IGDB ID (e.g. igdb-1234), strip the prefix
        const numericId = id.startsWith('igdb-') ? id.replace('igdb-', '') : id;

        const gamesQuery = `
            fields name, summary, storyline, first_release_date, total_rating, 
            cover.image_id, screenshots.image_id, videos.video_id, 
            genres.name, involved_companies.company.name, involved_companies.developer,
            platforms.name, themes.name, game_modes.name;
            where id = ${numericId};
        `;

        const igdbGames = await fetchFromIgdb("games", gamesQuery, accessToken);

        if (!igdbGames || igdbGames.length === 0) {
            return NextResponse.json({ success: false, error: "Game not found in IGDB" }, { status: 404 });
        }

        const igdbGame = igdbGames[0];

        // 3. Map and Cache Data
        const gameData = {
            title: igdbGame.name,
            description: igdbGame.summary || igdbGame.storyline || "No description available.",
            price: 59.99,
            developer: igdbGame.involved_companies?.find(c => c.developer)?.company.name || "Unknown Developer",
            publisher: igdbGame.involved_companies?.find(c => !c.developer)?.company.name || "Unknown Publisher",
            releaseDate: igdbGame.first_release_date
                ? new Date(igdbGame.first_release_date * 1000).toLocaleDateString()
                : "TBA",
            genres: [
                ...(igdbGame.genres?.map(g => g.name) || []),
                ...(igdbGame.themes?.map(t => t.name) || []),
            ],
            features: igdbGame.platforms?.map(p => p.name) || [],
            bg: formatIgdbImageUrl(igdbGame.screenshots?.[0]?.image_id, "1080p") || formatIgdbImageUrl(igdbGame.cover?.image_id, "1080p"),
            cover: formatIgdbImageUrl(igdbGame.cover?.image_id, "cover_big"),
            screenshots: igdbGame.screenshots?.map(s => formatIgdbImageUrl(s.image_id, "1080p")) || [],
            trailer: igdbGame.videos?.[0]?.video_id ? formatIgdbVideoEmbedUrl(igdbGame.videos[0].video_id) : null,
            rating: igdbGame.total_rating || 0,
            lastUpdated: Date.now(),
            systemRequirements: {
                minOS: "Windows 10 64-bit",
                minCPU: "Intel Core i5-4460",
                minRAM: "8GB RAM",
                minGPU: "NVIDIA GeForce GTX 760"
            }
        };

        await setDoc(gameRef, gameData, { merge: true });

        return NextResponse.json({ success: true, data: gameData });

    } catch (error) {
        console.error("Dynamic Game Proxy Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
