import { TestBed } from '@angular/core/testing';

import { SelectedDataSourcesService } from './selected-data-sources.service';

describe('DataSourceService', () => {
  let service: SelectedDataSourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedDataSourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
