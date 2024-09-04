import { TestBed } from '@angular/core/testing';

import { PhylogenyService } from './phylogeny.service'

describe('PhylogenyService', () => {
  let service: PhylogenyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhylogenyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
