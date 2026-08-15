import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignedPageComponent } from './aligned-page.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
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
        { provide: MatDialog, useValue: {} },
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
});
