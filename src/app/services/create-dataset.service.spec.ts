import { TestBed } from '@angular/core/testing';
import { CreateDatasetService } from './create-dataset.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('CreateDatasetService', () => {
  let service: CreateDatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: MatDialog, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(CreateDatasetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
