import { test, expect } from '@playwright/test';

test.describe.skip('Registration form', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        await page.getByRole('button', { name: 'Sign up' }).click();
    });

    test('Positive: success registration', async ({ page }) => {
        const uniqueEmail = `aqa-user${Date.now()}@test.com`;

        // Locators
        const nameInput = page.locator('#signupName');
        const lastNameInput = page.locator('#signupLastName');
        const emailInput = page.locator('#signupEmail');
        const passwordInput = page.locator('#signupPassword');
        const repeatPasswordInput = page.locator('#signupRepeatPassword');
        const registerBtn = page.getByRole('button', { name: 'Register' });

        // Actions
        await nameInput.fill('User');
        await lastNameInput.fill('Tester');
        await emailInput.fill(uniqueEmail);
        await passwordInput.fill('Password123');
        await repeatPasswordInput.fill('Password123');

        await expect(registerBtn).toBeEnabled();
        await registerBtn.click();

        await expect(page).toHaveURL(/.*panel/);
    });

    test('Negative: empty name validation', async ({ page }) => {
        const nameInput = page.locator('#signupName');
        const error = page.locator('#signupName + .invalid-feedback');
        const registerBtn = page.getByRole('button', { name: 'Register' });

        await nameInput.focus();
        await nameInput.blur();

        await expect(error).toHaveText('Name required');
        await expect(nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(registerBtn).toBeDisabled();
    });

    test('Negative: incorrect email format', async ({ page }) => {
        const emailInput = page.locator('#signupEmail');
        const error = page.locator('#signupEmail + .invalid-feedback');
        const registerBtn = page.getByRole('button', { name: 'Register' });

        await emailInput.fill('wrong-email');
        await emailInput.blur();

        await expect(error).toHaveText('Email is incorrect');
        await expect(registerBtn).toBeDisabled();
    });

    test('Negative: last name exceeds max length', async ({ page }) => {
        const lastNameInput = page.locator('#signupLastName');
        const error = page.locator('#signupLastName + .invalid-feedback');
        const registerBtn = page.getByRole('button', { name: 'Register' });

        await lastNameInput.fill('VeryLongLastNameTheLimitOfCharacters');
        await lastNameInput.blur();

        await expect(error).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(registerBtn).toBeDisabled();
    });

    test('Negative: passwords do not match', async ({ page }) => {
        const passwordInput = page.locator('#signupPassword');
        const repeatPasswordInput = page.locator('#signupRepeatPassword');
        const error = page.locator('#signupRepeatPassword + .invalid-feedback');
        const registerBtn = page.getByRole('button', { name: 'Register' });

        await passwordInput.fill('Password123');
        await repeatPasswordInput.fill('Password999');
        await repeatPasswordInput.blur();

        await expect(error).toHaveText('Passwords do not match');
        await expect(registerBtn).toBeDisabled();
    });

    test('Negative: password strength validation (only numbers)', async ({ page }) => {
        const passwordInput = page.locator('#signupPassword');
        const error = page.locator('#signupPassword + .invalid-feedback');
        const registerBtn = page.getByRole('button', { name: 'Register' });

        await passwordInput.fill('12345678');
        await passwordInput.blur();

        await expect(error).toContainText('Password has to be from 8 to 15 characters long');
        await expect(error).toContainText('contain at least one integer, one capital, and one small letter');
        await expect(registerBtn).toBeDisabled();
    });
});