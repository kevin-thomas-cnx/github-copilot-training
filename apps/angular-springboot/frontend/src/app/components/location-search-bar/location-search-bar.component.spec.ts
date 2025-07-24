import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LocationSearchBarComponent } from './location-search-bar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LocationSearchBarComponent', () => {
  let component: LocationSearchBarComponent;
  let fixture: ComponentFixture<LocationSearchBarComponent>;
  let searchSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationSearchBarComponent ],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSearchBarComponent);
    component = fixture.componentInstance;
    searchSpy = spyOn(component.search, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search event on submit', () => {
    component.searchQuery = 'London';
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    expect(searchSpy).toHaveBeenCalledWith('London');
  });

  it('should disable submit button when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(btn.nativeElement.disabled).toBeTrue();
  });

  it('should show error message when error is set', () => {
    component.error = 'API error';
    fixture.detectChanges();
    const errorEl = fixture.debugElement.query(By.css('mat-error'));
    expect(errorEl.nativeElement.textContent).toContain('API error');
  });

  it('should not emit search if query is empty', () => {
    component.searchQuery = '   ';
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    expect(searchSpy).not.toHaveBeenCalled();
  });
});
