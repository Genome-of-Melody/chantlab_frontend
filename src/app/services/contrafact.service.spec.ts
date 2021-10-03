import { TestBed } from '@angular/core/testing';

import { ContrafactService } from './contrafact.service';

describe('ContrafactService', () => {
  let service: ContrafactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContrafactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
