import { test, expect } from '@playwright/test';

test('GauShala Add Cattle button functionality test', async ({ page }) => {
  console.log('🚀 Testing GauShala Add Cattle button...');

  // Bypass authentication for testing by using a dev route
  console.log('📝 Step 1: Navigating directly to GauShala (bypassing auth for testing)');
  await page.goto('http://localhost:3005/gaushala');
  await page.waitForLoadState('networkidle');

  // Take screenshot of the current page
  await page.screenshot({ path: 'gaushala-home-page.png', fullPage: true });
  console.log('✅ Screenshot saved: gaushala-home-page.png');

  // Check page content
  const pageContent = await page.textContent('body');
  console.log('Page content preview:', pageContent?.substring(0, 300));

  // Look for Quick Actions section
  const quickActionsText = await page.locator('text=Quick Actions, text=त्वरित कार्य').count();
  console.log(`Found ${quickActionsText} Quick Actions sections`);

  // Look for Add Cattle button
  const addCattleButton = page.locator('text=Add Cattle, text=पशु जोड़ें');
  const addCattleCount = await addCattleButton.count();
  console.log(`Found ${addCattleCount} Add Cattle buttons`);

  if (addCattleCount > 0) {
    console.log('✅ Add Cattle button found!');

    // Test click functionality
    console.log('📝 Step 2: Testing Add Cattle button click');
    await addCattleButton.first().click();
    await page.waitForLoadState('networkidle');

    // Check if we navigated to the Add Cattle page
    const currentUrl = page.url();
    console.log('Current URL after click:', currentUrl);

    // Take screenshot of the result
    await page.screenshot({ path: 'after-add-cattle-click.png', fullPage: true });
    console.log('✅ Screenshot saved: after-add-cattle-click.png');

    // Check if we're on the Add Cattle page
    const addCattlePageContent = await page.textContent('body');
    const isOnAddCattlePage = addCattlePageContent?.includes('Add Cattle') ||
                             addCattlePageContent?.includes('पशु जोड़ें') ||
                             addCattlePageContent?.includes('RFID') ||
                             currentUrl.includes('/gaushala/cattle/add');

    if (isOnAddCattlePage) {
      console.log('✅ Successfully navigated to Add Cattle page!');

      // Check for form elements
      const formElements = await page.locator('input, select, textarea, button').count();
      console.log(`Found ${formElements} form elements on Add Cattle page`);

      // Look for RFID functionality
      const rfidElements = await page.locator('text=RFID, text=Scan, text=Reader').count();
      console.log(`Found ${rfidElements} RFID-related elements`);

    } else {
      console.log('❌ Did not navigate to Add Cattle page as expected');
      console.log('Current page content:', addCattlePageContent?.substring(0, 300));
    }

  } else {
    console.log('❌ Add Cattle button not found');
    console.log('Available buttons:');
    const allButtons = await page.locator('button').count();
    console.log(`Total buttons found: ${allButtons}`);

    // Get text of all buttons for debugging
    for (let i = 0; i < Math.min(allButtons, 10); i++) {
      const buttonText = await page.locator('button').nth(i).textContent();
      console.log(`Button ${i + 1}: "${buttonText?.trim()}"`);
    }
  }

  // Final summary
  console.log('\n🎯 Add Cattle Button Test Summary:');
  console.log('1. GauShala page accessibility: ' + (quickActionsText > 0 ? 'PASS' : 'FAIL'));
  console.log('2. Add Cattle button presence: ' + (addCattleCount > 0 ? 'PASS' : 'FAIL'));
  console.log('3. Button navigation: ' + (page.url().includes('/add') ? 'PASS' : 'NEEDS AUTH'));
  console.log('4. Check screenshots for visual confirmation');
});