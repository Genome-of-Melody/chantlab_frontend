import { TestBed } from '@angular/core/testing';
import { FontesService } from './fontes.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('FontesService', () => {
  let service: FontesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(FontesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
