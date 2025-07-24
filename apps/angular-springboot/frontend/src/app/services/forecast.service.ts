import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ForecastDay {
  date: string;
  weather_code: number;
  temperature: {
    max: number;
    min: number;
  };
  precipitationProbability?: number;
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  units: 'metric' | 'imperial';
  forecast: ForecastDay[];
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  constructor(private readonly http: HttpClient) {}

  get7DayForecast(latitude: number, longitude: number, units: 'metric' | 'imperial'): Observable<ForecastResponse> {
    return this.http.get<any>(`/api/v1/forecast/week?latitude=${latitude}&longitude=${longitude}&units=${units}`)
      .pipe(
        map((apiResponse) => {
          // Robustly map units
          let mappedUnits: 'metric' | 'imperial' = 'metric';
          if (apiResponse.units === 'imperial' || apiResponse.units === 'fahrenheit') mappedUnits = 'imperial';
          // Map backend property names to frontend expected names
          return {
            latitude: apiResponse.latitude,
            longitude: apiResponse.longitude,
            units: mappedUnits,
            forecast: (apiResponse.forecast ?? []).map((day: any) => ({
              date: day.day,
              weather_code: day.weatherCode,
              temperature: {
                max: day.temperature.max,
                min: day.temperature.min
              },
              precipitationProbability: day.precipitationChance
            }))
          };
        }),
        catchError((error: HttpErrorResponse) => throwError(error.error?.message ?? 'Forecast fetch failed'))
      );
  }
}
