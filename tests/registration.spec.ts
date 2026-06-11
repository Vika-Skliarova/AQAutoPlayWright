import { test, expect } from '@playwright/test';

test.describe('Registration form', () => {

    test('Negative validations for registration fields', async ({ page }) => {
        await page.goto('/');

        const logoutBtn = page.locator('nav >> text=Logout').or(page.locator('button:has-text("Logout")'));
        if (await logoutBtn.isVisible()) {
            await logoutBtn.click();
            await page.goto('/');
        }

        await page.getByRole('button', { name: 'Sign up' }).click();

        const nameInput = page.locator('#signupName');
        const nameError = page.locator('#signupName + .invalid-feedback');
        const emailInput = page.locator('#signupEmail');
        const emailError = page.locator('#signupEmail + .invalid-feedback');
        const lastNameInput = page.locator('#signupLastName');
        const lastNameError = page.locator('#signupLastName + .invalid-feedback');
        const passwordInput = page.locator('#signupPassword');
        const passwordError = page.locator('#signupPassword + .invalid-feedback');
        const repeatPasswordInput = page.locator('#signupRepeatPassword');
        const repeatPasswordError = page.locator('#signupRepeatPassword + .invalid-feedback');
        const registerBtn = page.getByRole('button', { name: 'Register' });

        await nameInput.focus();
        await nameInput.blur();
        await expect(nameError).toHaveText('Name required');
        await expect(nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

        await emailInput.fill('wrong-email');
        await emailInput.blur();
        await expect(emailError).toHaveText('Email is incorrect');

        await lastNameInput.fill('VeryLongLastNameTheLimitOfCharacters');
        await lastNameInput.blur();
        await expect(lastNameError).toHaveText('Last name has to be from 2 to 20 characters long');

        await passwordInput.fill('Password123');
        await repeatPasswordInput.fill('Password999');
        await repeatPasswordInput.blur();
        await expect(repeatPasswordError).toHaveText('Passwords do not match');

        await passwordInput.fill('12345678');
        await passwordInput.blur();
        await expect(passwordError).toContainText('Password has to be from 8 to 15 characters long');
        await expect(passwordError).toContainText('contain at least one integer, one capital, and one small letter');
        
        await expect(registerBtn).toBeDisabled();
    });

    test('Positive: success registration', async ({ page }) => {
        await page.goto('/');

        const logoutBtn = page.locator('nav >> text=Logout').or(page.locator('button:has-text("Logout")'));
        if (await logoutBtn.isVisible()) {
            await logoutBtn.click();
            await page.goto('/');
        }

        await page.getByRole('button', { name: 'Sign up' }).click();

        const uniqueEmail = `aqa-user${Date.now()}@test.com`;
        const nameInput = page.locator('#signupName');
        const lastNameInput = page.locator('#signupLastName');
        const emailInput = page.locator('#signupEmail');
        const passwordInput = page.locator('#signupPassword');
        const repeatPasswordInput = page.locator('#signupRepeatPassword');
        const registerBtn = page.getByRole('button', { name: 'Register' });

        await nameInput.fill('User');
        await lastNameInput.fill('Tester');
        await emailInput.fill(uniqueEmail);
        await passwordInput.fill('Password123');
        await repeatPasswordInput.fill('Password123');

        await expect(registerBtn).toBeEnabled();
        await registerBtn.click();

        await expect(page).toHaveURL(/.*panel/);
    });
});