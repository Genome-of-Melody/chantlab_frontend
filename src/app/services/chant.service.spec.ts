import { TestBed } from '@angular/core/testing';
import { ChantService } from './chant.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ChantService', () => {
  let service: ChantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(ChantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
