import { test, expect } from '@playwright/test';
// Import the data for valid and invalid car creation acenarios
import { validCarData, invalidCarData } from '../test-data/cars.data';

test.describe('Create cars POST', () => {

// Positive scenario
  test('Should successfully create a car with valid data', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: validCarData
    });

    expect(response.status()).toBe(201);
    
    const responseBody = await response.json();
    expect(responseBody.status).toBe('ok');
    expect(responseBody.data.carBrandId).toBe(validCarData.carBrandId);
    expect(responseBody.data.carModelId).toBe(validCarData.carModelId);
    expect(responseBody.data.mileage).toBe(validCarData.mileage);
  });

  // Negative scenario #1 (missing mileage)
  test('Should return 400 error when mileage is missing', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: invalidCarData.missingMileage
    });

    expect(response.status()).toBe(400);
    
    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toBe('Mileage is required');
  });

  // Negative scenario #2 (non-existing car model)
  test('Should return 404 error for non-existing car model', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: invalidCarData.nonExistingModel
    });

    expect(response.status()).toBe(404);

    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toContain('not found');
  });
  
});