
/**
 * The base URL for all weather-related API endpoints.
 * @defaultValue '/api/v1'
 */
const API_BASE_URL = '/api/v1';


/**
 * Represents a location for weather queries.
 *
 * @property id - Unique identifier for the location.
 * @property name - Name of the location.
 * @property type - Type of location (e.g., city, airport).
 * @property state - State or region.
 * @property country - Country name.
 * @property latitude - Latitude coordinate.
 * @property longitude - Longitude coordinate.
 * @property airportCode - Optional airport code.
 *
 * @example
 * ```ts
 * const loc: Location = {
 *   id: 1,
 *   name: 'London',
 *   latitude: 51.5074,
 *   longitude: -0.1278
 * };
 * ```
 */
export interface Location {
  id: string | number;
  name: string;
  type?: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
  airportCode?: string;
}


/**
 * Represents a single day's weather forecast.
 *
 * @property date - The date of the forecast.
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
  date: string;
  weather_code: number;
  temperature: {
    max: number;
    min: number;
  };
}


/**
 * Represents the response for a locations search query.
 *
 * @property locations - Array of matching locations.
 *
 * @example
 * ```ts
 * const resp: LocationsResponse = { locations: [ ... ] };
 * ```
 */
export interface LocationsResponse {
  locations: Location[];
}


/**
 * Represents the weekly forecast data for a location.
 *
 * @property latitude - Latitude of the location.
 * @property longitude - Longitude of the location.
 * @property units - Units for temperature ('metric' or 'imperial').
 * @property forecast - Array of daily forecasts.
 *
 * @example
 * ```ts
 * const data: ForecastData = {
 *   latitude: 51.5,
 *   longitude: -0.1,
 *   units: 'metric',
 *   forecast: [ ... ]
 * };
 * ```
 */
export interface ForecastData {
  latitude: number;
  longitude: number;
  units: 'metric' | 'imperial';
  forecast: DailyForecast[];
}



/**
 * Fetches locations matching the provided search query from the API.
 *
 * @param query - The search string to match against location data.
 * @returns A promise resolving to {@link LocationsResponse}.
 * @throws {Error} If the query is empty or the API call fails.
 *
 * @example
 * ```ts
 * const resp = await fetchLocations('London');
 * ```
 */
export const fetchLocations = async (query: string): Promise<LocationsResponse> => {
  if (!query || query.trim() === '') {
    throw new Error('Search query cannot be empty.');
  }
  const url = `${API_BASE_URL}/locations/search?query=${encodeURIComponent(query)}`;
  console.log(`Fetching locations: ${url}`);
  const response = await fetch(url);
  let errorMessage = 'Failed to fetch locations.';
  if (!response.ok) {
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) errorMessage = errorData.error;
    } catch (e) {}
    if (response.status === 401 || response.status === 403) errorMessage = 'Unauthorized Access';
    else if (response.status === 404) errorMessage = 'No locations found.';
    throw new Error(errorMessage);
  }
  return response.json() as Promise<LocationsResponse>;
};


/**
 * Fetches the weekly weather forecast for a given location from the API.
 *
 * @param latitude - Latitude of the location.
 * @param longitude - Longitude of the location.
 * @param units - Units for temperature ('metric' or 'imperial').
 * @returns A promise resolving to {@link ForecastData}.
 * @throws {Error} If the API call fails or parameters are invalid.
 *
 * @example
 * ```ts
 * const forecast = await fetchWeeklyForecast(51.5, -0.1, 'metric');
 * ```
 */
export const fetchWeeklyForecast = async (latitude: number, longitude: number, units: 'metric' | 'imperial' = 'metric'): Promise<ForecastData> => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Invalid latitude or longitude provided.');
  }
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    units,
  });
  const url = `${API_BASE_URL}/forecast/week?${params.toString()}`;
  console.log(`Fetching forecast: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) errorMessage = errorData.error;
    } catch (e) {}
    if (response.status === 503) errorMessage = 'Weather service unavailable.';
    throw new Error(errorMessage);
  }
  return response.json() as Promise<ForecastData>;
};


/**
 * Returns a human-readable weather description for a given weather code.
 *
 * @param code - Numeric weather code.
 * @returns A string describing the weather condition.
 *
 * @example
 * ```ts
 * const desc = getWeatherDescription(2); // 'Partly cloudy'
 * ```
 */
export const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: Light intensity',
    53: 'Drizzle: Moderate intensity',
    55: 'Drizzle: Dense intensity',
    56: 'Freezing Drizzle: Light intensity',
    57: 'Freezing Drizzle: Dense intensity',
    61: 'Rain: Slight intensity',
    63: 'Rain: Moderate intensity',
    65: 'Rain: Heavy intensity',
    66: 'Freezing Rain: Light intensity',
    67: 'Freezing Rain: Heavy intensity',
    71: 'Snow fall: Slight intensity',
    73: 'Snow fall: Moderate intensity',
    75: 'Snow fall: Heavy intensity',
    77: 'Snow grains',
    80: 'Rain showers: Slight',
    81: 'Rain showers: Moderate',
    82: 'Rain showers: Violent',
    85: 'Snow showers: Slight',
    86: 'Snow showers: Heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return weatherCodes[code] || `Unknown (Code: ${code})`;
};
