import { test, expect } from '@playwright/test';

test.describe('GauShala Application Test', () => {
  test('navigate and test GauShala functionality', async ({ page }) => {
    // Go to the application
    await page.goto('http://localhost:3004');

    // Take screenshot to see what we get
    await page.screenshot({ path: 'step1-homepage.png' });

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check what's actually on the page
    const pageContent = await page.content();
    console.log('Page title:', await page.title());

    // Try to navigate to GauShala directly
    await page.goto('http://localhost:3004/gaushala');
    await page.waitForLoadState('networkidle');

    // Take screenshot of GauShala page
    await page.screenshot({ path: 'step2-gaushala-page.png' });

    // Check what's actually rendered
    const gauShalaContent = await page.textContent('body');
    console.log('GauShala page contains:', gauShalaContent?.substring(0, 200));

    // Look for any text that indicates GauShala
    const hasGauShala = await page.locator('text=GauShala').count();
    const hasDashboard = await page.locator('text=Dashboard').count();
    const hasCattle = await page.locator('text=Cattle').count();

    console.log(`Found GauShala text: ${hasGauShala} times`);
    console.log(`Found Dashboard text: ${hasDashboard} times`);
    console.log(`Found Cattle text: ${hasCattle} times`);

    // If we find any relevant content, test it
    if (hasGauShala > 0 || hasCattle > 0) {
      console.log('✅ GauShala content found!');

      // Try to find and click the transaction button
      const transactionButton = page.locator('text=Record Dung Collection, text=गोबर संग्रह रिकॉर्ड करें');
      if (await transactionButton.count() > 0) {
        await transactionButton.first().click();
        await page.screenshot({ path: 'step3-transaction-modal.png' });
        console.log('✅ Transaction modal opened');

        // Close modal
        const cancelButton = page.locator('text=Cancel, text=रद्द करें');
        if (await cancelButton.count() > 0) {
          await cancelButton.first().click();
          console.log('✅ Modal closed');
        }
      }

      // Try cattle management navigation
      const cattleManagement = page.locator('text=Cattle Management, text=पशु प्रबंधन');
      if (await cattleManagement.count() > 0) {
        await cattleManagement.first().click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'step4-cattle-management.png' });
        console.log('✅ Navigated to Cattle Management');
      }

    } else {
      console.log('❌ No GauShala content found');

      // Let's see what's actually on the page
      const allText = await page.locator('body').textContent();
      console.log('Full page text:', allText?.substring(0, 500));
    }

    // Final screenshot
    await page.screenshot({ path: 'step5-final-state.png' });
  });

  test('debug what is actually loaded', async ({ page }) => {
    // Navigate to root
    await page.goto('http://localhost:3004');
    await page.waitForLoadState('networkidle');

    // Log what we see
    console.log('URL:', page.url());
    console.log('Title:', await page.title());

    // Check for any React errors
    const errors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[data-testid="error"], .error, [class*="error"]');
      return Array.from(errorElements).map(el => el.textContent);
    });

    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }

    // Take full page screenshot
    await page.screenshot({ path: 'debug-full-page.png', fullPage: true });

    // Try different routes
    const routes = ['/gaushala', '/gaushala/cattle', '/'];

    for (const route of routes) {
      await page.goto(`http://localhost:3004${route}`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `debug-route-${route.replace(/\//g, '-') || 'root'}.png` });

      const text = await page.locator('body').textContent();
      console.log(`Route ${route} content:`, text?.substring(0, 200));
    }
  });
});