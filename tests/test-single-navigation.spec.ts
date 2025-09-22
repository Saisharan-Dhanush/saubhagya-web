import { test, expect } from '@playwright/test';

test('Test single navigation bar - no duplicates', async ({ page }) => {
  console.log('🚀 Testing single navigation bar...');

  // Step 1: Login
  console.log('📝 Step 1: Logging in');
  await page.goto('http://localhost:3005');
  await page.waitForLoadState('networkidle');

  const phoneField = page.locator('input[type="tel"], input[name="phone"]').first();
  const passwordField = page.locator('input[type="password"]').first();
  await phoneField.fill('+919876543210');
  await passwordField.fill('fieldworker123');

  const loginButton = page.locator('button[type="submit"], button:has-text("Login")').first();
  await loginButton.click();
  await page.waitForTimeout(3000);

  // Step 2: Navigate to GauShala
  console.log('📝 Step 2: Navigating to GauShala');
  await page.goto('http://localhost:3005/gaushala');
  await page.waitForLoadState('networkidle');

  // Take screenshot
  await page.screenshot({ path: 'single-navigation-test.png', fullPage: true });
  console.log('✅ Screenshot saved: single-navigation-test.png');

  // Step 3: Check for navigation elements
  const navigationBars = await page.locator('nav, .nav, [class*="nav"]').count();
  console.log(`Found ${navigationBars} navigation elements`);

  // Check for specific duplicate text that would indicate duplicate navigation
  const saubhagyaElements = await page.locator('text=SAUBHAGYA').count();
  const gauShalaElements = await page.locator('text=GauShala Management, text=गौशाला प्रबंधन').count();

  console.log(`SAUBHAGYA text appears ${saubhagyaElements} times`);
  console.log(`GauShala Management text appears ${gauShalaElements} times`);

  // Check that we don't have duplicate blue navigation bars
  const blueNavElements = await page.locator('[class*="bg-blue-6"], [class*="from-blue-6"]').count();
  console.log(`Blue navigation elements: ${blueNavElements}`);

  // Verify Add Cattle button is still accessible
  const addCattleButtons = await page.locator('text=Add Cattle, text=पशु जोड़ें').count();
  console.log(`Add Cattle buttons found: ${addCattleButtons}`);

  if (addCattleButtons > 0) {
    console.log('✅ Add Cattle button is accessible');

    // Test the button
    console.log('📝 Step 3: Testing Add Cattle button');
    await page.locator('text=Add Cattle, text=पशु जोड़ें').first().click();
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log('URL after Add Cattle click:', currentUrl);

    if (currentUrl.includes('/cattle/add')) {
      console.log('✅ Add Cattle navigation working!');
    } else {
      console.log('❌ Add Cattle navigation not working');
    }

    await page.screenshot({ path: 'add-cattle-page-single-nav.png', fullPage: true });
    console.log('✅ Screenshot saved: add-cattle-page-single-nav.png');
  } else {
    console.log('❌ Add Cattle button not found');
  }

  // Final summary
  console.log('\n🎯 Single Navigation Test Summary:');
  console.log('1. Navigation elements count:', navigationBars);
  console.log('2. SAUBHAGYA duplicates:', saubhagyaElements > 1 ? 'YES (problematic)' : 'NO (good)');
  console.log('3. Blue nav bars:', blueNavElements);
  console.log('4. Add Cattle accessible:', addCattleButtons > 0 ? 'YES' : 'NO');
  console.log('5. Check screenshots for visual confirmation');
});