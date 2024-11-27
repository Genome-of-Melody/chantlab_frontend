import { TestBed } from '@angular/core/testing';

import { ChantListService } from './chant-list.service'

describe('ChantListService', () => {
  let service: ChantListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChantListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
