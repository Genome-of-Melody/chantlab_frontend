import { TestBed } from '@angular/core/testing';
import { ChantExportService } from './chant-export.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChantExportService', () => {
  let service: ChantExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ChantExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
