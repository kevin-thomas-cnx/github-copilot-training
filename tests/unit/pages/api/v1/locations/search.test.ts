import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HttpError } from '@/lib/utils/errors';
import type { Location } from '@/lib/services/locationService'; // Type import

// This will be the mock for the searchLocations method on instances returned by the mock constructor
const mockSearchLocationsInstanceMethod = jest.fn();

// Mock the locationService module
jest.mock('@/lib/services/locationService', () => {
    const originalActualModule = jest.requireActual('@/lib/services/locationService');
    return {
        __esModule: true,
        ...originalActualModule, // Includes original Location type, etc.
        // LocationService will be a mock constructor.
        // The factory creates a jest.fn() that returns an object with the mocked searchLocations method.
        LocationService: jest.fn().mockImplementation(() => ({
            searchLocations: mockSearchLocationsInstanceMethod,
        })),
    };
});

describe('/api/v1/locations/search API Endpoint', () => {
    let consoleErrorSpy: jest.SpyInstance;
    let handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
    // This variable will hold the reference to the mock constructor (jest.fn())
    // that is active for the current test, after jest.resetModules().
    let CurrentMockLocationServiceConstructor: jest.Mock;

    beforeEach(async () => {
        jest.resetModules(); // Reset module cache - SUT will re-import its dependencies
        jest.clearAllMocks(); // Reset all mocks (mockSearchLocationsInstanceMethod and CurrentMockLocationServiceConstructor once it's assigned)

        // Re-import the mocked LocationService to get the instance of the mock constructor
        // that the SUT (handler) will also import after module reset.
        const mockedLocationServiceModule = await import('@/lib/services/locationService');
        CurrentMockLocationServiceConstructor = mockedLocationServiceModule.LocationService as jest.Mock;

        // Set a default implementation for the mock constructor for this test run.
        // This ensures that if a test doesn't specify mockImplementationOnce, it gets a working instance.
        // This step is technically redundant if the mock factory already sets a default implementation,
        // but it's explicit and ensures CurrentMockLocationServiceConstructor is configured.
        CurrentMockLocationServiceConstructor.mockImplementation(() => ({
            searchLocations: mockSearchLocationsInstanceMethod,
        }));

        // Dynamically import the handler *after* modules are reset and mocks are in place.
        // The handler will import lib/services/locationService and get the CurrentMockLocationServiceConstructor.
        const handlerModule = await import('@/pages/api/v1/locations/search');
        handler = handlerModule.default;

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        if (consoleErrorSpy) { // Guard against consoleErrorSpy being undefined if beforeEach failed early
            consoleErrorSpy.mockRestore();
        }
    });

    it('should return 405 if method is not GET', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'POST',
        });
        await handler(req, res);
        expect(res.statusCode).toBe(405);
        expect(res._getJSONData()).toEqual({ error: 'Method POST Not Allowed' });
    });

    it('should return 400 if query parameter is missing', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: {},
        });
        await handler(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Query parameter is required.' });
    });

    it('should return 400 if query parameter is an empty string', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { query: ' ' },
        });
        await handler(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Query parameter must be a non-empty string.' });
    });

    it('should return 400 if query parameter is not a string', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { query: 123 as any },
        });
        await handler(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Query parameter must be a non-empty string.' });
    });

    it('should return 200 and locations on successful search', async () => {
        const mockLocationsData: Location[] = [
            { id: '1', name: 'London', type: 'City', state: 'N/A', country: 'UK', latitude: 51.5, longitude: 0.12 },
        ];
        mockSearchLocationsInstanceMethod.mockResolvedValue(mockLocationsData);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { query: 'London' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ locations: mockLocationsData });
        // Check if the CurrentMockLocationServiceConstructor was called
        expect(CurrentMockLocationServiceConstructor).toHaveBeenCalledTimes(1);
        expect(mockSearchLocationsInstanceMethod).toHaveBeenCalledWith('London');
    });

    it('should return HttpError status and message if LocationService constructor throws HttpError (initialization fails)', async () => {
        const initError = new HttpError(503, 'Service unavailable');
        // Configure the CurrentMockLocationServiceConstructor (obtained in beforeEach)
        // to throw an error on its next call.
        CurrentMockLocationServiceConstructor.mockImplementationOnce(() => {
            throw initError;
        });

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { query: 'Test' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(503);
        expect(res._getJSONData()).toEqual({ error: 'Service unavailable' });
        expect(CurrentMockLocationServiceConstructor).toHaveBeenCalledTimes(1); // Constructor was called
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[API /locations/search] HttpError (503): Service unavailable'));
    });

    it('should return 500 if LocationService constructor throws an unexpected error', async () => {
        const initError = new Error('Unexpected init error');
        CurrentMockLocationServiceConstructor.mockImplementationOnce(() => {
            throw initError;
        });

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { query: 'Test' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'An unexpected server error occurred while searching for locations.' });
        expect(CurrentMockLocationServiceConstructor).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith("[API /locations/search] Unexpected error:", initError);
    });

    it('should return HttpError status and message if searchLocations throws HttpError', async () => {
        const searchError = new HttpError(404, 'No locations found for query');
        // mockSearchLocationsInstanceMethod is configured directly
        mockSearchLocationsInstanceMethod.mockRejectedValue(searchError);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { query: 'UnknownCity' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({ error: 'No locations found for query' });
        expect(CurrentMockLocationServiceConstructor).toHaveBeenCalledTimes(1); // Constructor was called
        expect(mockSearchLocationsInstanceMethod).toHaveBeenCalledWith('UnknownCity'); // Method was called
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[API /locations/search] HttpError (404): No locations found for query'));
    });

    it('should return 500 if searchLocations throws an unexpected error', async () => {
        const unexpectedError = new Error('DB connection failed');
        mockSearchLocationsInstanceMethod.mockRejectedValue(unexpectedError);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            query: { query: 'SomeCity' },
        });

        await handler(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'An unexpected server error occurred while searching for locations.' });
        expect(CurrentMockLocationServiceConstructor).toHaveBeenCalledTimes(1);
        expect(mockSearchLocationsInstanceMethod).toHaveBeenCalledWith('SomeCity');
        expect(consoleErrorSpy).toHaveBeenCalledWith("[API /locations/search] Unexpected error:", unexpectedError);
    });
});

