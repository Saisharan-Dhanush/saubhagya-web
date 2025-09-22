import { test, expect } from '@playwright/test';

test('How to access GauShala application directly - Demo', async ({ page }) => {
  console.log('🚀 Starting GauShala direct access demo...');

  // Method 1: Try direct navigation to GauShala module
  console.log('📝 Method 1: Direct navigation to GauShala module');
  await page.goto('http://localhost:3005/gaushala');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'gaushala-direct-access.png', fullPage: true });
  console.log('✅ Screenshot saved: gaushala-direct-access.png');

  // Check if we see GauShala content
  const pageContent = await page.textContent('body');
  console.log('Page content preview:', pageContent?.substring(0, 300));

  // Look for GauShala-specific elements
  const gauShalaElements = await page.locator('text=GauShala, text=गौशाला, text=Cattle, text=पशु, text=Dung, text=गोबर').count();
  console.log(`Found ${gauShalaElements} GauShala-related elements`);

  if (gauShalaElements > 0) {
    console.log('✅ GauShala module is accessible!');

    // Test different sections
    console.log('📝 Testing GauShala sections...');

    // Check for navigation elements
    const navigationElements = await page.locator('text=Management, text=Dashboard, text=Add Cattle, text=Cattle Management').count();
    console.log(`Found ${navigationElements} navigation elements`);

    // Check for specific cattle management features
    const cattleFeatures = await page.locator('text=Add New Cattle, text=Record Dung, text=RFID, text=Medical').count();
    console.log(`Found ${cattleFeatures} cattle management features`);

  } else {
    console.log('❌ GauShala content not found, trying alternative methods...');

    // Method 2: Try different route variations
    const routes = [
      '/gaushala/dashboard',
      '/gaushala/cattle',
      '/gaushala/home',
      '/field-worker',
      '/gausakhi'
    ];

    for (const route of routes) {
      console.log(`📝 Trying route: ${route}`);
      await page.goto(`http://localhost:3005${route}`);
      await page.waitForLoadState('networkidle');

      const content = await page.textContent('body');
      const hasGauShalaContent = content?.includes('GauShala') || content?.includes('गौशाला') || content?.includes('Cattle') || content?.includes('पशु');

      if (hasGauShalaContent) {
        console.log(`✅ Found GauShala content at route: ${route}`);
        await page.screenshot({ path: `gaushala-found-${route.replace(/\//g, '-')}.png`, fullPage: true });
        break;
      } else {
        console.log(`❌ No GauShala content at route: ${route}`);
      }
    }
  }

  // Method 3: Check if we need to mock authentication first
  console.log('📝 Method 3: Checking authentication requirements...');
  await page.goto('http://localhost:3005');
  await page.waitForLoadState('networkidle');

  // Check if we're on login page
  const isLoginPage = await page.locator('input[type="tel"], input[type="password"], text=Login').count() > 0;

  if (isLoginPage) {
    console.log('ℹ️ Application requires authentication');
    console.log('💡 To access GauShala without backend auth service:');
    console.log('   1. Start the auth service: docker-compose up auth-service');
    console.log('   2. Or modify AuthContext to use fallback authentication');
    console.log('   3. Or add a development bypass for testing');
  } else {
    console.log('ℹ️ Application allows direct access');
  }

  // Final summary
  console.log('\n🎯 GauShala Access Summary:');
  console.log('1. GauShala module URL: http://localhost:3005/gaushala');
  console.log('2. Field Worker credentials: +919876543210 / fieldworker123');
  console.log('3. Backend auth service needed at: http://localhost:8081');
  console.log('4. Check screenshots for visual confirmation');
});