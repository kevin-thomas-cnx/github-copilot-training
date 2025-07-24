// IMPORTANT: Replace this with your actual API base URL from your OpenAPI spec
const API_BASE_URL = '/api/v1'; // Ensure this is correct

// Define interfaces for your data structures
export interface Location {
  id: string | number; // Assuming id can be string or number
  name: string;
  type?: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
  airportCode?: string;
}

export interface DailyForecast {
  date: string;
  weather_code: number;
  temperature: {
    max: number;
    min: number;
  };
}

export interface LocationsResponse {
  locations: Location[];
}

export interface ForecastData {
  latitude: number;
  longitude: number;
  units: 'metric' | 'imperial';
  forecast: DailyForecast[];
}


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
