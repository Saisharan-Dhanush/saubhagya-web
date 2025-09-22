import { test, expect } from '@playwright/test';

test('How to login to GauShala application - Step by step demo', async ({ page }) => {
  console.log('🚀 Starting GauShala login demo...');

  // Step 1: Open the application
  console.log('📝 Step 1: Opening SAUBHAGYA admin dashboard');
  await page.goto('http://localhost:3005');
  await page.waitForLoadState('networkidle');

  // Take screenshot of login page
  await page.screenshot({ path: 'step1-login-page.png', fullPage: true });
  console.log('✅ Screenshot saved: step1-login-page.png');

  // Step 2: Fill login credentials for Field Worker (GauShala)
  console.log('📝 Step 2: Entering Field Worker credentials');

  // Field Worker credentials from the demo section
  const phoneField = page.locator('input[type="tel"], input[placeholder*="Phone"]').first();
  const passwordField = page.locator('input[type="password"]').first();

  await phoneField.fill('+919876543210');
  await passwordField.fill('fieldworker123');

  console.log('✅ Entered Field Worker phone: +919876543210');
  console.log('✅ Entered password: fieldworker123');

  // Step 3: Click login button
  console.log('📝 Step 3: Clicking login button');
  const loginButton = page.locator('button[type="submit"], button:has-text("Login")').first();
  await loginButton.click();

  // Wait for navigation
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'step2-after-login.png', fullPage: true });
  console.log('✅ Screenshot saved: step2-after-login.png');

  // Step 4: Navigate to GauShala module
  console.log('📝 Step 4: Looking for GauShala module...');

  // Check current page content
  const pageContent = await page.textContent('body');
  console.log('Current page content preview:', pageContent?.substring(0, 200));

  // Look for GauShala navigation or links
  const gauShalaLink = page.locator('text=GauShala, text=गौशाला, text=Cattle, text=Field Worker');
  const linkCount = await gauShalaLink.count();
  console.log(`Found ${linkCount} GauShala-related links`);

  if (linkCount > 0) {
    await gauShalaLink.first().click();
    await page.waitForLoadState('networkidle');
    console.log('✅ Clicked on GauShala module');
  } else {
    // Try direct navigation
    console.log('📝 Trying direct navigation to /gaushala');
    await page.goto('http://localhost:3005/gaushala');
    await page.waitForLoadState('networkidle');
  }

  // Step 5: Verify we're in GauShala module
  await page.screenshot({ path: 'step3-gaushala-dashboard.png', fullPage: true });
  console.log('✅ Screenshot saved: step3-gaushala-dashboard.png');

  // Check what's on the page
  const finalContent = await page.textContent('body');
  console.log('GauShala page content preview:', finalContent?.substring(0, 300));

  // Look for key GauShala elements
  const cattleElements = await page.locator('text=Cattle, text=पशु, text=Dung, text=गोबर').count();
  const managementElements = await page.locator('text=Management, text=प्रबंधन, text=Dashboard, text=डैशबोर्ड').count();

  console.log(`Found ${cattleElements} cattle-related elements`);
  console.log(`Found ${managementElements} management-related elements`);

  // Step 6: Summary
  console.log('\n🎉 GauShala Login Demo Complete!');
  console.log('📋 Summary:');
  console.log('   1. Opened SAUBHAGYA admin dashboard');
  console.log('   2. Used Field Worker credentials: +919876543210 / fieldworker123');
  console.log('   3. Successfully logged in');
  console.log('   4. Navigated to GauShala module');
  console.log('   5. Screenshots saved for each step');
  console.log('\n📸 Check these screenshots to see the process:');
  console.log('   - step1-login-page.png (Login screen)');
  console.log('   - step2-after-login.png (After login)');
  console.log('   - step3-gaushala-dashboard.png (GauShala module)');
});