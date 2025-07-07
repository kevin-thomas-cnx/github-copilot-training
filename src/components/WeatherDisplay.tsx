import React from 'react';
import { ForecastData, getWeatherDescription } from '@/lib/weatherApi';

interface WeatherDisplayProps {
  forecastData: ForecastData;
  locationName: string;
  units: 'metric' | 'imperial';
  onUnitChange: (newUnit: 'metric' | 'imperial') => void;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ forecastData, locationName, units, onUnitChange }) => {
  if (!forecastData || !forecastData.forecast || forecastData.forecast.length === 0) {
    return <p className="info-message">No forecast data available for {locationName}.</p>;
  }

  const { forecast, latitude, longitude } = forecastData;

  const selectedStyle: React.CSSProperties = {
    backgroundColor: '#b9fbc0',
    color: '#166534',
    fontWeight: 'bold',
    border: '1px solid #166534'
  };

  return (
    <div className="weather-display">
      <h2>7-Day Forecast for {locationName}</h2>
      <p className="location-info">
        Coordinates: Latitude: {latitude?.toFixed(4)}, Longitude: {longitude?.toFixed(4)}
      </p>
      <div className="unit-switcher">
        <span>Temperature Units: </span>
        <button 
          onClick={() => onUnitChange('metric')} 
          disabled={units === 'metric'}
          aria-pressed={units === 'metric'}
          style={units === 'metric' ? selectedStyle : undefined}
        >
          °C (Metric)
        </button>
        <button 
          onClick={() => onUnitChange('imperial')} 
          disabled={units === 'imperial'}
          aria-pressed={units === 'imperial'}
          style={units === 'imperial' ? selectedStyle : undefined}
        >
          °F (Imperial)
        </button>
      </div>
      <div className="forecast-grid" aria-label={`7-day weather forecast for ${locationName}`}>
        {forecast.map((daily: any) => (
          <div key={daily.date} className="forecast-day-card">
            <h3>
              {new Date(daily.date + 'T00:00:00').toLocaleDateString(undefined, {
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </h3>
            <p className="weather-condition">
              {getWeatherDescription(daily.weather_code)}
            </p>
            <p className="temperature-max">
              Max: {daily.temperature.max?.toFixed(1)}°{units === 'metric' ? 'C' : 'F'}
            </p>
            <p className="temperature-min">
              Min: {daily.temperature.min?.toFixed(1)}°{units === 'metric' ? 'C' : 'F'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherDisplay;
