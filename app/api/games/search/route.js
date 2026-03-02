import { NextResponse } from "next/server";
import { getIgdbAccessToken, fetchFromIgdb, formatIgdbImageUrl } from "@/lib/igdb";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const queryTerm = searchParams.get("q");

        if (!queryTerm) {
            return NextResponse.json({ success: false, error: "Missing search query" }, { status: 400 });
        }

        const accessToken = await getIgdbAccessToken();

        const gamesQuery = `
            fields name, cover.image_id, first_release_date, total_rating;
            search "${queryTerm}";
            limit 20;
        `;

        const igdbGames = await fetchFromIgdb("games", gamesQuery, accessToken);

        const results = igdbGames.map(game => ({
            id: `igdb-${game.id}`,
            title: game.name,
            cover: formatIgdbImageUrl(game.cover?.image_id, "cover_big"),
            rating: game.total_rating || 0,
            releaseYear: game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : "TBA"
        }));

        return NextResponse.json({ success: true, count: results.length, data: results });

    } catch (error) {
        console.error("Search Proxy Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
