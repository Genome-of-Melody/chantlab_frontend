import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataSourceListService } from './data-source-list.service';

describe('DataSourceListService', () => {
  let service: DataSourceListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DataSourceListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
