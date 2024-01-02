import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CsvTranslateService } from './csv-translate.service';

describe('CsvTranslateService', () => {
  let service: CsvTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CsvTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
