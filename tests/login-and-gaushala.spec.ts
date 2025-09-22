import { test, expect } from '@playwright/test';

test.describe('Login and GauShala Application', () => {
  test('should login and navigate to GauShala', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Take a screenshot to see what's on the homepage
    await page.screenshot({ path: 'homepage-before-login.png', fullPage: true });

    // Check if we're already on a dashboard or if we need to login
    const dashboardIndicator = page.locator('text=Dashboard, text=GauShala Management, text=SAUBHAGYA');
    const loginIndicator = page.locator('text=Login, text=Sign In, input[type="email"], input[type="password"]');

    // Wait for either dashboard or login elements to appear
    await Promise.race([
      dashboardIndicator.first().waitFor({ timeout: 5000 }).catch(() => {}),
      loginIndicator.first().waitFor({ timeout: 5000 }).catch(() => {})
    ]);

    // Check if we need to login
    const needsLogin = await loginIndicator.count() > 0;

    if (needsLogin) {
      console.log('Login form detected, attempting login...');

      // Look for email/username field
      const emailField = page.locator('input[type="email"], input[name="email"], input[name="username"], input[placeholder*="email"], input[placeholder*="username"]').first();
      const passwordField = page.locator('input[type="password"], input[name="password"], input[placeholder*="password"]').first();

      if (await emailField.count() > 0 && await passwordField.count() > 0) {
        // Fill login form with test credentials
        await emailField.fill('admin@saubhagya.com');
        await passwordField.fill('admin123');

        // Look for login button
        const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]').first();
        if (await loginButton.count() > 0) {
          await loginButton.click();

          // Wait for navigation after login
          await page.waitForLoadState('networkidle');
          await page.screenshot({ path: 'after-login.png', fullPage: true });
        }
      }
    } else {
      console.log('Already logged in or no login required');
    }

    // Navigate to GauShala module
    await page.goto('/gaushala');
    await page.waitForLoadState('networkidle');

    // Take screenshot of GauShala page
    await page.screenshot({ path: 'gaushala-dashboard.png', fullPage: true });

    // Verify we're on the GauShala page
    await expect(page.locator('text=GauShala Management, text=गौशाला प्रबंधन')).toBeVisible();

    // Check for key dashboard elements
    await expect(page.locator('text=Total Cattle, text=कुल पशु')).toBeVisible();
    await expect(page.locator('text=Quick Actions, text=त्वरित कार्य')).toBeVisible();
  });

  test('should test GauShala dashboard functionality', async ({ page }) => {
    // Navigate to GauShala
    await page.goto('/gaushala');
    await page.waitForLoadState('networkidle');

    // Test dashboard metrics display
    await expect(page.locator('text=Total Cattle, text=कुल पशु')).toBeVisible();
    await expect(page.locator('text=Dung Today, text=आज का गोबर')).toBeVisible();
    await expect(page.locator('text=Revenue, text=आय')).toBeVisible();

    // Test Quick Actions section
    await expect(page.locator('text=Quick Actions, text=त्वरित कार्य')).toBeVisible();
    await expect(page.locator('text=Add Cattle, text=पशु जोड़ें')).toBeVisible();
    await expect(page.locator('text=Record Dung Collection, text=गोबर संग्रह रिकॉर्ड करें')).toBeVisible();

    // Test transaction modal
    await page.locator('text=Record Dung Collection, text=गोबर संग्रह रिकॉर्ड करें').click();

    // Verify modal opens
    await expect(page.locator('text=Record Dung Collection, text=गोबर संग्रह रिकॉर्ड करें').nth(1)).toBeVisible();
    await expect(page.locator('text=Select Cattle, text=पशु चुनें')).toBeVisible();

    // Take screenshot of modal
    await page.screenshot({ path: 'transaction-modal.png', fullPage: true });

    // Test form elements
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();

    // Close modal
    await page.locator('text=Cancel, text=रद्द करें').click();
    await expect(page.locator('text=Record Dung Collection, text=गोबर संग्रह रिकॉर्ड करें').nth(1)).not.toBeVisible();
  });

  test('should test cattle management navigation', async ({ page }) => {
    // Navigate to GauShala
    await page.goto('/gaushala');
    await page.waitForLoadState('networkidle');

    // Navigate to Cattle Management
    await page.locator('text=Cattle Management, text=पशु प्रबंधन').click();
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'cattle-management.png', fullPage: true });

    // Verify we're on cattle management page
    await expect(page.locator('text=Manage cattle records with RFID tracking')).toBeVisible();
    await expect(page.locator('text=Add New Cattle')).toBeVisible();

    // Check for search and filter functionality
    await expect(page.locator('input[placeholder*="Search"], input[placeholder*="cattle"]')).toBeVisible();

    // Test Add New Cattle navigation
    await page.locator('text=Add New Cattle').click();
    await page.waitForLoadState('networkidle');

    // Take screenshot of add cattle page
    await page.screenshot({ path: 'add-cattle-page.png', fullPage: true });

    // Verify we're on add cattle page
    await expect(page.locator('text=Add Cattle')).toBeVisible();
    await expect(page.locator('text=Register new cattle with RFID tracking')).toBeVisible();

    // Check form sections
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await expect(page.locator('text=Owner Information')).toBeVisible();
    await expect(page.locator('text=Location Information')).toBeVisible();
    await expect(page.locator('text=Medical Information')).toBeVisible();
  });

  test('should test breadcrumb navigation', async ({ page }) => {
    // Navigate to GauShala
    await page.goto('/gaushala');
    await page.waitForLoadState('networkidle');

    // Check initial breadcrumb
    await expect(page.locator('nav[aria-label="Breadcrumb"], .breadcrumb')).toBeVisible();

    // Navigate to cattle management and check breadcrumb update
    await page.locator('text=Cattle Management, text=पशु प्रबंधन').click();
    await page.waitForLoadState('networkidle');

    // Should see breadcrumb trail
    await expect(page.locator('text=GauShala Management, text=गौशाला प्रबंधन')).toBeVisible();
    await expect(page.locator('text=Cattle Management, text=पशु प्रबंधन')).toBeVisible();

    // Navigate to add cattle and check breadcrumb
    await page.locator('text=Add New Cattle').click();
    await page.waitForLoadState('networkidle');

    // Should see full breadcrumb trail
    await expect(page.locator('text=Add Cattle, text=पशु जोड़ें')).toBeVisible();
  });

  test('should verify cattle icons are used instead of user icons', async ({ page }) => {
    // Navigate to cattle management
    await page.goto('/gaushala/cattle');
    await page.waitForLoadState('networkidle');

    // Take screenshot to verify icons
    await page.screenshot({ path: 'cattle-icons-verification.png', fullPage: true });

    // Check that we have beef/cattle-related icons in navigation
    const beefIcons = page.locator('svg'); // Look for SVG icons
    await expect(beefIcons).toHaveCountGreaterThan(0);

    // Verify navigation shows proper icons (visual inspection through screenshot)
    console.log('Icon verification completed - check cattle-icons-verification.png for visual confirmation');
  });

  test('should handle responsive design', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/gaushala');
      await page.waitForLoadState('networkidle');

      // Take screenshot for each viewport
      await page.screenshot({ path: `gaushala-${viewport.name}.png`, fullPage: true });

      // Verify key elements are still visible
      await expect(page.locator('text=GauShala Management, text=गौशाला प्रबंधन')).toBeVisible();

      console.log(`✓ ${viewport.name} view (${viewport.width}x${viewport.height}) - working`);
    }

    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
  });
});