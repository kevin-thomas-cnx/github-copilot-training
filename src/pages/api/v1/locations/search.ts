
import type { NextApiRequest, NextApiResponse } from 'next';
import { LocationService, Location } from '@/lib/services/locationService';
import { HttpError } from '@/lib/utils/errors';

type LocationsResponse = {
    locations: Location[];
};

type ErrorResponse = {
    error: string;
};

function isHttpError(error: any): error is HttpError {
    return (
        Boolean(error) &&
        (error instanceof HttpError ||
            // Defensive: Support dupe class from test (name/status present)
            (error.name === 'HttpError' && typeof error.status === 'number' && typeof error.message === 'string'))
    );
}

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

