import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatasetManagementService } from './dataset-management.service';
import { MatDialog } from '@angular/material/dialog';

describe('DataUploadService', () => {
  let service: DatasetManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: MatDialog, useValue: {}},
      ]
    });
    service = TestBed.inject(DatasetManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
