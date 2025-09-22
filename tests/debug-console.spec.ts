import { test, expect } from '@playwright/test';

test('debug console and check for errors', async ({ page }) => {
  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    console.log(`Console ${msg.type()}: ${msg.text()}`);
  });

  // Listen for page errors
  const pageErrors: string[] = [];
  page.on('pageerror', err => {
    pageErrors.push(err.message);
    console.log(`Page Error: ${err.message}`);
  });

  // Navigate to the application
  await page.goto('http://localhost:3004');
  await page.waitForLoadState('networkidle');

  // Wait a bit for any async loading
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'debug-console-homepage.png', fullPage: true });

  // Check HTML structure
  const html = await page.content();
  console.log('HTML Length:', html.length);
  console.log('HTML snippet:', html.substring(0, 1000));

  // Check if React root is mounted
  const reactRoot = await page.locator('#root').count();
  console.log('React root found:', reactRoot > 0);

  if (reactRoot > 0) {
    const rootContent = await page.locator('#root').textContent();
    console.log('Root content:', rootContent?.substring(0, 200));
  }

  // Check for any loading indicators
  const loadingIndicators = await page.locator('text=Loading, text=loading').count();
  console.log('Loading indicators:', loadingIndicators);

  // Try to navigate to gaushala
  await page.goto('http://localhost:3004/gaushala');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'debug-console-gaushala.png', fullPage: true });

  // Print all console messages and errors
  console.log('\n=== Console Messages ===');
  consoleMessages.forEach(msg => console.log(msg));

  console.log('\n=== Page Errors ===');
  pageErrors.forEach(err => console.log(err));

  // Final report
  console.log('\n=== Summary ===');
  console.log(`Total console messages: ${consoleMessages.length}`);
  console.log(`Total page errors: ${pageErrors.length}`);
  console.log(`React root present: ${reactRoot > 0}`);
});