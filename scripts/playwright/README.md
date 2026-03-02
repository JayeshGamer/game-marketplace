Playwright E2E — Vault Marketplace

What this automates
- Smoke test the home page load
- Open a featured product page
- Capture screenshots of home and product pages
- Record console logs and basic performance metrics

Prerequisites
- Node 18+ installed
- From project root:

```bash
npm install -D playwright
npx playwright install
```

Optional (for CI):
- Set `BASE_URL` (defaults to http://localhost:3000)
- Create a test user and provide `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` for flows requiring login
- Provide sandbox payment credentials if you plan to exercise the checkout flow

How to run

```bash
# run app locally first (Next.js)
npm run dev
# in another shell
node scripts/playwright/e2e.mjs
```

Artifacts
- `scripts/playwright/artifacts/` will contain screenshots and a `console.log` capture

Notes / Next steps
- Extend to assert cart behavior, checkout with sandbox, and order history
- Add CI job under `.github/workflows/playwright.yml` to run headless tests and upload artifacts
- Add secure secret storage for sandbox credentials in CI

Recorded required information (action items)
- Create a test buyer account (email + password)
- Configure a payment sandbox (Stripe/PayPal) and get API keys for test mode
- Decide whether to run Playwright in headless or headed mode on CI
- Identify selectors for 'Add to Cart' and checkout buttons to automate full checkout

Contact
- If you want, I can scaffold the CI workflow and extend the tests to cover the full purchase path.