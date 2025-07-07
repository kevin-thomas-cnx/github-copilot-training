
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchHourlyForecast, HourlyForecastResponse } from '@/lib/services/forecastService';
import { HttpError } from '@/lib/utils/errors';

/**
 * API route handler for retrieving hourly weather forecasts.
 *
 * Accepts a `GET` request with `lat` and `lon` query parameters and returns the hourly forecast for the specified location.
 *
 * @remarks
 * Only `GET` requests are supported. Returns 400 for missing or invalid parameters, 405 for unsupported methods, and 500 for server errors.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns A promise that resolves when the response is sent.
 *
 * @example
 * // GET /api/v1/forecast/hourly?lat=51.5074&lon=-0.1278
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HourlyForecastResponse | { error: string }>
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required query parameters.' });
  }

  if (typeof lat !== 'string' || typeof lon !== 'string') {
    return res.status(400).json({ error: 'lat and lon must be provided as strings in the query.' });
  }

  const numLat = Number(lat);
  const numLon = Number(lon);

  if (isNaN(numLat) || isNaN(numLon)) {
    return res.status(400).json({ error: 'lat and lon must be valid numbers.' });
  }

  try {
    const forecast = await fetchHourlyForecast(numLat, numLon);
    res.status(200).json(forecast);
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.status ?? 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
