import React, { useState, useCallback } from 'react';
import Head from 'next/head'; // For setting page title, meta tags
import SearchBar from '@/components/SearchBar';
import LocationsList from '@/components/LocationsList';
import WeatherDisplay from '@/components/WeatherDisplay';
import ErrorAlert from '@/components/ErrorAlert';
import { fetchLocations, fetchWeeklyForecast, Location, ForecastData } from '@/lib/weatherApi'; // Assuming types are exported

// Define types for state if not already imported
// type Location = { id: string | number; name: string; type?: string; state?: string; country?: string; latitude: number; longitude: number; airportCode?: string; };
// type ForecastData = any; // Replace 'any' with a more specific type for your forecast data

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  const clearState = () => {
    setLocations([]);
    setSelectedLocation(null);
    setForecast(null);
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setError('Please enter a city or airport name to search.');
      setLocations([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    clearState();
    setSearchTerm(query);

    try {
      const data = await fetchLocations(query);
      if (data.locations && data.locations.length > 0) {
        setLocations(data.locations);
      } else {
        setError('No locations found matching your query. Try a different term.');
        setLocations([]);
      }
    } catch (err: any) {
      console.error("Search API Error:", err);
      setError(err.message || 'Failed to fetch locations.');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectLocation = useCallback(
    async (location: Location, fetchUnits?: 'metric' | 'imperial') => {
      setSelectedLocation(location);
      setLocations([]);
      setIsLoading(true);
      setError(null);
      setForecast(null);

      try {
        const data = await fetchWeeklyForecast(
          location.latitude,
          location.longitude,
          fetchUnits || units
        );
        setForecast(data);
      } catch (err: any) {
        console.error("Forecast API Error:", err);
        setError(err.message || 'Failed to fetch the weather forecast.');
        setForecast(null);
      } finally {
        setIsLoading(false);
      }
    },
    [units]
  );

  const handleUnitChange = useCallback(
    (newUnit: 'metric' | 'imperial') => {
      setUnits(newUnit);
      if (selectedLocation) {
        handleSelectLocation(selectedLocation, newUnit); // Pass newUnit explicitly
      }
    },
    [selectedLocation, handleSelectLocation]
  );

  return (
    <div className="App-Container"> {/* Use a more semantic class or styled-component */}
      <Head>
        <title>Weather Forecast App</title>
        <meta name="description" content="Simple weather forecast application" />
        <link rel="icon" href="/favicon.ico" /> {/* Make sure favicon.ico is in public folder */}
      </Head>

      <header>
        <h1>Weather Forecast App</h1>
      </header>
      <main>
        <ErrorAlert message={error} onClose={() => setError(null)} />
        
        <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />

        {isLoading && <div className="loading-indicator"><p>Loading...</p></div>}

        {!isLoading && !selectedLocation && locations.length > 0 && (
          <LocationsList locations={locations} onSelectLocation={handleSelectLocation} />
        )}

        {selectedLocation && forecast && (
          <WeatherDisplay
            forecastData={forecast}
            locationName={selectedLocation.name}
            units={units}
            onUnitChange={handleUnitChange}
          />
        )}
        
        {!isLoading && !error && !selectedLocation && locations.length === 0 && !searchTerm &&(
           <p className="info-message">Enter a city or airport name above to search for locations.</p>
        )}
        {!isLoading && !error && !selectedLocation && locations.length === 0 && searchTerm && (
           <p className="info-message">No active search or results. Try searching for a location.</p>
        )}
      </main>
      <footer>
        <p>Weather data provided by Open-Meteo API.</p>
      </footer>
    </div>
  );
}

export default HomePage;
