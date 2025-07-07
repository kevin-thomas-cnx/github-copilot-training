

import type { NextApiRequest, NextApiResponse } from 'next';
import { LocationService, Location } from '@/lib/services/locationService';
import { HttpError } from '@/lib/utils/errors';

/**
 * API route handler for searching locations by query string.
 *
 * Accepts a `GET` request with a `query` parameter and returns a list of matching locations.
 *
 * @remarks
 * Only `GET` requests are allowed. Returns 400 if the query is missing or invalid.
 * Returns 405 for unsupported methods. Handles custom and unexpected errors.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise that resolves when the response is sent.
 *
 * @example
 * // Example request:
 * // GET /api/v1/locations/search?query=London
 */

type LocationsResponse = {
    locations: Location[];
};

type ErrorResponse = {
    error: string;
};


/**
 * Type guard to check if an error is an instance of HttpError.
 *
 * @param error - The error to check.
 * @returns True if the error is an HttpError, false otherwise.
 * @example
 * if (isHttpError(err)) { ... }
 */
function isHttpError(error: any): error is HttpError {
    return (
        Boolean(error) &&
        (error instanceof HttpError ||
            // Defensive: Support dupe class from test (name/status present)
            (error.name === 'HttpError' && typeof error.status === 'number' && typeof error.message === 'string'))
    );
}


/**
 * Handles the API request for searching locations.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise that resolves when the response is sent.
 * @throws 400 if the query parameter is missing or invalid.
 * @throws 405 if the HTTP method is not GET.
 * @throws 500 for unexpected server errors.
 * @example
 * // GET /api/v1/locations/search?query=Paris
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LocationsResponse | ErrorResponse>
): Promise<void> {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        return;
    }

    const { query } = req.query;

    if (!query) {
        res.status(400).json({ error: 'Query parameter is required.' });
        return;
    }

    if (typeof query !== 'string' || query.trim() === '') {
        res.status(400).json({ error: 'Query parameter must be a non-empty string.' });
        return;
    }

    try {
        const service = new LocationService();
        const locations = await service.searchLocations(query);
        res.status(200).json({ locations });
    } catch (error: any) {
        if (isHttpError(error)) {
            console.error(
                `[API /locations/search] HttpError (${error.status}): ${error.message}`
            );
            res.status(error.status).json({ error: error.message });
        } else {
            console.error('[API /locations/search] Unexpected error:', error);
            res
                .status(500)
                .json({
                    error:
                        'An unexpected server error occurred while searching for locations.',
                });
        }
    }
}

