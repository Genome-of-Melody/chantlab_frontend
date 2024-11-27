import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhylogenyNotSupportedDialogComponent } from './phylogeny-not-supported-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('PhylogenyNotSupportedDialogComponent', () => {
  let component: PhylogenyNotSupportedDialogComponent;
  let fixture: ComponentFixture<PhylogenyNotSupportedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ PhylogenyNotSupportedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogenyNotSupportedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
