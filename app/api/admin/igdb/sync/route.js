import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { getIgdbAccessToken, fetchFromIgdb, formatIgdbImageUrl, formatIgdbVideoEmbedUrl } from "@/lib/igdb";

export async function POST(req) {
    try {
        const accessToken = await getIgdbAccessToken();

        // Query for popular games or specific criteria
        // Example: Fetch top 10 games with ratings higher than 80
        const gamesQuery = `
            fields id, name, summary, storyline, first_release_date, total_rating, 
            cover.image_id, screenshots.image_id, videos.video_id, 
            genres.name, involved_companies.company.name, involved_companies.developer,
            platforms.name, themes.name, game_modes.name;
            where cover != null & videos != null & screenshots != null;
            sort total_rating desc;
            limit 30;
        `;

        const igdbGames = await fetchFromIgdb("games", gamesQuery, accessToken);

        const syncResults = {
            added: 0,
            updated: 0,
            errors: []
        };

        for (const igdbGame of igdbGames) {
            try {
                if (!igdbGame?.id) {
                    throw new Error("Missing IGDB game id");
                }

                const gameId = `igdb-${igdbGame.id}`;
                const gameRef = doc(db, "games", gameId);

                // Map IGDB data to our schema
                const gameData = {
                    title: igdbGame.name,
                    description: igdbGame.summary || igdbGame.storyline || "No description available.",
                    price: 59.99, // Static price for now, as IGDB doesn't provide pricing
                    developer: igdbGame.involved_companies?.find(c => c?.developer)?.company?.name || "Unknown Developer",
                    publisher: igdbGame.involved_companies?.find(c => c && c.developer === false)?.company?.name || "Unknown Publisher",
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
                    systemRequirements: {
                        minOS: "Windows 10 64-bit",
                        minCPU: "Intel Core i5-4460",
                        minRAM: "8GB RAM",
                        minGPU: "NVIDIA GeForce GTX 760"
                    }
                };

                await setDoc(gameRef, gameData, { merge: true });
                syncResults.added++;
            } catch (err) {
                console.error(`Error syncing game ${igdbGame.name}:`, err);
                syncResults.errors.push({ name: igdbGame.name, error: err.message });
            }
        }

        return NextResponse.json({ success: true, results: syncResults });
    } catch (error) {
        console.error("IGDB Sync Route Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
