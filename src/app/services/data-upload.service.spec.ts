import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatasetManagementService } from './dataset-management.service';
import { MatDialog } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('DataUploadService', () => {
  let service: DatasetManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: MatDialog, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(DatasetManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
