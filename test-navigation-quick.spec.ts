import { test, expect } from '@playwright/test';

test('GauShala Navigation Test - Quick', async ({ page }) => {
  console.log('🚀 Testing GauShala navigation tabs...');

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

  // Take screenshot to show navigation tabs
  await page.screenshot({ path: 'gaushala-navigation-tabs.png', fullPage: true });
  console.log('✅ Screenshot saved: gaushala-navigation-tabs.png');

  // Step 3: Test navigation tabs
  console.log('📝 Step 3: Testing navigation tabs');

  // Check if navigation tabs are visible
  const dashboardTab = await page.locator('text=Dashboard, text=डैशबोर्ड').count();
  const cattleTab = await page.locator('text=Cattle Management, text=पशु प्रबंधन').count();
  const transactionTab = await page.locator('text=Transaction History, text=लेन-देन का इतिहास').count();

  console.log(`Dashboard tab found: ${dashboardTab > 0 ? 'YES' : 'NO'}`);
  console.log(`Cattle Management tab found: ${cattleTab > 0 ? 'YES' : 'NO'}`);
  console.log(`Transaction History tab found: ${transactionTab > 0 ? 'YES' : 'NO'}`);

  // Test clicking on Cattle Management tab if it exists
  if (cattleTab > 0) {
    console.log('📝 Step 4: Clicking Cattle Management tab');
    await page.locator('text=Cattle Management, text=पशु प्रबंधन').first().click();
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log('Current URL after click:', currentUrl);

    await page.screenshot({ path: 'cattle-management-page.png', fullPage: true });
    console.log('✅ Screenshot saved: cattle-management-page.png');
  }

  console.log('✅ Navigation test completed!');
});