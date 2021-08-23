import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceMatrixComponent } from './distance-matrix.component';

describe('DistanceMatrixComponent', () => {
  let component: DistanceMatrixComponent;
  let fixture: ComponentFixture<DistanceMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistanceMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
