import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ForecastService, ForecastResponse } from '../../services/forecast.service';

@Component({
  selector: 'app-forecast-grid',
  templateUrl: './forecast-grid.component.html',
  styleUrls: ['./forecast-grid.component.scss']
})
export class ForecastGridComponent implements OnChanges {
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Input() units: 'metric' | 'imperial' = 'metric';
  @Output() loading = new EventEmitter<boolean>();
  @Output() error = new EventEmitter<string | null>();
  forecast: ForecastResponse | null = null;
  isLoading = false;
  fetchError: string | null = null;

  constructor(private readonly forecastService: ForecastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.latitude || changes.longitude || changes.units) && this.latitude != null && this.longitude != null) {
      this.fetchForecast();
    }
  }

  fetchForecast() {
    if (this.latitude == null || this.longitude == null) return;
    this.isLoading = true;
    this.fetchError = null;
    this.loading.emit(true);
    this.error.emit(null);
    this.forecast = null;
    this.forecastService.get7DayForecast(this.latitude, this.longitude, this.units).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.forecast = data;
        // Debug log to help diagnose forecast data issues
        console.log('[ForecastGridComponent] Forecast data received:', data);
        this.loading.emit(false);
      },
      error: (err) => {
        this.isLoading = false;
        this.fetchError = err;
        this.error.emit(err);
        this.loading.emit(false);
      }
    });
  }

  getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      4: 'Smoke',
      5: 'Haze',
      6: 'Dust',
      7: 'Dust or sand',
      8: 'Dust whirls',
      9: 'Duststorm or sandstorm',
      10: 'Mist',
      11: 'Fog or ice fog',
      12: 'Fog or ice fog',
      13: 'Lightning',
      14: 'Precipitation nearby',
      15: 'Precipitation nearby',
      16: 'Precipitation nearby',
      17: 'Thunderstorm nearby',
      18: 'Squalls',
      19: 'Funnel cloud',
      20: 'Drizzle or snow grains',
      21: 'Rain',
      22: 'Snow',
      23: 'Rain and snow or ice pellets',
      24: 'Freezing drizzle or rain',
      25: 'Rain showers',
      26: 'Snow showers',
      27: 'Hail showers',
      28: 'Fog or ice fog',
      29: 'Thunderstorm',
      30: 'Duststorm or sandstorm',
      31: 'Duststorm or sandstorm',
      32: 'Duststorm or sandstorm',
      33: 'Duststorm or sandstorm',
      34: 'Duststorm or sandstorm',
      35: 'Duststorm or sandstorm',
      36: 'Blowing snow',
      37: 'Drifting snow',
      38: 'Blowing snow',
      39: 'Drifting snow',
      40: 'Fog or ice fog',
      41: 'Fog or ice fog',
      42: 'Fog or ice fog',
      43: 'Fog or ice fog',
      44: 'Fog or ice fog',
      45: 'Fog or ice fog',
      46: 'Fog or ice fog',
      47: 'Fog or ice fog',
      48: 'Fog or ice fog',
      49: 'Fog or ice fog',
      50: 'Drizzle',
      51: 'Drizzle',
      52: 'Drizzle',
      53: 'Drizzle',
      54: 'Drizzle',
      55: 'Drizzle',
      56: 'Freezing drizzle',
      57: 'Freezing drizzle',
      58: 'Drizzle and rain',
      59: 'Drizzle and rain',
      60: 'Rain',
      61: 'Rain',
      62: 'Rain',
      63: 'Rain',
      64: 'Rain',
      65: 'Rain',
      66: 'Freezing rain',
      67: 'Freezing rain',
      68: 'Rain and snow',
      69: 'Rain and snow',
      70: 'Snow',
      71: 'Snow',
      72: 'Snow',
      73: 'Snow',
      74: 'Snow',
      75: 'Snow',
      76: 'Diamond dust',
      77: 'Snow grains',
      78: 'Snow crystals',
      79: 'Ice pellets',
      80: 'Rain showers',
      81: 'Rain showers',
      82: 'Rain showers',
      83: 'Rain and snow showers',
      84: 'Rain and snow showers',
      85: 'Snow showers',
      86: 'Snow showers',
      87: 'Hail showers',
      88: 'Hail showers',
      89: 'Hail showers',
      90: 'Hail showers',
      91: 'Rain with thunderstorm',
      92: 'Rain with thunderstorm',
      93: 'Snow or hail with thunderstorm',
      94: 'Snow or hail with thunderstorm',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      97: 'Thunderstorm',
      98: 'Thunderstorm with duststorm',
      99: 'Thunderstorm with hail',
    };
    return weatherCodes[code] || 'Unknown';
  }

  getDayLabel(date: string): string {
    // Accepts ISO date or YYYY-MM-DD
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
