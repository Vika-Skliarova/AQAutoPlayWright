import { test, expect } from '../src/fixtures/userGarage';

test.describe('Garage Tests', () => {
  test('Positive: should open garage with saved storage state', async ({ userGaragePage }) => {
    await expect(userGaragePage.addCarButton).toBeVisible();
  });
});