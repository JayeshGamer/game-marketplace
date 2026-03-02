// Simple script to warm the Firestore cache by calling the dynamic API routes.
// Usage: set NEXT_PUBLIC_BASE_URL (optional) then run `node scripts/fetch-and-cache-games.js`
// Pass --bust to force-refresh all cached entries (picks up any schema changes like themes→genres)

const BASE = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
const BUST = process.argv.includes('--bust');

const ids = [
  'gtav',
  'igdb-1020',
  'igdb-10250',
  'igdb-11226',
  'igdb-11676',
  'igdb-119133',
  'igdb-122661',
  'igdb-12479',
  'igdb-13271',
  'igdb-134582',
  'igdb-134709',
  'igdb-136482',
  'igdb-141229',
  'igdb-145278',
  'igdb-163826',
  'igdb-1662',
  'igdb-191406',
  'igdb-1942',
  'igdb-204034',
  'igdb-20860',
  'igdb-238878',
  'igdb-245754',
  'igdb-260402',
  'igdb-26192',
  'igdb-263446',
  'igdb-269473',
  'igdb-279377',
  'igdb-279884',
  'igdb-302168',
  'igdb-305556',
  'igdb-327461',
  'igdb-330539',
  'igdb-335127',
  'igdb-338072',
  'igdb-338073',
  'igdb-9186',
  'rdr2',
  'witcher-3'
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callGame(id) {
  try {
    const url = `${BASE}/api/games/${encodeURIComponent(id)}${BUST ? '?bust=true' : ''}`;
    const res = await fetch(url);
    const json = await res.json();
    console.log(id, '->', res.status, json.success ? 'OK' : `ERR:${json.error || 'unknown'}`);
  } catch (e) {
    console.error(id, 'fetch-error', e.message || e);
  }
}

async function searchThenCall(term) {
  try {
    const sUrl = `${BASE}/api/games/search?q=${encodeURIComponent(term)}`;
    const sRes = await fetch(sUrl);
    const sJson = await sRes.json();
    if (sJson.success && sJson.count > 0) {
      const first = sJson.data[0].id;
      console.log(term, 'search -> found', first);
      await callGame(first);
    } else {
      console.log(term, 'search -> no results');
    }
  } catch (e) {
    console.error(term, 'search-error', e.message || e);
  }
}

(async function main(){
  console.log('Base URL:', BASE);
  for (const id of ids) {
    if (id.startsWith('igdb-')) {
      await callGame(id);
    } else {
      // attempt search first for non-numeric slugs
      await searchThenCall(id);
    }
    await sleep(600); // be gentle
  }
  console.log('Done. Check Firestore `games` collection for cached documents.');
})();
