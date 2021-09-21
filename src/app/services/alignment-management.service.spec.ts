import { TestBed } from '@angular/core/testing';

import { AlignmentManagementService } from './alignment-management.service';

describe('AlignmentManagementService', () => {
  let service: AlignmentManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlignmentManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
