import { test, expect } from '@playwright/test';
import { validCarData, invalidCarData } from '../test-data/cars.data';

test.describe('Create cars POST', () => {
  let apiHeaders: Record<string, string> = {};

  test.beforeAll(async ({ playwright }) => {
    const basicAuth = Buffer.from('guest:welcome2qauto').toString('base64');
    
    const requestContext = await playwright.request.newContext({
      baseURL: 'https://qauto.forstudy.space',
      extraHTTPHeaders: {
        'Authorization': `Basic ${basicAuth}`
      }
    });

    const loginResponse = await requestContext.post('/api/auth/signin', {
      data: {
        email: process.env.USER_EMAIL || 'kureninovavika2@gmail.com',
        password: process.env.USER_PASSWORD || 'Test1234A',
        remember: false
      }
    });

    expect(loginResponse.status()).toBe(200);

    const setCookieHeader = loginResponse.headers()['set-cookie'] || '';
    const sidCookie = setCookieHeader.split(';')[0]; 

    apiHeaders = {
      'Authorization': `Basic ${basicAuth}`,
      'Cookie': sidCookie,
      'Content-Type': 'application/json'
    };
  });

  // Positive scenario
  test('Should successfully create a car with valid data', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: validCarData,
      headers: apiHeaders
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
      data: invalidCarData.missingMileage,
      headers: apiHeaders
    });

    expect(response.status()).toBe(400);
    
    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toBe('Mileage is required');
  });

  // Negative scenario #2 (non-existing car model)
  test('Should return 404 error for non-existing car model', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: invalidCarData.nonExistingModel,
      headers: apiHeaders
    });

    expect(response.status()).toBe(404);

    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toContain('not found');
  });
  
});