import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/v1/forecast/hourly';
import * as forecastService from '@/lib/services/forecastService';
import { HttpError } from '@/lib/utils/errors';

describe('/api/v1/forecast/hourly API route', () => {
  const mockForecast = {
    hourly: [
      { time: '2025-06-17T00:00:00Z', temperature: 22, precipitation: 0, condition: 'Clear' },
    ],
  };

  beforeEach(() => {
    jest.spyOn(forecastService, 'fetchHourlyForecast').mockResolvedValue(mockForecast);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 200 and hourly data for valid params', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { lat: '40.7', lon: '-74.0' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockForecast);
  });

  it('returns 405 for non-GET methods', async () => {
    const { req, res } = createMocks({ method: 'POST', query: { lat: '40.7', lon: '-74.0' } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toContain('Method POST Not Allowed');
  });

  it('returns 400 if lat is missing', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { lon: '-74.0' } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain('lat and lon are required');
  });

  it('returns 400 if lon is missing', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { lat: '40.7' } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain('lat and lon are required');
  });

  it('returns 400 if lat or lon is not a string', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { lat: 40.7, lon: -74.0 } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain('lat and lon must be provided as strings');
  });

  it('returns 400 if lat or lon is not a number', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { lat: 'foo', lon: 'bar' } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain('lat and lon must be valid numbers');
  });

  it('returns 502 if fetchHourlyForecast throws HttpError 502', async () => {
    jest.spyOn(forecastService, 'fetchHourlyForecast').mockRejectedValue(new HttpError(502, 'Upstream error'));
    const { req, res } = createMocks({ method: 'GET', query: { lat: '40.7', lon: '-74.0' } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(502);
  });

  it('returns 500 on unexpected error', async () => {
    jest.spyOn(forecastService, 'fetchHourlyForecast').mockRejectedValue(new Error('fail'));
    const { req, res } = createMocks({ method: 'GET', query: { lat: '40.7', lon: '-74.0' } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toContain('Internal Server Error');
  });
});
