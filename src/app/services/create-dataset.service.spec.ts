import { TestBed } from '@angular/core/testing';
import { CreateDatasetService } from './create-dataset.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

describe('CreateDatasetService', () => {
  let service: CreateDatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {provide: MatDialog, useValue: {}}
      ]
    });
    service = TestBed.inject(CreateDatasetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
