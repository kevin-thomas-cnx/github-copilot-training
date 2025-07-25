import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchWeeklyForecast, ForecastData } from '@/lib/services/forecastService';
import { HttpError } from '@/lib/utils/errors';

type ErrorResponse = {
    error: string;
};

/**
 * API Route: GET /api/v1/forecast/week
 * Fetches the weekly weather forecast for a given location.
 * Query Parameters:
 * - latitude (required, number): The latitude of the location.
 * - longitude (required, number): The longitude of the location.
 * - units (optional, string: 'metric' | 'imperial'): Defaults to 'metric'.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ForecastData | ErrorResponse>
): Promise<void> {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        return;
    }

    const { latitude, longitude, units = 'metric' } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required query parameters.' });
    }

    if (typeof latitude !== 'string' || typeof longitude !== 'string') {
        return res.status(400).json({ error: 'Latitude and longitude must be provided as strings in the query.' });
    }

    if ((units !== 'metric' && units !== 'imperial')) {
        return res.status(400).json({ error: "Invalid units parameter. Must be 'metric' or 'imperial'." });
    }

    const numLatitude = Number(latitude);
    const numLongitude = Number(longitude);

    if (isNaN(numLatitude) || isNaN(numLongitude)) {
        return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
    }

    try {
        const forecast = await fetchWeeklyForecast(
            numLatitude,
            numLongitude,
            units as 'metric' | 'imperial'
        );
        res.status(200).json(forecast);
    } catch (error: any) {
        if (error instanceof HttpError) {
            console.error(`[API /forecast/week] HttpError (${error.status}): ${error.message}`);
            res.status(error.status).json({ error: error.message });
        } else {
            console.error("[API /forecast/week] Unexpected error:", error);
            res.status(500).json({ error: 'An unexpected server error occurred while fetching the forecast.' });
        }
    }
}