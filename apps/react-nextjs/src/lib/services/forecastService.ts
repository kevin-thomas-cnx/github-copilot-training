import axios, { AxiosError } from 'axios';
import { HttpError } from '../utils/errors'; // Relative path to utils within lib

// This URL is based on the context for api.open-meteo.com: https://api.open-meteo.com/v1/forecast
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export interface DailyForecast {
    date: string;
    weather_code: number;
    temperature: {
        max: number;
        min: number;
    };
}

export interface ForecastData {
    latitude: number;
    longitude: number;
    units: string; // Will store the unit symbol like "°C" or "°F" from API response
    forecast: DailyForecast[];
}

/**
 * Fetches the weekly weather forecast for a given location from Open-Meteo.
 *
 * @param latitude - The latitude of the location.
 * @param longitude - The longitude of the location.
 * @param unitsInput - The unit system for temperature ('metric' or 'imperial').
 * @returns A Promise that resolves to an object containing the forecast data.
 * @throws Will throw an HttpError if the weather service is unavailable or the request fails.
 */
export const fetchWeeklyForecast = async (
    latitude: number,
    longitude: number,
    unitsInput: 'metric' | 'imperial'
): Promise<ForecastData> => {
    try {
        const temperatureUnitParam = unitsInput === 'imperial' ? 'fahrenheit' : 'celsius';
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                latitude,
                longitude,
                daily: ['temperature_2m_max', 'temperature_2m_min', 'weather_code'],
                timezone: 'auto', // Automatically detect timezone
                temperature_unit: temperatureUnitParam,
            },
        });

        const { daily, daily_units } = response.data;

        if (!daily || !daily.time || !daily.weather_code || !daily.temperature_2m_max || !daily.temperature_2m_min) {
            throw new HttpError(500, "Received incomplete forecast data from Open-Meteo.");
        }

        const formattedForecast = daily.time.map((date: string, index: number) => ({
            date,
            weather_code: daily.weather_code[index],
            temperature: {
                max: daily.temperature_2m_max[index],
                min: daily.temperature_2m_min[index],
            },
        }));

        // Use the unit from the API response if available and truthy, otherwise fallback based on input
        const displayUnit = daily_units?.temperature_2m_max || (unitsInput === 'imperial' ? '°F' : '°C');

        return {
            latitude,
            longitude,
            units: displayUnit,
            forecast: formattedForecast,
        };
    } catch (error: unknown) {
        // Patch: always treat as AxiosError if isAxiosError property is present
        if (typeof error === 'object' && error && 'isAxiosError' in error && (error as any).isAxiosError) {
            const axiosError = error as AxiosError<any>;
            const errorReason = axiosError.response?.data?.reason || axiosError.message;
            console.error(`Axios error fetching weather from Open-Meteo: ${errorReason}`, axiosError.response?.data);
            throw new HttpError(axiosError.response?.status || 500, `Open-Meteo API Error: ${errorReason}`);
        }
        // For non-Axios errors
        console.error('Unexpected error fetching weather data:', error);
        throw new HttpError(500, 'An unexpected error occurred while fetching weather data.');
    }
};
