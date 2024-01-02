import { TestBed } from '@angular/core/testing';
import { CreateDatasetService } from './create-dataset.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';

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
