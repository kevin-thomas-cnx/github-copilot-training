import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService]
    });
    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch locations from API', () => {
    const mockResults = [{ id: '1', name: 'London', latitude: 51.5, longitude: -0.1 }];
    service.searchLocations('London').subscribe(results => {
      expect(results).toEqual(mockResults);
    });
    const req = httpMock.expectOne('/api/v1/locations/search?query=London');
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
  });

  it('should handle API errors', () => {
    service.searchLocations('Nowhere').subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe('Location search failed');
      }
    });
    const req = httpMock.expectOne('/api/v1/locations/search?query=Nowhere');
    req.flush({ message: 'Location search failed' }, { status: 500, statusText: 'Server Error' });
  });

  it('should fetch weekly forecast from API', () => {
    const mockForecast = { latitude: 1, longitude: 2, units: 'metric', forecast: [] };
    service.getWeeklyForecast(1, 2, 'metric').subscribe(results => {
      expect(results).toEqual(mockForecast);
    });
    const req = httpMock.expectOne('/api/v1/forecast/week?latitude=1&longitude=2&units=metric');
    expect(req.request.method).toBe('GET');
    req.flush(mockForecast);
  });

  it('should handle weekly forecast API errors', () => {
    service.getWeeklyForecast(1, 2, 'imperial').subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe('Weekly forecast failed');
      }
    });
    const req = httpMock.expectOne('/api/v1/forecast/week?latitude=1&longitude=2&units=imperial');
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  it('should fetch hourly forecast from API', () => {
    const mockHourly = { hourly: [] };
    service.getHourlyForecast(10, 20).subscribe(results => {
      expect(results).toEqual(mockHourly);
    });
    const req = httpMock.expectOne('/api/v1/forecast/hourly?lat=10&lon=20');
    expect(req.request.method).toBe('GET');
    req.flush(mockHourly);
  });

  it('should handle hourly forecast API errors', () => {
    service.getHourlyForecast(10, 20).subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe('Hourly forecast failed');
      }
    });
    const req = httpMock.expectOne('/api/v1/forecast/hourly?lat=10&lon=20');
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });
});
