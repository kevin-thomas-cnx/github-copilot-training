import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LocationService, LocationResult } from './services/location.service';
import { ForecastService } from './services/forecast.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let locationServiceSpy: jasmine.SpyObj<LocationService>;
  let forecastServiceSpy: jasmine.SpyObj<ForecastService>;

  beforeEach(async () => {
    locationServiceSpy = jasmine.createSpyObj('LocationService', ['searchLocations']);
    forecastServiceSpy = jasmine.createSpyObj('ForecastService', ['get7DayForecast']);
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: ForecastService, useValue: forecastServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Weather App'`, () => {
    expect(component.title).toEqual('Weather App');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    // The title is rendered inside the mat-toolbar span
    expect(compiled.querySelector('mat-toolbar span').textContent).toContain('Weather App');
  });

  it('should search and display locations', () => {
    const mockResults: LocationResult[] = [{ id: '1', name: 'London', latitude: 51.5, longitude: -0.1 }];
    locationServiceSpy.searchLocations.and.returnValue(of(mockResults));
    component.onSearch('London');
    expect(component.locations).toEqual(mockResults);
    expect(component.noResults).toBeFalse();
    expect(component.loading).toBeFalse();
  });

  it('should handle no search results', () => {
    locationServiceSpy.searchLocations.and.returnValue(of([]));
    component.onSearch('Nowhere');
    expect(component.locations).toEqual([]);
    expect(component.noResults).toBeTrue();
  });

  it('should handle search error', () => {
    locationServiceSpy.searchLocations.and.returnValue(throwError('API error'));
    component.onSearch('Error');
    expect(component.error).toBe('API error');
    expect(component.loading).toBeFalse();
  });

  it('should update selected location and reset units', () => {
    component.selectedUnits = 'imperial';
    component.onSelectLocation('loc1');
    expect(component.selectedLocationId).toBe('loc1');
    expect(component.selectedUnits).toBe('metric');
  });

  it('should update units on unit change', () => {
    component.selectedUnits = 'metric';
    component.onUnitsChange('imperial');
    expect(component.selectedUnits).toBe('imperial');
  });

  it('should render locations in the DOM after a successful search', () => {
    const mockResults: LocationResult[] = [{ id: '1', name: 'Boston', latitude: 42.36, longitude: -71.06 }];
    locationServiceSpy.searchLocations.and.returnValue(of(mockResults));
    // Simulate the search event as the child component would emit it
    component.onSearch('Boston');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.locations-list .loc-name').textContent).toContain('Boston');
  });
});
