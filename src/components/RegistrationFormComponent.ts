import { expect, Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class RegistrationFormComponent extends BaseComponent {
  // Form elements
  readonly nameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly registerButton: Locator;

  // Errors - form validation
  readonly nameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly repeatPasswordError: Locator;

  constructor(page: Page) {
    const root = page.locator('.modal-content'); 
    super(page, root);

    // this.root.locator()
    this.nameInput = this.root.locator('#signupName');
    this.lastNameInput = this.root.locator('#signupLastName');
    this.emailInput = this.root.locator('#signupEmail');
    this.passwordInput = this.root.locator('#signupPassword');
    this.repeatPasswordInput = this.root.locator('#signupRepeatPassword');
    this.registerButton = this.root.getByRole('button', { name: 'Register' });

    this.nameError = this.root.locator('#signupName + .invalid-feedback');
    this.lastNameError = this.root.locator('#signupLastName + .invalid-feedback');
    this.emailError = this.root.locator('#signupEmail + .invalid-feedback');
    this.passwordError = this.root.locator('#signupPassword + .invalid-feedback');
    this.repeatPasswordError = this.root.locator('#signupRepeatPassword + .invalid-feedback');
  }

  // Methods
  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillRepeatPassword(password: string) {
    await this.repeatPasswordInput.fill(password);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  // Success registration
  async register(name: string, lastName: string, email: string, password: string) {
    await this.fillName(name);
    await this.fillLastName(lastName);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillRepeatPassword(password);
    await this.clickRegisterButton();
  }

  // Assertions
  async expectRegisterButtonToBeDisabled() {
    await expect(this.registerButton).toBeDisabled();
  }

  async expectRegisterButtonToBeEnabled() {
    await expect(this.registerButton).toBeEnabled();
  }

  async expectNameErrorToHaveText(text: string) {
    await expect(this.nameError).toHaveText(text);
  }

  async expectLastNameErrorToHaveText(text: string) {
    await expect(this.lastNameError).toHaveText(text);
  }

  async expectEmailErrorToHaveText(text: string) {
    await expect(this.emailError).toHaveText(text);
  }

  async expectRepeatPasswordErrorToHaveText(text: string) {
    await expect(this.repeatPasswordError).toHaveText(text);
  }

  async expectPasswordErrorToContainText(text: string) {
    await expect(this.passwordError).toContainText(text);
  }
}