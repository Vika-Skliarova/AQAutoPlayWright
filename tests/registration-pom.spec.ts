import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/MainPage';
import { RegistrationFormComponent } from '../src/components/RegistrationFormComponent';

test.describe('Registration form', () => {

    test('Negative validations for registration fields', async ({ page }) => {
        const mainPage = new MainPage(page);
        const regForm = new RegistrationFormComponent(page);

        await page.goto('/');

        const logoutBtn = page.locator('nav >> text=Logout').or(page.locator('button:has-text("Logout")'));
        if (await logoutBtn.isVisible()) {
            await logoutBtn.click();
            await page.goto('/');
        }

        await mainPage.openRegistrationModal();

        await regForm.nameInput.focus();
        await regForm.nameInput.blur();
        await regForm.expectNameErrorToHaveText('Name required');
        await expect(regForm.nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');

        await regForm.fillEmail('wrong-email');
        await regForm.emailInput.blur();
        await regForm.expectEmailErrorToHaveText('Email is incorrect');

        await regForm.fillLastName('VeryLongLastNameTheLimitOfCharacters');
        await regForm.lastNameInput.blur();
        await regForm.expectLastNameErrorToHaveText('Last name has to be from 2 to 20 characters long');

        await regForm.fillPassword('Password123');
        await regForm.fillRepeatPassword('Password999');
        await regForm.repeatPasswordInput.blur();
        await regForm.expectRepeatPasswordErrorToHaveText('Passwords do not match');

        await regForm.fillPassword('12345678');
        await regForm.passwordInput.blur();
        await regForm.expectPasswordErrorToContainText('Password has to be from 8 to 15 characters long');
        
        await regForm.expectRegisterButtonToBeDisabled();
    });

    test('Positive: success registration', async ({ page }) => {
        const mainPage = new MainPage(page);
        const regForm = new RegistrationFormComponent(page);

        await page.goto('/');

        const logoutBtn = page.locator('nav >> text=Logout').or(page.locator('button:has-text("Logout")'));
        if (await logoutBtn.isVisible()) {
            await logoutBtn.click();
            await page.goto('/');
        }

        await mainPage.openRegistrationModal();

        const uniqueEmail = `aqa-user${Date.now()}@test.com`;
        const password = process.env.REG_PASSWORD || '';

        await regForm.register('User', 'Tester', uniqueEmail, password);
        await expect(page).toHaveURL(/.*panel/);
    });
});