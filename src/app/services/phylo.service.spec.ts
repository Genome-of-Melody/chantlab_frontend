import { TestBed } from '@angular/core/testing';

import { PhyloService } from './phylo.service';

describe('PhyloService', () => {
  let service: PhyloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhyloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
