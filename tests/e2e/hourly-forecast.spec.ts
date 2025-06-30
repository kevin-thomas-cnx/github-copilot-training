import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000/api/v1/forecast/hourly';

test.describe('Hourly Forecast API', () => {
  test('returns 200 and hourly data for valid lat/lon', async ({ request }) => {
    const res = await request.get(`${API_URL}?lat=37.7749&lon=-122.4194`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.hourly)).toBe(true);
    expect(data.hourly.length).toBeGreaterThan(0);
    expect(data.hourly[0]).toHaveProperty('time');
    expect(data.hourly[0]).toHaveProperty('temperature');
    expect(data.hourly[0]).toHaveProperty('precipitation');
    expect(data.hourly[0]).toHaveProperty('condition');
  });

  test('returns 400 for missing lat/lon', async ({ request }) => {
    const res = await request.get(`${API_URL}`);
    expect(res.status()).toBe(400);
  });

  test('returns 400 for invalid lat/lon', async ({ request }) => {
    const res = await request.get(`${API_URL}?lat=foo&lon=bar`);
    expect(res.status()).toBe(400);
  });
});
