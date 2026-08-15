import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantFetchComponent } from './chant-fetch.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ChantDetailsComponent } from '../chant-details/chant-details.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ChantFetchComponent', () => {
  let component: ChantFetchComponent;
  let fixture: ComponentFixture<ChantFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        ChantFetchComponent,
        ChantDetailsComponent
    ],
    imports: [RouterTestingModule,
        MatDialogModule],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
