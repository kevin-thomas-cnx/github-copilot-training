import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchHourlyForecast, HourlyForecastResponse } from '@/lib/services/forecastService';
import { HttpError } from '@/lib/utils/errors';

/**
 * API Route: GET /api/v1/forecast/hourly
 * Fetches the next 24 hours of hourly weather data for a given location.
 * Query Parameters:
 * - lat (required, number): Latitude of the location.
 * - lon (required, number): Longitude of the location.
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
