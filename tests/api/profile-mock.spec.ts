import { test, expect } from '@playwright/test';

test.describe('Profile UI Mocking', () => {

  test('Should mock profile data and display it on the UI', async ({ page }) => {
    const mockedProfileData = {
      status: "ok",
      data: {
        userId: 12345,
        photoFilename: "default-user.png",
        name: "John",
        lastName: "Doe"
      }
    };

    await page.route('**/api/users/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedProfileData),
      });
    });

    await page.goto('/panel/profile');

    const profileNameElement = page.locator('.profile_name'); 

    await expect(profileNameElement).toBeVisible();
  });
  
});