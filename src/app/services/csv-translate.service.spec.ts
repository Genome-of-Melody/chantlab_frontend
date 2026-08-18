import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CsvTranslateService } from './csv-translate.service';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('CsvTranslateService', () => {
  let service: CsvTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(CsvTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
