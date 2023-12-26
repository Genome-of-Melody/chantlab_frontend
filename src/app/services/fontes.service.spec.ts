import { TestBed } from '@angular/core/testing';
import { FontesService } from './fontes.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FontesService', () => {
  let service: FontesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(FontesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
