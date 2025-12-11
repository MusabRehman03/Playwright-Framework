import { test, expect } from '@playwright/test';
import { Logger } from '../utils/Logger';
import { retry } from '../utils/helpers';

/**
 * API Testing Examples
 * Demonstrates API testing capabilities with Playwright
 */
test.describe('API Tests', () => {
  const BASE_API_URL = 'https://jsonplaceholder.typicode.com';

  test('GET request - fetch users', async ({ request }) => {
    Logger.step(1, 'Send GET request to /users');
    const response = await request.get(`${BASE_API_URL}/users`);

    Logger.step(2, 'Verify response status');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    Logger.step(3, 'Verify response body');
    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
  });

  test('POST request - create user', async ({ request }) => {
    Logger.step(1, 'Prepare request payload');
    const newUser = {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
    };

    Logger.step(2, 'Send POST request');
    const response = await request.post(`${BASE_API_URL}/users`, {
      data: newUser,
    });

    Logger.step(3, 'Verify response');
    expect(response.status()).toBe(201);

    const createdUser = await response.json();
    expect(createdUser).toMatchObject(newUser);
    expect(createdUser.id).toBeDefined();
  });

  test('PUT request - update user', async ({ request }) => {
    Logger.step(1, 'Prepare update payload');
    const updatedData = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    Logger.step(2, 'Send PUT request');
    const response = await retry(async () => {
      const putResponse = await request.put(`${BASE_API_URL}/users/1`, {
        data: updatedData,
        timeout: 10_000,
      });

      if (!putResponse.ok()) {
        throw new Error(`Unexpected response: ${putResponse.status()}`);
      }

      return putResponse;
    });

    Logger.step(3, 'Verify response');
    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    expect(result.name).toBe(updatedData.name);
  });

  test('DELETE request - delete user', async ({ request }) => {
    Logger.step(1, 'Send DELETE request');
    const response = await request.delete(`${BASE_API_URL}/users/1`);

    Logger.step(2, 'Verify response');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('Response headers validation', async ({ request }) => {
    Logger.step(1, 'Send request and get headers');
    const response = await request.get(`${BASE_API_URL}/users/1`);

    Logger.step(2, 'Verify headers');
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('Response time validation', async ({ request }) => {
    Logger.step(1, 'Measure response time');
    const startTime = Date.now();
    await request.get(`${BASE_API_URL}/users`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    Logger.step(2, 'Verify response time is acceptable');
    expect(responseTime).toBeLessThan(3000); // Less than 3 seconds
  });
});
