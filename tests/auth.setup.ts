import { test, expect } from '@playwright/test';

const authFile = '.auth/userState.json';

test('login and save auth state', async ({ page }) => {
  await page.goto('/');

  const signInButton = page.getByRole('button', { name: 'Sign In' });
  await signInButton.waitFor({ state: 'visible', timeout: 10000 });
  await signInButton.click();

  await page.locator('#signinEmail').fill(process.env.USER_EMAIL!);
  await page.locator('#signinPassword').fill(process.env.USER_PASSWORD!);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/panel\/garage/, { timeout: 10000 });

  await page.context().storageState({ path: authFile });
});