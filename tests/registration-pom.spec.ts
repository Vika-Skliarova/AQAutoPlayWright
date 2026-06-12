import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/MainPage';
import { RegistrationFormComponent } from '../src/components/RegistrationFormComponent';

test.describe.skip('Registration form', () => {
    let mainPage: MainPage;
    let regForm: RegistrationFormComponent;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        regForm = new RegistrationFormComponent(page);

        await mainPage.openMainPage();
        await mainPage.openRegistrationModal();
    });

    test('Positive: success registration', async ({ page }) => {
        const uniqueEmail = `aqa-user${Date.now()}@test.com`;
        const password = process.env.REG_PASSWORD || '';

        await regForm.register('User', 'Tester', uniqueEmail, password);

        await expect(page).toHaveURL(/.*panel/);
    });

    test('Negative: empty name validation', async () => {
        await regForm.nameInput.focus();
        await regForm.nameInput.blur();

        await regForm.expectNameErrorToHaveText('Name required');
        await expect(regForm.nameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await regForm.expectRegisterButtonToBeDisabled();
    });

    test('Negative: incorrect email format', async () => {
        await regForm.fillEmail('wrong-email');
        await regForm.emailInput.blur();

        await regForm.expectEmailErrorToHaveText('Email is incorrect');
        await regForm.expectRegisterButtonToBeDisabled();
    });

    test('Negative: last name exceeds max length', async () => {
        await regForm.fillLastName('VeryLongLastNameTheLimitOfCharacters');
        await regForm.lastNameInput.blur();

        await regForm.expectLastNameErrorToHaveText('Last name has to be from 2 to 20 characters long');
        await regForm.expectRegisterButtonToBeDisabled();
    });

    test('Negative: passwords do not match', async () => {
        await regForm.fillPassword('Password123');
        await regForm.fillRepeatPassword('Password999');
        await regForm.repeatPasswordInput.blur();

        await regForm.expectRepeatPasswordErrorToHaveText('Passwords do not match');
        await regForm.expectRegisterButtonToBeDisabled();
    });

    test('Negative: password strength validation (only numbers)', async () => {
        await regForm.fillPassword('12345678');
        await regForm.passwordInput.blur();

        await regForm.expectPasswordErrorToContainText('Password has to be from 8 to 15 characters long');
        await regForm.expectPasswordErrorToContainText('contain at least one integer, one capital, and one small letter');
        await regForm.expectRegisterButtonToBeDisabled();
    });
});