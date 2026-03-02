import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

(async () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const ARTIFACTS = path.resolve(process.cwd(), 'scripts', 'playwright', 'artifacts');
  if (!fs.existsSync(ARTIFACTS)) fs.mkdirSync(ARTIFACTS, { recursive: true });

  const logs = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console
  page.on('console', msg => logs.push(`${new Date().toISOString()} [${msg.type()}] ${msg.text()}`));

  try {
    console.log('Visiting home:', BASE_URL);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(ARTIFACTS, 'home.png'), fullPage: true });

    // --- Login flow ---
    const LOGIN_EMAIL = process.env.TEST_USER_EMAIL || 'test@vault.com';
    const LOGIN_PASS = process.env.TEST_USER_PASSWORD || 'testme';

    console.log('Attempting login with', LOGIN_EMAIL);
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', LOGIN_EMAIL).catch(() => {});
    await page.fill('input[type="password"]', LOGIN_PASS).catch(() => {});
    // Submit the form
    await Promise.all([
      page.waitForURL('**/profile', { timeout: 10000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]).catch(() => {});
    await page.screenshot({ path: path.join(ARTIFACTS, 'after-login.png'), fullPage: true });

    // Back to home and open first product
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const storeLink = await page.$('a[href^="/store/"]');
    if (storeLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 8000 }).catch(() => {}),
        storeLink.click()
      ]).catch(() => {});

      await page.screenshot({ path: path.join(ARTIFACTS, 'product.png'), fullPage: true });

      // Try add to cart
      const addToCart = await page.$('button:has-text("Add to Cart")');
      if (addToCart) {
        await addToCart.click();
        // navigate to cart and verify
        await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(ARTIFACTS, 'cart.png'), fullPage: true });

        // proceed to checkout
        const checkoutLink = await page.$('a[href^="/checkout"]');
        if (checkoutLink) {
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 8000 }).catch(() => {}),
            checkoutLink.click()
          ]).catch(() => {});

          // Fill checkout form (simplified)
          await page.fill('input[placeholder="First Name"]', 'Test').catch(() => {});
          await page.fill('input[placeholder="Last Name"]', 'Buyer').catch(() => {});
          await page.fill('input[placeholder="CARD NUMBER"]', '4242424242424242').catch(() => {});
          await page.fill('input[placeholder="MM/YY"]', '12/34').catch(() => {});
          await page.fill('input[placeholder="CVC"]', '123').catch(() => {});

          // Submit checkout form
          await Promise.all([
            page.waitForURL('**/profile', { timeout: 10000 }).catch(() => {}),
            page.click('button:has-text("PAY")')
          ]).catch(() => {});

          await page.screenshot({ path: path.join(ARTIFACTS, 'after-checkout.png'), fullPage: true });
        }
      } else {
        console.log('Add to Cart button not found on product page.');
      }

      // Try to capture title text heuristically
      const titleHandle = await page.$('h1, h2, h3');
      const titleText = titleHandle ? (await titleHandle.innerText()).trim() : 'UNKNOWN_TITLE';
      fs.writeFileSync(path.join(ARTIFACTS, 'product-title.txt'), titleText);
      console.log('Captured title:', titleText);
    } else {
      console.log('No product link found on home page.');
    }

    // Snapshot of performance metrics
    const perfTiming = await page.evaluate(() => JSON.stringify(window.performance.timing));
    fs.writeFileSync(path.join(ARTIFACTS, 'performance.json'), perfTiming);

  } catch (err) {
    console.error('E2E error:', err);
    logs.push(`ERROR: ${err.message}`);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(ARTIFACTS, 'console.log'), logs.join('\n'));
    console.log('Artifacts saved to', ARTIFACTS);
  }
})();
