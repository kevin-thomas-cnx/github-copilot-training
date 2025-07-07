import axios, { AxiosError } from 'axios';
import { HttpError } from '../utils/errors';


/**
 * The base URL for the Open-Meteo weather API.
 * @see https://open-meteo.com/
 */
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';


/**
 * Represents a single day's weather forecast.
 *
 * @property date - The date of the forecast (ISO string).
 * @property weather_code - Numeric weather code for the day.
 * @property temperature - Object containing max and min temperatures.
 *
 * @example
 * ```ts
 * const forecast: DailyForecast = {
 *   date: '2025-07-07',
 *   weather_code: 2,
 *   temperature: { max: 30, min: 20 }
 * };
 * ```
 */
export interface DailyForecast {
    /** The date of the forecast (ISO string). */
    date: string;
    /** Numeric weather code for the day. */
    weather_code: number;
    /** Max and min temperatures for the day. */
    temperature: {
        /** Maximum temperature. */
        max: number;
        /** Minimum temperature. */
        min: number;
    };
}


/**
 * Represents the weekly forecast data for a location.
 *
 * @property latitude - Latitude of the location.
 * @property longitude - Longitude of the location.
 * @property units - Units for temperature (e.g., '°C' or '°F').
 * @property forecast - Array of daily forecasts.
 *
 * @example
 * ```ts
 * const data: ForecastData = {
 *   latitude: 51.5,
 *   longitude: -0.1,
 *   units: '°C',
 *   forecast: [ ... ]
 * };
 * ```
 */
export interface ForecastData {
    latitude: number;
    longitude: number;
    units: string;
    forecast: DailyForecast[];
}

/**
 * Fetches the 7-day weather forecast for a given location.
 *
 * @param latitude - Latitude of the location.
 * @param longitude - Longitude of the location.
 * @param unitsInput - Units for temperature ('metric' or 'imperial').
 * @returns A promise resolving to {@link ForecastData}.
 * @throws {HttpError} If the API call fails or returns incomplete data.
 *
 * @example
 * ```ts
 * const forecast = await fetchWeeklyForecast(51.5, -0.1, 'metric');
 * ```
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
                timezone: 'auto',
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


/**
 * Represents a single hour's weather forecast.
 *
 * @property time - The time of the forecast (ISO string).
 * @property temperature - Temperature at the given hour.
 * @property precipitation - Precipitation amount.
 * @property condition - Human-readable weather condition.
 *
 * @example
 * ```ts
 * const hour: HourlyForecast = {
 *   time: '2025-07-07T12:00:00Z',
 *   temperature: 22,
 *   precipitation: 0,
 *   condition: 'Clear'
 * };
 * ```
 */
export interface HourlyForecast {
    time: string;
    temperature: number;
    precipitation: number;
    condition: string;
}


/**
 * Represents the hourly forecast response.
 *
 * @property hourly - Array of hourly forecasts.
 *
 * @example
 * ```ts
 * const resp: HourlyForecastResponse = { hourly: [ ... ] };
 * ```
 */
export interface HourlyForecastResponse {
    hourly: HourlyForecast[];
}

/**
 * Fetches the hourly weather forecast for a given location (next 24 hours).
 *
 * @param latitude - Latitude of the location.
 * @param longitude - Longitude of the location.
 * @returns A promise resolving to {@link HourlyForecastResponse}.
 * @throws {HttpError} If the API call fails or returns incomplete data.
 *
 * @example
 * ```ts
 * const hourly = await fetchHourlyForecast(51.5, -0.1);
 * ```
 */
export const fetchHourlyForecast = async (
    latitude: number,
    longitude: number
): Promise<HourlyForecastResponse> => {
    try {
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                latitude,
                longitude,
                hourly: ['temperature_2m', 'precipitation', 'weather_code'],
                timezone: 'auto',
                forecast_hours: 24,
            },
        });
        const { hourly } = response.data;
        if (!hourly || !hourly.time || !hourly.temperature_2m || !hourly.precipitation || !hourly.weather_code) {
            throw new HttpError(500, 'Received incomplete hourly forecast data from Open-Meteo.');
        }
        // Map weather_code to a string condition (simple mapping for demo)
        const codeToCondition = (code: number): string => {
            if (code === 0) return 'Clear';
            if (code < 3) return 'Partly Cloudy';
            if (code < 50) return 'Cloudy';
            if (code < 70) return 'Rain';
            if (code < 90) return 'Snow';
            return 'Unknown';
        };
        const hourlyData: HourlyForecast[] = hourly.time.slice(0, 24).map((time: string, idx: number) => ({
            time,
            temperature: hourly.temperature_2m[idx],
            precipitation: hourly.precipitation[idx],
            condition: codeToCondition(hourly.weather_code[idx]),
        }));
        return { hourly: hourlyData };
    } catch (error: unknown) {
        if (typeof error === 'object' && error && 'isAxiosError' in error && (error as any).isAxiosError) {
            const axiosError = error as AxiosError<any>;
            const errorReason = axiosError.response?.data?.reason || axiosError.message;
            throw new HttpError(axiosError.response?.status || 502, `Open-Meteo API Error: ${errorReason}`);
        }
        throw new HttpError(500, 'An unexpected error occurred while fetching hourly weather data.');
    }
};
