const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

async function test() {
    try {
        console.log("Fetching token...");
        const tokenRes = await fetch('https://id.twitch.tv/oauth2/token?client_id=' + process.env.IGDB_CLIENT_ID + '&client_secret=' + process.env.IGDB_CLIENT_SECRET + '&grant_type=client_credentials', { method: 'POST' });
        const tokenData = await tokenRes.json();
        console.log('Token data:', tokenData);

        const gamesQuery = `
            fields name, cover.image_id, screenshots.image_id, videos.video_id;
            where total_rating > 80 & category = 0 & cover != null;
            sort total_rating desc;
            limit 1;
        `;

        console.log("Fetching games...");
        const res = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': 'Bearer ' + tokenData.access_token,
                'Content-Type': 'text/plain',
            },
            body: gamesQuery
        });
        const data = await res.json();
        console.log('Game Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
