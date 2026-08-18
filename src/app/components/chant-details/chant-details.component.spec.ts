import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ChantDetailsComponent } from './chant-details.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ChantDetailsComponent', () => {
  let component: ChantDetailsComponent;
  let fixture: ComponentFixture<ChantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChantDetailsComponent],
    imports: [RouterModule.forRoot([])],
    providers: [
        { provide: MatDialog, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
