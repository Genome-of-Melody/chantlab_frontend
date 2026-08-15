import { TestBed } from '@angular/core/testing';
import { ChantExportService } from './chant-export.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ChantExportService', () => {
  let service: ChantExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(ChantExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
