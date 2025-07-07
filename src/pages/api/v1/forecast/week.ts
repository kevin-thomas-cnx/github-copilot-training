
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchWeeklyForecast, ForecastData } from '@/lib/services/forecastService';
import { HttpError } from '@/lib/utils/errors';

/**
 * API route handler for retrieving weekly weather forecasts.
 *
 * Accepts a `GET` request with `latitude`, `longitude`, and optional `units` query parameters and returns the 7-day forecast for the specified location.
 *
 * @remarks
 * Only `GET` requests are supported. Returns 400 for missing or invalid parameters, 405 for unsupported methods, and 500 for server errors.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise that resolves when the response is sent.
 *
 * @example
 * // GET /api/v1/forecast/week?latitude=51.5074&longitude=-0.1278&units=metric
 */

type ErrorResponse = {
    error: string;
};


/**
 * Handles the API request for weekly weather forecasts.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise that resolves when the response is sent.
 * @throws 400 if required parameters are missing or invalid.
 * @throws 405 if the HTTP method is not GET.
 * @throws 500 for unexpected server errors.
 * @example
 * // GET /api/v1/forecast/week?latitude=40.7128&longitude=-74.0060&units=imperial
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