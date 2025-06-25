import { fetchWeeklyForecast } from '@/lib/services/forecastService';
import axios from 'axios';
import { HttpError } from '@/lib/utils/errors';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeeklyForecast', () => {
  const latitude = 40.7128;
  const longitude = -74.0060;
  const units = 'metric';

  it('returns formatted forecast data on success', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        daily: {
          time: ['2025-06-17'],
          weather_code: [1],
          temperature_2m_max: [30],
          temperature_2m_min: [20],
        },
        daily_units: {
          temperature_2m_max: '°C',
        },
      },
    });

    const result = await fetchWeeklyForecast(latitude, longitude, units);
    expect(result.forecast[0].date).toBe('2025-06-17');
    expect(result.forecast[0].weather_code).toBe(1);
    expect(result.forecast[0].temperature.max).toBe(30);
    expect(result.units).toBe('°C');
  });

  it('returns fallback unit when daily_units is undefined', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        daily: {
          time: ['2025-06-17'],
          weather_code: [1],
          temperature_2m_max: [30],
          temperature_2m_min: [20],
        },
        daily_units: undefined,
      },
    });
    const result = await fetchWeeklyForecast(latitude, longitude, 'imperial');
    expect(result.units).toBe('°F');
  });

  it('returns fallback unit when daily_units is missing', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        daily: {
          time: ['2025-06-17'],
          weather_code: [1],
          temperature_2m_max: [30],
          temperature_2m_min: [20],
        },
        daily_units: {},
      },
    });
    const result = await fetchWeeklyForecast(latitude, longitude, 'imperial');
    expect(result.units).toBe('°F');
  });

  it('returns fallback unit when daily_units.temperature_2m_max is null', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        daily: {
          time: ['2025-06-17'],
          weather_code: [1],
          temperature_2m_max: [30],
          temperature_2m_min: [20],
        },
        daily_units: { temperature_2m_max: null },
      },
    });
    const result = await fetchWeeklyForecast(latitude, longitude, 'imperial');
    expect(result.units).toBe('°F');
  });

  it('returns fallback unit when daily_units is null', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        daily: {
          time: ['2025-06-17'],
          weather_code: [1],
          temperature_2m_max: [30],
          temperature_2m_min: [20],
        },
        daily_units: null,
      },
    });
    const result = await fetchWeeklyForecast(latitude, longitude, 'imperial');
    expect(result.units).toBe('°F');
  });

  it('returns fallback unit when daily_units is omitted', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        daily: {
          time: ['2025-06-17'],
          weather_code: [1],
          temperature_2m_max: [30],
          temperature_2m_min: [20],
        }
        // daily_units is not present at all
      },
    });
    const result = await fetchWeeklyForecast(latitude, longitude, 'imperial');
    expect(result.units).toBe('°F');
  });

  it('returns fallback unit when daily_units is an empty object', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        daily: {
          time: ['2025-06-17'],
          weather_code: [1],
          temperature_2m_max: [30],
          temperature_2m_min: [20],
        },
        daily_units: {},
      },
    });
    const result = await fetchWeeklyForecast(latitude, longitude, 'imperial');
    expect(result.units).toBe('°F');
  });

  it('returns fallback unit when daily_units.temperature_2m_max is an empty string', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        daily: {
          time: ['2025-06-17'],
          weather_code: [1],
          temperature_2m_max: [30],
          temperature_2m_min: [20],
        },
        daily_units: { temperature_2m_max: '' },
      },
    });
    const result = await fetchWeeklyForecast(latitude, longitude, 'imperial');
    expect(result.units).toBe('°F');
  });

  it('throws HttpError on incomplete data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { daily: {} } });
    await expect(fetchWeeklyForecast(latitude, longitude, units)).rejects.toBeInstanceOf(HttpError);
  });

  it('throws HttpError on axios error with response', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 503, data: { reason: 'Service Unavailable' } },
      message: 'Service Unavailable',
    });
    await expect(fetchWeeklyForecast(latitude, longitude, units)).rejects.toThrow('Open-Meteo API Error: Service Unavailable');
  });

  it('throws HttpError on axios error without response', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      isAxiosError: true,
      message: 'Network error',
    });
    await expect(fetchWeeklyForecast(latitude, longitude, units)).rejects.toThrow('Open-Meteo API Error: Network error');
  });

  it('throws HttpError on non-axios error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Some other error'));
    await expect(fetchWeeklyForecast(latitude, longitude, units)).rejects.toThrow('An unexpected error occurred while fetching weather data.');
  });
});
