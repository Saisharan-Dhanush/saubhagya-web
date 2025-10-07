import { test, expect } from '@playwright/test';

test.describe('Farmer Login Test', () => {
  test('should login with farmer credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3007');

    console.log('✅ Navigated to login page');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take screenshot of login page
    await page.screenshot({ path: 'login-page.png', fullPage: true });
    console.log('✅ Screenshot taken: login-page.png');

    // Find phone number input field
    const phoneField = page.locator('input[type="tel"]');
    await expect(phoneField).toBeVisible();
    console.log('✅ Phone field is visible');

    // Find password input field
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();
    console.log('✅ Password field is visible');

    // Fill in the farmer credentials
    await phoneField.fill('+919123456789');
    console.log('✅ Entered phone: +919123456789');

    await passwordField.fill('Farmer123!');
    console.log('✅ Entered password: Farmer123!');

    // Take screenshot before clicking login
    await page.screenshot({ path: 'before-login.png', fullPage: true });
    console.log('✅ Screenshot taken: before-login.png');

    // Click login button
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    console.log('✅ Clicked login button');

    // Wait for navigation or response
    await page.waitForTimeout(3000); // Give time for login to process

    // Take screenshot after login attempt
    await page.screenshot({ path: 'after-login.png', fullPage: true });
    console.log('✅ Screenshot taken: after-login.png');

    // Check current URL
    const currentUrl = page.url();
    console.log('✅ Current URL:', currentUrl);

    // Check if we're redirected away from login (successful login)
    if (currentUrl !== 'http://localhost:3007/' && currentUrl !== 'http://localhost:3007/login') {
      console.log('✅ LOGIN SUCCESSFUL - Redirected to:', currentUrl);

      // Wait for dashboard to load
      await page.waitForLoadState('networkidle');

      // Take final screenshot
      await page.screenshot({ path: 'dashboard-after-login.png', fullPage: true });
      console.log('✅ Screenshot taken: dashboard-after-login.png');

    } else {
      console.log('⚠️ Still on login page - checking for errors...');

      // Check for error messages
      const errorMessage = await page.locator('text=/error|failed|invalid/i').count();
      if (errorMessage > 0) {
        const errorText = await page.locator('text=/error|failed|invalid/i').first().textContent();
        console.log('❌ Error message found:', errorText);
      } else {
        console.log('⚠️ No specific error message found');
      }
    }

    // Print page content for debugging
    const bodyText = await page.locator('body').textContent();
    console.log('📄 Page content snippet:', bodyText?.substring(0, 500));
  });
});
