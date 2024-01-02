import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhylogeneticTreeComponent } from './phylogenetic-tree.component';
import { MatCardModule } from '@angular/material/card';

describe('PhylogeneticTreeComponent', () => {
  let component: PhylogeneticTreeComponent;
  let fixture: ComponentFixture<PhylogeneticTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatCardModule ],
      declarations: [ PhylogeneticTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogeneticTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
