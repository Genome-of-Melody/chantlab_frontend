import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourceSelectionSavedDialogComponent } from './source-selection-saved-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('SourceSelectionSavedDialogComponent', () => {
  let component: SourceSelectionSavedDialogComponent;
  let fixture: ComponentFixture<SourceSelectionSavedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ SourceSelectionSavedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceSelectionSavedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
