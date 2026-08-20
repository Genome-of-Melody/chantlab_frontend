import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignedPageComponent } from './aligned-page.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('AlignedPageComponent', () => {
  let component: AlignedPageComponent;
  let fixture: ComponentFixture<AlignedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AlignedPageComponent],
    imports: [RouterTestingModule,
        MatProgressSpinnerModule],
    providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps alignment warnings as a dismissible summary instead of a blocking dialog', () => {
    component.warningIncluded = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      label: `Chant ${i + 1}`
    }));
    component.warningOmitted = [{ id: 99, label: 'Left out' }];
    component.warningDetailsOpen = true;

    expect(component.showAlignmentWarning).toBeTrue();
    expect(component.visibleIncluded.length).toBe(40);
    expect(component.hiddenIncludedCount).toBe(10);

    component.dismissAlignmentWarning();

    expect(component.showAlignmentWarning).toBeFalse();
    expect(component.warningDetailsOpen).toBeFalse();
  });
});
