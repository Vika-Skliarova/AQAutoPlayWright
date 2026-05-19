import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MainPage extends BasePage {
  readonly signUpButton: Locator;

  constructor(page: Page) {
    super(page); 
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
  }

  async openMainPage() {
    await this.open('/'); 
  }

  async openRegistrationModal() {
    await this.signUpButton.click();
  }
}