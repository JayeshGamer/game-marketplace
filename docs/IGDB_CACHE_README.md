# Dynamic IGDB Cache — Verification

Follow these steps to verify the dynamic cache-aside behavior for IGDB game metadata.

1) Start Next.js (dev or production) so the API routes are available:

```bash
# dev
pnpm dev
# or
npm run dev
```

2) Warm/cache games using the included script (defaults to http://localhost:3000):

```bash
# Optional: override base URL
export NEXT_PUBLIC_BASE_URL="http://localhost:3000"
node scripts/fetch-and-cache-games.js
```

3) Manual checks
- Open the site and navigate to a store page, for example: `http://localhost:3000/store/igdb-1020`.
- The page should request `/api/games/igdb-1020`, return JSON with `success: true`, and render the metadata.

4) Firestore verification
- In your Firebase console, inspect the `games` collection. Newly fetched documents should appear with a `lastUpdated` timestamp and mapped fields (title, bg, trailer, etc.).

5) Staleness test (optional)
- Edit a cached document in Firestore and set `lastUpdated` to a timestamp older than 7 days.
- Reload the store page — the API route should detect staleness and refresh data from IGDB (check server logs or response times).

Notes
- Ensure server env vars for IGDB are set: `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET` (and correct Firebase config envs) before running server.
- The `scripts/fetch-and-cache-games.js` script is a convenience tool and expects the Next.js server to be reachable at the given base URL.
