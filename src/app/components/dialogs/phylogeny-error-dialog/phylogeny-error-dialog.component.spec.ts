import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhylogenyErrorDialogComponent } from './phylogeny-error-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('AlignmentErrorDialogComponent', () => {
  let component: PhylogenyErrorDialogComponent;
  let fixture: ComponentFixture<PhylogenyErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ PhylogenyErrorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogenyErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
