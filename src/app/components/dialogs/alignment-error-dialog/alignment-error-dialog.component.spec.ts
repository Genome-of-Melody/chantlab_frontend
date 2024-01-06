import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignmentErrorDialogComponent } from './alignment-error-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('AlignmentErrorDialogComponent', () => {
  let component: AlignmentErrorDialogComponent;
  let fixture: ComponentFixture<AlignmentErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ AlignmentErrorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignmentErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
