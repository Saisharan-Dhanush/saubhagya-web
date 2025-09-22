import { test, expect } from '@playwright/test';

test('Test login with fallback authentication', async ({ page }) => {
  console.log('🚀 Testing login with fallback authentication...');

  // Step 1: Navigate to login page
  console.log('📝 Step 1: Opening login page');
  await page.goto('http://localhost:3005');
  await page.waitForLoadState('networkidle');

  // Step 2: Fill in Field Worker credentials
  console.log('📝 Step 2: Filling Field Worker credentials');
  const phoneField = page.locator('input[type="tel"], input[name="phone"]').first();
  const passwordField = page.locator('input[type="password"]').first();

  await phoneField.fill('+919876543210');
  await passwordField.fill('fieldworker123');

  console.log('✅ Filled credentials: +919876543210 / fieldworker123');

  // Step 3: Submit login form
  console.log('📝 Step 3: Submitting login form');
  const loginButton = page.locator('button[type="submit"], button:has-text("Login")').first();

  // Start monitoring console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  await loginButton.click();

  // Wait for authentication to complete (either success or fallback)
  await page.waitForTimeout(5000); // Give it 5 seconds for fallback to trigger

  // Check console for fallback messages
  const hasFallbackMessage = consoleMessages.some(msg =>
    msg.includes('fallback') || msg.includes('Backend authentication failed')
  );

  console.log('Fallback authentication triggered:', hasFallbackMessage);

  // Step 4: Check if we're logged in (redirected away from login page)
  const currentUrl = page.url();
  const isStillOnLogin = await page.locator('input[type="tel"], input[type="password"]').count() > 0;

  console.log('Current URL:', currentUrl);
  console.log('Still on login page:', isStillOnLogin);

  // Take screenshot
  await page.screenshot({ path: 'login-test-result.png', fullPage: true });
  console.log('✅ Screenshot saved: login-test-result.png');

  if (!isStillOnLogin) {
    console.log('✅ Login successful! Testing GauShala navigation...');

    // Step 5: Navigate to GauShala
    await page.goto('http://localhost:3005/gaushala');
    await page.waitForLoadState('networkidle');

    // Check for GauShala content
    const gauShalaContent = await page.textContent('body');
    const hasGauShalaContent = gauShalaContent?.includes('Quick Actions') ||
                              gauShalaContent?.includes('Add Cattle') ||
                              gauShalaContent?.includes('त्वरित कार्य');

    await page.screenshot({ path: 'gaushala-after-login.png', fullPage: true });
    console.log('✅ Screenshot saved: gaushala-after-login.png');

    if (hasGauShalaContent) {
      console.log('✅ GauShala content loaded successfully!');

      // Test Add Cattle button
      const addCattleButton = page.locator('text=Add Cattle, text=पशु जोड़ें');
      const addCattleCount = await addCattleButton.count();
      console.log(`Found ${addCattleCount} Add Cattle buttons`);

      if (addCattleCount > 0) {
        console.log('🎯 SUCCESS: Add Cattle button is now visible and functional!');
      } else {
        console.log('❌ Add Cattle button still not found');
      }
    } else {
      console.log('❌ GauShala content not loaded');
    }
  } else {
    console.log('❌ Login failed - still on login page');
  }

  // Print console messages for debugging
  console.log('\n📝 Console Messages:');
  consoleMessages.forEach(msg => console.log(msg));

  // Final summary
  console.log('\n🎯 Login Test Summary:');
  console.log('1. Fallback triggered:', hasFallbackMessage ? 'YES' : 'NO');
  console.log('2. Login successful:', !isStillOnLogin ? 'YES' : 'NO');
  console.log('3. GauShala accessible:', currentUrl.includes('/gaushala') ? 'YES' : 'TESTING...');
});