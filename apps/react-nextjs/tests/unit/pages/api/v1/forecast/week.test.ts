import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/v1/forecast/week';
import { fetchWeeklyForecast, ForecastData } from '@/lib/services/forecastService';
import { HttpError } from '@/lib/utils/errors';

jest.mock('@/lib/services/forecastService');

const mockFetchWeeklyForecast = fetchWeeklyForecast as jest.MockedFunction<typeof fetchWeeklyForecast>;

describe('/api/v1/forecast/week API Endpoint', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('should return 405 if method is not GET', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'POST',
        });

        await handler(req, res);

        expect(res.statusCode).toBe(405);
        expect(res._getJSONData()).toEqual({ error: 'Method POST Not Allowed' });
        expect(res.getHeader('Allow')).toStrictEqual(['GET']);
    });

    it('should return 400 if latitude is missing', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { longitude: '10' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Latitude and longitude are required query parameters.' });
    });

    it('should return 400 if longitude is missing', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: '50' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Latitude and longitude are required query parameters.' });
    });

    it('should return 400 if latitude is not a string', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: 50 as any, longitude: '10' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Latitude and longitude must be provided as strings in the query.' });
    });

    it('should return 400 if units parameter is invalid', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: '50', longitude: '10', units: 'invalid' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: "Invalid units parameter. Must be 'metric' or 'imperial'." });
    });

    it('should return 400 if latitude is not a valid number', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: 'abc', longitude: '10' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Latitude and longitude must be valid numbers.' });
    });

    it('should return 200 and forecast data on success (metric)', async () => {
        const mockForecast: ForecastData = {
            latitude: 50,
            longitude: 10,
            units: '°C',
            forecast: [{ date: '2023-01-01', weather_code: 0, temperature: { max: 10, min: 5 } }],
        };
        mockFetchWeeklyForecast.mockResolvedValue(mockForecast);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: '50', longitude: '10', units: 'metric' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockForecast);
        expect(mockFetchWeeklyForecast).toHaveBeenCalledWith(50, 10, 'metric');
    });

    it('should return 200 and forecast data on success (imperial, default units)', async () => {
        const mockForecast: ForecastData = {
            latitude: 34.05,
            longitude: -118.24,
            units: '°F',
            forecast: [{ date: '2023-01-01', weather_code: 1, temperature: { max: 68, min: 50 } }],
        };
        mockFetchWeeklyForecast.mockResolvedValue(mockForecast);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: '34.05', longitude: '-118.24' }, // units defaults to metric in handler
        });

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockForecast);
        expect(mockFetchWeeklyForecast).toHaveBeenCalledWith(34.05, -118.24, 'metric');
    });
    
    it('should return 200 and forecast data on success (imperial)', async () => {
        const mockForecast: ForecastData = {
            latitude: 34.05,
            longitude: -118.24,
            units: '°F',
            forecast: [{ date: '2023-01-01', weather_code: 1, temperature: { max: 68, min: 50 } }],
        };
        mockFetchWeeklyForecast.mockResolvedValue(mockForecast);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: '34.05', longitude: '-118.24', units: 'imperial' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockForecast);
        expect(mockFetchWeeklyForecast).toHaveBeenCalledWith(34.05, -118.24, 'imperial');
    });

    it('should return HttpError status and message if fetchWeeklyForecast throws HttpError', async () => {
        const httpError = new HttpError(404, 'Forecast not found');
        mockFetchWeeklyForecast.mockRejectedValue(httpError);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: '1', longitude: '1' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({ error: 'Forecast not found' });
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[API /forecast/week] HttpError (404): Forecast not found'));
    });

    it('should return 500 if fetchWeeklyForecast throws an unexpected error', async () => {
        const unexpectedError = new Error('Something went wrong');
        mockFetchWeeklyForecast.mockRejectedValue(unexpectedError);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { latitude: '1', longitude: '1' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'An unexpected server error occurred while fetching the forecast.' });
        expect(consoleErrorSpy).toHaveBeenCalledWith("[API /forecast/week] Unexpected error:", unexpectedError);
    });
});
