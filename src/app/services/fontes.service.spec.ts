import { TestBed } from '@angular/core/testing';

import { FontesService } from './fontes.service';

describe('FontesService', () => {
  let service: FontesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
