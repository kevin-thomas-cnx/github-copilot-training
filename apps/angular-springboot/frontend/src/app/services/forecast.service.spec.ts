import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ForecastService, ForecastResponse } from './forecast.service';

describe('ForecastService', () => {
  let service: ForecastService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ForecastService]
    });
    service = TestBed.inject(ForecastService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch 7-day forecast from API', () => {
    const mockForecast: ForecastResponse = { latitude: 51.5, longitude: -0.1, units: 'metric', forecast: [] };
    service.get7DayForecast(51.5, -0.1, 'metric').subscribe(data => {
      expect(data).toEqual(mockForecast);
    });
    const req = httpMock.expectOne('/api/v1/forecast/week?latitude=51.5&longitude=-0.1&units=metric');
    expect(req.request.method).toBe('GET');
    req.flush(mockForecast);
  });

  it('should map backend response to frontend model correctly', () => {
    const backendResponse = {
      latitude: 51.5,
      longitude: -0.12,
      units: 'celsius',
      forecast: [
        {
          day: '2025-07-24',
          weatherCode: 61,
          temperature: { max: 20.8, min: 17.0 },
          precipitationChance: 25.0
        },
        {
          day: '2025-07-25',
          weatherCode: 3,
          temperature: { max: 27.1, min: 16.3 },
          precipitationChance: 1.0
        }
      ]
    };
    const expected: ForecastResponse = {
      latitude: 51.5,
      longitude: -0.12,
      units: 'metric',
      forecast: [
        {
          date: '2025-07-24',
          weather_code: 61,
          temperature: { max: 20.8, min: 17.0 },
          precipitationProbability: 25.0
        },
        {
          date: '2025-07-25',
          weather_code: 3,
          temperature: { max: 27.1, min: 16.3 },
          precipitationProbability: 1.0
        }
      ]
    };
    service.get7DayForecast(51.5, -0.12, 'metric').subscribe(data => {
      expect(data).toEqual(expected);
    });
    const req = httpMock.expectOne('/api/v1/forecast/week?latitude=51.5&longitude=-0.12&units=metric');
    expect(req.request.method).toBe('GET');
    req.flush(backendResponse);
  });

  it('should handle API errors', () => {
    service.get7DayForecast(0, 0, 'metric').subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe('Forecast fetch failed');
      }
    });
    const req = httpMock.expectOne('/api/v1/forecast/week?latitude=0&longitude=0&units=metric');
    req.flush({ message: 'Forecast fetch failed' }, { status: 500, statusText: 'Server Error' });
  });
});
