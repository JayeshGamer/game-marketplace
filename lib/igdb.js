/**
 * IGDB API Utility functions
 * Reference: https://api-docs.igdb.com/
 */

export async function getIgdbAccessToken() {
    const clientId = process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("IGDB credentials missing in environment variables.");
    }

    const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to obtain IGDB access token");
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * Formats IGDB image ID into a high-res URL
 * @param {string} imageId 
 * @param {string} size - e.g., '1080p', '720p', 't_cover_big'
 */
export function formatIgdbImageUrl(imageId, size = "1080p") {
    if (!imageId) return null;
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

/**
 * Maps IGDB video ID to YouTube URL
 * @param {string} videoId 
 */
export function formatIgdbVideoUrl(videoId) {
    if (!videoId) return null;
    return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Maps IGDB video ID to YouTube Embed URL
 * @param {string} videoId 
 */
export function formatIgdbVideoEmbedUrl(videoId) {
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
}

export async function fetchFromIgdb(endpoint, query, accessToken) {
    const clientId = process.env.IGDB_CLIENT_ID;

    const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
        method: "POST",
        headers: {
            "Client-ID": clientId,
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "text/plain",
        },
        body: query,
    });

    if (!response.ok) {
        const error = await response.text();
        console.error(`IGDB API Error (${endpoint}):`, error);
        throw new Error(`IGDB API request failed: ${response.statusText}`);
    }

    return await response.json();
}
