import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class GaragePage extends BasePage {
  readonly addCarButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addCarButton = page.getByRole('button', { name: 'Add car' });
  }

  async expectGaragePageIsLoaded() {
    await expect(this.addCarButton).toBeVisible();
  }
}