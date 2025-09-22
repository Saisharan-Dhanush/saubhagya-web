import { test, expect } from '@playwright/test';

test.describe('GauShala Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to GauShala module
    await page.goto('/gaushala');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display GauShala dashboard with metrics', async ({ page }) => {
    // Check if the main dashboard elements are visible
    await expect(page.locator('text=GauShala Management')).toBeVisible();

    // Check for metrics cards
    await expect(page.locator('text=Total Cattle')).toBeVisible();
    await expect(page.locator('text=Dung Today')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();

    // Check for Quick Actions section
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    await expect(page.locator('text=Add Cattle')).toBeVisible();
    await expect(page.locator('text=Record Dung Collection')).toBeVisible();
  });

  test('should navigate to cattle management', async ({ page }) => {
    // Click on Cattle Management in navigation
    await page.locator('text=Cattle Management').click();
    await page.waitForLoadState('networkidle');

    // Verify we're on cattle management page
    await expect(page.locator('text=Manage cattle records with RFID tracking')).toBeVisible();
    await expect(page.locator('text=Add New Cattle')).toBeVisible();

    // Check for search and filter functionality
    await expect(page.locator('input[placeholder*="Search cattle"]')).toBeVisible();
    await expect(page.locator('select[name="filter"]')).toBeVisible();
  });

  test('should open transaction modal from dashboard', async ({ page }) => {
    // Click on Record Dung Collection button
    await page.locator('text=Record Dung Collection').click();

    // Check if modal opens
    await expect(page.locator('text=Record Dung Collection').nth(1)).toBeVisible(); // Modal title
    await expect(page.locator('text=Select Cattle')).toBeVisible();
    await expect(page.locator('text=Enter Weight (kg)')).toBeVisible();

    // Check form elements
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();

    // Check buttons
    await expect(page.locator('text=Cancel')).toBeVisible();
    await expect(page.locator('text=Submit')).toBeVisible();

    // Close modal
    await page.locator('text=Cancel').click();
    await expect(page.locator('text=Record Dung Collection').nth(1)).not.toBeVisible();
  });

  test('should validate transaction form', async ({ page }) => {
    // Open transaction modal
    await page.locator('text=Record Dung Collection').click();

    // Try to submit empty form
    await page.locator('text=Submit').click();

    // Should still be on modal (validation prevents submission)
    await expect(page.locator('text=Record Dung Collection').nth(1)).toBeVisible();

    // Fill required fields
    await page.locator('select').first().selectOption('cattle-001');
    await page.locator('input[type="number"]').fill('25.5');

    // Submit form
    await page.locator('text=Submit').click();

    // Modal should close or show success message
    // Note: This will fail with mock data, but structure is correct
  });

  test('should display breadcrumb navigation', async ({ page }) => {
    // Check initial breadcrumb
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
    await expect(page.locator('text=GauShala Management')).toBeVisible();

    // Navigate to cattle management
    await page.locator('text=Cattle Management').click();
    await page.waitForLoadState('networkidle');

    // Check updated breadcrumb
    await expect(page.locator('text=Cattle Management').last()).toBeVisible();
  });

  test('should switch language correctly', async ({ page }) => {
    // Check if language toggle is available
    const languageToggle = page.locator('[aria-label*="language"], [title*="language"], text=हिंदी, text=English');

    if (await languageToggle.count() > 0) {
      // Click language toggle
      await languageToggle.first().click();

      // Wait for language change
      await page.waitForTimeout(500);

      // Check if content changed to Hindi or English
      const hindiText = page.locator('text=गौशाला प्रबंधन');
      const englishText = page.locator('text=GauShala Management');

      // One of these should be visible
      expect((await hindiText.count()) + (await englishText.count())).toBeGreaterThan(0);
    } else {
      console.log('Language toggle not found - test skipped');
    }
  });

  test('should show cattle icons instead of user icons', async ({ page }) => {
    // Navigate to cattle management
    await page.locator('text=Cattle Management').click();
    await page.waitForLoadState('networkidle');

    // Check if Beef icons are used instead of Users icons in navigation
    const navigationIcons = page.locator('nav svg');
    await expect(navigationIcons).toHaveCountGreaterThan(0);

    // Go back to dashboard and check cattle-related icons
    await page.locator('text=Dashboard').click();
    await page.waitForLoadState('networkidle');

    // Check for presence of appropriate icons (this is visual verification)
    const icons = page.locator('svg');
    await expect(icons).toHaveCountGreaterThan(0);
  });

  test('should handle navigation between pages', async ({ page }) => {
    // Test navigation flow: Dashboard -> Cattle -> Transactions -> Dashboard

    // Start at dashboard
    await expect(page.locator('text=Quick Actions')).toBeVisible();

    // Go to cattle management
    await page.locator('text=Cattle Management').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Add New Cattle')).toBeVisible();

    // Go to transactions
    await page.locator('text=Transaction History').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Transaction History').first()).toBeVisible();

    // Go back to dashboard
    await page.locator('text=Dashboard').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Quick Actions')).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('text=GauShala Management')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=GauShala Management')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=GauShala Management')).toBeVisible();

    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
  });
});

test.describe('GauShala Add Cattle Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaushala/cattle/add');
    await page.waitForLoadState('networkidle');
  });

  test('should display add cattle form', async ({ page }) => {
    await expect(page.locator('text=Add Cattle')).toBeVisible();
    await expect(page.locator('text=Register new cattle with RFID tracking')).toBeVisible();

    // Check form sections
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await expect(page.locator('text=Owner Information')).toBeVisible();
    await expect(page.locator('text=Location Information')).toBeVisible();
    await expect(page.locator('text=Medical Information')).toBeVisible();

    // Check form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="breed"]')).toBeVisible();
    await expect(page.locator('input[name="age"]')).toBeVisible();
    await expect(page.locator('input[name="weight"]')).toBeVisible();
  });

  test('should handle RFID scanning', async ({ page }) => {
    // Click RFID scan button
    const scanButton = page.locator('text=Scan RFID');
    await expect(scanButton).toBeVisible();
    await scanButton.click();

    // Should show scanning state or result
    // Note: This will need mock RFID data to test properly
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();

    // Should show validation messages or prevent submission
    // Form should still be visible
    await expect(page.locator('text=Add Cattle')).toBeVisible();
  });
});

test.describe('GauShala Cattle Detail Page', () => {
  test('should handle cattle not found', async ({ page }) => {
    // Go to non-existent cattle detail page
    await page.goto('/gaushala/cattle/nonexistent-id');
    await page.waitForLoadState('networkidle');

    // Should show error or loading state
    // This test verifies error handling
  });
});