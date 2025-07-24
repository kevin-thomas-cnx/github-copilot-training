import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface LocationResult {
  id: string;
  name: string;
  type?: string;
  state?: string;
  country?: string;
  airportCode?: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private readonly http: HttpClient) {}

  searchLocations(query: string): Observable<LocationResult[]> {
    return this.http.get<{ locations: LocationResult[] }>(`/api/v1/locations/search?query=${encodeURIComponent(query)}`)
      .pipe(
        map(response => response.locations ?? []),
        catchError((error: HttpErrorResponse) => throwError(error.error?.message ?? 'Search failed'))
      );
  }

  /**
   * Get a 7-day weather forecast for a location
   * @param latitude Latitude of the location
   * @param longitude Longitude of the location
   * @param units Unit system for temperature values (optional, default: 'metric')
   */
  getWeeklyForecast(latitude: number, longitude: number, units: 'metric' | 'imperial' = 'metric'): Observable<any> {
    return this.http.get<any>(`/api/v1/forecast/week?latitude=${latitude}&longitude=${longitude}&units=${units}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(error.error?.message ?? 'Weekly forecast failed'))
      );
  }

  /**
   * Get hourly weather forecast for the next 24 hours for a location
   * @param lat Latitude of the location
   * @param lon Longitude of the location
   */
  getHourlyForecast(lat: number, lon: number): Observable<any> {
    return this.http.get<any>(`/api/v1/forecast/hourly?lat=${lat}&lon=${lon}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(error.error?.message ?? 'Hourly forecast failed'))
      );
  }
}
