import { TestBed } from '@angular/core/testing';
import { ChantService } from './chant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChantService', () => {
  let service: ChantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ChantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
