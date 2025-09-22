import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized', '--start-fullscreen']
  });
  const page = await browser.newPage();

  // Set full screen viewport first
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('🚀 Opening full screen window and taking screenshot...');

  // Login
  await page.goto('http://localhost:3005');
  await page.waitForLoadState('networkidle');

  const phoneField = page.locator('input[type="tel"], input[name="phone"]').first();
  const passwordField = page.locator('input[type="password"]').first();
  await phoneField.fill('+919876543210');
  await passwordField.fill('fieldworker123');

  const loginButton = page.locator('button[type="submit"], button:has-text("Login")').first();
  await loginButton.click();
  await page.waitForTimeout(3000);

  // Go to GauShala
  await page.goto('http://localhost:3005/gaushala');
  await page.waitForLoadState('networkidle');

  // Wait a moment for full render
  await page.waitForTimeout(2000);

  // Take full screen screenshot
  await page.screenshot({ path: 'fullscreen-maximized-ui.png', fullPage: false });
  console.log('✅ Full screen maximized screenshot saved: fullscreen-maximized-ui.png');

  await browser.close();
  console.log('✅ Done!');
})();