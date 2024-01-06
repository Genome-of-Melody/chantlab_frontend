import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistanceMatrixComponent } from './distance-matrix.component';
import { MatCardModule } from '@angular/material/card'

describe('DistanceMatrixComponent', () => {
  let component: DistanceMatrixComponent;
  let fixture: ComponentFixture<DistanceMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistanceMatrixComponent ],
      imports: [ MatCardModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceMatrixComponent);
    component = fixture.componentInstance;
    component.names = ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0"];
    component.allDistances = new Map([
      ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", new Map([
        ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", 0]
      ])]
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
