import { Component } from '@angular/core';
import { LocationService, LocationResult } from './services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Weather App';
  locations: LocationResult[] = [];
  loading = false;
  error: string | null = null;
  noResults = false;
  selectedLocationId: string | null = null;
  selectedLatitude: number | null = null;
  selectedLongitude: number | null = null;
  selectedUnits: 'metric' | 'imperial' = 'metric';

  constructor(private readonly locationService: LocationService) {}

  onSearch(query: string) {
    console.log('[onSearch] Search query:', query);
    this.loading = true;
    this.error = null;
    this.noResults = false;
    this.locations = [];
    this.locationService.searchLocations(query).subscribe({
      next: (results) => {
        console.log('[onSearch] API results:', results);
        this.loading = false;
        this.locations = results;
        this.noResults = results.length === 0;
        console.log('[onSearch] Updated locations:', this.locations);
        console.log('[onSearch] noResults:', this.noResults, 'loading:', this.loading, 'error:', this.error);
      },
      error: (err) => {
        this.loading = false;
        this.error = err;
        console.log('[onSearch] API error:', err);
      }
    });
    console.log('[onSearch] After subscribe setup, locations:', this.locations);
  }

  onSelectLocation(locationId: string) {
    this.selectedLocationId = locationId;
    const location = this.locations.find(loc => loc.id === locationId);
    this.selectedLatitude = location ? location.latitude : null;
    this.selectedLongitude = location ? location.longitude : null;
    this.selectedUnits = 'metric'; // Reset to default on new selection
  }

  onUnitsChange(units: 'metric' | 'imperial') {
    this.selectedUnits = units;
  }
}
