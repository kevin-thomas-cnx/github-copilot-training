import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForecastGridComponent } from './forecast-grid.component';
import { ForecastService } from '../../services/forecast.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ForecastGridComponent', () => {
  let component: ForecastGridComponent;
  let fixture: ComponentFixture<ForecastGridComponent>;
  let forecastServiceSpy: jasmine.SpyObj<ForecastService>;

  beforeEach(async () => {
    forecastServiceSpy = jasmine.createSpyObj('ForecastService', ['get7DayForecast']);
    await TestBed.configureTestingModule({
      declarations: [ ForecastGridComponent ],
      providers: [ { provide: ForecastService, useValue: forecastServiceSpy } ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should show error message when fetchError is set', () => {
    component.fetchError = 'API error';
    component.isLoading = false;
    fixture.detectChanges();
    const errorEl = fixture.debugElement.query(By.css('mat-error'));
    expect(errorEl.nativeElement.textContent).toContain('API error');
  });

  it('should show empty state if no forecast days', () => {
    component.forecast = { latitude: 0, longitude: 0, units: 'metric', forecast: [] };
    component.isLoading = false;
    fixture.detectChanges();
    const emptyEl = fixture.debugElement.query(By.css('.no-forecast'));
    expect(emptyEl.nativeElement.textContent).toContain('No forecast data available');
  });

  it('should display forecast days when data is present', () => {
    component.forecast = {
      latitude: 0,
      longitude: 0,
      units: 'metric',
      forecast: [
        {
          date: '2025-06-28',
          weather_code: 0,
          temperature: { max: 25, min: 15 }
        }
      ]
    };
    component.isLoading = false;
    fixture.detectChanges();
    const dayEls = fixture.debugElement.queryAll(By.css('.forecast-day'));
    expect(dayEls.length).toBe(1);
    expect(dayEls[0].nativeElement.textContent).toContain('Sunny');
  });

  it('should fetch forecast on latitude/longitude change', () => {
    forecastServiceSpy.get7DayForecast.and.returnValue(of({ latitude: 0, longitude: 0, units: 'metric', forecast: [] }));
    component.latitude = 10;
    component.longitude = 20;
    component.units = 'metric';
    component.ngOnChanges({ latitude: { currentValue: 10, previousValue: null, firstChange: true, isFirstChange: () => true }, longitude: { currentValue: 20, previousValue: null, firstChange: true, isFirstChange: () => true } });
    expect(forecastServiceSpy.get7DayForecast).toHaveBeenCalledWith(10, 20, 'metric');
  });

  it('should handle forecast fetch error', () => {
    forecastServiceSpy.get7DayForecast.and.returnValue(throwError('API error'));
    component.latitude = 0;
    component.longitude = 0;
    component.units = 'metric';
    component.ngOnChanges({ latitude: { currentValue: 0, previousValue: null, firstChange: true, isFirstChange: () => true }, longitude: { currentValue: 0, previousValue: null, firstChange: true, isFirstChange: () => true } });
    expect(component.fetchError).toBe('API error');
  });
});
