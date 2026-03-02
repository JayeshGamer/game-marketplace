const clientId = 'us5z91nughrlti83yeoqptc1rkd94p';
const clientSecret = '4e585qr3szwj0brl5ijggsgkuyl0ew';

async function test() {
    try {
        const tokenRes = await fetch('https://id.twitch.tv/oauth2/token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials', { method: 'POST' });
        const tokenData = await tokenRes.json();

        // Relaxed query
        const gamesQuery = `
            fields name, summary, storyline, first_release_date, total_rating, 
            cover.image_id, screenshots.image_id, videos.video_id, 
            genres.name, involved_companies.company.name, involved_companies.developer,
            platforms.name, themes.name, game_modes.name;
            where cover != null & videos != null & screenshots != null;
            limit 10;
        `;

        const res = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                'Client-ID': clientId,
                'Authorization': 'Bearer ' + tokenData.access_token,
                'Content-Type': 'text/plain',
            },
            body: gamesQuery
        });

        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Count:', data.length);
        if (data.length > 0) {
            console.log('Sample Game:', data[0].name);
            console.log('Videos:', data[0].videos);
        }
    } catch (e) {
        console.error(e);
    }
}
test();
