import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized', '--start-fullscreen']
  });
  const page = await browser.newPage();

  // Set full screen viewport first
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('🚀 Opening Gausakhi BaseLayout directly...');

  // Try different routes to access the BaseLayout
  console.log('Trying to access BaseLayout...');

  // First try the main route
  await page.goto('http://localhost:3006');
  await page.waitForLoadState('networkidle');

  // If we see login form, try to navigate to a protected route that uses BaseLayout
  const hasLogin = await page.locator('input[type="tel"], input[name="phone"]').count() > 0;

  if (hasLogin) {
    console.log('Login page detected, attempting to go directly to gaushala route...');
    // Try to go directly to the route - some apps allow this in dev mode
    await page.goto('http://localhost:3006/gaushala', { waitUntil: 'networkidle' });

    // If still on login, we might need to navigate via hash routing or check if there's a demo mode
    const stillLogin = await page.locator('input[type="tel"], input[name="phone"]').count() > 0;
    if (stillLogin) {
      console.log('Still on login, checking for demo or bypass options...');
      await page.goto('http://localhost:3006/#/gaushala', { waitUntil: 'networkidle' });
    }
  }

  // Wait a moment for full render
  await page.waitForTimeout(3000);

  // Take full screen screenshot
  await page.screenshot({ path: 'shadcn-navbar-ui.png', fullPage: false });
  console.log('✅ BaseLayout screenshot saved: shadcn-navbar-ui.png');

  await browser.close();
  console.log('✅ Done!');
})();