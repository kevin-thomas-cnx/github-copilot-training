import React from 'react';
import { Location } from '@/lib/weatherApi'; // Assuming Location type is exported

interface LocationsListProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
}

const LocationsList: React.FC<LocationsListProps> = ({ locations, onSelectLocation }) => {
  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <div className="locations-list">
      <h2>Select a Location:</h2>
      <ul aria-label="List of matching locations">
        {locations.map((location) => (
          <li key={location.id || `${location.name}-${location.latitude}-${location.longitude}`}>
            <button 
              onClick={() => onSelectLocation(location)} 
              className="location-item-button"
              type="button"
              aria-label={`Select ${location.name}`}
            >
              <strong>{location.name}</strong> ({location.type ?? 'N/A'})
              <br />
              <span className="location-details">
                {location.state && `${location.state}, `}{location.country ?? 'USA'}
                {location.airportCode && ` - Airport Code: ${location.airportCode}`}
              </span>
              <br />
              <span className="location-coords">
                Lat: {location.latitude?.toFixed(4)}, Lon: {location.longitude?.toFixed(4)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationsList;
